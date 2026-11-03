# Nightly build: the approval hook

Runs twice a night (~2:50 and ~6:30 AM ET), and whenever the user says 「现在出片」. Each run is idempotent.
Review board: https://claude.ai/artifact/C2QhJCX4jV1JNNXhyrfMdb (db collection `episodes`, doc id = episode id: `<date>` for Rust, `<date>-ai` for the AI series, `<date>-sd` for 系统设计; the doc's `date` field is the air date).
Voice: the user's Mac voices every script line in the user's cloned voice and pushes `episodes/<id>/voice/<lang>/sNN.ogg` (local/voice_job.sh, every 20 min while the Mac is awake). `python3 engine/render.py episodes/<id> --status` prints `{"zh": [voiced, scenes], "en": [...]}`. "Near" below means the doc's `date` is today or tomorrow (ET). All series (Rust, AI, 系统设计, AI 快讯) go through every step the same way.

## 0. Guard and early exit
- **Review trigger** (started by the review-watch task, any time of day): there is work only if `~/Desktop/AI/recordings/` holds an audio file (section 0b), or a doc is `changes`, or `approved` with no `finals` yet, or `built` whose `saved_sig` differs from its `voice_sig` (approved but not saved to the videos folder yet; only section 5b runs for those). Ignore the time window for those; skip sections 2 and 4 (previews and re-renders of untouched episodes wait for the night). If nothing qualifies, stop with "nothing to do" right after the list, before `git pull` or setup.
- **Lock**: if `build/.lock` exists and is younger than 60 min, stop with "another run is working". Otherwise write the current time to it, and delete it when the run ends (also on failure).
- Otherwise (nightly schedule): only run 00:00–09:00 America/New_York; otherwise stop with "outside generation window".
- `ArtifactData list episodes`, then `git pull`. There is work if any doc is `changes`; or `voicing` / `approved`; or `draft` / `built` (nothing in `posted`) whose `voice_sig` differs from `git log -1 --format=%h -- episodes/<id>/voice/` (use "none" when empty). If there is no work, stop with "nothing to build" before any setup.
- Otherwise `bash engine/setup.sh`.

## 0b. Your recordings (any run, review trigger included)
Episodes whose `meta.json` has `"voice": "own"` (AI 快讯) are read by the user. The user drops a take into `~/Desktop/AI/recordings/`,
named `<id>.m4a` (Chinese, e.g. `2026-11-04-news.m4a`) or `<id>-en.m4a` (English; any audio extension works; `<id>-zh-s04,s07.m4a`
for re-takes of single lines). For each file there (not in `done/`):
1. `~/cosyvoice3/.venv/bin/python engine/own_voice.py episodes/<id> <file> --lang zh|en [--lines 4,7]` — cleans up the audio,
   finds each line with Whisper, cuts `voice/<lang>/sNN.wav`, and points the episode at the recording. `--fit 90` (zh) /
   `--fit 130` (en) if the take is slow.
2. zh: `engine/zh_check.py episodes/<id> --audio`. Lines it printed as "not found", and AUDIO mismatches, go into `review_notes`
   as 「第 N 句没录到 / 听起来像…，请补录：<那一句>」 (the cloned voice fills those lines until then).
3. Move the file to `recordings/done/`, commit `episodes/<id>/voice` + push, re-render every platform of that episode, upload,
   and update the doc (`draft` / `finals`, `voice: "own"`, `voice_sig`). Keep its status (a `built` doc goes back to `draft` so the
   user hears it once before posting).

## 1. `changes` → revise the script
Set status `revising` (pinned `if_version`). A fresh subagent edits `episodes/<id>/episode.js` / `meta.json` to address `feedback` exactly, following `runbooks/scenes.md`, renders `--only xhs` and checks `sheet-xhs.png`. Then `engine/export.py`, commit + push (the Mac re-voices only the changed lines), and update the doc: `status: "voicing"`, `script` / `captions` from the new `doc.json`, append `{at, feedback}` to `feedback_log`, clear `feedback`. If the feedback asks for something not allowed (e.g. promoting the employer), keep the old script, set status `draft` and explain in `review_notes`.

## 2. `voicing` → preview video
Before rendering, once zh is fully voiced: `~/cosyvoice3/.venv/bin/python engine/zh_check.py episodes/<id> --audio` (Whisper listens to every clip and compares pinyin with the script). For each AUDIO line: if the date isn't near, change that line's `say_zh` (reword, or add a comma) and re-export so the Mac re-voices it; if it is near, list the lines in `review_notes` (`请听一下第 N 句：…`).
If `--status` zh is complete, or the date is near: `render.py --only xhs`, upload `xhs.mp4` + `xhs-cover.png` (Artifact publish, `url` = board, `asset: true`, `file_paths`), and update the doc: `status: "draft"`, `draft: {video, cover, seconds, asset_ids}`, `voice` ("clone" if every scene is the user's voice, "ai" if none, else "mixed"), `voice_sig`. If the date is near and the voice is incomplete, add to `review_notes`: `Mac 没来得及配音，这一期先用 AI 配音。`. Otherwise leave it for the next run.

## 3. `approved` → build all four cuts
If `--status` is complete for both zh and en, or the date is near. Also build (keeping the status as is) any `voicing` / `draft` doc whose date is near, so a post day is never blocked; the user approves the finished cuts at the reminder:
1. `python3 engine/render.py episodes/<id>` (every platform in `meta.json` → `platforms`; AI 快讯 `<date>-news` episodes have no linkedin, so 3 cuts and 3 sheets).
2. Check `build/<id>/sheet-{xhs,douyin,tiktok,linkedin}.png`. If any frame has clipped or overlapping text, fix `episode.js` (layout only, same words), re-render that platform.
3. Upload the 4 videos + 4 covers in one call.
4. Update the doc: `status: "built"` (only if it was `approved`), `finals: {xhs:{video,cover,seconds,asset_ids}, douyin:…, tiktok:…, linkedin:…}`, `voice`, `voice_sig`, `built_at`.

## 4. New voice → re-render
For `draft` or `built` docs with nothing in `posted` whose `voice_sig` changed: re-render (draft: xhs only; built: all four), replace the assets, update `voice` / `voice_sig`.

## 5b. Save approved cuts to the videos folder
For every doc with status `built` (or that this run just set to `built`) whose `saved_sig` differs from its `voice_sig`:
`python3 engine/export.py episodes/<id>` (refreshes `build/<id>/doc.json`), then `python3 engine/save_finals.py episodes/<id>`. It copies the cuts, covers and post text into one folder per air date, `~/Desktop/AI/videos/<date>/` (every series of that day together), as `<HHMM>_<label>_<平台>.mp4 / _封面.png / _文案.txt` (label 第N课 / AI第N课 / 系统设计第N课 / AI快讯N; only platforms that post that day, at that series' times) plus `<label>_口播稿.txt`. A re-approved episode keeps its earlier files in `<date>/旧版本/<label>_<time>/`. If it reports a missing `build/<id>/<platform>.mp4`, download that platform's `finals` video and cover from the board (Artifact read, `path` = asset id) into `build/<id>/` as `<platform>.mp4` / `<platform>-cover.png`, then run it again. Then update the doc: `saved_sig` = `voice_sig` (pinned `if_version`).

## 5. Finish
- Delete superseded assets (their ids are in the old `asset_ids`). Commit layout fixes and push. Never commit `build/`.
- Final message only if something changed, Chinese, ≤ 2 lines, e.g. `预览好了 7 期；已出片 2 期（10/27、10/28）。去审核台看看。` + board link.
