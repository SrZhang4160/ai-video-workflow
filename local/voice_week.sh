#!/usr/bin/env bash
# Mac only. Voice every episode that has no voice yet, in YOUR cloned voice (CosyVoice3), then push.
#   cd ~/Desktop/video-workflow && bash local/voice_week.sh          # Chinese only (default)
#   bash local/voice_week.sh zh en                                     # Chinese + English
# Needs ~/Desktop/AI/cosyvoice3 set up (bash setup.sh there). Approved episodes rebuild with the new voice the next night.
set -euo pipefail
cd "$(dirname "$0")/.."
CV="${COSYVOICE_DIR:-$HOME/Desktop/AI/cosyvoice3}"
LANGS=("${@:-zh}")
git pull --quiet --rebase
done_any=0
for ep in episodes/*/; do
  ep="${ep%/}"
  for lang in "${LANGS[@]}"; do
    txt="$ep/voice/$lang.txt"; out="$ep/voice/$lang"
    [ -f "$txt" ] || continue
    [ -f "$out/s01.wav" ] && continue           # already voiced (or recorded by you)
    echo "→ $ep ($lang)"
    tmp="$(mktemp -d)"
    "$CV/say.sh" --script "$PWD/$txt" -o "$tmp"
    mkdir -p "$out"
    for f in "$tmp"/line*.wav; do n="${f##*/line}"; mv "$f" "$out/s$n"; done
    rm -rf "$tmp"; done_any=1
  done
done
if [ "$done_any" = 1 ]; then
  git add episodes/*/voice/*/s*.wav
  git commit -qm "voice: CosyVoice clone for new episodes" && git push -q
  echo "Pushed. Tonight's build will use your voice."
else
  echo "Nothing to voice."
fi
