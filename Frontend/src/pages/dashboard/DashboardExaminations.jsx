import { useState, useEffect } from 'react';
import { universityService } from '../../services/universityService';
import { 
  BuildingLibraryIcon, 
  ClipboardDocumentCheckIcon, 
  CheckCircleIcon, 
  SearchIcon, 
  DocumentTextIcon, 
  SparklesIcon, 
  ClockIcon, 
  ArrowRightIcon,
  ShieldCheckIcon
} from '../../components/common/Icons';

export const DashboardExaminations = ({ onNavigateTab, currentLang = 'en' }) => {
  const [univProfile, setUnivProfile] = useState(() => universityService.getProfile());
  const [examGuidelines, setExamGuidelines] = useState(() => universityService.getExaminations());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const handleSync = () => {
      setUnivProfile(universityService.getProfile());
      setExamGuidelines(universityService.getExaminations());
    };
    window.addEventListener('unimitra_university_changed', handleSync);
    return () => window.removeEventListener('unimitra_university_changed', handleSync);
  }, []);

  const categories = [
    { id: 'all', label: 'All Ordinances' },
    { id: 'Passing Criteria', label: 'Passing Criteria' },
    { id: 'Re-Evaluation', label: 'Re-Evaluation Rules' },
    { id: 'Backlog Rules', label: 'Backlog & Betterment' },
  ];

  const filtered = examGuidelines.filter((item) => {
    const matchCat = activeCategory === 'all' || item.category === activeCategory;
    const matchSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.asTitle && item.asTitle.includes(searchQuery)) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 rounded-3xl p-6 sm:p-8 shadow-xs card-3d">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-black uppercase text-[#FF933E] dark:text-[#03C988]">
              <ClipboardDocumentCheckIcon className="w-4 h-4" />
              <span>{univProfile.name} • Examination Branch</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#000000] dark:text-[#FFFFFF]">
              {currentLang === 'as' ? `${univProfile.asName}ৰ পৰীক্ষা আৰু মূল্যায়ন নীতি` : `${univProfile.name} Examinations & Evaluation`}
            </h1>
            <p className="text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80 max-w-2xl leading-relaxed">
              {currentLang === 'as'
                ? `ইন-চেমিষ্টাৰ আৰু এণ্ড-চেমিষ্টাৰ নূন্যতম উত্তীৰ্ণ নম্বৰ, পুনৰমূল্যায়নৰ সময়সীমা আৰু বেক পেপাৰ ক্লিয়াৰেন্সৰ চৰকাৰী বিধিসমূহ।`
                : `Official guidelines for in-semester assessments, end-sem 40% passing thresholds, script re-evaluation fees, and backlog clearance rules.`}
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('assistant', { prefillQuery: `What are the minimum passing marks in ${univProfile.name} semester exams and the re-evaluation rules?` })}
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl font-black text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-[#000000] transition-all cursor-pointer shadow-xs text-xs sm:text-sm shrink-0"
          >
            <SparklesIcon className="w-4 h-4" />
            <span>{currentLang === 'as' ? 'পৰীক্ষাৰ বিষয়ে সোধক' : 'Ask AI About Exams'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap cursor-pointer transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] shadow-xs'
                    : 'bg-white dark:bg-[#00337C] text-[#000000] dark:text-[#FFFFFF] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 hover:bg-[#FFE9A9]/30'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <SearchIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search marks, re-evaluation, backlogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#13005A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Guidelines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((exam) => (
          <div
            key={exam.id}
            className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 space-y-4 shadow-xs hover:border-[#FF933E] dark:hover:border-[#03C988] transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-[#FFE9A9] dark:bg-[#13005A] text-[#000000] dark:text-[#FFFFFF] border border-[#FFCB56] dark:border-[#03C988]">
                {exam.category} • {exam.ordinanceNo}
              </span>
              <button
                onClick={() => onNavigateTab('assistant', { prefillQuery: currentLang === 'as' ? exam.asTitle || exam.title : exam.title })}
                className="text-xs font-black text-[#FF933E] dark:text-[#03C988] hover:underline flex items-center space-x-1"
              >
                <span>Ask AI</span>
                <ArrowRightIcon className="w-3 h-3" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-black text-[#000000] dark:text-[#FFFFFF]">
                {exam.title}
              </h3>
              {exam.asTitle && (
                <p className="text-xs font-bold text-[#FF933E] dark:text-[#03C988] mt-0.5">
                  {exam.asTitle}
                </p>
              )}
              <p className="text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80 mt-2 leading-relaxed">
                {currentLang === 'as' && exam.asSummary ? exam.asSummary : exam.summary}
              </p>
            </div>

            {exam.details && (
              <div className="p-3 rounded-xl bg-[#FFE9A9]/20 dark:bg-[#13005A] text-xs text-[#000000]/80 dark:text-[#FFFFFF]/80">
                <strong>Key Provision:</strong> {exam.details}
              </div>
            )}

            <div className="pt-3 border-t border-[#73A5CA]/30 dark:border-[#1C82AD]/30 flex items-center justify-between text-xs">
              <span className="font-mono text-[11px] text-[#000000]/60 dark:text-[#FFFFFF]/60">
                Citation: {exam.citation}
              </span>
              <span className="text-[10px] text-[#03C988] font-bold flex items-center space-x-1">
                <ShieldCheckIcon className="w-3.5 h-3.5" />
                <span>Verified</span>
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
