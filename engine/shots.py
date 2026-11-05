"""Generate an episode's live-action shots (系统设计 drama) with fal.ai.

  python3 engine/shots.py episodes/2026-11-05-sd [--only 0,3] [--force] [--dry]

Reads meta.json → shots: [{scene, cast: ["man", "kai"], setting, prompt_en, seconds}] (prompt_en names people as
{man} {kai} {wang}) where `scene` is the 0-based
scene index in episode.js and that scene has `clip: 'clips/sNN.mp4'` (NN = scene index + 1). For each shot:
  1. first frame: FLUX Kontext (max/multi) puts the cast's fixed headshots (series/system-design/cast/<id>.jpg) into
     the setting, vertical 9:16, photo-real;
  2. motion: Kling 3.0 Pro image-to-video from that frame, the same headshots passed as elements (@Element1…) so the
     faces stay the same; no generated audio (the narrator is the user's cloned voice).
Writes episodes/<id>/clips/sNN.jpg (first frame) and sNN.mp4. Clips are Mac-local (gitignored) like build/.
Skips shots whose mp4 exists unless --force. Cost (fal, Nov 2026): $0.08 per frame + $0.14 per video second.
"""
import argparse, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "engine"))
from fal import run, upload, download  # noqa: E402

CAST_DIR = os.path.join(ROOT, "series", "system-design", "cast")
LOOK = {   # fixed wardrobe, so every shot matches the headshots
    "man": "the young woman (林小满) with a high ponytail in a grey hoodie",
    "kai": "the strikingly beautiful woman (铁柱) with long dark wavy hair and red lipstick, in a white tailored blazer over a black top with a thin gold necklace",
    "wang": "the older man (王总) in a brown suede jacket",
}
FRAME_MODEL = "fal-ai/flux-pro/kontext/max/multi"
VIDEO_MODEL = "fal-ai/kling-video/v3/pro/image-to-video"
STYLE = ("Cinematic still from a modern Chinese urban short drama, photo-realistic, 35mm film look, moody practical "
         "lighting, vertical 9:16 composition with the faces in the upper-middle third, no text, no logos, no readable "
         "screens or numbers.")


def cast_url(cid, cache):
    if cid not in cache:
        cache[cid] = upload(os.path.join(CAST_DIR, f"{cid}.jpg"))
    return cache[cid]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("episode"); ap.add_argument("--only"); ap.add_argument("--force", action="store_true")
    ap.add_argument("--dry", action="store_true", help="print the requests and the cost, call nothing")
    a = ap.parse_args()
    ep = os.path.abspath(a.episode)
    shots = json.load(open(os.path.join(ep, "meta.json"))).get("shots", [])
    if len(shots) > 6:
        raise SystemExit(f"{len(shots)} shots: at most 6 per episode (cost cap); trim meta.json → shots")
    pick = {int(x) for x in a.only.split(",")} if a.only else None
    os.makedirs(os.path.join(ep, "clips"), exist_ok=True)
    cache_p = os.path.join(ROOT, "build", "cast-uploads.json")
    cache = json.load(open(cache_p)) if os.path.exists(cache_p) else {}
    cost = 0.0
    for sh in shots:
        si = sh["scene"]
        if pick is not None and si not in pick:
            continue
        stem = os.path.join(ep, "clips", f"s{si + 1:02d}")
        if os.path.exists(stem + ".mp4") and not a.force:
            print(f"scene {si}: clip exists, skipped"); continue
        cast = sh.get("cast", [])
        secs = str(max(3, min(15, int(round(sh.get("seconds", 5))))))
        who = "; ".join(f"@Element{i + 1} is {LOOK.get(c, c)}" for i, c in enumerate(cast))
        as_look = sh["prompt_en"].format(**{c: LOOK.get(c, c) for c in LOOK})
        as_elem = sh["prompt_en"].format(**{c: (f"@Element{cast.index(c) + 1}" if c in cast else LOOK.get(c, c)) for c in LOOK})
        frame_prompt = (f"{'Using the people in the reference images: ' + '; '.join(f'image {i + 1} is {LOOK.get(c, c)}' for i, c in enumerate(cast)) + '. ' if cast else ''}"
                        f"Setting: {sh['setting']}. {as_look} Keep each person's face, hair and clothing exactly as in "
                        f"their reference image. {STYLE}")
        video_prompt = f"{who + '. ' if who else ''}{as_elem} Natural subtle motion, breathing, blinking; smooth slow camera move."
        cost += 0.08 + 0.14 * int(secs)
        if a.dry:
            print(json.dumps({"scene": si, "frame_prompt": frame_prompt, "video_prompt": video_prompt, "seconds": secs}, ensure_ascii=False, indent=1))
            continue
        refs = [cast_url(c, cache) for c in cast]
        json.dump(cache, open(cache_p, "w"))
        if refs:
            fr = run(FRAME_MODEL, {"prompt": frame_prompt, "image_urls": refs, "aspect_ratio": "9:16", "output_format": "jpeg",
                                   "safety_tolerance": "2"})
        else:
            fr = run("fal-ai/flux-pro/v1.1-ultra", {"prompt": frame_prompt, "aspect_ratio": "9:16", "raw": True, "output_format": "jpeg"})
        frame_url = fr["images"][0]["url"]; download(frame_url, stem + ".jpg")
        args = {"start_image_url": frame_url, "prompt": video_prompt, "duration": secs, "generate_audio": False,
                "negative_prompt": "blur, distort, low quality, text, subtitles, watermark, extra fingers, deformed face"}
        if refs:
            args["elements"] = [{"frontal_image_url": u, "reference_image_urls": [u]} for u in refs]
        vid = run(VIDEO_MODEL, args)
        download(vid["video"]["url"], stem + ".mp4")
        print(f"scene {si}: {stem}.mp4 ({secs}s)")
    print(f"cost ≈ ${cost:.2f}")


if __name__ == "__main__":
    main()
