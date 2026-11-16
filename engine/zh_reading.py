#!/usr/bin/env python3
"""Decide how each Chinese character in a voice line is read, and write that reading into the text CosyVoice gets.

The cloned voice picks readings of polyphonic characters (行 xíng/háng, 长 cháng/zhǎng, 重 zhòng/chóng …) by itself and
is sometimes wrong. CosyVoice3 accepts the reading inline: the character is REPLACED by [initial][final-with-tone-mark],
e.g. 银行 → 银[h][áng]. (Keeping the character as well makes it say the syllable twice.) Captions keep the original text.

Where a reading comes from, first match wins:
  1. engine/tts/lexicon-zh-readings.txt   your own word list (`行长 hang2 zhang3`); add a line whenever a word was misread
  2. pypinyin's phrase dictionary          for multi-character words jieba finds (银行, 调用, 重新 …)
  3. g2pW (BERT polyphone model)           for the common polyphonic characters (COMMON) outside such words, when
                                           installed (~/cosyvoice3/g2pw_model); pypinyin in context for everything else

  ~/cosyvoice3/.venv/bin/python engine/zh_reading.py "他在银行工作了很长时间"      # show readings and the tagged text
"""
import os, re, sys

import jieba
from pypinyin import Style, pinyin
from pypinyin.constants import PHRASES_DICT
from pypinyin.contrib.tone_convert import to_finals_tone, to_initials

jieba.setLogLevel(60)
HERE = os.path.dirname(os.path.abspath(__file__))
LEXICON = os.path.join(HERE, 'tts', 'lexicon-zh-readings.txt')
CV = os.environ.get('COSYVOICE_DIR', os.path.expanduser('~/cosyvoice3'))
G2PW_DIR = os.path.join(CV, 'g2pw_model', 'G2PWModel')
TOKENIZER = os.path.join(CV, 'CosyVoice', 'cosyvoice', 'tokenizer', 'tokenizer.py')
HAN = re.compile(r'[一-鿿]')
# Never tagged: 一 / 不 change tone with the next syllable, and these particles are read right as they are.
SKIP = set('一不的了着么们吗呢吧啊个子儿')
# The ones that matter most in these scripts: the only ones a level-2 retry tags, and the list when g2pW is absent.
COMMON = set('行长重还得为处发便量数调传降藏种差干结空解少乐更将相应分正朝参系角假难省曾称缝背薄好中当要会没都给载率')

_lex = _g2pw = _poly = _tokens = None
_cache = {}
_seen = None


def lexicon():
    """{word: [pin1, yin1, ...]} from lexicon-zh-readings.txt, longest words first."""
    global _lex
    if _lex is None:
        _lex = {}
        if os.path.exists(LEXICON):
            for raw in open(LEXICON, encoding='utf-8'):
                p = raw.split('#')[0].split()
                if len(p) >= 2 and len(p[0]) == len(p) - 1:
                    _lex[p[0]] = [x.lower().replace('ü', 'v').replace('u:', 'v') for x in p[1:]]
        _lex = dict(sorted(_lex.items(), key=lambda kv: -len(kv[0])))
    return _lex


def lexicon_sig(text):
    """The lexicon entries that apply to a line: when this changes, the line is voiced again."""
    return ' '.join(f'{w}={"".join(r)}' for w, r in lexicon().items() if w in text)


def polyphonic():
    """Characters with more than one reading. g2pW lists them in traditional form, so map simplified ones across."""
    global _poly
    if _poly is None:
        f = os.path.join(G2PW_DIR, 'POLYPHONIC_CHARS.txt')
        if not os.path.exists(f):
            _poly = set(COMMON)
        else:
            _poly = {l.split('\t')[0] for l in open(f, encoding='utf-8') if l.strip()}
            try:
                import g2pw
                s2t = os.path.join(os.path.dirname(g2pw.__file__), 'bert-base-chinese_s2t_dict.txt')
                _poly |= {p[0] for p in (l.split() for l in open(s2t, encoding='utf-8')) if len(p) == 2 and p[1] in _poly}
            except Exception:                            # noqa: BLE001
                pass
            _poly |= COMMON
    return _poly


def _g2pw_load():
    global _g2pw
    if _g2pw is None:
        _g2pw = False
        if os.path.exists(os.path.join(G2PW_DIR, 'g2pw.onnx')):
            try:
                os.environ.setdefault('HF_HUB_OFFLINE', '1')     # its tokenizer is cached; never wait on the network
                import onnxruntime
                from g2pw import G2PWConverter
                _g2pw = G2PWConverter(model_dir=G2PW_DIR + '/', style='pinyin', enable_non_tradional_chinese=True,
                                      num_workers=0, batch_size=32)
                opt = onnxruntime.SessionOptions()               # the package pins 2 threads: use the whole CPU
                opt.intra_op_num_threads = os.cpu_count() or 4
                _g2pw.session_g2pw = onnxruntime.InferenceSession(os.path.join(G2PW_DIR, 'g2pw.onnx'), sess_options=opt)
            except Exception as e:                       # noqa: BLE001  (missing package / model: fall back)
                print(f'zh_reading: g2pW unavailable ({type(e).__name__}), using pypinyin only', file=sys.stderr)
    return _g2pw


def prime(lines):
    """Ask g2pW about many lines in one batch (much faster than line by line); results are cached."""
    todo = [t for t in dict.fromkeys(lines) if t not in _cache and any(ch in polyphonic() for ch in t)]
    if not todo or not _g2pw_load():
        return
    try:
        outs = _g2pw(todo)
    except Exception:                                    # noqa: BLE001
        return
    for t, out in zip(todo, outs):
        _cache[t] = [p.replace('u:', 'v') if p else None for p in out] if len(out) == len(t) else None


def _g2pw_line(text):
    """g2pW's reading per character of text (None where it has none), or None when g2pW isn't available."""
    if text not in _cache:
        prime([text])
    return _cache.get(text)


def _known(ch):
    """Readings of a character that occur in pypinyin's (mainland) phrase dictionary, plus its usual one.
    g2pW was trained with Taiwan readings too (和 hàn, 括 guā), so it only chooses for the COMMON characters, and only
    among these readings; every other character keeps pypinyin's reading."""
    global _seen
    if _seen is None:
        from pypinyin.contrib.tone_convert import to_tone3
        _seen = {}
        for w, ps in PHRASES_DICT.items():
            if len(w) == len(ps):
                for c, p in zip(w, ps):
                    _seen.setdefault(c, set()).add(to_tone3(p[0], neutral_tone_with_five=True, v_to_u=False))
    return _seen.get(ch, set()) | {default(ch)}


def _py(word):
    return [p[0] for p in pinyin(word, style=Style.TONE3, neutral_tone_with_five=True)]


def readings(text):
    """[(char, 'hang2' | None, source)] for every character of text. source: lex / phrase / g2pw / pypinyin / ''.
    A trailing '?' on the source means g2pW and pypinyin disagree on a polyphonic character: have a human confirm."""
    out = [(ch, None, '') for ch in text]
    done = [False] * len(text)
    for w, r in lexicon().items():
        for m in re.finditer(re.escape(w), text):
            if not any(done[m.start():m.end()]):
                for k, p in enumerate(r):
                    out[m.start() + k] = (w[k], p, 'lex'); done[m.start() + k] = True
    g = _g2pw_line(text)
    pos = 0
    for w in jieba.cut(text):
        ps = _py(w) if HAN.search(w) else []
        phrase = len(w) > 1 and w in PHRASES_DICT and len(ps) == len(w)
        for k, ch in enumerate(w):
            i = pos + k
            if done[i] or not HAN.match(ch):
                continue
            p = ps[k] if len(ps) == len(w) else _py(ch)[0]
            if phrase:
                out[i] = (ch, p, 'phrase')
            elif g and g[i] and ch in COMMON and (g[i] == p or g[i] in _known(ch)):
                differ = ch in polyphonic() and ch not in SKIP and g[i] != p
                out[i] = (ch, g[i], 'g2pw?' if differ else 'g2pw')
            else:
                out[i] = (ch, p, 'pypinyin')
        pos += len(w)
    return out


def _valid_tokens():
    global _tokens
    if _tokens is None:
        _tokens = set(re.findall(r'"(\[[a-zà-ǜ]+\])"', open(TOKENIZER, encoding='utf-8').read())) \
            if os.path.exists(TOKENIZER) else set()
    return _tokens


def token(p):
    """'hang2' → '[h][áng]' (CosyVoice3 pinyin tokens), or None when the model has no token for it."""
    if not p or p[-1] == '5':
        return None
    ini, fin = to_initials(p, strict=False), to_finals_tone(p, strict=False)
    if not fin:
        return None
    if ini in ('j', 'q', 'x', 'y'):                      # ju / yue are written with u, never ü
        fin = fin.translate(str.maketrans('üǖǘǚǜ', 'uūúǔù'))
    parts = ([f'[{ini}]'] if ini else []) + [f'[{fin}]']
    ok = _valid_tokens()
    return ''.join(parts) if not ok or all(t in ok for t in parts) else None


def default(ch):
    return _py(ch)[0]


def tag(text, level=1):
    """Text for CosyVoice with readings written in.
    level 0: lexicon words only.  level 1: + polyphonic characters whose reading here isn't their usual one.
    level 2: + the COMMON polyphonic characters even with their usual reading (used when a first take was misread)."""
    out = []
    for ch, p, src in readings(text):
        want = (src == 'lex' and ch in polyphonic()) or (level >= 1 and ch in polyphonic() and ch not in SKIP and p
                                and (p != default(ch) or (level >= 2 and ch in COMMON)))
        out.append((want and token(p)) or ch)
    return ''.join(out)


if __name__ == '__main__':
    for s in sys.argv[1:]:
        print(' '.join(f'{ch}({p}{"·" + src if src not in ("", "pypinyin", "g2pw") else ""})' if ch in polyphonic()
                       and ch not in SKIP and p else ch for ch, p, src in readings(s)))
        print('  L1:', tag(s, 1))
        print('  L2:', tag(s, 2))
