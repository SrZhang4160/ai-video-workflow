# Posting reminders

Light runs, no rendering. Review board: https://claude.ai/artifact/C2QhJCX4jV1JNNXhyrfMdb

1. Today's date in America/New_York → `ArtifactData get` collection `episodes`, doc_id = that date.
2. Which platforms this reminder covers:
   - morning (weekdays 9:50): LinkedIn, posts 10:30
   - evening (daily 18:40): 小红书, 抖音, TikTok, post 19:30 (小红书 review lags, so hit publish around 19:00)
   Skip platforms already marked in the doc's `posted`.
3. Final message (shown on the user's phone), Chinese, ≤ 3 lines:
   - status `built`: `今晚 19:30 发第N课「标题」→ 小红书 / 抖音 / TikTok。发之前在审核台再看一遍，复制文案、下载视频。` + board link (morning version names LinkedIn and 10:30).
   - status `draft` with `finals` present: `今天的第N课还没点通过，但 4 个版本已经做好了。去审核台看一遍，没问题就点通过然后发。`
   - status `draft` without finals / `changes` / `revising` / `voicing`: `⚠️ 今天的第N课还没出片。回复「现在出片」立即生成（会用到 token）。`
   - status `approved` (not built yet): `⚠️ 今天的第N课已通过但还没出片。回复「现在出片」立即生成。`
   - no doc: `今天没有排期的视频。`
   - everything already posted: say nothing beyond `今天的都发完了 ✓`.
4. Sunday evening only: also count next week's docs still `draft` or `changes`, and add one line `下周还有 N 期待审核。`
