# Nightly build: the approval hook

Runs every night around 3 AM ET. Whatever the user decided on the review board during the day gets built tonight.
Review board: https://claude.ai/artifact/C2QhJCX4jV1JNNXhyrfMdb (db collection `episodes`, doc id = air date).

## 0. Guard
- Only run 00:00–09:00 America/New_York when started by the schedule; otherwise stop with "outside generation window".
- `ArtifactData list episodes` first. If no doc has status `approved` or `changes`, and no `built` doc has new voice (step 3), stop right away with "nothing to build". Don't set anything up.
- Otherwise: repo root, `git pull`, `bash engine/setup.sh`.

## 1. `changes` → revise
For each doc with status `changes`: set status `revising` (pinned `if_version`), then a fresh subagent edits `episodes/<date>/episode.js` / `meta.json` to address `feedback` exactly, following `runbooks/scenes.md`. Then export, render `--only xhs`, check `sheet-xhs.png`, upload the new draft video + cover, and update the doc:
`status: "draft"`, new `draft`, `script`/`captions` from the new `doc.json`, append `{at, feedback}` to `feedback_log`, clear `feedback`. Delete the superseded draft assets.
If the feedback asks for something impossible or unsafe (e.g. promoting the employer), keep status `draft` and explain in `review_notes`.

## 2. `approved` → build all four cuts
For each doc with status `approved`:
1. `python3 engine/export.py episodes/<date>` then `python3 engine/render.py episodes/<date>` (xhs, douyin, tiktok, linkedin).
2. Look at `build/<date>/sheet-{xhs,douyin,tiktok,linkedin}.png`. If any frame has clipped or overlapping text, fix `episode.js` (layout only, same words) and re-render that platform.
3. Upload the 4 videos + 4 covers to the board asset store in one call.
4. Update the doc: `status: "built"`, `finals: {xhs:{video,cover,seconds,asset_ids}, douyin:…, tiktok:…, linkedin:…}`, `voice`, `voice_sig` (= `git log -1 --format=%h -- episodes/<date>/voice/` or "none"), `built_at`.

## 3. New voice → rebuild
For each doc with status `built` and no platform marked in `posted`: if the current `voice_sig` differs from the stored one (the user pushed recorded or cloned voice files), rebuild as in step 2 and replace the assets (delete the old ones).

## 4. Finish
- Commit episode changes (`git add episodes && git commit -m "nightly: …" && git push`). Never commit `build/`.
- Final message only if something changed, Chinese, ≤ 2 lines, e.g. `已出片 2 期（10/27、10/28），已按意见改好 1 期（10/29），去审核台看看。` + board link.
