"""Chinese speaking-rate standard: every voiced line (caption page) at 305–330 字/分钟, evenly.

  python3 engine/pace.py                      # audit every episode's Chinese voice, line by line
  python3 engine/pace.py episodes/2026-11-04  # one episode
  python3 engine/pace.py --after              # rates after render.py's tempo fix (what the video will have)

How a line is measured (the same rule render.py uses to fix it):
  字数   = spoken syllables: each 汉字 1; each digit 1 (a % adds 3, 百分之); an all-caps acronym 1 per letter
           (API = 3); any other Latin word 1 per vowel group (Claude = 1, token = 2, Python = 2).
  时长   = the line's clip with leading/trailing silence trimmed (render.trim), pauses inside the line included,
           pauses between caption pages not included (those are render.py's PACE gaps).
  语速   = 字数 / 时长 × 60.  Standard: 305 ≤ 语速 ≤ 330 for every line.
How render.py enforces it on every Chinese clip (cloned, hand-recorded or AI):
  1. tighten: breath/noise at the ends trimmed; pauses inside the line longer than 0.25 s become 0.18 s
  2. even_out: if the line is still outside the band, atempo (pitch kept) to TARGET, within MAX_FIX.
     A line that needs more than MAX_FIX is flagged 需重配 by the audit: re-voice or reword it.
Lines shorter than MIN_CHARS (e.g. "对。") are reported but not judged: one or two syllables can't be timed fairly.
"""
import os, re, sys, json

LOW, HIGH, TARGET = 305, 330, 318
MIN_CHARS = 4
MAX_FIX = (0.80, 1.60)          # atempo range render.py may apply; beyond it the line needs re-voicing

_HAN = re.compile(r"[一-鿿㐀-䶿]")
_TOK = re.compile(r"[A-Za-z]+|\d+(?:\.\d+)?%?")


def zh_chars(text):
    """Spoken syllables in a Chinese voice line (see module doc)."""
    n = len(_HAN.findall(text))
    for t in _TOK.findall(text):
        if t[0].isdigit():
            n += sum(c.isdigit() for c in t) + (3 if t.endswith("%") else 0)
        elif t.isupper() and len(t) <= 5:
            n += len(t)
        else:
            n += max(1, len(re.findall(r"[aeiouy]+", t.lower())) - (1 if t.lower().endswith("e") and len(t) > 3 else 0))
    return n


def rate(chars, seconds):
    return chars / seconds * 60 if seconds > 0 else 0.0


def fix_factor(chars, seconds):
    """atempo factor that brings a line into the band (1.0 when already inside or too short to judge)."""
    if chars < MIN_CHARS or seconds <= 0:
        return 1.0
    r = rate(chars, seconds)
    if LOW <= r <= HIGH:
        return 1.0
    return min(max(TARGET / r, MAX_FIX[0]), MAX_FIX[1])


def tighten(x, sr, max_gap=0.25, keep=0.18, rel_db=28, pad=0.06):
    """Trim breath/noise at both ends (pad seconds kept) and shorten pauses inside the clip longer than max_gap to
    keep seconds. "Quiet" is relative to the clip's own loudness (rel_db below its loud frames), so room noise and
    breaths count as quiet whatever the recording level."""
    import numpy as np
    f = int(sr / 100)
    n = len(x) // f
    if n < 3:
        return x
    db = 20 * np.log10(np.sqrt(np.mean(x[:n * f].reshape(n, f) ** 2, axis=1)) + 1e-9)
    quiet = db < max(-40, np.percentile(db, 95) - rel_db)
    if quiet.all():
        return x
    lo, hi = int(np.argmax(~quiet)), n - int(np.argmax(~quiet[::-1]))
    out, k, p = [x[max(0, lo * f - int(pad * sr)):lo * f]], lo, int(pad * sr)
    while k < hi:
        j = k
        while j < hi and quiet[j] == quiet[k]:
            j += 1
        seg = x[k * f:j * f]
        if quiet[k] and (j - k) / 100 > max_gap:
            h = int(keep * sr / 2)
            seg = np.concatenate([seg[:h], seg[-h:]])
        out.append(seg); k = j
    out.append(x[hi * f:hi * f + p])
    y = np.concatenate(out)
    r = min(int(0.012 * sr), len(y) // 2)
    if r:
        w = np.linspace(0, 1, r, dtype=y.dtype); y = y.copy(); y[:r] *= w; y[-r:] *= w[::-1]
    return y


def even_out(clip, text, sr, tempo):
    """The standard applied to one Chinese clip: tighten, then tempo into the band. Returns (clip, factor)."""
    clip = tighten(clip, sr)
    f = fix_factor(zh_chars(text), len(clip) / sr)
    return (tempo(clip, f) if abs(f - 1) > 0.005 else clip), f


def audit(ep_dir, after=False):
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    import render
    txt = os.path.join(ep_dir, "voice", "zh.txt")
    if not os.path.exists(txt):
        return None
    rows = []
    for i, line in enumerate(open(txt, encoding="utf-8").read().splitlines(), 1):
        if not line.strip():
            continue
        path, kind = render.own_voice(ep_dir, "zh", i, line)
        if not path:
            rows.append({"i": i, "text": line, "chars": zh_chars(line), "sec": None, "rate": None, "src": "none"}); continue
        clip = render.trim(render.load_audio(path))
        c, raw, tight = zh_chars(line), len(clip) / render.SR, len(tighten(clip, render.SR)) / render.SR
        need = TARGET / rate(c, tight) if c >= MIN_CHARS and not LOW <= rate(c, tight) <= HIGH else 1.0
        s = tight / fix_factor(c, tight) if after else raw
        rows.append({"i": i, "text": line, "chars": c, "sec": round(s, 2), "rate": round(rate(c, s)), "src": kind,
                     "need": round(need, 2)})
    return rows


def verdict(r):
    if r["rate"] is None: return "无配音"
    if r["chars"] < MIN_CHARS: return "短句不计"
    if not LOW <= r["rate"] <= HIGH and not MAX_FIX[0] <= r.get("need", 1) <= MAX_FIX[1]: return "需重配"
    if r["rate"] < LOW: return "太慢"
    if r["rate"] > HIGH: return "太快"
    return "达标"


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    after = "--after" in sys.argv
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    eps = args or sorted(os.path.join(root, "episodes", d) for d in os.listdir(os.path.join(root, "episodes")))
    summary = []
    for ep in eps:
        rows = audit(os.path.abspath(ep), after)
        if not rows:
            continue
        judged = [r for r in rows if r["rate"] is not None and r["chars"] >= MIN_CHARS]
        ok = sum(LOW <= r["rate"] <= HIGH for r in judged)
        chars, secs = sum(r["chars"] for r in judged), sum(r["sec"] for r in judged)
        name = os.path.basename(ep.rstrip("/"))
        print(f"\n== {name}  达标 {ok}/{len(judged)}  平均 {rate(chars, secs):.0f} 字/分"
              f"  范围 {min((r['rate'] for r in judged), default=0)}–{max((r['rate'] for r in judged), default=0)}")
        for r in rows:
            v = verdict(r)
            if v != "达标" or "-v" in sys.argv:
                print(f"  s{r['i']:02d} {str(r['rate'] or '-'):>4} 字/分 {r['chars']:3d}字 {r['sec'] or 0:5.2f}s  {v:4s}  {r['text']}")
        summary.append({"episode": name, "ok": ok, "lines": len(judged), "avg": round(rate(chars, secs)),
                        "rows": [dict(r, verdict=verdict(r)) for r in rows]})
    out = os.path.join(root, "build", "pace-audit" + ("-after" if after else "") + ".json")
    os.makedirs(os.path.dirname(out), exist_ok=True); json.dump(summary, open(out, "w"), ensure_ascii=False, indent=1)
    tot = sum(s["lines"] for s in summary); ok = sum(s["ok"] for s in summary)
    print(f"\n合计 达标 {ok}/{tot} 句 → {out}")


if __name__ == "__main__":
    main()
