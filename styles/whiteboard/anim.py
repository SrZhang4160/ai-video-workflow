"""Animate the whiteboard scenes into a narrated, captioned video.
Usage: python3 anim.py wb.html narration.json out.mp4   (TTSDIR env = voice models)"""
import json, os, re, shutil, subprocess, sys, tempfile
import numpy as np, soundfile as sf, sherpa_onnx
from playwright.sync_api import sync_playwright

HTML, NARR, OUT = sys.argv[1:4]
FPS, W, H = 30, 1080, int(os.environ.get("H", 1350)); EXTRA = os.environ.get("URLQ", "")
TTS = os.environ["TTSDIR"]; m = f"{TTS}/kokoro-multi-lang-v1_0"
tts = sherpa_onnx.OfflineTts(sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(
    kokoro=sherpa_onnx.OfflineTtsKokoroModelConfig(model=f"{m}/model.onnx", voices=f"{m}/voices.bin", tokens=f"{m}/tokens.txt",
        lexicon=f"{m}/lexicon-us-en.txt,{m}/lexicon-extra.txt", data_dir=f"{m}/espeak-ng-data", lang="en-us"),
    num_threads=4), max_num_sentences=1))
SID = int(os.environ.get("VOICE", 3))

def sentences(t): return [s for s in re.split(r"(?<=[.?!])\s+", t.strip()) if s]
def pages(s):
    words = s.split()
    if len(words) <= 10: return [s]
    n = -(-len(words) // 10); out, start = [], 0
    joins = {"by", "from", "to", "with", "so", "and", "after", "in", "but", "because", "which", "that", "if", "without"}
    for k in range(1, n):
        target = round(len(words) * k / n); best = target
        ok = lambda j: start + 3 <= j <= len(words) - 3
        hit = [target + d for d in (0, -1, 1, -2, 2) if ok(target + d) and words[target + d - 1][-1] in ",:;"]
        if not hit: hit = [target + d for d in (0, -1, 1, -2, 2) if ok(target + d) and words[target + d].lower() in joins]
        if hit: best = hit[0]
        out.append(" ".join(words[start:best])); start = best
    return out + [" ".join(words[start:])]

# ---- audio + timeline ----
narr = json.load(open(NARR)); audio, rate = [], None
timeline = []   # per scene: dict(start, dur, caps=[(t0, t1, text)])
t = lead = 0.35
audio.append(None)
for si, seg in enumerate(narr):
    shown, spoken = sentences(seg["text"]), sentences(seg["say"])
    assert len(shown) == len(spoken), f"scene {si+1}: sentence mismatch"
    s0, caps = t, []
    for k, (st, sp) in enumerate(zip(shown, spoken)):
        a = tts.generate(sp, sid=SID, speed=1.0); rate = a.sample_rate
        a = np.array(a.samples, np.float32)
        pad = 0.18 if k < len(shown) - 1 else (0.55 if si < len(narr) - 1 else 1.2)
        a = np.concatenate([a, np.zeros(int(rate * pad), np.float32)]); d = len(a) / rate
        ps = pages(st); n = sum(len(p) for p in ps); c = t
        for p in ps: caps.append((c, c + d * len(p) / n, p)); c += d * len(p) / n
        audio.append(a); t += d
    timeline.append(dict(start=s0, dur=t - s0, caps=caps))
audio[0] = np.zeros(int(rate * lead), np.float32)
total = t
tmp = tempfile.mkdtemp(prefix="anim_", dir=os.path.dirname(os.path.abspath(OUT)))
sf.write(f"{tmp}/voice.wav", np.concatenate(audio), rate)
timeline[0]["start"] = 0; timeline[0]["dur"] += lead

# ---- frames ----
url = "file://" + os.path.abspath(HTML)
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": W, "height": H})
    f = 0
    for si, sc in enumerate(timeline):
        pg.goto(f"{url}?scene={si+1}&anim=1{EXTRA}"); pg.wait_for_function("window.ready===true")
        draw = min(max(2.2, sc["dur"] * 0.55), 4.5)          # seconds to finish drawing
        nfr = round((sc["start"] + sc["dur"]) * FPS) - f
        for k in range(nfr):
            tt = f / FPS; dp = min(1.0, (tt - sc["start"]) / draw)
            dp = 1 - (1 - dp) ** 1.6                          # ease out
            cap = next((c for c0, c1, c in sc["caps"] if c0 <= tt < c1), sc["caps"][-1][2] if tt >= sc["caps"][-1][0] else "")
            pg.evaluate("([d,c,b])=>window.render(d,c,b)", [dp, cap, tt / total])
            pg.screenshot(path=f"{tmp}/f{f:05d}.jpg", type="jpeg", quality=92); f += 1
    b.close()
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", str(FPS), "-i", f"{tmp}/f%05d.jpg", "-i", f"{tmp}/voice.wav",
                "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k",
                "-shortest", "-movflags", "+faststart", OUT], check=True)
shutil.rmtree(tmp)
print(f"{OUT}: {W}x{H}, {total:.1f}s, {f} frames")
