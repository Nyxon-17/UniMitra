"""
TTS-Accelerator - Official Implementation from GitHub README
Repository: https://github.com/RanjitDas-IN/tts-accelerator
Developed by Ranjit Das & Uday Subba
"""
import sys
import os

try:
    import static_ffmpeg
    static_ffmpeg.add_paths()
except Exception:
    pass

# Import the library
import tts_accelerator as tts

# =========================================================================
# SELECT VOICE OPTION:
# Any supported voice from `edge-tts --list-voices` can be selected here.
# Recommended Voices for UniMitra / Multilingual AI:
#
# 1. Indic / Assamese / Bengali:
#    - "bn-IN-TanishaaNeural"   (Female, Natural Eastern Indic)
#    - "bn-IN-BashkarNeural"    (Male, Natural Eastern Indic)
#
# 2. Indian English (Great for Romanized Assamese & English):
#    - "en-IN-NeerjaNeural"     (Female, Clear Indian Accent)
#    - "en-IN-PrabhatNeural"    (Male, Clear Indian Accent)
#
# 3. Multilingual / Expressive:
#    - "en-US-AvaMultilingualNeural" (Female, Expressive Multilingual)
#    - "en-US-AndrewMultilingualNeural" (Male, Expressive Multilingual)
#
# 4. Standard English:
#    - "en-CA-LiamNeural"       (Male, Deep & Articulate)
#    - "en-US-JennyNeural"      (Female, Conversational)
#    - "en-GB-LibbyNeural"      (Female, British)
#    - "en-US-GuyNeural"        (Male, American)
# =========================================================================

# Choose your desired voice from the options above:
voice = "en-IN-NeerjaNeural"  # e.g., "en-US-AvaMultilingualNeural", "bn-IN-TanishaaNeural", "en-IN-PrabhatNeural"

text = (
    "Imagine reading out a 1,000-word story or a chatbot message stream — "
    "normally, you'd wait several seconds or even minutes before hearing anything. "
    "But with tts-accelerator, audio playback begins in just 2–3 seconds, "
    "no matter how long the input is. It streams audio directly from RAM, "
    "without saving to disk, and keeps the voice natural and fluid throughout. "
    "This makes it perfect for assistants, narrators, or any real-time voice-based apps."
)

if __name__ == "__main__":
    print(f"Starting real-time playback using voice: {voice}")
    # Speak the text — playback starts almost instantly
    tts.speak_text(text, voice)
    print("Real-time playback completed successfully!")
