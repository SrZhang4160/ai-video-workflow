"""Save an approved episode's final cuts for posting by hand.

  python3 engine/save_finals.py episodes/2026-10-26 [--out ~/Desktop/AI/videos]

Copies build/<id>/<platform>.mp4 + cover into <out>/<date>_第N课/ and writes the post text, one set per platform
that posts on that day (series/schedule.json), named <date>_<HHMM>_<platform>:
    2026-10-26_1930_小红书.mp4   2026-10-26_1930_小红书_封面.png   2026-10-26_1930_小红书_文案.txt
Safe to re-run: files are overwritten with the current build.
"""
import argparse, datetime, json, os, shutil, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NAMES = {"xhs": "小红书", "douyin": "抖音", "tiktok": "TikTok", "linkedin": "LinkedIn"}


def post_text(cap, pin, when):
    tags = " ".join(t if t.startswith("#") else "#" + t for t in cap.get("tags", []))
    parts = [f"发布时间：{when} ET", cap.get("title"), cap.get("body"), tags]
    if pin:
        parts.append("置顶评论（发完再发）：\n" + pin)
    return "\n\n".join(p for p in parts if p) + "\n"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("ep_dir")
    ap.add_argument("--out", default=os.path.expanduser("~/Desktop/AI/videos"))
    a = ap.parse_args()
    ep_dir = os.path.abspath(a.ep_dir); eid = os.path.basename(ep_dir)
    meta = json.load(open(os.path.join(ep_dir, "meta.json")))
    doc = json.load(open(os.path.join(ROOT, "build", eid, "doc.json")))
    slots = {s["key"]: s for s in json.load(open(os.path.join(ROOT, "series", "schedule.json")))["slots"]}
    dow = (datetime.date.fromisoformat(meta["date"]).weekday() + 1) % 7      # schedule.json: 0 = Sunday
    lesson = doc.get("lesson")
    folder = os.path.join(a.out, f"{meta['date']}_第{lesson}课" if lesson else meta["date"])
    os.makedirs(folder, exist_ok=True)
    quiz = meta.get("quiz") or {}
    saved, missing = [], []
    for key in meta.get("platforms", list(NAMES)):
        slot = slots.get(key)
        if not slot or dow not in slot["dow"]:
            continue                                                          # e.g. no LinkedIn on weekends
        src = os.path.join(ROOT, "build", eid, f"{key}.mp4")
        if not os.path.exists(src):
            missing.append(key); continue
        stem = os.path.join(folder, f"{meta['date']}_{slot['time'].replace(':', '')}_{NAMES[key]}")
        shutil.copy2(src, stem + ".mp4")
        cover = os.path.join(ROOT, "build", eid, f"{key}-cover.png")
        if os.path.exists(cover):
            shutil.copy2(cover, stem + "_封面.png")
        pin = quiz.get("answer_zh" if key in ("xhs", "douyin") else "answer_en")
        open(stem + "_文案.txt", "w").write(post_text(meta["captions"].get(key, {}), pin, f"{meta['date']} {slot['time']}"))
        saved.append(NAMES[key])
    print(f"{eid}: saved {', '.join(saved) or 'nothing'} → {folder}")
    if missing:
        print(f"missing build/{eid}/<platform>.mp4 for: {', '.join(missing)} (render or download the finals first)")
        sys.exit(1)


if __name__ == "__main__":
    main()
