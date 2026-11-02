import { useState, useEffect } from 'react';
import { universityService } from '../../services/universityService';
import { 
  BuildingOfficeIcon, 
  SearchIcon, 
  SparklesIcon, 
  CheckCircleIcon, 
  DocumentTextIcon, 
  BuildingLibraryIcon,
  ShieldCheckIcon,
  ArrowRightIcon 
} from '../../components/common/Icons';

export const DashboardFacilities = ({ onNavigateTab, currentLang = 'en' }) => {
  const [univProfile, setUnivProfile] = useState(() => universityService.getProfile());
  const [facilitiesList, setFacilitiesList] = useState(() => universityService.getFacilities());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const handleSync = () => {
      setUnivProfile(universityService.getProfile());
      setFacilitiesList(universityService.getFacilities());
    };
    window.addEventListener('unimitra_university_changed', handleSync);
    return () => window.removeEventListener('unimitra_university_changed', handleSync);
  }, []);

  const categories = ['All', 'Accommodation', 'Academic Resource', 'Healthcare', 'Sports & Fitness'];

  const filtered = facilitiesList.filter((f) => {
    const matchCat = selectedCategory === 'All' || f.category === selectedCategory;
    const matchSearch =
      !searchQuery.trim() ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.asName && f.asName.includes(searchQuery)) ||
      f.rules.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="neo-surface rounded-3xl p-6 sm:p-8 shadow-sm transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-black uppercase text-[#FF933E] dark:text-[#03C988]">
              <BuildingOfficeIcon className="w-4 h-4" />
              <span>{univProfile.name} • Campus Life & Infrastructure</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#000000] dark:text-[#FFFFFF]">
              {currentLang === 'as' ? `${univProfile.asName}ৰ চৌহদৰ সুবিধাসমূহ` : `${univProfile.name} Campus Facilities`}
            </h1>
            <p className="text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80 max-w-2xl leading-relaxed">
              {currentLang === 'as'
                ? `১৬টা ছাত্ৰ আৰু ছাত্ৰী নিৱাস, লক্ষ্মীনাথ বেজবৰুৱা কেন্দ্ৰীয় গ্ৰন্থাগাৰ, স্বাস্থ্য কেন্দ্ৰ আৰু ইনড’ৰ ষ্টেডিয়ামৰ চৰকাৰী নিয়মসমূহ।`
                : `Official bylaws and regulations for 16 Halls of Residence, Central Library, 24x7 Health Clinic, and Olympic-size Sports Arena.`}
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('assistant', { prefillQuery: `What are the hostel allotment rules, distance criteria, and curfew hours at ${univProfile.name}?` })}
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl font-black text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-[#000000] transition-all cursor-pointer shadow-xs text-xs sm:text-sm shrink-0"
          >
            <SparklesIcon className="w-4 h-4" />
            <span>{currentLang === 'as' ? 'হোষ্টেলৰ বিষয়ে সোধক' : 'Ask AI About Hostels'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="neo-surface rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap cursor-pointer transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] shadow-xs'
                    : 'bg-white dark:bg-[#141414] text-[#000000] dark:text-[#FFFFFF] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 hover:bg-[#FFE9A9]/30'
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
              placeholder="Search hostels, library, timings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((fac) => (
          <div
            key={fac.id}
            className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#141414] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 space-y-4 shadow-xs hover:border-[#FF933E] dark:hover:border-[#03C988] transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase text-[#000000]/80 dark:text-[#FFFFFF]/80">
                {fac.category}
              </span>
              <button
                onClick={() => onNavigateTab('assistant', { prefillQuery: currentLang === 'as' ? fac.asName || fac.name : fac.name })}
                className="text-xs font-black text-[#FF933E] dark:text-[#03C988] hover:underline flex items-center space-x-1"
              >
                <span>Ask AI</span>
                <ArrowRightIcon className="w-3 h-3" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-black text-[#000000] dark:text-[#FFFFFF]">
                {fac.name}
              </h3>
              {fac.asName && (
                <p className="text-xs font-bold text-[#FF933E] dark:text-[#03C988] mt-0.5">
                  {fac.asName}
                </p>
              )}
            </div>

            <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-[#000000]/60 dark:text-[#FFFFFF]/60 block font-bold">Capacity / Size:</span>
                <span className="font-bold text-[#000000] dark:text-[#FFFFFF]">{fac.capacity}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#000000]/60 dark:text-[#FFFFFF]/60 block font-bold">Timings & Curfew:</span>
                <span className="font-bold text-[#FF933E] dark:text-[#03C988]">{fac.timings}</span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-bold text-[#000000] dark:text-[#FFFFFF] block">Bylaws & Allotment Rules:</span>
              <p className="text-[#000000]/70 dark:text-[#FFFFFF]/80 leading-relaxed">
                {currentLang === 'as' && fac.asRules ? fac.asRules : fac.rules}
              </p>
            </div>

            <div className="pt-3 border-t border-[#73A5CA]/30 dark:border-[#1C82AD]/30 flex items-center justify-between text-xs">
              <span className="font-mono text-[11px] text-[#000000]/60 dark:text-[#FFFFFF]/60">
                Location: {fac.location}
              </span>
              <span className="text-[10px] text-[#03C988] font-bold flex items-center space-x-1">
                <ShieldCheckIcon className="w-3.5 h-3.5" />
                <span>Verified Facility</span>
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
