# 碎片时间学 AI 工程 · 课程表

One lesson = one 1-minute video. The Friday batch takes the next 7 unchecked lessons in order.
Mark `[x]` when a lesson has been drafted (the batch does this). Reorder or add lines freely; the batch only reads this file.
If `notes/` has a fresh study note (last 7 days, not yet used), the batch may swap one lesson for a video on that note.

Rules for every lesson: teach the viewer (not "what I learned"), one idea per video, accurate, no company names / products / metrics.

## Rust（跟着学习计划第 1–4 周）
- [x] 1. Rust 知识全景：五块知识怎么搭（2026-10-26；用户可换成自己的录音）
- [ ] 2. 变量：let、mut 和 shadowing
- [ ] 3. 基本类型：整数、浮点、bool、char、元组、数组
- [ ] 4. 函数与表达式：最后一行不加分号就是返回值
- [ ] 5. 控制流：if 是表达式，loop / while / for
- [ ] 6. 所有权的三条规则
- [ ] 7. Move、Clone、Copy 有什么区别
- [ ] 8. 借用：& 和 &mut 的规则
- [ ] 9. String 和 &str：切片是什么
- [ ] 10. struct + impl：给数据加方法
- [ ] 11. enum + match：穷尽所有情况
- [ ] 12. Option：Rust 为什么没有 null
- [ ] 13. Result 和 ? 运算符：错误处理
- [ ] 14. Cargo：建项目、加依赖、跑测试
- [ ] 15. trait：定义共同行为
- [ ] 16. 泛型：一份代码，多种类型
- [ ] 17. 生命周期入门：'a 到底在说什么
- [ ] 18. 迭代器和闭包
- [ ] 19. 用 clap 写一个命令行工具
- [ ] 20. 用 Rust 调 HTTP API（reqwest + serde）

## 大模型基础（第 5 周）
- [ ] 21. token 是什么，为什么按 token 收费
- [ ] 22. 上下文窗口：模型一次能看多少
- [ ] 23. temperature 和采样参数
- [ ] 24. 消息格式：system / user / assistant
- [ ] 25. 流式输出是怎么实现的
- [ ] 26. 结构化输出：让模型稳定返回 JSON
- [ ] 27. 提示词的 5 个基本功
- [ ] 28. embedding：文字怎么变成向量
- [ ] 29. RAG：先检索，再回答

## Agent 原理（第 6–8 周）
- [ ] 30. agent = 循环 + 工具
- [ ] 31. 工具调用（function calling）的原理
- [ ] 32. 30 行代码手写一个工具循环
- [ ] 33. 上下文管理：截断和摘要
- [ ] 34. 记忆：短期和长期
- [ ] 35. MCP 是什么，解决什么问题
- [ ] 36. Claude Code 插件和 hook 是怎么接进来的
- [ ] 37. 子 agent：什么时候该拆
- [ ] 38. 多 agent 协作的三种模式

## 评测与优化（第 9–12 周）
- [ ] 39. 为什么 agent 需要评测
- [ ] 40. 评测集怎么设计
- [ ] 41. LLM 当裁判（LLM-as-judge）
- [ ] 42. 回归测试：修一个 bug，别弄坏三个
- [ ] 43. 可观测性：trace 里看什么
- [ ] 44. 自动优化提示词入门
- [ ] 45. 持续学习：让 agent 越用越好
- [ ] 46. agent 为什么慢：延迟从哪来
- [ ] 47. prompt caching：省钱又省时间
- [ ] 48. 并行工具调用
- [ ] 49. 模型路由：简单问题用小模型
- [ ] 50. 成本优化的 4 个办法
- [ ] 51. prompt injection：最常见的攻击
- [ ] 52. 护栏（guardrails）怎么加
