#!/usr/bin/env bash
# Post-deploy live smoke for the raj monorepo GitHub Pages deployment.
# Run AFTER the first-enable manual step (Settings -> Pages -> Source = GitHub Actions)
# and a green Actions run. Usage: scripts/smoke-deploy.sh [BASE_URL]
set -euo pipefail

BASE="${1:-https://wolfwdavid.github.io/raj}"
fail=0

echo "== Smoke test: $BASE =="
for p in "" vfamigos/ lipool/ lidentist/ cannaworldnews/; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "$BASE/$p")
  printf '%s  %s\n' "$code" "$BASE/$p"
  [ "$code" = "200" ] || { echo "::error::expected 200 for $BASE/$p"; fail=1; }
done

# Any unknown URL must serve the styled root 404.
badurl="$BASE/nonexistent-$(date +%s)/"
code=$(curl -s -o /dev/null -w '%{http_code}' "$badurl")
printf '%s  %s (expect 404)\n' "$code" "$badurl"
[ "$code" = "404" ] || { echo "::error::expected 404 for $badurl"; fail=1; }

if [ "$fail" -eq 0 ]; then echo "ALL SMOKE CHECKS PASSED"; else echo "SMOKE FAILURES ABOVE"; fi
exit $fail
