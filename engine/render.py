"""Render one episode into platform videos.

  python3 engine/render.py episodes/2026-10-26                 # all 4 platforms
  python3 engine/render.py episodes/2026-10-26 --only xhs      # just the 小红书 draft
  python3 engine/render.py episodes/2026-10-26 --status        # {"zh": [voiced, pages], "en": [...]}

Reads   episodes/<id>/episode.js            scenes + bilingual captions
        episodes/<id>/voice/<zh|en>/sNN.ogg  your cloned voice, one clip per caption page (Mac voice job), checked against manifest.json
        episodes/<id>/voice/<zh|en>/sNN.wav  or a hand recording (no manifest entry)
Writes  build/<id>/<platform>.mp4, build/<id>/<platform>-cover.png, build/<id>/report.json
Caption pages without a current voice clip fall back to the Kokoro AI voice (report.json says which).
Chinese clips are evened out to 305–330 字/分钟 per line (engine/pace.py; audit: python3 engine/pace.py --after).
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
FPS, SR = 24, 24000
CAM_FPS = 15   # extra frames for the slow camera move (lesson.html camera()); animations still get FPS
# Pacing per voice language: silence before the first line, between caption pages, and after the scene.
# The gap between pages follows how the earlier page ends: a comma keeps the sentence going, a full stop rests.
# English runs slower on purpose so viewers have time to read the visuals.
PACE = {"zh": {"lead": 0.35, "gap": {"comma": 0.06, "colon": 0.12, "stop": 0.2}, "tail": 0.6},
        "en": {"lead": 0.8, "gap": {"comma": 0.15, "colon": 0.3, "stop": 0.6}, "tail": 1.6}}
# Drama episodes (meta.json "format": "drama", 2–3 min stories) keep a tighter pace in both languages, and English clips
# are sped up at render time (pitch kept) so the English cut stays close to the Chinese one.
PACE_DRAMA = {"zh": {"lead": 0.3, "gap": {"comma": 0.05, "colon": 0.1, "stop": 0.18}, "tail": 0.5},
              "en": {"lead": 0.35, "gap": {"comma": 0.08, "colon": 0.15, "stop": 0.25}, "tail": 0.6}}
TEMPO_DRAMA = {"en": 1.12}
SOFT_END, COLON_END = "，,、；;—-", "：:"
FADE = 0.012    # seconds faded in/out at clip edges so cuts don't click


def gap_after(text, gaps):
    """Pause after a caption page, from its last character (no punctuation counts as a comma)."""
    end = text.rstrip()[-1:]
    if end in COLON_END:
        return gaps["colon"]
    if not end or end in SOFT_END or end.isalnum():
        return gaps["comma"]
    return gaps["stop"]


def tone_level(clips):
    """The clips' own background level (RMS of their quietest 20 ms frames), capped well below speech."""
    f = int(0.02 * SR)
    rms = [q for c in clips for k in range(0, len(c) - f, f) if (q := float(np.sqrt(np.mean(c[k:k + f] ** 2)))) > 1e-5]
    return min(float(np.percentile(rms, 10)) if rms else 0.0, 0.0015)


def room_tone(level, n, rng):
    """n samples of soft noise at that level, so pauses don't drop to digital silence between clips."""
    if n <= 0 or not level:
        return np.zeros(max(n, 0), np.float32)
    x = np.convolve(rng.standard_normal(n + 15).astype(np.float32), np.ones(16, np.float32), "valid")[:n]
    return x * (level / (x.std() or 1))


def fade(x):
    k = min(int(FADE * SR), len(x) // 2)
    if k:
        r = np.linspace(0, 1, k, dtype=np.float32)
        x = x.copy(); x[:k] *= r; x[-k:] *= r[::-1]
    return x


def load_audio(path):
    x, r = sf.read(path, dtype="float32")
    if x.ndim > 1:
        x = x.mean(axis=1)
    return resample(x, r)


def tempo(x, f):
    """Speed a clip up by f without changing its pitch (ffmpeg atempo)."""
    with tempfile.TemporaryDirectory() as d:
        src, dst = os.path.join(d, "in.wav"), os.path.join(d, "out.wav")
        sf.write(src, x, SR)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-af", f"atempo={f}", dst], check=True)
        return load_audio(dst)


def resample(x, r):
    if r == SR:
        return x
    n = int(len(x) * SR / r)
    return np.interp(np.linspace(0, len(x) - 1, n), np.arange(len(x)), x).astype(np.float32)


def page_text(c, lang):
    """What the voice says for one caption page (one line of voice/<lang>.txt)."""
    return c["say_" + lang].strip()


def vkey(lang, line):
    return hashlib.sha1(f"{lang}|{line.strip()}".encode()).hexdigest()[:16]


def own_voice(ep_dir, lang, i, text):
    """Your voice for caption page i (1-based across the episode) if it is current: a hand recording sNN.wav
    (no manifest entry), or a cloned sNN.ogg whose manifest hash matches the page's current text."""
    vdir = os.path.join(ep_dir, "voice", lang); sid = f"s{i:02d}"
    mp = os.path.join(vdir, "manifest.json")
    man = json.load(open(mp)) if os.path.exists(mp) else {}
    rp = os.path.join(vdir, "recorded.json")       # engine/own_voice.py: the text each recording was made for
    recd = json.load(open(rp)) if os.path.exists(rp) else {}
    if sid not in man and os.path.exists(os.path.join(vdir, sid + ".wav")) and recd.get(sid, vkey(lang, text)) == vkey(lang, text):
        return os.path.join(vdir, sid + ".wav"), "recorded"
    if man.get(sid) == vkey(lang, text) and os.path.exists(os.path.join(vdir, sid + ".ogg")):
        return os.path.join(vdir, sid + ".ogg"), "clone"
    return None, None


def voice_status(ep_dir):
    """Per language: how many caption pages have your (current) voice, from voice/<lang>.txt. No browser needed."""
    out = {}
    for lang in ("zh", "en"):
        txt = os.path.join(ep_dir, "voice", f"{lang}.txt")
        lines = open(txt, encoding="utf-8").read().splitlines() if os.path.exists(txt) else []
        todo = [(i, l) for i, l in enumerate(lines, 1) if l.strip()]
        out[lang] = [sum(1 for i, l in todo if own_voice(ep_dir, lang, i, l)[0]), len(todo)]
    return out


def page_voices(ep_dir, info, lang, cache):
    """One clip per caption page: your voice when current, else the cached AI voice.
    Returns [[clip per page] per scene] and the list of sources."""
    out, sources, i = [], [], 0
    for s in info:
        clips = []
        for c in s["caps"]:
            i += 1
            text = page_text(c, lang)
            if s.get("audio") == "clip" or not text:   # acted shot: its own audio (drama v2); nothing to voice
                clips.append(None); sources.append("clip"); continue
            path, kind = own_voice(ep_dir, lang, i, text)
            if path:
                clips.append(trim(load_audio(path))); sources.append(kind); continue
            cp = os.path.join(cache, f"{lang}-{vkey(lang, text)}.wav")
            if not os.path.exists(cp):
                import tts
                a, r = tts.synth(text, lang)
                sf.write(cp, resample(a, r), SR)
            clips.append(trim(load_audio(cp))); sources.append("ai")
        out.append(clips)
    return out, sources


def trim(x, thr=0.01, keep=0.08):
    """Cut leading/trailing silence, keeping a short pad."""
    idx = np.where(np.abs(x) > thr)[0]
    if not len(idx):
        return x
    a, b = max(0, idx[0] - int(keep * SR)), min(len(x), idx[-1] + int(keep * SR))
    return fade(x[a:b])


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


def clip_frames(ep_dir, clip, W, H, tmp, si, start=0.0):
    """Frames of a scene's live-action clip (episodes/<id>/<clip>), cover-cropped to W×H at FPS. [] when there is no clip
    file yet: the scene then renders its drawn fallback."""
    path = clip and os.path.join(ep_dir, clip)
    if not path or not os.path.exists(path):
        return []
    d = os.path.join(tmp, f"clip{si:02d}"); os.makedirs(d, exist_ok=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{start:.3f}", "-i", path, "-an", "-vf",
                    f"fps={FPS},scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H}", "-q:v", "3",
                    os.path.join(d, "%05d.jpg")], check=True)
    return sorted(os.path.join(d, f) for f in os.listdir(d))


def clip_audio(ep_dir, clip, D, tmp, si, pause, start=0.0):
    """The acted shot's own audio (Kling dialogue + SFX) cut or padded to D seconds; room tone when there is none."""
    path = clip and os.path.join(ep_dir, clip)
    n = int(round(D * SR))
    if not path or not os.path.exists(path):
        return pause(D)
    wav = os.path.join(tmp, f"clipa{si:02d}.wav")
    r = subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{start:.3f}", "-i", path, "-vn", "-ac", "1", "-ar", str(SR), wav])
    if r.returncode or not os.path.exists(wav):
        return pause(D)
    x = load_audio(wav)[:n]
    if len(x) < n:
        x = np.concatenate([x, pause((n - len(x)) / SR)[: n - len(x)]])
    k1, k2 = min(len(x), int(0.02 * SR)), min(len(x), int(0.08 * SR))   # quick fade in, softer fade out: joins don't click
    if k1 and k2:
        x[:k1] *= np.linspace(0, 1, k1); x[-k2:] *= np.linspace(1, 0, k2)
    return x.astype(np.float32)


def render(ep_dir, platform, out_dir, page_factory):
    ratio, lang = PLATFORMS[platform]
    W, H = SIZES[ratio]
    url = f"file://{ENGINE}/lesson.html?ratio={ratio}&lang={lang}"
    page = page_factory(W, H)
    page.goto("about:blank")
    page.add_init_script(f"window.EP_DIR = {json.dumps('file://' + ep_dir.rstrip('/') + '/')};")
    page.add_init_script(path=os.path.join(ep_dir, "episode.js"))
    page.goto(url); page.wait_for_function("window.ready === true"); page.evaluate("document.fonts.ready")
    info = page.evaluate("EP_INFO()")
    cache = os.path.join(ROOT, "build", ".tts"); os.makedirs(cache, exist_ok=True)
    scene_clips, sources = page_voices(ep_dir, info, lang, cache)
    scene_clips = [[c for c in clips if c is not None] for clips in scene_clips]
    drama = json.load(open(os.path.join(ep_dir, "meta.json"))).get("format") == "drama"
    pc = (PACE_DRAMA if drama else PACE)[lang]
    if drama and lang in TEMPO_DRAMA:
        scene_clips = [[tempo(c, TEMPO_DRAMA[lang]) for c in clips] for clips in scene_clips]
    if lang == "zh":   # speaking-rate standard: every line 305–330 字/分钟 (engine/pace.py)
        import pace
        scene_clips = [[pace.even_out(c, page_text(cap, lang), SR, lambda x, f: tempo(x, f))[0]
                        for c, cap in zip(clips, s["caps"])] for clips, s in zip(scene_clips, info)]
    level, rng = tone_level([c for clips in scene_clips for c in clips]), np.random.default_rng(0)
    pause = lambda sec: room_tone(level, int(sec * SR), rng)

    tmp = tempfile.mkdtemp()
    frames, audio, lasts = [], [], []
    for si, (s, clips) in enumerate(zip(info, scene_clips)):
        # scene audio: lead, page 1, gap, page 2, ..., tail. Caption k starts exactly when its clip starts.
        # first scene: the hook starts almost at once (viewers decide in the first second)
        lead = min(pc["lead"], 0.15 if lang == "zh" else 0.3) if si == 0 else pc["lead"]
        if s.get("audio") == "clip":   # drama v2 acted shot: the shot's own dialogue + SFX, cut to the storyboard length
            D = float(s["seconds"]); ct = list(s.get("cap_at") or [])
            parts = [clip_audio(ep_dir, s.get("clip"), D, tmp, si, pause, float(s.get("clip_in") or 0))]
        elif not s["caps"] and s.get("seconds"):   # silent card
            D = float(s["seconds"]); ct = []; parts = [pause(D)]
        else:
            ct, t, parts = [], lead, [pause(lead)]
            for k, c in enumerate(clips):
                if k:
                    g = gap_after(page_text(s["caps"][k - 1], lang), pc["gap"])
                    parts.append(pause(g)); t += g
                ct.append(t); parts.append(c); t += len(c) / SR
            parts.append(pause(pc["tail"])); D = t + pc["tail"]
        n = page.evaluate(f"showScene({si})")
        page.evaluate("Promise.all([...document.images].map(i => i.decode().catch(() => {})))")   # shot() images
        wins = page.evaluate("([D, ct]) => schedule(D, 0, ct)", [D, ct])
        ts = {0.0, *ct}
        for a, b in wins:
            a = max(a, 0.0)
            ts.update(a + k / FPS for k in range(int((b - a) * FPS) + 2))
        if page.evaluate("cameraOn()"):
            ts.update(k / CAM_FPS for k in range(int(D * CAM_FPS) + 1))
        live = clip_frames(ep_dir, s.get("clip"), W, H, tmp, si, float(s.get("clip_in") or 0))
        if live:   # live-action shot: every frame, the video plays once and then holds its last frame
            ts.update(k / FPS for k in range(int(D * FPS) + 1))
        ts = sorted(x for x in ts if 0 <= x < D)
        for j, x in enumerate(ts):
            ci = max([k for k, c0 in enumerate(ct) if c0 <= x + 1e-6], default=-1 if ct else 0)
            if live:
                page.evaluate("src => setBg(src)", "file://" + live[min(int(x * FPS), len(live) - 1)])
            page.evaluate("([t,D,ct,c]) => { setFrame(t, D, ct); setCap(c); }", [x, D, ct, s["caps"][ci] if s["caps"] and ci >= 0 else None])
            p = os.path.join(tmp, f"f{len(frames):05d}.png")
            page.screenshot(path=p)
            frames.append((p, (ts[j + 1] if j + 1 < len(ts) else D) - x))
        lasts.append(frames[-1][0])
        if si == 0:   # cover = first scene fully built, no caption
            page.evaluate("([D, ct]) => { setFrame(999, D, ct); setCap(null); }", [D, ct])
            page.screenshot(path=os.path.join(out_dir, f"{platform}-cover.png"))
        audio += parts
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
    meta = json.load(open(os.path.join(ep_dir, "meta.json")))
    plats = a.only.split(",") if a.only else meta.get("platforms", list(PLATFORMS))
    from playwright.sync_api import sync_playwright
    report = {}
    with sync_playwright() as p:
        b = p.chromium.launch()
        factory = lambda W, H: b.new_page(viewport={"width": W, "height": H})
        for pl in plats:
            report[pl] = render(ep_dir, pl, out_dir, factory)
            v = report[pl]["voice"]
            print(f"{pl:9s} {report[pl]['seconds']:5.1f}s  your voice: {len(v) - v.count('ai')}/{len(v)} lines  → {report[pl]['file']}")
        b.close()
    rp = os.path.join(out_dir, "report.json")
    old = json.load(open(rp)) if os.path.exists(rp) else {}
    old.update(report); json.dump(old, open(rp, "w"), indent=1)


if __name__ == "__main__":
    import sys; sys.path.insert(0, ENGINE)
    main()
