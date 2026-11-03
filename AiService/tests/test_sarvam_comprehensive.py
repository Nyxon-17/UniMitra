import asyncio
import json
import httpx
from app.services.sarvam_stt import sarvam_stt
from app.services.tts.bakbak_assamese import bakbak_tts
import edge_tts

test_cases = [
    {
        "id": 1,
        "input_phrase": "মোৰ হোষ্টেলৰ বিষয়ে কোৱা",
        "description": "mur hostel r bikhoye kowa",
        "lang": "as-IN",
        "mode": "codemix",
        "synth_type": "assamese"
    },
    {
        "id": 2,
        "input_phrase": "তুমি কোন হয়",
        "description": "tumi kun hoi",
        "lang": "as-IN",
        "mode": "transcribe",
        "synth_type": "assamese"
    },
    {
        "id": 3,
        "input_phrase": "মই কলেজ যাম",
        "description": "moi college jam",
        "lang": "as-IN",
        "mode": "transcribe",
        "synth_type": "assamese"
    },
    {
        "id": 4,
        "input_phrase": "আজি ঘৰতে আছোঁ",
        "description": "aji ghrt e asu",
        "lang": "as-IN",
        "mode": "transcribe",
        "synth_type": "assamese"
    },
    {
        "id": 5,
        "input_phrase": "নিভৰয়া বিশ্ববিদ্যালয়ৰ পৰীক্ষাত উত্তীৰ্ণ নম্বৰ কিমান লাগে?",
        "description": "Assamese Unicode speech",
        "lang": "as-IN",
        "mode": "transcribe",
        "synth_type": "assamese"
    },
    {
        "id": 6,
        "input_phrase": "Moi university admission process janibo bisaru",
        "description": "Assamese-English mixed speech",
        "lang": "as-IN",
        "mode": "codemix",
        "synth_type": "assamese"
    },
    {
        "id": 7,
        "input_phrase": "Tell me about the university hostel fee and semester examination.",
        "description": "Normal English speech",
        "lang": "en-IN",
        "mode": "transcribe",
        "synth_type": "english"
    }
]

async def generate_english_audio(text: str) -> bytes:
    communicate = edge_tts.Communicate(text, "en-IN-NeerjaNeural")
    audio_data = b""
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_data += chunk["data"]
    return audio_data

async def run_all_tests():
    results = []
    for tc in test_cases:
        print(f"\n=======================================================")
        print(f"Test {tc['id']}: {tc['description']} ('{tc['input_phrase']}')")
        print(f"Language: {tc['lang']} | Mode: {tc['mode']}")

        if tc["synth_type"] == "english":
            audio_bytes = await generate_english_audio(tc["input_phrase"])
            audio_format = "audio/mp3"
            filename = "speech_test.mp3"
        else:
            audio_bytes = await bakbak_tts.synthesize_async(tc["input_phrase"])
            audio_format = "audio/wav"
            filename = "speech_test.wav"

        print(f"Generated Audio Size: {len(audio_bytes)} bytes | Format: {audio_format}")

        res = await sarvam_stt.transcribe_async(
            audio_bytes=audio_bytes,
            mime_type=audio_format,
            language=tc["lang"],
            mode=tc["mode"],
            filename=filename
        )

        print(f"Sarvam Success: {res.get('success')}")
        print(f"Raw Sarvam Transcript: '{res.get('transcript')}'")
        print(f"Request ID: {res.get('request_id')}")
        print(f"Detected Lang: {res.get('language_code')}")

        results.append({
            "test_id": tc["id"],
            "test_phrase": tc["description"],
            "spoken_input": tc["input_phrase"],
            "audio_format": audio_format,
            "mode": tc["mode"],
            "raw_response": res,
            "final_transcript": res.get("transcript", ""),
            "preserves_meaning": bool(res.get("transcript"))
        })

    with open("tests/test_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print("\nAll 7 test cases executed and results saved to tests/test_results.json!")

if __name__ == "__main__":
    asyncio.run(run_all_tests())

