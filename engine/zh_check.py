#!/usr/bin/env python3
"""Mandarin script + voice check for one episode.

Usage (needs pypinyin, jieba; --audio also needs whisper — all in the voice venv):
  ~/cosyvoice3/.venv/bin/python engine/zh_check.py episodes/<id>            # script only
  ~/cosyvoice3/.venv/bin/python engine/zh_check.py episodes/<id> --audio    # + listen to voice/zh/sNN.ogg

Reads voice/zh.txt (what the voice actually says, one line per clip) and reports per line:
  ERR  English words the cloned voice is known to mispronounce (say them in Chinese instead)
  WARN other bare English words, Arabic digits or symbols (spell them out in say_zh), lines too long to say in one breath
  多音  polyphonic characters with the reading chosen in context, so a human can confirm it (行 xíng/háng, 长 cháng/zhǎng …)
  AUDIO (--audio) Whisper transcript whose pinyin+tones differ from the script: wrong word, wrong tone, or a clipped ending
Exit code 1 if there is any ERR or AUDIO mismatch.
"""
import difflib, json, os, re, sys

import jieba
from pypinyin import Style, pinyin

jieba.setLogLevel(60)

# Bare English keywords the cloned zh voice gets wrong; the fix that worked before.
BAD_EN = {'if': '条件判断', 'match': '模式匹配', 'option': '可选类型', 'result': '结果类型', 'unwrap': '解包',
          'trait': '特征', 'null': '空值', 'else': '否则', 'loop': '循环', 'let': '绑定'}
# English words that are fine inside Chinese speech (spoken clearly in earlier episodes).
OK_EN = {'a', 'i', 'b', 'c', 'e', 'p', 'm', 'agent', 'agents', 'cargo', 'rust', 'api', 'doordash'}
# Characters whose reading depends on the word; the tool prints the chosen reading for these.
POLY = set('行长重还得为处发便量数调传降藏种差干结空解少乐更将相应分正朝参系角假难省曾称缝背薄')
MAX_CHARS = 20          # one clip should be one breath
MAX_RUN = 13            # characters between pauses (，。、：；？！)


def py(text):
    """Pinyin with tone numbers, word-aware (jieba segmentation + pypinyin phrase dictionary)."""
    out = []
    for w in jieba.cut(text):
        out += [p[0] for p in pinyin(w, style=Style.TONE3, neutral_tone_with_five=True, errors='ignore')]
    return out


def check_line(i, s):
    msgs = []
    for w in re.findall(r'[A-Za-z][A-Za-z+#.]*', s):
        lw = w.lower()
        if lw in BAD_EN:
            msgs.append(('ERR', f'"{w}" → 说成「{BAD_EN[lw]}」'))
        elif lw not in OK_EN and not re.fullmatch(r'[A-Z](\s[A-Z])*', w):
            msgs.append(('WARN', f'English "{w}" in Chinese speech: confirm it is said right'))
    if re.search(r'\d', s):
        msgs.append(('WARN', 'digits: spell the number out in say_zh (九亿九千三百万)'))
    if re.search(r'[%$&@/=<>_*]', s):
        msgs.append(('WARN', 'symbol: spell it out in say_zh'))
    han = re.sub(r'[^一-鿿]', '', s)
    if len(han) > MAX_CHARS:
        msgs.append(('WARN', f'{len(han)} Chinese characters: split into two lines'))
    for run in re.split(r'[，。、：；？！,.:;?!]', s):
        # syllables: one per Chinese character or spelled letter (A I), about two per English word
        n = len(re.findall(r'[一-鿿]', run)) + sum(1 if len(w) == 1 else 2 for w in re.findall(r'[A-Za-z]+', run))
        if n > MAX_RUN:
            msgs.append(('WARN', f'no pause for {n} characters in "{run.strip()}": add a comma'))
    hits = []
    for w in jieba.cut(s):
        if any(ch in POLY for ch in w):
            hits.append(f'{w}({" ".join(py(w))})')
    if hits:
        msgs.append(('多音', ' '.join(hits)))
    return msgs


CN_DIGIT = '零一二三四五六七八九'


def num_zh(n):
    """Whisper writes 9300 for 九千三百; turn digits back into Chinese (up to 9999 per group; 亿/万 stay as written)."""
    n = int(n)
    if n < 10:
        return CN_DIGIT[n]
    out, zero = '', False
    for unit, v in (('千', 1000), ('百', 100), ('十', 10), ('', 1)):
        d = n // v % 10
        if d:
            out += ('零' if zero and out else '') + CN_DIGIT[d] + unit; zero = False
        elif out:
            zero = True
    return out[1:] if out.startswith('一十') else out


def norm_py(text):
    """Toneless pinyin of the Chinese in a line. Tones are left out: Whisper picks characters by context, so its tones
    are guesses. English is left out too: Whisper writes it as random characters (DoorDash → 多尔达时)."""
    text = re.sub(r'\d+', lambda m: num_zh(m.group()), text)
    return [re.sub(r'\d', '', p) for p in py(re.sub(r'[^一-鿿]', '', text))]


def audio_check(ep, lines):
    import whisper
    model = whisper.load_model('small')
    bad = 0
    for i, s in enumerate(lines, 1):
        f = os.path.join(ep, 'voice', 'zh', f's{i:02d}.wav')            # your own recording (engine/own_voice.py)
        if not os.path.exists(f):
            f = f[:-4] + '.ogg'
        if not os.path.exists(f):
            print(f's{i:02d} AUDIO missing {f}'); bad += 1; continue
        heard = model.transcribe(f, language='zh', initial_prompt='以下是普通话的句子。', fp16=False)['text'].strip()
        want, got = norm_py(s), norm_py(heard)
        # script syllables that were not heard, or heard as something else; extra heard syllables are ignored
        # (usually an English word written in Chinese characters)
        diffs = [(want[a1:a2], got[b1:b2]) for op, a1, a2, b1, b2 in
                 difflib.SequenceMatcher(None, want, got, autojunk=False).get_opcodes() if op in ('replace', 'delete')]
        if diffs:
            bad += 1
            print(f's{i:02d} AUDIO want 「{s}」\n      heard「{heard}」\n      ' +
                  '; '.join(f'{" ".join(w)} → {" ".join(g) or "(missing)"}' for w, g in diffs))
    return bad


def main():
    ep = sys.argv[1].rstrip('/')
    lines = [l.strip() for l in open(os.path.join(ep, 'voice', 'zh.txt'), encoding='utf-8') if l.strip()]
    errs = 0
    meta = os.path.join(ep, 'meta.json')
    own = os.path.exists(meta) and json.load(open(meta, encoding='utf-8')).get('voice') == 'own'
    if own:
        print('voice: you record this episode, so English / digit / symbol warnings are skipped')
    for i, s in enumerate(lines, 1):
        for kind, m in check_line(i, s):
            if own and kind == 'WARN' and not m.startswith(('no pause', '多音')) and 'Chinese characters' not in m:
                continue
            errs += kind == 'ERR'
            print(f's{i:02d} {kind:4} {m}')
    if '--audio' in sys.argv:
        errs += audio_check(ep, lines)
    print(f'{os.path.basename(ep)}: {len(lines)} lines, {"OK" if not errs else f"{errs} to fix"}')
    sys.exit(1 if errs else 0)


if __name__ == '__main__':
    main()
