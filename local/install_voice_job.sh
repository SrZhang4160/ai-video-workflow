#!/bin/bash
# One-time Mac setup for the nightly voice job. Run from Terminal:
#   bash ~/lesson-videos/local/install_voice_job.sh
# 1) moves CosyVoice to ~/cosyvoice3 (macOS blocks background jobs from reading Desktop; a link stays in Desktop/AI)
# 2) installs a launchd job that runs local/voice_job.sh every 20 minutes while the Mac is awake
set -euo pipefail
REPO="$(cd "$(dirname "$0")/.." && pwd)"
OLD="$HOME/Desktop/AI/cosyvoice3"; NEW="$HOME/cosyvoice3"
if [ -d "$OLD" ] && [ ! -L "$OLD" ] && [ ! -e "$NEW" ]; then
  mv "$OLD" "$NEW" && ln -s "$NEW" "$OLD" && echo "moved CosyVoice to $NEW (link left at $OLD)"
fi
[ -x "$NEW/.venv/bin/python" ] || { echo "CosyVoice not found at $NEW; run its setup.sh first"; exit 1; }
case "$REPO" in "$HOME/Desktop"*|"$HOME/Documents"*|"$HOME/Downloads"*)
  echo "Move this repo out of Desktop/Documents/Downloads first (e.g. ~/lesson-videos): macOS blocks background jobs there."; exit 1;; esac
git -C "$REPO" push --dry-run -q 2>/dev/null || echo "warning: git push to GitHub is not set up on this Mac yet (gh auth login)"

LABEL=com.lessonvideos.voice
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
mkdir -p "$HOME/Library/LaunchAgents" "$HOME/Library/Logs"
cat > "$PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>Label</key><string>$LABEL</string>
  <key>ProgramArguments</key><array><string>/bin/bash</string><string>$REPO/local/voice_job.sh</string></array>
  <key>EnvironmentVariables</key><dict><key>COSYVOICE_DIR</key><string>$NEW</string></dict>
  <key>StartInterval</key><integer>1200</integer>
  <key>RunAtLoad</key><true/>
  <key>LowPriorityIO</key><true/>
  <key>Nice</key><integer>10</integer>
  <key>StandardOutPath</key><string>$HOME/Library/Logs/lesson-voice.log</string>
  <key>StandardErrorPath</key><string>$HOME/Library/Logs/lesson-voice.log</string>
</dict></plist>
EOF
launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
launchctl bootstrap "gui/$(id -u)" "$PLIST"
echo "voice job installed: runs every 20 min while the Mac is awake. Log: ~/Library/Logs/lesson-voice.log"
echo "Tip: keep the Mac plugged in with sleep prevented at night, or run once:  sudo pmset repeat wakeorpoweron MTWRFSU 01:50:00"
