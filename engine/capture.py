#!/usr/bin/env python3
"""Real screenshots for news episodes (GitHub repo pages, README demos, Hugging Face / arXiv paper pages, project pages).

    python3 engine/capture.py episodes/<id> <name> <url> [--selector CSS] [--width 1280] [--height 900] [--light] [--scroll 0]

Writes episodes/<id>/assets/<name>.png (dark mode by default, to match the stage). In episode.js use
shot('<name>.png', {x, y, w, h}) to place it. With --selector, only that element is captured (e.g. GitHub's README:
'article.markdown-body', a paper figure: 'figure:nth-of-type(1)'). Always credit the source on screen with src().
"""
import argparse, os
from playwright.sync_api import sync_playwright


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("episode"); ap.add_argument("name"); ap.add_argument("url")
    ap.add_argument("--selector"); ap.add_argument("--width", type=int, default=1280); ap.add_argument("--height", type=int, default=900)
    ap.add_argument("--light", action="store_true"); ap.add_argument("--scroll", type=int, default=0, help="scroll down N px first")
    ap.add_argument("--scale", type=float, default=2, help="device scale factor (sharp text)")
    a = ap.parse_args()
    out = os.path.join(a.episode, "assets", a.name if a.name.endswith(".png") else a.name + ".png")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": a.width, "height": a.height}, device_scale_factor=a.scale,
                        color_scheme="light" if a.light else "dark")
        pg.goto(a.url, wait_until="networkidle", timeout=60000)
        for sel in ["button:has-text('Accept')", "button:has-text('Reject')", "[aria-label='Close']"]:   # cookie banners, best effort
            try: pg.locator(sel).first.click(timeout=800)
            except Exception: pass
        if a.scroll: pg.mouse.wheel(0, a.scroll); pg.wait_for_timeout(600)
        if a.selector:
            el = pg.locator(a.selector).first
            el.scroll_into_view_if_needed(); el.screenshot(path=out)
        else:
            pg.screenshot(path=out)
        b.close()
    print(out)


if __name__ == "__main__":
    main()
