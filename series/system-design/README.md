# 《逆袭架构师》· 系统设计短剧 (series `sd`)

From 2026-11-04 the 系统设计 series is a serialized micro-drama in the 红果短剧 style, not a 1-minute lesson. Same pipeline (weekly batch, cloned voice, nightly build, reminders), with these differences:

- **Own review board**: https://claude.ai/artifact/HGq19vhF8JP5TSqmVysLyG (`board/sd.html`, db collection `episodes`, doc id `<date>-sd`, plus `config/schedule`). The main board ignores `track: "sd"`. `series/schedule.json` → `series.sd.board`.
- **Length**: 2–3 minutes. 12–16 scenes plus the quiz scene, about 600–850 Chinese characters spoken. Drama episodes render with a tighter pace and English sped up 1.12× (`PACE_DRAMA` / `TEMPO_DRAMA` in `engine/render.py`), but English still runs longer than Chinese: write English captions shorter than a literal translation (aim ≤ 50 characters a page, drop filler) so the English cut stays under ~3.5 min. Ep 1 came out at 3:22 zh / 4:09 en.
- **One episode = one curriculum lesson** (`curriculum.md`, in order). Episode number `n` in `episode.js` = drama episode number (ep 1 = lesson 3 on 2026-11-04; ep k = lesson k + 2). `meta.json` has `"track": "sd"`, `"format": "drama"`; `episode.js` has `theme: 'drama'` (tag shows 第N集).
- Read `series/system-design/story.md` for the cast and what has happened so far, and append one line to it per episode written.

## Voice: 解说 narrator
One narrator, the user's cloned voice, tells the story like a 短剧解说 account. Characters never get their own voice: their lines appear as speech bubbles / chat messages, and the narrator quotes them ("铁柱冷笑：……"). Short punchy sentences, present tense, spoken Chinese.

## Story engine
Ongoing plot: 林小满 (`man`), an intern backend engineer at a startup that keeps growing too fast; 铁柱 (`kai`, English "Tiezhu"), the smug, bossy and strikingly handsome tech director (颐指气使; the classic 逆袭 name, given to the villain on purpose) who looks down on her; 王总 (`wang`), the CEO who promises the impossible. New characters may be added through `EPISODE.cast` (same fields as `CAST` in `engine/lesson.html`) and must then be listed in `story.md`.
Every episode:
1. **Hook (first 3 s)**: the conflict or the question, not background. ("一千万人，一台服务器够吗？")
2. **Setup**: the new crisis (a launch, an outage, a boss's promise), shown as chat screens, alerts, faces.
3. **Conflict**: someone (usually 铁柱) proposes the wrong fix, with confidence.
4. **反转 / 爽点**: 小满 shows why it's wrong and teaches the concept: this is the lesson, with diagrams and the arithmetic on screen. The wrong idea must be a common real misconception, and the fix must be correct.
5. **一张图总结**: a cheat-sheet card worth saving (the takeaway of the lesson).
6. **Cliffhanger**: a new problem that leads into the next lesson.
7. **下集预告** card (title of the next episode + the concept), then the **考考你** quiz scene (same rules as every series).

Twists can vary (爆爽 打脸, 反转, flashback, 小满 being wrong once and learning), but the teaching must stay accurate: the story serves the concept, never the other way round. Assumptions (server capacity, user counts) are labelled as assumptions on screen. No real company names for the startup; public tools (Redis, Kafka…) are fine. No employer mentions.

## Visual kit (engine/lesson.html)
`actor(id, x, y, size, mood, attrs)` drawn character with name plate (moods: calm smug shock angry happy think), `who(id, size, mood)` bare portrait, `say(id, zh, en, {x, y, w, side, size, attrs})` speech bubble (`id` null = thought / narrator bubble), `phone(title, msgs, {x, y, w, h, attrs})` chat screen (`msgs` = `[[id, zh, en]]`, id `me` = 小满's own message), `alarm(zh, en, {x, y, w, attrs})` red monitoring alert. Pass timing attributes (`data-cap`, `data-in`…) through `attrs`. Mix them with the usual diagrams and cards; every episode still needs at least one real diagram or calculation.
Reference episode: `episodes/2026-11-04-sd/`.
