# 《逆袭架构师》· 系统设计短剧 (series `sd`)

From 2026-11-04 the 系统设计 series is a serialized micro-drama in the 红果短剧 style, not a 1-minute lesson. Same pipeline (weekly batch, cloned voice, nightly build, reminders), with these differences:

- **Own review board**: https://claude.ai/artifact/HGq19vhF8JP5TSqmVysLyG (`board/sd.html`, db collection `episodes`, doc id `<date>-sd`, plus `config/schedule`). The main board ignores `track: "sd"`. `series/schedule.json` → `series.sd.board`.
- **Length**: 2–3 minutes. 12–16 scenes plus the quiz scene, about 600–850 Chinese characters spoken. Drama episodes render with a tighter pace and English sped up 1.12× (`PACE_DRAMA` / `TEMPO_DRAMA` in `engine/render.py`), but English still runs longer than Chinese: write English captions shorter than a literal translation (aim ≤ 50 characters a page, drop filler) so the English cut stays under ~3.5 min. Ep 1 came out at 3:22 zh / 4:09 en.
- **One episode = one curriculum lesson** (`curriculum.md`, in order). Episode number `n` in `episode.js` = drama episode number (ep 1 = lesson 3 on 2026-11-04; ep k = lesson k + 2). `meta.json` has `"track": "sd"`, `"format": "drama"`; `episode.js` has `theme: 'drama'` (tag shows 第N集).
- Read `series/system-design/story.md` for the cast and what has happened so far, and append one line to it per episode written.

## Voice: 解说 narrator
One narrator, the user's cloned voice, tells the story like a 短剧解说 account. Characters never get their own voice: their lines appear as speech bubbles / chat messages, and the narrator quotes them ("铁柱冷笑：……"). Short punchy sentences, present tense, spoken Chinese.

## Story engine: 真人短剧 logic (职场逆袭 + 马甲 + 复仇, with a slow-burn 欢喜冤家 line)
What works in live-action short dramas now (2026): 逆袭复仇, 职场, 现实题材, 甜宠 are the strongest genres; viewers are tired of reversals and 打脸 for their own sake ("三秒反转、十秒打脸" alone no longer carries a show): twists need a reason, characters need motives, the setting must feel real. Our edge: every 打脸 is won with correct engineering, which is exactly the "logic" audiences now want.

**Premise (the series bible; keep it consistent)**
- 林小满 (`man`): joins a fast-growing livestream e-commerce startup as an "intern". 马甲: she is secretly "Z", the architect behind a famous 双十一-scale system at a big tech company, who left after her design was credited to someone else. Calm, precise, never raises her voice; wins with numbers.
- 铁柱 (`kai`, English "Tiezhu"): the startup's tech director. Strikingly handsome, bossy (颐指气使), trusts gut feeling, humiliates juniors in public. Secret: years ago he was on the team that took credit for Z's design, and he has built his reputation on it. He does not know 小满 is Z. Slow-burn 欢喜冤家 tension between them (sparks, never romance-first; the show stays about engineering).
- 王总 (`wang`): the founder-CEO who promises the impossible (top streamers, flash sales, IPO). Rewards whoever saves the day.
- Long arc: each episode 小满 saves the company with one concept; 铁柱 takes a 打脸 but grows suspicious ("你到底是谁？"); every ~5 episodes a 马甲 clue drops (a code comment signed Z, an old colleague who recognizes her, a conference photo); the full reveal and 铁柱's reckoning come at a season finale. New characters (an old colleague, a rival company's CTO, an investor) may be added through `EPISODE.cast` and must be listed in `story.md`.

**Every episode (2–3 min)**
1. **Hook, first 3 s**: open at the hottest moment, not background. Use one of: a public humiliation line ("实习生也配谈架构？"), a countdown or flash-forward ("三分钟后，整个系统会崩"), a stakes question ("一千万人，一台服务器够吗？"), or a 马甲 tease ("没人知道，这个实习生……"). First caption page ≤ 15 characters.
2. **Setup (≤ 20 s)**: the new crisis in a real setting (see below), shown through chat screens, alerts, faces.
3. **Conflict**: 铁柱 (or another antagonist) proposes the wrong fix with total confidence and puts 小满 down; the wrong idea is a real, common misconception.
4. **First reversal (~40 s)**: 小满 calmly says why it's wrong; the room doesn't believe her.
5. **The lesson = the 爽点**: she proves it on the whiteboard/screen: diagrams and arithmetic, correct and labelled where assumed. The 打脸 lands because the math is right.
6. **Second reversal (~1:40)**: a complication (the fix has a cost, a new constraint, 铁柱 pushes back with a half-valid point) that makes the concept deeper, not just a victory lap. Sometimes 小满 is the one who learns something.
7. **一张图总结**: the cheat-sheet card worth saving.
8. **追更 cliffhanger**: a new problem or a 马甲 clue that leads into the next lesson (红果 is ad-supported and free, so the cliffhanger drives follows and 追更, not a paywall).
9. **下集预告** card, then the **考考你** quiz scene (same rules as every series).
Rhythm: a beat that changes the power balance every 30–40 s. Narrator sentences short and present tense; let the characters' bubble lines carry the attitude.

**Real settings to rotate** (they double as the live-action shot settings): 凌晨两点的工位（只剩一盏灯）· 大促作战室（满墙监控大屏、倒计时）· 会议室公开处刑（投影、全员在场）· 直播间后台（主播、补光灯、实时在线人数）· 电梯里的狭路相逢 · 天台/茶水间的对峙 · 服务器机房 · 年会/融资路演的大屏幕.

**Live-action shots** (for the video-generation pilot): `meta.json` → `shots`: 4–6 entries `{scene, setting, prompt_en, seconds: 5}` for the most dramatic beats (hook, humiliation, reversal, cliffhanger). `prompt_en` describes a photo-realistic vertical shot of the fictional characters (林小满: East Asian woman, late 20s, ponytail, plain hoodie, calm sharp eyes; 铁柱: very handsome East Asian man, early 30s, side-swept black hair, tailored dark suit, gold chain, arrogant smirk; 王总: East Asian man, 50s, receding hair, brown jacket), the setting, the action, the camera move and the mood. Never resemble a real celebrity; no text, logos or screens with readable numbers in the shot (numbers stay in our own diagrams).

Accuracy rules still win over drama: the story serves the concept, never the other way round. Assumptions (server capacity, user counts) are labelled on screen. No real company names for the startup or 小满's former employer ("某大厂" is fine); public tools (Redis, Kafka…) are fine. No employer mentions.

## Visual kit (engine/lesson.html)
`actor(id, x, y, size, mood, attrs)` drawn character with name plate (moods: calm smug shock angry happy think), `who(id, size, mood)` bare portrait, `say(id, zh, en, {x, y, w, side, size, attrs})` speech bubble (`id` null = thought / narrator bubble), `phone(title, msgs, {x, y, w, h, attrs})` chat screen (`msgs` = `[[id, zh, en]]`, id `me` = 小满's own message), `alarm(zh, en, {x, y, w, attrs})` red monitoring alert. Pass timing attributes (`data-cap`, `data-in`…) through `attrs`. Mix them with the usual diagrams and cards; every episode still needs at least one real diagram or calculation.
Reference episode: `episodes/2026-11-04-sd/`.
