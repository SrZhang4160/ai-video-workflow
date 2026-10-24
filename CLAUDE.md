# 碎片时间学 AI 工程：视频工作流

A daily 1-minute teaching series. Same content on four platforms:

| platform | ratio | voice | captions | posts (ET) |
|---|---|---|---|---|
| 小红书 xhs | 3:4 | Chinese | zh + en | daily 19:30 |
| 抖音 douyin | 9:16 | Chinese | zh + en | daily 19:30 |
| TikTok | 9:16 | English | en | daily 19:30 |
| LinkedIn | 4:5 | English | en | Mon–Fri 10:30 |

Times and sources: `series/schedule.json`. The user publishes by hand; nothing here posts anywhere.

## The loop
1. **Friday ~1 AM ET**, `runbooks/weekly.md`: draft next Monday–Sunday (7 episodes) from `series/curriculum.md`, review each with a fresh reviewer agent, render the 小红书 draft, and put everything on the review board.
2. **Fri–Sun**, the user reviews on the board (https://claude.ai/artifact/C2QhJCX4jV1JNNXhyrfMdb): 通过, or 要修改 + a note.
3. **Every night ~3 AM ET**, `runbooks/nightly.md` (the approval hook): approved → render all four cuts + upload; changes → revise and re-draft; new voice files → rebuild.
4. **Reminders**: weekdays 9:50 (LinkedIn) and daily 18:40 (小红书 / 抖音 / TikTok) the user gets a push to re-check and post today's episode.

**All video generation runs only between 00:00 and 09:00 ET.**

## Layout
- `engine/`: `lesson.html` (scene engine, three ratios × two languages), `render.py` (frames + voice → mp4 + covers + contact sheets), `export.py` (voice scripts + board doc), `tts.py` (AI fallback voice), `setup.sh`.
- `episodes/<air date>/`: `episode.js`, `meta.json`, `voice/{zh,en}.txt` (what to say) and optional `voice/{zh,en}/sNN.wav` (real voice, one per scene; beats the AI voice).
- `runbooks/`: `scenes.md` (how to write an episode; read before writing one), `weekly.md`, `nightly.md`.
- `agents/reviewer.md`: reviewer checklist. `series/`: curriculum and schedule.
- `local/voice_week.sh`: Mac only, voices new episodes in the user's cloned voice (CosyVoice3) and pushes.
- `build/`: render output, never committed.

## Rules
- Teach the viewer; never "what I learned". Accurate or cut.
- Never mention the user's employer (RELAI), its products, customers or numbers. Only general tech and the user's own practice.
- No "AI voice / made with AI" labels, no series slogans, no progress bars on screen.
- Never overwrite an episode the user approved without a reason in the board doc.

## Manual commands
- "做下周的草稿" → run `runbooks/weekly.md` now (ignore the time guard; the user asked).
- "现在出片" → run `runbooks/nightly.md` now.
- Render one locally: `bash engine/setup.sh && python3 engine/render.py episodes/<id> [--only xhs]`.
