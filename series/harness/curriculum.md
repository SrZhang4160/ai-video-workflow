# Agent Harness 拆解（1–2 分钟一期，手绘白板）

Structure learned from @啊涛聊AI's 5-video series (order: Harness 全景 → 上下文 → Skill 与 Harness → Skill 加载 → MCP 与 Harness),
split into 1–2 minute episodes, in our own words and examples. Rules: `~/.claude/skills/explainer-series/SKILL.md` +
`~/.claude/skills/explainer-script/SKILL.md`. Analysis: `~/Desktop/AI/调研-啊涛聊AI手写讲解风格.md`.
Style: `styles/whiteboard/` (font Patrick Hand), zh voice = user's clone, en = native-sounding in the user's timbre.
Platforms: 小红书 (xhs 3:4 zh), 抖音 + 微信视频号 (douyin 9:16 zh), TikTok + Instagram (tiktok 9:16 en), X (linkedin 4:5 en cut).
Review board: own board (board/hx.html). Episode folders `episodes/hx-NN`, meta `"track": "hx"`.

Running example across the series: a travel-planning assistant ("帮我规划周末去波士顿") with tools 查天气 / 查景点 / 查路线.

| # | question (title) | 本质 line | introduces |
|---|---|---|---|
| 1 | Agent 和 Workflow 有什么区别？ | 谁决定下一步：workflow 是人提前写死，agent 是模型看结果再决定 | agent, workflow, ReAct loop |
| 2 | Harness 到底是什么？ | Agent ≈ 模型 + Harness + 工具/环境；harness 把模型的「想」变成可靠的「做」 | harness |
| 3 | Harness 由哪 6 块组成？ | 6 个模块，每块回答一个工程问题（会话/上下文/循环/工具/权限/状态） | the map of the series |
| 4 | 上下文的本质是什么？ | 模型没有记忆，每轮都要重发；上下文管理 = 决定每一轮给模型看什么 | context window, stateless API |
| 5 | 上下文里到底装了什么？ | 开局就给的（规则、工具说明、技能清单、环境…）+ 越来越长的（历史对话、工具结果）；压缩主要压后者 | system prompt, compaction |
| 6 | Skill 是什么？ | 一个文件夹 + SKILL.md（名称、描述、正文）；怎么写取决于 harness 怎么加载 | skill, SKILL.md |
| 7 | Skill 是怎么被加载的？ | 渐进式加载：开局只给名称和描述，用到才读全文；工程难点在重名、重复加载、压缩后补回 | progressive disclosure |
| 8 | MCP 是什么？ | 一套统一接口协议：Host / Client / Server；能力分工具、资源、提示模板 | MCP, host, client, server |
| 9 | MCP、Harness、Function Calling 什么关系？ | 模型只会产生 tool_call；harness 解析并执行；MCP 只是工具背后的一种接法 | function calling, tool_call |

## Part 2 · 让 agent 可靠（hx-10 起，planned 2026-11-13）

Source: the user's own engineering experience (`~/Desktop/NewJob/outputs/.../项目经历_STAR与Agent架构.xlsx`, STAR cases noted per episode),
retold as general agent-engineering knowledge.

**Privacy rules for Part 2 (check every script):**
- Never name RELAI, its CLI/optimizer, internal names (Harbor, relay, persona, stage names, file names), customers, or any experiment numbers (3/30, 30/30, 6/6, 55/60…).
- Don't reproduce a product stack combination (e.g. Temporal + Modal + PR Checks, Cloud Run + Firestore + E2B playground). Teach the principle; tools may be named only as generic examples.
- The optimizer's stage design (edit-only stage, must-read evidence gate) is product design: left out entirely.
- Lobster Army is the user's own open-source project: may be named, including its honest shortcomings (ep 17, 30).
- Same running example: the Boston travel assistant. Evaluation episodes use "改订酒店前要不要重新问用户" on the same assistant.

### Part 2a · 一轮循环里的可靠性（maps to ep 3: 上下文 / 工具 / 权限 / 循环）
| # | question (title) | 本质 line | introduces | source |
|---|---|---|---|---|
| 10 | 系统提示应该怎么组装？ | 提示是任务合同；文件内容和工具输出是数据，不是指令 | prompt layers, instruction vs data, prompt injection | arch CLI-1 |
| 11 | 上下文快满了，什么时候压、压掉什么？ | 约 80% 窗口、且一批工具调用完整时才压；保留开头和新消息；摘要不能升级成规则；原始历史另存 | compaction trigger, lossy summary | arch CLI-3 |
| 12 | 工具结果太长怎么办？ | 给模型摘要、目录和翻页工具，而不是整本书 | pagination, pointer, result size limit | arch CLI-3, Optimizer-2 (generic only) |
| 13 | 定义了工具，就等于能执行吗？ | 工具定义 ≠ 工具执行；权限由程序强制：准备 → 策略检查 → 执行或请求批准 | permission enforcement, approval | arch CLI-5 |
| 14 | 工具结果怎么回到模型？ | 每个 tool_call 有 ID，结果按 call_id 配对写回历史，模型才知道哪个结果对应哪个调用 | tool_call id, parallel tool calls | arch CLI-6 |
| 15 | 模型说"做完了"就算完成吗？ | 模型的 done 和程序验证通过是两种信号；没验证的结束要标成未验证 | validated completion | arch CLI-6 |
| 16 | 预算用完，agent 却开始改代码？ | 失败要带类型穿过每一层：可重试 / 可修复 / 该停下，走不同分支 | typed error, retryable vs repairable | STAR 01 |

### Part 2b · 崩溃、重试与恢复（maps to ep 3: 状态）
| # | question (title) | 本质 line | introduces | source |
|---|---|---|---|---|
| 17 | Agent 跑一半崩了，怎么接着跑？ | 在模型响应后、工具执行前、工具完成后存检查点；执行中断的动作先查状态，不盲目重做 | checkpoint, resume point, outcome unknown | arch CLI-7 |
| 18 | 有状态文件，就等于能恢复吗？ | 存下来 ≠ 能接着跑；Lobster Army 的 --resume 读了记录却从头 kickoff | checkpoint vs recovery | STAR 14 (Lobster) |
| 19 | 重试为什么会让 agent 把事做两遍？ | 用幂等键让重复请求只生效一次；外部副作用做不到严格 exactly-once | idempotency key, at-least-once | STAR 04 |
| 20 | 派发远程任务，崩在哪一步最危险？ | 登记 → 启动 → 保存任务 ID，每个空档都要能回答"做没做"；答不上就标不确定，不重发 | dispatch window, durable execution | STAR 04 |
| 21 | 同时跑 100 个 agent 任务，怎么管？ | 限并发、每项设截止时间；"取消""真正停下""清理"是三件事 | bounded concurrency, deadline, cancellation | STAR 04 |

### Part 2c · 评测：怎么知道 agent 真做对了
| # | question (title) | 本质 line | introduces | source |
|---|---|---|---|---|
| 22 | 只看 agent 最后一句话为什么不够？ | 最终状态对，过程也可能越权；要看整条轨迹 | trajectory eval, side effects, consent | STAR 02 |
| 23 | 什么交给代码判，什么交给 LLM 评审？ | 状态、顺序、授权用代码查；开放语言问题才交语义评审 | state vs semantic evaluator, LLM judge | STAR 02 |
| 24 | 开发集全过了，为什么还会退步？ | 改的时候用开发集，最后用冻结的独立评测；答案不能泄露给被测 agent | dev vs held-out, leakage | STAR 02 |
| 25 | "没评上分"能算 0 分吗？ | 失败、无法评分、评测器出错分开记 | unscored, evaluator error | STAR 02 |
| 26 | 怎么证明一次改进真的有效？ | 对照组 + 冻结候选 + 逐案例配对比较 + 原本通过的不能退步；单任务结果不外推（不报数字） | controlled comparison, paired, baseline-pass regression | STAR 03 |
| 27 | Agent 行为退步，怎么像单元测试一样卡在 PR 上？ | 评测结果绑定被测 commit；旧结果不能覆盖新提交 | commit provenance, stale result fencing | STAR 05 (generic only) |

### Part 2d · 多 Agent（Lobster Army，可公开）
| # | question (title) | 本质 line | introduces | source |
|---|---|---|---|---|
| 28 | 五个 agent 怎么分工才不跑偏？ | 一个共享的产品锚点 + 先分叉再汇合的依赖图 | DAG, fan-out/fan-in, anchor | STAR 13 |
| 29 | Agent 之间应该传什么？ | 完整报告存档，往下游只传符合 schema 的摘要 | handoff, context compression | STAR 13 |
| 30 | 模型输出的 JSON 坏了怎么办？ | 解析 → schema 校验 → 重试一次 → 规则提取，缺的标 N/A | structured output, fallback | STAR 14 |
| 31 | Schema 对了，内容就对吗？ | 结构对 ≠ 语义对；当心"检查失败也算通过"（fail-open），用自己项目当反例 | semantic gate, fail-open | STAR 14 |

### Optional extras (LinkedIn career story; not core)
- LLM 改完代码能编译就算完成吗？（Angular 迁移：语法迁移 vs 行为一致，STAR 08）
- 机器人动作也是一种工具调用（UR5，固定脚本 vs agent 规划，STAR 15）
- Held back, needs user decision: "浏览器里跑 agent，模型 key 放哪？"（scoped short-lived token, key stays server-side）— close to product design.

Suggested release order: 2a and 2c first (most general, best for LinkedIn), then 2b, then 2d.
