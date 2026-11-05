# AI 快讯 · AI News (second daily series)

One AI-industry story a day, analyzed in about a minute. Same pipeline as the Rust lessons (scenes engine, cloned voice,
review board, nightly build, reminders); only the scripting step is different: it runs **every night** (`runbooks/news-daily.md`)
instead of a Friday batch, because news goes stale.

- Episode folder: `episodes/<air date>-news/` (e.g. `episodes/2026-11-02-news/`). Board doc id = the folder name; `date` = air date.
- `meta.json` has `"track": "news"` (same mechanism as the AI 工程师 series' `"track": "ai"`) and `"sources": [{title, url, outlet, published}]`. `episode.js` has `n` = episode number
  (next after the highest in `log.md`) and `tag: ['AI 快讯', 'AI News']`.
- Posting: `series/schedule.json` slots with `"series": "news"`: 小红书 / 抖音 / TikTok at **16:30 ET** daily, reminder 15:50; **no LinkedIn** (`platforms: ["xhs", "douyin", "tiktok"]`). Folder label `AI快讯{n}`. Rust keeps 19:30 / 10:30, the AI 工程师 series 12:00 / 08:00.
- Every story used is logged in `series/news/log.md` (date, n, headline, main source) so the same story is never covered twice.

## Picking the story
Three pools, gathered every run by `python3 engine/news_sources.py <id>` (→ `build/<id>/candidates.md`) plus a news search:
- **A. GitHub Trending** (AI-related repos, today first, then this week): a tool or project people can try today.
- **B. Hugging Face Daily Papers** (yesterday's and today's list, by upvotes): a research result with a concrete number.
- **C. Industry news** from the last 36 hours (ET): model / API releases, big moves (WebSearch, as before).

Pick the **one** item with the strongest "能马上用 + 有一个具体数字" (competitor study 2026-11-04: tool-of-the-day videos with a
number contrast got 10–40× the views of industry news and abstract concepts). Order of preference:
1. A trending repo (A) or a new model/API/tool release (C) that a developer can install or call **today**, with a measurable
   payoff stated by its own README/docs/benchmark (「267 行 → 9 行」「8 GB 内存跑 2.8T 模型」「冷启动 3 s → 0.4 s」).
2. A Daily Paper (B) with a clear, checkable headline result **and** public code or a demo (prefer papers whose `github` /
   `project` link works). Explain the one idea in plain words; say benchmark numbers as the authors' claims.
3. Industry news (C) **only if** it changes what engineers can do or pay. Skip funding/stock/drama stories.
Rotate so the same pool doesn't win more than 3 days in a row (check `log.md`; each line notes its pool).
Skip: repos that are only lists ("awesome-…"), course dumps, or with no README/demo; repos trending only because of a
celebrity; papers without code that can't be explained in one minute; anything already in `log.md`; anything you can't verify
(a repo's claim with no benchmark or demo is said as 「作者说…」 or cut). Check the license and that the repo is real software
(open the README, the install steps, recent commits).

## Sources
- Prefer primary sources: the company's own blog / docs / changelog / release notes, the paper (arXiv), the GitHub repo,
  the official filing or government text.
- Every factual claim on screen or in the voice must trace to a source in `meta.json` → `sources`. Numbers (prices, benchmark
  scores, context sizes, dates, money) need a primary source or two independent reputable outlets.
- Benchmarks claimed by the vendor are said as claims: 「官方称…」 / "the company says…".
- Note publish times: the run must be sure the story is really new (not a re-post of an old announcement).

## Look
News analysis, not a lesson: `theme: 'news'` in `episode.js` gives a masthead with the series title (每日 AI 快讯 · AI News Everyday, issue number),
a headline bar, and lower-third captions. Every scene has a `tag` that says what kind of content it is: 头条 TOP STORY, 新闻 NEWS (facts), 原理 HOW IT WORKS,
分析 ANALYSIS, 观点 MY TAKE (opinion), 总结 SUMMARY. Reference: `episodes/2026-11-02-news/episode.js`.
Clear but substantial: each line says one thing a listener gets on first hearing, and every scene adds a new fact or angle.

## Real visuals (every episode)
At least **two real screenshots** per episode, made with `python3 engine/capture.py episodes/<id> <name> <url> [--selector …]`
and placed with `shot('<name>.png', {...})` next to a `src()` tag: the repo page (stars visible), the README demo / benchmark
table (`--selector 'article.markdown-body'` + `pan`), the paper's key figure or results table (arXiv HTML / project page), the
official announcement. Real screenshots beat redrawn boxes; redraw only what needs explaining (the idea's diagram).
Text in a screenshot must be readable on a phone: capture a small area, not a whole page (`--width 900 --height 560`, or
`--selector` for one element: the repo header `#repository-container-header`, the README's demo image or benchmark table, one
paper figure); never shrink a full page into a card. Show the star count / upvotes / date as numbers with `data-count`. For a tool, the install or usage command types on
(`data-type`) in a terminal card. Paper figures and repo demos belong to their authors: credit them on screen and in `sources`.

## Episode structure for a repo or paper (pools A and B; 5–7 scenes, ~55–75 s Chinese — shorter than industry news)
1. **Hook** (scene 1, first frame): the payoff as a before → after with numbers (`hook()`), from the README / paper itself.
2. **What it is** (1 scene): one sentence, the real repo/paper screenshot, stars (counting) or upvotes, who made it, `src()`.
3. **How it works** (1–2 scenes): the one idea that makes the number possible, as a diagram; for a paper, the method in plain
   words (no jargon without a gloss).
4. **Try it / what it costs** (1 scene): the install or usage command (typed on), requirements (GPU? API key? OS?), license.
   For a paper: is there code / weights / a demo, and can a developer use it today?
5. **My take + 总结** (last scene): one line of honest judgment (limits, who should care), then the one-line summary.
Industry news (pool C) keeps the structure below.

## Episode structure for industry news (replaces the lesson structure in `runbooks/scenes.md`; everything else there still applies)
1. **Hook** (first 3 s): the surprising fact as one plain sentence, with the headline (scene title) carrying the same hook.
   「OpenAI 昨天把价格砍了一半，开发者该换吗？」 Don't make the viewer decode a comparison: state each number with what it counts
   (「第三方 AI agent 帮人点外卖，至今才几百单。」 then 「而 DoorDash 上个季度：9.93 亿单。」). Post titles use the same hook. On screen use `hook({...})` (before → after with counting numbers) or a big number card, visible from the first frame; motion rules from `runbooks/scenes.md` (typewriter, draw-on, count, emphasis pulses) apply to news too.
2. **What happened** (1 scene): who, what, when, in plain words, with a `src()` tag on screen.
3. **How it works / what's actually new** (1–2 scenes): the technical substance, with a diagram (before vs after, pipeline,
   comparison table, timeline).
4. **Why it matters** (1–2 scenes): the analysis. What changes for people building AI apps: cost, capability, risk, choice of
   tools. Clearly separate fact from analysis (「我的看法是… / My take:」 is fine for the analysis part, one line).
5. **总结 + 接下来看什么 / Summary and what to watch** (last scene): the story in one line, then one or two concrete signals to watch.
No next-episode teaser (tomorrow's news isn't known). No quiz in this series. 6–8 scenes, 22–28 caption pages, ~80–95 s in Chinese: enough substance that a developer learns something beyond the headline (the company's own strategy, the concrete rules or numbers, what's missing).

## Voice: the user records it
`meta.json` has `"voice": "own"`. The board shows a preview in the cloned voice first; `review_notes` carries the reading
script (`voice/zh.txt`, one line per caption page). The user reads it top to bottom into Voice Memos and drops the file into
`~/Desktop/AI/recordings/<id>.m4a` (and `<id>-en.m4a` for TikTok, optional); `runbooks/nightly.md` §0b turns it into clips.
So write lines that are natural to say: no `say_zh` spellings needed, English names stay as they are.

## Rules (on top of `CLAUDE.md`)
- Teach the viewer: explain the news so a working developer gets it in one minute. No "today I read".
- Accurate or cut. If a detail can't be verified from a source, leave it out. Never invent quotes.
- Neutral and fair: no cheering or bashing companies; give the trade-off. Company and product names are fine here (it's news).
- Still never mention the user's employer (RELAI), its products, customers, competitors-as-ours, or numbers.
- No financial advice (no "buy the stock"); no political opinions on policy stories, only what it changes for builders.
- The series title appears only in the masthead (`theme: 'news'`); no other slogans, no progress bars.
