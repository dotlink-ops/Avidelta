#!/bin/bash
# Raycast Title: Run Daily Automation
# Raycast Description: Copy the latest daily summary from the automation output into the Next.js data folder.
# Raycast Icon: 🚀
# Raycast PackageName: daily-automation
# Raycast Mode: compact
# Raycast Author: Automation Bot

set -euo pipefail

automation_root="${AUTOMATION_ROOT:-$HOME/automation}"
output_file="${AUTOMATION_OUTPUT_FILE:-$automation_root/output/daily_summary.json}"
repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_data_file="$repo_root/data/daily_summary.json"
next_data_dir="${AUTOMATION_NEXT_DATA_DIR:-$automation_root/dotlink-next-data}"
next_data_file="$next_data_dir/daily_summary.json"

if [[ ! -f "$output_file" ]]; then
  echo "❌ Automation output not found at: $output_file" >&2
  exit 1
fi

mkdir -p "$next_data_dir"

cp "$output_file" "$repo_data_file"
cp "$output_file" "$next_data_file"

echo "✅ Synced daily summary to:"
echo "   - $repo_data_file"
echo "   - $next_data_file"
