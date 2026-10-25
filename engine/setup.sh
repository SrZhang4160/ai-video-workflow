#!/usr/bin/env bash
# Prepare a fresh cloud workspace to render episodes. Safe to re-run.
set -euo pipefail
cd "$(dirname "$0")"
[ -d node_modules/@fontsource/noto-sans-sc ] || npm install --silent
python3 -c "import sherpa_onnx, soundfile" 2>/dev/null || (pip3 install -q sherpa-onnx soundfile numpy 2>/dev/null || pip install -q --break-system-packages sherpa-onnx soundfile numpy)
python3 -c "import playwright" 2>/dev/null || (pip3 install -q playwright 2>/dev/null || pip install -q --break-system-packages playwright)
if ! command -v ffmpeg >/dev/null; then
  if command -v brew >/dev/null; then brew install ffmpeg; else apt-get update -qq && apt-get install -y -qq ffmpeg; fi
fi
[ "$(uname)" = Darwin ] && python3 -m playwright install chromium >/dev/null 2>&1 || true
TTSDIR="${TTSDIR:-$HOME/.cache/lesson-tts}"; mkdir -p "$TTSDIR"
for m in kokoro-multi-lang-v1_0 kokoro-multi-lang-v1_1; do
  if [ ! -f "$TTSDIR/$m/model.onnx" ]; then
    echo "downloading $m (AI fallback voice)…"
    curl -sSL "https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/$m.tar.bz2" | tar -xj -C "$TTSDIR"
  fi
done
echo "engine ready (TTSDIR=$TTSDIR)"
