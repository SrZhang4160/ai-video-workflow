# How to write an episode

An episode is one folder `episodes/<air date YYYY-MM-DD>/` (AI series: `episodes/<air date>-ai/`; 系统设计: `episodes/<air date>-sd/`) with two files you write:

- `episode.js`: scenes, captions and visuals. `episodes/demo-rust-01/episode.js` is the reference; copy its shape and quality.
- `meta.json`: title and per-platform post copy.

The same content goes to every platform. Only the language changes: 小红书 and 抖音 get Chinese voice with zh+en captions, TikTok and LinkedIn get English voice with English captions. So every piece of text exists in both languages.

## Content rules (the reviewer rejects on any of these)
1. **Teach the viewer.** Never "today I learned"; explain it so a beginner gets it in one minute. One idea per video.
2. **Accurate.** Code must compile or run as shown; API facts must match the provider's current docs. If unsure, cut it.
3. **No company promotion.** Never mention RELAI, the user's employer, its products, customers or metrics. Public tools (Rust, Cargo, Claude Code, MCP, OpenAI…) are fine.
4. **No meta labels.** No "AI voice", "made with AI", series slogans or progress bars on screen.
5. **The title is a promise.** If the title or hook asks "why" (为什么), one scene must answer the why (the design reason), not only show what happens. If the video only shows how, title it as how.
6. **Structure 总–分–总**: hook question → 2–4 points with visuals → one-line takeaway (a "一张图总结" card worth saving) → teaser for the next lesson → **comment quiz** (last scene, see below).
7. **Length**: 6–9 scenes plus the quiz scene, ~55–80 s spoken in Chinese. Chinese is spoken, conversational (咱们、其实、你看), like a person talking.

## The lesson series
There are three daily lesson series (`series/schedule.json` → `series`): **Rust** (folder `episodes/<date>/`, `series/curriculum.md`) **AI 工程师系统课** (folder `episodes/<date>-ai/`, `series/ai-engineer/curriculum.md`) and **系统设计** (folder `episodes/<date>-sd/`, `series/system-design/curriculum.md`). Same engine, same rules. For an AI episode:
- `meta.json` has `"track": "ai"` (Rust episodes may omit it; default `rust`). `n` in `episode.js` is the AI lesson number.
- It teaches a concept, not a language: prefer a diagram, a request/response pair or a short Python snippet over long code. Snippets must run as shown with the current public SDKs; API facts (parameter names, limits, prices) must be checked against the provider's current docs, or cut. Never quote a price or a model ranking that may change; say "check the pricing page" instead.
- Quiz with one definite answer: A/B about behaviour ("同样的提示词问两次，temperature=0 一定得到一样的回答吗？" only if the answer is truly definite), or "which step is missing", not "which model is best".
- Tags: xhs `["AI工程师", "大模型", "AI应用开发", "碎片时间学AI工程师"]`, douyin `["AI", "大模型", "程序员"]`, tiktok `["aiengineering", "llm", "ai", "learntocode"]`, linkedin `["AIEngineering", "LLM", "GenerativeAI", "SoftwareEngineering"]`.

For a 系统设计 episode (since 2026-11-04 a 2–3 min drama, 《逆袭架构师》): **read `series/system-design/README.md` and `story.md` first**; their format (length, structure, narrator voice, character kit) replaces the lesson structure and length above. The rules below still apply to the teaching inside the story.
- `meta.json` has `"track": "sd"`, `"format": "drama"`; `episode.js` has `theme: 'drama'` and `n` = drama episode number.
- Teach with a diagram first: boxes and arrows (client → load balancer → servers → cache → database), a request flowing through it, or a before/after when one piece is added. Code only when it is the point (a 10-line token bucket), never long code.
- Numbers must be right and labelled as estimates: show the arithmetic for QPS / storage (1 亿日活 × 10 次 ÷ 86400 ≈ 1.2 万 QPS). Latency figures are orders of magnitude ("约 100 纳秒"), not precise claims. Name the trade-off: every design choice says what it costs.
- Real systems (Redis, Kafka, DynamoDB, Cassandra, Nginx) are fine when the fact is public and stable; say "commonly" when it's practice, not spec. Never claim how a specific company's internals work unless it's from a public talk or paper, and then say so.
- Classic design-question lessons (54–71): one episode can't cover a whole design. Pick the one core problem of that system (TinyURL → how to generate short ids; Twitter → push vs pull fan-out) and solve that; the takeaway card is the high-level diagram.
- Quiz with one definite answer: arithmetic ("每秒 100 个请求，令牌桶容量 10、每秒补 5 个，第 2 秒能放行多少？"), which component fixes the problem, or A/B about behaviour ("先删缓存再写库，并发读会读到旧值吗？"). Not "which design is best".
- Tags: xhs `["系统设计", "后端", "程序员面试", "碎片时间学AI工程师"]`, douyin `["系统设计", "后端开发", "程序员"]`, tiktok `["systemdesign", "softwareengineering", "coding", "techinterview"]`, linkedin `["SystemDesign", "SoftwareEngineering", "DistributedSystems", "Backend"]`.

## Growth rules (小红书 pushes a note further only if people interact)
小红书 first shows a new note to a small pool (a few hundred views) and decides from interaction whether to push it further. Commonly cited (unofficial) weights: like or save = 1, comment or share = 4, follow = 8. So a comment is worth four likes: every episode is built to make people comment and save.

1. **First 3 seconds = a concrete payoff or contrast, not a bare question.** (Competitor study 2026-11-04: the top Reels open with a number contrast or a surprising result — "沒裝的 AI 寫 267 行，裝了只要 9 行"; plain questions and abstract concepts performed worst.)
   - Scene 1, caption page 1 states the **result** the viewer will get or a **before → after** with real numbers: 「同一个函数，加上 4 处 'a，1 个报错直接变成 0 个。」 / 「一行配置，冷启动从 3 秒降到 0.4 秒。」 A question is fine only as the second beat after the payoff, or when it names a concrete pain (「这行代码为什么编译不过？」 + the error on screen).
   - Scene 1's visual is the hook itself, in huge type: use `hook({...})` (before struck through → after stamped in, numbers count) or a big error/result card. Something is on screen from the very first frame (the engine guarantees scene 1's opening elements are already in at t = 0).
   - The scene-1 title, the cover (= scene 1 fully built) and the post titles all carry the same hook. Numbers must be true for the code shown (count the errors, the lines, the characters).
   - Never open with a self-introduction, "今天我们讲", or a generic "你知道吗".
2. **Comment quiz, every episode.** The last scene is 「考考你 / Quick quiz」: a tiny code snippet or situation with **one definite answer** that a viewer who watched can get (guess-the-answer, A or B, "能编译吗？"). Not an opinion question ("你被坑过吗？"): a quiz is easier to answer and makes people come back for the answer.
   - On screen: the snippet in a code card, two option chips (A / B or 能 / 不能), and 「答案评论区见 👇 / Answer in the comments」.
   - In the voice: two caption pages, e.g. `['考考你：x 是什么类型？', 'Quick quiz: what type is x?']`, `['f32 还是 f64？评论区告诉我。', 'f32 or f64? Tell me in the comments.']`.
   - In the post copy: every platform's `body` ends with the same quiz.
   - The answer + a one-line reason goes in `meta.json` → `quiz` (below). The user pins it as the first comment after posting (the evening reminder shows it).
   - The quiz must be accurate: if it's code, it must really (not) compile for the stated reason.
3. **Worth saving.** The takeaway scene is a one-table / one-picture summary people screenshot or save.
4. **Cover and title say what you'll learn** in one glance (a question or a concrete payoff), same visual style every day so the profile looks like a series.
5. **Consistency.** Daily at the scheduled time, same style; the first episodes of a series get pinned on the profile as the entry point.

## episode.js shape

```js
window.EPISODE = {
  n: 2,                                   // lesson number (from series/curriculum.md)
  scenes: [
    { title: ['变量：let 和 mut', 'Variables: let and mut'],     // [zh, en] heading at the top
      cap: [                               // caption pages, shown in order while this scene's voice plays
        ['在 Rust 里，变量默认不能改。', 'In Rust, variables can\'t change by default.'],
        {zh: '想改，就加 mut。', en: 'Add mut to make one changeable.', say_zh: '想改，就加 mut。'},
      ],
      build() { /* add visuals with H(...) */ } },
  ],
};
```

- **Captions**: each page ≤ 18 Chinese characters and ≤ 70 English characters. The pair must say the same thing. The voice reads the pages back to back, so they must flow as speech.
- `say_zh` / `say_en` (optional): what the voice should read when it differs from the caption, e.g. `C++` → `C加加`, `2015` → `二零一五`, `uv` → `U V`. The cloud AI voice mispronounces symbols, so spell them out here.
- **One caption page = one voice clip.** Pages are voiced separately (`voice/<lang>/sNN.ogg`, numbered across the episode), so the caption lands exactly on the voice and there is a pause between pages. Chinese is held to 305–330 字/分钟 on every page (`runbooks/pace.md`; render.py evens each clip out, so avoid pages under 4 characters and "colon + one word" dramatic pauses). English is paced slower on purpose (longer pauses and a 1.6 s hold after each scene, voice at 0.92× speed): keep English pages short and plain so viewers can read the visuals.

## Visuals: the stage
`build()` draws into a 960 × 900 px stage (dark theme). Position with `class="r"` + `left/top/width/height` in px. Every top-level element you add with `H()` fades in, in the order added, so add things in the order the voice talks about them.

Helpers:
| helper | does |
|---|---|
| `H(html)` | add one element; returns it |
| `T(zh, en)` | pick text for the current language |
| `B(zh, en, size?)` | bilingual label: "中文 English" (small English) in Chinese videos, English only in English videos |
| `code(src)` | syntax-highlighted code; `// comment` or `# comment` at end of line is dimmed. Put it in a `.card.mono` box |
| `esc(s)` | escape `<` `>` `&` |
| `LANG` | `'zh'` or `'en'` |

**Make it lively: sync visuals to the voice.** Put attributes on the top-level element:
| attribute | effect |
|---|---|
| `data-cap="k"` | appears when caption page k of this scene starts (0-based). Use this on almost everything. |
| `data-delay="0.6"` | extra seconds after that |
| `data-in="pop / left / right / drop / zoom / stamp / fade"` | entrance style (default: rises up). `stamp` for ✓ / ✗ / ×2 verdicts, `pop` for key items |
| `data-move="dx,dy,dur"` | after entering, travel (e.g. a job card sliding into a queue) |
| `data-shake="1"` | shake after entering (crash, error) |
| `data-type="1.5"` | typewriter: lines of a code card (or a one-line label) appear one after another over 1.5 s. Use on code cards instead of showing all the code at once |
| `data-count="0.9"` (+ `data-from="267"`) | the first number in the element counts up (or down from `data-from`) |
| `data-draw="0.9"` | SVG arrows and lines draw on (solid strokes; dashed lines and fills fade in at the end) |
| `data-hl="k"` / `"k,k2"` | emphasis pulse (slight zoom + glow) when caption page k starts, for something already on screen that the voice now points at |

**Motion rule (every scene):** the picture must change at least every ~2–3 s while the voice talks. In practice: every caption page brings something new (`data-cap`) or points at something (`data-hl`); code cards type on (`data-type`); arrows draw on (`data-draw`); key numbers count (`data-count`). The engine adds a slow camera push-in that steps closer on each caption page toward that page's new content, so place each page's elements together. Turn it off for a scene with `camera: false` (e.g. a dense summary table) or for the episode with `camera: false` on `EPISODE`.

`hook({label, a, b, top, cap, capB})`: the scene-1 hook card (adds its own elements; don't wrap it in `H`). `a` = before (struck through), `b` = after (stamped in; if both have numbers, b counts from a's number), `capB` = caption page where b lands. Example: `hook({label: ["同一个函数 · 加 4 处 'a", "Same function · 'a in 4 places"], a: ['1 个报错', '1 error'], b: ['0 个报错', '0 errors'], top: 60, capB: 1})`.

Extra helpers: `icon(name, size, color)` with check, cross, boom, gear, key, clock, rocket, box, retry, db, shield, card, user; `badge(text, color)`; `num(n)` (solution number); `src(name)` (small "from · AWS" source tag). Set `tag: ['', 'Backend · Reliability']` on the episode to replace the "Lesson N" tag (empty hides it). `episodes/li-deploy-background-jobs/episode.js` is the reference for an animated English explainer.

Classes: `.card` (panel), `.mono`, `.h` (40px bold), `.s` (28px quiet), `.chip`, `.center` (flex center), colors `.acc` (orange accent) `.ok` (mint) `.blue` `.red` `.yel` `.q` (quiet); code tokens `.kw .ty .st .cm .nu`.
CSS vars: `--bg --panel --line --ink --quiet --acc --acc2 --blue --red --yel`.

Good visual vocabulary (use a different one each scene; at least one diagram per video, not only text):
- code card with 3–8 lines and comments in both languages via `T()`
- two side-by-side cards comparing A vs B (✓ / ✗)
- boxes and arrows (absolute-positioned divs or a small inline `<svg>`; give SVG text `font-family="Noto Sans SC"` and fill colors)
- stacked layers / pipeline / timeline / 2×2 matrix / terminal output card
- a big number or keyword card for the takeaway
- second-to-last scene: next-lesson card (`下期预告 / Next episode`); last scene: the quiz card (`考考你 / Quick quiz`)

Layout rules: keep everything inside 0–960 × 0–900; minimum text 24px; don't put more than ~6 elements in one scene; English strings run longer than Chinese, so size boxes for English (check the 4:5 and 9:16 renders).

## meta.json

```json
{
  "date": "2026-10-26",
  "topic_zh": "变量：let 和 mut", "topic_en": "Rust variables: let and mut",
  "captions": {
    "xhs":      {"title": "≤20字，有钩子", "body": "3–5 行口语正文 + 一句互动提问", "tags": ["Rust", "编程入门", "AI工程师", "碎片时间学AI工程师"]},
    "douyin":   {"title": "≤30字", "body": "1–2 行", "tags": ["Rust", "编程", "程序员"]},
    "tiktok":   {"body": "1–2 short lines, hook first", "tags": ["rust", "coding", "learntocode", "programming"]},
    "linkedin": {"title": "short hook line", "body": "3–6 short lines: the idea, why it matters, then the quiz", "tags": ["Rust", "SoftwareEngineering", "AIEngineering"]}
  },
  "quiz": {
    "q_zh": "let x = 3.0; x 是 f32 还是 f64？", "q_en": "let x = 3.0; is x an f32 or an f64?",
    "answer_zh": "答案：f64。Rust 的浮点数不写类型时默认是 f64。", "answer_en": "Answer: f64. Floats default to f64 in Rust."
  }
}
```
Every `body` ends with the quiz question (小红书 / 抖音: 「…评论区告诉我～」). `quiz.answer_zh` is the pinned first comment on 小红书 and 抖音; `answer_en` on TikTok and LinkedIn.
No links or "follow me on other platform" lines (小红书 punishes off-site redirects). No employer mentions.

## Check your work
1. `python3 engine/export.py episodes/<id>` (must run without errors).
2. `python3 engine/render.py episodes/<id> --only xhs` and open `build/<id>/sheet-xhs.png`: one frame per scene. Fix any overlap, clipping, text outside the stage or empty-looking scene.
3. For the final four cuts, also look at `sheet-linkedin.png` and `sheet-tiktok.png` (English text is longer).
