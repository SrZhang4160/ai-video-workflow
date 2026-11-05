"""Shoot a drama episode's live shots from its storyboard (pipeline v2, series/system-design/PIPELINE.md).

  python3 engine/shoot.py episodes/2026-11-04-sd [--only 1,5,12] [--force] [--dry] [--jobs 6]

For every shot with gen.mode == "live" in storyboard.json:
  1. first frame: FLUX Kontext (max/multi) puts the cast's fixed headshots (series/system-design/cast/<id>.jpg) into the
     shot's location (storyboard.json → locations), vertical 9:16; FLUX Ultra when no main character is in the shot;
  2. performance: Kling 3.0 Pro image-to-video from that frame. Each main character is an element (@ElementN) with
     their headshot and their locked voice (cast/voices.json), and speaks the shot's dialogue in Mandarin with lip-sync;
     Kling also generates room sound / SFX from the storyboard's `sfx`.
Writes episodes/<id>/clips/shotNN.jpg + shotNN.mp4 (Mac-local, gitignored) and clips/shoot.json (prompts, cost).
Cost (fal, Nov 2026): $0.08 per frame + $0.14 per second (min 3 s per shot).
"""
import argparse, concurrent.futures as cf, json, math, os, sys, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "engine"))
from fal import run, upload, download  # noqa: E402

CAST_DIR = os.path.join(ROOT, "series", "system-design", "cast")
LOOK = {   # fixed wardrobe and looks, matching the headshots
    "man": "林小满, a young woman about 27 with dark hair in a high ponytail and soft bangs, plain grey hoodie over a white tee",
    "kai": "铁柱, a stunningly beautiful young woman about 24 with long glossy dark wavy hair and rosy red lips, fitted white blazer over a black top, delicate gold necklace",
    "wang": "王总, a man in his 50s with a receding hairline, brown suede jacket over an open-collar shirt",
}
EXTRA = {"oncall": "a young male on-call engineer in a black t-shirt with a headset"}
FRAME_MODEL = "fal-ai/flux-pro/kontext/max/multi"
VIDEO_MODEL = "fal-ai/kling-video/v3/pro/image-to-video"
STYLE = ("Cinematic still from a modern Chinese urban short drama, photo-realistic, 35mm film look, motivated practical "
         "lighting, vertical 9:16 frame. No text, no subtitles, no logos, no readable screens or numbers.")


def main_cast(shot):
    return [c for c in shot.get("cast", []) if c in LOOK]


def frame_prompt(shot, loc):
    cast = main_cast(shot)
    who = ("Using the people in the reference images: " + "; ".join(f"image {i + 1} is {LOOK[c]}" for i, c in enumerate(cast)) + ". ") if cast else ""
    body = shot["gen"]["prompt_en"].format(**LOOK, **EXTRA)
    keep = " Keep each person's face, hair and clothing exactly as in their reference image." if cast else ""
    return f"{who}Location: {loc}. {body}{keep} {STYLE}"


SAY = [("99%", "百分之九十九"), ("97%", "百分之九十七"), ("3%", "百分之三"), ("QPS", "Q P S")]


def spoken(d):
    """What the character actually says (subtitles keep the digits): `say_zh` if given, else digits/symbols spelled out."""
    t = d.get("say_zh") or d["zh"]
    for a, b in SAY:
        t = t.replace(a, b)
    return t


def video_prompt(shot):
    cast = main_cast(shot)
    ref = {c: f"@Element{i + 1}" for i, c in enumerate(cast)}
    body = shot["gen"]["prompt_en"].format(**{c: ref.get(c, LOOK[c]) for c in LOOK}, **EXTRA)
    lines = []
    for d in shot.get("dialogue") or []:
        speaker = ref.get(d["who"]) or EXTRA.get(d["who"], d["who"])
        lines.append(f'{speaker} says in Mandarin Chinese, lips in sync: "{spoken(d)}"')
    perf = "; ".join(f"{ref.get(c, c)}: {p}" for c, p in (shot.get("performance") or {}).items() if c in ref)
    parts = [body]
    if perf:
        parts.append(f"Performance: {perf}.")
    if lines:
        parts.append(" Then ".join(lines) + ".")
    else:
        parts.append("No one speaks.")
    if shot.get("sfx"):
        parts.append(f"Sound: {shot['sfx']}. No background music.")
    return " ".join(parts)


def shoot_one(ep, shot, locs, refs, voices, force, log):
    n = shot["id"]; stem = os.path.join(ep, "clips", f"shot{n:02d}")
    if os.path.exists(stem + ".mp4") and not force:
        return {"id": n, "skipped": True}
    secs = max(3, min(15, math.ceil(shot["seconds"])))
    fp, vp = frame_prompt(shot, locs.get(shot["location"], shot["location"])), video_prompt(shot)
    cast = main_cast(shot)
    t0 = time.time()
    if cast:
        fr = run(FRAME_MODEL, {"prompt": fp, "image_urls": [refs[c] for c in cast], "aspect_ratio": "9:16",
                               "output_format": "jpeg", "safety_tolerance": "2"}, log=lambda *a: None)
    else:
        fr = run("fal-ai/flux-pro/v1.1-ultra", {"prompt": fp, "aspect_ratio": "9:16", "raw": True, "output_format": "jpeg"}, log=lambda *a: None)
    frame_url = fr["images"][0]["url"]; download(frame_url, stem + ".jpg")
    args = {"start_image_url": frame_url, "prompt": vp, "duration": str(secs), "generate_audio": True,
            "negative_prompt": "blur, distort, low quality, text, subtitles, watermark, extra fingers, deformed face, music"}
    if cast:
        args["elements"] = [{"frontal_image_url": refs[c], "reference_image_urls": [refs[c]],
                             **({"voice_id": voices[c]} if c in voices else {})} for c in cast]
    vid = run(VIDEO_MODEL, args, log=lambda *a: None)
    download(vid["video"]["url"], stem + ".mp4")
    log(f"shot {n}: {secs}s in {time.time() - t0:.0f}s")
    return {"id": n, "seconds": secs, "frame_prompt": fp, "video_prompt": vp, "cost": round(0.08 + 0.14 * secs, 2)}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("episode"); ap.add_argument("--only"); ap.add_argument("--force", action="store_true")
    ap.add_argument("--dry", action="store_true"); ap.add_argument("--jobs", type=int, default=6)
    a = ap.parse_args()
    ep = os.path.abspath(a.episode)
    sb = json.load(open(os.path.join(ep, "storyboard.json")))
    locs = sb.get("locations", {})
    shots = [s for s in sb["shots"] if s["gen"]["mode"] == "live"]
    if a.only:
        pick = {int(x) for x in a.only.split(",")}; shots = [s for s in shots if s["id"] in pick]
    cost = sum(0.08 + 0.14 * max(3, math.ceil(s["seconds"])) for s in shots)
    print(f"{len(shots)} live shots, ≈ ${cost:.2f}")
    if a.dry:
        for s in shots:
            print(f"\n--- shot {s['id']}\nFRAME: {frame_prompt(s, locs.get(s['location'], ''))}\nVIDEO: {video_prompt(s)}")
        return
    os.makedirs(os.path.join(ep, "clips"), exist_ok=True)
    voices = {k: v["kling_voice_id"] for k, v in json.load(open(os.path.join(CAST_DIR, "voices.json"))).items()}
    cache_p = os.path.join(ROOT, "build", "cast-uploads.json")
    refs = json.load(open(cache_p)) if os.path.exists(cache_p) else {}
    for c in LOOK:
        if c not in refs:
            refs[c] = upload(os.path.join(CAST_DIR, f"{c}.jpg"))
    json.dump(refs, open(cache_p, "w"))
    results = []
    with cf.ThreadPoolExecutor(a.jobs) as ex:
        futs = {ex.submit(shoot_one, ep, s, locs, refs, voices, a.force, print): s["id"] for s in shots}
        for f in cf.as_completed(futs):
            try:
                results.append(f.result())
            except Exception as e:
                print(f"shot {futs[f]}: FAILED {e!r}"[:300]); results.append({"id": futs[f], "error": repr(e)[:300]})
    log_p = os.path.join(ep, "clips", "shoot.json")
    old = json.load(open(log_p)) if os.path.exists(log_p) else []
    json.dump(old + sorted(results, key=lambda r: r["id"]), open(log_p, "w"), ensure_ascii=False, indent=1)
    spent = sum(r.get("cost", 0) for r in results)
    print(f"done: {sum(1 for r in results if 'cost' in r)} shot, {sum(1 for r in results if 'error' in r)} failed, ≈ ${spent:.2f}")


if __name__ == "__main__":
    main()
