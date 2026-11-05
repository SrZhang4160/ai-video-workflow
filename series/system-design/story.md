# 《逆袭架构师》· story so far

Cast (engine `CAST`): 林小满 `man` (intern backend engineer, day 3 at the start, calm and precise) · 铁柱 `kai` (Tiezhu, a woman, tech director: stunning 御姐 look, smug, bossy, trusts gut feeling) · 王总 `wang` (CEO, promises big launches).
The startup: an unnamed e-commerce app that sells through livestreams.
Hidden arc (see README → Premise): 小满 is secretly "Z", the architect behind a 双十一-scale system at 某大厂, whose design was credited to others; 铁柱 was on that team and built her name on it. 铁柱 does not know; the audience only gets teases at first. First 马甲 clue: ep 2 or 3. Full reveal: season finale.

One line per episode, newest last (date · ep · lesson · what happened · cliffhanger):
- 2026-11-04 · 第1集《一千万人涌进来》 · lesson 3 估算 QPS · 王总 announces a top streamer's live sale (10M viewers); 铁柱 divides 1 亿 requests by a whole day (≈1,157 QPS, "one server"); 小满 uses the 10-minute peak (≈17 万 QPS, ≈85 servers at an assumed 2,000 QPS each) and wins · cliffhanger: 3 minutes into the stream the database disk hits 99%, writes fail → next: 《磁盘满了》, storage estimation (lesson 4).
