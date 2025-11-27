#!/usr/bin/env bash
set -e

echo "[setup] Starting unified setup for Python automation + Next.js app"

# Navigate to repo root (in case script is run from scripts/ directory)
cd "$(dirname "$0")/.."

# ---- Python / venv ----
if [ ! -d "venv" ]; then
  echo "[setup] Creating Python virtualenv (venv)…"
  python3 -m venv venv
else
  echo "[setup] venv already exists, skipping creation."
fi

echo "[setup] Activating virtualenv and installing Python dependencies…"
# shellcheck source=/dev/null
source venv/bin/activate

# Install from scripts/requirements.txt
if [ -f "scripts/requirements.txt" ]; then
  pip install --upgrade pip
  pip install -r scripts/requirements.txt
  echo "[setup] Python dependencies installed from scripts/requirements.txt"
else
  echo "[setup] No scripts/requirements.txt found. Install Python deps manually as needed."
fi

deactivate

# ---- Next.js / Node ----
echo "[setup] Installing Node dependencies (Next.js app is at repo root)…"
npm install

# ---- Create output directories ----
echo "[setup] Creating output directories…"
mkdir -p output/notes
mkdir -p output/backups

# ---- Setup .env.local if needed ----
if [ ! -f ".env.local" ]; then
  if [ -f ".env.example" ]; then
    echo "[setup] Copying .env.example to .env.local…"
    cp .env.example .env.local
    echo "[setup] ⚠️  Remember to edit .env.local with your API keys!"
  else
    echo "[setup] No .env.example found. Create .env.local manually with API keys."
  fi
else
  echo "[setup] .env.local already exists."
fi

echo ""
echo "[setup] ✅ Done!"
echo ""
echo "Next steps:"
echo "  1. Edit .env.local with your API keys (OPENAI_API_KEY, GITHUB_TOKEN, REPO_NAME)"
echo "  2. Run automation in demo mode: python3 scripts/daily_v2.py --demo"
echo "  3. Run automation (production): source venv/bin/activate && python3 scripts/daily_v2.py"
echo "  4. Start Next.js dev server: npm run dev"
echo "  5. Build Next.js for production: npm run build"
echo ""
echo "For more details, see README.md"
