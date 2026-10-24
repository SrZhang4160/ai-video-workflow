"""Voice every scene that needs it, in your cloned voice (Fun-CosyVoice3 + my_voice.wav).

Run with the CosyVoice environment's Python (local/voice_job.sh does this):
  ~/cosyvoice3/.venv/bin/python local/voice_daemon.py [repo_root]

For each episodes/<date>/voice/{zh,en}.txt (one line per scene), writes voice/<lang>/sNN.ogg and records the
line's hash in voice/<lang>/manifest.json. A clip is redone only when its line changed. Nearest air dates first;
past episodes are skipped. A hand-recorded voice/<lang>/sNN.wav with no manifest entry is left alone.
Loads the model only when there is work. Prints one line per clip.
"""
import datetime, hashlib, json, os, sys, time

REPO = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), ".."))
CV = os.environ.get("COSYVOICE_DIR", os.path.expanduser("~/cosyvoice3"))
LANGS = os.environ.get("VOICE_LANGS", "zh,en").split(",")


def key(lang, line):
    return hashlib.sha1(f"{lang}|{line.strip()}".encode()).hexdigest()[:16]


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
            for i, line in enumerate(open(txt, encoding="utf-8").read().splitlines(), 1):
                sid = f"s{i:02d}"
                if not line.strip():
                    continue
                if sid not in man and os.path.exists(os.path.join(vdir, sid + ".wav")):
                    continue                      # your own recording wins
                if man.get(sid) == key(lang, line) and os.path.exists(os.path.join(vdir, sid + ".ogg")):
                    continue
                jobs.append((ep, lang, sid, line.strip(), vdir, mpath))
    return jobs


def main():
    jobs = pending()
    if not jobs:
        print("nothing to voice"); return
    sys.path.insert(0, CV)
    import say                                   # CosyVoice paths + local text-normalisation data
    import logging, numpy as np, soundfile as sf, torch
    for n in ("urllib3", "requests", "modelscope", "matplotlib", "numba", "httpx"):
        logging.getLogger(n).setLevel(logging.WARNING)
    say.use_local_text_frontend()
    from cosyvoice.cli.cosyvoice import AutoModel
    torch.set_num_threads(os.cpu_count() or 8)
    m = AutoModel(model_dir=os.path.join(CV, "CosyVoice", "pretrained_models", "Fun-CosyVoice3-0.5B"))
    voice = os.path.join(CV, "my_voice.wav")
    prompt = say.PREFIX + open(os.path.join(CV, "my_voice.txt"), encoding="utf-8").read().strip()
    for ep, lang, sid, line, vdir, mpath in jobs:
        t = time.time()
        wav = np.concatenate([c["tts_speech"].squeeze(0).cpu().numpy()
                              for c in m.inference_zero_shot(line, prompt, voice, stream=False)])
        os.makedirs(vdir, exist_ok=True)
        sf.write(os.path.join(vdir, sid + ".ogg"), wav, m.sample_rate, format="OGG", subtype="VORBIS")
        man = json.load(open(mpath)) if os.path.exists(mpath) else {}
        man[sid] = key(lang, line); json.dump(man, open(mpath, "w"), indent=1, sort_keys=True)
        print(f"{ep} {lang} {sid}  {len(wav) / m.sample_rate:5.1f}s audio in {time.time() - t:5.1f}s", flush=True)


if __name__ == "__main__":
    main()
