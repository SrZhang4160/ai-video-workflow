# AI 工程师系统课 · 课程表

Second daily series (starts 2026-11-09), same pipeline as Rust (`series/curriculum.md`). Episode folder / board doc id: `<date>-ai`; `meta.json` has `"track": "ai"`.
Posts daily 12:00 ET on 小红书 / 抖音 / TikTok, weekdays 08:00 on LinkedIn (`series/schedule.json`). One lesson = one 1-minute video.
The Friday batch takes the next 7 unchecked lessons in order. Mark `[x]` when drafted.
Rules: teach the viewer, one idea per video, accurate, no employer / company products / metrics. Public tools are fine.
Every lesson needs a comment quiz with one definite answer (see `runbooks/scenes.md`), so each line below names a concrete, quizzable idea.

Path: how a model works → calling it → prompting → RAG → agents → evals → production → security → open models → putting it together.
Lessons 21–52 from the old Rust list were moved here (marked ←old number).

## 0. 地图（第 1 周）
- [ ] 1. AI 工程师到底做什么：和算法工程师、后端有什么不同
- [ ] 2. 一张图看懂 AI 应用的技术栈：模型、提示、检索、工具、评测
- [ ] 3. 调用一次大模型，背后发生了什么

## 1. 大模型是怎么工作的（第 1–2 周）
- [ ] 4. 大模型只做一件事：预测下一个 token
- [ ] 5. token 是什么，为什么按 token 收费 ←21
- [ ] 6. 为什么模型数不清 strawberry 里有几个 r（分词的坑）
- [ ] 7. 注意力机制：一分钟的直觉版
- [ ] 8. 预训练、SFT、RLHF：模型是怎么“学乖”的
- [ ] 9. 上下文窗口：模型一次能看多少 ←22
- [ ] 10. 幻觉从哪来，为什么没法彻底消除
- [ ] 11. 推理模型：“先想再答”多花的是什么
- [ ] 12. 多模态：模型怎么“看”图片

## 2. 调用模型 API（第 2–3 周）
- [ ] 13. 消息格式：system / user / assistant ←24
- [ ] 14. 模型是无状态的：多轮对话其实每次都重发历史
- [ ] 15. temperature 和采样参数 ←23
- [ ] 16. max_tokens 和 stop_reason：回答为什么被截断
- [ ] 17. 流式输出是怎么实现的（SSE） ←25
- [ ] 18. 结构化输出：让模型稳定返回 JSON ←26
- [ ] 19. 429 限流：指数退避重试
- [ ] 20. 输入 token 和输出 token 价格为什么不一样
- [ ] 21. 大模型还是小模型：怎么选

## 3. 提示词与上下文工程（第 3–4 周）
- [ ] 22. 提示词的 5 个基本功 ←27
- [ ] 23. few-shot：给例子比讲道理管用
- [ ] 24. 用标签把提示词分块
- [ ] 25. 让模型先想再答：思维链
- [ ] 26. 长上下文的坑：中间的信息容易被忽略
- [ ] 27. 从提示词工程到上下文工程：放什么进窗口
- [ ] 28. 提示词也是代码：版本管理和回滚

## 4. RAG 与检索（第 4–5 周）
- [ ] 29. embedding：文字怎么变成向量 ←28
- [ ] 30. 余弦相似度：两段话有多像
- [ ] 31. RAG：先检索，再回答 ←29
- [ ] 32. 切块（chunking）：切多大合适
- [ ] 33. 向量数据库在做什么
- [ ] 34. 混合检索：关键词 + 向量
- [ ] 35. rerank：先粗排，再精排
- [ ] 36. RAG 答错了：是没检索到，还是没用好
- [ ] 37. 什么时候不需要 RAG

## 5. Agent（第 5–8 周）
- [ ] 38. agent = 循环 + 工具 ←30
- [ ] 39. 工具调用（function calling）的原理 ←31
- [ ] 40. 30 行代码手写一个工具循环 ←32
- [ ] 41. 工具描述怎么写，模型才会用对
- [ ] 42. workflow 和 agent：什么时候不该用 agent
- [ ] 43. ReAct：想一步，做一步
- [ ] 44. 规划：先列计划再执行
- [ ] 45. 上下文管理：截断和摘要 ←33
- [ ] 46. 记忆：短期和长期 ←34
- [ ] 47. MCP 是什么，解决什么问题 ←35
- [ ] 48. MCP 的三样东西：tools、resources、prompts
- [ ] 49. Skills：按需加载的说明书
- [ ] 50. Claude Code 插件和 hook 是怎么接进来的 ←36
- [ ] 51. 子 agent：什么时候该拆 ←37
- [ ] 52. 多 agent 协作的三种模式 ←38
- [ ] 53. 人在回路：哪些操作要先问人
- [ ] 54. computer use：让模型操作屏幕
- [ ] 55. coding agent 是怎么改代码的

## 6. 评测（第 8–10 周）
- [ ] 56. 为什么 agent 需要评测 ←39
- [ ] 57. 评测集怎么设计 ←40
- [ ] 58. 能用代码判分的，别用模型判
- [ ] 59. LLM 当裁判（LLM-as-judge） ←41
- [ ] 60. 两两比较：比打分更稳
- [ ] 61. 回归测试：修一个 bug，别弄坏三个 ←42
- [ ] 62. 评 agent：看结果还是看过程
- [ ] 63. 线下评测和线上指标
- [ ] 64. 评测驱动开发：先写评测，再改提示词
- [ ] 65. 自动优化提示词入门 ←44
- [ ] 66. 持续学习：让 agent 越用越好 ←45

## 7. 上线与性能（第 10–11 周）
- [ ] 67. 可观测性：trace 里看什么 ←43
- [ ] 68. agent 为什么慢：延迟从哪来 ←46
- [ ] 69. 首字延迟（TTFT）和总时长
- [ ] 70. prompt caching：省钱又省时间 ←47
- [ ] 71. 并行工具调用 ←48
- [ ] 72. 模型路由：简单问题用小模型 ←49
- [ ] 73. batch 接口：不急的任务半价跑
- [ ] 74. 成本优化的 4 个办法 ←50
- [ ] 75. 模型升级：换新模型前要测什么
- [ ] 76. 兜底：模型挂了怎么办

## 8. 安全（第 11–12 周）
- [ ] 77. prompt injection：最常见的攻击 ←51
- [ ] 78. 间接注入：网页和文件里藏的指令
- [ ] 79. 护栏（guardrails）怎么加 ←52
- [ ] 80. 工具权限：最小权限原则
- [ ] 81. 让模型跑代码：为什么要沙箱
- [ ] 82. 用户数据：哪些不该进提示词

## 9. 开源模型与微调（第 12–13 周）
- [ ] 83. 开源权重模型和 API 模型：怎么选
- [ ] 84. 在自己电脑上跑模型
- [ ] 85. 量化：模型为什么能变小
- [ ] 86. 提示词、RAG、微调：先试哪个
- [ ] 87. LoRA：只训练一小部分参数
- [ ] 88. 蒸馏：大模型教小模型

## 10. 串起来（第 13–14 周）
- [ ] 89. AI 产品的体验：流式、可打断、可撤销
- [ ] 90. 系统设计题：设计一个客服机器人
- [ ] 91. 系统设计题：设计一个代码审查 agent
- [ ] 92. 做一个能放进简历的 AI 项目
- [ ] 93. 看懂模型发布：基准分数怎么读
- [ ] 94. AI 工程师的学习路线：一张图回顾全系列
