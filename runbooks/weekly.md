# Weekly batch: script next week's 7 episodes

Runs early Friday morning (ET). Goal: 7 reviewed scripts for the following Monday–Sunday on the review board. The user's Mac then voices them in the user's cloned voice (local/voice_job.sh), and the nightly run turns them into preview videos, so drafts are ready Friday morning and the user reviews Friday through Sunday.
Review board: https://claude.ai/artifact/C2QhJCX4jV1JNNXhyrfMdb (db collection `episodes`, doc id = air date).

## 0. Guard
- Video generation may only run 00:00–09:00 America/New_York. If this run was started by the schedule and the ET time is outside that window, stop and report "outside generation window".
- Work in the repo root. `git pull`, then `bash engine/setup.sh`.

## 1. Pick the week
- Air dates = the next Monday through Sunday after this run (ET). Run on Friday → Monday is 3 days away.
- `ArtifactData list episodes` on the board. Skip any date that already has a doc (never overwrite one).
- Take the next unchecked lessons from `series/curriculum.md`, one per open date, in order. If `notes/` has a study note from the last 7 days that no episode used yet, you may use it for one date instead (log the swap).

## 2. Write (parallel)
For each date, start one fresh subagent with: the full text of `runbooks/scenes.md`, the lesson line, the previous and next lesson lines (for continuity and the teaser), `episodes/demo-rust-01/episode.js` as the style reference, and the target folder `episodes/<date>/`. It writes `episode.js` + `meta.json`, runs `engine/export.py` and `engine/render.py --only xhs` (AI voice is fine here; this render is only for checking the layout), checks `build/<date>/sheet-xhs.png`, fixes problems, and reports.

## 3. Review (fresh eyes)
For each episode, start a different fresh subagent as reviewer with `agents/reviewer.md`, `runbooks/scenes.md` (content rules), and the episode folder + `build/<date>/sheet-xhs.png`. It does not see the writer's reasoning. Verdict 通过 / 打回 with concrete fixes. On 打回, a writer fixes it and the reviewer checks again; at most 2 rounds. If still 打回, keep the episode anyway and put the reviewer's unresolved points in the doc field `review_notes` so the user sees them.

## 4. Hand off for voicing
1. `python3 engine/export.py episodes/<date>` for each episode (writes `voice/zh.txt`, `voice/en.txt`, `build/<date>/doc.json`).
2. Mark the used lessons `[x]` in `series/curriculum.md`; `git add episodes series && git commit -m "week of <monday>: 7 scripts" && git push`. Never commit `build/`. The Mac voice job picks the new lines up from the repo.
3. One `ArtifactData batch` (op `set`, collection `episodes`, doc_id = date): each doc = `build/<date>/doc.json` + `status: "voicing"`, `updated` (ISO time), and `review_notes` if any. No video yet; the user can already read and approve the scripts.
4. Keep `config/schedule` in sync with `series/schedule.json` (`slots`) if it differs.

## 5. Finish
Final message (this is what the user's phone shows), Chinese, ≤ 3 lines:
`下周 7 期脚本好了：<第N课 标题> …  Mac 配好音后，早上审核台会有预览视频。` plus the board link.
