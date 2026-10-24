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
5. **Structure 总–分–总**: hook question → 2–4 points with visuals → one-line takeaway → teaser for the next lesson.
6. **Length**: 6–9 scenes, ~55–75 s spoken in Chinese. Chinese is spoken, conversational (咱们、其实、你看), like a person talking.

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
- **One scene = one voice clip.** The voice file for scene k is `voice/<zh|en>/sKK.wav`.

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

Classes: `.card` (panel), `.mono`, `.h` (40px bold), `.s` (28px quiet), `.chip`, `.center` (flex center), colors `.acc` (orange accent) `.ok` (mint) `.blue` `.red` `.yel` `.q` (quiet); code tokens `.kw .ty .st .cm .nu`.
CSS vars: `--bg --panel --line --ink --quiet --acc --acc2 --blue --red --yel`.

Good visual vocabulary (use a different one each scene; at least one diagram per video, not only text):
- code card with 3–8 lines and comments in both languages via `T()`
- two side-by-side cards comparing A vs B (✓ / ✗)
- boxes and arrows (absolute-positioned divs or a small inline `<svg>`; give SVG text `font-family="Noto Sans SC"` and fill colors)
- stacked layers / pipeline / timeline / 2×2 matrix / terminal output card
- a big number or keyword card for the takeaway
- last scene: next-lesson card (`下期预告 / Next episode`)

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
    "linkedin": {"title": "short hook line", "body": "3–6 short lines: the idea, why it matters, one question to the reader", "tags": ["Rust", "SoftwareEngineering", "AIEngineering"]}
  }
}
```
No links or "follow me on other platform" lines (小红书 punishes off-site redirects). No employer mentions.

## Check your work
1. `python3 engine/export.py episodes/<id>` (must run without errors).
2. `python3 engine/render.py episodes/<id> --only xhs` and open `build/<id>/sheet-xhs.png`: one frame per scene. Fix any overlap, clipping, text outside the stage or empty-looking scene.
3. For the final four cuts, also look at `sheet-linkedin.png` and `sheet-tiktok.png` (English text is longer).
