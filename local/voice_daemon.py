"""Voice every scene that needs it, in your cloned voice (Fun-CosyVoice3 + my_voice.wav).

Run with the CosyVoice environment's Python (local/voice_job.sh does this):
  ~/cosyvoice3/.venv/bin/python local/voice_daemon.py [repo_root]

Voice samples: ~/cosyvoice3/my_voice_<lang>.wav + .txt (exact transcript), falling back to my_voice.wav/.txt.
Changing a sample re-voices that language for upcoming episodes.
For each episodes/<date>/voice/{zh,en}.txt (one line per caption page), writes voice/<lang>/sNN.ogg and records the
line's hash in voice/<lang>/manifest.json. A clip is redone only when its line changed. Nearest air dates first;
past episodes are skipped. A hand-recorded voice/<lang>/sNN.wav with no manifest entry is left alone.
Lines that end mid-sentence (comma, colon, no punctuation) are voiced together with the lines that finish the sentence,
then cut at the pauses between them, so the voice keeps one natural intonation across caption pages. The manifest's
_groups records which lines were voiced together; when the cut can't be found, those lines are voiced one by one.
Loads the model only when there is work. Prints one line per clip.
"""
import datetime, hashlib, json, os, re, sys, time
import numpy as np

REPO = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), ".."))
CV = os.environ.get("COSYVOICE_DIR", os.path.expanduser("~/cosyvoice3"))
LANGS = os.environ.get("VOICE_LANGS", "zh,en").split(",")
SPEED = {"en": 0.92}          # English a little slower so viewers can follow
SOFT_END = "，,、；;—-：:"      # a line ending like this continues into the next one


def key(lang, line):
    return hashlib.sha1(f"{lang}|{line.strip()}".encode()).hexdigest()[:16]


def sample(lang):
    """Voice sample for a language: my_voice_<lang>.wav/.txt if present, else my_voice.wav/.txt."""
    base = os.path.join(CV, f"my_voice_{lang}")
    if not os.path.exists(base + ".wav"):
        base = os.path.join(CV, "my_voice")
    wav, txt = base + ".wav", base + ".txt"
    sig = hashlib.sha1(open(wav, "rb").read() + open(txt, "rb").read()).hexdigest()[:12]
    return wav, open(txt, encoding="utf-8").read().strip(), sig


def made_with(man):
    """Which sample a manifest's clips came from (old manifests predate the field: the default sample)."""
    if man.get("_sample"):
        return man["_sample"]
    if any(k.startswith("s") for k in man):
        return hashlib.sha1(open(os.path.join(CV, "my_voice.wav"), "rb").read()
                            + open(os.path.join(CV, "my_voice.txt"), "rb").read()).hexdigest()[:12]
    return None


def sentences(lines):
    """Group line numbers (1-based) into sentences: a line ending mid-sentence joins the next. Max 4 lines."""
    groups, cur = [], []
    for i, line in enumerate(lines, 1):
        if not line.strip():
            if cur: groups.append(cur); cur = []
            continue
        cur.append(i)
        end = line.rstrip()[-1:]
        if len(cur) == 4 or not (end in SOFT_END or end.isalnum()):
            groups.append(cur); cur = []
    return groups + ([cur] if cur else [])


def joined(lang, parts):
    return ("" if lang == "zh" else " ").join(p.strip() for p in parts)


def pending():
    today = datetime.date.today().isoformat()
    jobs = []
    eps = sorted(d for d in os.listdir(os.path.join(REPO, "episodes")) if d[:2] == "20" and d >= today)
    for ep in eps:
        for lang in LANGS:
            txt = os.path.join(REPO, "episodes", ep, "voice", f"{lang}.txt")
            if not os.path.exists(txt):
                continue
            vdir = os.path.join(os.path.dirname(txt), lang)
            mpath = os.path.join(vdir, "manifest.json")
            man = json.load(open(mpath)) if os.path.exists(mpath) else {}
            if made_with(man) not in (None, sample(lang)[2]):
                man = {}                                 # voice sample changed: redo this language
            lines = open(txt, encoding="utf-8").read().splitlines()
            groups = man.get("_groups", {})
            mine = lambda i: f"s{i:02d}" not in man and os.path.exists(os.path.join(vdir, f"s{i:02d}.wav"))
            for g in sentences(lines):
                if any(mine(i) for i in g):                 # your own recording wins; voice the rest line by line
                    for i in g:
                        if not mine(i) and not (man.get(f"s{i:02d}") == key(lang, lines[i - 1])
                                                and os.path.exists(os.path.join(vdir, f"s{i:02d}.ogg"))):
                            jobs.append((ep, lang, [f"s{i:02d}"], [lines[i - 1].strip()], vdir, mpath))
                    continue
                sids, text = [f"s{i:02d}" for i in g], [lines[i - 1].strip() for i in g]
                fresh = all(man.get(sid) == key(lang, t) and os.path.exists(os.path.join(vdir, sid + ".ogg"))
                            for sid, t in zip(sids, text))
                together = len(g) == 1 or groups.get(sids[0]) in (key(lang, joined(lang, text)), "solo")
                if fresh and together:
                    continue
                jobs.append((ep, lang, sids, text, vdir, mpath))
    return jobs


def speech_span(e, thr):
    on = np.where(e > thr)[0]
    return (on[0], on[-1] + 1) if len(on) else (0, len(e))


def split(wav, sr, text):
    """Cut one sentence's audio into one clip per line, at the pauses nearest where each line should end.
    Returns None when there aren't clear pauses to cut at."""
    f = int(sr * 0.01)
    e = np.array([np.sqrt(np.mean(wav[k:k + f] ** 2)) for k in range(0, len(wav) - f + 1, f)])
    thr = max(0.006, 0.04 * np.percentile(e, 95))
    a, b = speech_span(e, thr)
    runs, k = [], a                                 # quiet runs (in frames) inside the speech: (start, end)
    while k < b:
        if e[k] <= thr:
            j = k
            while j < b and e[j] <= thr: j += 1
            if j - k >= 5: runs.append((k, j))     # at least 50 ms
            k = j
        else:
            k += 1
    weight = [len(re.sub(r"[\W_]", "", t)) or 1 for t in text]
    cuts, prev = [], a
    for n in range(1, len(text)):
        want = a + (b - a) * sum(weight[:n]) / sum(weight)
        ok = [r for r in runs if r[0] > prev and abs((r[0] + r[1]) / 2 - want) < 0.3 * (b - a)]
        if not ok:
            return None
        r = min(ok, key=lambda r: abs((r[0] + r[1]) / 2 - want) - 0.5 * (r[1] - r[0]))   # near, and longer is better
        cuts.append((r[0] + r[1]) // 2 * f); prev = r[1]
    edges = [0] + cuts + [len(wav)]
    return [wav[edges[n]:edges[n + 1]] for n in range(len(text))]


def main():
    jobs = pending()
    if not jobs:
        print("nothing to voice"); return
    sys.path.insert(0, CV)
    import say                                   # CosyVoice paths + local text-normalisation data
    import logging, soundfile as sf, torch
    for n in ("urllib3", "requests", "modelscope", "matplotlib", "numba", "httpx"):
        logging.getLogger(n).setLevel(logging.WARNING)
    say.use_local_text_frontend()
    from cosyvoice.cli.cosyvoice import AutoModel
    torch.set_num_threads(os.cpu_count() or 8)
    m = AutoModel(model_dir=os.path.join(CV, "CosyVoice", "pretrained_models", "Fun-CosyVoice3-0.5B"))

    def synth(line, lang):
        voice, vtext, _ = sample(lang)
        return np.concatenate([c["tts_speech"].squeeze(0).cpu().numpy()
                               for c in m.inference_zero_shot(line, say.PREFIX + vtext, voice, stream=False,
                                                              speed=SPEED.get(lang, 1.0))])

    for ep, lang, sids, text, vdir, mpath in jobs:
        t = time.time()
        sig = sample(lang)[2]
        clips = split(synth(joined(lang, text), lang), m.sample_rate, text) if len(text) > 1 else None
        how = "together" if clips else ("solo" if len(text) > 1 else "")
        if clips is None:
            clips = [synth(line, lang) for line in text]
        os.makedirs(vdir, exist_ok=True)
        for sid, wav in zip(sids, clips):
            sf.write(os.path.join(vdir, sid + ".ogg"), wav, m.sample_rate, format="OGG", subtype="VORBIS")
        man = json.load(open(mpath)) if os.path.exists(mpath) else {}
        if made_with(man) not in (None, sig):
            man = {}
        for sid, line in zip(sids, text):
            man[sid] = key(lang, line)
        groups = man.setdefault("_groups", {})
        for sid in sids:
            groups.pop(sid, None)
        if len(sids) > 1:
            groups[sids[0]] = key(lang, joined(lang, text)) if how == "together" else "solo"
        man["_sample"] = sig; json.dump(man, open(mpath, "w"), indent=1, sort_keys=True)
        secs = " ".join(f"{len(w) / m.sample_rate:.1f}" for w in clips)
        print(f"{ep} {lang} {'+'.join(sids)}  {secs}s audio in {time.time() - t:5.1f}s {how}".rstrip(), flush=True)


if __name__ == "__main__":
    main()
