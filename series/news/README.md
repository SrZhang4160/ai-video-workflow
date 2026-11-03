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
Look at news published in the **last 36 hours** (ET), up to the moment of the run. Pick the **one** story that an AI engineer
would most want explained, in this order of preference:
1. A new model, API, tool or open-source release people will actually use (capabilities, price, limits, how to try it).
2. A research result or technique that changes how AI apps are built (agents, evals, RAG, inference cost, safety).
3. A big industry move (funding, acquisition, policy, lawsuit, outage) **only if** it changes what engineers can do or pay.
Skip: rumors with a single anonymous source, stock-price stories, drama between people, anything already in `log.md`
(unless there's a substantial new development, then say what's new). If the day is genuinely quiet, a follow-up on
a story from the last 7 days ("一周后再看 …") is fine.

## Sources
- Prefer primary sources: the company's own blog / docs / changelog / release notes, the paper (arXiv), the GitHub repo,
  the official filing or government text.
- Every factual claim on screen or in the voice must trace to a source in `meta.json` → `sources`. Numbers (prices, benchmark
  scores, context sizes, dates, money) need a primary source or two independent reputable outlets.
- Benchmarks claimed by the vendor are said as claims: 「官方称…」 / "the company says…".
- Note publish times: the run must be sure the story is really new (not a re-post of an old announcement).

## Look
News analysis, not a lesson: `theme: 'news'` in `episode.js` gives a masthead with the series title (每日 AI 快讯 · AI News Everyday, issue number),
a headline bar, and lower-third captions. Every scene has a `tag` that says what kind of content it is: 头条 TOP STORY, 新闻 NEWS (facts),
分析 ANALYSIS, 观点 MY TAKE (opinion), 总结 SUMMARY. Reference: `episodes/2026-11-02-news/episode.js`.
Clear but substantial: each line says one thing a listener gets on first hearing, and every scene adds a new fact or angle.

## Episode structure (replaces the lesson structure in `runbooks/scenes.md`; everything else there still applies)
1. **Hook** (first 3 s): the surprising fact as one plain sentence, with the headline (scene title) carrying the same hook.
   「OpenAI 昨天把价格砍了一半，开发者该换吗？」 Don't make the viewer decode a comparison: state each number with what it counts
   (「第三方 AI agent 帮人点外卖，至今才几百单。」 then 「而 DoorDash 上个季度：9.93 亿单。」). Post titles use the same hook.
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
