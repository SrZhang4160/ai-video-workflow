"""Voice every scene that needs it, in your cloned voice (Fun-CosyVoice3 + my_voice.wav).

Run with the CosyVoice environment's Python (local/voice_job.sh does this):
  ~/cosyvoice3/.venv/bin/python local/voice_daemon.py [repo_root] [episode_id ...]
Named episodes (e.g. interview-1-saas, which have no air date in the folder name) are voiced now, whatever their date.

Voice samples: ~/cosyvoice3/my_voice_<lang>.wav + .txt (exact transcript), falling back to my_voice.wav/.txt.
Changing a sample re-voices that language for upcoming episodes.
For each episodes/<date>/voice/{zh,en}.txt (one line per caption page), writes voice/<lang>/sNN.ogg and records the
line's hash in voice/<lang>/manifest.json. A clip is redone only when its line changed. Nearest air dates first;
past episodes are skipped. A hand-recorded voice/<lang>/sNN.wav with no manifest entry is left alone.
Lines that end mid-sentence (comma, colon, no punctuation) are voiced together with the lines that finish the sentence,
then cut at the pauses between them, so the voice keeps one natural intonation across caption pages. The manifest's
_groups records which lines were voiced together; when the cut can't be found, those lines are voiced one by one.
Chinese readings: engine/zh_reading.py writes the reading of polyphonic characters into the text the model gets
(银行 → 银[h][áng]; your word list engine/tts/lexicon-zh-readings.txt wins). Each Chinese take is then listened to with
Whisper; a take with wrong or missing syllables is voiced again (up to TAKES takes, the later ones with more readings
written in) and the best take is kept. Lines still wrong after that are printed as CHECK and listed in the manifest's
_check, for a human to hear. Adding a word to the list re-voices the lines that contain it (manifest _lex).
Loads the model only when there is work. Prints one line per clip.
"""
import datetime, hashlib, json, os, re, sys, time
import numpy as np

REPO = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), ".."))
ONLY = sys.argv[2:]           # episode ids to voice now (default: every dated episode from today on)
CV = os.environ.get("COSYVOICE_DIR", os.path.expanduser("~/cosyvoice3"))
LANGS = os.environ.get("VOICE_LANGS", "zh,en").split(",")
SPEED = {"en": 0.92}          # English a little slower so viewers can follow
SOFT_END = "，,、；;—-：:"      # a line ending like this continues into the next one
TAKES = int(os.environ.get("VOICE_TAKES", "3"))    # takes per Chinese sentence before giving up
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "engine"))
try:
    import zh_reading
except Exception as e:                              # noqa: BLE001  (pypinyin/jieba missing: voice as before)
    print(f"zh_reading unavailable ({type(e).__name__}: {e}); Chinese readings are left to the model")
    zh_reading = None


def lex_sig(lang, line):
    return zh_reading.lexicon_sig(line) if zh_reading and lang == "zh" else ""


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
    eps = ONLY or sorted(d for d in os.listdir(os.path.join(REPO, "episodes")) if d[:2] == "20" and d >= today)
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
                                                and os.path.exists(os.path.join(vdir, f"s{i:02d}.ogg"))
                                                and man.get("_lex", {}).get(f"s{i:02d}", lex_sig(lang, lines[i - 1]))
                                                == lex_sig(lang, lines[i - 1])):
                            jobs.append((ep, lang, [f"s{i:02d}"], [lines[i - 1].strip()], vdir, mpath))
                    continue
                sids, text = [f"s{i:02d}" for i in g], [lines[i - 1].strip() for i in g]
                lex = man.get("_lex", {})               # clips made before _lex existed are left as they are
                fresh = all(man.get(sid) == key(lang, t) and os.path.exists(os.path.join(vdir, sid + ".ogg"))
                            and lex.get(sid, lex_sig(lang, t)) == lex_sig(lang, t) for sid, t in zip(sids, text))
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

    def take(text, lang, level, solo):
        """One take of a sentence: its clips (one per line) and how they were made."""
        say_ = [zh_reading.tag(t, level) for t in text] if zh_reading and lang == "zh" else text
        clips = None if solo or len(text) == 1 else split(synth(joined(lang, say_), lang), m.sample_rate, text)
        if clips is None:
            return [synth(line, lang) for line in say_], ("solo" if len(text) > 1 else "")
        return clips, "together"

    if zh_reading:
        zh_reading.prime([t for _, lang, _, text, _, _ in jobs if lang == "zh" for t in text])
    ear = []

    def misheard(wav, line):
        """Script syllables Whisper did not hear in a clip: [(wanted, heard)]. Tones are not compared."""
        import difflib, zh_check
        if not ear:
            import whisper
            ear.append(whisper.load_model("small"))
        x = np.interp(np.arange(0, len(wav), m.sample_rate / 16000), np.arange(len(wav)), wav).astype(np.float32)
        heard = ear[0].transcribe(x, language="zh", initial_prompt="以下是普通话的句子。", fp16=False)["text"]
        want, got = zh_check.norm_py(line), zh_check.norm_py(heard)
        return [(" ".join(want[a1:a2]), " ".join(got[b1:b2]) or "(missing)") for op, a1, a2, b1, b2 in
                difflib.SequenceMatcher(None, want, got, autojunk=False).get_opcodes() if op in ("replace", "delete")]

    for ep, lang, sids, text, vdir, mpath in jobs:
        t = time.time()
        sig = sample(lang)[2]
        clips, how = take(text, lang, 1, False)
        wrong, takes = {}, 1
        if zh_reading and lang == "zh" and TAKES > 1:
            try:
                best = None
                while True:
                    wrong = {sid: d for sid, w, line in zip(sids, clips, text) if (d := misheard(w, line))}
                    n = sum(len(d) for d in wrong.values())
                    if best is None or n < best[0]:
                        best = (n, clips, how, wrong)
                    if not n or takes >= TAKES:
                        break
                    takes += 1                       # 2nd take: more readings written in; 3rd: line by line
                    clips, how = take(text, lang, 2, takes >= 3)
                _, clips, how, wrong = best
            except Exception as e:                   # noqa: BLE001  (Whisper missing or failed: keep the take)
                print(f"listening check skipped ({type(e).__name__}: {e})", flush=True)
        os.makedirs(vdir, exist_ok=True)
        for sid, wav in zip(sids, clips):
            sf.write(os.path.join(vdir, sid + ".ogg"), wav, m.sample_rate, format="OGG", subtype="VORBIS")
        man = json.load(open(mpath)) if os.path.exists(mpath) else {}
        if made_with(man) not in (None, sig):
            man = {}
        for sid, line in zip(sids, text):
            man[sid] = key(lang, line)
            if zh_reading and lang == "zh":
                man.setdefault("_lex", {})[sid] = lex_sig(lang, line)
                man.setdefault("_check", {}).pop(sid, None)
                if sid in wrong:
                    man["_check"][sid] = "; ".join(f"{w} → {g}" for w, g in wrong[sid])
        if not man.get("_check"):
            man.pop("_check", None)
        groups = man.setdefault("_groups", {})
        for sid in sids:
            groups.pop(sid, None)
        if len(sids) > 1:
            groups[sids[0]] = key(lang, joined(lang, text)) if how == "together" else "solo"
        man["_sample"] = sig; json.dump(man, open(mpath, "w"), indent=1, sort_keys=True)
        secs = " ".join(f"{len(w) / m.sample_rate:.1f}" for w in clips)
        note = f" take {takes}" if takes > 1 else ""
        print(f"{ep} {lang} {'+'.join(sids)}  {secs}s audio in {time.time() - t:5.1f}s {how}{note}".rstrip(), flush=True)
        for sid, line in zip(sids, text):
            if sid in wrong:
                print(f"  CHECK {sid} 「{line}」 {man['_check'][sid]}", flush=True)


if __name__ == "__main__":
    main()
