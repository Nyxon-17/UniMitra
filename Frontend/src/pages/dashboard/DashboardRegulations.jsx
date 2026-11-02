import { useState, useEffect } from 'react';
import { universityService } from '../../services/universityService';
import { 
  BuildingLibraryIcon, 
  SearchIcon, 
  SparklesIcon, 
  DocumentTextIcon, 
  CheckCircleIcon, 
  ClipboardDocumentCheckIcon, 
  ChevronDownIcon,
  ShieldCheckIcon,
  ArrowRightIcon
} from '../../components/common/Icons';

export const DashboardRegulations = ({ 
  onNavigateTab, 
  currentLang = 'en'
}) => {
  const [univProfile, setUnivProfile] = useState(() => universityService.getProfile());
  const [regulationsList, setRegulationsList] = useState(() => universityService.getRegulations());
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDoc, setExpandedDoc] = useState(null);

  useEffect(() => {
    const handleSync = () => {
      setUnivProfile(universityService.getProfile());
      setRegulationsList(universityService.getRegulations());
    };
    window.addEventListener('unimitra_university_changed', handleSync);
    return () => window.removeEventListener('unimitra_university_changed', handleSync);
  }, []);

  const categories = [
    'All',
    'Attendance & Ordinances',
    'Curriculum & Degree Framework',
    'Student Welfare & Discipline',
    'Faculty Governance'
  ];

  const filteredRegulations = regulationsList.filter((reg) => {
    const matchCat = selectedCategory === 'All' || reg.category === selectedCategory;
    const matchSearch = !searchQuery.trim() || 
      reg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (reg.asTitle && reg.asTitle.includes(searchQuery)) ||
      reg.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="neo-surface rounded-3xl p-6 sm:p-8 shadow-sm transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-black uppercase text-[#FF933E] dark:text-[#03C988]">
              <BuildingLibraryIcon className="w-4 h-4" />
              <span>{univProfile.name} • Statutory Ordinances</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#000000] dark:text-[#FFFFFF]">
              {currentLang === 'as' ? `${univProfile.asName}ৰ বিধিবদ্ধ নিয়মাৱলী` : `${univProfile.name} Regulations & Ordinances`}
            </h1>
            <p className="text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80 max-w-2xl leading-relaxed">
              {currentLang === 'as'
                ? `প্ৰতিষ্ঠানিক অধিনিয়ম, পৰীক্ষাৰ মূল্যায়ন, শ্ৰেণী উপস্থিতিৰ চৰ্ত আৰু আইনী অধিসূচনাসমূহ অন্বেষণ কৰক। সকলো তথ্য AI সহায়কৰ দ্বাৰা প্ৰমাণিত।`
                : `Browse verified statutory regulations, attendance rules, condonation limits, and academic council ordinances of ${univProfile.name}. Grounded in verified university gazettes.`}
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('assistant', { prefillQuery: `Summarize ${univProfile.name} class attendance condonation and passing criteria regulations.` })}
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl font-black text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-[#000000] transition-all cursor-pointer shadow-xs text-xs sm:text-sm shrink-0"
          >
            <SparklesIcon className="w-4 h-4" />
            <span>{currentLang === 'as' ? 'সহায়কক সোধক' : 'Ask AI to Explain'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="neo-surface rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
              Regulation Domain
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none"
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Keyword Search */}
          <div>
            <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
              Search Clauses & Ordinances
            </label>
            <div className="relative">
              <SearchIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Attendance, condonation, credit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Regulations List */}
      <div className="space-y-4">
        {filteredRegulations.length === 0 ? (
          <div className="neo-surface rounded-3xl p-10 text-center border border-dashed border-[#73A5CA]/40">
            <BuildingLibraryIcon className="w-10 h-10 mx-auto text-[#FF933E] dark:text-[#03C988] mb-2" />
            <h3 className="text-base font-black text-[#000000] dark:text-[#FFFFFF]">
              {currentLang === 'as' ? 'কোনো বিধিবদ্ধ নিয়মাৱলী পোৱা নগ’ল' : 'No Statutory Regulations Found'}
            </h3>
            <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80 mt-1">
              {currentLang === 'as' ? 'অনুগ্ৰহ কৰি আন বিভাগ বা অনুসন্ধান শব্দ বাছনি কৰক।' : 'No statutory ordinances match the selected category or search filter.'}
            </p>
          </div>
        ) : (
          filteredRegulations.map((reg) => {
          const isExpanded = expandedDoc === reg.id;
          return (
            <div
              key={reg.id}
              className="neo-surface rounded-3xl p-5 sm:p-6 shadow-xs hover:border-[#FF933E] dark:hover:border-[#03C988] transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs sm:text-sm font-black uppercase tracking-wide text-[#000000] dark:text-[#FFFFFF]">
                    {reg.ordinanceNo || 'Statutory Ordinance'}
                  </span>
                  <span className="text-xs font-bold text-[#FF933E] dark:text-[#03C988]">
                    {reg.category}
                  </span>
                </div>

                <button
                  onClick={() => onNavigateTab('assistant', { prefillQuery: currentLang === 'as' ? reg.asTitle || reg.title : reg.title })}
                  className="px-3 py-1.5 rounded-xl bg-[#FFE9A9]/30 dark:bg-[#0A0A0A] text-xs font-black text-[#000000] dark:text-[#FFFFFF] hover:bg-[#FF933E] hover:text-white dark:hover:bg-[#03C988] dark:hover:text-black transition-all cursor-pointer flex items-center space-x-1.5 self-start sm:self-auto"
                >
                  <SparklesIcon className="w-3.5 h-3.5" />
                  <span>Ask AI Assistant</span>
                </button>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-black text-[#000000] dark:text-[#FFFFFF]">
                  {reg.title}
                </h3>
                {reg.asTitle && (
                  <p className="text-xs font-bold text-[#FF933E] dark:text-[#03C988] mt-0.5">
                    {reg.asTitle}
                  </p>
                )}
                <p className="text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80 mt-2 leading-relaxed">
                  {currentLang === 'as' && reg.asSummary ? reg.asSummary : reg.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-[#73A5CA]/30 dark:border-[#1C82AD]/30 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center space-x-2 font-mono text-[11px] text-[#000000]/70 dark:text-[#FFFFFF]/70">
                  <DocumentTextIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988]" />
                  <span>Citation: {reg.citation}</span>
                </div>

                <div className="flex items-center space-x-1 text-[11px] text-[#03C988] font-bold">
                  <ShieldCheckIcon className="w-3.5 h-3.5" />
                  <span>Grounded Knowledge Base</span>
                </div>
              </div>
            </div>
          );
        }))}
      </div>

    </div>
  );
};
