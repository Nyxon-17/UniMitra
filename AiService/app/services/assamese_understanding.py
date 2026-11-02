"""
Assamese-English Input Understanding Layer (UniMitra AI)
Specifically designed to recognize, normalize, and interpret Romanized Assamese,
informal chat spellings, abbreviations, and mixed Assamese-English conversational typing
WITHOUT altering the existing AI response-generation engine.
"""

import re
from typing import Dict, List, Optional, Set, Tuple


# =============================================================================
# 1. EXPANDED ROMANIZED ASSAMESE VOCABULARY & ABBREVIATION MAP
# =============================================================================

# Common informal typing abbreviations and phonetic spelling variations mapped to canonical Romanized Assamese
ABBREVIATION_MAP: Dict[str, str] = {
    # Pronouns & People
    "tmi": "tumi",
    "apni": "apuni",
    "da": "dada",
    "ba": "baideu",
    "bhai": "bhaity",
    "kwn": "kun",
    # Question words
    "kty": "ketiya",
    "kt": "kot",
    "knk": "kenekoi",
    "knke": "kenekoi",
    "knka": "keneka",
    "kio": "kio",
    "kyon": "kio",
    "kba": "kiba",
    # Locations & Nouns
    "ghrt": "ghorot",
    "ghor": "ghor",
    "ghr": "ghor",
    "colg": "college",
    "univ": "university",
    "prha": "porha",
    "somoy": "homoy",
    # Verbs & Auxiliary
    "vl": "bhal",
    "vhl": "bhal",
    "ety": "etiya",
    "khbr": "khobor",
    "hbo": "hobo",
    "nhy": "nohoy",
    "ny": "nai",
    "asl": "asil",
    "aslo": "asilo",
    "lgbo": "lagibo",
    "lgb": "lagibo",
    "krsu": "korisu",
    "krsa": "korisa",
    "krm": "korim",
    "bujisu": "bujisu",
    "bujilu": "bujilu",
    "thx": "dhonnobad",
    "pls": "onugroh",
}

# Extensive Romanized Assamese lexicon
ROMANIZED_ASSAMESE_LEXICON: Set[str] = set([
    # Pronouns
    "moi", "mur", "muk", "mok", "amie", "ami", "amar", "amuk",
    "tumi", "tumar", "tuk", "tote", "toi", "tor",
    "apuni", "apunar", "apunak", "apunaluk", "apunalukor",
    "he", "tai", "teu", "teuk", "teur", "hehot", "hehote", "hehotor",
    "kun", "kune", "kunkhun", "kunba", "kuntu", "kunta",
    "ki", "kio", "kioba", "koba", "kiba", "kibata", "kiojanu",
    "kot", "kote", "kotba", "kotuba",
    "ketiya", "ketiyaba", "ketiyar", "kailoi",
    "kenekua", "kenekuwa", "kenedore", "kenekoi", "keneka", "keneke",
    "kiman", "kimanta", "kimankhini",
    # Demonstratives
    "ei", "eitu", "eibur", "eia", "hei", "heitu", "heibur", "heia",
    "eta", "duita", "tinta", "saari", "paas",
    # Verbs (Be / Exist / Negation)
    "ase", "asa", "asu", "asila", "asilo", "asil", "asise", "asiso", "asene", "asane",
    "nai", "nohoy", "nahoi", "ne", "naha", "nobo", "najanu",
    "hobo", "hoi", "hol", "hola", "hole", "hoise", "hua", "huwa", "hobone",
    # Action Verbs
    "kora", "kore", "korim", "korisa", "korisu", "kori", "koribo", "korisila", "korile", "koru",
    "bonai", "bonau", "bonabo", "bonaba", "bonaisu", "banai", "banaise", "bonalu",
    "jao", "jau", "jaba", "jam", "gole", "gol", "goise", "gosil", "gosilo", "jabo", "juwa",
    "aha", "ahe", "ahibo", "aisu", "ahilu", "ahile", "ahise", "ahiba",
    "kuwa", "kua", "kobo", "koise", "koi", "kolu", "kole", "koba",
    "de", "diya", "dibo", "dilu", "dile", "dise", "diba",
    "loa", "lobo", "lolu", "lole", "loise", "loba",
    "pam", "paba", "pale", "paisu", "paiso", "pabo", "pua", "paise",
    "parim", "pariba", "pare", "paru", "para", "parile", "nuwarim", "nuwaru",
    "sau", "soa", "saise", "sabo", "salu", "sale", "saba",
    "jana", "janu", "jane", "janibo", "janilu", "janisa", "janiba",
    "buji", "bujisu", "bujisa", "bujibo", "bujilu", "bujise", "bujua",
    "porha", "porhu", "porhe", "porhibo", "porhisa", "porhisu", "porhile",
    "likha", "likhu", "likhe", "likhibo", "likhisa", "likhisu",
    "khua", "khau", "khabo", "khaise", "khalu", "khaba",
    "bisaru", "bisare", "bisara", "bisaribo", "bisarisu",
    "lagibo", "lage", "lagisil", "lagene", "lagibone",
    "thaka", "thaku", "thake", "thakibo", "thakisa", "thakisu", "thakile",
    # Common Nouns & Adjectives
    "ghor", "ghorot", "ghorote", "ghoroloi",
    "bhal", "bhalo", "bhalne", "beya",
    "kotha", "khobor", "homoy", "somoy", "manuh",
    "dada", "baideu", "bhaity", "ma", "deuta", "bondhu",
    "dhonnobad", "namaskar", "nomoskar", "pronam",
    "aji", "kali", "porohi", "etiya", "pisot", "pasot", "agote",
    "gao", "gaon", "shohor", "nohor", "rasta",
    "paani", "gaakheer", "saah", "chai", "saani", "bhaat",
    "bohi", "kitap", "kolom", "routine",
    "axomiya", "asomiya", "asom", "assam", "sosa", "misa"
])

# Multi-word Romanized Assamese trigger phrases
ROMANIZED_PHRASES: List[str] = [
    "tumi kun", "kun hoi", "kun tumi", "apuni kun", "tumi kenekua", "kenekua asa",
    "bhal asu", "bhal ne", "ki khobor", "ki kori asa", "ki kori aso", "ki korisa",
    "coffee kenekoi", "kenekoi bonai", "kenedore bonai", "keneka bonai", "bonabo bisaru",
    "ghrt e asu", "ghorot asu", "ghorote asu", "college jam", "ghoroloi jam",
    "mur exam", "kali ase", "aji ase", "ketiya hobo", "buji pua nai", "buji napalu",
    "buji pua", "bujisu moi", "pass mark", "minimum marks", "admission ketiya",
    "form fillup", "fee kiman", "result ketiya", "help kora", "muk kuwa",
    "mok kuwa", "jana ase", "lagibo ne", "in assamese", "in axomiya", "in asomiya"
]


# =============================================================================
# 2. INTENT PATTERNS & TRANSLATION GLOSSES FOR HIGH-PRECISION UNDERSTANDING
# =============================================================================

INTENT_RULES: List[Dict[str, any]] = [
    # 1. Identity inquiry: "Tumi kun hoi?" / "Apuni kun?"
    {
        "pattern": r"\b(tumi|apuni|toi)\s+(kun|kwn|kunba)\s*(hoi|hoii|ne)?\b|\b(kun|kwn)\s+(tumi|apuni|hoi)\b",
        "as_meaning": "তুমি কোন হয়? (আপুনি কোন?)",
        "en_intent": "User is asking who you are / asking for your identity.",
        "search_keywords": ["unimitra", "identity", "about"]
    },
    # 2. Recipe / How-to: "Coffee kenekoi bonai?"
    {
        "pattern": r"\b([a-zA-Z]+)\s+(kenekoi|kenedore|keneka|keneke|knk)\s+(bonai|banai|kore|bonabo|kora hoi)\b",
        "as_meaning": "কফি বা খাদ্য কেনেকৈ বনাই?",
        "en_intent": "User is asking for preparation steps / recipe on how to make something.",
        "search_keywords": ["recipe", "preparation", "how to make"]
    },
    # 3. Location / Home statement: "Aji ghrt e asu."
    {
        "pattern": r"\b(aji|kali|etiya)?\s*(ghrt|ghorot|ghorote|ghor)\s*(e)?\s*(asu|asa|ase|asilo)\b",
        "as_meaning": "আজি ঘৰতে আছোঁ।",
        "en_intent": "User is stating they are currently at home.",
        "search_keywords": ["home", "residence"]
    },
    # 4. Movement / Going to college: "Moi college jam."
    {
        "pattern": r"\b(moi|ami)\s+([a-zA-Z]+)\s*(ot|oloi)?\s*(jam|jau|jabo|ahim)\b",
        "as_meaning": "মই কলেজ বা নিৰ্দিষ্ট স্থানলৈ যাম।",
        "en_intent": "User is stating their intention to go to a location (jam = will go).",
        "search_keywords": ["college", "schedule", "classes"]
    },
    # 5. Activity inquiry: "Tumi ki kori asa?"
    {
        "pattern": r"\b(tumi|apuni)\s+(ki|kiba)\s+(kori|korisa|korisu|kora)\s*(asa|aso|ne)?\b",
        "as_meaning": "তুমি কি কৰি আছা?",
        "en_intent": "User is asking what you are doing right now.",
        "search_keywords": ["activity", "current status"]
    },
    # 6. Exam / Schedule statement: "Mur exam kali ase."
    {
        "pattern": r"\b(mur|amar)\s+(exam|porikha|class|test)\s+(kali|aji|ketiya|somoyot|ahibor)\s*(ase|hobo|asil)\b",
        "as_meaning": "মোৰ পৰীক্ষা কাইলৈ বা সোনকালে আছে।",
        "en_intent": "User is mentioning that their exam or class is scheduled for tomorrow/today.",
        "search_keywords": ["exam", "examination", "schedule"]
    },
    # 7. Comprehension status: "Moi buji pua nai." / "Buji napalu."
    {
        "pattern": r"\b(moi|ami)?\s*(buji|bujibo|buzi)\s*(pua|paisu|paise)?\s*(nai|noarilu|parise|ny)\b|\bbuji\s*napalu\b",
        "as_meaning": "মই বুজি পোৱা নাই / বুজি পালোঁ।",
        "en_intent": "User is stating that they did not understand (or understood) the explanation.",
        "search_keywords": ["clarification", "explanation", "understand"]
    },
    # 8. Passing criteria inquiry: "Pass mark kiman lagibo?"
    {
        "pattern": r"\b(pass|passing|uttirno)\s*(mark|marks|nombor)?\s*(kiman|kiba)?\s*(lagibo|lage|hobo)\b",
        "as_meaning": "পৰীক্ষাত উত্তীৰ্ণ হ'বলৈ নূন্যতম নম্বৰ কিমান লাগিব?",
        "en_intent": "User is asking about minimum passing marks / passing criteria.",
        "search_keywords": ["minimum passing marks", "40%", "examination ordinance"]
    },
    # 9. Attendance & Medical condonation: "Attendance kiman lagibo?"
    {
        "pattern": r"\b(attendance|uposthiti|medical)\s*(kiman|lagibo|shortage|condonation)?\b",
        "as_meaning": "শ্ৰেণী উপস্থিতি আৰু মেডিকেল ৰেহাইৰ নিয়ম কি?",
        "en_intent": "User is asking about mandatory 75% attendance and medical condonation.",
        "search_keywords": ["attendance", "75%", "medical condonation", "65%"]
    },
    # 10. Re-evaluation process & fee: "Re evaluation kenekoi kore?"
    {
        "pattern": r"\b(re[\s-]?evaluation|reevaluation|scrutiny|punorikhyon)\b",
        "as_meaning": "উত্তৰবহী পুনৰীক্ষণ (Re-evaluation) আৰু মাচুলৰ নিয়ম কি?",
        "en_intent": "User is asking about answer script re-evaluation procedure and fee (Rs. 350).",
        "search_keywords": ["re-evaluation", "scrutiny", "350", "20 days"]
    },
    # 11. Well-being inquiry: "Tumi kenekua asa?" / "Bhal ne?"
    {
        "pattern": r"\b(kenekua|kenekuwa|keneka)\s*(asa|aso|ne)\b|\b(bhal)\s*(ne|asu|asa)\b|\bki\s*khobor\b",
        "as_meaning": "তুমি কেনেকুৱা আছা? ভালনে?",
        "en_intent": "User is asking how you are doing / casual friendly greeting.",
        "search_keywords": ["greeting", "how are you"]
    }
]


# =============================================================================
# 3. INPUT UNDERSTANDING LAYER ENGINE
# =============================================================================

class AssameseUnderstandingResult:
    def __init__(
        self,
        raw_query: str,
        normalized_query: str,
        language_mode: str,
        is_romanized: bool,
        assamese_meaning: Optional[str] = None,
        english_intent: Optional[str] = None,
        search_keywords: Optional[List[str]] = None,
        context_hint: str = ""
    ):
        self.raw_query = raw_query
        self.normalized_query = normalized_query
        self.language_mode = language_mode
        self.is_romanized = is_romanized
        self.assamese_meaning = assamese_meaning or ""
        self.english_intent = english_intent or ""
        self.search_keywords = search_keywords or []
        self.context_hint = context_hint

    def to_dict(self) -> Dict[str, any]:
        return {
            "raw_query": self.raw_query,
            "normalized_query": self.normalized_query,
            "language_mode": self.language_mode,
            "is_romanized": self.is_romanized,
            "assamese_meaning": self.assamese_meaning,
            "english_intent": self.english_intent,
            "search_keywords": self.search_keywords,
            "context_hint": self.context_hint,
        }


class AssameseUnderstandingLayer:
    @staticmethod
    def expand_abbreviations(text: str) -> str:
        """
        Normalizes chat abbreviations, informal spellings, and common typing variations
        into standard Romanized Assamese tokens.
        Example: 'Aji ghrt e asu' -> 'Aji ghorote asu'
        """
        if not text:
            return text

        # Handle attached postfixes like 'ghrt e' or 'ghrte'
        normalized = re.sub(r'\bghrt\s*e\b', 'ghorote', text, flags=re.IGNORECASE)
        normalized = re.sub(r'\bghrte\b', 'ghorote', normalized, flags=re.IGNORECASE)

        tokens = normalized.split()
        expanded_tokens = []

        for token in tokens:
            # Preserve punctuation on ends
            prefix = ""
            suffix = ""
            core = token

            m_pref = re.match(r'^([^a-zA-Z0-9]+)(.*)$', core)
            if m_pref:
                prefix = m_pref.group(1)
                core = m_pref.group(2)

            m_suff = re.match(r'^(.*?)([^a-zA-Z0-9]+)$', core)
            if m_suff:
                core = m_suff.group(1)
                suffix = m_suff.group(2)

            core_lower = core.lower()
            if core_lower in ABBREVIATION_MAP:
                # Match capitalization
                rep = ABBREVIATION_MAP[core_lower]
                if core.istitle():
                    rep = rep.capitalize()
                elif core.isupper() and len(core) > 1:
                    rep = rep.upper()
                expanded_tokens.append(f"{prefix}{rep}{suffix}")
            else:
                expanded_tokens.append(token)

        return " ".join(expanded_tokens)

    @classmethod
    def detect_language(cls, text: str, requested_lang: str = "en") -> Tuple[str, bool]:
        """
        Accurately identifies if the input is Assamese Unicode Script, Romanized Assamese, or English.
        Returns: (language_mode, is_romanized)
        """
        if not text:
            mode = "as_script" if requested_lang in ("as", "as_script") else "en"
            return mode, mode == "as_roman"

        # 1. Assamese Unicode Script Check
        if any("\u0980" <= c <= "\u09ff" for c in text):
            return "as_script", False

        lower = text.lower()
        if "assamese script" in lower or "in assamese script" in lower or "অসমীয়া লিপি" in lower:
            return "as_script", False

        # 2. Check Romanized Phrases
        for p in ROMANIZED_PHRASES:
            if p in lower:
                return "as_roman", True

        # 3. Check Words against Lexicon & Expanded tokens
        words = re.findall(r'[a-zA-Z]+', lower)
        if not words:
            return "en", False

        # Normalize words through abbreviation map
        expanded_words = [ABBREVIATION_MAP.get(w, w) for w in words]
        assamese_matches = sum(1 for w in expanded_words if w in ROMANIZED_ASSAMESE_LEXICON)

        # High sensitivity detection for Romanized Assamese
        total_words = len(words)
        if assamese_matches >= 1:
            if (
                assamese_matches >= 2 or
                total_words <= 3 or
                (assamese_matches / total_words) >= 0.2
            ):
                return "as_roman", True

        if requested_lang == "as_roman":
            return "as_roman", True
        if requested_lang in ("as", "as_script"):
            return "as_script", False

        return "en", False

    @classmethod
    def interpret_query(
        cls,
        query: str,
        requested_lang: str = "en"
    ) -> AssameseUnderstandingResult:
        """
        Processes the raw query through the Assamese-English understanding layer:
        1. Expands abbreviations and slang.
        2. Detects exact language mode (as_roman, as_script, en).
        3. Identifies underlying Assamese intent and context.
        4. Synthesizes a non-intrusive Context Hint for the LLM.
        """
        cleaned_text = (query or "").strip()
        normalized_query = cls.expand_abbreviations(cleaned_text)
        language_mode, is_romanized = cls.detect_language(normalized_query, requested_lang)

        assamese_meaning = ""
        english_intent = ""
        search_keywords: List[str] = []

        norm_lower = normalized_query.lower()

        # Check intent rules
        for rule in INTENT_RULES:
            if re.search(rule["pattern"], norm_lower, flags=re.IGNORECASE):
                assamese_meaning = rule["as_meaning"]
                english_intent = rule["en_intent"]
                search_keywords = list(rule.get("search_keywords", []))
                break

        # Fallback interpretation if no specific rule matched but recognized as Romanized Assamese
        if is_romanized and not assamese_meaning:
            assamese_meaning = "ব্যৱহাৰকাৰীয়ে ৰোমানাইজড অসমীয়াত (ইংৰাজী আখৰেৰে) বাৰ্তালাপ কৰিছে।"
            english_intent = "User message is written in Romanized Assamese (conversational phrasing in Latin letters)."

        # Build context hint for internal model guidance
        context_hint = ""
        if is_romanized:
            parts = []
            if assamese_meaning:
                parts.append(f"Understood Assamese Context: {assamese_meaning}")
            if english_intent:
                parts.append(f"Intent: {english_intent}")
            context_hint = " | ".join(parts)

        return AssameseUnderstandingResult(
            raw_query=cleaned_text,
            normalized_query=normalized_query,
            language_mode=language_mode,
            is_romanized=is_romanized,
            assamese_meaning=assamese_meaning,
            english_intent=english_intent,
            search_keywords=search_keywords,
            context_hint=context_hint
        )


assamese_understanding = AssameseUnderstandingLayer()
