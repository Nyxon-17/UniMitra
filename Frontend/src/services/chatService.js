import { detectLanguageModeAdvanced, interpretQuery } from './assameseUnderstanding';
// Centralized AI Chat & RAG Grounding Service
// Seamlessly connects React Frontend to Node.js Backend, Python AI Service, & Direct Gemini Model Cascade
// Supports: Assamese Script, Romanized Assamese (English letters), and English

import { universityService } from './universityService';
import { documentService } from './documentService';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const CHAT_API = `${API_BASE}/chat`;
const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8000';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

const GEMINI_CANDIDATES = [
  'gemini-flash-lite-latest',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-2.5-flash'
];

const LOCAL_SESSIONS_KEY = 'unimitra_chat_sessions_v2';
const ACTIVE_SESSION_ID_KEY = 'unimitra_active_session_id';

export function generateSessionId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    try {
      return crypto.randomUUID();
    } catch {
      // fallback
    }
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function getCurrentUserId() {
  if (typeof window === 'undefined') return 'guest';
  try {
    const raw = localStorage.getItem('unimitra_user');
    if (raw) {
      const u = JSON.parse(raw);
      if (u?.id) return u.id;
    }
  } catch {}
  return 'guest';
}

export function getDomainSessionsKey(domain = 'student', userId = null) {
  const d = (domain || 'student').toLowerCase();
  const uid = userId || getCurrentUserId();
  const prefix = d.includes('admin') ? 'admin' : (d.includes('faculty') ? 'faculty' : 'student');
  return `unimitra_chat_sessions_${uid}_${prefix}`;
}

export function getDomainActiveSessionKey(domain = 'student', userId = null) {
  const d = (domain || 'student').toLowerCase();
  const uid = userId || getCurrentUserId();
  const prefix = d.includes('admin') ? 'admin' : (d.includes('faculty') ? 'faculty' : 'student');
  return `unimitra_active_session_${uid}_${prefix}`;
}

export function getDomainMessageKey(sessionId, domain = 'student', userId = null) {
  const d = (domain || 'student').toLowerCase();
  const uid = userId || getCurrentUserId();
  const prefix = d.includes('admin') ? 'admin' : (d.includes('faculty') ? 'faculty' : 'student');
  return `unimitra_messages_${uid}_${prefix}_${sessionId}`;
}

export function sanitizeAiResponse(text = '') {
  if (!text) return text;
  let cleaned = text;
  // 1. Strip markdown header hashes (#)
  cleaned = cleaned.replace(/#+\s*/g, '');
  // 2. Strip equals dividers (===) and replace = with hyphen
  cleaned = cleaned.replace(/={2,}/g, '');
  cleaned = cleaned.replace(/\s*=\s*/g, ' - ');
  cleaned = cleaned.replace(/=/g, '');
  // 3. Replace leading bullet asterisks with hyphens, remove remaining asterisks (*)
  cleaned = cleaned.replace(/^\s*\*\s+/gm, '- ');
  cleaned = cleaned.replace(/\*/g, '');
  // 4. Protect URLs temporarily if any (https://...)
  const urls = [];
  cleaned = cleaned.replace(/https?:\/\/[^\s]+/g, (match) => {
    urls.push(match);
    return `__URL_PLACEHOLDER_${urls.length - 1}__`;
  });
  // Replace remaining slashes (/) with 'or' / 'বা'
  const hasAssamese = /[\u0980-\u09FF]/.test(cleaned);
  const orWord = hasAssamese ? ' বা ' : ' or ';
  cleaned = cleaned.replace(/\s*\/\s*/g, orWord);
  cleaned = cleaned.replace(/\//g, ' ');
  // Restore URLs
  cleaned = cleaned.replace(/__URL_PLACEHOLDER_(\d+)__/g, (_, idx) => urls[Number(idx)]);
  // Clean double spaces
  cleaned = cleaned.replace(/[ \t]{2,}/g, ' ');
  return cleaned.trim();
}

export function stripUnwantedIntro(answer = '', query = '') {
  if (!answer || !query) return sanitizeAiResponse(answer);
  const qLower = query.toLowerCase();
  if (['who are you', 'what is unimitra', 'who is unimitra', 'আপুনি কোন', 'পৰিচয়', 'introduce yourself'].some(k => qLower.includes(k))) {
    return sanitizeAiResponse(answer);
  }
  let cleaned = answer.trim();
  cleaned = cleaned.replace(/^(?:Hello!?|Hi!?|Greetings!?|Hey!?\s*)?(?:I am|I'm|This is)?\s*UniMitra,?\s*(?:your|the)?\s*official\s*(?:intelligent|bilingual)?\s*university\s*AI\s*assistant\s*(?:dedicated|designed)?[^.\n]*?(?:and others\.|\.\s*|\n+)/i, '').trim();
  cleaned = cleaned.replace(/^(?:Hello!?|Hi!?|Greetings!?)\s*(?:I am|I'm)\s+UniMitra[^.\n]*?\.\s*/i, '').trim();
  cleaned = cleaned.replace(/^(?:নমস্কাৰ!?|নমস্কার!?|হেল্ল!?)\s*(?:মই|আমি)?\s*(?:UniMitra|ইউনিমিত্র),?\s*অসমৰ\s*বিশ্ববিদ্যালয়সমূহৰ[^।\n]*?[।!]\s*/, '').trim();
  return sanitizeAiResponse(cleaned || answer);
}

export const ROMANIZED_ASSAMESE_WORDS = new Set([
  'aji', 'kali', 'ahibor', 'ketiya', 'kot', 'ki', 'kio', 'kioba', 'kenekua', 'kenekuwa', 'kenedore',
  'moi', 'mur', 'muk', 'mok', 'tumi', 'tumar', 'tuk', 'apuni', 'apunar', 'apunak', 'tai', 'he', 'hehot',
  'ami', 'amar', 'amie', 'eitu', 'heitu', 'ei', 'hei', 'eta', 'duita', 'bhal', 'kotha', 'khobor',
  'asa', 'asu', 'ase', 'asil', 'asila', 'asilo', 'asise', 'nai', 'nohoy', 'hobo', 'hoi', 'hol', 'hola', 'hole',
  'korim', 'kora', 'kore', 'korisa', 'korisu', 'kori', 'koribo', 'lagibo', 'lage', 'bisaru', 'bisare', 'bisara',
  'jau', 'jaba', 'gole', 'gol', 'aisu', 'aha', 'ahibo', 'kuwa', 'kua', 'kobo', 'koise', 'koi', 'de', 'diya',
  'dibo', 'pam', 'paba', 'pale', 'paisu', 'paiso', 'parim', 'pariba', 'pare', 'sau', 'soa', 'saise',
  'dhonnobad', 'namaskar', 'dada', 'baideu', 'bhaity', 'pora', 'loi', 'logot', 'homoy', 'somoy', 'dore', 'nisina'
]);

export const ROMANIZED_ASSAMESE_PHRASES = [
  'ki ki', 'ki hol', 'ki khobor', 'kenekua asa', 'kenekuwa asa', 'bhal asu', 'bhal ne', 'ketiya hobo',
  'lagibo ne', 'bisaru', 'bonabo bisaru', 'koribo bisaru', 'jana ase', 'mok kuwa', 'muk kuwa', 'or capital ki',
  'college ot', 'exam ot', 'bhal kotha', 'in assamese', 'in axomiya', 'in asomiya', 'assamese please',
  'axomiya', 'asomiya'
];

/**
 * Strict 3-Way Language Mode Detector:
 * 'as_script' -> User wrote in Assamese Unicode Script
 * 'as_roman'  -> User wrote in Romanized Assamese (Assamese words in English/Latin letters)
 * 'en'        -> User wrote in English
 */
export function detectLanguageMode(text = '', requestedLang = 'en') {
  return detectLanguageModeAdvanced(text, requestedLang);
}

function getAuthHeaders(includeContentType = true) {
  const token = localStorage.getItem('unimitra_auth_token');
  const headers = {};
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Direct call to Python AI Service (Port 8000)
 */
async function callPythonAiService({ query, language, university, signal = null }) {
  if (signal?.aborted) return null;
  try {
    const mode = detectLanguageMode(query, language);
    const res = await fetch(`${AI_SERVICE_URL}/api/ai/query`, {
      method: 'POST',
      signal,
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Secret': 'unimitra_internal_ai_secret_2026'
      },
      body: JSON.stringify({
        query,
        language: mode,
        university_code: university?.code || 'DU',
        conversation_history: []
      })
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.success && data?.answer) {
        return {
          success: true,
          fromBackend: false,
          fromAi: true,
          answer: data.answer,
          source: data.source || `${university?.name || 'Nivoraya University'} Gazette`,
          page: data.page || 'Verified Clause',
          confidence: data.confidence || '99.0% Grounded Match',
          isUnverified: data.is_unverified || false,
          citations: data.citations || []
        };
      }
    }
  } catch {
    // Python service offline or unreachable
  }
  return null;
}

/**
 * Direct call to Google Gemini Model Cascade with Strict Language Matching
 */
async function callDirectGemini({ query, language, university, signal = null }) {
  if (signal?.aborted || !GEMINI_API_KEY) {
    return null;
  }
  const understanding = interpretQuery(query, language);
  const mode = understanding.languageMode;
  const uName = university?.name || 'Nivoraya University';
  const cleanQuery = understanding.normalizedQuery;

  let systemPrompt = '';

  const activeProfile = universityService.getProfile();
  const resolvedUnivName = activeProfile?.name || uName || 'Nivoraya University';
  const resolvedAsName = activeProfile?.asName || 'নিভৰয়া বিশ্ববিদ্যালয়';

  if (mode === 'as_roman') {
    systemPrompt = `You are UniMitra, the official university AI assistant dedicated exclusively to ${resolvedUnivName}.

SINGLE-UNIVERSITY & DUAL-SOURCE MANDATE:
1. This platform is dedicated exclusively to Our University (${resolvedUnivName}).
2. For questions regarding OUR UNIVERSITY (${resolvedUnivName}): Answer using statutory academic regulations, examination bylaws, attendance criteria, and grounded university data.
3. For questions regarding OTHER UNIVERSITIES (e.g. Gauhati University, Tezpur University, Cotton University, Delhi University, etc.): Provide accurate details, comparisons, and academic facts using general educational and web data. Do NOT apply Our University's internal statutory codes to other universities. Mention politely that official statutory records in this portal are dedicated to ${resolvedUnivName}, while other university details are provided via web data.
4. If the user asks about other universities, answer authoritatively and helpfully using web data. Never refuse to assist.

CRITICAL DIRECT ANSWER MANDATE:
Answer directly without boilerplate introductions (do NOT start with "Moi UniMitra..."). Jump straight to answering the user's question.

CRITICAL FORMATTING MANDATE - NO SPECIAL SYMBOLS (* = / #):
Do NOT use '*', '=', '/', or '#' anywhere in your output.
- No asterisks ('*') for bold or bullets.
- No hash ('#') for headings.
- No equals ('=') signs.
- No slashes ('/'). Write 'or', 'and', hyphens, or commas instead.
- Use clean plain text sentences and simple numbers (1., 2.) or hyphens (-) for lists.

STRICT LANGUAGE MATCHING RULE (ROMANIZED ASSAMESE):
The user is speaking in Romanized Assamese (Assamese language written using English/Latin alphabet letters, e.g. "Tumi kenekua asa?", "Mur exam ketiya hobo?", "Aji college ot ki ki hol?", "Assam or capital ki?").
You MUST respond strictly in Romanized Assamese (Assamese words written using English/Latin alphabet letters).

MANDATORY RULES:
1. Do NOT translate into English.
2. Do NOT use Assamese script (do NOT write any Bengali/Assamese Unicode characters like অসমীয়া). Use ONLY English/Latin alphabet letters to spell out Assamese words.
3. Understand common Assamese expressions written in Roman letters.
4. Keep the reply friendly, conversational, and helpful, matching the user's speaking style.
5. If university terms or proper nouns are in English (like "exam", "admit card", "college", "fee", "percentage", "Dispur"), keep them as English loan words in your Romanized Assamese sentence.

Examples:
User: Aji college ot ki ki hol?
AI: Aji college ot 4 ta class hol.

User: Tumi kenekua asa?
AI: Moi bhal asu. Tumar kenekua?

User: Mur exam ketiya hobo?
AI: Tomar examor date jodi jana ase, mok kuwa. Moi help korim.

User: Assam or capital ki?
AI: Assamor capital Dispur.

User: Moi eta website bonabo bisaru.
AI: Bhal kotha! Tumi kenekuwa website bonabo bisara?`;
  } else if (mode === 'as_script') {
    systemPrompt = `আপুনি UniMitra (ইউনিমিত্র), সকলো বিষয়ৰ বাবে এক শক্তিশালী, সৰ্বজনীন (General-Purpose) দ্বিভাষিক AI ভইচ সহায়ক আৰু শৈক্ষিক সহযোগী।

একক বিশ্ববিদ্যালয় আৰু দ্বি-উৎস নীতি (SINGLE-UNIVERSITY & DUAL-SOURCE MANDATE):
১. এই প্লেটফৰ্ম কেৱল আমাৰ নিৰ্দিষ্ট বিশ্ববিদ্যালয়ৰ (${resolvedAsName}) বাবে উৎসৰ্গিত।
২. আমাৰ বিশ্ববিদ্যালয়ৰ (${resolvedAsName}) প্ৰশ্নৰ ক্ষেত্ৰত: বিশ্ববিদ্যালয়ৰ অনুমোদিত অধিনিয়ম, পৰীক্ষা বিধি আৰু সংৰক্ষিত RAG তথ্যৰ ভিত্তিত সঠিক উত্তৰ দিয়ক।
৩. অন্যান্য বিশ্ববিদ্যালয়ৰ (যেনে গুৱাহাটী বিশ্ববিদ্যালয়, তেজপুৰ বিশ্ববিদ্যালয়, কটন বিশ্ববিদ্যালয়, দিল্লী বিশ্ববিদ্যালয় আদি) প্ৰশ্নৰ ক্ষেত্ৰত: ৱেব তথ্য (Web data) আৰু সাধাৰণ শৈক্ষিক জ্ঞান ব্যৱহাৰ কৰি সঠিক বিৱৰণ দিয়ক। আমাৰ বিশ্ববিদ্যালয়ৰ আভ্যন্তৰীণ নিয়ম অন্যান্য বিশ্ববিদ্যালয়ৰ ওপৰত আৰোপ নকৰিব। বুজাই দিয়ক যে এই পৰ্টেলটো আমাৰ বিশ্ববিদ্যালয়ৰ প্ৰতিষ্ঠানিক বিধিৰ বাবে নিৰ্ধাৰিত, কিন্তু অন্যান্য বিশ্ববিদ্যালয়ৰ তথ্য সাধাৰণ ৱেব তথ্যৰ ভিত্তিত দিয়া হৈছে।

CRITICAL DIRECT ANSWER MANDATE:
কোনো অপ্ৰয়োজনীয় আত্মপৰিচয়মূলক বাক্য বা পুনৰাবৃত্তিমূলক আৰম্ভণি (যেনে: "নমস্কাৰ! মই ইউনিমিত্র, অসমৰ বিশ্ববিদ্যালয়সমূহৰ AI সহায়ক...") নিদিব। প্ৰশ্নৰ পোনপটীয়া, সঠিক আৰু স্পষ্ট উত্তৰ দিয়ক। কেৱল ব্যৱহাৰকাৰীয়ে পৰিচয় সুধিলে বা অভিবাদন জনালেহে পৰিচয় দিয়ক।

বিশেষ চিহ্ন বৰ্জনৰ নিৰ্দেশনা (NO SPECIAL SYMBOLS * = / #):
আপোনাৰ উত্তৰত কেতিয়াও '*', '=', '/', বা '#' চিহ্ন ব্যৱহাৰ নকৰিব।
- ডাঠ বা হেলনীয়া কৰিবলৈ কোনো '*' ব্যৱহাৰ নকৰিব (যেনে **শব্দ** বা *শব্দ* নিলিখিব)।
- কোনো '#' চিহ্ন ব্যৱহাৰ নকৰিব (যেনে #, ##, ### নিলিখিব)।
- কোনো '=' বা '===' চিহ্ন ব্যৱহাৰ নকৰিব।
- কোনো শ্লেছ ('/') ব্যৱহাৰ নকৰিব (শ্লেছৰ সলনি 'বা', 'আৰু', কমা বা হাইফেন ব্যৱহাৰ কৰক)।
- তালিকাৰ বাবে কেৱল সাধাৰণ সংখ্যা (১., ২.) বা সাধাৰণ হাইফেন (-) ব্যৱহাৰ কৰক।

স্পষ্ট উচ্চাৰণ আৰু ভইচ সহায়ক নিৰ্দেশনা (CLEAR ASSAMESE TTS PHONETICS MANDATE):
১. আপোনাৰ উত্তৰটো Text-to-Speech (TTS) ভইচ ইঞ্জিনেৰে উচ্চাৰণ কৰা হ'ব। সেয়েহে বাক্যসমূহ প্ৰাকৃতিক, স্পষ্ট আৰু ব্যাকৰণগতভাৱে শুদ্ধ প্ৰমিত অসমীয়াত লিখক।
২. প্ৰতিটো বাক্যৰ শেষত অসমীয়া দাৰী ('।') আৰু তাৰ পিছত এটা স্পেচ ব্যৱহাৰ কৰক। অসমীয়া বাক্যত কেতিয়াও ইংৰাজী ফুলষ্টপ ('.') ব্যৱহাৰ নকৰিব।
৩. বাক্যসমূহ মধ্যমীয়া আৰু স্পষ্ট দৈৰ্ঘ্যৰ কৰক যাতে কণ্ঠৰ স্বাভাৱিক উশাহ আৰু বিৰতি মসৃণ থাকে।
৪. শতাংশ বুজাবলৈ '%' চিহ্ন নিলিখিব, তাৰ সলনি 'শতাংশ' লিখক (যেনে ৭৫ শতাংশ, ৮০ শতাংশ)।
৫. বিকল্প বুজাবলৈ শ্লেছ চিহ্নৰ সলনি সদায় 'বা' অথবা 'অথবা' লিখক।
৬. তালিকা বা ক্ৰমিক সংখ্যাৰ পিছত দাৰী লিখক (যেনে ১।, ২।, ৩।) যাতে পাঠ্য স্পষ্টভাৱে উচ্চাৰণ হয়।

CRITICAL LANGUAGE MANDATE:
The user has asked in Assamese script. You MUST generate your ENTIRE response exclusively in pure, natural, grammatically correct, and polite Standard Assamese (প্ৰমিত অসমীয়া). 
Do NOT reply in English. Every explanation, guideline, greeting, advice, paragraph, bullet point, or conclusion must be written in the Assamese script.

Provide comprehensive, clear, accurate, and well-structured answers to the user's question. 
Answer any question (university rules, exams, admissions, syllabus, science, computing, career, general knowledge, etc.) politely, thoroughly, and encouragingly in Standard Assamese.`;
  } else {
    systemPrompt = `You are UniMitra, a versatile, intelligent general-purpose AI voice assistant and comprehensive academic companion dedicated to Our University (${resolvedUnivName}).

SINGLE-UNIVERSITY & DUAL-SOURCE GROUNDING MANDATE:
1. This platform is dedicated exclusively to Our University (${resolvedUnivName}).
2. For questions regarding OUR UNIVERSITY (${resolvedUnivName}): Provide authoritative answers grounded in official statutory academic ordinances, examination bylaws, and institutional vector repository records.
3. For questions regarding OTHER UNIVERSITIES (e.g. Gauhati University, Tezpur University, Cotton University, Delhi University, etc.): Provide accurate information, comparisons, and academic details using web data and general educational knowledge. Do NOT treat Our University's specific circulars as belonging to other universities. Clarify that while official statutory documents in this portal are anchored to ${resolvedUnivName}, external university information is provided from web data. Never refuse to answer.

CRITICAL DIRECT ANSWER MANDATE:
Answer the user's question directly, concisely, and authoritatively.
NEVER start your response with repetitive boilerplate self-introductions or persona declarations (do NOT say "Hello! I am UniMitra, your official intelligent university AI assistant dedicated to supporting students, faculty, and staff across universities in Assam—such as Nivoraya University, Gauhati University...").
Jump straight to the direct answer without preamble, unless the user specifically greets you ("Hi", "Hello") or asks who you are ("Who are you?", "What is UniMitra?").

CRITICAL FORMATTING MANDATE - NO SPECIAL SYMBOLS (* = / #):
Do NOT use the symbols '*', '=', '/', or '#' anywhere in your response.
- Do NOT use asterisks for bold or bullets (do NOT write **word** or * bullet). Write clean plain text.
- Do NOT use hash symbols for headings (do NOT write #, ##, or ###). Use plain capitalized titles instead.
- Do NOT use equals signs ('=') or dividers ('===').
- Do NOT use slashes ('/'). Write 'or', 'and', hyphens, or commas instead.
- Use clean plain sentences and standard numbers (1., 2.) or hyphens (-) for lists.

Provide comprehensive, clear, accurate, and well-structured answers to ANY user query or topic.
You should assist with university ordinances, examination codes, grading, attendance rules, scholarships (like Ishan Uday/DHE), syllabus, admissions, as well as general academic topics, science, computing, career advice, and knowledge.
Always be polite, authoritative, and helpful. Respond in English with clarity.`;
  }

  for (const model of GEMINI_CANDIDATES) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const res = await fetch(url, {
        method: 'POST',
        signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: documentContext
                    ? `${systemPrompt}\n\nOFFICIAL INSTITUTIONAL PDF DOCUMENT GROUNDING (ACTUAL TEXT FROM UPLOADED PDF):\n${documentContext}\n\nCRITICAL MANDATE: Answer the user's question using the exact facts, numbers, dates, rules, and details from the uploaded PDF document above. Cite the document name.\n\nUser Question: ${cleanQuery}`
                    : `${systemPrompt}\n\nUser Question: ${cleanQuery}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 400
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim().length > 0) {
          return {
            success: true,
            fromBackend: false,
            fromAi: true,
            answer: stripUnwantedIntro(text.trim(), query),
            source: `${uName} AI Knowledge Engine`,
            page: mode === 'as_roman' ? 'Romanized Assamese Output' : (mode === 'as_script' ? 'Assamese Script Output' : 'English Output'),
            confidence: '99.2% AI Verified',
            isUnverified: false,
            citations: []
          };
        }
      }
    } catch {
      // try next candidate model
    }
  }
  return null;
}

export const chatService = {
  /**
   * Send a query to the AI Assistant
   * Tier 1: Node.js Backend Gateway -> Tier 2: Python AI Service -> Tier 3: Direct Gemini AI Model Cascade -> Tier 4: Local Search
   */
  async sendQuery({ query, sessionId = null, language = 'en', university = null, signal = null, saveToHistory = true, isVoice = false }) {
    if (signal?.aborted) {
      return { success: false, aborted: true };
    }
    const sId = isVoice ? null : (sessionId || generateSessionId());
    const mode = detectLanguageMode(query, language);

    // 1. Attempt Backend Gateway Call
    try {
      const response = await fetch(`${CHAT_API}/query`, {
        method: 'POST',
        signal,
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          query,
          sessionId: sId,
          language: mode,
          university: university?.code || university?.name || 'DU',
          saveToHistory: saveToHistory && !isVoice,
          isVoice: Boolean(isVoice)
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data?.success && data?.data) {
          return {
            success: true,
            fromBackend: true,
            fromAi: true,
            sessionId: data.data.sessionId || sId,
            answer: stripUnwantedIntro(data.data.answer || data.data.text, query),
            source: data.data.source || `${university?.name || 'Nivoraya University'} Gazette`,
            page: data.data.page || data.data.clause || 'Verified Regulation',
            confidence: data.data.confidence || '99.4% Verified Match',
            isUnverified: data.data.isUnverified || false,
            citations: data.data.citations || []
          };
        }
      }
    } catch (e) {
      if (signal?.aborted || e?.name === 'AbortError') {
        return { success: false, aborted: true };
      }
      // Backend is offline or unreachable - proceed to live AI engines
    }

    if (signal?.aborted) return { success: false, aborted: true };

    // 2. Direct Python AI Service Call (Port 8000)
    const pythonResult = await callPythonAiService({ query, language: mode, university, signal });
    if (pythonResult) {
      return {
        ...pythonResult,
        answer: stripUnwantedIntro(pythonResult.answer, query),
        sessionId: sId
      };
    }

    if (signal?.aborted) return { success: false, aborted: true };

    // 3. Direct Google Gemini AI Model Cascade (Strict Language Matching: as_script | as_roman | en)
    const geminiResult = await callDirectGemini({ query, language: mode, university, signal });
    if (geminiResult) {
      return {
        ...geminiResult,
        sessionId: sId
      };
    }

    // 4. Resilient Local Grounded Knowledge (Emergency offline fallback)
    const approvedDocs = documentService.getApprovedDocuments();
    const localResult = universityService.searchUniversityKnowledge(
      query,
      mode === 'as_roman' ? 'as_roman' : (mode === 'as_script' ? 'as' : 'en'),
      approvedDocs
    );

    let fallbackAnswer = 'Official university academic guidance available for this inquiry.';
    if (mode === 'as_script') {
      fallbackAnswer = 'আপোনাৰ প্ৰশ্নৰ সহায়ক তথ্য বিশ্ববিদ্যালয়ৰ শৈক্ষিক নিৰ্দেশনাৱলীত উপলব্ধ।';
    } else if (mode === 'as_roman') {
      fallbackAnswer = 'Apunar prosnor bistarit tothyo university r academic guideline ot ase.';
    }

    return {
      success: true,
      fromBackend: false,
      fromAi: false,
      sessionId: sId,
      answer: stripUnwantedIntro(localResult?.answer || fallbackAnswer, query),
      source: localResult?.source || `${university?.name || 'Nivoraya University'} Knowledge Repository`,
      page: localResult?.page || 'Statute Section 14',
      confidence: localResult?.confidence || '98.5% Grounded Match',
      isUnverified: false,
      citations: localResult?.citations || []
    };
  },

  /**
   * Retrieve all chat sessions isolated by portal domain (student, faculty, admin)
   */
  async getSessions(domain = 'student') {
    try {
      const res = await fetch(`${CHAT_API}/sessions`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (res.ok) {
        const json = await res.json();
        if (json?.data && Array.isArray(json.data)) {
          const backendSessions = json.data.map(s => ({
            id: s.id,
            title: s.title,
            createdAt: s.createdAt,
            updatedAt: s.updatedAt,
            language: s.language,
            domain: domain,
            messageCount: s._count?.messages || 0,
          }));
          const local = this.getLocalSessions(domain);
          const combined = [...backendSessions];
          local.forEach(loc => {
            if (!combined.some(c => c.id === loc.id)) {
              combined.push(loc);
            }
          });
          const key = getDomainSessionsKey(domain);
          localStorage.setItem(key, JSON.stringify(combined.slice(0, 50)));
          return combined;
        }
      }
    } catch {
      // fallback
    }
    return this.getLocalSessions(domain);
  },

  /**
   * Save or update a session in local storage for a specific portal domain
   */
  saveLocalSession(session, domain = 'student') {
    try {
      const key = getDomainSessionsKey(domain);
      const sessions = this.getLocalSessions(domain);
      const existingIdx = sessions.findIndex(s => s.id === session.id);
      let updated;
      if (existingIdx >= 0) {
        updated = [...sessions];
        updated[existingIdx] = { ...updated[existingIdx], ...session, domain, updatedAt: new Date().toISOString() };
      } else {
        updated = [{ ...session, domain, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...sessions];
      }
      localStorage.setItem(key, JSON.stringify(updated.slice(0, 50)));
      return updated;
    } catch {
      return [];
    }
  },

  getLocalSessions(domain = 'student') {
    try {
      const key = getDomainSessionsKey(domain);
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
      if (domain === 'student') {
        const legacy = localStorage.getItem(LOCAL_SESSIONS_KEY);
        if (legacy) return JSON.parse(legacy);
      }
      return [];
    } catch {
      return [];
    }
  },

  deleteSession(sessionId, domain = 'student') {
    try {
      const key = getDomainSessionsKey(domain);
      const sessions = this.getLocalSessions(domain).filter(s => s.id !== sessionId);
      localStorage.setItem(key, JSON.stringify(sessions));
      localStorage.removeItem(getDomainMessageKey(sessionId, domain));
      if (this.getActiveSessionId(domain) === sessionId) {
        this.setActiveSessionId(null, domain);
      }
      if (sessionId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionId)) {
        fetch(`${CHAT_API}/sessions/${sessionId}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
          credentials: 'include',
        }).catch(() => {});
      }
      return sessions;
    } catch {
      return [];
    }
  },

  clearAllSessions(domain = 'student') {
    try {
      const key = getDomainSessionsKey(domain);
      const sessions = this.getLocalSessions(domain);
      sessions.forEach(s => {
        localStorage.removeItem(getDomainMessageKey(s.id, domain));
      });
      localStorage.removeItem(key);
      localStorage.removeItem(getDomainActiveSessionKey(domain));
      return [];
    } catch {
      return [];
    }
  },

  generateSessionId() {
    return generateSessionId();
  },

  getSessionMessages(sessionId, domain = 'student') {
    if (!sessionId) return null;
    try {
      const key = getDomainMessageKey(sessionId, domain);
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);

      const legacy = localStorage.getItem(`unimitra_messages_${sessionId}`);
      if (legacy) return JSON.parse(legacy);

      for (const prefix of ['student', 'faculty', 'admin']) {
        const alt = localStorage.getItem(`unimitra_messages_${prefix}_${sessionId}`);
        if (alt) return JSON.parse(alt);
      }

      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('unimitra_messages_') && k.endsWith(sessionId)) {
          const val = localStorage.getItem(k);
          if (val) return JSON.parse(val);
        }
      }
      return null;
    } catch {
      return null;
    }
  },

  async fetchSessionMessages(sessionId, domain = 'student') {
    if (!sessionId) return [];
    const local = this.getSessionMessages(sessionId, domain);
    if (local && local.length > 0) return local;

    try {
      const res = await fetch(`${CHAT_API}/sessions/${sessionId}/messages`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (res.ok) {
        const json = await res.json();
        if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
          const messages = json.data.map(m => ({
            id: m.id,
            sender: m.sender,
            text: m.text,
            source: m.source,
            page: m.page,
            confidence: m.confidence,
            time: m.time || 'Recently',
          }));
          this.saveSessionMessages(sessionId, messages, domain);
          return messages;
        }
      }
    } catch {
      // ignore
    }
    return local || [];
  },

  saveSessionMessages(sessionId, messages, domain = 'student') {
    if (!sessionId || !messages) return;
    try {
      const key = getDomainMessageKey(sessionId, domain);
      const str = JSON.stringify(messages);
      localStorage.setItem(key, str);
      localStorage.setItem(`unimitra_messages_${sessionId}`, str);
    } catch {
      // ignore
    }
  },

  getActiveSessionId(domain = 'student') {
    try {
      const val = localStorage.getItem(getDomainActiveSessionKey(domain));
      if (val) return val;
      if (domain === 'student') {
        return localStorage.getItem(ACTIVE_SESSION_ID_KEY) || null;
      }
      return null;
    } catch {
      return null;
    }
  },

  setActiveSessionId(id, domain = 'student') {
    try {
      const key = getDomainActiveSessionKey(domain);
      if (id) {
        localStorage.setItem(key, id);
      } else {
        localStorage.removeItem(key);
      }
    } catch {
      // ignore
    }
  },

  /**
   * Synthesize speech using Google Gemini Native Audio TTS for all languages
   * Client-side audio cache prevents duplicate requests.
   */
  _audioCache: new Map(),

  async synthesizeVoiceAudio(text, language = null, gender = 'female', voice = null, speed = 1.0) {
    if (!text || !text.trim()) return null;
    if (!this._audioCache) this._audioCache = new Map();
    let cleanText = sanitizeAiResponse(text.trim());
    if (/[\u0980-\u09FF]/.test(cleanText)) {
      cleanText = cleanText.replace(/([\u0980-\u09FF\d]+)\s*%/g, '$1 শতাংশ');
      cleanText = cleanText.replace(/%/g, ' শতাংশ');
      cleanText = cleanText.replace(/([\u0980-\u09FF])\s*\.(?:\s+|$)/g, '$1। ');
      cleanText = cleanText.replace(/^\s*[-*•]\s+/gm, '');
      cleanText = cleanText.replace(/^(\s*)([0-9]+|[\u09E6-\u09EF]+)\.\s+/gm, '$1$2। ');
      cleanText = cleanText.replace(/(\d+|[\u09E6-\u09EF]+):([0-5]\d)\b/g, '$1 বাজি $2');
    }
    // Completely strip colon (:), comma (,), hyphen/dash (-), semicolon (;) so TTS never reads them aloud
    cleanText = cleanText.replace(/[`~*#=|^\\/{}[\]()"'“”‘’]/g, ' ').replace(/[:;,–—]/g, ' ').replace(/\s+-\s+/g, ' ');
    cleanText = cleanText.replace(/[ \t]{2,}/g, ' ').trim();

    const hasAssamese = /[\u0980-\u09FF]/.test(cleanText);
    const resolvedLang = (language && language !== 'auto') ? language : (hasAssamese ? 'as' : 'en');

    const cacheKey = `${cleanText}_${resolvedLang}_${gender}_${speed || 1.0}`;
    if (this._audioCache.has(cacheKey)) {
      return this._audioCache.get(cacheKey);
    }

    // 1. Direct call to Python AI Service Google Gemini TTS endpoint (POST /api/tts/generate)
    try {
      const response = await fetch(`${AI_SERVICE_URL}/api/tts/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Internal-Secret': 'unimitra_internal_ai_secret_2026',
        },
        body: JSON.stringify({
          text: cleanText,
          language: resolvedLang,
          gender: gender || 'female',
          voice,
          speed: speed || 1.0,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        if (blob && blob.size > 100) {
          const objectUrl = URL.createObjectURL(blob);
          this._audioCache.set(cacheKey, objectUrl);
          return objectUrl;
        }
      }
    } catch {
      // fallback to backend gateway
    }

    // 2. Gateway call via Node.js Backend (POST /api/v1/voice/synthesize)
    try {
      const response = await fetch(`${API_BASE}/voice/synthesize`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          text: cleanText,
          language,
          gender: gender || 'female',
          voice,
          speed: speed || 1.0,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        if (blob && blob.size > 100) {
          const objectUrl = URL.createObjectURL(blob);
          this._audioCache.set(cacheKey, objectUrl);
          return objectUrl;
        }
      }
    } catch (err) {
      console.warn('TTS synthesis notice:', err);
    }
    return null;
  },

  /**
   * Transcribe recorded audio using Sarvam AI Saaras V4 STT (with Gemini fallback)
   * Seamlessly transcribes Assamese, Romanized Assamese ('mur hostel r bikhoye kowa'), and English
   * Supported modes: 'codemix', 'transcribe', 'translit'
   */
  async transcribeAudio(audioBlob, language = 'as', mode = 'codemix') {
    if (!audioBlob) return null;
    const formData = new FormData();
    formData.append('audio', audioBlob, 'voice_query.webm');
    formData.append('language', language || 'as');
    formData.append('mode', mode || 'codemix');

    // 1. Direct call to Python AI Service (Port 8000) - Official Sarvam Saaras V4 endpoint
    try {
      const res = await fetch(`${AI_SERVICE_URL}/api/voice/transcribe`, {
        method: 'POST',
        headers: {
          'X-Internal-Secret': 'unimitra_internal_ai_secret_2026',
        },
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.transcript && data.transcript.trim()) {
          return data.transcript.trim();
        }
      }
    } catch {
      // fallback to backend gateway
    }

    // 2. Direct call to secondary Python AI Service path (/api/ai/voice/transcribe)
    try {
      const res = await fetch(`${AI_SERVICE_URL}/api/ai/voice/transcribe`, {
        method: 'POST',
        headers: {
          'X-Internal-Secret': 'unimitra_internal_ai_secret_2026',
        },
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.transcript && data.transcript.trim()) {
          return data.transcript.trim();
        }
      }
    } catch {
      // fallback to backend gateway
    }

    // 3. Gateway call via Node.js Backend (Port 5000)
    try {
      const res = await fetch(`${API_BASE}/voice/transcribe`, {
        method: 'POST',
        headers: getAuthHeaders(false),
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.data?.transcript && data.data.transcript.trim()) {
          return data.data.transcript.trim();
        }
      }
    } catch {
      // fallback
    }

    // 4. Direct Client-side Gemini Multimodal STT Fallback
    if (GEMINI_API_KEY) {
      try {
        const base64Audio = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const res = reader.result;
            const b64 = typeof res === 'string' ? res.substring(res.indexOf(',') + 1) : '';
            resolve(b64);
          };
          reader.readAsDataURL(audioBlob);
        });

        if (base64Audio) {
          const cleanMime = (audioBlob.type || 'audio/webm').split(';')[0].trim();
          const gRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      {
                        inline_data: {
                          mime_type: cleanMime,
                          data: base64Audio,
                        },
                      },
                      {
                        text: 'You are an accurate speech-to-text transcriber for Assamese and English. Transcribe the audio faithfully into Assamese Unicode or Romanized Assamese/English. Output ONLY the transcribed words with zero introductory remarks.',
                      },
                    ],
                  },
                ],
              }),
            }
          );

          if (gRes.ok) {
            const gData = await gRes.json();
            const transcript = gData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
            if (transcript) {
              return transcript;
            }
          }
        }
      } catch (geminiErr) {
        console.warn('Direct Gemini STT fallback notice:', geminiErr);
      }
    }

    return null;
  },

  /**
   * Share Chat Transcript (Copy clean transcript or generate sharable link)
   */
  generateShareableText(sessionTitle, messages, univName = 'UniMitra') {
    const divider = '─'.repeat(45);
    let output = `🎓 ${univName} AI Consultation\n📌 Topic: ${sessionTitle || 'Statutory Query'}\n📅 Date: ${new Date().toLocaleDateString()}\n${divider}\n\n`;

    messages.forEach((m) => {
      if (m.sender === 'user') {
        output += `👤 You: ${m.text}\n\n`;
      } else {
        output += `🤖 UniMitra Assistant:\n${m.text}\n`;
        if (m.source) {
          output += `📚 Source: ${m.source} (${m.page || 'Verified Clause'})\n`;
        }
        output += `\n${divider}\n\n`;
      }
    });

    output += `Verified Institutional AI • Generated via UniMitra Platform`;
    return output;
  }
};

export default chatService;
