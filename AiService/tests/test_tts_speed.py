import asyncio
import time
import sys
sys.stdout.reconfigure(encoding='utf-8')
from app.services.tts_service import tts_service

async def main():
    print("Testing Assamese TTS...")
    t0 = time.time()
    audio = await tts_service.synthesize_async('ডিব্ৰুগড় বিশ্ববিদ্যালয়ৰ পৰীক্ষাত উত্তীৰ্ণ নম্বৰ ৪০%', 'as')
    print(f"Assamese TTS completed in {time.time()-t0:.2f}s, bytes: {len(audio) if audio else None}")

    print("\nTesting English TTS...")
    t0 = time.time()
    audio_en = await tts_service.synthesize_async('According to university rules, minimum attendance is 75 percent.', 'en')
    print(f"English TTS completed in {time.time()-t0:.2f}s, bytes: {len(audio_en) if audio_en else None}")

asyncio.run(main())

