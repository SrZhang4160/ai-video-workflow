# Weekly batch: draft next week's 7 episodes

Runs early Friday morning (ET). Goal: 7 reviewed drafts for the following Monday–Sunday on the review board before the user wakes up, so they can review Friday through Sunday.
Review board: https://claude.ai/artifact/C2QhJCX4jV1JNNXhyrfMdb (db collection `episodes`, doc id = air date).

## 0. Guard
- Video generation may only run 00:00–09:00 America/New_York. If this run was started by the schedule and the ET time is outside that window, stop and report "outside generation window".
- Work in the repo root. `git pull`, then `bash engine/setup.sh`.

## 1. Pick the week
- Air dates = the next Monday through Sunday after this run (ET). Run on Friday → Monday is 3 days away.
- `ArtifactData list episodes` on the board. Skip any date that already has a doc (never overwrite one).
- Take the next unchecked lessons from `series/curriculum.md`, one per open date, in order. If `notes/` has a study note from the last 7 days that no episode used yet, you may use it for one date instead (log the swap).

## 2. Write (parallel)
For each date, start one fresh subagent with: the full text of `runbooks/scenes.md`, the lesson line, the previous and next lesson lines (for continuity and the teaser), `episodes/demo-rust-01/episode.js` as the style reference, and the target folder `episodes/<date>/`. It writes `episode.js` + `meta.json`, runs export and the xhs render, checks `sheet-xhs.png`, fixes problems, and reports.

## 3. Review (fresh eyes)
For each episode, start a different fresh subagent as reviewer with `agents/reviewer.md`, `runbooks/scenes.md` (content rules), and the episode folder + `build/<date>/sheet-xhs.png`. It does not see the writer's reasoning. Verdict 通过 / 打回 with concrete fixes. On 打回, a writer fixes it and the reviewer checks again; at most 2 rounds. If still 打回, keep the draft anyway and put the reviewer's unresolved points in the doc field `review_notes` so the user sees them.

## 4. Publish drafts to the board
For each episode:
1. `python3 engine/export.py episodes/<date>` and make sure `build/<date>/xhs.mp4` is current.
2. Upload `build/<date>/xhs.mp4` and `build/<date>/xhs-cover.png` to the board's asset store (Artifact publish with `url` = board, `asset: true`, `file_paths`). Keep the returned urls and ids.
3. Build the doc: `build/<date>/doc.json` plus
   `status: "draft"`, `draft: {video, cover, seconds, asset_ids:[…]}`, `voice` (from `build/<date>/report.json` → all scenes real = "clone", none = "ai", else "mixed"), `updated` (ISO time).
- Write all new docs in one `ArtifactData batch` (op `set`, collection `episodes`, doc_id = date).
- Also keep `config/schedule` in sync with `series/schedule.json` (`slots` field) if it differs.

## 5. Finish
- Mark the used lessons `[x]` in `series/curriculum.md`; `git add episodes series && git commit -m "week of <monday>: 7 drafts" && git push`. Never commit `build/`.
- Final message (this is what the user's phone shows), Chinese, ≤ 3 lines:
  `下周 7 期草稿好了：<第N课 标题> … 周日晚上前去审核台点「通过」或写修改意见。` plus the board link.
  If the user's Mac voice is set up, add: `想用你的声音：在 Mac 上跑 bash local/voice_week.sh`.
