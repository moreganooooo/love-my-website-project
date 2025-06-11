#!/bin/bash

# Self-Healing Project Sanity Check
# Ensures scripts/, husky hooks, and key configs exist

set -e

ROOT_DIR=$(pwd)
SCRIPT_DIR="$ROOT_DIR/scripts"
HUSKY_DIR="$ROOT_DIR/.husky"

function ensure_dir() {
  if [ ! -d "$1" ]; then
    echo "📁 Creating missing directory: $1"
    mkdir -p "$1"
  fi
}

function ensure_file() {
  local FILE=$1
  local CONTENT=$2
  if [ ! -f "$FILE" ]; then
    echo "📄 Creating missing file: $FILE"
    echo "$CONTENT" > "$FILE"
  fi
}

function make_executable() {
  if [ -f "$1" ]; then
    chmod +x "$1"
  fi
}

# 1. Ensure directories
ensure_dir "$SCRIPT_DIR"
ensure_dir "$HUSKY_DIR"

# 2. Ensure git-clean-health-check.sh
GIT_FIX_SCRIPT="$SCRIPT_DIR/git-clean-health-check.sh"
ensure_file "$GIT_FIX_SCRIPT" "#!/bin/bash
set -e
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then echo '❌ Not in Git repo'; exit 1; fi
CORRUPT_REFS=\$(find .git/refs/remotes/origin -type f -name '*HEAD*' ! -name 'HEAD')
if [ -n \"\$CORRUPT_REFS\" ]; then echo '🧹 Cleaning bad HEAD refs'; echo \"\$CORRUPT_REFS\" | xargs rm -f; fi
git remote set-head origin -d || true
git remote set-head origin -a || git remote set-head origin main || true
git remote prune origin
git fetch origin --prune
BRANCH=\$(git branch --show-current)
if ! git rev-parse --abbrev-ref --symbolic-full-name @{u} > /dev/null 2>&1; then git branch --set-upstream-to=origin/\$BRANCH; fi
echo '✅ Git repo synced'
"
make_executable "$GIT_FIX_SCRIPT"

# 3. Ensure husky/_/husky.sh (installed via husky)
if [ ! -f "$HUSKY_DIR/_/husky.sh" ]; then
  echo "🐶 Installing Husky"
  npx husky install
fi

# 4. Ensure pre-push hook
PRE_PUSH="$HUSKY_DIR/pre-push"
ensure_file "$PRE_PUSH" "#!/bin/sh
. \"\$(dirname \"$0\")/_/husky.sh\"
bash scripts/git-clean-health-check.sh"
make_executable "$PRE_PUSH"

# 5. Ensure pre-commit hook with lint-staged
PRE_COMMIT="$HUSKY_DIR/pre-commit"
ensure_file "$PRE_COMMIT" "#!/bin/sh
. \"\$(dirname \"$0\")/_/husky.sh\"
npx lint-staged"
make_executable "$PRE_COMMIT"

# 6. Summary
echo "\n🧠 Project sanity check complete. Everything looks good!"
ls -al $SCRIPT_DIR
ls -al $HUSKY_DIR