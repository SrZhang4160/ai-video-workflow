"""Export what other steps need from an episode.

  python3 engine/export.py episodes/2026-10-26

Writes  episodes/<id>/voice/zh.txt, en.txt   one line per caption page (what to say) → for recording or CosyVoice
        build/<id>/doc.json                   the review-board document (merge with media fields before writing)
"""
import json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def info(ep_dir):
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page()
        pg.add_init_script(path=os.path.join(ep_dir, "episode.js"))
        pg.goto(f"file://{ROOT}/engine/lesson.html?ratio=3x4&lang=zh"); pg.wait_for_function("window.ready === true")
        out = pg.evaluate("({n: EPISODE.n, scenes: EP_INFO()})"); b.close()
    return out


def main():
    ep_dir = os.path.abspath(sys.argv[1]); eid = os.path.basename(ep_dir)
    meta = json.load(open(os.path.join(ep_dir, "meta.json")))
    ep = info(ep_dir)
    vdir = os.path.join(ep_dir, "voice"); os.makedirs(vdir, exist_ok=True)
    for lang in ("zh", "en"):               # one line per caption page = one voice clip
        lines = [(c.get("say_" + lang) or "").strip().replace("\n", " ") for s in ep["scenes"] for c in s["caps"]]
        path = os.path.join(vdir, f"{lang}.txt")
        if not any(lines):                   # e.g. an English-only LinkedIn episode
            if os.path.exists(path): os.remove(path)
            continue
        open(path, "w").write("\n".join(lines) + "\n")
    doc = {
        "date": meta["date"], "lesson": ep["n"],
        "topic_zh": meta.get("topic_zh", ""), "topic_en": meta.get("topic_en", ""),
        "title_zh": meta["captions"].get("xhs", {}).get("title", meta.get("topic_zh", "")),
        "title_en": meta["captions"].get("linkedin", {}).get("title", meta.get("topic_en", "")),
        "platforms": meta.get("platforms", ["xhs", "douyin", "tiktok", "linkedin"]),
        "script": [{"zh": c.get("zh") or "", "en": c["en"]} for s in ep["scenes"] for c in s["caps"]],
        "captions": meta["captions"],
    }
    out = os.path.join(ROOT, "build", eid); os.makedirs(out, exist_ok=True)
    json.dump(doc, open(os.path.join(out, "doc.json"), "w"), ensure_ascii=False, indent=1)
    print(f"{eid}: {len(ep['scenes'])} scenes, {len(doc['script'])} caption lines → voice/zh.txt, voice/en.txt, build/{eid}/doc.json")


if __name__ == "__main__":
    main()
