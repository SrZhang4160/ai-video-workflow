# Weekly batch: script next week's episodes (three series × 7)

Runs early Friday morning (ET). Goal: for each series in `series/schedule.json` → `series` (Rust, AI 工程师系统课, 系统设计), 7 reviewed scripts for the following Monday–Sunday on the review board (21 in all; a series starts on its `start` date if it has one). The user's Mac then voices them in the user's cloned voice (local/voice_job.sh), and the nightly run turns them into preview videos, so drafts are ready Friday morning and the user reviews Friday through Sunday.
Review board: https://claude.ai/artifact/C2QhJCX4jV1JNNXhyrfMdb (db collection `episodes`, doc id = episode id = air date + the series' `id_suffix`, e.g. `2026-11-09` for Rust, `2026-11-09-ai` for AI, `2026-11-09-sd` for 系统设计).

## 0. Guard
- Video generation may only run 00:00–09:00 America/New_York. If this run was started by the schedule and the ET time is outside that window, stop and report "outside generation window".
- Work in the repo root. `git pull`, then `bash engine/setup.sh`.

## 1. Pick the week
- Skip any series with `"weekly": false` in `series/schedule.json` → `series` (AI 快讯 is scripted every night by `runbooks/news-daily.md`, never in this batch).
- Air dates = the next Monday through Sunday after this run (ET). Run on Friday → Monday is 3 days away.
- `ArtifactData list episodes` on the board. Per series, skip any episode id that already has a doc (never overwrite one).
- Per series, take the next unchecked lessons from that series' `curriculum` file, one per open date, in order. If `notes/` has a study note from the last 7 days that no episode used yet, you may use it for one date instead (log the swap).

## 2. Write (parallel)
For each episode (all series), start one fresh subagent with: the full text of `runbooks/scenes.md`, the series name, the lesson line, the previous and next lesson lines of the same series (for continuity and the teaser), `episodes/demo-rust-01/episode.js` as the style reference, and the target folder `episodes/<id>/` (AI: also `"track": "ai"` in meta.json; 系统设计: `"track": "sd"`). It writes `episode.js` + `meta.json`, runs `engine/export.py` and `engine/render.py --only xhs` (AI voice is fine here; this render is only for checking the layout), checks `build/<id>/sheet-xhs.png`, fixes problems, and reports.

## 3. Review (fresh eyes)
For each episode, start a different fresh subagent as reviewer with `agents/reviewer.md`, `runbooks/scenes.md` (content rules), and the episode folder + `build/<id>/sheet-xhs.png`. It does not see the writer's reasoning. Verdict 通过 / 打回 with concrete fixes. On 打回, a writer fixes it and the reviewer checks again; at most 2 rounds. If still 打回, keep the episode anyway and put the reviewer's unresolved points in the doc field `review_notes` so the user sees them.

## 4. Hand off for voicing
1. `python3 engine/export.py episodes/<id>` for each episode (writes `voice/zh.txt`, `voice/en.txt`, `build/<id>/doc.json`).
2. Mark the used lessons `[x]` in each series' curriculum file; `git add episodes series && git commit -m "week of <monday>: 21 scripts (rust + ai + sd)" && git push`. Never commit `build/`. The Mac voice job picks the new lines up from the repo.
3. One `ArtifactData batch` (op `set`, collection `episodes`, doc_id = episode id): each doc = `build/<id>/doc.json` + `status: "voicing"`, `updated` (ISO time), and `review_notes` if any. No video yet; the user can already read and approve the scripts.
4. Keep `config/schedule` in sync with `series/schedule.json` (`slots`) if it differs.

## 5. Finish
Final message (this is what the user's phone shows), Chinese, ≤ 3 lines:
`下周脚本好了：Rust 7 期（第N–M课）+ AI 7 期（AI 第N–M课）+ 系统设计 7 期（系统设计第N–M课）。Mac 配好音后，早上审核台会有预览视频。` plus the board link.
