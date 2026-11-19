# 生活里的技术 (series `life`, trial)

一分钟讲清"你每天在用、从没想过的东西"背后是怎么做到的：扫码付款、抢票、刷视频不卡。
Started 2026-11-18 as a 视频号 trial (方向 01, approved by Shuran 2026-11-18 12:59; analysis in
`~/.openclaw/workspace-wxch/directions/01-生活里的技术.md`). **Trial status: 脚本已获 Shuran 2026-11-19 批准，已出片，未排期。** 3 episodes voiced (cloned voice,
Chinese only) and rendered as the 9:16 douyin cut for 视频号; finals in `~/Desktop/AI/videos/life/`. Not in
`series/schedule.json`, not on either review board.

## Who it's for and the goal
- Viewers: people who don't write code, plus the ones who forward it to a friend who does ("你们每天干的就是这个？").
- Goal at this stage: reach and follows. Every episode states in `meta.json` → `why_follow` one sentence on why a stranger
  would follow or forward it.
- Data behind the format: the 系统设计 弹幕 episode got the account's most 视频号 plays (1323) but an average watch of 5.38 s.
  The topic pulls; the first 3–5 seconds lost them. **The opening is the first priority.**

## Episodes
- Folder `episodes/life-NN/` (`meta.json` `"track": "life"`, `"date": "TBD"` until scheduled), `script.md` = the spine plus the
  spoken draft in paragraphs. Caption lines and `episode.js` are written only after Shuran approves the wording.
- `platforms: ["douyin"]`: the 9:16 Chinese cut, which 视频号 also uses. Chinese only; no English cut for now.
- Post copy for 视频号 sits in `meta.json` → `captions.shipinhao` (title ≤ 20 字 with one concrete scene, 1–2 sentence body,
  3 topics, cover text ≤ 8 字).

## Format rules (on top of `CLAUDE.md`, `runbooks/scenes.md`, the `explainer-script` / `explainer-series` skills)
1. **First 3 seconds = a concrete scene or a surprising question** the viewer has lived ("付钱时手机一直转圈…"). No
   self-introduction, no series intro, no 「这期讲…」. By second 5 there is a suspense the rest of the video pays off.
2. **One everyday scene, one mechanism.** The spine is a chain: each part ends by raising the question the next part answers.
   Conclusion first, then why (因为…所以…). One concept per paragraph.
3. **Plain words.** Never open with a term. A term appears only after the thing it names has been explained, defined by what it
   does (「同一件事做一次和做十次结果都一样，程序员管这个叫幂等」). The term is the gift to the viewer's engineer friend.
4. **Something to use.** Each episode leaves one thing the viewer can do differently (付款转圈先查账单别重扫; 没抢到别马上走;
   没看的视频也耗流量).
5. **Ending**: one line that makes the viewer think of a specific person to send it to (「下次家里谁…，把这条发给他」), not a hard
   ask; then one A/B question answerable in a comment. No 「关注我」.
6. **No names of companies or apps**: 支付软件, 购票平台, 视频软件. No employer, no "what I learned" framing, no AI-voice / AI-made labels,
   no slogans, no progress bar, no pointers to other platforms.
7. **Accurate or cut.** Say "很多/通常/有时候" where it is practice, not a rule; no invented numbers.
8. **Length**: 60–90 s spoken at 305–330 字/分钟 ≈ 300–450 字.
9. **Look**: the whiteboard style (`styles/whiteboard/board.html`) with one series colour, teal `#0F8B8D` (`LIFE_C` in each
   `episode.js`: the system side, order numbers, key terms). Scene 1 is drawn with `at(-1)`, so the scene is on screen at
   t = 0, before the first word. Covers (视频号): `python3 series/life-tech/cover.py [--desktop] life-01 …` → `build/<id>/cover.png`:
   one big drawing of the episode's own example (same helpers and colours as the video) + the `cover.zh` hook on one line;
   no 第 N 集, no series mark (视频号 is a feed, Shuran 2026-11-19). All of it inside the centre 3:4 band (y 240–1680).

## Judging the trial (from directions/01)
Read 72 h and 7 days after each post. Pass if at least 2 of 3 episodes have average watch ≥ 10 s and 完播 ≥ 5%, plus ≥ 2 new
followers in total and ≥ 1 forward on at least one episode. Pass → 5 more; one item short → change the opening, test 3 more;
all short → drop the direction.

## Trial episodes
| id | 题目 | why_follow |
|---|---|---|
| life-01 | 付款时转圈又点一次，会扣两次钱吗？ | 人人都有过付款转圈的慌，答案里还带一个能省钱的动作（别退出去重扫），外加一个能拿去问程序员朋友的词：幂等。 |
| life-02 | 演唱会抢票，那一秒服务器在干什么？ | 抢过票的人都想知道自己输在哪；看完知道「没抢到别马上走，过一会儿还会回流」，会转给一起抢票的朋友。 |
| life-03 | 刷视频为什么不卡？它早就被放在你家附近了 | 反直觉的开头（视频就在你家附近），结尾落到每个人都关心的流量，会转给总说流量不够用的家里人。 |
