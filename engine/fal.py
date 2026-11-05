"""Minimal fal.ai client (queue API) for the 系统设计 drama's live-action shots.

  from fal import run, download
  out = run("fal-ai/flux-pro/v1.1-ultra", {"prompt": "...", "aspect_ratio": "9:16"})
  download(out["images"][0]["url"], "cast/man-1.jpg")

The key comes from $FAL_KEY, or from the `export FAL_KEY=...` line in ~/.zshrc (scheduled runs don't load the shell
profile). Never print or commit it.
"""
import json, os, re, time, urllib.request

QUEUE = "https://queue.fal.run"


def key():
    k = os.environ.get("FAL_KEY")
    if not k:
        rc = os.path.expanduser("~/.zshrc")
        if os.path.exists(rc):
            m = re.search(r"^\s*export\s+FAL_KEY=['\"]?([^'\"\s]+)", open(rc).read(), re.M)
            k = m and m.group(1)
    if not k:
        raise SystemExit("FAL_KEY not set (export it in ~/.zshrc)")
    return k


def _req(url, data=None, method=None):
    r = urllib.request.Request(url, data=json.dumps(data).encode() if data is not None else None, method=method,
                               headers={"Authorization": f"Key {key()}", "Content-Type": "application/json"})
    with urllib.request.urlopen(r, timeout=120) as resp:
        return json.loads(resp.read() or b"{}")


def run(model, args, timeout=900, poll=5, log=print):
    """Submit to the queue, wait, return the result JSON."""
    sub = _req(f"{QUEUE}/{model}", args, "POST")
    status_url, result_url = sub["status_url"], sub["response_url"]
    t0 = time.time()
    while True:
        st = _req(status_url)
        if st.get("status") == "COMPLETED":
            break
        if time.time() - t0 > timeout:
            raise TimeoutError(f"{model}: still {st.get('status')} after {timeout}s ({sub.get('request_id')})")
        time.sleep(poll)
    log(f"{model}: done in {time.time() - t0:.0f}s")
    return _req(result_url)


def upload(path):
    """Upload a local file to fal storage and return its URL (for start / reference images)."""
    ctype = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".mp4": "video/mp4"}[os.path.splitext(path)[1].lower()]
    init = _req("https://rest.alpha.fal.ai/storage/upload/initiate",
                {"file_name": os.path.basename(path), "content_type": ctype}, "POST")
    put = urllib.request.Request(init["upload_url"], data=open(path, "rb").read(), method="PUT",
                                 headers={"Content-Type": ctype})
    urllib.request.urlopen(put, timeout=120).read()
    return init["file_url"]


def download(url, path):
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    with urllib.request.urlopen(url, timeout=300) as r, open(path, "wb") as f:
        f.write(r.read())
    return path
