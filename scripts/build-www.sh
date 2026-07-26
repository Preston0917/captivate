#!/usr/bin/env bash
# ============================================================
# build-www.sh — assemble the Capacitor web directory.
#
# There is no bundler here: the app is plain static files. This
# just makes a FRESH www/ each run so a deleted source file can
# never linger inside the app bundle.
# ============================================================
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/www"

rm -rf "$OUT"
mkdir -p "$OUT"

# Files/dirs that make up the shipped app shell
cp "$ROOT/index.html" "$OUT/"
cp "$ROOT/manifest.webmanifest" "$OUT/"
cp "$ROOT/sw.js" "$OUT/"
cp -R "$ROOT/css" "$OUT/css"
cp -R "$ROOT/js" "$OUT/js"
cp -R "$ROOT/icons" "$OUT/icons"

echo "www/ built: $(find "$OUT" -type f | wc -l | tr -d ' ') files"
