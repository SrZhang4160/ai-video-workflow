# 系统设计 · 课程表

Fourth daily series (starts 2026-11-02), same pipeline as Rust (`series/curriculum.md`). Episode folder / board doc id: `<date>-sd`; `meta.json` has `"track": "sd"`.
Posts daily 21:00 ET on 小红书 / 抖音 / TikTok, weekdays 12:30 on LinkedIn (`series/schedule.json`). One lesson = one 1-minute video.
The Friday batch takes the next 7 unchecked lessons in order. Mark `[x]` when drafted.
Rules: teach the viewer, one idea per video, accurate, no employer / company products / metrics. Public systems and papers are fine (Redis, Kafka, DynamoDB, "how Twitter's timeline works" from public talks).
Every lesson needs a comment quiz with one definite answer (see `runbooks/scenes.md`), so each line below names a concrete, quizzable idea.

Path: the map → estimating → building blocks (network, storage, cache, scaling, async) → consistency → reliability → classic interview designs → AI-system designs → how to answer in an interview.
AI-specific designs (客服机器人, 代码审查 agent) are in the AI series (`series/ai-engineer/curriculum.md` 90–91); this list does not repeat them.

## 0. 地图（第 1 周）
- [ ] 1. 系统设计到底在考什么：一张图看懂从一台机器到百万用户
- [ ] 2. 功能需求和非功能需求：先问清楚再画图
- [ ] 3. 估算入门：QPS 怎么算（日活 × 次数 ÷ 86400）
- [ ] 4. 存储估算：一年要多少硬盘
- [ ] 5. 延迟数字：内存、SSD、网络、跨洲，差几个数量级
- [ ] 6. 延迟和吞吐量：不是一回事
- [ ] 7. 可用性的几个 9：99.9% 一年能挂多久

## 1. 网络与入口（第 2 周）
- [ ] 8. 输入网址到看到页面：DNS、TCP、HTTP 一条链
- [ ] 9. 负载均衡：轮询、最少连接、哈希
- [ ] 10. 四层和七层负载均衡有什么区别
- [ ] 11. 反向代理和 API 网关
- [ ] 12. CDN：静态文件为什么要放边缘
- [ ] 13. REST、gRPC、GraphQL：怎么选
- [ ] 14. 轮询、长轮询、WebSocket、SSE

## 2. 扩展（第 3 周）
- [ ] 15. 垂直扩展和水平扩展
- [ ] 16. 无状态服务：为什么 session 不能放在本机
- [ ] 17. 自动扩缩容：按什么指标扩

## 3. 存储（第 3–4 周）
- [ ] 18. SQL 还是 NoSQL：看访问模式选
- [ ] 19. 索引：为什么查询从秒级变成毫秒级
- [ ] 20. 事务和 ACID：转账为什么不会少钱
- [ ] 21. 读写分离：主从复制
- [ ] 22. 复制延迟：刚发的帖子为什么自己看不到
- [ ] 23. 分片：数据太多一台放不下
- [ ] 24. 分片键怎么选：热点问题
- [ ] 25. 一致性哈希：加机器只搬一小部分数据
- [ ] 26. 对象存储：图片和视频放哪
- [ ] 27. 键值、文档、列式、图数据库：各管什么

## 4. 缓存（第 4–5 周）
- [ ] 28. 缓存为什么快，放在哪几层
- [ ] 29. Cache-aside、write-through、write-back
- [ ] 30. 淘汰策略：LRU 和 LFU
- [ ] 31. 缓存和数据库不一致：先删缓存还是先写库
- [ ] 32. 缓存穿透、击穿、雪崩
- [ ] 33. 热 key：一个 key 打爆一台机器

## 5. 异步与消息（第 5 周）
- [ ] 34. 消息队列：削峰、解耦、异步
- [ ] 35. 至少一次、至多一次、恰好一次
- [ ] 36. 幂等：重试为什么不会扣两次钱
- [ ] 37. Kafka 的分区和消费者组
- [ ] 38. 发布订阅和点对点队列
- [ ] 39. 后台任务和定时任务怎么设计

## 6. 一致性与分布式（第 6 周）
- [ ] 40. CAP：网络断了，选一致还是选可用
- [ ] 41. 强一致和最终一致
- [ ] 42. Quorum：N、W、R 怎么配
- [ ] 43. 主节点挂了：领导者选举
- [ ] 44. 分布式锁：为什么要加过期时间
- [ ] 45. 分布式事务：两阶段提交和 Saga
- [ ] 46. 分布式 ID：雪花算法

## 7. 可靠性（第 7 周）
- [ ] 47. 单点故障：怎么找，怎么消
- [ ] 48. 超时、重试、指数退避加抖动
- [ ] 49. 熔断器：下游挂了别跟着挂
- [ ] 50. 限流算法：令牌桶和漏桶
- [ ] 51. 降级：保核心功能
- [ ] 52. 监控三件套：指标、日志、链路追踪
- [ ] 53. 微服务还是单体：什么时候该拆

## 8. 经典设计题（第 8–11 周）
- [ ] 54. 设计短链接服务（TinyURL）
- [ ] 55. 设计限流器
- [ ] 56. 设计 Twitter 时间线：推模式还是拉模式
- [ ] 57. 设计聊天系统（微信 / WhatsApp）
- [ ] 58. 设计通知系统
- [ ] 59. 设计搜索自动补全
- [ ] 60. 设计网页爬虫
- [ ] 61. 设计视频网站（YouTube）：上传和转码
- [ ] 62. 设计文件同步（Dropbox）：分块上传
- [ ] 63. 设计打车（Uber）：附近的司机怎么找
- [ ] 64. 设计秒杀系统：超卖怎么防
- [ ] 65. 设计排行榜：Redis 有序集合
- [ ] 66. 设计分布式键值存储
- [ ] 67. 设计支付系统：钱不能错

## 9. AI 系统设计（第 11–12 周）
- [ ] 68. 设计一个大模型 API 网关：限流、路由、计费
- [ ] 69. 设计 RAG 服务：千万文档怎么检索
- [ ] 70. 设计 agent 的任务队列：长任务怎么跑
- [ ] 71. 语义缓存：相似问题直接返回答案

## 10. 面试怎么答（第 12 周）
- [ ] 72. 系统设计面试的 45 分钟怎么分配
- [ ] 73. 面试常见的 5 个坑
- [ ] 74. 一张图回顾全系列：系统设计知识地图
