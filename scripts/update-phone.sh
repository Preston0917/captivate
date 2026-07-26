#!/usr/bin/env bash
#
# update-phone.sh — build the Captivate iOS app and install it onto Preston's
# iPhone over WiFi or cable (CoreDevice), whenever the phone is reachable from
# this Mac. Adapted from promoter-app/scripts/update-phone.sh (verified pattern).
#
# Usage:
#   scripts/update-phone.sh                 # sync web assets, build, wait up to 10 min, install
#   scripts/update-phone.sh --no-wait       # install only if phone reachable now
#   scripts/update-phone.sh --timeout 120   # wait up to 120s for the phone (0 = forever)
#   scripts/update-phone.sh --skip-build    # install the last-built product
#   scripts/update-phone.sh --dry-run       # everything except the actual install
#
# Signing: automatic, team 5BX3BQFLM4 (set in the pbxproj). Free personal team
# → installs expire after ~7 days; just re-run this script.

set -u -o pipefail

readonly PROJECT="ios/App/App.xcodeproj"
readonly SCHEME="App"
# devicectl identifier (from `xcrun devicectl list devices`)
readonly DEVICE_ID="F5FC53E8-4112-57CE-8745-4F03DC911BFC"
readonly DEVICE_NAME="iPhone"

WAIT=1
TIMEOUT=600
SKIP_BUILD=0
DRY_RUN=0
POLL_INTERVAL=5
INSTALL_RETRIES=3

if [ -t 1 ]; then
  C_RED=$'\033[31m'; C_GRN=$'\033[32m'; C_YEL=$'\033[33m'; C_DIM=$'\033[2m'; C_RST=$'\033[0m'
else
  C_RED=''; C_GRN=''; C_YEL=''; C_DIM=''; C_RST=''
fi
info()  { printf '%s\n' "$*"; }
note()  { printf '%s%s%s\n' "$C_DIM" "$*" "$C_RST"; }
warn()  { printf '%swarn:%s %s\n' "$C_YEL" "$C_RST" "$*" >&2; }
err()   { printf '%serror:%s %s\n' "$C_RED" "$C_RST" "$*" >&2; }
ok()    { printf '%s%s%s\n' "$C_GRN" "$*" "$C_RST"; }
die()   { err "$*"; exit 1; }

while [ $# -gt 0 ]; do
  case "$1" in
    --no-wait)    WAIT=0 ;;
    --timeout)    shift; [ $# -gt 0 ] || die "--timeout needs a value (seconds; 0 = forever)"
                  case "$1" in ''|*[!0-9]*) die "--timeout must be a non-negative integer";; esac
                  TIMEOUT="$1" ;;
    --timeout=*)  TIMEOUT="${1#*=}"
                  case "$TIMEOUT" in ''|*[!0-9]*) die "--timeout must be a non-negative integer";; esac ;;
    --skip-build) SKIP_BUILD=1 ;;
    --dry-run)    DRY_RUN=1 ;;
    -h|--help)    sed -n '2,16p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *)            die "unknown flag: $1" ;;
  esac
  shift
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
[ -d "$REPO_ROOT/$PROJECT" ] || die "cannot find $PROJECT under $REPO_ROOT"
cd "$REPO_ROOT" || die "cannot cd to $REPO_ROOT"
command -v xcrun >/dev/null 2>&1 || die "xcrun not found — install Xcode command line tools."

# ---------- build (generic iOS destination — no phone needed) ----------
build_app() {
  info "Refreshing web assets (build-www + cap sync)…"
  bash scripts/build-www.sh >/dev/null || die "build-www.sh failed"
  npx cap sync ios >/dev/null || die "cap sync ios failed"

  local log; log="$(mktemp -t captivate-build.XXXXXX)"
  info "Building $SCHEME (generic/platform=iOS)…"
  set +e
  xcodebuild \
    -project "$PROJECT" \
    -scheme "$SCHEME" \
    -destination 'generic/platform=iOS' \
    -allowProvisioningUpdates \
    build >"$log" 2>&1
  local rc=$?
  set -e 2>/dev/null || true
  if [ "$rc" -ne 0 ]; then
    err "build FAILED (xcodebuild exit $rc). Real errors:"
    grep -nE '(error:|error \(|Provisioning|Signing|The following build commands failed)' "$log" \
      | sed 's/^/       /' >&2 || true
    note "full build log: $log"
    return 1
  fi
  note "build ok (log: $log)"
}

# ---------- resolve built .app (never hardcode DerivedData hash) ----------
resolve_app_path() {
  local settings dir name
  settings="$(xcodebuild -project "$PROJECT" -scheme "$SCHEME" \
                -destination 'generic/platform=iOS' -showBuildSettings 2>/dev/null)" \
    || { err "could not read build settings"; return 1; }
  dir="$(printf '%s\n' "$settings"  | sed -n 's/^ *BUILT_PRODUCTS_DIR = //p' | head -1)"
  name="$(printf '%s\n' "$settings" | sed -n 's/^ *FULL_PRODUCT_NAME = //p'  | head -1)"
  [ -n "$dir" ] && [ -n "$name" ] || { err "could not resolve app path"; return 1; }
  APP_PATH="$dir/$name"
}

# ---------- reachability (exact-match 'available'; see promoter notes) ----------
device_available() {
  local line
  line="$(xcrun devicectl list devices 2>/dev/null | grep -F "$DEVICE_ID" | head -1)"
  [ -n "$line" ] || return 1
  [[ "$line" =~ (^|[[:space:]])available([[:space:]]|\(|$) ]]
}

wait_for_device() {
  if device_available; then return 0; fi
  [ "$WAIT" -eq 0 ] && return 1
  local waited=0
  if [ "$TIMEOUT" -eq 0 ]; then
    info "Waiting for '$DEVICE_NAME' to become reachable (no timeout — Ctrl-C to stop)…"
  else
    info "Waiting up to ${TIMEOUT}s for '$DEVICE_NAME' to become reachable…"
  fi
  while true; do
    sleep "$POLL_INTERVAL"
    waited=$((waited + POLL_INTERVAL))
    if device_available; then info "  reachable after ${waited}s."; return 0; fi
    if [ "$TIMEOUT" -ne 0 ] && [ "$waited" -ge "$TIMEOUT" ]; then return 1; fi
  done
}

# ---------- install with retries (WiFi installs fail transiently) ----------
install_app() {
  local attempt=1 backoff=5 log rc
  while [ "$attempt" -le "$INSTALL_RETRIES" ]; do
    info "Installing (attempt ${attempt}/${INSTALL_RETRIES})…"
    log="$(mktemp -t captivate-install.XXXXXX)"
    set +e
    xcrun devicectl device install app --device "$DEVICE_ID" "$APP_PATH" >"$log" 2>&1
    rc=$?
    set -e 2>/dev/null || true
    if [ "$rc" -eq 0 ]; then rm -f "$log"; return 0; fi
    warn "install attempt $attempt failed (exit $rc)."
    if grep -qiE 'developer mode' "$log"; then
      err "the phone reports Developer Mode disabled — enable it in Settings ▸ Privacy & Security ▸ Developer Mode, then re-run."
      note "install log: $log"
      return 1
    fi
    sed -n '$p' "$log" >&2
    sleep "$backoff"; backoff=$((backoff * 2)); attempt=$((attempt + 1))
  done
  err "install failed after $INSTALL_RETRIES attempts — is the phone on this Mac's WiFi (or cabled + trusted)?"
  return 1
}

# ---------- main ----------
if [ "$SKIP_BUILD" -eq 0 ]; then build_app || exit 1; fi
resolve_app_path || exit 1
[ -d "$APP_PATH" ] || die "built app not found at $APP_PATH (run without --skip-build?)"
info "App: $APP_PATH"

if ! wait_for_device; then
  die "'$DEVICE_NAME' never became reachable. Put the phone on this Mac's WiFi or plug it in, then re-run."
fi

if [ "$DRY_RUN" -eq 1 ]; then ok "dry-run: would install onto '$DEVICE_NAME' now."; exit 0; fi
if install_app; then
  ok "Captivate installed on '$DEVICE_NAME'. First launch may need Settings ▸ General ▸ VPN & Device Management trust."
else
  exit 1
fi
