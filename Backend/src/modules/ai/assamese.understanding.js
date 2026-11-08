
export const INPUT_CANONICAL_MAP = [
  [/(?<![\u0980-\u09FF])বৃত্তিৰ(?![\u0980-\u09FF])/gi, 'স্কলাৰশ্বিপৰ'],
  [/(?<![\u0980-\u09FF])বৃত্তি(?![\u0980-\u09FF])/gi, 'স্কলাৰশ্বিপ'],
  [/(?<![\u0980-\u09FF])বৃত্তিবোৰ(?![\u0980-\u09FF])/gi, 'স্কলাৰশ্বিপসমূহ'],
  [/(?<![\u0980-\u09FF])বৃত্তিসমূহ(?![\u0980-\u09FF])/gi, 'স্কলাৰশ্বিপসমূহ'],
  [/(?<![\u0980-\u09FF])জলপানিৰ(?![\u0980-\u09FF])/gi, 'স্কলাৰশ্বিপৰ'],
  [/(?<![\u0980-\u09FF])জলপানি(?![\u0980-\u09FF])/gi, 'স্কলাৰশ্বিপ'],
  [/\bbrittir\b/gi, 'scholarship or'],
  [/\bbritti\b/gi, 'scholarship'],
  [/\bjolpanir\b/gi, 'scholarship or'],
  [/\bjolpani\b/gi, 'scholarship'],
  [/\bzolpanir\b/gi, 'scholarship or'],
  [/\bzolpani\b/gi, 'scholarship'],
  [/(?<![\u0980-\u09FF])ষাণ্মাসিকৰ(?![\u0980-\u09FF])/gi, 'ছেমিষ্টাৰৰ'],
  [/(?<![\u0980-\u09FF])ষাণ্মাসিকত(?![\u0980-\u09FF])/gi, 'ছেমিষ্টাৰত'],
  [/(?<![\u0980-\u09FF])ষাণ্মাসিক(?![\u0980-\u09FF])/gi, 'ছেমিষ্টাৰ'],
  [/\bxanmaxikor\b/gi, 'semester or'],
  [/\bxanmaxikot\b/gi, 'semester ot'],
  [/\bxanmaxik\b/gi, 'semester'],
  [/\bsanmasikor\b/gi, 'semester or'],
  [/\bsanmasik\b/gi, 'semester'],
  [/(?<![\u0980-\u09FF])ছাত্ৰাবাসৰ(?![\u0980-\u09FF])/gi, 'হোষ্টেলৰ'],
  [/(?<![\u0980-\u09FF])ছাত্ৰাবাসত(?![\u0980-\u09FF])/gi, 'হোষ্টেলত'],
  [/(?<![\u0980-\u09FF])ছাত্ৰাবাস(?![\u0980-\u09FF])/gi, 'হোষ্টেল'],
  [/(?<![\u0980-\u09FF])ছাত্ৰীনিবাসৰ(?![\u0980-\u09FF])/gi, 'ছোৱালী হোষ্টেলৰ'],
  [/(?<![\u0980-\u09FF])ছাত্ৰীনিবাসত(?![\u0980-\u09FF])/gi, 'ছোৱালী হোষ্টেলত'],
  [/(?<![\u0980-\u09FF])ছাত্ৰীনিবাস(?![\u0980-\u09FF])/gi, 'ছোৱালী হোষ্টেল'],
  [/\bsatrabasor\b/gi, 'hostel or'],
  [/\bsatrabasot\b/gi, 'hostel ot'],
  [/\bsatrabas\b/gi, 'hostel'],
  [/\bchatrabasor\b/gi, 'hostel or'],
  [/\bchatrabas\b/gi, 'hostel'],
  [/(?<![\u0980-\u09FF])সময়সূচীৰ(?![\u0980-\u09FF])/gi, 'ৰুটিনৰ'],
  [/(?<![\u0980-\u09FF])সময়সূচী(?![\u0980-\u09FF])/gi, 'ৰুটিন'],
  [/\bxomoyxusir\b/gi, 'routine or'],
  [/\bxomoyxusi\b/gi, 'routine'],
  [/\bsomoysusir\b/gi, 'routine or'],
  [/\bsomoysusi\b/gi, 'routine'],
  [/(?<![\u0980-\u09FF])প্ৰৱেশৰ(?![\u0980-\u09FF])/gi, 'এডমিশ্বনৰ'],
  [/(?<![\u0980-\u09FF])প্ৰৱেশ(?![\u0980-\u09FF])/gi, 'এডমিশ্বন'],
  [/\bprowexor\b/gi, 'admission or'],
  [/\bprowex\b/gi, 'admission'],
  [/\bprobeshor\b/gi, 'admission or'],
  [/\bprobesh\b/gi, 'admission'],
  [/(?<![\u0980-\u09FF])উপস্থিতিৰ(?![\u0980-\u09FF])/gi, 'এটেনডেন্সৰ'],
  [/(?<![\u0980-\u09FF])উপস্থিতি(?![\u0980-\u09FF])/gi, 'এটেনডেন্স'],
  [/\buposthitir\b/gi, 'attendance or'],
  [/\buposthiti\b/gi, 'attendance'],
  [/(?<![\u0980-\u09FF])মাচুলৰ(?![\u0980-\u09FF])/gi, 'ফীৰ'],
  [/(?<![\u0980-\u09FF])মাচুল(?![\u0980-\u09FF])/gi, 'ফী'],
  [/\bmasulor\b/gi, 'fees or'],
  [/\bmasul\b/gi, 'fees'],
];

export function canonicalizeInputTerms(text = '') {
  if (!text) return text;
  let result = text;
  for (const [pattern, replacement] of INPUT_CANONICAL_MAP) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

/**
 * Assamese-English Input Understanding Layer (UniMitra AI - Node.js Backend)
 * Recognizes, normalizes, and interprets Romanized Assamese,
 * informal chat spellings, abbreviations, and mixed Assamese-English typing.
 */

export const ABBREVIATION_MAP = {
  tmi: 'tumi',
  apni: 'apuni',
  da: 'dada',
  ba: 'baideu',
  bhai: 'bhaity',
  kwn: 'kun',
  kty: 'ketiya',
  kt: 'kot',
  knk: 'kenekoi',
  knke: 'kenekoi',
  knka: 'keneka',
  kio: 'kio',
  kyon: 'kio',
  kba: 'kiba',
  bikhoye: 'bisoye',
  bikhoy: 'bisoy',
  bikhoyot: 'bisoyot',
  kowa: 'kuwa',
  ghrt: 'ghorot',
  ghor: 'ghor',
  ghr: 'ghor',
  colg: 'college',
  univ: 'university',
  prha: 'porha',
  somoy: 'homoy',
  vl: 'bhal',
  vhl: 'bhal',
  ety: 'etiya',
  khbr: 'khobor',
  hbo: 'hobo',
  nhy: 'nohoy',
  ny: 'nai',
  asl: 'asil',
  aslo: 'asilo',
  lgbo: 'lagibo',
  lgb: 'lagibo',
  krsu: 'korisu',
  krsa: 'korisa',
  krm: 'korim',
  bujisu: 'bujisu',
  bujilu: 'bujilu',
  thx: 'dhonnobad',
  pls: 'onugroh',
};

export const ROMANIZED_ASSAMESE_LEXICON = new Set([
  'moi', 'mur', 'muk', 'mok', 'amie', 'ami', 'amar', 'amuk',
  'tumi', 'tumar', 'tuk', 'tote', 'toi', 'tor',
  'apuni', 'apunar', 'apunak', 'apunaluk', 'apunalukor',
  'he', 'tai', 'teu', 'teuk', 'teur', 'hehot', 'hehote', 'hehotor',
  'kun', 'kune', 'kunkhun', 'kunba', 'kuntu', 'kunta',
  'ki', 'kio', 'kioba', 'koba', 'kiba', 'kibata', 'kiojanu',
  'kot', 'kote', 'kotba', 'kotuba',
  'ketiya', 'ketiyaba', 'ketiyar', 'kailoi',
  'kenekua', 'kenekuwa', 'kenedore', 'kenekoi', 'keneka', 'keneke',
  'kiman', 'kimanta', 'kimankhini',
  'ei', 'eitu', 'eibur', 'eia', 'hei', 'heitu', 'heibur', 'heia',
  'eta', 'duita', 'tinta', 'saari', 'paas',
  'ase', 'asa', 'asu', 'asila', 'asilo', 'asil', 'asise', 'asiso', 'asene', 'asane',
  'nai', 'nohoy', 'nahoi', 'ne', 'naha', 'nobo', 'najanu',
  'hobo', 'hoi', 'hol', 'hola', 'hole', 'hoise', 'hua', 'huwa', 'hobone',
  'kora', 'kore', 'korim', 'korisa', 'korisu', 'kori', 'koribo', 'korisila', 'korile', 'koru',
  'bonai', 'bonau', 'bonabo', 'bonaba', 'bonaisu', 'banai', 'banaise', 'bonalu',
  'jao', 'jau', 'jaba', 'jam', 'gole', 'gol', 'goise', 'gosil', 'gosilo', 'jabo', 'juwa',
  'aha', 'ahe', 'ahibo', 'aisu', 'ahilu', 'ahile', 'ahise', 'ahiba',
  'kuwa', 'kua', 'kobo', 'koise', 'koi', 'kolu', 'kole', 'koba',
  'de', 'diya', 'dibo', 'dilu', 'dile', 'dise', 'diba',
  'loa', 'lobo', 'lolu', 'lole', 'loise', 'loba',
  'pam', 'paba', 'pale', 'paisu', 'paiso', 'pabo', 'pua', 'paise',
  'parim', 'pariba', 'pare', 'paru', 'para', 'parile', 'nuwarim', 'nuwaru',
  'sau', 'soa', 'saise', 'sabo', 'salu', 'sale', 'saba',
  'jana', 'janu', 'jane', 'janibo', 'janilu', 'janisa', 'janiba',
  'buji', 'bujisu', 'bujisa', 'bujibo', 'bujilu', 'bujise', 'bujua',
  'porha', 'porhu', 'porhe', 'porhibo', 'porhisa', 'porhisu', 'porhile',
  'likha', 'likhu', 'likhe', 'likhibo', 'likhisa', 'likhisu',
  'khua', 'khau', 'khabo', 'khaise', 'khalu', 'khaba',
  'bisaru', 'bisare', 'bisara', 'bisaribo', 'bisarisu',
  'lagibo', 'lage', 'lagisil', 'lagene', 'lagibone',
  'thaka', 'thaku', 'thake', 'thakibo', 'thakisa', 'thakisu', 'thakile',
  'ghor', 'ghorot', 'ghorote', 'ghoroloi',
  'bhal', 'bhalo', 'bhalne', 'beya',
  'kotha', 'khobor', 'homoy', 'somoy', 'manuh',
  'dada', 'baideu', 'bhaity', 'ma', 'deuta', 'bondhu',
  'dhonnobad', 'namaskar', 'nomoskar', 'pronam',
  'aji', 'kali', 'porohi', 'etiya', 'pisot', 'pasot', 'agote',
  'gao', 'gaon', 'shohor', 'nohor', 'rasta',
  'paani', 'gaakheer', 'saah', 'chai', 'saani', 'bhaat',
  'bohi', 'kitap', 'kolom', 'routine',
  'axomiya', 'asomiya', 'asom', 'assam', 'sosa', 'misa', 'bikhoy', 'bikhoye', 'bikhoyot', 'kowa', 'bisoy', 'bisoye', 'bisoyot'
]);

export const ROMANIZED_PHRASES = [
  'tumi kun', 'kun hoi', 'kun tumi', 'apuni kun', 'tumi kenekua', 'kenekua asa',
  'bhal asu', 'bhal ne', 'ki khobor', 'ki kori asa', 'ki kori aso', 'ki korisa',
  'coffee kenekoi', 'kenekoi bonai', 'kenedore bonai', 'keneka bonai', 'bonabo bisaru',
  'ghrt e asu', 'ghorot asu', 'ghorote asu', 'college jam', 'ghoroloi jam',
  'mur exam', 'kali ase', 'aji ase', 'ketiya hobo', 'buji pua nai', 'buji napalu',
  'buji pua', 'bujisu moi', 'pass mark', 'minimum marks', 'admission ketiya',
  'form fillup', 'fee kiman', 'result ketiya', 'help kora', 'muk kuwa',
  'mok kuwa', 'jana ase', 'lagibo ne', 'in assamese', 'in axomiya', 'in asomiya'
];

export const INTENT_RULES = [
  {
    pattern: /\b(tumi|apuni|toi)\s+(kun|kwn|kunba)\s*(hoi|hoii|ne)?\b|\b(kun|kwn)\s+(tumi|apuni|hoi)\b/i,
    asMeaning: 'তুমি কোন হয়? (আপুনি কোন?)',
    enIntent: 'User is asking who you are / asking for identity.',
  },
  {
    pattern: /\b([a-zA-Z]+)\s+(kenekoi|kenedore|keneka|keneke|knk)\s+(bonai|banai|kore|bonabo|kora hoi)\b/i,
    asMeaning: 'কফি বা খাদ্য কেনেকৈ বনাই?',
    enIntent: 'User is asking for preparation steps / how to make something.',
  },
  {
    pattern: /\b(aji|kali|etiya)?\s*(ghrt|ghorot|ghorote|ghor)\s*(e)?\s*(asu|asa|ase|asilo)\b/i,
    asMeaning: 'আজি ঘৰতে আছোঁ।',
    enIntent: 'User is stating they are currently at home.',
  },
  {
    pattern: /\b(moi|ami)\s+([a-zA-Z]+)\s*(ot|oloi)?\s*(jam|jau|jabo|ahim)\b/i,
    asMeaning: 'মই কলেজ বা নিৰ্দিষ্ট স্থানলৈ যাম।',
    enIntent: 'User is stating their intention to go to a location (jam = will go).',
  },
  {
    pattern: /\b(tumi|apuni)\s+(ki|kiba)\s+(kori|korisa|korisu|kora)\s*(asa|aso|ne)?\b/i,
    asMeaning: 'তুমি কি কৰি আছা?',
    enIntent: 'User is asking what you are doing right now.',
  },
  {
    pattern: /\b(mur|amar)\s+(exam|porikha|class|test)\s+(kali|aji|ketiya|somoyot|ahibor)\s*(ase|hobo|asil)\b/i,
    asMeaning: 'মোৰ পৰীক্ষা কাইলৈ বা সোনকালে আছে।',
    enIntent: 'User is mentioning that their exam/class is scheduled for tomorrow/today.',
  },
  {
    pattern: /\b(moi|ami)?\s*(buji|bujibo|buzi)\s*(pua|paisu|paise)?\s*(nai|noarilu|parise|ny)\b|\bbuji\s*napalu\b/i,
    asMeaning: 'মই বুজি পোৱা নাই / বুজি পালোঁ।',
    enIntent: 'User is stating whether they understood or need clarification.',
  },
  {
    pattern: /\b(pass|passing|uttirno)\s*(mark|marks|nombor)?\s*(kiman|kiba)?\s*(lagibo|lage|hobo)\b/i,
    asMeaning: 'পৰীক্ষাত উত্তীৰ্ণ হ\'বলৈ নূন্যতম নম্বৰ কিমান লাগিব?',
    enIntent: 'User is asking about minimum passing marks (40%).',
  },
  {
    pattern: /\b(attendance|uposthiti|medical)\s*(kiman|lagibo|shortage|condonation)?\b/i,
    asMeaning: 'শ্ৰেণী উপস্থিতি আৰু মেডিকেল ৰেহাইৰ নিয়ম কি?',
    enIntent: 'User is asking about 75% attendance and medical condonation.',
  },
  {
    pattern: /\b(kenekua|kenekuwa|keneka)\s*(asa|aso|ne)\b|\b(bhal)\s*(ne|asu|asa)\b|\bki\s*khobor\b/i,
    asMeaning: 'তুমি কেনেকুৱা আছা? ভালনে?',
    enIntent: 'User is asking how you are doing / friendly greeting.',
  }
];

export function expandAbbreviations(text = '') {
  if (!text) return text;
  let normalized = text.replace(/\bghrt\s*e\b/gi, 'ghorote');
  normalized = normalized.replace(/\bghrte\b/gi, 'ghorote');

  const tokens = normalized.split(/\s+/);
  const expanded = tokens.map(token => {
    const cleanWord = token.toLowerCase().replace(/[^a-zA-Z]/g, '');
    if (ABBREVIATION_MAP[cleanWord]) {
      const rep = ABBREVIATION_MAP[cleanWord];
      return token.replace(new RegExp(cleanWord, 'i'), rep);
    }
    return token;
  });

  return expanded.join(' ');
}

export function detectLanguageModeAdvanced(text = '', requestedLang = 'en') {
  if (!text) {
    return requestedLang === 'as_roman' ? 'as_roman' : (requestedLang === 'as' ? 'as_script' : 'en');
  }

  // 1. Assamese Unicode Script check
  if (/[\u0980-\u09FF]/.test(text)) {
    return 'as_script';
  }

  const lower = text.toLowerCase();
  if (lower.includes('assamese script') || lower.includes('in assamese script') || lower.includes('অসমীয়া লিপি')) {
    return 'as_script';
  }

  // 2. Romanized Phrases
  for (const p of ROMANIZED_PHRASES) {
    if (lower.includes(p)) {
      return 'as_roman';
    }
  }

  // 3. Tokens & Lexicon
  const words = lower.match(/[a-zA-Z]+/g) || [];
  if (!words.length) return 'en';

  const expanded = words.map(w => ABBREVIATION_MAP[w] || w);
  const assameseMatches = expanded.filter(w => ROMANIZED_ASSAMESE_LEXICON.has(w)).length;
  const total = words.length;

  if (assameseMatches >= 1) {
    if (assameseMatches >= 2 || total <= 3 || (assameseMatches / total) >= 0.2) {
      return 'as_roman';
    }
  }

  if (requestedLang === 'as_roman') return 'as_roman';
  if (requestedLang === 'as' || requestedLang === 'as_script') return 'as_script';
  return 'en';
}

export function interpretQuery(query = '', requestedLang = 'en') {
  const cleaned = (query || '').trim();
  const normalizedQuery = expandAbbreviations(cleaned);
  const languageMode = detectLanguageModeAdvanced(normalizedQuery, requestedLang);
  const isRomanized = languageMode === 'as_roman';

  let assameseMeaning = '';
  let englishIntent = '';

  for (const rule of INTENT_RULES) {
    if (rule.pattern.test(normalizedQuery)) {
      assameseMeaning = rule.asMeaning;
      englishIntent = rule.enIntent;
      break;
    }
  }

  if (isRomanized && !assameseMeaning) {
    assameseMeaning = 'ব্যৱহাৰকাৰীয়ে ৰোমানাইজড অসমীয়াত (ইংৰাজী আখৰেৰে) সুধিছে বা বাৰ্তালাপ কৰিছে।';
    englishIntent = 'User is communicating in Romanized Assamese (Assamese words in English alphabet).';
  }

  let contextHint = '';
  if (isRomanized) {
    const parts = [];
    if (assameseMeaning) parts.append ? parts.append(`Understood Meaning: ${assameseMeaning}`) : parts.push(`Understood Meaning: ${assameseMeaning}`);
    if (englishIntent) parts.push(`Intent: ${englishIntent}`);
    contextHint = parts.join(' | ');
  }

  return {
    rawQuery: cleaned,
    normalizedQuery,
    languageMode,
    isRomanized,
    assameseMeaning,
    englishIntent,
    contextHint,
  };
}

