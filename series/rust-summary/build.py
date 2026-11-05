"""Build the Rust 20-lesson summary: handbook PDF + 小红书 image cards.

  python3 series/rust-summary/build.py [--out ~/Desktop/AI/videos/Rust20课总结]
"""
import argparse, os, glob
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--out", default=os.path.expanduser("~/Desktop/AI/videos/Rust20课总结"))
    a = ap.parse_args(); os.makedirs(a.out, exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page()
        pg.goto(f"file://{HERE}/handbook.html"); pg.wait_for_load_state("networkidle"); pg.evaluate("document.fonts.ready")
        pdf = os.path.join(a.out, "Rust20课学习手册.pdf")
        pg.pdf(path=pdf, format="A4", print_background=True, prefer_css_page_size=True)
        print("pdf →", pdf)
        cards = os.path.join(HERE, "cards.html")
        if os.path.exists(cards):
            pg = b.new_page(viewport={"width": 1080, "height": 1440}, device_scale_factor=1)
            pg.goto(f"file://{cards}"); pg.wait_for_load_state("networkidle"); pg.evaluate("document.fonts.ready")
            for old in glob.glob(os.path.join(a.out, "小红书图*.png")): os.remove(old)
            for i, el in enumerate(pg.query_selector_all(".card"), 1):
                path = os.path.join(a.out, f"小红书图{i:02d}.png"); el.screenshot(path=path); print("card →", path)
        b.close()

if __name__ == "__main__":
    main()
