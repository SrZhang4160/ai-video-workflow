# 《逆袭架构师》AI 视频流水线 v2：剧组制

v1 was a narrated explainer with pictures (a narrator reads, characters only appear as bubbles). v2 is a crew: every
episode is **acted**: characters move, talk to each other and react; the system-design concept comes out of their
confrontation. Each role is a separate agent (fresh context, its own brief) or a script, and hands the next one a file.

```
 剧本圣经 bible            README.md (premise, rules) · story.md (what happened) · cast/ (fixed faces) · sets/ (fixed locations)
      │
 1 编剧 writer agent ───► beats.md         logline, the one concept, beat sheet (hook → conflict → reversal → lesson → reversal 2 → cliffhanger), key lines
      │
 2 技术审核 tech reviewer ► (approve / fix)  every number, claim and the quiz are correct; assumptions labelled
      │
 3 导演 director agent ──► storyboard.json  分镜: shot by shot — 景别, camera, action, performance, dialogue, SFX, overlay, generation prompt
      │                    storyboard.md    the same, readable (what the user reviews on the board)
 4 导演复核 director check  (second director pass, fresh eyes) "is every beat acted, not told?"; pacing; continuity
      │
 5 拍摄 shoot: engine/shots.py   per shot: first frame (FLUX Kontext + cast & set refs) → motion (Kling 3.0, faces as elements)
 6 配音 voice                    dialogue lines per character + the two narrator cards (voice plan: see "Open decisions")
 7 剪辑 edit: engine/render.py   cuts the shots in storyboard order, dialogue subtitles (speaker-colored), overlays (diagrams/calc drawn by
      │                         the engine, so numbers are exact), SFX/BGM, the quiz card; 4 platform cuts
 8 导演看片 director review      looks at the contact sheet + key frames of each shot; marks reshoots (max 1 round per episode)
      │
 9 审核台 board ► the user       storyboard first (cheap: approve before any money is spent on shots), then the cut
```

## Files per episode (`episodes/<date>-sd/`)
- `beats.md` (writer), `storyboard.json` + `storyboard.md` (director), `meta.json` (titles, post copy, quiz), `clips/` (shots, Mac-only),
  `voice/` (audio). `episode.js` is generated from `storyboard.json` by the editor step (no hand-written scenes for drama episodes).

## storyboard.json (the director's output; the contract between director, shoot, voice and edit)
```json
{
  "episode": 1, "title_zh": "一千万人", "title_en": "Ten Million", "lesson": 3,
  "runtime_target_s": 120,
  "shots": [
    {
      "id": 1,
      "location": "meeting_room_night",          // a set from sets/ (keeps the place consistent)
      "shot_size": "CU",                         // ECU CU MCU MS WS OTS 2S INSERT CARD
      "camera": "slow push-in",                  // static, push-in, pull-out, pan, handheld, whip-pan …
      "seconds": 3,
      "cast": ["kai", "man"],
      "action": "铁柱 sets a coffee down hard in front of 小满, leans in, smirks.",
      "performance": {"kai": "contempt, amused", "man": "still, unreadable"},
      "dialogue": [{"who": "kai", "zh": "实习生，也配谈架构？", "en": "An intern, talking architecture?"}],
      "narration": null,                         // only for time cards / next-episode card
      "sfx": "cup thud, room goes silent",
      "overlay": null,                           // {"kind": "calc"|"diagram"|"card", "content": …} drawn by the engine, exact numbers
      "gen": {"mode": "live", "prompt_en": "…{kai}…{man}…"},   // live = generated shot; card = engine-only (no cost)
      "purpose": "HOOK: humiliation in the first 3 s"
    }
  ]
}
```

## Budget guard
Live shots cost ≈ $0.14 per second + $0.08 per first frame (fal, Nov 2026). The director keeps an episode at **≤ 18 live shots
and ≤ 90 live seconds** (≈ $14); cards and overlays are free. Reshoots: at most 1 round, ≤ 4 shots.

## Open decisions (the user decides)
- **Dialogue voices.** Characters now speak. Options: (a) Kling native audio with lip-sync, a distinct voice per character
  (most realistic; breaks the "all audio in my cloned voice" rule for this series); (b) the user's cloned voice for 小满 only,
  other characters by AI voices; (c) everything in the cloned voice (one voice for all characters — reads as one person).
- **Cost per episode.** An acted 2-minute episode is mostly live shots: ≈ $12–20 with retries, ≈ $400–600/month at one a day.
  Cheaper: fewer, longer shots; shorter episodes; or 3–4 acted episodes a week.
