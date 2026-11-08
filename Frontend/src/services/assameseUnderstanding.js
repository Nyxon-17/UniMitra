
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
 * Assamese-English Input Understanding Layer (Frontend Client)
 * Normalizes, recognizes, and interprets Romanized Assamese, abbreviations,
 * and mixed Assamese-English typing.
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
  'axomiya', 'asomiya', 'asom', 'assam', 'sosa', 'misa',
  'r', 'or', 'ot', 't', 'karone', 'karne', 'bhabe', 'babe', 'subidha',
  'masul', 'maasul', 'fee', 'fees', 'khuju', 'khuja', 'hudhi', 'hudhisu',
  'hudhibo', 'hudhibone', 'hudhok', 'hudha', 'janibo', 'janisane',
  'bujai', 'bujaba', 'bujabo', 'bhitort', 'bahirot', 'majot',
  'bisoy', 'bisoye', 'bisoyot', 'neki', 'aseneki', 'asenki', 'hoboneki',
  'jon', 'khon', 'khan', 'tu', 'ta', 'bor', 'bilak'
]);

export const ROMANIZED_PHRASES = [
  'tumi kun', 'kun hoi', 'kun tumi', 'apuni kun', 'tumi kenekua', 'kenekua asa',
  'bhal asu', 'bhal ne', 'ki khobor', 'ki kori asa', 'ki kori aso', 'ki korisa',
  'coffee kenekoi', 'kenekoi bonai', 'kenedore bonai', 'keneka bonai', 'bonabo bisaru',
  'ghrt e asu', 'ghorot asu', 'ghorote asu', 'college jam', 'ghoroloi jam',
  'mur exam', 'kali ase', 'aji ase', 'ketiya hobo', 'buji pua nai', 'buji napalu',
  'buji pua', 'bujisu moi', 'pass mark', 'minimum marks', 'admission ketiya',
  'form fillup', 'fee kiman', 'result ketiya', 'help kora', 'muk kuwa',
  'mok kuwa', 'jana ase', 'lagibo ne', 'in assamese', 'in axomiya', 'in asomiya',
  'kene koi', 'kenekoi', 'ketiya hobo', 'ki hobo', 'kot ase', 'ki ase', 'kune pabo',
  'kiman lagibo', 'muk lagibo', 'mur babe', 'mur karone', 'hostel r', 'exam r', 'admission r', 'rules ki'
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
  if (!text || !text.trim()) {
    return requestedLang === 'as_roman' ? 'as_roman' : (requestedLang === 'as' || requestedLang === 'as_script' ? 'as_script' : 'en');
  }

  // 1. Assamese script check (বাংলা-অসমীয়া লিপি)
  if (/[\u0980-\u09FF]/.test(text)) {
    return 'as_script';
  }

  const lower = text.toLowerCase();

  // 2. Explicit request inside text
  if (lower.includes('assamese script') || lower.includes('in assamese script') || lower.includes('অসমীয়া লিপি')) {
    return 'as_script';
  }
  if (lower.includes('in romanized assamese') || lower.includes('in english alphabet') || lower.includes('romanized assamese')) {
    return 'as_roman';
  }

  // 3. Multi-word phrase triggers
  for (const p of ROMANIZED_PHRASES) {
    if (lower.includes(p)) {
      return 'as_roman';
    }
  }

  // 4. Token & Morphological Suffix Match
  const words = lower.match(/[a-zA-Z]+/g) || [];
  if (!words.length) return 'en';

  const expanded = words.map(w => ABBREVIATION_MAP[w] || w);
  let assameseMatches = 0;
  for (const w of expanded) {
    if (ROMANIZED_ASSAMESE_LEXICON.has(w)) {
      assameseMatches++;
    } else if (w.length > 3) {
      if (
        w.endsWith('or') || w.endsWith('ot') ||
        w.endsWith('khon') || w.endsWith('khan') ||
        w.endsWith('bilak') || w.endsWith('neki') ||
        w.endsWith('hobone') || w.endsWith('lagibo')
      ) {
        assameseMatches++;
      }
    }
  }

  if (assameseMatches >= 1) {
    return 'as_roman';
  }

  return 'en';
}

export function interpretQuery(query = '', requestedLang = 'en') {
  const cleaned = (query || '').trim();
  const normalizedQuery = expandAbbreviations(cleaned);
  const languageMode = detectLanguageModeAdvanced(normalizedQuery, requestedLang);
  const isRomanized = languageMode === 'as_roman';

  return {
    rawQuery: cleaned,
    normalizedQuery,
    languageMode,
    isRomanized,
  };
}

