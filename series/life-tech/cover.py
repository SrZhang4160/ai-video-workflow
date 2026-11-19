#!/usr/bin/env python3
"""Series covers for 生活里的技术 (track life): the shared whiteboard cover template (styles/whiteboard/cover.html),
filled from each episode's meta.json → cover.zh. Kept here so engine/series_cover*.py stay untouched.
   python3 series/life-tech/cover.py <out_dir> life-01 life-02 life-03   → <out_dir>/<id>-cover.png (1080×1920)
The one-line hook (≤ 8 字) is shown on two lines, split after its comma or in the middle, so it reads at thumbnail size;
the words are the meta.json words. No account slogan, no terminal box (the viewers don't write code)."""
import json, os, sys
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PAGE = os.path.join(ROOT, "styles", "whiteboard", "cover.html")
COLOR = "#0F8B8D"   # series colour, the same teal the videos draw the system side with (LIFE_C in episode.js)


def two_lines(hook):
    if len(hook) > 1:
        return hook
    h = hook[0]
    k = h.find("，") + 1 or (len(h) + 1) // 2
    return [h[:k], h[k:]]


def main():
    out, ids = sys.argv[1], sys.argv[2:]
    os.makedirs(out, exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch()
        for eid in ids:
            meta = json.load(open(os.path.join(ROOT, "episodes", eid, "meta.json")))
            c = meta["cover"]["zh"]
            d = {"color": COLOR, "theme": "light", "name": "生活里的技术", "kind": "", "epA": "第", "epB": "集",
                 "n": f"{int(meta['lesson']):02d}", "hook": two_lines(c["hook"]), "sub": c.get("sub", ""), "foot": ""}
            pg = b.new_page(viewport={"width": 1080, "height": 1920}); pg.goto("file://" + PAGE)
            pg.evaluate("document.fonts.ready")
            pg.evaluate("d => fill(d)", d); pg.wait_for_timeout(400); pg.evaluate("d => fill(d)", d)
            pg.evaluate("() => { const t = document.querySelector('#term'); if (t) t.remove(); }")
            path = os.path.join(out, f"{eid}-cover.png"); pg.screenshot(path=path); pg.close()
            print(path)
        b.close()


if __name__ == "__main__":
    main()
