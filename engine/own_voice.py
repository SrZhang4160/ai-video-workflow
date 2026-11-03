#!/usr/bin/env python3
"""Turn one take of you reading the script into the episode's voice clips.

Usage (voice venv: whisper, pypinyin, jieba; ffmpeg on PATH):
  ~/cosyvoice3/.venv/bin/python engine/own_voice.py episodes/<id> <recording> [--lang zh|en] [--fit SECONDS]

<recording>: any audio file (Voice Memos .m4a, .wav, .mp3 …) of you reading voice/<lang>.txt top to bottom.
Pause briefly between lines. If you stumble, stop for about 2 seconds and read the whole line again: the re-read wins.

Steps:
  1. clean up: mono 24 kHz, low-cut at 80 Hz, noise reduction, loudness to -16 LUFS (same level as the cloned voice)
  2. Whisper (word timestamps, prompted with the script) finds where each line starts and ends
  3. cut one clip per line, trim the silence around it, shorten long pauses inside it to 0.3 s
  4. --fit SECONDS: speed up evenly (pitch kept, at most 1.15×) if the clips add up to more than that
  5. write voice/<lang>/sNN.wav, drop sNN from manifest.json (and the cloned sNN.ogg) so render.py and the Mac voice
     job use your recording; voice/<lang>/recorded.json keeps each line's text hash, so a line edited later falls
     back to the cloned voice until you record it again
Prints one line per clip; lines it could not find are listed at the end (record just those, see --lines).
  --lines 4,7   the recording holds only these lines (re-takes); other clips are left as they are
"""
import difflib, hashlib, json, os, re, subprocess, sys, tempfile

import numpy as np
import soundfile as sf

sys.path.insert(0, os.path.dirname(__file__))
from zh_check import num_zh, py          # noqa: E402  (word-aware pinyin, digits → Chinese)

SR = 24000
CLEAN = 'highpass=f=80,afftdn=nf=-25,loudnorm=I=-16:TP=-1.5:LRA=11'


def vkey(lang, line):                    # must match engine/render.py vkey
    return hashlib.sha1(f"{lang}|{line.strip()}".encode()).hexdigest()[:16]


def units(text, lang):
    """Comparable units of a piece of text: toneless pinyin per Chinese character, lowercase English words."""
    text = re.sub(r'\d+', lambda m: num_zh(m.group()) if lang == 'zh' else m.group(), text)
    out = []
    for tok in re.findall(r'[一-鿿]+|[A-Za-z0-9\']+', text):
        if re.match(r'[一-鿿]', tok):
            out += [re.sub(r'\d', '', p) for p in py(tok)]
        else:
            out += list(tok.lower().replace("'", ''))   # letters: Whisper splits names oddly (Meta → "met a", Fo → "fall")
    return out


def heard_units(result, lang):
    """[(unit, start, end)] from Whisper word timestamps; a multi-character word's time is shared out evenly."""
    out = []
    for seg in result['segments']:
        for w in seg.get('words', []):
            us = units(w['word'], lang)
            if not us:
                continue
            step = (w['end'] - w['start']) / len(us)
            out += [(u, w['start'] + k * step, w['start'] + (k + 1) * step) for k, u in enumerate(us)]
    return out


def locate(line_u, heard, pos):
    """Where line_u was read, at or after heard index pos: (ratio, first, last) heard indexes. Prefers the last
    good reading in the window, so a stumble followed by a full re-read uses the re-read."""
    hu = [h[0] for h in heard]
    n = len(line_u)
    window = hu[pos:pos + 3 * n + 30]
    cands = []
    for c in range(len(window)):
        if window[c] not in line_u[:3]:
            continue
        sm = difflib.SequenceMatcher(None, line_u, window[c:c + n + 2], autojunk=False)
        blocks = [b for b in sm.get_matching_blocks() if b.size]
        if not blocks:
            continue
        ratio = sum(b.size for b in blocks) / n
        cands.append((ratio, pos + c + blocks[0].b, pos + c + blocks[-1].b + blocks[-1].size - 1))
    if not cands:
        return (0.0, None, None)
    top = max(c[0] for c in cands)
    good = [c for c in cands if c[0] >= top - 0.1]
    # the last near-complete reading wins (a re-read after a stumble), but it must not start inside an earlier good one
    pick = good[0]
    for c in good[1:]:
        if c[1] > pick[2]:
            pick = c
    return pick


GAP = 0.45     # seconds: a pause this long is between lines; pauses inside a line (commas) are shorter
RETAKE = 1.0   # a stop this long inside a line means: stumbled, re-reading the whole line


def pauses(x, thr_db=-35):
    """[(start, end)] seconds of quiet stretches at least GAP long."""
    f = int(0.01 * SR)
    e = np.array([np.sqrt(np.mean(x[k:k + f] ** 2)) + 1e-9 for k in range(0, len(x) - f + 1, f)])
    quiet = 20 * np.log10(e / np.percentile(e, 95)) < thr_db
    out, k = [], 0
    while k < len(quiet):
        if quiet[k]:
            j = k
            while j < len(quiet) and quiet[j]: j += 1
            if (j - k) / 100 >= GAP: out.append((k / 100, j / 100))
            k = j
        else:
            k += 1
    return out


def tighten(x, max_gap=0.5, keep=0.3, thr_db=-40):
    """Trim silence at both ends (80 ms kept) and shorten pauses longer than max_gap to keep seconds."""
    f = int(0.01 * SR)
    e = np.array([np.sqrt(np.mean(x[k:k + f] ** 2)) + 1e-9 for k in range(0, len(x) - f + 1, f)])
    loud = 20 * np.log10(e) > thr_db + 20 * np.log10(np.percentile(e, 95))
    idx = np.where(loud)[0]
    if not len(idx):
        return x
    a, b = max(0, idx[0] - 8), min(len(e), idx[-1] + 12)
    out, k = [], a
    while k < b:
        if not loud[k]:
            j = k
            while j < b and not loud[j]: j += 1
            gap = j - k
            out.append(x[k * f:(k + min(gap, int(keep * 100) if gap > max_gap * 100 else gap)) * f]); k = j
        else:
            j = k
            while j < b and loud[j]: j += 1
            out.append(x[k * f:j * f]); k = j
    return np.concatenate(out)


def main():
    args = sys.argv[1:]
    ep, rec = args[0].rstrip('/'), args[1]
    lang = args[args.index('--lang') + 1] if '--lang' in args else 'zh'
    fit = float(args[args.index('--fit') + 1]) if '--fit' in args else None
    lines = [l.strip() for l in open(os.path.join(ep, 'voice', f'{lang}.txt'), encoding='utf-8').read().splitlines()]
    todo = [int(n) for n in args[args.index('--lines') + 1].split(',')] if '--lines' in args else list(range(1, len(lines) + 1))
    vdir = os.path.join(ep, 'voice', lang); os.makedirs(vdir, exist_ok=True)

    tmp = tempfile.mkdtemp()
    clean = os.path.join(tmp, 'clean.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', rec, '-ac', '1', '-ar', str(SR), '-af', CLEAN, clean], check=True)
    audio, _ = sf.read(clean, dtype='float32')

    import whisper
    model = whisper.load_model('small')
    script = ('，' if lang == 'zh' else ' ').join(lines[i - 1] for i in todo)
    res = model.transcribe(clean, language=lang, word_timestamps=True, fp16=False,
                           initial_prompt=script[-200:] if lang == 'zh' else script[-400:])
    heard = heard_units(res, lang)

    spans, missing, pos = {}, [], 0
    for i in todo:
        lu = units(lines[i - 1], lang)
        ratio, a, b = locate(lu, heard, pos) if lu else (0, None, None)
        if a is None or ratio < 0.6:
            missing.append(i); continue
        spans[i] = (heard[a][1], heard[b][2], ratio); pos = b + 1

    # Whisper's word times are rough (and English / numbers often don't match), so cut at real pauses: a line ends at the
    # first pause of at least GAP after its last recognised word, the next line starts at the last such pause before its
    # first recognised word. Whatever lies between (a stumble before a re-read) is dropped.
    quiet = pauses(audio)
    order = sorted(spans)
    clips = {}
    end_all = len(audio) / SR
    for k, i in enumerate(order):
        s, e, _ = spans[i]
        lo = spans[order[k - 1]][1] if k else 0.0
        hi = spans[order[k + 1]][0] if k + 1 < len(order) else end_all
        before = [q for q in quiet if lo <= q[0] and q[1] <= s + 0.05]
        after = [q for q in quiet if q[0] >= e - 0.05 and q[1] <= hi]
        a = before[-1][1] - 0.15 if before else max(lo, s - 0.3)
        b = after[0][0] + 0.2 if after else (hi if k + 1 < len(order) else end_all)
        inner = [q for q in quiet if a < q[0] and q[1] < b and q[1] - q[0] >= RETAKE]
        if inner and b - inner[-1][1] >= 0.5 * (b - a):
            a = inner[-1][1] - 0.15                     # a long stop inside the line, then most of it again: a re-read
        clips[i] = tighten(audio[max(0, int(a * SR)):int(b * SR)])

    total = sum(len(c) for c in clips.values()) / SR
    tempo = min(1.15, total / fit) if fit and total > fit else 1.0
    man_p = os.path.join(vdir, 'manifest.json')
    man = json.load(open(man_p)) if os.path.exists(man_p) else {}
    rec_p = os.path.join(vdir, 'recorded.json')
    recd = json.load(open(rec_p)) if os.path.exists(rec_p) else {}
    for i, c in clips.items():
        sid = f's{i:02d}'
        out = os.path.join(vdir, sid + '.wav')
        if tempo > 1.0:
            raw = os.path.join(tmp, sid + '.wav'); sf.write(raw, c, SR)
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', f'atempo={tempo:.3f}', out], check=True)
        else:
            sf.write(out, c, SR)
        man.pop(sid, None); man.get('_groups', {}).pop(sid, None)
        if os.path.exists(os.path.join(vdir, sid + '.ogg')):
            os.remove(os.path.join(vdir, sid + '.ogg'))
        recd[sid] = vkey(lang, lines[i - 1])
        print(f'{sid} {len(c) / SR / tempo:5.1f}s  match {spans[i][2]:.0%}  {lines[i - 1]}')
    json.dump(man, open(man_p, 'w'), ensure_ascii=False, indent=1)
    json.dump(recd, open(rec_p, 'w'), indent=1)
    print(f'{os.path.basename(ep)} {lang}: {len(clips)}/{len(todo)} lines from your recording, '
          f'{total / tempo:.1f}s{f", sped up {tempo:.2f}×" if tempo > 1 else ""}')
    if missing:
        print('not found (record these again, then run with --lines ' + ','.join(map(str, missing)) + '):')
        for i in missing:
            print(f'  s{i:02d} {lines[i - 1]}')
    sys.exit(1 if missing else 0)


if __name__ == '__main__':
    main()
