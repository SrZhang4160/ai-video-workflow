# Nightly build: the approval hook

Runs twice a night (~2:50 and ~6:30 AM ET), and whenever the user says 「现在出片」. Each run is idempotent.
Review board: https://claude.ai/artifact/C2QhJCX4jV1JNNXhyrfMdb (db collection `episodes`, doc id = air date).
Voice: the user's Mac voices every script line in the user's cloned voice and pushes `episodes/<date>/voice/<lang>/sNN.ogg` (local/voice_job.sh, every 20 min while the Mac is awake). `python3 engine/render.py episodes/<date> --status` prints `{"zh": [voiced, scenes], "en": [...]}`. "Near" below means the air date is today or tomorrow (ET).

## 0. Guard and early exit
- Only run 00:00–09:00 America/New_York when started by the schedule; otherwise stop with "outside generation window".
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

## 5. Finish
- Delete superseded assets (their ids are in the old `asset_ids`). Commit layout fixes and push. Never commit `build/`.
- Final message only if something changed, Chinese, ≤ 2 lines, e.g. `预览好了 7 期；已出片 2 期（10/27、10/28）。去审核台看看。` + board link.
