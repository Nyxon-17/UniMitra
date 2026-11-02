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
  'axomiya', 'asomiya', 'asom', 'assam', 'sosa', 'misa'
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

  if (/[\u0980-\u09FF]/.test(text)) {
    return 'as_script';
  }

  const lower = text.toLowerCase();
  if (lower.includes('assamese script') || lower.includes('in assamese script') || lower.includes('অসমীয়া লিপি')) {
    return 'as_script';
  }

  for (const p of ROMANIZED_PHRASES) {
    if (lower.includes(p)) {
      return 'as_roman';
    }
  }

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

  return {
    rawQuery: cleaned,
    normalizedQuery,
    languageMode,
    isRomanized,
  };
}

