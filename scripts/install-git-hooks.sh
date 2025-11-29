#!/usr/bin/env bash
set -euo pipefail

HOOK_SRC=".hooks/pre-commit"
HOOK_DST=".git/hooks/pre-commit"

mkdir -p .hooks
cat > "$HOOK_SRC" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
AUDIT_MD="docs/security-audit-template.md"
UPDATER="scripts/update_security_dashboard.py"
[ -f "$UPDATER" ] || exit 0
[ -f "$AUDIT_MD" ] || exit 0
CHANGED="$(git diff --cached --name-only)"
if ! grep -Eq "^(${AUDIT_MD}|${UPDATER})$" <<<"$CHANGED"; then
  exit 0
fi
echo "→ Updating security dashboard via $UPDATER ..."
PYTHON_BIN="${PYTHON_BIN:-python3}"
command -v "$PYTHON_BIN" >/dev/null 2>&1 || PYTHON_BIN="python"
"$PYTHON_BIN" "$UPDATER"
if ! git diff --quiet "$AUDIT_MD"; then
  git add "$AUDIT_MD"
  echo "✓ Dashboard refreshed and re-staged: $AUDIT_MD"
else
  echo "✓ No dashboard changes needed"
fi
EOF

install -m 0755 "$HOOK_SRC" "$HOOK_DST"
echo "✓ Installed pre-commit hook to $HOOK_DST"
echo ""
echo "The hook will automatically update the security dashboard when:"
echo "  - docs/security-audit-template.md is committed"
echo "  - scripts/update_security_dashboard.py is committed"
echo ""
echo "To bypass the hook: git commit --no-verify"
