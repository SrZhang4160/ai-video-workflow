#!/usr/bin/env python3
"""Candidate stories for AI 快讯: GitHub Trending (AI repos) + Hugging Face Daily Papers.

    python3 engine/news_sources.py <id>            # writes build/<id>/candidates.md and candidates.json
    python3 engine/news_sources.py <id> --top 12

Only the Python standard library. Set GITHUB_TOKEN to raise the GitHub API limit (60 requests/hour without it).
The run (runbooks/news-daily.md) reads candidates.md, checks the primary sources, and picks one story.
"""
import argparse, datetime as dt, html, json, os, re, sys, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = {"User-Agent": "ai-video-workflow-news/1.0", "Accept": "application/json"}
AI_WORDS = re.compile(r"\b(ai|llms?|agents?|agentic|gpt|claude|codex|cursor|copilot|gemini|llama|qwen|deepseek|mistral|"
                      r"models?|diffusion|rag|mcp|inference|transformers?|embeddings?|vision|vlm|speech|tts|asr|whisper|"
                      r"prompts?|skills?|fine-?tun\w*|lora|rlhf|reasoning|multimodal|chatbot|openai|anthropic|hugging ?face|"
                      r"neural|machine learning|ml|deep learning|vector|ollama|vllm|comfyui|stable diffusion|sora|veo|kling)\b", re.I)


def get(url, accept_json=True):
    h = dict(UA)
    if not accept_json:
        h["Accept"] = "text/html"
    if "api.github.com" in url and os.environ.get("GITHUB_TOKEN"):
        h["Authorization"] = "Bearer " + os.environ["GITHUB_TOKEN"]
    with urllib.request.urlopen(urllib.request.Request(url, headers=h), timeout=30) as r:
        body = r.read().decode("utf-8", "replace")
    return json.loads(body) if accept_json else body


def num(s):
    s = (s or "").replace(",", "").strip()
    return int(s) if s.isdigit() else 0


def github_trending(since="daily"):
    page = get(f"https://github.com/trending?since={since}", accept_json=False)
    out = []
    for row in page.split('<article class="Box-row">')[1:]:
        m = re.search(r'href="/([^"/]+/[^"/]+)/stargazers"', row)
        if not m:
            continue
        repo = m.group(1)
        desc = re.search(r'<p class="col-9[^"]*">(.*?)</p>', row, re.S)
        desc = html.unescape(re.sub(r"<[^>]+>", "", desc.group(1))).strip() if desc else ""
        lang = re.search(r'itemprop="programmingLanguage">([^<]+)<', row)
        stars = re.search(r'/stargazers"[^>]*>.*?</svg>\s*([\d,]+)', row, re.S)
        today = re.search(r"([\d,]+) stars? (today|this week|this month)", row)
        out.append({"repo": repo, "url": f"https://github.com/{repo}", "desc": desc,
                    "lang": lang.group(1).strip() if lang else "", "stars": num(stars.group(1)) if stars else 0,
                    "stars_period": num(today.group(1)) if today else 0, "since": since})
    return out


def enrich_repo(c):
    try:
        r = get(f"https://api.github.com/repos/{c['repo']}")
        c.update(created=r.get("created_at", "")[:10], pushed=r.get("pushed_at", "")[:10], stars=r.get("stargazers_count", c["stars"]),
                 license=(r.get("license") or {}).get("spdx_id", ""), homepage=r.get("homepage") or "", topics=r.get("topics", []))
    except Exception as e:   # rate limit or network: keep what the trending page gave us
        c["enrich_error"] = str(e)[:80]
    return c


def hf_papers(day):
    try:
        rows = get(f"https://huggingface.co/api/daily_papers?date={day}&limit=100")
    except Exception:
        return []
    out = []
    for r in rows:
        p = r.get("paper", {})
        out.append({"id": p.get("id"), "title": (p.get("title") or r.get("title") or "").strip(),
                    "upvotes": p.get("upvotes", 0), "comments": r.get("numComments", 0),
                    "org": (p.get("organization") or r.get("organization") or {}).get("fullname", "") if isinstance(p.get("organization") or r.get("organization"), dict) else "",
                    "ai_summary": p.get("ai_summary", ""), "keywords": p.get("ai_keywords", [])[:8],
                    "github": p.get("githubRepo", ""), "project": p.get("projectPage", ""),
                    "hf": f"https://huggingface.co/papers/{p.get('id')}", "arxiv": f"https://arxiv.org/abs/{p.get('id')}",
                    "published": (p.get("publishedAt") or "")[:10], "daily": day})
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("id", help="episode id, e.g. 2026-11-05-news (date taken from it)")
    ap.add_argument("--top", type=int, default=10)
    a = ap.parse_args()
    day = dt.date.fromisoformat(a.id[:10])
    out_dir = os.path.join(ROOT, "build", a.id); os.makedirs(out_dir, exist_ok=True)

    repos, seen = [], set()
    for since in ("daily", "weekly"):
        try:
            for c in github_trending(since):
                if c["repo"] in seen:
                    continue
                seen.add(c["repo"])
                if AI_WORDS.search(c["repo"] + " " + c["desc"]):
                    repos.append(c)
        except Exception as e:
            print(f"trending {since}: {e}", file=sys.stderr)
    repos.sort(key=lambda c: (c["since"] != "daily", -c["stars_period"]))
    repos = [enrich_repo(c) for c in repos[:a.top]]

    papers, pseen = [], set()
    for d in (day - dt.timedelta(days=1), day - dt.timedelta(days=2), day):
        for p in hf_papers(d.isoformat()):
            if p["id"] not in pseen:
                pseen.add(p["id"]); papers.append(p)
    papers.sort(key=lambda p: -p["upvotes"])
    papers = papers[:a.top]

    json.dump({"generated": dt.datetime.now().isoformat(timespec="seconds"), "repos": repos, "papers": papers},
              open(os.path.join(out_dir, "candidates.json"), "w"), ensure_ascii=False, indent=1)
    L = [f"# 候选 · {a.id}", "", "## GitHub Trending（AI 相关，today 优先）", ""]
    for i, c in enumerate(repos, 1):
        L.append(f"{i}. **{c['repo']}** · +{c['stars_period']:,} ★ {c['since']} · 共 {c['stars']:,} ★ · {c['lang']} · 创建 {c.get('created', '?')} · {c.get('license', '')}")
        L.append(f"   {c['desc']}  \n   {c['url']}" + (f" · {c['homepage']}" if c.get("homepage") else ""))
    L += ["", "## Hugging Face Daily Papers（按点赞）", ""]
    for i, p in enumerate(papers, 1):
        L.append(f"{i}. **{p['title']}** · 👍 {p['upvotes']} · 💬 {p['comments']} · {p['org']} · daily {p['daily']}")
        L.append(f"   {p['ai_summary']}  \n   {p['hf']}" + (f" · code {p['github']}" if p['github'] else "") + (f" · {p['project']}" if p['project'] else ""))
    open(os.path.join(out_dir, "candidates.md"), "w").write("\n".join(L) + "\n")
    print(f"{len(repos)} repos, {len(papers)} papers → build/{a.id}/candidates.md")


if __name__ == "__main__":
    main()
