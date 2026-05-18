#!/bin/bash
set -euo pipefail

DEST="../codespaces-react/apps/feature-leaderboard/"

echo "=== 5 Most Recent Commits ==="
git log --oneline -5
echo "============================="

mkdir -p "$DEST"

rsync -av --delete \
  --exclude='.DS_Store' \
  --exclude='.env' \
  --exclude='.env.*' \
  --exclude='dist' \
  --exclude='node_modules' \
  --exclude='coverage' \
  --exclude='*.test.ts' \
  --exclude='*.spec.ts' \
  --exclude='*.log' \
  app/ "$DEST"
