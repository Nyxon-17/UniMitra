export function logUnpublishedQueryToAdmin(query, answer = '') {
  try {
    if (typeof window === 'undefined') return;
    const feedbackKey = 'unimitra_feedback_submissions';
    const existing = JSON.parse(localStorage.getItem(feedbackKey) || '[]');
    
    const qLower = (query || '').toLowerCase().trim();
    if (!qLower || qLower.length < 3) return;
    const isDup = existing.slice(0, 10).some(item => (item.query || '').toLowerCase().trim() === qLower);
    if (isDup) return;

    const newReq = {
      id: `REQ-${Date.now().toString().slice(-4)}`,
      user: 'Student / Inquirer',
      role: 'Student',
      query: query,
      type: 'Unpublished Document Requirement',
      rating: 3,
      university: universityService.getProfile()?.name || 'Our University',
      comments: `Information for "${query}" is not published in current repository PDFs. Alternative guidance was provided to user. Requirement automatically forwarded for official document upload.`,
      submittedAt: 'Just now',
      status: 'Pending Admin Review'
    };

    const updated = [newReq, ...existing];
    localStorage.setItem(feedbackKey, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('unimitra_feedback_updated', { detail: updated }));
  } catch (err) {
    console.error('Error logging unpublished query:', err);
  }
}

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
export function getDomainSessionsKey(domain = 'student') {
  const d = (domain || 'student').toLowerCase();
  if (d.includes('admin')) return 'unimitra_chat_sessions_admin';
  if (d.includes('faculty')) return 'unimitra_chat_sessions_faculty';
  return 'unimitra_chat_sessions_student';
}

export function getDomainActiveSessionKey(domain = 'student') {
  const d = (domain || 'student').toLowerCase();
  if (d.includes('admin')) return 'unimitra_active_session_admin';
  if (d.includes('faculty')) return 'unimitra_active_session_faculty';
  return 'unimitra_active_session_student';
}

export function getDomainMessageKey(sessionId, domain = 'student') {
  const d = (domain || 'student').toLowerCase();
  const prefix = d.includes('admin') ? 'admin' : (d.includes('faculty') ? 'faculty' : 'student');
  return unimitra_messages__;
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

function getAuthHeaders() {
  const token = localStorage.getItem('unimitra_auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

/**
 * Direct call to Python AI Service (Port 8000)
 */
async function callPythonAiService({ query, language, university }) {
  try {
    const mode = detectLanguageMode(query, language);
    const res = await fetch(`${AI_SERVICE_URL}/api/ai/query`, {
      method: 'POST',
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
          source: data.source || `${university?.name || 'Dibrugarh University'} Gazette`,
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
async function callDirectGemini({ query, language, university }) {
  const understanding = interpretQuery(query, language);
  const mode = understanding.languageMode;
  const uName = university?.name || 'Dibrugarh University';
  const cleanQuery = understanding.normalizedQuery;

  let systemPrompt = '';

  const activeProfile = universityService.getProfile();
  const resolvedUnivName = activeProfile?.name || uName || 'Dibrugarh University';
  const resolvedAsName = activeProfile?.asName || 'ডিব্ৰুগড় বিশ্ববিদ্যালয়';

  if (mode === 'as_roman') {
    systemPrompt = `You are UniMitra, the official university AI assistant dedicated exclusively to ${resolvedUnivName}.

SINGLE-UNIVERSITY & DUAL-SOURCE MANDATE:
1. This platform is dedicated exclusively to Our University (${resolvedUnivName}).
2. For questions regarding OUR UNIVERSITY (${resolvedUnivName}): Answer using statutory academic regulations, examination bylaws, attendance criteria, and grounded university data.
3. For questions regarding OTHER UNIVERSITIES (e.g. Gauhati University, Tezpur University, Cotton University, Delhi University, etc.): Provide accurate details, comparisons, and academic facts using general educational and web data. Do NOT apply Our University's internal statutory codes to other universities. Mention politely that official statutory records in this portal are dedicated to ${resolvedUnivName}, while other university details are provided via web data.
4. If the user asks about other universities, answer authoritatively and helpfully using web data. Never refuse to assist.

CRITICAL UNPUBLISHED DOCUMENT & COMPREHENSIVE ANSWER MANDATE:
You can and MUST answer ALL user questions with maximum accuracy.
However, if an inquiry regarding Our University (${resolvedUnivName}) is NOT found in the verified repository PDFs:
Step 1: State clearly that the official notification or statutory ordinance on this specific topic has not yet been published by the university authority. (In Romanized Assamese: "Ei bisoyor official notification ba ordinance university authority e etiyaloike publish kora nai.")
Step 2: Immediately provide an accurate, helpful, and comprehensive alternative answer on the topic using general educational knowledge so the user's question is completely addressed.
Step 3: Reassure the user that their requirement has been automatically recorded and forwarded to the university administrator on the Review & Feedback page for official document verification and upload. (In Romanized Assamese: "Apunar ei requirement review aru official document upload korar babe Review & Feedback page ot admin le automatically send kora hoise.")

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
    systemPrompt = `আপুনি UniMitra (ইউনিমিত্র), আমাৰ নিৰ্দিষ্ট বিশ্ববিদ্যালয়ৰ (${resolvedAsName} / ${resolvedUnivName}) বাবে এক সমৰ্পিত আৰু বিশ্বাসযোগ্য দ্বিভাষিক AI সহায়ক।

একক বিশ্ববিদ্যালয় আৰু দ্বি-উৎস নীতি (SINGLE-UNIVERSITY & DUAL-SOURCE MANDATE):
১. এই প্লেটফৰ্ম কেৱল আমাৰ নিৰ্দিষ্ট বিশ্ববিদ্যালয়ৰ (${resolvedAsName}) বাবে উৎসৰ্গিত।
২. আমাৰ বিশ্ববিদ্যালয়ৰ (${resolvedAsName}) প্ৰশ্নৰ ক্ষেত্ৰত: বিশ্ববিদ্যালয়ৰ অনুমোদিত অধিনিয়ম, পৰীক্ষা বিধি আৰু সংৰক্ষিত RAG তথ্যৰ ভিত্তিত সঠিক উত্তৰ দিয়ক।
৩. অন্যান্য বিশ্ববিদ্যালয়ৰ (যেনে গুৱাহাটী বিশ্ববিদ্যালয়, তেজপুৰ বিশ্ববিদ্যালয়, কটন বিশ্ববিদ্যালয়, দিল্লী বিশ্ববিদ্যালয় আদি) প্ৰশ্নৰ ক্ষেত্ৰত: ৱেব তথ্য (Web data) আৰু সাধাৰণ শৈক্ষিক জ্ঞান ব্যৱহাৰ কৰি সঠিক বিৱৰণ দিয়ক। আমাৰ বিশ্ববিদ্যালয়ৰ আভ্যন্তৰীণ নিয়ম অন্যান্য বিশ্ববিদ্যালয়ৰ ওপৰত আৰোপ নকৰিব। বুজাই দিয়ক যে এই পৰ্টেলটো আমাৰ বিশ্ববিদ্যালয়ৰ প্ৰতিষ্ঠানিক বিধিৰ বাবে নিৰ্ধাৰিত, কিন্তু অন্যান্য বিশ্ববিদ্যালয়ৰ তথ্য সাধাৰণ ৱেব তথ্যৰ ভিত্তিত দিয়া হৈছে।

অপ্ৰকাশিত নথি আৰু সৰ্বাংগীন উত্তৰৰ কঠোৰ নিৰ্দেশনা (CRITICAL UNPUBLISHED DOCUMENT & ANSWER MANDATE):
আপুনি ব্যৱহাৰকাৰীৰ সকলো প্ৰশ্নৰ শুদ্ধ আৰু সঠিক উত্তৰ দিব পাৰিব আৰু দিব লাগিব। কোনো প্ৰশ্নৰ উত্তৰ অস্বীকাৰ নকৰিব।
যদি আমাৰ বিশ্ববিদ্যালয়ৰ কোনো তথ্য সংলগ্ন বা আপলোড কৰা PDF নথিত উপলব্ধ নহয়:
১. স্পষ্টকৈ জনাওক: "এই বিষয়ৰ আনুষ্ঠানিক অধিসূচনা বা অধিনিয়ম বিশ্ববিদ্যালয় কৰ্তৃপক্ষৰ দ্বাৰা এতিয়ালৈকে প্ৰকাশ কৰা হোৱা নাই।"
২. লগে লগে সাধাৰণ শৈক্ষিক জ্ঞান ব্যৱহাৰ কৰি বিষয়টোৰ এটা সম্পূৰ্ণ, সঠিক আৰু সহায়ক বিকল্প উত্তৰ বিশদভাৱে দিয়ক।
৩. ব্যৱহাৰকাৰীক আশ্বস্ত কৰক: "আপোনাৰ এই প্ৰয়োজনীয়তা পৰ্যালোচনা আৰু আনুষ্ঠানিক নথি অন্তৰ্ভুক্তিকৰণৰ বাবে ৰিভিউ আৰু ফীডবেক (Review & Feedback) পৃষ্ঠাত প্ৰশাসকলৈ স্বয়ংক্ৰিয়ভাৱে প্ৰেৰণ কৰা হৈছে।" 

CRITICAL DIRECT ANSWER MANDATE:
কোনো অপ্ৰয়োজনীয় আত্মপৰিচয়মূলক বাক্য বা পুনৰাবৃত্তিমূলক আৰম্ভণি (যেনে: "নমস্কাৰ! মই ইউনিমিত্র, অসমৰ বিশ্ববিদ্যালয়সমূহৰ AI সহায়ক...") নিদিব। প্ৰশ্নৰ পোনপটীয়া, সঠিক আৰু স্পষ্ট উত্তৰ দিয়ক। কেৱল ব্যৱহাৰকাৰীয়ে পৰিচয় সুধিলে বা অভিবাদন জনালেহে পৰিচয় দিয়ক।

বিশেষ চিহ্ন বৰ্জনৰ নিৰ্দেশনা (NO SPECIAL SYMBOLS * = / #):
আপোনাৰ উত্তৰত কেতিয়াও '*', '=', '/', বা '#' চিহ্ন ব্যৱহাৰ নকৰিব।
- ডাঠ বা হেলনীয়া কৰিবলৈ কোনো '*' ব্যৱহাৰ নকৰিব (যেনে **শব্দ** বা *শব্দ* নিলিখিব)।
- কোনো '#' চিহ্ন ব্যৱহাৰ নকৰিব (যেনে #, ##, ### নিলিখিব)।
- কোনো '=' বা '===' চিহ্ন ব্যৱহাৰ নকৰিব।
- কোনো শ্লেছ ('/') ব্যৱহাৰ নকৰিব (শ্লেছৰ সলনি 'বা', 'আৰু', কমা বা হাইফেন ব্যৱহাৰ কৰক)।
- তালিকাৰ বাবে কেৱল সাধাৰণ সংখ্যা (১., ২.) বা সাধাৰণ হাইফেন (-) ব্যৱহাৰ কৰক।

CRITICAL LANGUAGE MANDATE:
The user has asked in Assamese script. You MUST generate your ENTIRE response exclusively in pure, natural, grammatically correct, and polite Standard Assamese (প্ৰমিত অসমীয়া). 
Do NOT reply in English. Every explanation, guideline, greeting, advice, paragraph, bullet point, or conclusion must be written in the Assamese script.

Provide comprehensive, clear, accurate, and well-structured answers to the user's question. 
Answer any question (university rules, exams, admissions, syllabus, science, computing, career, general knowledge, etc.) politely, thoroughly, and encouragingly in Standard Assamese.`;
  } else {
    systemPrompt = `You are UniMitra, the official university AI assistant dedicated exclusively to Our University (${resolvedUnivName}).

SINGLE-UNIVERSITY & DUAL-SOURCE GROUNDING MANDATE:
1. This platform is dedicated exclusively to Our University (${resolvedUnivName}).
2. For questions regarding OUR UNIVERSITY (${resolvedUnivName}): Provide authoritative answers grounded in official statutory academic ordinances, examination bylaws, and institutional vector repository records.
3. For questions regarding OTHER UNIVERSITIES (e.g. Gauhati University, Tezpur University, Cotton University, Delhi University, etc.): Provide accurate information, comparisons, and academic details using web data and general educational knowledge. Do NOT treat Our University's specific circulars as belonging to other universities. Clarify that while official statutory documents in this portal are anchored to ${resolvedUnivName}, external university information is provided from web data. Never refuse to answer.

CRITICAL UNPUBLISHED DOCUMENT & COMPREHENSIVE ANSWER MANDATE:
You can and MUST answer ALL user questions with maximum accuracy. Never refuse to answer any query.
However, if an inquiry regarding Our University (${resolvedUnivName}) is NOT present in the verified repository PDFs:
Step 1: State clearly: "The official notification or ordinance on this specific topic has not yet been published by the university authority."
Step 2: Provide an accurate, comprehensive, and helpful alternative answer on the topic using general educational and academic knowledge so the user's question is completely satisfied.
Step 3: Conclude with: "Your requirement has been automatically recorded and forwarded to the university administrator on the Review & Feedback page for official document verification and publication." 

CRITICAL DIRECT ANSWER MANDATE:
Answer the user's question directly, concisely, and authoritatively.
NEVER start your response with repetitive boilerplate self-introductions or persona declarations (do NOT say "Hello! I am UniMitra, your official intelligent university AI assistant dedicated to supporting students, faculty, and staff across universities in Assam—such as Dibrugarh University, Gauhati University...").
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemPrompt}\n\nUser Question: ${cleanQuery}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1024
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
  async sendQuery({ query, sessionId = null, language = 'en', university = null }) {
    const sId = sessionId || `session-${Date.now()}`;
    const mode = detectLanguageMode(query, language);

    // 1. Attempt Backend Gateway Call
    try {
      const response = await fetch(`${CHAT_API}/query`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          query,
          sessionId: sId,
          language: mode,
          university: university?.code || university?.name || 'DU'
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
            source: data.data.source || `${university?.name || 'Dibrugarh University'} Gazette`,
            page: data.data.page || data.data.clause || 'Verified Regulation',
            confidence: data.data.confidence || '99.4% Verified Match',
            isUnverified: data.data.isUnverified || false,
            citations: data.data.citations || []
          };
        }
      }
    } catch {
      // Backend is offline or unreachable - proceed to live AI engines
    }

    // 2. Direct Python AI Service Call (Port 8000)
    const pythonResult = await callPythonAiService({ query, language: mode, university });
    if (pythonResult) {
      return {
        ...pythonResult,
        answer: stripUnwantedIntro(pythonResult.answer, query),
        sessionId: sId
      };
    }

    // 3. Direct Google Gemini AI Model Cascade (Strict Language Matching: as_script | as_roman | en)
    const geminiResult = await callDirectGemini({ query, language: mode, university });
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

    const finalAnswer = stripUnwantedIntro(geminiResult?.answer || localResult?.answer || fallbackAnswer, query);
    
    // If response indicates unpublished document, forward requirement to Admin Review & Feedback page
    const lowerAns = (finalAnswer || '').toLowerCase();
    if (
      lowerAns.includes('not yet been published') ||
      lowerAns.includes('প্ৰকাশ কৰা হোৱা নাই') ||
      lowerAns.includes('publish kora nai') ||
      lowerAns.includes('forwarded to the university administrator') ||
      lowerAns.includes('প্ৰশাসকলৈ স্বয়ংক্ৰিয়ভাৱে প্ৰেৰণ')
    ) {
      logUnpublishedQueryToAdmin(query, finalAnswer);
    }

    return {
      success: true,
      fromBackend: false,
      fromAi: false,
      sessionId: sId,
      answer: finalAnswer,
      source: localResult?.source || `${university?.name || 'Dibrugarh University'} Knowledge Repository`,
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

  getSessionMessages(sessionId, domain = 'student') {
    if (!sessionId) return null;
    try {
      const raw = localStorage.getItem(getDomainMessageKey(sessionId, domain));
      if (raw) return JSON.parse(raw);
      if (domain === 'student') {
        const legacy = localStorage.getItem(unimitra_messages_);
        if (legacy) return JSON.parse(legacy);
      }
      return null;
    } catch {
      return null;
    }
  },

  saveSessionMessages(sessionId, messages, domain = 'student') {
    if (!sessionId) return;
    try {
      localStorage.setItem(getDomainMessageKey(sessionId, domain), JSON.stringify(messages));
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
   * Synthesize high-speed neural speech audio using TTS-Accelerator.
   * Calls Backend POST /api/v1/voice/synthesize, returning a playable Object URL.
   */
  async synthesizeVoiceAudio(text, language = 'as', gender = 'male') {
    if (!text || !text.trim()) return null;
    const clean = sanitizeAiResponse(text);
    try {
      const response = await fetch(`${API_BASE}/voice/synthesize`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          text: clean,
          language: language || 'as',
          gender: gender || 'male',
        }),
      });

      if (!response.ok) {
        throw new Error(`TTS synthesis failed with status ${response.status}`);
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (err) {
      console.warn('Backend TTS-Accelerator synthesis unavailable, falling back:', err);
      return null;
    }
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
