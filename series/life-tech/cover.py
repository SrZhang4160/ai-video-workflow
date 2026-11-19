#!/usr/bin/env python3
"""视频号 covers for 生活里的技术 (track life): one big drawing of the episode's own example + one line of hook words.
   python3 series/life-tech/cover.py [--desktop] life-01 life-02 life-03   → build/<id>/cover.png (1080×1920)
   --desktop also copies each to ~/Desktop/AI/videos/life/<id>_生活里的技术_视频号_封面.png (the old file is kept as _封面_旧.png).
视频号 is a recommendation feed, so no 第 N 集 and no series mark (Shuran, 2026-11-19). The page is the whiteboard renderer
(styles/whiteboard/board.html) with the episode's episode.js loaded, so the drawing helpers (lifePhone, lifeCrowd, lifeHouse…)
and colours are the video's own. Everything sits inside the centre 3:4 band (y 240–1680), because the 视频号 profile grid
crops 1080×1920 to 1080×1440: hook words y ≈ 290–450, drawing y 520–1360 (1080×840 stage), sub line y ≈ 1450–1530.
Words: meta.json → cover.zh.hook (≤ 8 字, one line) and cover.zh.sub."""
import json, os, shutil, sys
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PAGE = os.path.join(ROOT, "styles", "whiteboard", "board.html")
DESK = os.path.expanduser("~/Desktop/AI/videos/life")
STAGE_TOP = 520

# One cover drawing per episode, in stage coordinates (1080 × 840), using board.html helpers + the episode's life* helpers.
ART = {
    # a payment page that keeps spinning, ¥ amount, and two fingers tapping 确认付款 (×2)
    "life-01": r"""
      lifePhone(330, 20, 420, 800);
      T(540, 140, '付款', 58);
      T(540, 260, '¥ 25.00', 86);
      lifeSpin(540, 440, 84, BLU);
      T(540, 600, '支付中…', 50, GRY);
      lbox(390, 650, 300, 100, '确认付款', { size: 48, stroke: BLU, color: BLU, fill: LBLU, fillStyle: 'solid' });
      lifeFinger(440, 735, 32); lifeFinger(640, 735, -32);
      T(165, 640, '点一次', 54, RED); T(915, 640, '再点一次', 54, RED);
      arc(425, 720, 70, RED); arc(655, 720, 70, RED);
      T(900, 300, '×2 ?', 110, RED);
    """,
    # a big crowd of heads all pushing towards two concert tickets
    "life-02": r"""
      lifeTicket(300, 20, 480, 130, '演唱会门票', 58, DRED);
      lifeTicket(320, 170, 480, 130, '演唱会门票', 58, DRED);
      lifeCrowd(70, 500, 12, 5, 82, INK);
      for (const [x, y] of [[120, 470], [300, 450], [470, 430], [610, 430], [780, 450], [960, 470]])
        arrow(x, y, 540 + (x - 540) * 0.25, 330, { color: RED, width: 5 });
      T(150, 120, '一万张', 60, DRED);
    """,
    # your home with a phone playing a video, and the server holding that video right next door
    "life-03": r"""
      lifeHouse(50, 640, 420);
      lifePhone(335, 360, 115, 230); lifePlay(392, 480, 56);
      T(260, 730, '你家', 62);
      lifeServer(690, 290, 330, 330); lifePlay(855, 455, 100);
      T(855, 710, '附近的服务器', 54, LIFE_C);
      arrow(675, 455, 485, 455, { color: LIFE_C, width: 7 });
      T(580, 410, '离你不远', 42, LIFE_C);
    """,
}

# helpers the covers need that not every episode.js defines (added only when missing)
EXTRA = r"""
if (typeof lifeSpin === 'undefined') window.lifeSpin = (cx, cy, r, col) => group(() => {
  path(`M${cx + r} ${cy} A${r} ${r} 0 1 1 ${cx} ${cy - r}`, { stroke: col || BLU, strokeWidth: 8, roughness: 0.7 });
  circle(cx, cy - r, 14, { stroke: col || BLU, fill: col || BLU, fillStyle: 'solid', roughness: 0.5 }); });
// a fingertip pressing at (x, y), tilted by deg (the finger comes up from below)
window.lifeFinger = (x, y, deg) => { const g = group(() => {
  path(`M${x - 34} ${y + 190} V${y + 34} Q${x - 34} ${y} ${x} ${y} Q${x + 34} ${y} ${x + 34} ${y + 34} V${y + 190}`,
       { stroke: INK, strokeWidth: 5, fill: '#F6DCC4', fillStyle: 'solid', roughness: 1 });
  path(`M${x - 18} ${y + 44} Q${x} ${y + 14} ${x + 18} ${y + 44}`, { stroke: INK, strokeWidth: 3, roughness: 0.8 }); });
  g.setAttribute('transform', `rotate(${deg} ${x} ${y})`); return g; };
// tap marks: three short strokes fanning out from (x, y)
window.arc = (x, y, r, col) => group(() => { for (const a of [-2.4, -1.9, -1.4].map(a => x < 540 ? a : -Math.PI - a))
  line(x + Math.cos(a) * r * 0.5, y + Math.sin(a) * r * 0.5, x + Math.cos(a) * r, y + Math.sin(a) * r, { stroke: col, strokeWidth: 5, roughness: 0.8 }); });
"""

CSS = """
#tsvg, #cap { display: none }
#hook, #sub { position: absolute; left: 40px; right: 40px; text-align: center; font-family: "ZCOOL KuaiLe"; white-space: nowrap }
#hook { top: 290px; height: 170px; line-height: 170px; font-size: 128px; color: #222 }
#sub { top: 1440px; height: 100px; line-height: 100px; font-size: 64px; color: #0F8B8D }
"""


def render(page, eid):
    meta = json.load(open(os.path.join(ROOT, "episodes", eid, "meta.json")))
    c = meta["cover"]["zh"]
    hook = "".join(c["hook"])
    assert len(hook.replace("，", "").replace("？", "")) <= 8, f"{eid}: cover hook over 8 字: {hook}"
    ep = open(os.path.join(ROOT, "episodes", eid, "episode.js")).read()
    scene = "window.EPISODE.scenes = [{ title: ['', ''], cap: [{ zh: ' ' }], draw() { at(-1);\n" + ART[eid] + "\n} }];"
    page.add_init_script(ep + "\n" + scene)
    page.goto("file://" + PAGE + "?ratio=9x16&lang=zh")
    page.wait_for_function("window.ready === true")
    page.add_style_tag(content=CSS)
    page.evaluate(EXTRA)
    page.evaluate("""([top, hook, sub]) => {
      const st = document.getElementById('stage');
      Object.assign(st.style, { left: '0px', top: top + 'px', width: '1080px', height: '840px' });
      for (const [id, t] of [['hook', hook], ['sub', sub]]) {
        const d = document.createElement('div'); d.id = id; d.textContent = t; document.body.appendChild(d); }
    }""", [STAGE_TOP, hook, c.get("sub", "")])
    page.evaluate("async t => { await document.fonts.load('400 128px \"ZCOOL KuaiLe\"', t); await showScene(0); setFrame(1e6, 100, [0]); }",
                  hook + c.get("sub", ""))
    # shrink the hook if a font quirk makes it wider than the page
    page.evaluate("""() => { const h = document.getElementById('hook'); let s = 128;
      while (h.scrollWidth > h.clientWidth && s > 80) { s -= 4; h.style.fontSize = s + 'px'; } }""")
    page.wait_for_timeout(300)
    out = os.path.join(ROOT, "build", eid, "cover.png")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    page.screenshot(path=out)
    return out


def main():
    args = sys.argv[1:]
    desktop = "--desktop" in args
    ids = [a for a in args if not a.startswith("--")]
    with sync_playwright() as p:
        b = p.chromium.launch()
        for eid in ids:
            pg = b.new_page(viewport={"width": 1080, "height": 1920})
            out = render(pg, eid); pg.close(); print(out)
            if desktop:
                dst = os.path.join(DESK, f"{eid}_生活里的技术_视频号_封面.png")
                old = dst.replace("_封面.png", "_封面_旧.png")
                if os.path.exists(dst) and not os.path.exists(old):
                    os.rename(dst, old)
                shutil.copyfile(out, dst); print(dst)
        b.close()


if __name__ == "__main__":
    main()
