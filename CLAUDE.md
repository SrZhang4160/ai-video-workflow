# 每天1分钟，碎片时间学AI工程师：视频工作流

**New session? Read `HANDOFF.md` first** (user, rules, current state, next steps).

Series name (use exactly): **每天1分钟，碎片时间学AI工程师**. Hashtag form: #碎片时间学AI工程师. It is the account/series name, not an on-screen label.

A daily 1-minute teaching series. Same content on four platforms:

| platform | ratio | voice | captions | posts (ET) |
|---|---|---|---|---|
| 小红书 xhs | 3:4 | Chinese | zh + en | daily 19:30 |
| 抖音 douyin | 9:16 | Chinese | zh + en | daily 19:30 |
| TikTok | 9:16 | English | en | daily 19:30 |
| LinkedIn | 4:5 | English | en | Mon–Fri 10:30 |

Times and sources: `series/schedule.json`. The user publishes by hand; nothing here posts anywhere.

## The loop
1. **Friday ~1 AM ET**, `runbooks/weekly.md`: script next Monday–Sunday (7 episodes) from `series/curriculum.md`, review each with a fresh reviewer agent, push, and put the scripts on the review board (status 配音中).
1b. **The user's Mac** (`local/voice_job.sh`, launchd, every 20 min while awake) voices every new line in the user's cloned voice (CosyVoice3, Chinese and English) and pushes `voice/<lang>/sNN.ogg`. The AI voice is only a fallback when the Mac didn't get to it before the air date.
2. **Fri–Sun**, the user reviews on the board (https://claude.ai/artifact/C2QhJCX4jV1JNNXhyrfMdb): 通过, or 要修改 + a note.
3. **Every night ~2:50 and ~6:30 AM ET**, `runbooks/nightly.md` (the approval hook): voiced → preview; approved → render all four cuts + upload; changes → revise the script; new voice → re-render. Episodes airing today/tomorrow get built regardless, so a post day is never blocked.
4. **Reminders**: weekdays 9:50 (LinkedIn) and daily 18:40 (小红书 / 抖音 / TikTok) the user gets a push to re-check and post today's episode.

**All video generation runs only between 00:00 and 09:00 ET.**

## Layout
- `engine/`: `lesson.html` (scene engine, three ratios × two languages), `render.py` (frames + voice → mp4 + covers + contact sheets), `export.py` (voice scripts + board doc), `tts.py` (AI fallback voice), `setup.sh`.
- `episodes/<air date>/`: `episode.js`, `meta.json`, `voice/{zh,en}.txt` (what to say, one line per caption page), `voice/{zh,en}/sNN.ogg` + `manifest.json` (cloned voice, valid only while the line's hash matches) or a hand-recorded `sNN.wav`.
- `runbooks/`: `scenes.md` (how to write an episode; read before writing one), `weekly.md`, `nightly.md`.
- `agents/reviewer.md`: reviewer checklist. `series/`: curriculum and schedule.
- `local/`: Mac only. `install_voice_job.sh` (one-time), `voice_job.sh` (launchd job), `voice_daemon.py` (CosyVoice3 + `~/cosyvoice3/my_voice.wav`).
- `styles/whiteboard/`: hand-drawn (rough.js + Caveat) style for LinkedIn deep dives. `episodes/li-*`: deep dives (English only, `platforms` in meta.json).
- `build/`: render output, never committed.

## Rules
- Teach the viewer; never "what I learned". Accurate or cut.
- Never mention the user's employer (RELAI), its products, customers or numbers. Only general tech and the user's own practice.
- No "AI voice / made with AI" labels, no series slogans, no progress bars on screen.
- Never overwrite an episode the user approved without a reason in the board doc.

## Running on the user's Mac (local Claude Code)
CosyVoice runs here (`~/cosyvoice3/.venv/bin/python local/voice_daemon.py .`), so the session can voice, render and `git push`
directly. Scheduled tasks should require this computer. Setup notes are in `HANDOFF.md`.

## Manual commands
- "做下周的草稿" → run `runbooks/weekly.md` now (ignore the time guard; the user asked).
- "现在出片" → run `runbooks/nightly.md` now.
- Render one locally: `bash engine/setup.sh && python3 engine/render.py episodes/<id> [--only xhs]`.
