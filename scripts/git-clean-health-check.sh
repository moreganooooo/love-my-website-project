#!/bin/bash

# Git Corrupt Ref Auto-Clean Script (npm-friendly)

set -e

if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
  echo "❌ Not inside a Git repository."
  exit 1
fi

CORRUPT_REFS=$(find .git/refs/remotes/origin -type f -name '*HEAD*' ! -name 'HEAD')
if [ -n "$CORRUPT_REFS" ]; then
  echo "🧹 Removing corrupt origin HEAD refs..."
  echo "$CORRUPT_REFS" | xargs rm -f
fi

if git remote show origin | grep -q "HEAD branch: (unknown)"; then
  echo "🔁 Resetting origin HEAD..."
  git remote set-head origin -d || true
  git remote set-head origin -a || git remote set-head origin main || true
fi

echo "🧼 Pruning origin..."
git remote prune origin

echo "📦 Fetching..."
git fetch origin --prune

CURRENT_BRANCH=$(git branch --show-current)
if ! git rev-parse --abbrev-ref --symbolic-full-name @{u} > /dev/null 2>&1; then
  echo "🔗 Setting upstream to origin/$CURRENT_BRANCH..."
  git branch --set-upstream-to=origin/$CURRENT_BRANCH
fi

echo "✅ Git repo is clean & synced!"
git remote show origin
