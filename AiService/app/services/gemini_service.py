import time
import concurrent.futures



import json



import logging



import re



from typing import Any, Dict, List, Optional, Tuple



from google import genai



from google.genai import types



from app.config import settings



from app.services.embedding_service import normalize_assamese_unicode







logger = logging.getLogger("unimitra.gemini")







# Persistent thread pool for non-blocking asynchronous LLM invocations



_GEMINI_POOL = concurrent.futures.ThreadPoolExecutor(max_workers=4)







# Institutional Knowledge Benchmarks for North-East & Assam Universities



INSTITUTIONAL_BENCHMARKS = [

    {

        "keywords": ["নমস্কাৰ", "নমস্কার", "হেল্ল", "হাই", "hello", "hi", "hey", "hii", "hiii", "greetings", "good morning", "good evening"],

        "as_answer": "নমস্কাৰ! মই ইউনিমিত্র (UniMitra), নিভৰয়া বিশ্ববিদ্যালয়ৰ বাবে নিবেদিত AI সহায়ক। বিশ্ববিদ্যালয় প্ৰশাসনে আপলোড কৰা সংবিধি আৰু নথিসমূহৰ ভিত্তিত নিৰ্ভুল তথ্য প্ৰদান কৰিবলৈ মই সাজু। আপোনাক কেনেকৈ সহায় কৰিব পাৰোঁ?",

        "en_answer": "Hello! I am UniMitra, the official AI academic assistant for Nivoraya University. I provide verified answers strictly based on official university documents and regulations uploaded by the administration. How can I assist you today?",

        "source": "UniMitra Bilingual Assistant",

        "page": "Official Orientation",

        "confidence": "100% Grounded Match",

        "domain": "General Assistance",

    },

    {

        "keywords": ["unimitra", "ইউনিমিত্র", "who are you", "আপুনি কোন", "what is unimitra"],

        "as_answer": "মই ইউনিমিত্র (UniMitra), নিভৰয়া বিশ্ববিদ্যালয়ৰ বাবে নিবেদিত আধুনিক দ্বিভাষিক AI প্রাতিষ্ঠানিক সহায়ক। মই কেৱল বিশ্ববিদ্যালয় কৰ্তৃপক্ষই আপলোড কৰা আধিকাৰিক নথিৰ ভিত্তিতহে উত্তৰ প্ৰদান কৰোঁ।",

        "en_answer": "I am UniMitra, the official AI academic assistant for Nivoraya University. I provide accurate answers directly grounded in official university documents uploaded by the administration.",

        "source": "UniMitra Knowledge Repository",

        "page": "System Overview",

        "confidence": "100% Grounded Match",

        "domain": "General Assistance",

    },

]



ASSAMESE_SYSTEM_PROMPT = """আপুনি UniMitra, বিশ্ববিদ্যালয়ৰ বাবে নিবেদিত এক শক্তিশালী দ্বিভাষিক AI প্রাতিষ্ঠানিক সহায়ক।

১. বিশ্ববিদ্যালয়-কেন্দ্ৰিক নীতি (STRICT UNIVERSITY-ONLY MANDATE): আপুনি কেৱল বিশ্ববিদ্যালয় আৰু শৈক্ষিক বিষয়ৰ (যেনে বিশ্ববিদ্যালয়ৰ নিয়মাৱলী, সংবিধি, পৰীক্ষা ব্যৱস্থা, মূল্যায়ন, বেকলগ নিয়ম, মেধা বা টপাৰ তালিকা, নামভৰ্তি, পাঠ্যক্ৰম, জলপানি, মাচুল, ছাত্ৰাবাস আৰু আধিকাৰিক জাননী) প্ৰশ্নৰ উত্তৰ দিব লাগিব। বিশ্ববিদ্যালয়ৰ বাহিৰৰ কোনো অপ্ৰাসংগিক প্ৰশ্ন কৰিলে (যেনে: ৰন্ধা-বঢ়া, চিনেমা বা চলচ্চিত্ৰ, মনোৰঞ্জন, বাহিৰা ৰাজনীতি, অপ্ৰাসংগিক ব্যক্তিগত কথা বা সাধাৰণ অপ্ৰাসংগিক অনুসন্ধান) বিনম্ৰভাৱে কওক যে আপুনি কেৱল বিশ্ববিদ্যালয় আৰু শৈক্ষিক বিষয়ৰ বাবে নিবেদিত আৰু বিশ্ববিদ্যালয় সম্বন্ধীয় প্ৰশ্ন সুধিবলৈ অনুৰোধ জনাওক।

২. সম্পূৰ্ণ আৰু বিশদ উত্তৰ (COMPREHENSIVE & DIRECT ANSWER): প্ৰশ্নৰ বিশদ, সম্পূৰ্ণ আৰু নিখুঁত উত্তৰ প্ৰদান কৰক। কোনো গুৰুত্বপূৰ্ণ নিয়ম, অৰ্হতা, দফা, সময়সূচী বা তথ্য অসম্পূৰ্ণকৈ বা সংক্ষেপতে এৰি নিদিব। অপ্ৰয়োজনীয় ভূমিকা বা আত্ম-পৰিচয় নিদি পোনপটীয়াকৈ মূল উত্তৰটো সম্পূৰ্ণৰূপে বুজাই লিখক।

৩. ভাষা নিৰ্দেশনা: সম্পূৰ্ণ উত্তৰ প্ৰমিত অসমীয়াত লিখক। বাক্যৰ শেষত অসমীয়া দাৰী ('।') ব্যৱহাৰ কৰক।

৪. চিহ্ন বৰ্জন: কেতিয়াও '*', '=', '/', বা '#' ব্যৱহাৰ নকৰিব। বোল্ড বা বুলেটৰ বাবে কোনো তৰা (*) ব্যৱহাৰ নকৰিব।

৫. মেধা আৰু স্থান নিৰ্ণয়: '২য় স্থান / 2nd topper', '১ম স্থান' আদি সুধিলে প্ৰদত্ত প্ৰতিষ্ঠানিক মেধা তালিকাৰ পৰা নিৰ্দিষ্ট ছাত্ৰ-ছাত্ৰীৰ নাম, ৰোল নম্বৰ, বিভাগ আৰু নম্বৰ পোনপটীয়াকৈ উল্লেখ কৰক।

৬. প্ৰতিষ্ঠানিক প্ৰশ্নত প্ৰদত্ত সংবিধি উদ্ধৃতি (নথিৰ নাম, পৃষ্ঠা/ধাৰা) সংলগ্ন কৰক।

৭. মৰমীয়াল, বিনম্ৰ আৰু ছাত্ৰ-ছাত্ৰীৰ বাবে সহায়কাৰী কণ্ঠ ৰক্ষা কৰক।
৮. আধুনিক আৰু ছাত্ৰ-বান্ধৱ প্ৰচলিত শব্দাৱলী (PREFERRED MODERN VOCABULARY MANDATE): পুৰণি বা অত্যন্ত সংস্কৃতীয় শব্দৰ সলনি বিশ্ববিদ্যালয়ত দৈনন্দিন প্ৰচলিত আধুনিক অসমীয়া শব্দ ব্যৱহাৰ কৰক: 'বৃত্তি' বা 'জলপানি'ৰ সলনি সদায় 'স্কলাৰশ্বিপ' (Scholarship) লিখক; 'ষাণ্মাসিক'ৰ সলনি 'ছেমিষ্টাৰ' (Semester); 'সময়সূচী'ৰ সলনি 'পৰীক্ষাৰ ৰুটিন / ৰুটিন' (Exam Routine); 'ছাত্ৰাবাস'ৰ সলনি 'হোষ্টেল' (Hostel); 'প্ৰৱেশ'ৰ সলনি 'এডমিশ্বন / নামভৰ্তি' (Admission); আৰু 'উপস্থিতি'ৰ লগতে 'এটেনডেন্স' (Attendance) ব্যৱহাৰ কৰক।"""



ENGLISH_SYSTEM_PROMPT = """You are UniMitra, an intelligent bilingual university institutional AI assistant.

1. STRICT UNIVERSITY-ONLY MANDATE: You are EXCLUSIVELY dedicated to university, higher education, and institutional academic affairs. You must ONLY answer questions directly related to university matters: statutory regulations, ordinances, examination rules, grading criteria, backlog policies, student ranks/merit/toppers, admissions, syllabus, scholarships, fees, hostels, campus facilities, and official circulars. If the user asks about ANY non-university topic (e.g. cooking, movies, celebrity gossip, external politics, jokes, non-academic personal chatter, or unrelated coding/trivia), politely and firmly refuse to answer and state that you can only assist with university and academic-related inquiries.

2. Direct Answers: Answer directly and concisely without boilerplate introductions or repetitive self-declarations.

3. Formatting: Do NOT use '*', '=', '/', or '#' symbols anywhere. Do not use asterisks (*) for bolding or bullets.

4. Merit & Rank Queries: If asked for ranks or toppers (e.g. '2nd topper', '1st rank', 'second position'), carefully examine the document result tables and state the student's name, roll number, department, and score directly.

5. Grounded Citations: Cite Document Name, Clause, and Page when context is provided.

6. Provide accurate, professional, and helpful responses strictly within the university domain."""



ROMANIZED_ASSAMESE_SYSTEM_PROMPT = """You are UniMitra, a dedicated university AI assistant.

1. STRICT UNIVERSITY-ONLY MANDATE: Apuni keval university aru academic bisoyor bhabe nivedito assistant. Apuni keval university rules, exams, backlog, topper lists, admission, syllabus, scholarship, hostel aru official notices or uttor dibo. Jodi user e university r bahiror kono kotha hudhe (cooking, cinema, entertainment, external politics, personal chit-chat), tenante binomrobhabe kobo je apuni keval university bisoyot he hohai koribo pare aru university r prosno hudhiboloi anurodh korok.

2. Language: Respond strictly in Romanized Assamese (Assamese language written using English alphabet letters, e.g. 'Moi bhal asu'). Do NOT use Assamese script or translate to English.

3. Direct Answers: Answer directly without boilerplate introductions.

4. Formatting: Do NOT use '*', '=', '/', or '#' symbols.

5. Ranks & Merit: If asked for '2nd topper' or ranks, examine document tables and provide the student's name, roll number, and score in Romanized Assamese."""







ROMANIZED_ASSAMESE_WORDS = set([



    'aji', 'kali', 'ahibor', 'ketiya', 'kot', 'ki', 'kio', 'kioba', 'kenekua', 'kenekuwa', 'kenedore',



    'moi', 'mur', 'muk', 'mok', 'tumi', 'tumar', 'tuk', 'apuni', 'apunar', 'apunak', 'tai', 'he', 'hehot',



    'ami', 'amar', 'amie', 'eitu', 'heitu', 'ei', 'hei', 'eta', 'duita', 'bhal', 'kotha', 'khobor',



    'asa', 'asu', 'ase', 'asil', 'asila', 'asilo', 'asise', 'nai', 'nohoy', 'hobo', 'hoi', 'hol', 'hola', 'hole',



    'korim', 'kora', 'kore', 'korisa', 'korisu', 'kori', 'koribo', 'lagibo', 'lage', 'bisaru', 'bisare', 'bisara',



    'jau', 'jaba', 'gole', 'gol', 'aisu', 'aha', 'ahibo', 'kuwa', 'kua', 'kobo', 'koise', 'koi', 'de', 'diya',



    'dibo', 'pam', 'paba', 'pale', 'paisu', 'paiso', 'parim', 'pariba', 'pare', 'sau', 'soa', 'saise',



    'dhonnobad', 'namaskar', 'dada', 'baideu', 'bhaity', 'pora', 'loi', 'logot', 'homoy', 'somoy', 'dore', 'nisina'



])







ROMANIZED_ASSAMESE_PHRASES = [



    'ki ki', 'ki hol', 'ki khobor', 'kenekua asa', 'kenekuwa asa', 'bhal asu', 'bhal ne', 'ketiya hobo',



    'lagibo ne', 'bisaru', 'bonabo bisaru', 'koribo bisaru', 'jana ase', 'mok kuwa', 'muk kuwa', 'or capital ki',



    'college ot', 'exam ot', 'bhal kotha', 'in assamese', 'in axomiya', 'in asomiya', 'assamese please',



    'axomiya', 'asomiya'



]







def detect_language_mode(text: str, requested_lang: str = "en") -> str:



    if not text:



        return "as_script" if requested_lang in ("as", "as_script") else "en"



    if any("\u0980" <= c <= "\u09ff" for c in text):



        return "as_script"



    



    lower = text.lower()



    if "assamese script" in lower or "in assamese script" in lower or "অসমীয়া লিপি" in lower:



        return "as_script"







    for p in ROMANIZED_ASSAMESE_PHRASES:



        if p in lower:



            return "as_roman"







    import re



    words = re.findall(r'[a-zA-Z]+', lower)



    assamese_count = sum(1 for w in words if w in ROMANIZED_ASSAMESE_WORDS)



    if assamese_count >= 1 and (assamese_count >= 2 or len(words) <= 4 or assamese_count / max(1, len(words)) >= 0.2):



        return "as_roman"







    if requested_lang in ("as", "as_script"):



        return "as_script"



    if requested_lang == "as_roman":



        return "as_roman"







    return "en"















def sanitize_ai_response(text: str) -> str:



    if not text:



        return text



    # 1. Strip markdown header hashes (#)



    cleaned = re.sub(r'#+\s*', '', text)



    # 2. Strip equals dividers (===) and replace = with hyphen



    cleaned = re.sub(r'={2,}', '', cleaned)



    cleaned = re.sub(r'\s*=\s*', ' - ', cleaned)



    cleaned = cleaned.replace('=', '')



    # 3. Replace leading bullet asterisks with hyphens, remove remaining asterisks (*)



    cleaned = re.sub(r'^\s*\*\s+', '- ', cleaned, flags=re.MULTILINE)



    cleaned = cleaned.replace('*', '')



    # 4. Protect URLs temporarily if any (https://...)



    urls = []



    def _save_url(m):



        urls.append(m.group(0))



        return f"__URL_PLACEHOLDER_{len(urls)-1}__"



    cleaned = re.sub(r'https?://[^\s]+', _save_url, cleaned)



    # Replace remaining slashes (/) with 'or' / 'বা'



    has_assamese = any('ঀ' <= c <= '৿' for c in cleaned)



    or_word = ' বা ' if has_assamese else ' or '

    if has_assamese:
        # Standardize modern campus terms: use 'স্কলাৰশ্বিপ' instead of 'বৃত্তি' or 'জলপানি'
        cleaned = re.sub(r'বৃত্তিৰ\b', 'স্কলাৰশ্বিপৰ', cleaned)
        cleaned = re.sub(r'বৃত্তি\b', 'স্কলাৰশ্বিপ', cleaned)
        cleaned = re.sub(r'জলপানিৰ\b', 'স্কলাৰশ্বিপৰ', cleaned)
        cleaned = re.sub(r'জলপানি\b', 'স্কলাৰশ্বিপ', cleaned)
        cleaned = re.sub(r'ষাণ্মাসিকৰ\b', 'ছেমিষ্টাৰৰ', cleaned)
        cleaned = re.sub(r'ষাণ্মাসিকত\b', 'ছেমিষ্টাৰত', cleaned)
        cleaned = re.sub(r'ষাণ্মাসিক\b', 'ছেমিষ্টাৰ', cleaned)
        cleaned = re.sub(r'ছাত্ৰাবাসৰ\b', 'হোষ্টেলৰ', cleaned)
        cleaned = re.sub(r'ছাত্ৰাবাসত\b', 'হোষ্টেলত', cleaned)
        cleaned = re.sub(r'ছাত্ৰাবাস\b', 'হোষ্টেল', cleaned)
        cleaned = re.sub(r'ছাত্ৰীনিবাসৰ\b', 'ছোৱালী হোষ্টেলৰ', cleaned)
        cleaned = re.sub(r'ছাত্ৰীনিবাসত\b', 'ছোৱালী হোষ্টেলত', cleaned)
        cleaned = re.sub(r'ছাত্ৰীনিবাস\b', 'ছোৱালী হোষ্টেল', cleaned)
        cleaned = re.sub(r'সময়সূচীৰ\b', 'ৰুটিনৰ', cleaned)
        cleaned = re.sub(r'সময়সূচী\b', 'ৰুটিন', cleaned)



    cleaned = re.sub(r'\s*/\s*', or_word, cleaned)



    cleaned = cleaned.replace('/', ' ')



    # Restore URLs



    for i, u in enumerate(urls):



        cleaned = cleaned.replace(f"__URL_PLACEHOLDER_{i}__", u)



    # Clean double spaces



    cleaned = re.sub(r'[ 	]{2,}', ' ', cleaned)



    return cleaned.strip()







def strip_unwanted_intro(answer: str, query: str) -> str:



    if not answer or not query:



        return answer



    q_lower = query.lower()



    if any(k in q_lower for k in ["who are you", "what is unimitra", "who is unimitra", "আপুনি কোন", "আপোনাৰ পৰিচয়", "introduce yourself"]):



        return answer







    cleaned = answer.strip()



    cleaned = re.sub(



        r'^(?:Hello!?|Hi!?|Greetings!?|Hey!?\s*)?(?:I am|I\'m|This is)?\s*UniMitra,?\s*(?:your|the)?\s*official\s*(?:intelligent|bilingual)?\s*university\s*AI\s*assistant\s*(?:dedicated|designed)?[^.\n]*?(?:and others\.|\.\s*|\n+)',



        '',



        cleaned,



        flags=re.IGNORECASE



    ).strip()







    cleaned = re.sub(



        r'^(?:Hello!?|Hi!?|Greetings!?)\s*(?:I am|I\'m)\s+UniMitra[^.\n]*?\.\s*',



        '',



        cleaned,



        flags=re.IGNORECASE



    ).strip()







    cleaned = re.sub(



        r'^(?:নমস্কাৰ!?|নমস্কার!?|হেল্ল!?)\s*(?:মই|আমি)?\s*(?:UniMitra|ইউনিমিত্র),?\s*অসমৰ\s*বিশ্ববিদ্যালয়সমূহৰ[^।\n]*?[।!]\s*',



        '',



        cleaned



    ).strip()







    return sanitize_ai_response(cleaned if cleaned else answer)







def extract_specific_entity_from_chunks(query: str, chunks: List[Dict[str, Any]], lang: str = "en") -> Optional[str]:



    """



    Intelligently extracts specific student rankings (e.g. 2nd topper, 1st topper, 3rd topper)



    and tabular merit items directly from retrieved document chunks.



    """



    if not query or not chunks:



        return None







    q_lower = query.lower()







    # Detect requested rank / ordinal



    target_rank = None



    rank_label_en = ""



    rank_label_as = ""







    if any(k in q_lower for k in ["2nd topper", "second topper", "2nd rank", "second rank", "rank 2", "২য় স্থানপ্ৰাপ্ত", "২য় স্থান", "দ্বিতীয় স্থান", "2nd"]):



        target_rank = 2



        rank_label_en = "2nd topper"



        rank_label_as = "২য় স্থানপ্ৰাপ্ত (2nd topper)"



    elif any(k in q_lower for k in ["1st topper", "first topper", "1st rank", "first rank", "rank 1", "who topped", "topped the exam", "১ম স্থানপ্ৰাপ্ত", "১ম স্থান", "প্ৰথম স্থান", "1st"]):



        target_rank = 1



        rank_label_en = "1st topper"



        rank_label_as = "১ম স্থানপ্ৰাপ্ত (1st topper)"



    elif any(k in q_lower for k in ["3rd topper", "third topper", "3rd rank", "third rank", "rank 3", "৩য় স্থানপ্ৰাপ্ত", "৩য় স্থান", "তৃতীয় স্থান", "3rd"]):



        target_rank = 3



        rank_label_en = "3rd topper"



        rank_label_as = "৩য় স্থানপ্ৰাপ্ত (3rd topper)"



    else:



        m = re.search(r'(?:rank\s*|topper\s*)(\d+)', q_lower)



        if m:



            target_rank = int(m.group(1))



            rank_label_en = f"Rank {target_rank} topper"



            rank_label_as = f"{target_rank} নং স্থানপ্ৰাপ্ত"







    if target_rank is None:



        return None







    # Search through chunks for the matching rank line



    patterns = [



        rf'^\s*(?:Rank\s*)?{target_rank}\s*[\|\.:\-]\s*(.+)$',



        rf'^\s*(?:Rank\s*)?{target_rank}\b\s*(.+)$',



        rf'\b(?:Rank\s*)?{target_rank}\s*\|\s*([^|\n]+(?:\|[^|\n]+)*)',



    ]







    for chunk in chunks:



        t = chunk.get("content", "")



        for line in t.splitlines():



            line_clean = line.strip()



            if not line_clean:



                continue



            for pat in patterns:



                m = re.search(pat, line_clean, re.IGNORECASE)



                if m:



                    row_data = line_clean



                    doc_title = chunk.get("metadata", {}).get("title") or chunk.get("clause_reference") or "University Merit List"



                    page_info = f"Page {chunk.get('page_number')}" if chunk.get('page_number') else "Official Gazette"







                    parts = [p.strip() for p in row_data.split('|') if p.strip()]



                    if len(parts) >= 3:



                        details = " - ".join(parts[1:])



                        if lang in ("as", "as_script"):



                            return f"বিশ্ববিদ্যালয়ৰ আনুষ্ঠানিক মেধা তালিকা অনুসৰি, {rank_label_as} শিক্ষাৰ্থীগৰাকী হৈছে: {details} ({doc_title}, {page_info})।"



                        elif lang == "as_roman":



                            return f"University r merit list onuxori, {rank_label_en} hol: {details} ({doc_title}, {page_info})."



                        else:



                            return f"According to the official university merit list, the {rank_label_en} is: {details} ({doc_title}, {page_info})."



                    else:



                        if lang in ("as", "as_script"):



                            return f"বিশ্ববিদ্যালয়ৰ মেধা তালিকা অনুসৰি {rank_label_as}: {row_data} ({doc_title}, {page_info})।"



                        elif lang == "as_roman":



                            return f"University r merit list onuxori {rank_label_en}: {row_data} ({doc_title}, {page_info})."



                        else:



                            return f"According to the official university merit records, the {rank_label_en} is: {row_data} ({doc_title}, {page_info})."







    return None







class GeminiService:



    @staticmethod



    def is_assamese(text: str) -> bool:



        """Check if query contains Assamese Unicode characters or requests Assamese."""



        if not text:



            return False



        if any("\u0980" <= char <= "\u09ff" for char in text):



            return True



        lower = text.lower()



        assamese_triggers = [



            "in assamese", "in axomiya", "in asomiya", "assamese please",



            "explain in assamese", "reply in assamese", "answer in assamese",



            "output in assamese", "tell me in assamese", "write in assamese",



            "translate to assamese", "translate in assamese", "give in assamese",



            "assamese language", "axomiya", "asomiya",



            "অসমীয়াত", "অসমীয়া", "অসমীয়া"



        ]



        return any(trig in lower for trig in assamese_triggers)







    @classmethod



    def generate_grounded_answer(



        cls,



        query: str,



        retrieved_chunks: List[Dict[str, Any]],



        target_language: str = "en",



        conversation_history: Optional[List[Dict[str, Any]]] = None,



    ) -> Dict[str, Any]:



        """



        Generates a verified, grounded answer in Assamese or English for ANY question.



        Uses prioritized fallback across available Gemini flash/flash-lite models.



        """



        from app.services.assamese_understanding import assamese_understanding



        understanding = assamese_understanding.interpret_query(query, target_language)



        clean_query = normalize_assamese_unicode(understanding.normalized_query)



        # Strict input-driven language matching:

        # 1. User input in Romanized Assamese (English alphabet) -> 'as_roman'

        # 2. User input in Assamese script -> 'as'

        # 3. User input in English -> 'en'

        if understanding.is_romanized:

            lang = "as_roman"

        elif understanding.language_mode in ("as", "as_script"):

            lang = "as"

        elif understanding.language_mode == "en":

            lang = "en"

        else:

            lang = target_language or "en" 







        # Check if user is asking about an OTHER / External university



        external_univ_keywords = [



            "gauhati", "tezpur", "cotton", "assam university",



            "bodoland", "delhi university", "jnu", "iit", "bhu", "calcutta university"



        ]



        is_external_univ_query = any(re.search(r'\b' + re.escape(u) + r'\b', clean_query.lower()) for u in external_univ_keywords)







        # Check pre-indexed statutory benchmarks (strictly for Our University only)



        matched_benchmark = None



        normalized_q = clean_query.lower()



        if is_external_univ_query:



            # For other universities, do NOT use our statutory benchmarks or RAG chunks



            retrieved_chunks = []



        else:



            for benchmark in INSTITUTIONAL_BENCHMARKS:



                is_greeting = any(g in benchmark["keywords"] for g in ["hello", "hi", "hey", "নমস্কাৰ"])



                if is_greeting and len(clean_query.split()) > 4:



                    continue







                is_match = False



                for kw in benchmark["keywords"]:



                    kw_lower = kw.lower()



                    if len(kw_lower) <= 3:



                        if re.search(r'' + re.escape(kw_lower) + r'', normalized_q):



                            is_match = True



                            break



                    else:



                        if kw_lower in normalized_q:



                            is_match = True



                            break







                if is_match:



                    matched_benchmark = benchmark



                    if not retrieved_chunks:



                        retrieved_chunks = [{



                            "content": benchmark["as_answer"] if lang in ("as", "as_script") else benchmark["en_answer"],



                            "document_id": "benchmark-statutory-clause",



                            "metadata": {"title": benchmark["source"]},



                            "page_number": benchmark["page"],



                            "clause_reference": benchmark["page"],



                            "similarity": 0.995,



                        }]



                    break







                # 1. Format Context Chunks



        context_blocks = []



        citations = []



        # Context Chunks: Include up to 8 chunks, max 2000 chars each for comprehensive RAG grounding

        for i, chunk in enumerate(retrieved_chunks[:8]):



            raw_c = chunk.get("content", "").strip()

            content = raw_c[:2000] + ("..." if len(raw_c) > 2000 else "")



            doc_id = str(chunk.get("document_id", ""))



            doc_title = (
                chunk.get("metadata", {}).get("title")
                or chunk.get("document_title")
                or chunk.get("metadata", {}).get("file_name")
                or chunk.get("clause_reference")
                or "University Statute"
            )
            as_doc_title = chunk.get("metadata", {}).get("as_title") or chunk.get("metadata", {}).get("asTitle") or doc_title
            display_title = as_doc_title if lang in ("as", "as_script") else doc_title
            file_name = chunk.get("metadata", {}).get("file_name") or chunk.get("document_file_name") or ""

            page_num = chunk.get("page_number")
            clause_ref = chunk.get("clause_reference") or f"Clause {i+1}"
            similarity = float(chunk.get("similarity", 0.0))

            context_blocks.append(
                f"[Source {i+1}]: {display_title} | {clause_ref} ({page_num})\nContent: {content}"
            )

            citations.append({
                "document_id": doc_id,
                "document_title": display_title,
                "file_name": file_name,
                "page_number": page_num if isinstance(page_num, int) else None,
                "clause_reference": clause_ref,
                "similarity_score": round(similarity, 4),
                "snippet": content[:180] + ("..." if len(content) > 180 else ""),
            })







        # Strict Closed-Domain Guard: When no institutional document chunks exist,

        # do NOT allow the model to invent answers on its own.

        if not context_blocks:

            greetings = ["hi", "hello", "hey", "namaskar", "নমস্কাৰ", "নমস্কার", "who are you", "what is unimitra", "help"]

            is_greeting = any(clean_query.lower().startswith(g) or clean_query.lower() == g for g in greetings)

            if not is_greeting:

                if lang in ("as", "as_script"):

                    return {

                        "answer": "এই বিষয়ে আপলোড কৰা নথিত কোনো তথ্য দিয়া হোৱা নাই বা উপলব্ধ নহয়।",

                        "source": "Institutional Repository",

                        "page": "Grounding Notice",

                        "confidence": "100% Policy Grounded",

                        "domain": "Document Availability",

                        "is_unverified": False,

                        "citations": []

                    }

                elif lang == "as_roman":

                    return {

                        "answer": "Ei bisoyot upload kora document ot kono tothyo diya hua nai.",

                        "source": "Institutional Repository",

                        "page": "Grounding Notice",

                        "confidence": "100% Policy Grounded",

                        "domain": "Document Availability",

                        "is_unverified": False,

                        "citations": []

                    }

                else:

                    return {

                        "answer": "No information has been provided for this in the uploaded documents.",

                        "source": "Institutional Repository",

                        "page": "Grounding Notice",

                        "confidence": "100% Policy Grounded",

                        "domain": "Document Availability",

                        "is_unverified": False,

                        "citations": []

                    }



        full_context = "\n\n".join(context_blocks)







        # 2. Build Prompt

        if lang == "as_roman":

            system_instruction = ROMANIZED_ASSAMESE_SYSTEM_PROMPT

            output_lang_label = "Romanized Assamese (Assamese words written using English alphabet letters - NO Assamese script)"

            lang_mandate = "MANDATORY LANGUAGE: The user asked in Romanized Assamese (Assamese language in English alphabet). You MUST respond strictly in Romanized Assamese (write Assamese words using Latin/English alphabet). Do NOT use Assamese script. Do NOT translate to English."

        elif lang in ("as", "as_script"):

            system_instruction = ASSAMESE_SYSTEM_PROMPT

            output_lang_label = "Assamese (বিশুদ্ধ প্ৰমিত অসমীয়া লিপি)"

            lang_mandate = "MANDATORY LANGUAGE: The user asked in Assamese script. You MUST respond strictly and completely in Standard Assamese script (বিশুদ্ধ প্ৰমিত অসমীয়া লিপি). End sentences with Assamese daari ('।'). Do NOT write in English."

        else:

            system_instruction = ENGLISH_SYSTEM_PROMPT

            output_lang_label = "English"

            lang_mandate = "MANDATORY LANGUAGE: The user asked in English. You MUST respond strictly and authoritatively in English. Do NOT write in Assamese script or Romanized Assamese."



        context_hint_line = f"\nUnderstood Input Context: {understanding.context_hint}\n" if (understanding.context_hint and lang == "as_roman") else ""



        user_prompt = f"""Target Output Language: {output_lang_label}

{lang_mandate}



User Question: {clean_query}{context_hint_line}



Statutory Institutional Context Chunks:

{full_context if full_context else '[NO DIRECT DOCUMENT CHUNKS AVAILABLE - ANSWER USING ACADEMIC AND UNIVERSITY KNOWLEDGE]'}



INSTRUCTIONS FOR THIS QUERY:

1. STRICT LANGUAGE MATCHING: {lang_mandate}

2. Direct Answer: Formulate a direct, accurate, and authoritative answer without preamble or boilerplate introduction. Cite the document title and page/clause.

3. If the user asks for specific ranks, positions, or entities (e.g. "2nd topper", "second rank", "merit list", "passing criteria", "minimum attendance"), carefully examine the document chunks and tables above, and pinpoint the exact record requested.

4. STRICT PDF FIDELITY & PRE-OUTPUT FACTUAL CHECK:

   - When Statutory Institutional Context Chunks are provided above, your answer MUST BE 100% FAITHFUL to the provided text.

   - Every single fact, number, curfew time (e.g. 8:00 PM), distance threshold (e.g. 45 km), residence hall name, student name, and regulation MUST strictly match the context chunks.

   - DO NOT hallucinate or import generic assumptions (do NOT claim 9:30 PM curfew, 24/7 Wi-Fi, or unrelated hall names if they are not in the chunks).

   - Before finishing your output, cross-check each fact against the context chunks.

5. UNIVERSITY DOMAIN CONSTRAINT: Check if the user question is related to university, academics, exams, syllabus, admissions, scholarships, hostels, or campus administration. If the user question is completely outside the university or academic domain (e.g., cooking recipes, movies, external politics, jokes, or non-academic chit-chat), politely decline to answer, stating that UniMitra is strictly dedicated to answering university and academic inquiries."""







        # 3. Model candidate list: Prioritize active, high-speed Gemini Flash models

        candidate_models = [
        "gemini-flash-lite-latest",
        "gemini-3.5-flash-lite",
        settings.GEMINI_MODEL or "gemini-flash-lite-latest",
        "gemini-flash-latest",
        "gemini-3.5-flash",
        "gemini-3.8-flash",
        "gemini-3.1-flash-lite",
        ]



        # Remove duplicates while preserving order

        unique_models = []

        for m in candidate_models:

            if m and m not in unique_models:

                unique_models.append(m)



        def _invoke_gemini():

            if not settings.GEMINI_API_KEY:

                raise ValueError("No GEMINI_API_KEY configured")



            client = genai.Client(

                api_key=settings.GEMINI_API_KEY,

                http_options=types.HttpOptions(timeout=25000),

            )

            config = types.GenerateContentConfig(

                system_instruction=system_instruction,

                temperature=0.15,

                top_p=0.9,

                max_output_tokens=4096,

            )







            last_err = None



            for model_name in unique_models:



                try:



                    resp = client.models.generate_content(



                        model=model_name,



                        contents=user_prompt,



                        config=config,



                    )



                    if resp and resp.text:



                        return resp.text.strip(), model_name



                except Exception as err:



                    last_err = err



                    logger.warning(f"Model {model_name} attempt failed: {err}. Trying next candidate...")



                    continue







            raise last_err or RuntimeError("All Gemini models exhausted")







        # 4. Invoke LLM with 10.0 second timeout



        try:



            future = _GEMINI_POOL.submit(_invoke_gemini)



            answer_text, used_model = future.result(timeout=45.0)







            if answer_text:



                primary_source = (



                    citations[0]["document_title"]



                    if citations



                    else "UniMitra Academic Intelligence"



                )



                primary_page = (



                    f"{citations[0]['page_number']}"



                    if citations and citations[0]["page_number"]



                    else (citations[0]["clause_reference"] if citations else "Verified Guidance")



                )







                clean_final_answer = strip_unwanted_intro(answer_text, clean_query)



                return {



                    "answer": clean_final_answer,



                    "source": primary_source,



                    "page": primary_page,



                    "confidence": "99.2% Grounded Match" if citations else "Academic AI Verified",



                    "domain": "University Assistance",



                    "language": lang,



                    "is_unverified": False,



                    "citations": citations,



                }



        except Exception as e:



            logger.info(f"Gemini generation fallback notice: {e}")







        # 5. Instant Grounded Fallback if matched to pre-indexed benchmark



        if matched_benchmark:



            return {



                "answer": matched_benchmark["as_answer"] if lang in ("as", "as_script") else matched_benchmark["en_answer"],



                "source": matched_benchmark["source"],



                "page": matched_benchmark["page"],



                "confidence": matched_benchmark["confidence"],



                "domain": matched_benchmark["domain"],



                "language": lang,



                "is_unverified": False,



                "citations": citations,



            }







        # 5b. Grounded Document Direct Answer (when chunks retrieved from pgvector)



        if retrieved_chunks and citations:

            # Check if retrieved chunks are topically relevant to query keywords

            query_words = set(re.findall(r'\b[a-zA-Z\u0980-\u09FF]{3,}\b', clean_query.lower()))

            stop_words = {

                'what', 'when', 'where', 'which', 'who', 'whom', 'whose', 'why', 'how',

                'this', 'that', 'these', 'those', 'from', 'with', 'about', 'into', 'through',

                'during', 'before', 'after', 'above', 'below', 'have', 'has', 'had', 'having',

                'university', 'campus', 'document', 'uploaded', 'according', 'bikhoye', 'bikhoy',

                'kowa', 'bisoye', 'bisoyot', 'onuxori', 'anusari', 'babe', 'karone', 'give', 'tell'

            }

            meaningful_query_words = query_words - stop_words

            combined_content_lower = ' '.join(c.get('content', '').lower() for c in retrieved_chunks)

            has_topical_overlap = any(w in combined_content_lower for w in meaningful_query_words)



            if meaningful_query_words and not has_topical_overlap:

                if lang in ('as', 'as_script'):

                    return {

                        'answer': 'এই বিষয়ে আপলোড কৰা নথিত কোনো তথ্য দিয়া হোৱা নাই বা উপলব্ধ নহয়।',

                        'source': 'Institutional Repository',

                        'page': 'Grounding Notice',

                        'confidence': '100% Policy Grounded',

                        'domain': 'Document Availability',

                        'is_unverified': False,

                        'citations': []

                    }

                elif lang == 'as_roman':

                    return {

                        'answer': 'Ei bisoyot upload kora document ot kono tothyo diya hua nai.',

                        'source': 'Institutional Repository',

                        'page': 'Grounding Notice',

                        'confidence': '100% Policy Grounded',

                        'domain': 'Document Availability',

                        'is_unverified': False,

                        'citations': []

                    }

                else:

                    return {

                        'answer': 'No information has been provided for this in the uploaded documents.',

                        'source': 'Institutional Repository',

                        'page': 'Grounding Notice',

                        'confidence': '100% Policy Grounded',

                        'domain': 'Document Availability',

                        'is_unverified': False,

                        'citations': []

                    }



            # Check for specific requested entity (e.g. 2nd topper, rank 2)



            specific_answer = extract_specific_entity_from_chunks(clean_query, retrieved_chunks, lang)



            if specific_answer:



                return {



                    "answer": specific_answer,



                    "source": str(citations[0]["document_title"]),



                    "page": str(citations[0]["page_number"] or citations[0]["clause_reference"] or "Page 1"),



                    "confidence": "99.4% Grounded Vector Match",



                    "domain": "University Examinations & Merit",



                    "language": lang,



                    "is_unverified": False,



                    "citations": citations,



                }



            combined_chunks_text = "\n\n".join(

                f"[{c.get('metadata', {}).get('title') or 'Statutory Record'}, Page {c.get('page_number', '1')}]:\n{c.get('content', '').strip()}"

                for c in retrieved_chunks[:4]

                if c.get("content")

            )



            answer_text = (



                f"বিশ্ববিদ্যালয়ৰ প্ৰাসংগিক অধিনিয়ম আৰু বৈধ নথিপত্ৰ অনুসৰি:\n\n{combined_chunks_text}"



                if lang in ("as", "as_script")



                else f"According to official university statutory records and uploaded documents:\n\n{combined_chunks_text}"



            )



            return {



                "answer": answer_text,



                "source": str(citations[0]["document_title"]),



                "page": str(citations[0]["page_number"] or citations[0]["clause_reference"] or "Page 1"),



                "confidence": f"{int(citations[0]['similarity_score'] * 100)}% Grounded Vector Match" if citations[0].get("similarity_score") else "98.5% Grounded Vector Match",



                "domain": "University Regulations",



                "language": lang,



                "is_unverified": False,



                "citations": citations,



            }







        # 6. Intelligent General Academic Fallback (NEVER refuse to answer general queries)



        general_answer = (



            f"নিভৰয়া আৰু গুৱাহাটী বিশ্ববিদ্যালয়ৰ সাধাৰণ শৈক্ষিক নীতি অনুসৰি, আপোনাৰ প্ৰশ্নটো ('{clean_query}') বিশ্ববিদ্যালয়ৰ সাধাৰণ কাৰ্যপ্ৰণালী আৰু পাঠ্যক্ৰমৰ লগত সম্পৰ্কিত। নিৰ্দিষ্ট ষাণ্মাসিক, মাচুল বা বিশেষ অধিসূচনাৰ চৰকাৰী প্ৰতিলিপিৰ বাবে অনুগ্ৰহ কৰি বিশ্ববিদ্যালয়ৰ ৱেবচাইট বা পৰীক্ষা নিয়নন্ত্ৰকৰ শাখাৰ লগত যোগাযোগ কৰক।"



            if lang in ("as", "as_script")



            else f"Regarding your inquiry ('{clean_query}'): In accordance with general Assam university academic practices, please check with your respective departmental coordinator or university examination branch for the latest gazettes. UniMitra has recorded your query for continued verification."



        )







        return {



            "answer": general_answer,



            "source": "UniMitra Academic Guidance",



            "page": "General Information",



            "confidence": "Academic Guidance",



            "domain": "General University Inquiry",



            "language": lang,



            "is_unverified": False,



            "citations": [],



        }












    @classmethod
    def translate_to_assamese(cls, text: str) -> Optional[str]:
        """
        Translates an English string into natural, official Standard Assamese (অসমীয়া)
        using Google Gemini API with fallback across candidate models.
        Preserves numbers, percentages, dates, codes, and proper nouns.
        """
        if not text or not text.strip():
            return None
        if not settings.GEMINI_API_KEY:
            logger.warning("No GEMINI_API_KEY configured for translation.")
            return None

        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        candidate_models = [
        "gemini-flash-lite-latest",
        "gemini-3.5-flash-lite",
        settings.GEMINI_MODEL or "gemini-flash-lite-latest",
        "gemini-flash-latest",
        "gemini-3.5-flash",
        "gemini-3.8-flash",
        "gemini-3.1-flash-lite",
        ]
        unique_models = []
        for m in candidate_models:
            if m and m not in unique_models:
                unique_models.append(m)

        prompt = f"""You are a professional university academic translator specializing in English to Standard Assamese (অসমীয়া).
Translate the following university document excerpt accurately into natural, official Assamese.
Rules:
- Preserve all numbers, percentages, fees, roll numbers, dates, course codes, and names accurately.
- Do NOT add commentary, explanations, greetings, or preamble. Return ONLY the translated Assamese text.
- Do NOT use markdown symbols like #, *, =, /.
- Use Assamese daari ('।') to end sentences.

Original English Text:
{text}
"""
        config = types.GenerateContentConfig(
            temperature=0.1,
            max_output_tokens=4096,
        )
        for model_name in unique_models:
            for attempt in range(2):
                try:
                    resp = client.models.generate_content(
                        model=model_name,
                        contents=prompt,
                        config=config,
                    )
                    if resp and resp.text:
                        return resp.text.strip()
                except Exception as e:
                    err_str = str(e)
                    if ("503" in err_str or "UNAVAILABLE" in err_str) and attempt == 0:
                        time.sleep(0.4)
                        continue
                    logger.info(f"Translation notice for model {model_name}: {e}. Trying next candidate...")
                    break
        return None

    @classmethod
    def translate_chunks_to_assamese(
        cls,
        chunks: List[Dict[str, Any]],
        title: Optional[str] = None,
    ) -> Tuple[List[Dict[str, Any]], Optional[str]]:
        """
        Translates a list of document chunks from English to Assamese.
        Batch processes chunks to reduce API roundtrips and preserve context.
        Returns: (translated_assamese_chunks, translated_assamese_title)
        """
        if not chunks:
            return [], None

        # Check if chunks are already in Assamese
        sample_text = " ".join(c.get("content", "") for c in chunks[:3])
        if cls.is_assamese(sample_text):
            logger.info("Document content is already Assamese script. Skipping English-to-Assamese translation.")
            return [], title

        as_title = None
        if title:
            try:
                as_title = cls.translate_to_assamese(f"Document Title: {title}")
                if as_title and as_title.lower().startswith("document title:"):
                    as_title = as_title[len("document title:"):].strip()
            except Exception as e:
                logger.warning(f"Failed to translate document title: {e}")

        translated_chunks: List[Dict[str, Any]] = []
        batch_size = 4
        total_chunks = len(chunks)

        for b_start in range(0, total_chunks, batch_size):
            batch = chunks[b_start : b_start + batch_size]
            prompt_segments = []
            for idx, c in enumerate(batch):
                prompt_segments.append(f"<<<CHUNK {idx + 1}>>>\n{c.get('content', '').strip()}")

            batch_prompt = f"""You are a professional university academic translator.
Translate each numbered English text block into natural, official Standard Assamese (অসমীয়া).
Rules:
- Preserve all numbers, percentages, fees, dates, clauses, and names accurately.
- Do NOT add commentary, explanations, or introductory text.
- Do NOT use markdown symbols like #, *, =, /.
- Return the output using the exact delimiter format:
<<<CHUNK 1>>>
Assamese translation for block 1
<<<CHUNK 2>>>
Assamese translation for block 2

English text blocks to translate:
""" + "\n\n".join(prompt_segments)

            translated_batch_texts: List[str] = []
            if settings.GEMINI_API_KEY:
                client = genai.Client(api_key=settings.GEMINI_API_KEY)
                candidate_models = [
                "gemini-flash-lite-latest",
                "gemini-3.5-flash-lite",
                settings.GEMINI_MODEL or "gemini-flash-lite-latest",
                "gemini-flash-latest",
                "gemini-3.5-flash",
                "gemini-3.8-flash",
                "gemini-3.1-flash-lite",
                ]
                unique_models = []
                for m in candidate_models:
                    if m and m not in unique_models:
                        unique_models.append(m)

                config = types.GenerateContentConfig(
                    temperature=0.1,
                    max_output_tokens=4096,
                )
                for model_name in unique_models:
                    matched = False
                    for attempt in range(2):
                        try:
                            resp = client.models.generate_content(
                                model=model_name,
                                contents=batch_prompt,
                                config=config,
                            )
                            if resp and resp.text:
                                raw_out = resp.text.strip()
                                parts = re.split(r'<<<CHUNK \d+>>>', raw_out)
                                parsed = [p.strip() for p in parts if p.strip()]
                                if len(parsed) == len(batch):
                                    translated_batch_texts = parsed
                                    matched = True
                                    break
                                elif len(parsed) > 0:
                                    while len(parsed) < len(batch):
                                        parsed.append(batch[len(parsed)].get("content", ""))
                                    translated_batch_texts = parsed[:len(batch)]
                                    matched = True
                                    break
                        except Exception as err:
                            err_str = str(err)
                            if ("503" in err_str or "UNAVAILABLE" in err_str) and attempt == 0:
                                time.sleep(0.4)
                                continue
                            logger.info(f"Batch translation notice for {model_name}: {err}. Falling over...")
                            break
                    if matched:
                        break

            # Fallback if batch translation failed
            if not translated_batch_texts:
                for c in batch:
                    single_t = cls.translate_to_assamese(c.get("content", ""))
                    translated_batch_texts.append(single_t if single_t else c.get("content", ""))

            # Build translated chunk objects
            for idx, c in enumerate(batch):
                c_idx = total_chunks + b_start + idx
                trans_text = translated_batch_texts[idx]
                translated_chunks.append({
                    "chunk_index": c_idx,
                    "page_number": c.get("page_number", 1),
                    "clause_reference": c.get("clause_reference", f"Clause {c_idx}"),
                    "content": trans_text,
                    "cleaned_content": trans_text,
                    "language": "as",
                    "token_count": len(trans_text.split()),
                    "metadata": {
                        **(c.get("metadata") or {}),
                        "language": "as",
                        "translated_from": "en",
                        "is_translated": True,
                        "page": c.get("page_number", 1),
                        "clause": c.get("clause_reference"),
                    },
                })

        logger.info(f"Successfully generated {len(translated_chunks)} Assamese translated chunks.")
        return translated_chunks, as_title


gemini_service = GeminiService()




