#!/usr/bin/env bash
# Build the self-contained index.html from research.json + template.html.
set -euo pipefail
cd "$(dirname "$0")"
node merge.mjs
node build.mjs
echo "open: file://$(pwd)/index.html"
