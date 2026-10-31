import { useState, useEffect } from 'react';
import { universityService } from '../../services/universityService';
import { 
  BanknotesIcon, 
  SearchIcon, 
  SparklesIcon, 
  CheckCircleIcon, 
  DocumentTextIcon, 
  ShieldCheckIcon,
  ArrowRightIcon 
} from '../../components/common/Icons';

export const DashboardScholarships = ({ onNavigateTab, currentLang = 'en' }) => {
  const [univProfile, setUnivProfile] = useState(() => universityService.getProfile());
  const [scholarshipsList, setScholarshipsList] = useState(() => universityService.getScholarships());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const handleSync = () => {
      setUnivProfile(universityService.getProfile());
      setScholarshipsList(universityService.getScholarships());
    };
    window.addEventListener('unimitra_university_changed', handleSync);
    return () => window.removeEventListener('unimitra_university_changed', handleSync);
  }, []);

  const categories = ['All', 'Central Merit Scholarship', 'State Merit Scholarship', 'Welfare Scholarship'];

  const filtered = scholarshipsList.filter((s) => {
    const matchCat = selectedCategory === 'All' || s.type === selectedCategory;
    const matchSearch =
      !searchQuery.trim() ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.asName && s.asName.includes(searchQuery)) ||
      s.eligibility.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 rounded-3xl p-6 sm:p-8 shadow-xs card-3d">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-black uppercase text-[#FF933E] dark:text-[#03C988]">
              <BanknotesIcon className="w-4 h-4" />
              <span>{univProfile.name} • Financial Aid & Grants</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#000000] dark:text-[#FFFFFF]">
              {currentLang === 'as' ? `${univProfile.asName}ৰ ছাত্ৰবৃত্তি আৰু অনুদান` : `${univProfile.name} Scholarships & Financial Aid`}
            </h1>
            <p className="text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80 max-w-2xl leading-relaxed">
              {currentLang === 'as'
                ? `উত্তৰ-পূৰ্বাঞ্চলৰ ঈশান উদয়, অসম চৰকাৰৰ DHE সংযুক্ত মেধা ছাত্ৰবৃত্তি আৰু সংৰক্ষিত শ্ৰেণীৰ আৰ্থিক সাহাৰ্যৰ তথ্য।`
                : `Verified norms for UGC Ishan Uday, Assam Directorate of Higher Education (DHE) Combined Merit, and reserved category stipends.`}
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('assistant', { prefillQuery: `What are the eligibility criteria, family income ceiling, and documents required for Ishan Uday and Assam DHE scholarships?` })}
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl font-black text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-[#000000] transition-all cursor-pointer shadow-xs text-xs sm:text-sm shrink-0"
          >
            <SparklesIcon className="w-4 h-4" />
            <span>{currentLang === 'as' ? 'ছাত্ৰবৃত্তিৰ বিষয়ে সোধক' : 'Ask AI About Grants'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap cursor-pointer transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] shadow-xs'
                    : 'bg-white dark:bg-[#00337C] text-[#000000] dark:text-[#FFFFFF] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 hover:bg-[#FFE9A9]/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <SearchIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Ishan Uday, DHE, income..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#13005A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Scholarships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 space-y-4 shadow-xs hover:border-[#FF933E] dark:hover:border-[#03C988] transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-[#FFE9A9] dark:bg-[#13005A] text-[#000000] dark:text-[#FFFFFF] border border-[#FFCB56] dark:border-[#03C988]">
                {s.type}
              </span>
              <button
                onClick={() => onNavigateTab('assistant', { prefillQuery: currentLang === 'as' ? s.asName || s.name : s.name })}
                className="text-xs font-black text-[#FF933E] dark:text-[#03C988] hover:underline flex items-center space-x-1"
              >
                <span>Ask AI</span>
                <ArrowRightIcon className="w-3 h-3" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-black text-[#000000] dark:text-[#FFFFFF]">
                {s.name}
              </h3>
              {s.asName && (
                <p className="text-xs font-bold text-[#FF933E] dark:text-[#03C988] mt-0.5">
                  {s.asName}
                </p>
              )}
            </div>

            <div className="p-3 rounded-2xl bg-[#FFE9A9]/20 dark:bg-[#13005A] grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-[#000000]/60 dark:text-[#FFFFFF]/60 block font-bold">Award Amount:</span>
                <span className="font-black text-[#FF933E] dark:text-[#03C988]">{s.amount}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#000000]/60 dark:text-[#FFFFFF]/60 block font-bold">Annual Deadline:</span>
                <span className="font-black text-[#000000] dark:text-[#FFFFFF]">{s.deadline}</span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-bold text-[#000000] dark:text-[#FFFFFF] block">Eligibility Criteria:</span>
              <p className="text-[#000000]/70 dark:text-[#FFFFFF]/80 leading-relaxed">
                {currentLang === 'as' && s.asEligibility ? s.asEligibility : s.eligibility}
              </p>
            </div>

            <div className="pt-3 border-t border-[#73A5CA]/30 dark:border-[#1C82AD]/30 flex items-center justify-between text-xs">
              <span className="font-mono text-[11px] text-[#000000]/60 dark:text-[#FFFFFF]/60">
                Provider: {s.provider}
              </span>
              <span className="text-[10px] text-[#03C988] font-bold flex items-center space-x-1">
                <ShieldCheckIcon className="w-3.5 h-3.5" />
                <span>Verified Scheme</span>
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
