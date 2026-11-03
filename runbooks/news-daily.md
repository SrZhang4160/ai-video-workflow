# Daily news: script today's AI 快讯 episode

Runs every night at ~00:40 ET (after the Mac wakes at 00:05), and whenever the user says 「做今天的快讯」. Goal: one reviewed,
fact-checked news script for **today's** air date on the review board before the Mac voice job's next pass, so the nightly
build (~2:50 / ~6:30) has a preview and the three cuts ready by morning. The user reviews in the morning or early afternoon; posts go out at 16:30 ET (小红书 / 抖音 / TikTok; no LinkedIn).
Series rules: `series/news/README.md` (read it first). Review board: https://claude.ai/artifact/C2QhJCX4jV1JNNXhyrfMdb
(db collection `episodes`, doc id = `<date>-news`).

## 0. Guard
- If started by the schedule and the ET time is outside 00:00–09:00, stop with "outside generation window".
- Air date = today in America/New_York. Id = `<date>-news`.
- `ArtifactData get episodes/<id>`. If it exists, stop with "already scripted" (never overwrite).
- `git pull`, then `bash engine/setup.sh`.

## 1. Research (you, not a subagent)
- Read `series/news/log.md` (stories already covered; next episode number = highest `#n` + 1, or 1).
- WebSearch (standard mode, several queries in one turn; extended only if results are thin) for AI-industry news from the last
  36 hours: model / API releases, open-source releases, research, developer tools, big industry or policy moves. Open the
  primary source for each candidate (WebFetch) and confirm its publish date.
- Pick one story by the order in `series/news/README.md`. Write a short brief to `build/<id>/brief.md`: the story in 3 lines,
  the key facts each with its source URL, what's genuinely new, the analysis angle (why it matters for builders), 2–4 sources,
  and the runner-up stories (in case the reviewer rejects the pick).

## 2. Write (one fresh subagent)
Give it: the full text of `runbooks/scenes.md` and `series/news/README.md` (its structure replaces the lesson structure),
`build/<id>/brief.md`, `episodes/li-deploy-background-jobs/episode.js` and `episodes/demo-rust-01/episode.js` as style
references, and the target folder `episodes/<id>/`. It writes `episode.js` (`n`, `theme: 'news'`, `tag: ['AI 快讯', 'AI News']`, and a `tag` on every scene: 头条 / 新闻 / 分析 / 观点 / 总结 (no quiz); `episodes/2026-11-02-news/episode.js` is the news reference) and
`meta.json` (`date` = air date, `track: "news"`, `sources`, `platforms: ["xhs", "douyin", "tiktok"]`, `captions` for those three, `"voice": "own"` (no `quiz`); tags include `AI快讯`, `AI新闻`,
`AI工程师`, `碎片时间学AI工程师` on 小红书, `AINews` / `AI` on TikTok), uses only facts in the brief,
runs `engine/export.py` and `engine/render.py --only xhs`, checks `build/<id>/sheet-xhs.png`, fixes problems, and reports.

## 3. Fact-check review (fresh eyes)
Start a different fresh subagent with `agents/news-reviewer.md`, `runbooks/scenes.md`, `series/news/README.md`, the episode
folder and `build/<id>/sheet-xhs.png`. It does **not** get the brief: it checks every claim against the sources listed in
`meta.json` itself (WebFetch). 打回 → the writer fixes, reviewer re-checks; at most 2 rounds. If it's still 打回 for an
accuracy reason, cut the disputed claim (or switch to the runner-up story and redo steps 2–3 once); if it's 打回 only for
style, keep it and put the points in `review_notes`.

## 4. Hand off for voicing
1. `python3 engine/export.py episodes/<id>`.
2. Append the story to `series/news/log.md`.
   Before committing, run the Mandarin check `~/cosyvoice3/.venv/bin/python engine/zh_check.py episodes/<id>` and fix every ERR / WARN / wrong 多音 reading (re-export after).
3. `git add episodes/<id> series/news && git commit -m "<id>: AI 快讯 #<n> <headline>" && git push`. Only those paths; never `build/`.
4. `ArtifactData set` collection `episodes`, doc_id `<id>`: `build/<id>/doc.json` + `status: "voicing"`, `updated` (ISO time),
   `review_notes`: any reviewer notes, then 「录音：照下面逐句读一遍（中文；英文可选），存到 ~/Desktop/AI/recordings/<id>.m4a（英文 <id>-en.m4a）」 and the
   numbered lines of `voice/zh.txt`. Until the recording arrives the preview uses the cloned voice. The Mac voices it within ~20–30 min; the nightly run builds it (today's date is always "near").

## 5. Finish
Final message (the user's phone shows it), Chinese, ≤ 2 lines:
`今天的 AI 快讯 #<n>：<标题>。录音稿在审核台，录好放进 recordings 文件夹；下午 4:30 发。` plus the board link.
