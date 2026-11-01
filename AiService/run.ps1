Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Starting UniMitra Bilingual Python AI Service..." -ForegroundColor Green
Write-Host "Host: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Docs: http://localhost:8000/docs" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan

Set-Location $PSScriptRoot
$env:PYTHONPATH = "."

if (Test-Path ".\.venv\Scripts\python.exe") {
    & ".\.venv\Scripts\python.exe" -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
} else {
    Write-Host "[ERROR] Virtual environment not found in .venv." -ForegroundColor Red
    Write-Host "Please create it using: python -m venv .venv"
    Write-Host "Then install packages: .\.venv\Scripts\pip install -r requirements.txt"
}

