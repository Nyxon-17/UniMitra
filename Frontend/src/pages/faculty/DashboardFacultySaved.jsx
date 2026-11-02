import { useState, useEffect } from 'react';
import { 
  BuildingLibraryIcon, 
  DocumentTextIcon, 
  TrashIcon, 
  DocumentDuplicateIcon, 
  CheckIcon, 
  SearchIcon, 
  SparklesIcon, 
  ClockIcon,
  ShieldCheckIcon,
  UserGroupIcon
} from '../../components/common/Icons';

export const DashboardFacultySaved = ({ onNavigateTab, currentLang = 'en' }) => {
  const initialConsultations = [
    {
      id: 'CONSULT-01',
      title: 'CAS Promotion PBAS Score Eligibility for Associate Professor',
      tag: 'CAS Promotion',
      date: 'Yesterday at 03:40 PM',
      query: 'What are the required research score points and minimum service years for promotion from Assistant Professor (Stage 3) to Associate Professor (Stage 4)?',
      response: 'Under the UGC 2018 Regulations (Amended 2023), Assistant Professors with a PhD degree must complete 3 continuous years in Academic Level 12 (Stage 3). The candidate must possess a minimum of 7 research publications in peer-reviewed or UGC-CARE listed journals (of which at least 3 must have been published during the assessment period) and a cumulative research score of at least 70 as per Appendix II, Table 2.',
      source: 'UGC Regulations on Minimum Qualifications, Appendix II, Table 2, Page 74',
      university: 'State Universities of Assam'
    },
    {
      id: 'CONSULT-02',
      title: 'PhD Scholar Allocation and Maximum Supervision Quota',
      tag: 'PhD Supervision',
      date: '28 Oct 2026',
      query: 'Can an Associate Professor co-supervise an interdisciplinary PhD candidate from another university department without exceeding the 6-scholar quota?',
      response: 'Yes, an Associate Professor may serve as Co-Supervisor for an interdisciplinary research candidate upon recommendation of the Departmental Research Committee (DRC). In joint supervision, each co-supervisor is allocated a fractional weightage of 0.5 towards their statutory ceiling of 6 registered candidates.',
      source: 'Nivoraya University PhD Regulations, Clause 9(d), Page 24',
      university: 'Nivoraya University (DU)'
    },
    {
      id: 'CONSULT-03',
      title: 'Confidential Moderation Guidelines for UG End-Sem Question Papers',
      tag: 'Moderation Norms',
      date: '24 Oct 2026',
      query: 'What is the permissible percentage of question replacement by the Board of Moderators if a set has out-of-syllabus items?',
      response: 'The Board of Moderators (BOM) is authorized to amend or substitute up to a maximum of 30% of total questions in any given paper set to correct typographical errors, ambiguity, or syllabus deviations. If deviations exceed 30%, the set is rejected and the contingency Set B is moderated.',
      source: 'Gauhati University Examination Board Ordinances, Rule 11.2, Page 53',
      university: 'Gauhati University (GU)'
    }
  ];

  const [consultations, setConsultations] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('unimitra_faculty_consultations');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return initialConsultations;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    localStorage.setItem('unimitra_faculty_consultations', JSON.stringify(consultations));
  }, [consultations]);

  const handleDelete = (id) => {
    setConsultations((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCopy = (id, text) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const filtered = consultations.filter((item) => {
    const matchesTag = selectedTag === 'All' || item.tag === selectedTag;
    const q = searchQuery.toLowerCase();
    const matchesSearch = item.title.toLowerCase().includes(q) || 
                          item.query.toLowerCase().includes(q) || 
                          item.response.toLowerCase().includes(q);
    return matchesTag && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="neo-surface rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black tracking-wider uppercase text-[#FF933E] dark:text-[#03C988] dark:text-[#FFFFFF]">
              {currentLang === 'as' ? 'অধ্যাপকৰ সংৰক্ষিত বাৰ্তালাপ' : 'Faculty Research & Administrative Records'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#000000] dark:text-[#FFFFFF] tracking-tight">
              {currentLang === 'as' ? 'সংৰক্ষিত শৈক্ষিক পৰামৰ্শসমূহ' : 'Saved Academic Consultations & Ordinances'}
            </h1>
            <p className="text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80 mt-1">
              Archived statutory queries on CAS career promotions, PhD doctoral regulations, and syllabus moderation.
            </p>
          </div>

          <div className="shrink-0 flex items-center space-x-2">
            <span className="text-xs font-black text-[#000000]/80 dark:text-[#FFFFFF]/80">
              {consultations.length} Consultations
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="neo-surface rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <SearchIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search saved faculty consultations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#FF933E]/50 dark:border-[#03C988]/50"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['All', 'CAS Promotion', 'PhD Supervision', 'Moderation Norms'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all shrink-0 ${
                selectedTag === tag
                  ? 'bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] text-white shadow-xs'
                  : 'bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-[#000000]/70 dark:text-[#FFFFFF]/80 border border-[#73A5CA]/40 dark:border-[#1C82AD]/40'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Consultations List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div 
            key={item.id}
            className="neo-surface rounded-3xl p-6 sm:p-7 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#73A5CA]/40/40 dark:border-[#1C82AD]/40/40 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-black uppercase text-[#000000]/80 dark:text-[#FFFFFF]/80">
                  {item.tag}
                </span>
                <span className="text-xs font-bold text-[#000000]/70 dark:text-[#FFFFFF]/80 flex items-center space-x-1">
                  <ClockIcon className="w-3.5 h-3.5" />
                  <span>{item.date}</span>
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCopy(item.id, `${item.title}\n\nQ: ${item.query}\n\nA: ${item.response}\n\nSource: ${item.source}`)}
                  className="p-1.5 rounded-lg border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 hover:bg-[#E0D4FD]/20 text-[#000000] dark:text-[#FFFFFF] cursor-pointer"
                  title="Copy consultation"
                >
                  {copiedId === item.id ? <CheckIcon className="w-4 h-4 text-green-600" /> : <DocumentDuplicateIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988]" />}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg border border-red-200 dark:border-red-900 hover:bg-red-50 text-red-600 dark:text-red-400 cursor-pointer"
                  title="Delete consultation"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h2 className="text-base sm:text-lg font-black text-[#000000] dark:text-[#FFFFFF]">
              {item.title}
            </h2>

            <div className="p-3 bg-black/5 dark:bg-white/5 rounded-xl text-xs text-[#000000] dark:text-[#FFFFFF] font-bold">
              Q: {item.query}
            </div>

            <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/10 dark:border-white/10 text-xs sm:text-sm text-[#000000] dark:text-[#FFFFFF] leading-relaxed">
              {item.response}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#000000]/70 dark:text-[#FFFFFF]/80">
              <div className="flex items-center space-x-1.5">
                <ShieldCheckIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988] shrink-0" />
                <span className="font-bold">{item.source}</span>
                <span>•</span>
                <span>{item.university}</span>
              </div>

              <button
                onClick={() => onNavigateTab && onNavigateTab('assistant', { prefillQuery: item.query })}
                className="text-xs font-bold text-[#FF933E] dark:text-[#03C988] dark:text-[#FFFFFF] hover:underline flex items-center space-x-1 cursor-pointer self-start sm:self-auto"
              >
                <SparklesIcon className="w-3.5 h-3.5" />
                <span>Re-consult Assistant</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

