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
    # Ordinal numbers in English and Assamese
    (re.compile(r"\b1st\b", re.IGNORECASE), "প্ৰথম"),
    (re.compile(r"\b2nd\b", re.IGNORECASE), "দ্বিতীয়"),
    (re.compile(r"\b3rd\b", re.IGNORECASE), "তৃতীয়"),
    (re.compile(r"\b4th\b", re.IGNORECASE), "চতুৰ্থ"),
    (re.compile(r"\b5th\b", re.IGNORECASE), "পঞ্চম"),
    (re.compile(r"\b6th\b", re.IGNORECASE), "ষষ্ঠ"),
    (re.compile(r"\b7th\b", re.IGNORECASE), "সপ্তম"),
    (re.compile(r"\b8th\b", re.IGNORECASE), "অষ্টম"),
    (re.compile(r"\b9th\b", re.IGNORECASE), "নৱম"),
    (re.compile(r"\b10th\b", re.IGNORECASE), "দশম"),
    (re.compile(r"১ম\b"), "প্ৰথম"),
    (re.compile(r"২য়\b"), "দ্বিতীয়"),
    (re.compile(r"৩য়\b"), "তৃতীয়"),
    (re.compile(r"৪ৰ্থ\b"), "চতুৰ্থ"),
    (re.compile(r"৫ম\b"), "পঞ্চম"),
    (re.compile(r"৬ষ্ঠ\b"), "ষষ্ঠ"),
    (re.compile(r"৭ম\b"), "সপ্তম"),
    (re.compile(r"৮ম\b"), "অষ্টম"),
    (re.compile(r"৯ম\b"), "নৱম"),
    (re.compile(r"১০ম\b"), "দশম"),

    # Universities
    (re.compile(r"\bDibrugarh\s+University\b", re.IGNORECASE), "ডিব্ৰুগড় বিশ্ববিদ্যালয়"),
    (re.compile(r"\bGauhati\s+University\b", re.IGNORECASE), "গুৱাহাটী বিশ্ববিদ্যালয়"),
    (re.compile(r"\bTezpur\s+University\b", re.IGNORECASE), "তেজপুৰ বিশ্ববিদ্যালয়"),
    (re.compile(r"\bAssam\s+University\b", re.IGNORECASE), "অসম বিশ্ববিদ্যালয়"),
    (re.compile(r"\bCotton\s+University\b", re.IGNORECASE), "কটন বিশ্ববিদ্যালয়"),
    (re.compile(r"\bBodoland\s+University\b", re.IGNORECASE), "বড়োলেণ্ড বিশ্ববিদ্যালয়"),

    # Common Academic & University Terms
    (re.compile(r"\btoppers?\b", re.IGNORECASE), "টপাৰ"),
    (re.compile(r"\bhostels?\b", re.IGNORECASE), "হোষ্টেল"),
    (re.compile(r"\badmissions?\b", re.IGNORECASE), "নামভৰ্তি"),
    (re.compile(r"\bsemesters?\b", re.IGNORECASE), "চেমিষ্টাৰ"),
    (re.compile(r"\bexaminations?|exams?\b", re.IGNORECASE), "পৰীক্ষা"),
    (re.compile(r"\bresults?\b", re.IGNORECASE), "ফলাফল"),
    (re.compile(r"\bsyllabus(?:es)?\b", re.IGNORECASE), "পাঠ্যক্ৰম"),
    (re.compile(r"\bdepartments?\b", re.IGNORECASE), "বিভাগ"),
    (re.compile(r"\blibrary\b", re.IGNORECASE), "গ্ৰন্থাগাৰ"),
    (re.compile(r"\bscholarships?\b", re.IGNORECASE), "বৃত্তি"),
    (re.compile(r"\bplacements?\b", re.IGNORECASE), "নিয়োগ"),
    (re.compile(r"\bregistrations?\b", re.IGNORECASE), "পঞ্জীয়ন"),
    (re.compile(r"\bnotifications?|notices?\b", re.IGNORECASE), "জাননী"),
    (re.compile(r"\bfees?\b", re.IGNORECASE), "মাচুল"),
    (re.compile(r"\broll\s*(?:no\.?|number)\b", re.IGNORECASE), "ৰোল নম্বৰ"),
    (re.compile(r"\bmarks?\b", re.IGNORECASE), "নম্বৰ"),
    (re.compile(r"\bgrades?\b", re.IGNORECASE), "গ্ৰেড"),
    (re.compile(r"\bfaculty\b", re.IGNORECASE), "শিক্ষক"),
    (re.compile(r"\bstudents?\b", re.IGNORECASE), "ছাত্ৰ-ছাত্ৰী"),
    (re.compile(r"\bcampus\b", re.IGNORECASE), "প্ৰাংগন"),
    (re.compile(r"\bdegrees?\b", re.IGNORECASE), "ডিগ্ৰী"),
    (re.compile(r"\bcanteens?\b", re.IGNORECASE), "কেণ্টিন"),
    (re.compile(r"\bwebsites?\b", re.IGNORECASE), "ৱেবচাইট"),
    (re.compile(r"\be-?mails?\b", re.IGNORECASE), "ইমেইল"),
    (re.compile(r"\bcontacts?\b", re.IGNORECASE), "যোগাযোগ"),
    (re.compile(r"\bqualifications?\b", re.IGNORECASE), "যোগ্যতা"),
    (re.compile(r"\bmerit\s+lists?\b", re.IGNORECASE), "মেধা তালিকা"),
    (re.compile(r"\brankings?|ranks?\b", re.IGNORECASE), "স্থান"),
    (re.compile(r"\bonline\b", re.IGNORECASE), "অনলাইন"),
    (re.compile(r"\boffline\b", re.IGNORECASE), "অফলাইন"),
    (re.compile(r"\bportals?\b", re.IGNORECASE), "পৰ্টেল"),
    (re.compile(r"\bcourses?\b", re.IGNORECASE), "পাঠ্যক্ৰম"),
    (re.compile(r"\bsubjects?\b", re.IGNORECASE), "বিষয়"),
    (re.compile(r"\bforms?\b", re.IGNORECASE), "ফৰ্ম"),
    (re.compile(r"\bhelpdesks?|helplines?\b", re.IGNORECASE), "সহায়তা কেন্দ্ৰ"),

    # Statutory Bodies & Degrees
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
    (re.compile(r"\bIIT\b", re.IGNORECASE), "আই আই টি"),
    (re.compile(r"\bNIT\b", re.IGNORECASE), "এন আই টি"),
    (re.compile(r"\bB\.?A\.?\b", re.IGNORECASE), "বি এ"),
    (re.compile(r"\bM\.?A\.?\b", re.IGNORECASE), "এম এ"),
    (re.compile(r"\bB\.?Sc\.?\b", re.IGNORECASE), "বি এছ চি"),
    (re.compile(r"\bM\.?Sc\.?\b", re.IGNORECASE), "এম এছ চি"),
    (re.compile(r"\bB\.?Com\.?\b", re.IGNORECASE), "বি কম"),
    (re.compile(r"\bM\.?Com\.?\b", re.IGNORECASE), "এম কম"),
    (re.compile(r"\bB\.?Tech\.?\b", re.IGNORECASE), "বি টেক"),
    (re.compile(r"\bM\.?Tech\.?\b", re.IGNORECASE), "এম টেক"),
    (re.compile(r"\bB\.?Ed\.?\b", re.IGNORECASE), "বি এড"),
    (re.compile(r"\bMBA\b", re.IGNORECASE), "এম বি এ"),
    (re.compile(r"\bMCA\b", re.IGNORECASE), "এম চি এ"),
    (re.compile(r"\bBCA\b", re.IGNORECASE), "বি চি এ"),
]

# Romanized Assamese (Assinglish) phonetic markers
ROMANIZED_ASSAMESE_WORDS = {
    "aji", "kali", "kailoi", "ketiya", "kot", "ki", "kio", "kenekua", "kenekuwa", "kenedore", "keneka", "keneke",
    "moi", "mur", "muk", "tumi", "tumar", "apuni", "apunar", "apunak", "tai", "tar", "teu", "teur",
    "ami", "amar", "eitu", "heitu", "bhal", "kotha", "kothatu", "khobor", "asa", "asu",
    "ase", "asil", "asile", "nohoy", "hobo", "hoi", "hoise", "hoisil", "lagibo", "lage", "bisaru", "bisare", "bisarisilu",
    "bikhoye", "bikhoy", "kowa", "kobo", "koisu", "koisa", "koiba", "koba",
    "janibo", "janibole", "janu", "jana", "janisilu", "jam", "jabo", "jaba", "ahim", "ahibo", "ahiba", "ahiso",
    "dada", "baideu", "bhaity", "dhonnobad", "namaskar", "nomoskar", "kora", "korim", "korok",
    "korisa", "koribo", "korisu", "nokoribo", "nokorim", "ghrt", "ghor", "ghorot", "bhaat", "pani",
    "examor", "collegeot", "hostelor", "formtu", "admissionor", "noticetu", "resulttu", "marktu",
    "kun", "kiya", "korba", "aseki", "nhy"
}


class LanguageRouter:
    """
    Analyzes AI generated text to determine the primary language routing:
    - 'as': Routes strictly to Gemini TTS (handles pure Assamese, mixed Assamese-English, and Assinglish)
    - 'en': Routes strictly to GitHub Open-Source English TTS (edge-tts)
    """

    @classmethod
    def normalize_assamese_for_tts(cls, text: str) -> str:
        """
        Cleans and normalizes Assamese and Assamese-English text so the TTS voice engine
        speaks with natural, fluid pronunciation.
        Strips colons (:), commas (,), hyphens (-), and semicolons (;) so symbols are never read aloud.
        """
        if not text:
            return ""

        cleaned = text

        # 1. Strip Markdown links and raw URLs
        cleaned = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", cleaned)
        cleaned = re.sub(r"https?://\S+", "বিশ্ববিদ্যালয়ৰ ৱেবচাইটত", cleaned)
        cleaned = re.sub(r"www\.\S+", "ৱেবচাইটত", cleaned)
        cleaned = re.sub(r"\b[\w\.-]+@[\w\.-]+\.\w+\b", "ইমেইল যোগে", cleaned)

        # 2. Remove redundant English words in parentheses when Assamese precedes them
        # e.g. "ডিব্ৰুগড় বিশ্ববিদ্যালয় (Dibrugarh University)" -> "ডিব্ৰুগড় বিশ্ববিদ্যালয়"
        cleaned = re.sub(r"([\u0980-\u09FF]+)\s*\([a-zA-Z\s,.-]+\)", r"\1", cleaned)

        # 3. Convert percentage symbols to spoken Assamese ('শতাংশ')
        cleaned = re.sub(r"([\u0980-\u09FF\d]+)\s*%", r"\1 শতাংশ", cleaned)
        cleaned = cleaned.replace("%", " শতাংশ")

        # 4. Replace slashes with Assamese ' বা ' (or)
        cleaned = re.sub(r"\s*/\s*", " বা ", cleaned)

        # 5. Handle time expressions before removing colons (e.g. 10:30 -> 10 30)
        cleaned = re.sub(r"(\d+|[\u09E6-\u09EF]+):([0-5]\d)\b", r"\1 \2", cleaned)

        # 6. Handle range hyphens before stripping hyphens (e.g. ৫-১০ -> ৫ ৰ পৰা ১০)
        cleaned = re.sub(r"(\d+|[\u09E6-\u09EF]+)\s*[-–—]\s*(\d+|[\u09E6-\u09EF]+)", r"\1 ৰ পৰা \2", cleaned)

        # 7. Convert bullet markers and numbered list headings to clean pause points
        cleaned = re.sub(r"(?m)^\s*[-*•]\s+", "", cleaned)
        cleaned = re.sub(r"(?m)^(\s*)([0-9]+|[\u09E6-\u09EF]+)\.\s+", r"\1\2। ", cleaned)

        # 8. Expand English acronyms, university names, terms, and ordinals
        for pattern, replacement in ASSAMESE_PHONETIC_ACRONYMS:
            cleaned = pattern.sub(replacement, cleaned)

        # 9. Handle decimal numbers in Assamese (e.g. ৮৮.৫ -> ৮৮ দশমিক ৫)
        cleaned = re.sub(r"(\d+|[\u09E6-\u09EF]+)\.(\d+|[\u09E6-\u09EF]+)", r"\1 দশমিক \2", cleaned)

        # 10. Convert ASCII digits to Assamese numerals so Bakbak pronounces them natively
        cleaned = cleaned.translate(str.maketrans("0123456789", "০১২৩৪৫৬৭৮৯"))

        # 11. Convert English periods after Assamese words to Assamese Dari ('। ')
        cleaned = re.sub(r"([\u0980-\u09FF])\s*\.(?:\s+|$)", r"\1। ", cleaned)
        cleaned = re.sub(r"\.(?:\s+|$)", "। ", cleaned)

        # 12. Completely strip colon (:), comma (,), hyphen/dash (-), semicolon (;), and brackets
        for sym in [
            ":", ",", "-", "–", "—", ";", "_", "*", "#", "`", "~", "=",
            "<", ">", "{", "}", "[", "]", "(", ")", "|", "^", "\\",
            "\"", "“", "”", "‘", "’"
        ]:
            cleaned = cleaned.replace(sym, " ")

        # 13. Normalize consecutive punctuation and spacing
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
    def classify_text_for_tts(cls, text: str, hint: str = None) -> Tuple[str, str, float]:
        """
        Classifies speech text into 3 distinct engines:
        1. 'english'          -> Pure English text                                   -> GitHub English TTS (edge-tts)
        2. 'assamese_english'  -> English + Assamese (code-mixed / Romanized Assamese) -> Google Gemini TTS
        3. 'pure_assamese'     -> Pure Assamese Unicode text                          -> Bakbak Assamese TTS

        Returns:
            (category, primary_lang, confidence)
        """
        if not text or not text.strip():
            return "english", "en", 1.0

        normalized_hint = (hint or "").strip().lower()

        # Explicit routing hints
        if normalized_hint in ("pure_assamese", "bakbak", "as_pure"):
            return "pure_assamese", "as", 1.0

        if normalized_hint in ("assamese_english", "as_en", "en_as", "mixed", "codemix", "as_roman", "assinglish", "gemini", "gemini_tts"):
            return "assamese_english", "as", 1.0

        if normalized_hint in ("github", "edge", "en_pure"):
            return "english", "en", 1.0

        clean = cls.clean_text_for_speech(text)
        as_chars = len(ASSAMESE_UNICODE_PATTERN.findall(clean))
        latin_words = [w for w in re.findall(r"[a-zA-Z]{2,}", clean)]

        # 1. If text contains Assamese Unicode characters
        if as_chars >= 2:
            # Check if there are English words mixed in after phonetic normalization
            norm_text = cls.normalize_assamese_for_tts(clean)
            remaining_latin_words = [w for w in re.findall(r"[a-zA-Z]{2,}", norm_text)]
            if len(remaining_latin_words) == 0:
                # Pure Assamese -> Bakbak TTS
                return "pure_assamese", "as", 1.0

            # English + Assamese mixed speech -> Gemini TTS
            return "assamese_english", "as", 0.98

        # 2. If no Assamese Unicode characters, check for Romanized Assamese (Assinglish) keywords
        words = clean.lower().split()
        if words:
            clean_words = [re.sub(r"[^a-z]", "", w) for w in words]
            as_word_hits = sum(1 for w in clean_words if w in ROMANIZED_ASSAMESE_WORDS)
            hit_ratio = as_word_hits / max(1, len(words))
            if as_word_hits >= 2 or (len(words) <= 5 and as_word_hits >= 1) or hit_ratio >= 0.15:
                # Romanized Assamese (Latin script with Assamese vocabulary) -> Gemini TTS
                return "assamese_english", "as", 0.92

        # 3. Pure English -> GitHub English TTS
        return "english", "en", 1.0

    @classmethod
    def detect_primary_language(cls, text: str, hint: str = None) -> Tuple[str, float]:
        """
        Detects primary language code: 'as' or 'en'.
        """
        _, lang, conf = cls.classify_text_for_tts(text, hint)
        return lang, conf


language_router = LanguageRouter()
