#!/usr/bin/env bash
# Setup script for POSIX environments (Linux / macOS / WSL)
# Run from repository root:
#   ./setup.sh

set -euo pipefail

SCRIPT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "Repository root: $SCRIPT_ROOT"

echo "\n-- Backend setup (backend/) --"
cd "$SCRIPT_ROOT/backend"

if [ ! -d ".venv" ]; then
  echo "Creating virtualenv .venv..."
  python3 -m venv .venv
else
  echo ".venv already exists."
fi

echo "Activating virtualenv..."
# shellcheck disable=SC1091
source .venv/bin/activate

pip install --upgrade pip || true
if [ -f requirements.txt ]; then
  pip install -r requirements.txt
else
  echo "requirements.txt not found in backend/; install dependencies manually."
fi

if [ ! -f .env ]; then
  echo "Creating backend/.env with placeholders (edit values after setup)..."
  cat > .env <<EOF
SECRET_KEY=change_me_replace_with_secure_key
DEBUG=True
EOF
else
  echo ".env already exists. Skipping creation."
fi

if [ -f manage.py ]; then
  echo "Running migrations..."
  python manage.py migrate
else
  echo "manage.py not found in backend/; skipping migrate."
fi

echo "\n-- Frontend setup (frontend/) --"
cd "$SCRIPT_ROOT/frontend"

if [ -f package.json ]; then
  echo "Running npm install in frontend/..."
  npm install
else
  echo "package.json not found in frontend/; skipping npm install."
fi

if [ ! -f .env.local ]; then
  echo "Creating frontend/.env.local with placeholder NEXT_PUBLIC_API_URL..."
  cat > .env.local <<EOF
NEXT_PUBLIC_API_URL=http://localhost:8000/api
EOF
else
  echo "frontend/.env.local already exists. Skipping creation."
fi

echo "\nSetup complete. Review .env files and adjust values as needed."
