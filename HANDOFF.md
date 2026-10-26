# Project handoff: 每天1分钟，碎片时间学AI工程师

Written 2026-10-25 (Sun, ~5 PM ET) when the project moved from a cloud Claude session to a local Claude Code
session on the user's Mac. Read this, then `CLAUDE.md` (how the pipeline works). Times are America/New_York.

## The user
Shuran (srzhang@jhu.edu, GitHub `SrZhang4160`). Robotics grad, now a full-stack software engineer one month into an
AI-agent startup. Goal: grow as an AI engineer and build a learn-in-public channel, lowest cost first, automated with AI.
Talks in Chinese and English, often by voice; prefers short, direct answers.

## What we're making
A daily 1-minute teaching video, same content on four platforms (details and posting times in `CLAUDE.md` /
`series/schedule.json`): 小红书 3:4 and 抖音 9:16 in Chinese with zh+en captions (daily 19:30 ET, audience = North
American Chinese), TikTok 9:16 and LinkedIn 4:5 in English (TikTok daily 19:30, LinkedIn weekdays 10:30).
Plus occasional **LinkedIn deep dives** (English only) in the hand-drawn whiteboard style (`styles/whiteboard/`).

## The user's rules (all of these were stated explicitly; do not drift)
- Videos **teach the viewer**. Never "what I learned this week". One idea per video. Accurate or cut.
- **No company promotion**: never mention the employer (RELAI), its site, products, customers, metrics or internal
  designs. Work notes the user shares get generalized to public knowledge + public sources.
- No on-screen "AI voice / made with AI" labels, no series slogan line, **no progress bar**.
- Series name: **每天1分钟，碎片时间学AI工程师** (hashtag #碎片时间学AI工程师). Account/caption level only, not on screen.
- **Show the script/plan before building** a new video; wait for an OK. When asked for a summary first, do not implement.
- All audio in **the user's own cloned voice** (CosyVoice3), Chinese and English. AI voice only as a last-resort fallback.
- English videos: **slower** pacing so viewers can digest; state the problem clearly in the title; lively visuals.
- Deep dives: describe the problem well first, then solutions; use the sketchy whiteboard style.
- **Video-generation work (token-heavy) runs 00:00–09:00 ET**, except when the user asks for something now, and except
  board reviews: once the user taps 通过 or submits 要修改, act right away (changed 2026-10-26; review-watch task).
- Weekly batch: **every Friday** draft the next Mon–Sun (7 episodes); user reviews Fri–Sun on the review board.
- 小红书: mark AI-generated content under 高级选项 → 自主声明; no off-site links or "follow me elsewhere" lines.

## Where things live
| What | Where |
|---|---|
| This repo | to be pushed to `github.com/SrZhang4160/ai-video-workflow` (private, empty as of handoff) |
| Review board (审核台) | https://claude.ai/artifact/C2QhJCX4jV1JNNXhyrfMdb (db collection `episodes`, doc id = air date; `config/schedule`) |
| CosyVoice3 (voice clone) | `~/Desktop/AI/cosyvoice3` (`say.sh`, `.venv`, `my_voice.wav/.txt` = 6 s Chinese sample). `local/install_voice_job.sh` moves it to `~/cosyvoice3` |
| Temp voicing folder | `~/Desktop/AI/lesson-today/` (`run.sh` voices `episodes/<date>/voice/*.txt` there); retire once this repo is the voice job's home |
| 12-week study plan (Claude Doc) | https://claude.ai/code/artifact/81f0bea2-9fec-4d42-afa2-4fb4cfcb94b4 |
| Older video workflow doc | https://claude.ai/artifact/4nUwSSX2yu9nbRfprRH8b4 |
| Older outputs (rust-why, continual-learning LinkedIn video, covers) | `~/Desktop/video-workflow/output/` |

## Review board data model (`episodes/<date>` doc)
`date, lesson, topic_zh/en, title_zh/en, platforms, script:[{zh,en}], captions:{xhs,douyin,tiktok,linkedin}`,
`status` (voicing → draft → approved → built → posted; also changes/revising), `feedback`, `feedback_log`,
`review_notes`, `draft:{video,cover,seconds,asset_ids}`, `finals:{<platform>:{video,cover,seconds,asset_ids}}`,
`voice` (clone/ai/mixed), `voice_sig`, `posted:{<platform>:true}`. Videos are artifact assets (`/_blob/<id>`), uploaded
with the Artifact tool (`asset: true`); delete superseded assets. Write docs with ArtifactData pinned to `if_version`.
The board page itself is `board/index.html` (republish to the same URL when changed).

## State at handoff
- **10/24 第 1 课 Rust 知识全景**: built in cloned voice (zh+en), on the board; 小红书 posted (marked). 抖音/TikTok status unknown.
- **10/25 第 2 课 变量 let/mut/shadowing** (`episodes/2026-10-25`): written, rendered with placeholder AI voice, sent to the
  user for review. NOT yet on the board, NOT yet voiced. Voice lines are in `~/Desktop/AI/lesson-today/episodes/2026-10-25/`.
- **LinkedIn deep dive** (`episodes/li-deploy-background-jobs/`): plan approved (`PLAN.md`); must be rebuilt in whiteboard style.
- English voice sample: requested, not yet recorded (see below).
- GitHub: repo exists but is empty; the cloud session couldn't push (Claude GitHub app not installed on the personal account).
  From the Mac, push with the user's own git login.
- No scheduled tasks exist yet.

## Next steps, in order
1. **Tonight (10/25, post 19:30)**: get the user's OK on lesson 2's script; voice it (`bash ~/Desktop/AI/lesson-today/run.sh`, or
   `local/voice_daemon.py` once the repo is the voice home); copy the clips into `episodes/2026-10-25/voice/`;
   `python3 engine/render.py episodes/2026-10-25`; upload 4 videos + 4 covers; create the board doc (status `built` or `draft`
   with finals); mark lesson 2 `[x]` in `series/curriculum.md`.
2. **Push**: `git remote add origin git@github.com:SrZhang4160/ai-video-workflow.git` (or https) and `git push -u origin main`.
3. **Fill 10/26–11/1** (lessons 3–9): the first Friday batch (10/30) only covers 11/2–11/8. Run `runbooks/weekly.md` once now (or in
   tonight's 0–9 AM window) for the open dates; the user reviews the scripts.
4. **English voice sample**: user records (≈10 s, read exactly): *"Hi, I'm Shuran. I'm a software engineer, and in this series I
   explain one AI engineering idea in about a minute. Today we're looking at Rust, and why its compiler catches memory bugs before
   your code ever runs."* → clean (ffmpeg: highpass, afftdn, loudnorm −16 LUFS, trim) → save as `~/cosyvoice3/my_voice_en.wav` +
   `my_voice_en.txt` (exact transcript). The voice daemon then re-voices upcoming English automatically.
5. **Voice job**: `bash local/install_voice_job.sh` (repo must live outside Desktop/Documents/Downloads, e.g. `~/ai-video-workflow`;
   needs `git push` working on the Mac).
6. **Scheduled tasks** (from the local session, "require this computer" so they run on the Mac with CosyVoice + git):
   weekly batch Fri ~1:10 AM ET (`runbooks/weekly.md`); nightly ~2:50 and ~6:30 AM (`runbooks/nightly.md`);
   reminders weekdays 9:50 AM (LinkedIn) and daily 6:40 PM (小红书/抖音/TikTok) (`runbooks/remind.md`). Mac must be awake
   (plugged in, or `sudo pmset repeat wakeorpoweron MTWRFSU 00:55:00`).
7. **LinkedIn deep dive** in whiteboard style per `PLAN.md`; ask Monday vs Tuesday 10:30.

## Running locally on the Mac
- Render deps: `brew install ffmpeg node`, `pip3 install sherpa-onnx soundfile numpy playwright && python3 -m playwright install chromium`,
  then `bash engine/setup.sh` (fonts + AI fallback voice models in `~/.cache/lesson-tts`).
- Voice: `~/cosyvoice3/.venv/bin/python local/voice_daemon.py .` (loads the model once, ~25 s; then ~1.5–3× real time).
  One clip per caption page; `manifest.json` hashes keep clips in sync with the script; edits re-voice only changed lines.
- QA: `render.py` writes `build/<id>/sheet-<platform>.png` (one frame per scene); check it before uploading. For Chinese audio,
  a Paraformer ASR check (sherpa-onnx paraformer-zh) was used to confirm the clone reads the script (CER ≈ 2%).

## Lessons learned (avoid repeating)
- Kokoro/Melo Chinese TTS was rejected by the user as unnatural; the user's own voice (recorded or cloned) is the standard.
- macOS blocks launchd jobs from Desktop/Documents/Downloads (TCC): keep the repo and CosyVoice out of those for background jobs.
- Chinese caption pages ≤ 18 characters; English ≤ 70 characters; spell out symbols for the voice in `say_zh`/`say_en` (C++ → C加加).
- HTML collapses spaces: `code()` now keeps spaces inside string literals.
- English with the Chinese voice sample sounded "not like me": that's why the English sample is needed.
