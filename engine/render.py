"""Render one episode into platform videos.

  python3 engine/render.py episodes/2026-10-26                 # all 4 platforms
  python3 engine/render.py episodes/2026-10-26 --only xhs      # just the 小红书 draft
  python3 engine/render.py episodes/2026-10-26 --status        # {"zh": [voiced, scenes], "en": [...]}

Reads   episodes/<id>/episode.js            scenes + bilingual captions
        episodes/<id>/voice/<zh|en>/sNN.ogg  your cloned voice (Mac voice job), checked against manifest.json
        episodes/<id>/voice/<zh|en>/sNN.wav  or a hand recording (no manifest entry)
Writes  build/<id>/<platform>.mp4, build/<id>/<platform>-cover.png, build/<id>/report.json
Scenes without a current voice clip fall back to the Kokoro AI voice (report.json says which).
"""
import argparse, hashlib, json, os, re, shutil, subprocess, tempfile
import numpy as np, soundfile as sf

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENGINE = os.path.join(ROOT, "engine")
PLATFORMS = {            # ratio, language
    "xhs":      ("3x4", "zh"),   # 小红书 1080×1440
    "douyin":   ("9x16", "zh"),  # 抖音 1080×1920
    "tiktok":   ("9x16", "en"),  # TikTok 1080×1920
    "linkedin": ("4x5", "en"),   # LinkedIn 1080×1350
}
SIZES = {"3x4": (1080, 1440), "9x16": (1080, 1920), "4x5": (1080, 1350)}
LEAD, TAIL, FPS, SR = 0.35, 0.55, 24, 24000


def load_audio(path):
    x, r = sf.read(path, dtype="float32")
    if x.ndim > 1:
        x = x.mean(axis=1)
    return resample(x, r)


def resample(x, r):
    if r == SR:
        return x
    n = int(len(x) * SR / r)
    return np.interp(np.linspace(0, len(x) - 1, n), np.arange(len(x)), x).astype(np.float32)


def scene_text(caps, lang):
    """What the voice says for one scene; must match the line export.py writes to voice/<lang>.txt."""
    return ("" if lang == "zh" else " ").join(c["say_" + lang] for c in caps).strip()


def vkey(lang, line):
    return hashlib.sha1(f"{lang}|{line.strip()}".encode()).hexdigest()[:16]


def own_voice(ep_dir, lang, i, text):
    """Your voice for scene i if it is current: a hand recording sNN.wav (no manifest entry),
    or a cloned sNN.ogg whose manifest hash matches the scene's current text."""
    vdir = os.path.join(ep_dir, "voice", lang); sid = f"s{i:02d}"
    mp = os.path.join(vdir, "manifest.json")
    man = json.load(open(mp)) if os.path.exists(mp) else {}
    if sid not in man and os.path.exists(os.path.join(vdir, sid + ".wav")):
        return os.path.join(vdir, sid + ".wav"), "recorded"
    if man.get(sid) == vkey(lang, text) and os.path.exists(os.path.join(vdir, sid + ".ogg")):
        return os.path.join(vdir, sid + ".ogg"), "clone"
    return None, None


def voice_status(ep_dir):
    """Per language: how many scenes have your (current) voice, from voice/<lang>.txt. No browser needed."""
    out = {}
    for lang in ("zh", "en"):
        txt = os.path.join(ep_dir, "voice", f"{lang}.txt")
        lines = [l for l in open(txt, encoding="utf-8").read().splitlines() if l.strip()] if os.path.exists(txt) else []
        out[lang] = [sum(1 for i, l in enumerate(lines, 1) if own_voice(ep_dir, lang, i, l)[0]), len(lines)]
    return out


def scene_voices(ep_dir, info, lang, cache):
    """One clip per scene: your voice when current, else the cached AI voice. Returns clips + sources."""
    clips, sources = [], []
    for i, s in enumerate(info, 1):
        text = scene_text(s["caps"], lang)
        path, kind = own_voice(ep_dir, lang, i, text)
        if path:
            clips.append(trim(load_audio(path))); sources.append(kind)
            continue
        cp = os.path.join(cache, f"{lang}-{vkey(lang, text)}.wav")
        if not os.path.exists(cp):
            import tts
            a, r = tts.synth(text, lang)
            sf.write(cp, resample(a, r), SR)
        clips.append(load_audio(cp)); sources.append("ai")
    return clips, sources


def trim(x, thr=0.01, keep=0.08):
    """Cut leading/trailing silence, keeping a short pad."""
    idx = np.where(np.abs(x) > thr)[0]
    if not len(idx):
        return x
    a, b = max(0, idx[0] - int(keep * SR)), min(len(x), idx[-1] + int(keep * SR))
    return x[a:b]


def cap_times(caps, lang, audio_len):
    """Start time of each caption page inside the scene, proportional to its length."""
    w = [max(1, len(re.sub(r"\s", "", c["zh"]))) if lang == "zh" else max(1, len(c["en"].split())) for c in caps]
    tot, acc, out = sum(w), 0, []
    for x in w:
        out.append(LEAD + audio_len * acc / tot); acc += x
    return out


def contact_sheet(paths, out, cols=3, w=360):
    """One frame per scene (end of scene), for a quick visual check."""
    from PIL import Image
    ims = [Image.open(p).convert("RGB") for p in paths]
    h = int(ims[0].height * w / ims[0].width)
    rows = (len(ims) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * w + (cols - 1) * 6, rows * h + (rows - 1) * 6), (60, 60, 60))
    for i, im in enumerate(ims):
        sheet.paste(im.resize((w, h)), ((i % cols) * (w + 6), (i // cols) * (h + 6)))
    sheet.save(out)


def render(ep_dir, platform, out_dir, page_factory):
    ratio, lang = PLATFORMS[platform]
    W, H = SIZES[ratio]
    url = f"file://{ENGINE}/lesson.html?ratio={ratio}&lang={lang}"
    page = page_factory(W, H)
    page.goto("about:blank")
    page.add_init_script(path=os.path.join(ep_dir, "episode.js"))
    page.goto(url); page.wait_for_function("window.ready === true"); page.evaluate("document.fonts.ready")
    info = page.evaluate("EP_INFO()")
    cache = os.path.join(ROOT, "build", ".tts"); os.makedirs(cache, exist_ok=True)
    clips, sources = scene_voices(ep_dir, info, lang, cache)

    tmp = tempfile.mkdtemp()
    frames, audio, lasts = [], [], []
    for si, (s, clip) in enumerate(zip(info, clips)):
        alen = len(clip) / SR
        D = LEAD + alen + TAIL
        n = page.evaluate(f"showScene({si})")
        starts = page.evaluate(f"schedule({D}, {n})"); fade = page.evaluate("FADE")
        ct = cap_times(s["caps"], lang, alen)
        ts = {0.0, *ct}
        for a in starts:
            ts.update(a + k / FPS for k in range(int(fade * FPS) + 1))
        ts = sorted(t for t in ts if t < D)
        for j, t in enumerate(ts):
            ci = max([k for k, c0 in enumerate(ct) if c0 <= t + 1e-6], default=0)
            page.evaluate("([t,D,c]) => { setFrame(t, D); setCap(c); }", [t, D, s["caps"][ci]])
            p = os.path.join(tmp, f"f{len(frames):05d}.png")
            page.screenshot(path=p)
            frames.append((p, (ts[j + 1] if j + 1 < len(ts) else D) - t))
        lasts.append(frames[-1][0])
        if si == 0:   # cover = first scene fully built, no caption
            page.evaluate(f"([D]) => {{ setFrame(99, D); setCap(null); }}", [D])
            page.screenshot(path=os.path.join(out_dir, f"{platform}-cover.png"))
        audio += [np.zeros(int(LEAD * SR), np.float32), clip, np.zeros(int(TAIL * SR), np.float32)]
    page.close()

    contact_sheet(lasts, os.path.join(out_dir, f"sheet-{platform}.png"))
    wav = os.path.join(tmp, "a.wav"); sf.write(wav, np.concatenate(audio), SR)
    lst = os.path.join(tmp, "list.txt")
    with open(lst, "w") as f:
        for p, d in frames:
            f.write(f"file '{p}'\nduration {d:.4f}\n")
        f.write(f"file '{frames[-1][0]}'\n")
    out = os.path.join(out_dir, f"{platform}.mp4")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-i", wav,
                    "-vf", f"fps=30,format=yuv420p", "-c:v", "libx264", "-preset", "veryfast", "-crf", "20",
                    "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-c:a", "aac", "-b:a", "160k", "-ar", "48000",
                    "-movflags", "+faststart", "-shortest", out], check=True)
    shutil.rmtree(tmp)
    dur = sum(d for _, d in frames)
    return {"file": out, "seconds": round(dur, 1), "voice": sources, "lang": lang, "ratio": ratio}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("episode")
    ap.add_argument("--only", help="comma list of " + ",".join(PLATFORMS))
    ap.add_argument("--status", action="store_true", help="only print how much of the episode has your voice")
    a = ap.parse_args()
    ep_dir = os.path.abspath(a.episode)
    if a.status:
        print(json.dumps(voice_status(ep_dir))); return
    out_dir = os.path.join(ROOT, "build", os.path.basename(ep_dir)); os.makedirs(out_dir, exist_ok=True)
    plats = a.only.split(",") if a.only else list(PLATFORMS)
    from playwright.sync_api import sync_playwright
    report = {}
    with sync_playwright() as p:
        b = p.chromium.launch()
        factory = lambda W, H: b.new_page(viewport={"width": W, "height": H})
        for pl in plats:
            report[pl] = render(ep_dir, pl, out_dir, factory)
            v = report[pl]["voice"]
            print(f"{pl:9s} {report[pl]['seconds']:5.1f}s  your voice: {len(v) - v.count('ai')}/{len(v)} scenes  → {report[pl]['file']}")
        b.close()
    rp = os.path.join(out_dir, "report.json")
    old = json.load(open(rp)) if os.path.exists(rp) else {}
    old.update(report); json.dump(old, open(rp, "w"), indent=1)


if __name__ == "__main__":
    import sys; sys.path.insert(0, ENGINE)
    main()
