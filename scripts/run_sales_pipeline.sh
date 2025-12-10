#!/bin/bash
# Wrapper script to run sales pipeline data pull
# This script can be called from cron or manually

set -e

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

echo "🔄 Sales Pipeline Data Pull"
echo "============================"
echo ""

# Check if running in demo mode
if [[ "$1" == "--demo" ]] || [[ "$1" == "--dry-run" ]]; then
    echo "📋 Mode: DEMO (using sample data)"
    python3 scripts/sales_pipeline_pull.py --demo
else
    echo "📋 Mode: PRODUCTION"
    python3 scripts/sales_pipeline_pull.py
fi

echo ""
echo "✅ Pipeline data pull complete"
echo "📄 Output: output/sales_pipeline.json"
