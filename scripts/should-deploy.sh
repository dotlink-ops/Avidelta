#!/bin/bash
# Check if deployment should be skipped based on changed files
# Exit 0 = skip deployment, Exit 1 = proceed with deployment

# List of paths to ignore (changes to these won't trigger deployments)
IGNORED_PATHS=(
  "*.md"
  "SAMPLE_OUTPUTS"
  "scripts"
  "*.sh"
  ".env.example"
  "DailySummaryPanel"
)

# Build the git diff exclude patterns
EXCLUDE_PATTERNS=""
for path in "${IGNORED_PATHS[@]}"; do
  EXCLUDE_PATTERNS="$EXCLUDE_PATTERNS ':!$path'"
done

# Check if only ignored files were changed
eval "git diff --quiet HEAD^ HEAD -- . $EXCLUDE_PATTERNS"
