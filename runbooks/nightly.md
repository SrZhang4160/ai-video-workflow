# Nightly build: the approval hook

Runs twice a night (~2:50 and ~6:30 AM ET), and whenever the user says 「现在出片」. Each run is idempotent.
Review board: https://claude.ai/artifact/C2QhJCX4jV1JNNXhyrfMdb (db collection `episodes`, doc id = air date).
Voice: the user's Mac voices every script line in the user's cloned voice and pushes `episodes/<date>/voice/<lang>/sNN.ogg` (local/voice_job.sh, every 20 min while the Mac is awake). `python3 engine/render.py episodes/<date> --status` prints `{"zh": [voiced, scenes], "en": [...]}`. "Near" below means the air date is today or tomorrow (ET).

## 0. Guard and early exit
- **Review trigger** (started by the review-watch task, any time of day): there is work only if a doc is `changes`, or `approved` with no `finals` yet, or `built` whose `saved_sig` differs from its `voice_sig` (approved but not saved to the videos folder yet; only section 5b runs for those). Ignore the time window for those; skip sections 2 and 4 (previews and re-renders of untouched episodes wait for the night). If nothing qualifies, stop with "nothing to do" right after the list, before `git pull` or setup.
- **Lock**: if `build/.lock` exists and is younger than 60 min, stop with "another run is working". Otherwise write the current time to it, and delete it when the run ends (also on failure).
- Otherwise (nightly schedule): only run 00:00–09:00 America/New_York; otherwise stop with "outside generation window".
- `ArtifactData list episodes`, then `git pull`. There is work if any doc is `changes`; or `voicing` / `approved`; or `draft` / `built` (nothing in `posted`) whose `voice_sig` differs from `git log -1 --format=%h -- episodes/<date>/voice/` (use "none" when empty). If there is no work, stop with "nothing to build" before any setup.
- Otherwise `bash engine/setup.sh`.

## 1. `changes` → revise the script
Set status `revising` (pinned `if_version`). A fresh subagent edits `episodes/<date>/episode.js` / `meta.json` to address `feedback` exactly, following `runbooks/scenes.md`, renders `--only xhs` and checks `sheet-xhs.png`. Then `engine/export.py`, commit + push (the Mac re-voices only the changed lines), and update the doc: `status: "voicing"`, `script` / `captions` from the new `doc.json`, append `{at, feedback}` to `feedback_log`, clear `feedback`. If the feedback asks for something not allowed (e.g. promoting the employer), keep the old script, set status `draft` and explain in `review_notes`.

## 2. `voicing` → preview video
If `--status` zh is complete, or the date is near: `render.py --only xhs`, upload `xhs.mp4` + `xhs-cover.png` (Artifact publish, `url` = board, `asset: true`, `file_paths`), and update the doc: `status: "draft"`, `draft: {video, cover, seconds, asset_ids}`, `voice` ("clone" if every scene is the user's voice, "ai" if none, else "mixed"), `voice_sig`. If the date is near and the voice is incomplete, add to `review_notes`: `Mac 没来得及配音，这一期先用 AI 配音。`. Otherwise leave it for the next run.

## 3. `approved` → build all four cuts
If `--status` is complete for both zh and en, or the date is near. Also build (keeping the status as is) any `voicing` / `draft` doc whose date is near, so a post day is never blocked; the user approves the finished cuts at the reminder:
1. `python3 engine/render.py episodes/<date>` (xhs, douyin, tiktok, linkedin).
2. Check `build/<date>/sheet-{xhs,douyin,tiktok,linkedin}.png`. If any frame has clipped or overlapping text, fix `episode.js` (layout only, same words), re-render that platform.
3. Upload the 4 videos + 4 covers in one call.
4. Update the doc: `status: "built"` (only if it was `approved`), `finals: {xhs:{video,cover,seconds,asset_ids}, douyin:…, tiktok:…, linkedin:…}`, `voice`, `voice_sig`, `built_at`.

## 4. New voice → re-render
For `draft` or `built` docs with nothing in `posted` whose `voice_sig` changed: re-render (draft: xhs only; built: all four), replace the assets, update `voice` / `voice_sig`.

## 5b. Save approved cuts to the videos folder
For every doc with status `built` (or that this run just set to `built`) whose `saved_sig` differs from its `voice_sig`:
`python3 engine/export.py episodes/<date>` (refreshes `build/<date>/doc.json`), then `python3 engine/save_finals.py episodes/<date>`. It copies the 4 cuts, covers and post text to `~/Desktop/AI/videos/<date>_第N课/<date>_<HHMM>_<平台>.mp4 / _封面.png / _文案.txt` (only platforms that post that day). If it reports a missing `build/<date>/<platform>.mp4`, download that platform's `finals` video and cover from the board (Artifact read, `path` = asset id) into `build/<date>/` as `<platform>.mp4` / `<platform>-cover.png`, then run it again. Then update the doc: `saved_sig` = `voice_sig` (pinned `if_version`).

## 5. Finish
- Delete superseded assets (their ids are in the old `asset_ids`). Commit layout fixes and push. Never commit `build/`.
- Final message only if something changed, Chinese, ≤ 2 lines, e.g. `预览好了 7 期；已出片 2 期（10/27、10/28）。去审核台看看。` + board link.
