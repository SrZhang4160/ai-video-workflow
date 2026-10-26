# How to write an episode

An episode is one folder `episodes/<air date YYYY-MM-DD>/` with two files you write:

- `episode.js`: scenes, captions and visuals. `episodes/demo-rust-01/episode.js` is the reference; copy its shape and quality.
- `meta.json`: title and per-platform post copy.

The same content goes to every platform. Only the language changes: 小红书 and 抖音 get Chinese voice with zh+en captions, TikTok and LinkedIn get English voice with English captions. So every piece of text exists in both languages.

## Content rules (the reviewer rejects on any of these)
1. **Teach the viewer.** Never "today I learned"; explain it so a beginner gets it in one minute. One idea per video.
2. **Accurate.** Code must compile or run as shown. If unsure, cut it.
3. **No company promotion.** Never mention RELAI, the user's employer, its products, customers or metrics. Public tools (Rust, Cargo, Claude Code, MCP, OpenAI…) are fine.
4. **No meta labels.** No "AI voice", "made with AI", series slogans or progress bars on screen.
5. **The title is a promise.** If the title or hook asks "why" (为什么), one scene must answer the why (the design reason), not only show what happens. If the video only shows how, title it as how.
6. **Structure 总–分–总**: hook question → 2–4 points with visuals → one-line takeaway (a "一张图总结" card worth saving) → teaser for the next lesson → **comment quiz** (last scene, see below).
7. **Length**: 6–9 scenes plus the quiz scene, ~55–80 s spoken in Chinese. Chinese is spoken, conversational (咱们、其实、你看), like a person talking.

## Growth rules (小红书 pushes a note further only if people interact)
小红书 first shows a new note to a small pool (a few hundred views) and decides from interaction whether to push it further. Commonly cited (unofficial) weights: like or save = 1, comment or share = 4, follow = 8. So a comment is worth four likes: every episode is built to make people comment and save.

1. **First 3 seconds = the viewer's question.** Open with the problem or a question the viewer cares about ("面试被问到这个，你答得出吗？", "这行代码为什么编译不过？"). Never open with a self-introduction or "今天我们讲".
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
- **One caption page = one voice clip.** Pages are voiced separately (`voice/<lang>/sNN.ogg`, numbered across the episode), so the caption lands exactly on the voice and there is a pause between pages. English is paced slower on purpose (longer pauses and a 1.6 s hold after each scene, voice at 0.92× speed): keep English pages short and plain so viewers can read the visuals.

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
