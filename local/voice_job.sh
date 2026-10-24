#!/bin/bash
# Run by launchd every 20 minutes (see install_voice_job.sh). Pulls, voices new lines in your cloned voice, pushes.
# Does nothing (and loads no model) when there is no new script. Log: ~/Library/Logs/lesson-voice.log
set -uo pipefail
REPO="$(cd "$(dirname "$0")/.." && pwd)"
CV="${COSYVOICE_DIR:-$HOME/cosyvoice3}"
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
cd "$REPO" || exit 1
echo "--- $(date '+%F %T')"
git pull --quiet --rebase || { echo "git pull failed"; exit 1; }
out="$("$CV/.venv/bin/python" local/voice_daemon.py "$REPO" 2>&1 | grep -v -E 'Warning|warn\(|Sliding Window' )"
echo "$out" | tail -40
if [ -n "$(git status --porcelain episodes)" ]; then
  git add episodes/*/voice
  git commit -qm "voice: $(echo "$out" | grep -c ' in ') clips in your cloned voice" && git push -q && echo "pushed"
fi
