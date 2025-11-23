<#
Setup script for Windows PowerShell.
Run this from the repository root (double-clicking may not run in an elevated shell).

Usage:
  Open PowerShell, go to project root and run:
    .\setup.ps1

This will:
- Create and activate a `.venv` inside `backend/` if missing
- Install Python dependencies from `backend/requirements.txt`
- Run Django migrations
- Create a `.env` in `backend/` with placeholder values if missing
- Install frontend dependencies with `npm install` and create `frontend/.env.local` placeholder

#>
Set-StrictMode -Version Latest

$ScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
Write-Host "Repository root: $ScriptRoot" -ForegroundColor Cyan

function Run-BackendSetup {
    Push-Location -Path (Join-Path $ScriptRoot 'backend')
    Write-Host "\n-- Backend setup (backend/) --" -ForegroundColor Green

    if (-not (Test-Path '.venv')) {
        Write-Host "Creating virtual environment .venv..."
        python -m venv .venv
    } else {
        Write-Host "Virtualenv .venv already exists."
    }

    Write-Host "Activating virtualenv..."
    $activate = Join-Path (Get-Location) '.venv\Scripts\Activate.ps1'
    if (Test-Path $activate) {
        & $activate
    } else {
        Write-Warning "Activate script not found. Activate the venv manually: .\.venv\Scripts\Activate.ps1"
    }

    Write-Host "Upgrading pip and installing requirements..."
    python -m pip install --upgrade pip
    if (Test-Path 'requirements.txt') {
        pip install -r requirements.txt
    } else {
        Write-Warning "requirements.txt not found in backend/; install dependencies manually."
    }

    # Create .env with sensible defaults if not exists
    if (-not (Test-Path '.env')) {
        Write-Host "Creating backend/.env with placeholders (edit values after setup)..."
        @"
SECRET_KEY=change_me_replace_with_secure_key
DEBUG=True
"@ | Out-File -FilePath .env -Encoding UTF8
    } else {
        Write-Host ".env already exists. Skipping creation." -ForegroundColor Yellow
    }

    if (Test-Path 'manage.py') {
        Write-Host "Running migrations..."
        python manage.py migrate
    } else {
        Write-Warning "manage.py not found in backend/; skipping migrate."
    }

    Pop-Location
}

function Run-FrontendSetup {
    Push-Location -Path (Join-Path $ScriptRoot 'frontend')
    Write-Host "\n-- Frontend setup (frontend/) --" -ForegroundColor Green

    if (Test-Path 'package.json') {
        Write-Host "Running npm install in frontend/..." 
        npm install
    } else {
        Write-Warning "package.json not found in frontend/; skipping npm install."
    }

    if (-not (Test-Path '.env.local')) {
        Write-Host "Creating frontend/.env.local with placeholder NEXT_PUBLIC_API_URL..."
        @"
NEXT_PUBLIC_API_URL=http://localhost:8000/api
"@ | Out-File -FilePath .env.local -Encoding UTF8
    } else {
        Write-Host "frontend/.env.local already exists. Skipping creation." -ForegroundColor Yellow
    }

    Pop-Location
}

try {
    Run-BackendSetup
    Run-FrontendSetup
    Write-Host "\nSetup complete. Review .env files and adjust values as needed." -ForegroundColor Cyan
} catch {
    Write-Error "Setup script failed: $_"
}
