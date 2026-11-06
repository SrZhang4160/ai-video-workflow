# 每天1分钟，碎片时间学AI工程师：视频工作流

**New session? Read `HANDOFF.md` first** (user, rules, current state, next steps).

Series name (use exactly): **每天1分钟，碎片时间学AI工程师**. Hashtag form: #碎片时间学AI工程师. It is the account/series name, not an on-screen label.

Three daily 1-minute teaching series, same pipeline, same account (plus the daily AI 快讯 news series below):
- **Rust**: `series/curriculum.md`, episodes `episodes/<date>/`, posts at the times below.
- **AI 工程师系统课** (from 2026-11-09): `series/ai-engineer/curriculum.md`, episodes `episodes/<date>-ai/` (`meta.json` `"track": "ai"`, board doc id `<date>-ai`), posts daily 12:00 ET on 小红书 / 抖音 / TikTok and weekdays 08:00 on LinkedIn.
- **系统设计 · 《逆袭架构师》** (from 2026-11-02; a 2–3 min 红果短剧-style drama since 2026-11-04): `series/system-design/README.md` (format rules, read first), `curriculum.md`, `story.md`; episodes `episodes/<date>-sd/` (`meta.json` `"track": "sd"`, `"format": "drama"`). **Own review board**: https://claude.ai/artifact/HGq19vhF8JP5TSqmVysLyG (doc id `<date>-sd`); the main board ignores sd. Posts daily 21:00 ET on 小红书 / 抖音 / TikTok and weekdays 12:30 on LinkedIn.

Each episode goes to five platforms (Rust times shown; AI and 系统设计 times are in `series/schedule.json`):

| platform | ratio | voice | captions | posts (ET) |
|---|---|---|---|---|
| 小红书 xhs | 3:4 | Chinese | zh + en | daily 19:30 |
| 抖音 douyin | 9:16 | Chinese | zh + en | daily 19:30 |
| TikTok | 9:16 | English | en | daily 19:30 |
| Instagram (Reels) | 9:16 | English | en | daily 19:30 (same as TikTok) — reuses the TikTok cut, cover and text; no separate render |
| LinkedIn | 4:5 | English | en | Mon–Fri 10:30 |

Times and sources: `series/schedule.json`. The user publishes by hand; nothing here posts anywhere.

## The loop
1. **Friday ~1 AM ET**, `runbooks/weekly.md`: script next Monday–Sunday (7 episodes per series: Rust, AI, 系统设计 = 21 total) from each series' curriculum, review each with a fresh reviewer agent, push, and put the scripts on the review board (status 配音中).
1b. **The user's Mac** (`local/voice_job.sh`, launchd, every 20 min while awake) voices every new line in the user's cloned voice (CosyVoice3, Chinese and English) and pushes `voice/<lang>/sNN.ogg`. The AI voice is only a fallback when the Mac didn't get to it before the air date.
2. **Fri–Sun**, the user reviews on the board (https://claude.ai/artifact/C2QhJCX4jV1JNNXhyrfMdb; 系统设计 on its own board https://claude.ai/artifact/HGq19vhF8JP5TSqmVysLyG): 通过, or 要修改 + a note. Each series' board is `series/schedule.json` → `series.<id>.board` (default: the main board).
3. **Every night ~2:50 and ~6:30 AM ET**, `runbooks/nightly.md` (the approval hook): voiced → preview; approved → render all four cuts + upload; changes → revise the script; new voice → re-render. Episodes airing today/tomorrow get built regardless, so a post day is never blocked.
4. **Reminders**: Rust weekdays 9:50 (LinkedIn) and daily 18:40 (小红书 / 抖音 / TikTok); AI weekdays 7:20 (LinkedIn) and daily 11:20 (小红书 / 抖音 / TikTok); 系统设计 weekdays 12:00 (LinkedIn) and daily 20:20 (小红书 / 抖音 / TikTok). The user gets a push to re-check and post that series' episode.

**Scheduled generation runs between 00:00 and 09:00 ET. Exception: when the user submits a review on the board (通过 or 要修改), it is handled right away (review-watch task, every 10 min).**

## AI 快讯 (third series, daily news)
One AI-industry story a day, analyzed. Scripted every night ~00:40 ET for the same day by `runbooks/news-daily.md` (not the Friday batch), fact-checked by `agents/news-reviewer.md`, posts 16:30 ET on 小红书 / 抖音 / TikTok (no LinkedIn). Folders `episodes/<date>-news/`, `meta.json` `"track": "news"`. Rules and story picking: `series/news/README.md`; covered stories: `series/news/log.md`. Manual: 「做今天的快讯」 → run `runbooks/news-daily.md` now.

## Layout
- `engine/`: `lesson.html` (scene engine, three ratios × two languages), `render.py` (frames + voice → mp4 + covers + contact sheets), `export.py` (voice scripts + board doc), `tts.py` (AI fallback voice), `setup.sh`.
- `episodes/<air date>/`: `episode.js`, `meta.json`, `voice/{zh,en}.txt` (what to say, one line per caption page), `voice/{zh,en}/sNN.ogg` + `manifest.json` (cloned voice, valid only while the line's hash matches) or a hand-recorded `sNN.wav`.
- `runbooks/`: `scenes.md` (how to write an episode, incl. AI and 系统设计 rules; read before writing one), `weekly.md`, `nightly.md`.
- `agents/reviewer.md`: reviewer checklist. `series/`: curricula (`curriculum.md` Rust, `ai-engineer/curriculum.md` AI, `system-design/curriculum.md` 系统设计) and `schedule.json` (slots, reminders and the `series` table: id suffix, curriculum, save-folder label).
- `local/`: Mac only. `install_voice_job.sh` (one-time), `voice_job.sh` (launchd job), `voice_daemon.py` (CosyVoice3 + `~/cosyvoice3/my_voice.wav`).
- `styles/whiteboard/`: hand-drawn (rough.js + Caveat) style for LinkedIn deep dives. `episodes/li-*`: deep dives (English only, `platforms` in meta.json).
- `build/`: render output, never committed.

## Rules
- Chinese speaking rate: every line 305–330 字/分钟, evenly (`runbooks/pace.md`; enforced in `engine/render.py`, audit with `engine/pace.py`).
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
