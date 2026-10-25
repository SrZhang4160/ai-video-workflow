# Whiteboard (sketchy) style: used for LinkedIn deep dives

Reference from the continual-learning LinkedIn video (posted 2026-10): cream dot-grid paper (#FBF8F1),
Caveat handwriting font, rough.js boxes/arrows drawn stroke by stroke, two-line scene titles
(black line + red underlined line), hachure fills, captions in handwriting at the bottom.
Colors: ink #222, red #E8553E, dark red #B8321D, green #1E9E5A, blue #1F6FEB, yellow #FFE38A, grey #666.

- `wb.html`: the scene drawings (one JS function per scene, rough.js) + caption box. The `hdr` series banner and the
  red progress `bar` exist in the file but must stay hidden (user rule: no series line, no progress bar).
- `anim.py`: old renderer (Kokoro voice, draw-on animation via stroke-dash). Superseded for voice handling by
  `engine/render.py` (per-caption-page clips, user's cloned voice, slower English pacing); port the draw-on
  animation idea into the engine or a whiteboard variant of `lesson.html` when building the next sketch video.
- `narration-cl.json`: that video's narration. `storyboard-continual-learning.png`: what it looked like.

Setup: `cd styles/whiteboard && npm install`.
