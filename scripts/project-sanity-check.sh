#!/bin/bash

# Ultra-Resilient Project Sanity Check
# Ensures scripts/, husky hooks, envs, configs, lockfiles, git health, and editor settings

set -e

ROOT_DIR=$(pwd)
SCRIPT_DIR="$ROOT_DIR/scripts"
HUSKY_DIR="$ROOT_DIR/.husky"
VSCODE_DIR="$ROOT_DIR/.vscode"

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
ensure_dir "$VSCODE_DIR"

# 2. Ensure git-clean-health-check.sh
GIT_FIX_SCRIPT="$SCRIPT_DIR/git-clean-health-check.sh"
ensure_file "$GIT_FIX_SCRIPT" "#!/bin/bash
set -e
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then echo '❌ Not in Git repo'; exit 1; fi
CORRUPT_REFS=\$(find .git/refs/remotes/origin -type f -name '*HEAD*' ! -name 'HEAD')
if [ -n \"$CORRUPT_REFS\" ]; then echo '🧹 Cleaning bad HEAD refs'; echo \"$CORRUPT_REFS\" | xargs rm -f; fi
git remote set-head origin -d || true
git remote set-head origin -a || git remote set-head origin main || true
git remote prune origin
git fetch origin --prune
BRANCH=\$(git branch --show-current)
if ! git rev-parse --abbrev-ref --symbolic-full-name @{u} > /dev/null 2>&1; then git branch --set-upstream-to=origin/\$BRANCH; fi
echo '✅ Git repo synced'
"
make_executable "$GIT_FIX_SCRIPT"

# 3. Ensure husky is installed
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

# 6. Auto-run on npm install
POSTINSTALL="$SCRIPT_DIR/postinstall.sh"
ensure_file "$POSTINSTALL" "#!/bin/bash
bash scripts/project-sanity-check.sh"
make_executable "$POSTINSTALL"

# 7. Inject postinstall script into package.json
if ! grep -q 'postinstall' package.json; then
  echo "📦 Adding postinstall script to package.json"
  node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('package.json'));
    pkg.scripts = pkg.scripts || {};
    pkg.scripts.postinstall = 'bash scripts/postinstall.sh';
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
  "
fi

# 8. Verify versions
REQUIRED_NODE="20"
REQUIRED_TS="5.5"
NODE_VER=$(node -v | cut -c2-)
TS_VER=$(npx tsc -v | cut -d' ' -f2)

if [[ "$NODE_VER" != $REQUIRED_NODE* ]]; then
  echo "⚠️  Node version is $NODE_VER (expected $REQUIRED_NODE.x)"
fi
if [[ "$TS_VER" != $REQUIRED_TS* ]]; then
  echo "⚠️  TypeScript version is $TS_VER (expected $REQUIRED_TS.x)"
fi

# 9. Check essential config files
for CFG in ".eslintrc.js" ".prettierrc" "tsconfig.json"; do
  if [ ! -f "$ROOT_DIR/$CFG" ]; then
    echo "⚠️  Missing config: $CFG"
  else
    echo "✅ Found $CFG"
    if [[ "$CFG" == *.js ]]; then
      node -c "$ROOT_DIR/$CFG" || echo "❌ JS config $CFG has syntax errors"
    fi
  fi
done

# 10. Check .env files
if grep -q 'process.env.' ./src/**/*.ts* 2>/dev/null; then
  if ! compgen -G ".env*" > /dev/null; then
    echo "⚠️  .env file appears missing but is referenced in code"
  fi
fi

# 11. Check for conflicting lockfiles
LOCKS=(package-lock.json yarn.lock pnpm-lock.yaml bun.lockb)
LOCK_FOUND=()
for file in "${LOCKS[@]}"; do
  if [ -f "$file" ]; then LOCK_FOUND+=("$file"); fi
done
if [ "${#LOCK_FOUND[@]}" -gt 1 ]; then
  echo "⚠️  Multiple lockfiles detected: ${LOCK_FOUND[*]}"
fi

# 12. Ensure .editorconfig
EDITORCFG="$ROOT_DIR/.editorconfig"
ensure_file "$EDITORCFG" "root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true"

# 13. Ensure .gitignore has essentials
REQUIRED_IGNORE=("node_modules" ".env" "dist" "build" ".next")
for entry in "${REQUIRED_IGNORE[@]}"; do
  if ! grep -q "$entry" .gitignore 2>/dev/null; then
    echo "$entry" >> .gitignore
    echo "🛡️  Added '$entry' to .gitignore"
  fi

# 14. VSCode settings
SETTINGS_FILE="$VSCODE_DIR/settings.json"
ensure_file "$SETTINGS_FILE" '{
  "editor.formatOnSave": true,
  "eslint.validate": ["javascript", "typescript", "typescriptreact"],
  "prettier.enable": true,
  "typescript.tsdk": "node_modules/typescript/lib"
}'

# 15. Done
echo -e "\n🧠 Sanity check complete. Project structure, Git, tools, lockfiles & config validated."
ls -al "$SCRIPT_DIR"
ls -al "$HUSKY_DIR"
fi