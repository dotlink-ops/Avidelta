#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

OUTPUT_JSON="$PROJECT_ROOT/output/daily_summary.json"
PUBLIC_DIR="$PROJECT_ROOT/public/data"
PUBLIC_JSON="$PUBLIC_DIR/daily_summary.json"
SAMPLE_DIR="$PROJECT_ROOT/SAMPLE_OUTPUTS"

log() { echo "[sync-to-frontend] $*"; }
warn() { echo "[sync-to-frontend] WARN: $*" >&2; }

log "Project root: $PROJECT_ROOT"

if [ ! -f "$OUTPUT_JSON" ]; then
  warn "No output file found at output/daily_summary.json; nothing to sync"
  exit 0
fi

mkdir -p "$PUBLIC_DIR" "$SAMPLE_DIR" "$PROJECT_ROOT/output/backups"

# Backup (best-effort; never fail the sync)
if [ "${SYNC_BACKUP:-1}" != "0" ]; then
  TS="$(date -u +"%Y%m%d_%H%M%S")"
  cp "$OUTPUT_JSON" "$PROJECT_ROOT/output/backups/daily_summary_${TS}.json" 2>/dev/null || true
else
  log "Skipping backup (SYNC_BACKUP=0)"
fi

# Copy to frontend data path
cp "$OUTPUT_JSON" "$PUBLIC_JSON"
log "Synced daily summary to public/data/daily_summary.json"

# Validate JSON (best-effort)
if command -v jq >/dev/null 2>&1; then
  if jq empty "$OUTPUT_JSON" >/dev/null 2>&1; then
    log "Validated JSON with jq"
  else
    warn "daily_summary.json is not valid JSON; continuing anyway"
  fi
else
  warn "jq not found; skipping JSON validation"
fi

# Generate SAMPLE_OUTPUTS (best-effort, resilient to missing keys / malformed structures)
if [ "${SYNC_SAMPLES:-1}" != "0" ]; then
  python3 - <<'PY' || true
import json
from pathlib import Path
from datetime import datetime, timezone

root = Path(".").resolve()
output_json = root / "output" / "daily_summary.json"
sample_dir = root / "SAMPLE_OUTPUTS"
sample_dir.mkdir(parents=True, exist_ok=True)

try:
    data = json.loads(output_json.read_text(encoding="utf-8"))
except Exception as e:
    # If JSON is malformed, do not crash the sync script
    (sample_dir / "daily_runner_summary.txt").write_text(
        "Daily Runner — Generated Summary\n" + "-" * 31 + "\n\n" +
        f"ERROR: Could not parse output/daily_summary.json ({e})\n",
        encoding="utf-8",
    )
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    (sample_dir / "issue_pipeline_log.txt").write_text(
      f"[{now}] ERROR: Failed to parse output/daily_summary.json\n",
      encoding="utf-8",
    )
    raise SystemExit(0)

date = str(data.get("date") or "unknown")
created_at = str(data.get("created_at") or "")
metadata = data.get("metadata") or {}

highlights = data.get("summary_bullets") or data.get("highlights") or []
action_items = data.get("action_items") or []

if not isinstance(highlights, list):
  highlights = [highlights]
if not isinstance(action_items, list):
  action_items = [action_items]

# Normalize
highlights = [str(x).strip() for x in highlights if x is not None and str(x).strip()]
action_items = [str(x).strip() for x in action_items if x is not None and str(x).strip()]

runner_version = str(metadata.get("runner_version") or "unknown")
demo_mode = metadata.get("demo_mode")
notes_count = metadata.get("notes_count")
issues_created = data.get("issues_created")

lines = []
lines.append("Daily Runner — Generated Summary")
lines.append("-------------------------------")
lines.append("")
lines.append(f"Date: {date}")
lines.append("")
lines.append("Top Highlights")
if highlights:
    for h in highlights:
        lines.append(f"- {h}")
else:
    lines.append("- (no highlights)")
lines.append("")
lines.append("Action items")
if action_items:
    for idx, item in enumerate(action_items, start=1):
        lines.append(f"{idx}) {item}")
else:
    lines.append("(no action items)")
lines.append("")
lines.append("Logs / Metadata")
lines.append(f"- runner-version: {runner_version}")
lines.append(f"- demo_mode: {demo_mode}")
lines.append(f"- notes_count: {notes_count}")

(sample_dir / "daily_runner_summary.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")

# Issue pipeline log (kept intentionally lightweight)
now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
issue_count = issues_created if isinstance(issues_created, int) else (len(data.get("issues") or []))
log_lines = [
    f"[{created_at or now}] INFO: Starting issue pipeline",
    "[" + now + "] DEBUG: Processing automation outputs",
    f"[{now}] INFO: Generated summary with {len(highlights)} highlights",
    f"[{now}] INFO: Created {issue_count} GitHub issues",
    f"[{now}] INFO: Finished issue pipeline",
    "",
    "Note: This file is auto-generated from the latest automation run.",
]
(sample_dir / "issue_pipeline_log.txt").write_text("\n".join(log_lines) + "\n", encoding="utf-8")
PY
  log "Updated SAMPLE_OUTPUTS"
else
  log "Skipping SAMPLE_OUTPUTS update (SYNC_SAMPLES=0)"
fi

log "Done"
