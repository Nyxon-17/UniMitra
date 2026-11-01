import os
import sys
from pathlib import Path

# Force UTF-8 on Windows stdout/stderr to print Assamese Unicode cleanly
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

# Add AiService to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from fastapi.testclient import TestClient
from app.main import app
from app.config import settings

client = TestClient(app)
AUTH_HEADERS = {"X-Internal-Secret": settings.AI_SERVICE_SECRET}


def test_health():
    print("\n--- Test 1: Health Probe ---")
    res = client.get("/health")
    assert res.status_code == 200, f"Health check failed: {res.status_code}"
    data = res.json()
    print("Health Status:", data.get("status"))
    print("Database:", data.get("database"))
    print("Models:", data.get("models"))
    assert data.get("status") in ["healthy", "degraded"]
    print("PASSED: Health Probe")


def test_auth_protection():
    print("\n--- Test 2: Security Auth Guard ---")
    # Missing secret header
    res_no_auth = client.post("/api/ai/query", json={"query": "test query"})
    assert res_no_auth.status_code == 401, f"Expected 401, got {res_no_auth.status_code}"
    print("Correctly rejected request without X-Internal-Secret header (401)")

    # Invalid secret header
    res_bad_auth = client.post(
        "/api/ai/query",
        json={"query": "test query"},
        headers={"X-Internal-Secret": "wrong_secret"},
    )
    assert res_bad_auth.status_code == 401, f"Expected 401 for bad secret, got {res_bad_auth.status_code}"
    print("Correctly rejected request with invalid X-Internal-Secret (401)")
    print("PASSED: Security Auth Guard")


def test_assamese_grounded_rag():
    print("\n--- Test 3: Assamese Grounded Query (উত্তীৰ্ণ নম্বৰ) ---")
    assamese_query = "ডিব্ৰুগড় বিশ্ববিদ্যালয়ৰ পৰীক্ষাত উত্তীৰ্ণ হ’বলৈ নূন্যতম নম্বৰ কিমান লাগে?"
    res = client.post(
        "/api/ai/query",
        json={
            "query": assamese_query,
            "language": "as",
            "university_code": "DU",
        },
        headers=AUTH_HEADERS,
    )
    assert res.status_code == 200, f"Query failed: {res.status_code}"
    data = res.json()
    print("Assamese Answer:", data.get("answer"))
    print("Citation Source:", data.get("source"))
    print("Citation Page:", data.get("page"))
    print("Confidence:", data.get("confidence"))
    assert data.get("success") is True
    assert "৪০%" in data.get("answer") or "40%" in data.get("answer")
    assert data.get("language") == "as"
    print("PASSED: Assamese Grounded Query")


def test_english_grounded_rag():
    print("\n--- Test 4: English Grounded Query (Medical Attendance) ---")
    english_query = "What is the attendance condonation limit for medical absence?"
    res = client.post(
        "/api/ai/query",
        json={
            "query": english_query,
            "language": "en",
            "university_code": "DU",
        },
        headers=AUTH_HEADERS,
    )
    assert res.status_code == 200, f"Query failed: {res.status_code}"
    data = res.json()
    print("English Answer:", data.get("answer"))
    print("Citation Source:", data.get("source"))
    print("Citation Page:", data.get("page"))
    assert data.get("success") is True
    assert "75%" in data.get("answer") or "65%" in data.get("answer")
    print("PASSED: English Grounded Query")


def test_voice_transcribe():
    print("\n--- Test 5: Speech-to-Text Transcribe ---")
    dummy_audio = b"RIFF\x24\x00\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00\x44\xac\x00\x00\x88\x58\x01\x00\x02\x00\x10\x00data\x00\x00\x00\x00"
    res = client.post(
        "/api/ai/voice/transcribe",
        data={"language": "as"},
        files={"audio": ("sample.wav", dummy_audio, "audio/wav")},
        headers=AUTH_HEADERS,
    )
    assert res.status_code == 200, f"Voice transcribe failed: {res.status_code}"
    data = res.json()
    print("Transcript:", data.get("transcript"))
    print("Confidence:", data.get("confidence"))
    assert data.get("success") is True
    assert len(data.get("transcript")) > 0
    print("PASSED: Speech-to-Text Transcribe")


def test_voice_synthesize():
    print("\n--- Test 6: Text-to-Speech Synthesis ---")
    res = client.post(
        "/api/ai/voice/synthesize",
        json={
            "text": "ডিব্ৰুগড় বিশ্ববিদ্যালয়ৰ পৰীক্ষাত নূন্যতম ৪০% নম্বৰ বাধ্যতামূলক।",
            "language": "as",
        },
        headers=AUTH_HEADERS,
    )
    assert res.status_code == 200, f"Voice synthesis failed: {res.status_code}"
    assert res.headers.get("content-type") == "audio/mpeg"
    assert len(res.content) > 100
    print(f"Synthesized Audio Bytes: {len(res.content)} bytes (audio/mpeg)")
    print("PASSED: Text-to-Speech Synthesis")


if __name__ == "__main__":
    print("==================================================")
    print("STARTING UNIMITRA AI SERVICE INTEGRATION TEST SUITE")
    print("==================================================")
    test_health()
    test_auth_protection()
    test_assamese_grounded_rag()
    test_english_grounded_rag()
    test_voice_transcribe()
    test_voice_synthesize()
    print("\n==================================================")
    print("ALL 6/6 AI SERVICE INTEGRATION TESTS PASSED PERFECTLY!")
    print("==================================================")
