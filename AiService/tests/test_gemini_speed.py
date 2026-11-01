import sys
import time
sys.stdout.reconfigure(encoding='utf-8')
from app.config import settings
from google import genai
from google.genai import types

client = genai.Client(api_key=settings.GEMINI_API_KEY)
candidates = ["gemini-3.5-flash-lite", "gemini-flash-lite-latest", "gemini-3.1-flash-lite", "gemini-3.5-flash", "gemini-flash-latest"]
for m in candidates:
    print(f"\n--- Testing model: {m} ---")
    t0 = time.time()
    try:
        res = client.models.generate_content(
            model=m,
            contents="Say 'Hello UniMitra' in Assamese script.",
            config=types.GenerateContentConfig(max_output_tokens=30)
        )
        print(f"Success in {time.time()-t0:.2f}s: {res.text.strip()}")
    except Exception as e:
        print(f"Failed in {time.time()-t0:.2f}s: {e}")
