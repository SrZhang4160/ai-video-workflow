# Posting reminders

Light runs, no rendering. Review board: https://claude.ai/artifact/C2QhJCX4jV1JNNXhyrfMdb

1. Today's date in America/New_York. The reminder says which series it is for (`rust`, `ai`, `sd` or `news`, see `series/schedule.json` → `reminders`). `ArtifactData get` collection `episodes`, doc_id = that date (Rust) or `<date>-ai` (AI) or `<date>-sd` (系统设计) or `<date>-news` (AI 快讯).
2. Which platforms this reminder covers:
   - Rust morning (weekdays 9:50): LinkedIn, posts 10:30
   - Rust evening (daily 18:40): 小红书, 抖音, TikTok, post 19:30 (小红书 review lags, so hit publish around 19:00)
   - AI morning (weekdays 7:20): LinkedIn, posts 8:00
   - AI midday (daily 11:20): 小红书, 抖音, TikTok, post 12:00 (hit 小红书 publish around 11:30)
   - 系统设计 noon (weekdays 12:00): LinkedIn, posts 12:30
   - 系统设计 evening (daily 20:20): 小红书, 抖音, TikTok, post 21:00 (hit 小红书 publish around 20:30)
   - AI 快讯 afternoon (daily 15:50): 小红书, 抖音, TikTok, post 16:30 (hit 小红书 publish around 16:00). No LinkedIn. Say 「AI 快讯 #N」 instead of 第N课, 「下午 4:30」 instead of 「今晚 19:30」, and 「3 个版本」 instead of 「4 个版本」. If the doc isn't built by then, news can't move to another day: say 「⚠️ 今天的快讯还没出片，回复「现在出片」立即生成，来不及就今天不发。」
   Skip platforms already marked in the doc's `posted`.
3. Final message (shown on the user's phone), Chinese, ≤ 3 lines. For the AI series say 「AI 第N课」 and use its times (12:00 / 8:00); 「今晚」 becomes 「中午」. For 系统设计 say 「系统设计第N课」 and use 「今晚 21:00」 / 「中午 12:30」:
   - status `built`: `今晚 19:30 发第N课「标题」→ 小红书 / 抖音 / TikTok。发之前在审核台再看一遍，复制文案、下载视频。` + board link (morning version names LinkedIn and 10:30).
   - Evening / midday version, when the doc has `quiz`: add one line `发完在评论区置顶：<quiz.answer_zh>`（TikTok / LinkedIn 用 answer_en）. This one line may make the message 4 lines.
   - status `draft` with `finals` present: `今天的第N课还没点通过，但 4 个版本已经做好了。去审核台看一遍，没问题就点通过然后发。`
   - status `draft` without finals / `changes` / `revising` / `voicing`: `⚠️ 今天的第N课还没出片。回复「现在出片」立即生成（会用到 token）。`
   - status `approved` (not built yet): `⚠️ 今天的第N课已通过但还没出片。回复「现在出片」立即生成。`
   - no doc: `今天没有排期的视频。`
   - everything already posted: say nothing beyond `今天的都发完了 ✓`.
4. Sunday evening (Rust reminder) only: also count next week's docs of all three lesson series still `draft` or `changes`, and add one line `下周还有 N 期待审核。`
