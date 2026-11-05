"""Editor step 0 (drama v2): find natural cut points for every acted shot from its actual speech.

  ~/cosyvoice3/.venv/bin/python engine/edit_points.py episodes/2026-11-04-sd

Runs Whisper (word timestamps) on each live shot with dialogue and writes shot["edit"] into storyboard.json:
  {"in": s, "out": s, "cap_at": [s, ...]}   (cap_at relative to "in": when each dialogue line starts)
The cut starts PRE seconds before the first word and ends POST seconds after the last one, so conversations flow
shot to shot instead of waiting through dead air. Shots without dialogue keep their storyboard length.
Run again after a reshoot (it only touches shots whose clip changed, unless --all).
"""
import argparse, hashlib, json, os, re, warnings

warnings.filterwarnings("ignore")
PRE, POST, MIN = 0.12, 0.28, 1.0


def onset(clip):
    """Seconds until the clip's audio first gets loud (speech or the first sound)."""
    import subprocess, tempfile, numpy as np, soundfile as sf
    w = tempfile.mktemp(suffix=".wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", clip, "-vn", "-ac", "1", "-ar", "16000", w])
    x, sr = sf.read(w); os.remove(w); f = int(sr * 0.02)
    e = np.array([np.sqrt((x[k:k + f] ** 2).mean()) for k in range(0, len(x) - f, f)])
    on = np.where(e > max(0.01, 0.15 * np.percentile(e, 95)))[0]
    return on[0] * 0.02 if len(on) else 0.0


def sig(path):
    return hashlib.sha1(open(path, "rb").read()).hexdigest()[:12]


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("episode"); ap.add_argument("--all", action="store_true")
    a = ap.parse_args()
    import whisper
    ep = os.path.abspath(a.episode); p = os.path.join(ep, "storyboard.json")
    sb = json.load(open(p)); m = None
    for s in sb["shots"]:
        clip = os.path.join(ep, "clips", f"shot{s['id']:02d}.mp4")
        if s["gen"]["mode"] != "live" or not s.get("dialogue") or not os.path.exists(clip):
            continue
        if not a.all and s.get("edit", {}).get("sig") == sig(clip):
            continue
        m = m or whisper.load_model("small")
        r = m.transcribe(clip, language="zh", fp16=False, word_timestamps=True, initial_prompt="以下是普通话的句子。")
        words = [w for seg in r["segments"] for w in seg.get("words", []) if re.sub(r"[\W_]", "", w["word"])]
        if not words:
            continue
        dur = float(r["segments"][-1]["end"]) if r["segments"] else s["seconds"]
        first = words[0]["start"]
        if first < 0.05:                       # Whisper often pins the first word to 0.00: use where sound begins
            first = max(first, onset(clip))
            shift = first - words[0]["start"]
            for w in words[:1]:
                w["start"] = first
        t_in = max(0.0, first - PRE)
        t_out = min(max(dur, words[-1]["end"]), words[-1]["end"] + POST)
        if t_out - t_in < MIN:
            t_out = t_in + MIN
        # line starts: split the words where the gap is largest (one split per extra dialogue line)
        n = len(s["dialogue"]); starts = [words[0]["start"]]
        if n > 1:
            gaps = sorted(((words[i + 1]["start"] - words[i]["end"], i + 1) for i in range(len(words) - 1)), reverse=True)[: n - 1]
            starts += [words[i]["start"] for _, i in sorted(gaps, key=lambda g: g[1])]
        s["edit"] = {"in": round(t_in, 2), "out": round(t_out, 2), "cap_at": [round(max(0.0, t - t_in - 0.05), 2) for t in starts],
                     "sig": sig(clip)}
        print(f"shot {s['id']:>2}: {s['seconds']}s → {t_out - t_in:.2f}s  (in {t_in:.2f}, lines at {s['edit']['cap_at']})")
    json.dump(sb, open(p, "w"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
