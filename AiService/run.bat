@echo off
echo ========================================================
echo Starting UniMitra Bilingual Python AI Service...
echo Host: http://localhost:8000
echo Docs: http://localhost:8000/docs
echo ========================================================
cd /d "%~dp0"
set PYTHONPATH=.
if exist ".venv\Scripts\python.exe" (
    ".venv\Scripts\python.exe" -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
) else (
    echo [ERROR] Virtual environment not found in .venv.
    echo Please create it: python -m venv .venv
    echo Then run: .venv\Scripts\pip install -r requirements.txt
    pause
)

