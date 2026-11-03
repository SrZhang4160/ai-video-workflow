"""Save an approved episode's final cuts for posting by hand.

  python3 engine/save_finals.py episodes/2026-10-26 [--out ~/Desktop/AI/videos]

One folder per air date, holding every approved episode of that day (all series): <out>/<date>/.
Copies build/<id>/<platform>.mp4 + cover and writes the post text, one set per platform that posts on that day
(series/schedule.json, slots of the episode's track), named <HHMM>_<series label>_<platform>, so the folder sorts by posting time:
    2026-11-03/1630_AI快讯2_小红书.mp4   …_封面.png   …_文案.txt     2026-11-03/1930_第11课_抖音.mp4 …
plus <series label>_口播稿.txt (what the voice says, zh and en).
Re-running after a new approval keeps every version: a file that would change is first moved to
<date>/旧版本/<label>_<time it was saved>/.
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
    sched = json.load(open(os.path.join(ROOT, "series", "schedule.json")))
    track = meta.get("track", "rust")
    slots = {s["key"]: s for s in sched["slots"] if s.get("series", "rust") == track}
    dow = (datetime.date.fromisoformat(meta["date"]).weekday() + 1) % 7      # schedule.json: 0 = Sunday
    lesson = doc.get("lesson")
    label = sched.get("series", {}).get(track, {}).get("folder_label", "第{n}课")
    name = label.format(n=lesson) if lesson else eid
    folder = os.path.join(a.out, meta["date"])
    os.makedirs(folder, exist_ok=True)
    old_dir = None

    def put(dst, data=None, src=None):
        """Write dst (from src file or data text); if a different version is already there, move it to 旧版本/ first."""
        nonlocal old_dir
        new = data.encode() if data is not None else open(src, "rb").read()
        if os.path.exists(dst):
            if open(dst, "rb").read() == new:
                return
            if old_dir is None:
                stamp = datetime.datetime.fromtimestamp(os.path.getmtime(dst)).strftime("%Y%m%d-%H%M")
                old_dir = os.path.join(folder, "旧版本", f"{name}_{stamp}"); os.makedirs(old_dir, exist_ok=True)
            shutil.move(dst, os.path.join(old_dir, os.path.basename(dst)))
        if src:
            shutil.copy2(src, dst)
        else:
            open(dst, "w").write(data)
    quiz = meta.get("quiz") or {}
    saved, missing = [], []
    for key in meta.get("platforms", list(NAMES)):
        slot = slots.get(key)
        if not slot or dow not in slot["dow"]:
            continue                                                          # e.g. no LinkedIn on weekends
        src = os.path.join(ROOT, "build", eid, f"{key}.mp4")
        if not os.path.exists(src):
            missing.append(key); continue
        stem = os.path.join(folder, f"{slot['time'].replace(':', '')}_{name}_{NAMES[key]}")
        put(stem + ".mp4", src=src)
        cover = os.path.join(ROOT, "build", eid, f"{key}-cover.png")
        if os.path.exists(cover):
            put(stem + "_封面.png", src=cover)
        pin = quiz.get("answer_zh" if key in ("xhs", "douyin") else "answer_en")
        put(stem + "_文案.txt", data=post_text(meta["captions"].get(key, {}), pin, f"{meta['date']} {slot['time']}"))
        saved.append(NAMES[key])
    spoken = []
    for lang in ("zh", "en"):
        t = os.path.join(ep_dir, "voice", f"{lang}.txt")
        if os.path.exists(t):
            spoken.append(f"[{lang}]\n" + "".join(f"{i}. {l}\n" for i, l in enumerate(open(t, encoding="utf-8").read().split("\n"), 1) if l.strip()))
    if spoken:
        put(os.path.join(folder, f"{name}_口播稿.txt"), data="\n".join(spoken))
    print(f"{eid}: saved {', '.join(saved) or 'nothing'} → {folder}" + (f" (previous version → {old_dir})" if old_dir else ""))
    if missing:
        print(f"missing build/{eid}/<platform>.mp4 for: {', '.join(missing)} (render or download the finals first)")
        sys.exit(1)


if __name__ == "__main__":
    main()
