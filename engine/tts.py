"""Fallback AI voice (sherpa-onnx Kokoro), used only when an episode has no voice files.
Models live in $TTSDIR (default ~/.cache/lesson-tts); engine/setup.sh downloads them."""
import os
import numpy as np

TTSDIR = os.environ.get("TTSDIR", os.path.expanduser("~/.cache/lesson-tts"))
HERE = os.path.dirname(os.path.abspath(__file__))
_cache = {}


def _model(lang):
    if lang in _cache:
        return _cache[lang]
    import sherpa_onnx
    if lang == "zh":   # Kokoro v1.1, zf_099 (sid 57) scored best in speech-recognition checks
        m = f"{TTSDIR}/kokoro-multi-lang-v1_1"
        cfg = sherpa_onnx.OfflineTtsKokoroModelConfig(
            model=f"{m}/model.onnx", voices=f"{m}/voices.bin", tokens=f"{m}/tokens.txt",
            lexicon=f"{m}/lexicon-us-en.txt,{m}/lexicon-zh.txt,{HERE}/tts/lexicon-extra-zh.txt",
            dict_dir=f"{m}/dict", data_dir=f"{m}/espeak-ng-data")
        tts = sherpa_onnx.OfflineTts(sherpa_onnx.OfflineTtsConfig(
            model=sherpa_onnx.OfflineTtsModelConfig(kokoro=cfg, num_threads=4),
            rule_fsts=f"{m}/date-zh.fst,{m}/phone-zh.fst,{m}/number-zh.fst", max_num_sentences=1))
        out = (tts, 57, 1.15)
    else:              # Kokoro v1.0, af_heart (sid 3)
        m = f"{TTSDIR}/kokoro-multi-lang-v1_0"
        cfg = sherpa_onnx.OfflineTtsKokoroModelConfig(
            model=f"{m}/model.onnx", voices=f"{m}/voices.bin", tokens=f"{m}/tokens.txt",
            lexicon=f"{m}/lexicon-us-en.txt,{HERE}/tts/lexicon-extra-en.txt",
            data_dir=f"{m}/espeak-ng-data", lang="en-us")
        tts = sherpa_onnx.OfflineTts(sherpa_onnx.OfflineTtsConfig(
            model=sherpa_onnx.OfflineTtsModelConfig(kokoro=cfg, num_threads=4), max_num_sentences=1))
        out = (tts, 3, 1.0)
    _cache[lang] = out
    return out


def synth(text, lang):
    tts, sid, speed = _model(lang)
    a = tts.generate(text, sid=sid, speed=speed)
    return np.array(a.samples, dtype=np.float32), a.sample_rate
