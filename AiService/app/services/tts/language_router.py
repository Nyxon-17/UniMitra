import re
import logging
from typing import Tuple

logger = logging.getLogger("unimitra.tts.router")

# Assamese script Unicode block: U+0980 to U+09FF
ASSAMESE_UNICODE_PATTERN = re.compile(r"[\u0980-\u09FF]")
# Latin/English alphabets
LATIN_PATTERN = re.compile(r"[a-zA-Z]")

# Common university and academic acronyms phonetically transliterated into natural spoken Assamese
ASSAMESE_PHONETIC_ACRONYMS = [
    (re.compile(r"\bUGC\b", re.IGNORECASE), "ইউ জি চি"),
    (re.compile(r"\bCBCS\b", re.IGNORECASE), "চি বি চি এছ"),
    (re.compile(r"\bPh\.?D\.?\b", re.IGNORECASE), "পি এইচ ডি"),
    (re.compile(r"\bNEP\b", re.IGNORECASE), "এন ই পি"),
    (re.compile(r"\bFYUGP\b", re.IGNORECASE), "এফ ৱাই ইউ জি পি"),
    (re.compile(r"\bCGPA\b", re.IGNORECASE), "চি জি পি এ"),
    (re.compile(r"\bGPA\b", re.IGNORECASE), "জি পি এ"),
    (re.compile(r"\bHOD\b", re.IGNORECASE), "বিভাগীয় প্ৰধান"),
    (re.compile(r"\bPDF\b", re.IGNORECASE), "পি ডি এফ"),
    (re.compile(r"\bOTP\b", re.IGNORECASE), "ও টি পি"),
    (re.compile(r"\bSMS\b", re.IGNORECASE), "বাৰ্তা"),
    (re.compile(r"\bDU\b"), "ডি ইউ"),
    (re.compile(r"\bGU\b"), "জি ইউ"),
    (re.compile(r"\bTU\b"), "টি ইউ"),
    (re.compile(r"\bDHE\b", re.IGNORECASE), "ডি এইচ ই"),
    (re.compile(r"\bAI\b"), "এ আই"),
]

# Romanized Assamese phonetic markers
ROMANIZED_ASSAMESE_WORDS = {
    "aji", "kali", "ketiya", "kot", "ki", "kio", "kenekua", "kenekuwa", "kenedore",
    "moi", "mur", "muk", "tumi", "tumar", "apuni", "apunar", "apunak",
    "ami", "amar", "eitu", "heitu", "bhal", "kotha", "khobor", "asa", "asu",
    "ase", "asil", "nohoy", "hobo", "hoi", "lagibo", "lage", "bisaru", "bisare",
    "dada", "baideu", "bhaity", "dhonnobad", "namaskar"
}


class LanguageRouter:
    """
    Analyzes AI generated text to determine the primary language routing:
    - 'as': Routes strictly to Bakbak Assamese TTS
    - 'en': Routes strictly to GitHub Open-Source English TTS
    """

    @classmethod
    def normalize_assamese_for_tts(cls, text: str) -> str:
        """
        Phonetically normalizes Assamese text so that the Bakbak TTS engine
        articulates and pronounces each syllable with crystal clarity.
        Completely strips colon (:), comma (,), hyphen/dash (-), semicolon (;), etc.,
        so they are NEVER read aloud by the speech synthesizer.
        """
        if not text:
            return ""

        cleaned = text

        # 1. Strip Markdown links and raw URLs
        cleaned = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", cleaned)
        cleaned = re.sub(r"https?://\S+", "বিশ্ববিদ্যালয়ৰ ৱেবচাইটত", cleaned)
        cleaned = re.sub(r"www\.\S+", "ৱেবচাইটত", cleaned)
        cleaned = re.sub(r"\b[\w\.-]+@[\w\.-]+\.\w+\b", "ইমেইল যোগে", cleaned)

        # 2. Convert percentage symbols to spoken Assamese ('শতাংশ')
        cleaned = re.sub(r"([\u0980-\u09FF\d]+)\s*%", r"\1 শতাংশ", cleaned)
        cleaned = cleaned.replace("%", " শতাংশ")

        # 3. Replace slashes with Assamese ' বা ' (or)
        cleaned = re.sub(r"\s*/\s*", " বা ", cleaned)

        # 4. Handle time expressions before removing colons (e.g., ১০:৩০ -> ১০ বাজি ৩০)
        cleaned = re.sub(r"(\d+|[\u09E6-\u09EF]+):([0-5]\d)\b", r"\1 বাজি \2", cleaned)

        # 5. Handle range hyphens before stripping hyphens (e.g., ৫-১০ -> ৫ ৰ পৰা ১০)
        cleaned = re.sub(r"(\d+|[\u09E6-\u09EF]+)\s*[-–—]\s*(\d+|[\u09E6-\u09EF]+)", r"\1 ৰ পৰা \2", cleaned)

        # 6. Convert bullet markers and numbered list headings to clean pause points
        # e.g., '1. ', '১. ' -> '১। '
        cleaned = re.sub(r"(?m)^\s*[-*•]\s+", "", cleaned)
        cleaned = re.sub(r"(?m)^(\s*)([0-9]+|[\u09E6-\u09EF]+)\.\s+", r"\1\2। ", cleaned)

        # 7. Expand English acronyms to Assamese phonetic syllables
        for pattern, replacement in ASSAMESE_PHONETIC_ACRONYMS:
            cleaned = pattern.sub(replacement, cleaned)

        # 8. Convert English periods and mixed punctuation to Assamese Dari ('। ') for authentic cadence
        cleaned = re.sub(r"([\u0980-\u09FF])\s*\.(?:\s+|$)", r"\1। ", cleaned)
        cleaned = re.sub(r"\.(?:\s+|$)", "। ", cleaned)

        # 9. Completely strip colon (:), comma (,), hyphen/dash (-), semicolon (;), and brackets
        # so TTS NEVER pronounces words like 'colon', 'comma', 'hyphen', or 'dash'
        for sym in [
            ":", ",", "-", "–", "—", ";", "_", "*", "#", "`", "~", "=",
            "<", ">", "{", "}", "[", "]", "(", ")", "|", "^", "\\",
            "\"", "“", "”", "‘", "’"
        ]:
            cleaned = cleaned.replace(sym, " ")

        # 10. Normalize consecutive punctuation and spacing
        cleaned = re.sub(r"[।]{2,}", "।", cleaned)
        cleaned = re.sub(r"[!]{2,}", "!", cleaned)
        cleaned = re.sub(r"[?]{2,}", "?", cleaned)
        cleaned = re.sub(r"\s*([।!?])\s*", r"\1 ", cleaned)
        cleaned = re.sub(r"[ \t]{2,}", " ", cleaned)
        cleaned = re.sub(r"\n{2,}", "\n", cleaned)

        return cleaned.strip()

    @staticmethod
    def clean_text_for_speech(text: str) -> str:
        """
        Removes markdown formatting artifacts (*, #, =, /) as well as
        colons (:), commas (,), and hyphens (-) so TTS never reads symbol names.
        """
        if not text:
            return ""
        cleaned = text.replace("*", "").replace("#", "")
        cleaned = cleaned.replace("===", "").replace("==", "").replace("=", " - ")
        has_assamese = bool(ASSAMESE_UNICODE_PATTERN.search(cleaned))
        or_word = " বা " if has_assamese else " or "
        cleaned = cleaned.replace("/", or_word)
        cleaned = cleaned.replace("`", "").replace("~", "")

        # Handle time expressions before removing colons (e.g. 10:30 -> 10 30)
        cleaned = re.sub(r"(\d+|[\u09E6-\u09EF]+):([0-5]\d)\b", r"\1 \2", cleaned)

        # Remove colons (:), commas (,), hyphens/dashes (-), semicolons (;), and brackets
        for sym in [":", ",", "-", "–", "—", ";", "_", "(", ")", "[", "]", "{", "}", "\"", "'"]:
            cleaned = cleaned.replace(sym, " ")

        cleaned = re.sub(r"[ \t]{2,}", " ", cleaned)
        return cleaned.strip()

    @classmethod
    def detect_primary_language(cls, text: str, hint: str = None) -> Tuple[str, float]:
        """
        Detects whether Assamese or English is the primary language of the text.
        Returns a tuple: (language_code, confidence_score)
        - 'as': Assamese Unicode or Assamese-primary mixed text
        - 'en': English Latin text
        """
        if not text or not text.strip():
            return "en", 1.0

        if hint in ("as", "as_script", "assamese"):
            return "as", 1.0
        elif hint in ("en", "english"):
            # If hint is English, but text contains significant Assamese unicode, prioritize Assamese
            as_count = len(ASSAMESE_UNICODE_PATTERN.findall(text))
            if as_count >= 5:
                return "as", 0.95
            return "en", 1.0

        clean = cls.clean_text_for_speech(text)
        as_chars = len(ASSAMESE_UNICODE_PATTERN.findall(clean))
        latin_chars = len(LATIN_PATTERN.findall(clean))

        # 1. Clear Assamese Unicode presence
        if as_chars > 0:
            if latin_chars == 0:
                return "as", 1.0
            # Assamese-English mixed: compare character density
            total = as_chars + latin_chars
            as_ratio = as_chars / max(1, total)
            if as_ratio >= 0.20 or as_chars >= 5:
                # Primary Assamese with English loanwords (e.g. 'Exam', 'Syllabus', 'Dispur')
                return "as", as_ratio
            else:
                return "en", 1.0 - as_ratio

        # 2. Check Romanized Assamese keywords
        words = clean.lower().split()
        if words:
            as_word_hits = sum(1 for w in words if re.sub(r"[^a-z]", "", w) in ROMANIZED_ASSAMESE_WORDS)
            if as_word_hits >= 2 or (len(words) <= 5 and as_word_hits >= 1):
                return "as", 0.85

        # 3. Default to English
        return "en", 1.0


language_router = LanguageRouter()

