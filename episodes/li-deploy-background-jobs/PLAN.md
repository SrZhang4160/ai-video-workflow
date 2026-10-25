# LinkedIn deep dive: approved plan (2026-10-24/25)

Status: plan approved by the user ("looks good, go ahead"). `episode.js` in this folder is an OLD dark-style draft:
rebuild it in the **whiteboard / sketchy style** (`styles/whiteboard/`, same look as the continual-learning video).
Post time: ask the user (Monday 10:30 ET, taking that day's LinkedIn slot, or Tuesday 10:30).

Video title: **The deploy bug CI won't catch: background jobs that run on the wrong code, or run twice**
One-sentence problem: *a background job outlives the code that created it, so during a deploy it can be run by the
wrong version of your code, or run more than once* (version skew + at-least-once delivery).
Pacing: English, slow (engine PACE en), ~100 s, ~60% on the problem. Visuals appear exactly when the voice says them.
Source note per fix (small "from AWS / GitLab / Sidekiq" tag). Never mention the user's employer or its internal design
(the source note the user shared was an internal Celery design doc; only the general problem and public fixes go in).

| # | Title (black / **red underlined**) | Drawing | Voice |
|---|---|---|---|
| 1 | A common deploy bug / **CI won't catch** | ✓ "CI passed" stamp → deploy arrow → a queue with "charge $20 ×2" | Here's one of the most common bugs in continuous deployment. Your tests pass. Your deploy succeeds. And your background jobs still break. |
| 2 | A job / **outlives the code that made it** | App drops a job in the queue, clock ticks, worker v1 / worker v2 | The reason: a background job outlives the code that created it. During a deploy, it can run on the wrong version of your code, or run more than once. |
| 3 | Problem 1: / **old and new code, side by side** | 3 workers (1 new v2, 2 old v1); a v2 job with a new "currency" field lands on an old worker → red ✗ | During a rolling deploy, old and new workers run together. New code adds a field. An old worker picks up the job and can't read it, or worse, does the wrong thing. Rolling back has the same problem in reverse. |
| 4 | Problem 2: / **the work happened, the "done" didn't** | Worker charges card ✓ → 💥 crash before telling the queue "done" | A worker charges the card. Then it crashes before telling the queue it's done. |
| 5 | So the queue / **runs it again** | Queue hands the job to another worker → second charge → receipt "$20 × 2" | The queue thinks the job never finished, so it runs it again. Your customer pays twice. Queues promise "at least once", not "exactly once". |
| 6 | Graceful shutdown / **isn't enough** | Two boxes: helps ✓ planned restarts; doesn't help ✗ crashes, version mismatches | Graceful shutdown lets running jobs finish before a planned restart. But it can't stop a crash, and it can't fix mismatched versions. |
| 7 | Fix 1: / **teach the workers first** | Step 1 workers read v1 + v2 ✓ → Step 2 app starts sending v2 · from AWS | Deploy support before behavior. First ship workers that understand both versions. Only then let the app send the new one. |
| 8 | Fix 2: / **version every job** | Job tag "v2"; incompatible versions split into queue-v1 / queue-v2 · from GitLab | Put a version on every job. Keep handlers for old versions, or send incompatible ones to their own queue. |
| 9 | Fix 3: / **give the work an ID** | "charge-8f2" → "done" list → retry finds it → skip ✓ · from AWS | Give each operation a stable ID. Before doing the work, check it. If it's already done, skip it. |
| 10 | Fix 4: / **expect it to run twice** | Old workers kept until the queue's v1 jobs reach zero · from Sidekiq | Assume any job can run twice. And keep old workers around until the old jobs are gone. |
| 11 | You need / **both** | Two pillars: Versioning / Idempotency | Versioning stops the wrong code from running. Idempotency stops the same work from happening twice. You need both. How does your team deploy workers? |

LinkedIn post opener: "One of the most common continuous-deployment bugs, and your CI won't catch it." The rest of the
post body is in `meta.json` (update its title to the one above).

Public sources: AWS Builders' Library (two-phase deployments; making retries safe with idempotent APIs), GitLab
development docs (Sidekiq compatibility across updates; job versioning), Sidekiq wiki "Best Practices" (idempotent jobs),
Temporal docs (worker versioning; Activities should be idempotent).
