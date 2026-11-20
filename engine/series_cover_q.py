#!/usr/bin/env python3
"""小红书 question cover (experiment 003, 2026-11-20): the episode number shrinks to a small badge, each episode is one
standalone question with its answer and three points (styles/whiteboard/cover_q.html). xhs only; douyin/tiktok keep
engine/series_cover.py.

  python3 engine/series_cover_q.py episodes/ev-07 [episodes/ev-08 ...]

Needs in meta.json (episodes without it are skipped):
  "cover": {"zh": {..., "q": {"badge": "Agent 评测 · 07", "hook": ["评测为什么", "要放进沙箱？"],
                             "answer": "不然跑一遍，真退一次钱", "points": ["…", "…", "…"]}}}
Writes build/<id>/xhs-cover.png and copies it to ~/Desktop/AI/videos/<series folder>/<id>/xhs-cover.png.

NOTE: render.py (through series_cover.make) rewrites xhs-cover.png in the old layout on every render.
After a re-render, run this script again.
"""
import argparse, json, os, shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGE = os.path.join(ROOT, "styles", "whiteboard", "cover_q.html")
W, H = 1080, 1440
DESK = os.path.expanduser("~/Desktop/AI/videos")
# meta.json "track" → series colour, account line, Desktop folder
SERIES = {
    "ev": {"color": "#E8553E", "foot": "每天1分钟 · 学AI工程", "folder": "Agent评测"},
}


def make(ep_dir, browser):
    meta = json.load(open(os.path.join(ep_dir, "meta.json")))
    q = ((meta.get("cover") or {}).get("zh") or {}).get("q")
    s = SERIES.get(meta.get("track"))
    if not q or not s:
        return None
    ep = os.path.basename(os.path.abspath(ep_dir))
    out_dir = os.path.join(ROOT, "build", ep); os.makedirs(out_dir, exist_ok=True)
    d = {"color": s["color"], "foot": s["foot"], **q}
    page = browser.new_page(viewport={"width": W, "height": H})
    page.goto("file://" + PAGE); page.evaluate("document.fonts.ready")
    page.evaluate("d => fill(d)", d)
    page.wait_for_timeout(400)   # the Chinese font loads per unicode range once the text is in
    r = page.evaluate("d => fill(d)", d)
    if not r["ok"]:
        page.close()
        raise SystemExit(f"{ep}: text does not fit even at 85% size: {r['sizes']}")
    out = os.path.join(out_dir, "xhs-cover.png"); page.screenshot(path=out); page.close()
    desk = os.path.join(DESK, s["folder"], ep)
    if os.path.isdir(desk):
        shutil.copyfile(out, os.path.join(desk, "xhs-cover.png"))
    else:
        print(f"{ep}: no {desk}, Desktop copy skipped")
    return out, r["sizes"]


if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("episodes", nargs="+")
    a = ap.parse_args()
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b = p.chromium.launch()
        for e in a.episodes:
            r = make(e, b)
            if r:
                print(r[0], {k: v.get("size") for k, v in r[1].items() if "size" in v})
        b.close()
