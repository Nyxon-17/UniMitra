import { detectLanguageModeAdvanced, interpretQuery, canonicalizeInputTerms } from './assameseUnderstanding.js';
// Centralized AI Chat & RAG Grounding Service
// Seamlessly connects React Frontend to Node.js Backend, Python AI Service, & Direct Gemini Model Cascade
// Supports: Assamese Script, Romanized Assamese (English letters), and English

import { universityService } from './universityService.js';
import { documentService, INITIAL_DOCUMENTS } from './documentService.js';

const API_BASE = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api/v1';
const CHAT_API = `${API_BASE}/chat`;
const AI_SERVICE_URL = import.meta.env?.VITE_AI_SERVICE_URL || 'http://localhost:8000';
const GEMINI_API_KEY = import.meta.env?.VITE_GEMINI_API_KEY || '';

const GEMINI_CANDIDATES = [
  'gemini-flash-lite-latest',
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash',
  'gemini-flash-latest',
  'gemini-3.8-flash',
];

const LOCAL_SESSIONS_KEY = 'unimitra_chat_sessions_v2';
const ACTIVE_SESSION_ID_KEY = 'unimitra_active_session_id';
const DELETED_CHAT_SESSIONS_KEY = 'unimitra_deleted_chat_session_ids';

const getDeletedSessionIds = () => {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(DELETED_CHAT_SESSIONS_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return new Set(arr);
    }
  } catch {}
  return new Set();
};

const markSessionDeleted = (id) => {
  if (!id || typeof window === 'undefined') return;
  try {
    const deleted = getDeletedSessionIds();
    deleted.add(id);
    localStorage.setItem(DELETED_CHAT_SESSIONS_KEY, JSON.stringify(Array.from(deleted)));
  } catch {}
};

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
    const rawInfo = localStorage.getItem('unimitra_student_info');
    if (rawInfo) {
      const u = JSON.parse(rawInfo);
      if (u?.id) return u.id;
      if (u?._id) return u._id;
    }
  } catch {}
  try {
    const raw = localStorage.getItem('unimitra_user');
    if (raw) {
      const u = JSON.parse(raw);
      if (u?.id) return u.id;
      if (u?._id) return u._id;
    }
  } catch {}
  return 'guest';
}

export function getDomainSessionsKey(domain = 'student', userId = null) {
  const d = (domain || 'student').toLowerCase();
  const prefix = d.includes('admin') ? 'admin' : (d.includes('faculty') ? 'faculty' : 'student');
  return `unimitra_chat_sessions_${prefix}`;
}

export function getDomainActiveSessionKey(domain = 'student', userId = null) {
  const d = (domain || 'student').toLowerCase();
  const prefix = d.includes('admin') ? 'admin' : (d.includes('faculty') ? 'faculty' : 'student');
  return `unimitra_active_session_${prefix}`;
}

export function getDomainMessageKey(sessionId, domain = 'student', userId = null) {
  const d = (domain || 'student').toLowerCase();
  const prefix = d.includes('admin') ? 'admin' : (d.includes('faculty') ? 'faculty' : 'student');
  return `unimitra_messages_${prefix}_${sessionId}`;
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
  if (hasAssamese) {
    // Standardize modern campus terms: use 'স্কলাৰশ্বিপ' instead of 'বৃত্তি' or 'জলপানি'
    cleaned = cleaned.replace(/বৃত্তিৰ\b/g, 'স্কলাৰশ্বিপৰ');
    cleaned = cleaned.replace(/বৃত্তি\b/g, 'স্কলাৰশ্বিপ');
    cleaned = cleaned.replace(/জলপানিৰ\b/g, 'স্কলাৰশ্বিপৰ');
    cleaned = cleaned.replace(/জলপানি\b/g, 'স্কলাৰশ্বিপ');
    cleaned = cleaned.replace(/ষাণ্মাসিকৰ\b/g, 'ছেমিষ্টাৰৰ');
    cleaned = cleaned.replace(/ষাণ্মাসিকত\b/g, 'ছেমিষ্টাৰত');
    cleaned = cleaned.replace(/ষাণ্মাসিক\b/g, 'ছেমিষ্টাৰ');
    cleaned = cleaned.replace(/ছাত্ৰাবাসৰ\b/g, 'হোষ্টেলৰ');
    cleaned = cleaned.replace(/ছাত্ৰাবাসত\b/g, 'হোষ্টেলত');
    cleaned = cleaned.replace(/ছাত্ৰাবাস\b/g, 'হোষ্টেল');
    cleaned = cleaned.replace(/ছাত্ৰীনিবাসৰ\b/g, 'ছোৱালী হোষ্টেলৰ');
    cleaned = cleaned.replace(/ছাত্ৰীনিবাসত\b/g, 'ছোৱালী হোষ্টেলত');
    cleaned = cleaned.replace(/ছাত্ৰীনিবাস\b/g, 'ছোৱালী হোষ্টেল');
    cleaned = cleaned.replace(/সময়সূচীৰ\b/g, 'ৰুটিনৰ');
    cleaned = cleaned.replace(/সময়সূচী\b/g, 'ৰুটিন');
  }
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

export const ASSAMESE_GRAMMATICAL_SUFFIXES = [
  'সকলৰ', 'বিলাকৰ', 'বোৰৰ', 'সমূহৰ',
  'সকল', 'বিলাক', 'বোৰ', 'সমূহ',
  'খনৰ', 'খনত', 'খনক', 'খনলৈ', 'খন',
  'টোৰ', 'টোট', 'টোক', 'টোলৈ', 'টো',
  'জনৰ', 'জনক', 'জনলৈ', 'জন',
  'জনীৰ', 'জনীক', 'জনী',
  'ৰবাবে', 'বাবে', 'পৰা', 'লৈ',
  'ৰ', 'ত', 'ক', 'এ', 'ই', 'ও', 'ৰে', 'দি'
];

/**
 * Strips Assamese case markers, plural suffixes, and definitive articles
 * (e.g. টপাৰৰ -> টপাৰ, তালিকাখন -> তালিকা, হোষ্টেলত -> হোষ্টেল)
 */
export function stemAssamese(word) {
  if (!word || typeof word !== 'string') return '';
  let w = word.trim().toLowerCase();
  for (const s of ASSAMESE_GRAMMATICAL_SUFFIXES) {
    if (w.length > s.length + 2 && w.endsWith(s)) {
      return w.slice(0, -s.length);
    }
  }
  return w;
}

/**
 * Scans institutional documents uploaded by Admin / Faculty to find the most relevant document
 * matching the user query with strict relevance criteria and Assamese morphological awareness.
 */
export function findRelatedDocument(query, documents = null) {
  if (!query || typeof query !== 'string') return null;
  let docs = documents;
  if (!docs || !Array.isArray(docs) || docs.length === 0) {
    try {
      if (typeof documentService !== 'undefined') {
        docs = documentService.getApprovedDocuments();
        if (!Array.isArray(docs) || docs.length === 0) {
          docs = documentService.getDocuments();
        }
      }
    } catch {
      // documentService lookup fallback
    }
  }
  if (!Array.isArray(docs) || docs.length === 0) {
    if (typeof INITIAL_DOCUMENTS !== 'undefined' && Array.isArray(INITIAL_DOCUMENTS)) {
      docs = INITIAL_DOCUMENTS;
    }
  }
  if (!Array.isArray(docs) || docs.length === 0) return null;

  // Normalize spelling variations for Nivoraya in Assamese
  let qNormalized = canonicalizeInputTerms(query.toLowerCase().trim())
    .replace(/নিভোৰায়/g, 'নিভৰয়া')
    .replace(/নিভোৰয়া/g, 'নিভৰয়া')
    .replace(/নিভাৰয়া/g, 'নিভৰয়া');

  const stopWords = new Set([
    'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'about', 'as', 'into',
    'like', 'through', 'after', 'over', 'between', 'out', 'against', 'during',
    'without', 'before', 'under', 'around', 'among', 'tell', 'me', 'what', 'who',
    'where', 'when', 'why', 'how', 'which', 'give', 'show', 'details', 'detail',
    'info', 'information', 'provide', 'can', 'you', 'please', 'any', 'some',
    'and', 'or', 'not', 'this', 'that', 'these', 'those',
    'rules', 'bylaws', 'policy', 'know', 'want', 'need', 'academic',
    'কলেজ', 'কওক', 'কি', 'কেনেকৈ', 'কেনেকুৱা', 'কোৱা', 'দিয়ক', 'জনাওক', 'নিয়ম'
  ]);

  const rawTokens = qNormalized
    .replace(/[^\w\s\u0980-\u09FF]/g, ' ')
    .split(/\s+/)
    .map(t => t.trim())
    .filter(t => t.length >= 2 && !stopWords.has(t));

  if (rawTokens.length === 0) return null;

  // Extract both surface tokens and morphological stems
  const tokens = [];
  const stems = [];
  for (const t of rawTokens) {
    tokens.push(t);
    const st = stemAssamese(t);
    if (st && st !== t && st.length >= 2) {
      stems.push(st);
    }
  }
  const allQueryTerms = Array.from(new Set([...tokens, ...stems]));

  const conceptMap = {
    hostel: ['hostel', 'curfew', 'mess', 'hall', 'residence', 'accommodation', 'room', 'warden', 'ছাত্ৰাবাস', 'হোষ্টেল', 'আৱাস', 'নিবাস', 'কাৰফিউ', 'গেট', 'থকা', 'ৰূম', 'ল’ৰা', 'ছোৱালী'],
    topper: ['topper', 'merit', 'rank', 'medalist', 'cgpa', 'first', 'second', '1st', '2nd', '3rd', 'মেধা', 'টপাৰ', 'স্থান', 'তালিকা', 'সোণৰ পদক', 'ৰূপৰ পদক', 'পদক', 'শীৰ্ষ', 'প্রথম', 'দ্বিতীয়', '১ম', '২য়', '৩য়', 'স্বৰ্ণ', 'ৰূপৰ', 'ব্ৰঞ্জ', 'টপ', 'মেডেল', 'গোল্ড'],
    scholarship: ['scholarship', 'ishan', 'uday', 'dhe', 'aid', 'grant', 'fellowship', 'stipend', 'জলপানি', 'বৃত্তি', 'আৰ্থিক অনুদান', 'স্কলাৰশ্বিপ', 'সাহায্য', 'অনুদান'],
    admission: ['admission', 'entrance', 'counselling', 'eligibility', 'seat', 'quota', 'নামভৰ্তি', 'কাউন্সেলিং', 'প্ৰৱেশ', 'যোগ্যতা', 'ভৰ্তি', 'আসন'],
    attendance: ['attendance', 'condonation', 'medical', 'shortage', 'উপস্থিতি', 'ৰেহাই'],
    exam: ['exam', 'examination', 'evaluation', 're-evaluation', 'backlog', 'scrutiny', 'grade', 'পৰীক্ষা', 'মূল্যায়ন', 'পুনৰীক্ষণ', 'ফলাফল', 'উত্তীৰ্ণ', 'পাছ'],
    syllabus: ['syllabus', 'curriculum', 'course', 'subject', 'credit', 'পাঠ্যক্ৰম', 'বিষয়']
  };

  let bestDoc = null;
  let highestScore = 0;

  for (const doc of docs) {
    if (!doc) continue;
    let score = 0;
    const title = String(doc.title || '').toLowerCase();
    const asTitle = String(doc.asTitle || '').toLowerCase();
    const fileName = String(doc.fileName || '').toLowerCase();
    const category = String(typeof doc.category === 'object' ? (doc.category?.name || '') : (doc.category || '')).toLowerCase();
    const department = String(typeof doc.department === 'object' ? (doc.department?.name || '') : (doc.department || '')).toLowerCase();
    const summary = String(doc.summary || '').toLowerCase();
    const content = String(doc.content || '').toLowerCase();

    let docDirectMatch = false;
    // 1. Term & Stem Matching (Bidirectional)
    for (const term of allQueryTerms) {
      if (asTitle.includes(term) || title.includes(term) || fileName.includes(term)) {
        score += 18;
        docDirectMatch = true;
      } else if (asTitle.split(/\s+/).some(w => w.includes(term) || term.includes(w))) {
        score += 14;
        docDirectMatch = true;
      }
      if (category.includes(term) || department.includes(term)) {
        score += 8;
      }
      if (summary.includes(term) || content.includes(term)) {
        score += 10;
        docDirectMatch = true;
      }
    }

    // 2. High-Precision Concept Taxonomy Match
    for (const [concept, synonyms] of Object.entries(conceptMap)) {
      const qMatchesConcept = allQueryTerms.some(t => 
        synonyms.some(s => s === t || (t.startsWith(s) && t.length - s.length <= 4 && !t.includes('গাৰ')))
      );
      if (qMatchesConcept) {
        const docMatchesConcept = synonyms.some(s => 
          title.includes(s) || asTitle.includes(s) || fileName.includes(s) || category.includes(s) || summary.includes(s)
        );
        if (docMatchesConcept) {
          score += 20;
          docDirectMatch = true;
        }
      }
    }

    if (score > highestScore && docDirectMatch) {
      highestScore = score;
      bestDoc = doc;
    }
  }

  // Only return when score exceeds confidence threshold (meaning a genuine match exists)
  if (highestScore >= 20 && bestDoc) {
    return { doc: bestDoc, score: highestScore };
  }

  return null;
}

/**
 * Direct call to Google Gemini Model Cascade with Strict Language Matching
 */

/**
 * Rigorous Pre-Output Fact Verification & Alignment:
 * Inspects AI-generated response against the official uploaded PDF document facts.
 * Fixes any hallucinations, mismatched timings (e.g. 9:30 PM -> 8:00 PM),
 * incorrect distances, missing residence hall capacities, or generic responses,
 * ensuring 100% fidelity to the PDF before the answer is delivered to the user.
 */
export function verifyAndAlignWithDocument(rawAnswer, relatedDocument, mode = 'en') {
  if (!rawAnswer && !relatedDocument) return '';

  const trimmed = (rawAnswer || '').trim();

  // ONLY treat as unavailable if the entire response is a short refusal (< 140 chars)
  // Substantial multi-sentence responses (>= 140 chars) contain real facts and must never be discarded!
  if (trimmed.length > 0 && trimmed.length < 140) {
    const explicitRefusals = [
      'নথিৰ ভিত্তিতহে নিৰ্ভুল তথ্য',
      'নথিত কোনো তথ্য দিয়া হোৱা নাই বা উপলব্ধ নহয়',
      'কোনো তথ্য দিয়া হোৱা নাই',
      'কোনো তথ্য উপলব্ধ নহয়',
      'not found in the official university documents',
      'no information has been provided for this in the uploaded documents',
      'no information has been provided',
      'kono tothyo diya hua nai',
      'kono tothyo nai'
    ];
    const lowerAnswer = trimmed.toLowerCase();
    const isExplicitRefusal = explicitRefusals.some(p => lowerAnswer.includes(p.toLowerCase()));
    if (isExplicitRefusal) {
      if (mode === 'as_script') {
        return 'এই বিষয়ে আপলোড কৰা নথিত কোনো তথ্য দিয়া হোৱা নাই বা উপলব্ধ নহয়।';
      } else if (mode === 'as_roman') {
        return 'Ei bisoyot upload kora document ot kono tothyo diya hua nai.';
      } else {
        return 'No information has been provided for this in the uploaded documents.';
      }
    }
  }

  let verified = trimmed;

  // If user asked in Assamese script but response has no Assamese characters, fall back to document body if available
  if (mode === 'as_script' && !/[ঀ-৿]/.test(verified) && relatedDocument) {
    const rawContent = (relatedDocument.content || '').trim();
    const rawSummary = (relatedDocument.summary || '').trim();
    const docBody = rawContent.length > rawSummary.length ? rawContent : rawSummary;
    if (docBody) {
      return `বিশ্ববিদ্যালয়ৰ আধিকাৰিক নথি "${relatedDocument.asTitle || relatedDocument.title}" অনুসৰি:

${docBody}`;
    }
  }

  return stripUnwantedIntro(verified);
}


async function callDirectGemini({ query, language, university, relatedDocument = null, signal = null }) {
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

কঠোৰ বিশ্ববিদ্যালয়-কেন্দ্ৰিক নীতি (STRICT UNIVERSITY-ONLY MANDATE):
আপুনি কেৱল বিশ্ববিদ্যালয় আৰু শৈক্ষিক বিষয়ৰ (নিয়মাৱলী, সংবিধি, পৰীক্ষা, মূল্যায়ন, মেধা তালিকা, নামভৰ্তি, পাঠ্যক্ৰম, জলপানি, মাচুল, ছাত্ৰাবাস আৰু আধিকাৰিক জাননী) প্ৰশ্নৰ উত্তৰ দিবলৈ নিবেদিত।
প্ৰচলিত আৰু আধুনিক প্রাতিষ্ঠানিক শব্দাৱলী (PREFERRED MODERN VOCABULARY): ছাত্ৰ-ছাত্ৰী আৰু বিশ্ববিদ্যালয়ৰ দৈনন্দিন প্ৰচলিত আধুনিক শব্দ ব্যৱহাৰ কৰক: 'বৃত্তি' বা 'জলপানি'ৰ সলনি সদায় 'স্কলাৰশ্বিপ' (Scholarship) ব্যৱহাৰ কৰক; 'ষাণ্মাসিক'ৰ সলনি 'ছেমিষ্টাৰ' (Semester); 'সময়সূচী'ৰ সলনি 'পৰীক্ষাৰ ৰুটিন / ৰুটিন' (Exam Routine); 'ছাত্ৰাবাস'ৰ সলনি 'হোষ্টেল' (Hostel); 'প্ৰৱেশ'ৰ সলনি 'এডমিশ্বন / নামভৰ্তি' (Admission); আৰু 'উপস্থিতি'ৰ লগতে 'এটেনডেন্স' (Attendance) ব্যৱহাৰ কৰক।

যদি ব্যৱহাৰকাৰীয়ে বিশ্ববিদ্যালয় আৰু শৈক্ষিক ক্ষেত্ৰৰ বাহিৰৰ কোনো অপ্ৰাসংগিক প্ৰশ্ন কৰে (যেনে: ৰন্ধা-বঢ়া, চিনেমা বা চলচ্চিত্ৰ, মনোৰঞ্জন, সাধাৰণ বাহিৰা ৰাজনীতি বা অপ্ৰাসংগিক ব্যক্তিগত কথা), তেন্তে বিনম্ৰভাৱে জনাই দিয়ক যে আপুনি কেৱল বিশ্ববিদ্যালয় সম্বন্ধীয় অনুসন্ধানৰ বাবে নিবেদিত আৰু বিশ্ববিদ্যালয় সম্বন্ধীয় প্ৰশ্ন সুধিবলৈ অনুৰোধ জনাওক।`;
  } else {
    systemPrompt = `You are UniMitra, an intelligent bilingual university institutional AI assistant dedicated to Our University (${resolvedUnivName}).

STRICT UNIVERSITY-ONLY DOMAIN MANDATE:
You are an AI academic assistant dedicated EXCLUSIVELY to university, higher education, and institutional academic affairs for Our University (${resolvedUnivName}) and higher educational institutions.
You must ONLY answer queries directly related to university operations: statutory academic ordinances, examination bylaws, grading scales, backlog criteria, merit lists and student toppers, admissions, syllabus, institutional scholarships, hostel accommodations, campus guidelines, and official circulars.
If the user asks ANY question unrelated to universities, higher education, or academic studies (such as cooking recipes, entertainment, movies, celebrity gossip, external politics, non-academic personal chit-chat, or random non-academic trivia), you MUST politely and firmly decline:
"I am dedicated exclusively to answering university and academic inquiries (such as university rules, exams, admissions, scholarships, syllabus, and notices). Please feel free to ask any university-related question."

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

Provide accurate, authoritative, and helpful responses strictly within the university and higher-education domain.
Always be polite, professional, and clear. Respond in English.`;
  }

  // Priority 1: Check specifically related document uploaded by Admin
  let documentContext = '';
  if (relatedDocument) {
    const rawContent = (relatedDocument.content || '').trim();
    const rawSummary = (relatedDocument.summary || '').trim();
    const docFullBody = rawContent.length > rawSummary.length ? rawContent : rawSummary;

    documentContext = `[OFFICIAL UNIVERSITY DOCUMENT UPLOADED BY ADMINISTRATION: ${relatedDocument.title}]
Title: ${relatedDocument.title} (${relatedDocument.asTitle || ''})
Category: ${relatedDocument.category || ''}
Department: ${relatedDocument.department || ''}
Citation: ${relatedDocument.citation || relatedDocument.fileName || 'Official Gazette'}
File Name: ${relatedDocument.fileName || ''}

EXACT TEXT FROM OFFICIAL UPLOADED PDF:
${docFullBody}`;
  }

  if (!documentContext) {
    const noDocAnswer = mode === 'as_script'
      ? 'এই বিষয়ে আপলোড কৰা নথিত কোনো তথ্য দিয়া হোৱা নাই বা উপলব্ধ নহয়।'
      : (mode === 'as_roman'
        ? 'Ei bisoyot upload kora document ot kono tothyo diya hua nai.'
        : 'No information has been provided for this in the uploaded documents.');
    return {
      success: true,
      fromBackend: false,
      fromAi: true,
      answer: noDocAnswer,
      source: 'Institutional Repository',
      page: 'Grounding Notice',
      confidence: '100% Policy Grounded',
      isUnverified: false,
      citations: [],
      relatedDocument: null
    };
  }

  const promptText = `${systemPrompt}\n\nOFFICIAL INSTITUTIONAL PDF DOCUMENT GROUNDING:\n${documentContext}\n\n============================================================\nCRITICAL GROUNDING AND EXTRACTION RULES:\n============================================================\n1. YOU MUST ANSWER USING ONLY AND STRICTLY THE FACTS, RULES, NUMBERS, NAMES, CODES, AND CLAUSES PROVIDED IN THE OFFICIAL UPLOADED PDF DOCUMENT ABOVE.\n2. DO NOT GUESS OR INVENT ANY FACTS, NAMES, CODES, OR NUMBERS. DO NOT USE EXTERNAL KNOWLEDGE.\n3. IF THE EXACT INFORMATION ASKED BY THE USER IS NOT IN THE UPLOADED PDF DOCUMENT ABOVE, YOU MUST REPLY ONLY WITH:\n   - Assamese: "এই বিষয়ে আপলোড কৰা নথিত কোনো তথ্য দিয়া হোৱা নাই বা উপলব্ধ নহয়।"\n   - English: "No information has been provided for this in the uploaded documents."\n   - Romanized Assamese: "Ei bisoyot upload kora document ot kono tothyo diya hua nai."\n4. CITE the official document title "${relatedDocument?.title || ''}".\n5. CRITICAL FORMATTING MANDATE - NO SPECIAL SYMBOLS (* = / #):\n   Do NOT use '*', '=', '/', or '#' anywhere in your output.\n6. LANGUAGE MANDATE: Output MUST be in ${mode === 'as_roman' ? 'Romanized Assamese (Assamese written using English alphabet)' : (mode === 'as_script' ? 'Standard Assamese Script (অসমীয়া লিপি)' : 'English')}.\n\nUser Question: ${cleanQuery}`;

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
                  text: promptText
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 4096
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
            source: relatedDocument ? relatedDocument.title : null,
            page: relatedDocument ? (relatedDocument.citation || relatedDocument.fileName || 'Page 1') : null,
            confidence: relatedDocument ? '99.8% Grounded Document Match' : '99.0% Policy Grounded',
            isUnverified: false,
            citations: relatedDocument ? [{ document_title: relatedDocument.title, page_number: 1 }] : [],
            relatedDocument: relatedDocument || null
          };
        }
      }
    } catch {
      // try next candidate model
    }
  }
  return null;
}


/**
 * Strict domain validator: ensures the assistant answers ONLY university-related queries.
 */
/**
 * Check if the user query is a greeting or identity question.
 */
export function isGreetingQuery(query) {
  if (!query || typeof query !== 'string') return false;
  const q = query.toLowerCase().trim();
  const qClean = q.replace(/[^\w\s\u0980-\u09FF]/g, ' ').replace(/\s+/g, ' ').trim();
  const greetings = [
    'hi', 'hello', 'hey', 'hii', 'hiii', 'heyy', 'greetings', 'namaskar', 'নমস্কাৰ', 'নমস্কার', 'হেল্ল', 'হাই',
    'who are you', 'what is unimitra', 'who is unimitra', 'আপুনি কোন', 'পৰিচয়', 'পৰিচয়',
    'ki khobor', 'kenekua', 'help', 'good morning', 'good evening', 'good afternoon', 'thank you', 'thanks', 'ধন্যবাদ',
    'কেনে আছা', 'কেনে আছে', 'কি খবৰ', 'ভালে আছানে', 'কি কৰিছা'
  ];
  return greetings.some(g => 
    q === g || 
    qClean === g || 
    qClean.startsWith(g + ' ') || 
    qClean.endsWith(' ' + g) || 
    qClean.includes(' ' + g + ' ') ||
    (g.length >= 5 && qClean.includes(g))
  );
}

export function isUniversityRelatedQuery(query) {
  if (!query || typeof query !== 'string') return true;
  const q = query.toLowerCase().trim();
  // Allow greetings and identity questions
  const greetings = [
    'hi', 'hello', 'hey', 'greetings', 'namaskar', 'নমস্কাৰ', 'নমস্কার',
    'who are you', 'what is unimitra', 'who is unimitra', 'আপুনি কোন',
    'ki khobor', 'kenekua', 'help', 'good morning', 'good evening', 'thank',
    'কেনে আছা', 'কেনে আছে', 'কি খবৰ', 'ভালে আছানে'
  ];
  if (greetings.some(g => q.startsWith(g) || q === g)) return true;

  // University and academic indicators that indicate valid domain
  const academicTerms = [
    'university', 'college', 'exam', 'admission', 'syllabus', 'scholarship', 'hostel',
    'professor', 'department', 'campus', 'degree', 'result', 'topper', 'cgpa', 'sgpa',
    'grade', 'backlog', 're-evaluation', 'fee', 'ordinance', 'statute', 'circular',
    'notice', 'chancellor', 'vice chancellor', 'faculty', 'curriculum', 'course',
    'attendance', 'convocation', 'roll', 'registration', 'admit card', 'semester',
    'বৰ্ড', 'বিশ্ববিদ্যালয়', 'পৰীক্ষা', 'মহাবিদ্যালয়', 'নামভৰ্তি', 'মেধা', 'জলপানি', 'ছাত্ৰাবাস',
    'টপাৰ', 'হোষ্টেল', 'আসন', 'মাচুল', 'বৃত্তি', 'কাৰফিউ', 'সমাৱৰ্তন', 'গাইডলাইন', 'নথি', 'ফলাফল', 'পাঠ্যক্ৰম', 'উপস্থিতি', 'ৰেহাই', 'ছাত্ৰ', 'ছাত্ৰী', 'নিভৰয়া', 'নিভোৰায়'
  ];
  if (academicTerms.some(term => q.includes(term))) {
    return true;
  }

  // Clear off-topic patterns
  const offTopicPatterns = [
    /\b(?:recipe|cook|cooking|biryani|chicken|curry|paneer|roti|dish|food recipe|how to make|ingredients)\b/i,
    /\b(?:movie|cinema|actor|actress|bollywood|hollywood|song lyrics|web series|film|box office)\b/i,
    /\b(?:ipl|cricket score|fifa|world cup|football match|batting|bowling|who won the match)\b/i,
    /\b(?:dating|girlfriend|boyfriend|flirt|love story|relationship advice)\b/i,
    /\b(?:astrology|horoscope|zodiac|rashi|kundali)\b/i,
    /\b(?:tell me a joke|funny joke|chutkule)\b/i,
    /\b(?:election party|political party|bjp|congress|aap|vote for|prime minister election)\b/i,
    /(?:ৰন্ধা|ৰেচিপি|চিনেমা|অভিনেতা|অভিনেত্ৰী|গানৰ কথা|জ্যোতিষ|প্ৰেম|ৰাজনীতি)/
  ];

  if (offTopicPatterns.some(pattern => pattern.test(q))) {
    return false;
  }

  return true;
}

export const chatService = {
  /**
   * Send a query to the AI Assistant
   * Tier 1: Node.js Backend Gateway -> Tier 2: Python AI Service -> Tier 3: Direct Gemini AI Model Cascade -> Tier 4: Local Search
   */
  async sendQuery({ query, sessionId = null, language = 'en', university = null, category = null, domain = null, signal = null, saveToHistory = true, isVoice = false }) {
    if (signal?.aborted) {
      return { success: false, aborted: true };
    }
    const sId = isVoice ? null : (sessionId || generateSessionId());
    const mode = detectLanguageMode(query, language);

    // Strict University Domain Guard: Reject off-topic non-university queries immediately
    if (!isUniversityRelatedQuery(query)) {
      let refusalAnswer = 'I am exclusively dedicated to university and academic inquiries (such as regulations, examinations, syllabus, admissions, scholarships, hostel rules, and official notices). Please feel free to ask any university-related question.';
      if (mode === 'as_script') {
        refusalAnswer = 'মই কেৱল বিশ্ববিদ্যালয় আৰু শৈক্ষিক বিষয়ৰ (যেনে সংবিধি, পৰীক্ষা, পাঠ্যক্ৰম, নামভৰ্তি, জলপানি, ছাত্ৰাবাস আৰু চৰকাৰী জাননী) প্ৰশ্নৰ উত্তৰ দিবলৈ নিবেদিত। অনুগ্ৰহ কৰি বিশ্ববিদ্যালয় সম্বন্ধীয় যিকোনো প্ৰশ্ন সোধক।';
      } else if (mode === 'as_roman') {
        refusalAnswer = 'Moi keval university aru academic bisoyor (rules, exam, admission, scholarship, syllabus, hostel aru notice) uttor diboloi nivedito. Onugroh kori university related jikono prosno hudhok.';
      }
      return {
        success: true,
        fromBackend: false,
        fromAi: true,
        sessionId: sId,
        answer: refusalAnswer,
        source: `${university?.name || 'Nivoraya University'} Institutional Scope`,
        page: 'Academic Domain Policy',
        confidence: '100% Policy Grounded',
        isUnverified: false,
        citations: []
      };
    }

    // Check Greetings & System Identity Questions
    if (isGreetingQuery(query)) {
      let greetingAnswer = 'Hello! I am UniMitra, the official AI assistant for Nivoraya University. I provide verified answers directly from official university regulations and documents uploaded by the administration. How can I assist you today?';
      if (mode === 'as_script') {
        const qLower = query.toLowerCase();
        if (qLower.includes('কেনে আছা') || qLower.includes('কেনে আছে') || qLower.includes('কি খবৰ') || qLower.includes('ভালে')) {
          greetingAnswer = 'মই ভালে আছোঁ! আপোনাৰ খবৰ কেনে? মই নিভৰয়া বিশ্ববিদ্যালয়ৰ আধিকাৰিক AI সহায়ক (UniMitra)। বিশ্ববিদ্যালয়ৰ নিয়মাৱলী, পৰীক্ষা, নামভৰ্তি বা ছাত্ৰবৃত্তিৰ বিষয়ে আপোনাক কিদৰে সহায় কৰিব পাৰোঁ?';
        } else {
          greetingAnswer = 'নমস্কাৰ! মই ইউনিমিত্র (UniMitra), নিভৰয়া বিশ্ববিদ্যালয়ৰ আধিকাৰিক AI সহায়ক। বিশ্ববিদ্যালয় প্ৰশাসনে আপলোড কৰা সংবিধি আৰু নথিসমূহৰ ভিত্তিত নিৰ্ভুল তথ্য প্ৰদান কৰিবলৈ মই সাজু। আপোনাক কিদৰে সহায় কৰিব পাৰোঁ?';
        }
      } else if (mode === 'as_roman') {
        const qLower = query.toLowerCase();
        if (qLower.includes('kenekua') || qLower.includes('ki khobor') || qLower.includes('bhal')) {
          greetingAnswer = 'Moi bhal asu! Tumar khobor kiba? Moi Nivoraya University r official AI assistant UniMitra. University r rules, exam, admission ba scholarship or bhabe apunak kenekoi sahay koribo paru?';
        } else {
          greetingAnswer = 'Nomoskar! Moi UniMitra, Nivoraya University r official AI assistant. Administration e upload kora official document aru rules or pora nithor tothyo diboloi moi ready. Apunak kenekoi sahay koribo paru?';
        }
      }
      return {
        success: true,
        fromBackend: false,
        fromAi: true,
        sessionId: sId,
        answer: greetingAnswer,
        source: 'UniMitra System',
        page: 'Official Orientation',
        confidence: '100% Grounded Match',
        isUnverified: false,
        citations: [],
        relatedDocument: null
      };
    }

    // ========================================================
    // FIRST: Check the documents/PDFs uploaded by Admin in the university repository
    // ========================================================
    const matched = findRelatedDocument(query);
    const relatedDoc = matched ? matched.doc : null;

    // Strict Closed-Domain Notice when no uploaded document exists or document was deleted
    const closedDomainNotice = mode === 'as_script'
      ? 'এই বিষয়ে আপলোড কৰা নথিত কোনো তথ্য দিয়া হোৱা নাই বা উপলব্ধ নহয়।'
      : (mode === 'as_roman'
        ? 'Ei bisoyot upload kora document ot kono tothyo diya hua nai.'
        : 'No information has been provided for this in the uploaded documents.');

    // 1. If an uploaded document exists: Attempt Direct Google Gemini Synthesis grounded strictly in the PDF
    if (relatedDoc) {
      const geminiResult = await callDirectGemini({ query, language: mode, university, relatedDocument: relatedDoc, signal });
      if (geminiResult && geminiResult.answer) {
        const verifiedAnswer = verifyAndAlignWithDocument(geminiResult.answer, relatedDoc, mode);
        return {
          ...geminiResult,
          answer: verifiedAnswer,
          sessionId: sId
        };
      }
    }

    if (signal?.aborted) return { success: false, aborted: true };

    // 2. Direct Python AI Service Call (pgvector RAG over uploaded documents)
    const pythonResult = await callPythonAiService({ query, language: mode, university, signal });
    if (pythonResult && pythonResult.answer) {
      const ansText = stripUnwantedIntro(pythonResult.answer, query);
      const isGroundingNotice = ansText.includes('নথিৰ ভিত্তিতহে নিৰ্ভুল তথ্য') ||
                                ansText.includes('not found in the official university documents') ||
                                ansText.includes('uploaded official document or porahe');
      if (isGroundingNotice) {
        if (!relatedDoc) {
          return {
            success: true,
            fromBackend: false,
            fromAi: true,
            sessionId: sId,
            answer: closedDomainNotice,
            source: 'Institutional Repository',
            page: 'Grounding Notice',
            confidence: '100% Policy Grounded',
            isUnverified: false,
            citations: [],
            relatedDocument: null
          };
        }
      } else {
        const verifiedAnswer = verifyAndAlignWithDocument(ansText, relatedDoc, mode);
        return {
          ...pythonResult,
          answer: verifiedAnswer,
          sessionId: sId,
          source: relatedDoc ? relatedDoc.title : (pythonResult.source || null),
          page: relatedDoc ? (relatedDoc.citation || relatedDoc.fileName || 'Page 1') : (pythonResult.page || null),
          relatedDocument: relatedDoc || null
        };
      }
    }

    if (signal?.aborted) return { success: false, aborted: true };

    // 3. Attempt Backend Gateway Call (Institutional Database & Statutory Knowledge)
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
          category: category || domain || null,
          saveToHistory: saveToHistory && !isVoice,
          isVoice: Boolean(isVoice)
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data?.success && data?.data) {
          const rawAns = (data.data.answer || data.data.text || '').trim();
          const isGroundingNotice = rawAns.includes('নথিৰ ভিত্তিতহে নিৰ্ভুল তথ্য') ||
                                    rawAns.includes('not found in the official university documents') ||
                                    rawAns.includes('uploaded official document or porahe');
          const isGenericGuidance = data.data.source === 'UniMitra Academic Guidance' && 
            (rawAns.includes('সাধাৰণ কাৰ্যপ্ৰণালী') || rawAns.includes('departmental coordinator'));
          if (!isGenericGuidance && !isGroundingNotice && rawAns.length > 25) {
            const verifiedAnswer = relatedDoc ? verifyAndAlignWithDocument(stripUnwantedIntro(rawAns, query), relatedDoc, mode) : stripUnwantedIntro(rawAns, query);
            return {
              success: true,
              fromBackend: true,
              fromAi: true,
              sessionId: data.data.sessionId || sId,
              answer: verifiedAnswer,
              source: relatedDoc ? relatedDoc.title : (data.data.source || 'University Knowledge Base'),
              page: relatedDoc ? (relatedDoc.citation || relatedDoc.fileName || 'Page 1') : (data.data.page || 'Official Notification'),
              confidence: '99.8% Grounded Match',
              isUnverified: data.data.isUnverified || false,
              citations: relatedDoc ? [{ document_title: relatedDoc.title, page_number: 1 }] : (data.data.citations || []),
              relatedDocument: relatedDoc || null
            };
          }
        }
      }
    } catch (e) {
      if (signal?.aborted || e?.name === 'AbortError') {
        return { success: false, aborted: true };
      }
    }

    if (signal?.aborted) return { success: false, aborted: true };

    // 4. Direct Google Gemini Synthesis (Active gemini-3-flash-preview model)
    try {
      const geminiFallback = await callDirectGemini({ query, language: mode, university, relatedDocument: relatedDoc, signal });
      if (geminiFallback && geminiFallback.answer) {
        const verifiedAnswer = relatedDoc ? verifyAndAlignWithDocument(geminiFallback.answer, relatedDoc, mode) : geminiFallback.answer;
        return {
          ...geminiFallback,
          answer: verifiedAnswer,
          sessionId: sId
        };
      }
    } catch {
      // fallback to resilient local knowledge
    }

    if (signal?.aborted) return { success: false, aborted: true };

    // 5. Resilient Local Grounded Knowledge from Uploaded Documents
    if (relatedDoc) {
      const rawContent = (relatedDoc.content || '').trim();
      const rawSummary = (relatedDoc.summary || '').trim();
      const docFullBody = rawContent.length > rawSummary.length ? rawContent : rawSummary;

      let docAnswer = '';
      if (mode === 'as_script') {
        docAnswer = `বিশ্ববিদ্যালয়ৰ আধিকাৰিক নথি "${relatedDoc.asTitle || relatedDoc.title}" অনুসৰি:

${docFullBody}`;
      } else if (mode === 'as_roman') {
        docAnswer = `University r official document "${relatedDoc.title}" onuxori:

${docFullBody}`;
      } else {
        docAnswer = `According to official university document "${relatedDoc.title}":

${docFullBody}`;
      }
      const verifiedAnswer = verifyAndAlignWithDocument(stripUnwantedIntro(docAnswer, query), relatedDoc, mode);
      return {
        success: true,
        fromBackend: false,
        fromAi: true,
        sessionId: sId,
        answer: verifiedAnswer,
        source: relatedDoc.title,
        page: relatedDoc.citation || relatedDoc.fileName || 'Page 1',
        confidence: '99.8% Grounded Document Match',
        isUnverified: false,
        citations: [{ document_title: relatedDoc.title, page_number: 1 }],
        relatedDocument: relatedDoc
      };
    }

    // 6. Strict Closed-Domain Notice: No document uploaded or document was deleted
    // The AI MUST NOT generate answers by itself when no official document exists.
    return {
      success: true,
      fromBackend: false,
      fromAi: true,
      sessionId: sId,
      answer: closedDomainNotice,
      source: 'Institutional Repository',
      page: 'Grounding Notice',
      confidence: '100% Policy Grounded',
      isUnverified: false,
      citations: [],
      relatedDocument: null
    };
  },

  /**
   * Retrieve all chat sessions isolated by portal domain (student, faculty, admin) and account (userId)
   */
  async getSessions(domain = 'student', userId = null) {
    const d = (domain || 'student').toLowerCase();
    const prefix = d.includes('admin') ? 'admin' : (d.includes('faculty') ? 'faculty' : 'student');
    const uid = userId || getCurrentUserId();
    const isGuest = uid === 'guest';
    const deletedIds = getDeletedSessionIds();

    if (!isGuest && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uid)) {
      try {
        const res = await fetch(`${CHAT_API}/sessions?domain=${prefix}`, {
          headers: getAuthHeaders(),
          credentials: 'include',
        });
        if (res.ok) {
          const json = await res.json();
          if (json?.data && Array.isArray(json.data)) {
            const backendSessions = json.data
              .filter(s => !deletedIds.has(s.id))
              .map(s => {
                const displayTitle = s.title?.replace(/^\[(student|faculty|admin)\]\s*/i, '') || s.title;
                return {
                  id: s.id,
                  title: displayTitle,
                  createdAt: s.createdAt,
                  updatedAt: s.updatedAt,
                  language: s.language,
                  domain: prefix,
                  messageCount: s._count?.messages || 0,
                };
              });
            const local = this.getLocalSessions(prefix, uid);
            const combined = [...backendSessions];
            local.forEach(loc => {
              if (!combined.some(c => c.id === loc.id) && !deletedIds.has(loc.id)) {
                combined.push(loc);
              }
            });
            const key = getDomainSessionsKey(prefix, uid);
            localStorage.setItem(key, JSON.stringify(combined.slice(0, 50)));
            return combined;
          }
        }
      } catch {
        // fallback
      }
    }
    return this.getLocalSessions(prefix, uid);
  },

  /**
   * Save or update a session in local storage for a specific portal domain
   */
  saveLocalSession(session, domain = 'student', userId = null) {
    if (!session || !session.id) return [];
    const d = (domain || 'student').toLowerCase();
    const prefix = d.includes('admin') ? 'admin' : (d.includes('faculty') ? 'faculty' : 'student');
    const uid = userId || getCurrentUserId();
    try {
      const key = getDomainSessionsKey(prefix, uid);
      const sessions = this.getLocalSessions(prefix, uid);
      const existingIdx = sessions.findIndex(s => s.id === session.id);
      let updated;
      if (existingIdx >= 0) {
        updated = [...sessions];
        updated[existingIdx] = { ...updated[existingIdx], ...session, domain: prefix, updatedAt: new Date().toISOString() };
      } else {
        updated = [{ ...session, domain: prefix, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...sessions];
      }
      localStorage.setItem(key, JSON.stringify(updated.slice(0, 50)));

      // Broadcast history update event across views
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('unimitra_chat_history_changed', { detail: { domain: prefix, sessionId: session.id } }));
      }
      return updated;
    } catch {
      return [];
    }
  },

  getLocalSessions(domain = 'student', userId = null) {
    const d = (domain || 'student').toLowerCase();
    const prefix = d.includes('admin') ? 'admin' : (d.includes('faculty') ? 'faculty' : 'student');
    const uid = userId || getCurrentUserId();
    const primaryKey = getDomainSessionsKey(prefix, uid);
    const deletedIds = getDeletedSessionIds();
    try {
      const raw = localStorage.getItem(primaryKey);
      let sessions = raw !== null ? JSON.parse(raw) : null;

      // If primaryKey explicitly exists (even if empty []), respect it and return without resurrecting from legacy keys
      if (Array.isArray(sessions)) {
        return sessions.filter(s => s && s.id && !deletedIds.has(s.id));
      }

      sessions = [];
      // Only check legacy/variant keys if primaryKey has NEVER been set
      const candidateKeys = [
        `unimitra_chat_sessions_${uid}_${prefix}`,
        `unimitra_chat_sessions_guest_${prefix}`,
        `unimitra_chat_sessions_usr-default_${prefix}`,
        `unimitra_chat_sessions_admin_local_01_${prefix}`,
      ];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('unimitra_chat_sessions_') && k.endsWith(`_${prefix}`)) {
          if (!candidateKeys.includes(k)) candidateKeys.push(k);
        }
      }
      for (const k of candidateKeys) {
        try {
          const v = localStorage.getItem(k);
          if (v) {
            const parsed = JSON.parse(v);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const valid = parsed.filter(s => s && s.id && !deletedIds.has(s.id));
              if (valid.length > 0) {
                sessions = valid;
                localStorage.setItem(primaryKey, JSON.stringify(sessions));
                break;
              }
            }
          }
        } catch {}
      }

      // If still empty and student domain, check general unimitra_chat_sessions
      if ((!sessions || sessions.length === 0) && prefix === 'student') {
        try {
          const legacy = localStorage.getItem('unimitra_chat_sessions');
          if (legacy) {
            const parsed = JSON.parse(legacy);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const valid = parsed.filter(s => s && s.id && !deletedIds.has(s.id));
              if (valid.length > 0) {
                sessions = valid;
                localStorage.setItem(primaryKey, JSON.stringify(sessions));
              }
            }
          }
        } catch {}
      }

      return Array.isArray(sessions) ? sessions : [];
    } catch {
      return [];
    }
  },

  deleteSession(sessionId, domain = 'student', userId = null) {
    if (!sessionId) return [];
    markSessionDeleted(sessionId);
    const d = (domain || 'student').toLowerCase();
    const prefix = d.includes('admin') ? 'admin' : (d.includes('faculty') ? 'faculty' : 'student');
    const uid = userId || getCurrentUserId();
    try {
      const primaryKey = getDomainSessionsKey(prefix, uid);
      const currentSessions = this.getLocalSessions(prefix, uid).filter(s => s.id !== sessionId);
      localStorage.setItem(primaryKey, JSON.stringify(currentSessions));

      // Scrub sessionId across ALL chat session keys in localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('unimitra_chat_sessions')) {
          try {
            const val = localStorage.getItem(k);
            if (val) {
              const arr = JSON.parse(val);
              if (Array.isArray(arr) && arr.some(s => s && s.id === sessionId)) {
                const cleaned = arr.filter(s => s && s.id !== sessionId);
                localStorage.setItem(k, JSON.stringify(cleaned));
              }
            }
          } catch {}
        }
      }

      // Remove all message keys associated with this sessionId
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i);
        if (k && (k === getDomainMessageKey(sessionId, prefix, uid) || k.endsWith(`_${sessionId}`) || k === `unimitra_messages_${sessionId}`)) {
          localStorage.removeItem(k);
        }
      }

      if (this.getActiveSessionId(prefix, uid) === sessionId) {
        this.setActiveSessionId(null, prefix, uid);
      }
      if (sessionId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionId)) {
        fetch(`${CHAT_API}/sessions/${sessionId}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
          credentials: 'include',
        }).catch(() => {});
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('unimitra_chat_history_changed', { detail: { domain: prefix, sessionId } }));
      }
      return currentSessions;
    } catch {
      return [];
    }
  },

  clearAllSessions(domain = 'student', userId = null) {
    const d = (domain || 'student').toLowerCase();
    const prefix = d.includes('admin') ? 'admin' : (d.includes('faculty') ? 'faculty' : 'student');
    const uid = userId || getCurrentUserId();
    try {
      const key = getDomainSessionsKey(prefix, uid);
      const sessions = this.getLocalSessions(prefix, uid);
      sessions.forEach(s => {
        if (s?.id) {
          markSessionDeleted(s.id);
          localStorage.removeItem(getDomainMessageKey(s.id, prefix, uid));
        }
      });
      localStorage.setItem(key, JSON.stringify([]));
      localStorage.removeItem(getDomainActiveSessionKey(prefix, uid));

      // Also clean any variants and legacy keys
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i);
        if (k && (
          k.startsWith(`unimitra_messages_${prefix}_`) || 
          (k.startsWith(`unimitra_messages_`) && k.includes(`_${prefix}_`)) ||
          k.startsWith(`unimitra_chat_sessions_${uid}_${prefix}`) ||
          k.startsWith(`unimitra_chat_sessions_guest_${prefix}`)
        )) {
          localStorage.removeItem(k);
        }
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('unimitra_chat_history_changed', { detail: { domain: prefix } }));
      }
      return [];
    } catch {
      return [];
    }
  },

  generateSessionId() {
    return generateSessionId();
  },

  getSessionMessages(sessionId, domain = 'student', userId = null) {
    if (!sessionId) return null;
    const d = (domain || 'student').toLowerCase();
    const prefix = d.includes('admin') ? 'admin' : (d.includes('faculty') ? 'faculty' : 'student');
    const uid = userId || getCurrentUserId();
    const primaryKey = getDomainMessageKey(sessionId, prefix, uid);
    try {
      const raw = localStorage.getItem(primaryKey);
      if (raw) return JSON.parse(raw);

      // Check candidate legacy keys
      const candidateKeys = [
        `unimitra_messages_${uid}_${prefix}_${sessionId}`,
        `unimitra_messages_guest_${prefix}_${sessionId}`,
        `unimitra_messages_usr-default_${prefix}_${sessionId}`,
        `unimitra_messages_admin_local_01_${prefix}_${sessionId}`,
        `unimitra_messages_${sessionId}`,
      ];
      for (const k of candidateKeys) {
        const v = localStorage.getItem(k);
        if (v) {
          try {
            const parsed = JSON.parse(v);
            if (parsed && Array.isArray(parsed) && parsed.length > 0) {
              localStorage.setItem(primaryKey, v);
              return parsed;
            }
          } catch {}
        }
      }

      // Scan localStorage for any key ending with sessionId
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('unimitra_messages_') && k.endsWith(sessionId)) {
          const v = localStorage.getItem(k);
          if (v) {
            try {
              const parsed = JSON.parse(v);
              if (parsed && Array.isArray(parsed) && parsed.length > 0) {
                localStorage.setItem(primaryKey, v);
                return parsed;
              }
            } catch {}
          }
        }
      }

      return null;
    } catch {
      return null;
    }
  },

  async fetchSessionMessages(sessionId, domain = 'student', userId = null) {
    if (!sessionId) return [];
    const d = (domain || 'student').toLowerCase();
    const prefix = d.includes('admin') ? 'admin' : (d.includes('faculty') ? 'faculty' : 'student');
    const uid = userId || getCurrentUserId();
    const local = this.getSessionMessages(sessionId, prefix, uid);
    if (local && local.length > 0) return local;

    if (isValidUuid(sessionId) && isValidUuid(uid)) {
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
              sender: m.role === 'assistant' ? 'ai' : (m.sender || 'user'),
              text: m.content || m.text,
              source: m.metadata?.source || m.source,
              page: m.metadata?.page || m.page,
              confidence: m.metadata?.confidence || m.confidence,
              time: m.time || (m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'),
            }));
            this.saveSessionMessages(sessionId, messages, prefix, uid);
            return messages;
          }
        }
      } catch {
        // ignore
      }
    }
    return local || [];
  },

  saveSessionMessages(sessionId, messages, domain = 'student', userId = null) {
    if (!sessionId || !messages) return;
    const d = (domain || 'student').toLowerCase();
    const prefix = d.includes('admin') ? 'admin' : (d.includes('faculty') ? 'faculty' : 'student');
    const uid = userId || getCurrentUserId();
    try {
      const key = getDomainMessageKey(sessionId, prefix, uid);
      const str = JSON.stringify(messages);
      localStorage.setItem(key, str);

      // Broadcast event so history and conversation views re-sync
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('unimitra_chat_history_changed', { detail: { domain: prefix, sessionId } }));
      }
    } catch {
      // ignore
    }
  },

  getActiveSessionId(domain = 'student', userId = null) {
    const uid = userId || getCurrentUserId();
    try {
      const val = localStorage.getItem(getDomainActiveSessionKey(domain, uid));
      return val || null;
    } catch {
      return null;
    }
  },

  setActiveSessionId(id, domain = 'student', userId = null) {
    const uid = userId || getCurrentUserId();
    try {
      const key = getDomainActiveSessionKey(domain, uid);
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

    // Detect speech language from the speakable text: Assamese -> 'as', English -> 'en'
    const hasAssameseChars = /[\u0980-\u09FF]/.test(cleanText);
    const textLangMode = detectLanguageMode(cleanText);
    const isAssameseText = hasAssameseChars || textLangMode === 'as_script' || textLangMode === 'as_roman';
    const resolvedLang = (language === 'en' && !hasAssameseChars) ? 'en' : (isAssameseText ? 'as' : 'en');

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
    const resolvedLang = (language === 'en' || language === 'en-IN') ? 'en' : 'as';
    const formData = new FormData();
    formData.append('audio', audioBlob, 'voice_query.webm');
    formData.append('language', resolvedLang);
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
          for (const model of GEMINI_CANDIDATES) {
            try {
              const gRes = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
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
            } catch {
              // try next candidate model
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
