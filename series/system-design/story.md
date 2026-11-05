# 《逆袭架构师》· story so far

Cast (engine `CAST`): 铁柱 `man` (Tiezhu, male intern backend engineer, day 3 at the start, calm and precise) · 周凯 `kai` (tech director, smug, glasses, trusts gut feeling) · 王总 `wang` (CEO, promises big launches).
The startup: an unnamed e-commerce app that sells through livestreams.

One line per episode, newest last (date · ep · lesson · what happened · cliffhanger):
- 2026-11-04 · 第1集《一千万人涌进来》 · lesson 3 估算 QPS · 王总 announces a top streamer's live sale (10M viewers); 周凯 divides 1 亿 requests by a whole day (≈1,157 QPS, "one server"); 铁柱 uses the 10-minute peak (≈17 万 QPS, ≈85 servers at an assumed 2,000 QPS each) and wins · cliffhanger: 3 minutes into the stream the database disk hits 99%, writes fail → next: 《磁盘满了》, storage estimation (lesson 4).
