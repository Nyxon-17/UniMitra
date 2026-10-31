import { useState, useEffect } from 'react';
import { universityService } from '../../services/universityService';
import { 
  IdentificationIcon, 
  SearchIcon, 
  SparklesIcon, 
  CheckCircleIcon, 
  DocumentTextIcon, 
  ArrowRightIcon,
  BuildingLibraryIcon,
  ShieldCheckIcon 
} from '../../components/common/Icons';

export const DashboardAdmissions = ({ onNavigateTab, currentLang = 'en' }) => {
  const [univProfile, setUnivProfile] = useState(() => universityService.getProfile());
  const [admissionsList, setAdmissionsList] = useState(() => universityService.getAdmissions());
  const [programmesList, setProgrammesList] = useState(() => universityService.getProgrammes());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('procedures'); // 'procedures' | 'programmes'

  useEffect(() => {
    const handleSync = () => {
      setUnivProfile(universityService.getProfile());
      setAdmissionsList(universityService.getAdmissions());
      setProgrammesList(universityService.getProgrammes());
    };
    window.addEventListener('unimitra_university_changed', handleSync);
    return () => window.removeEventListener('unimitra_university_changed', handleSync);
  }, []);

  const filteredAdmissions = admissionsList.filter((a) => {
    return (
      !searchQuery.trim() ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.asTitle && a.asTitle.includes(searchQuery)) ||
      a.eligibility.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const filteredProgrammes = programmesList.filter((p) => {
    return (
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.asName && p.asName.includes(searchQuery)) ||
      p.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 rounded-3xl p-6 sm:p-8 shadow-xs card-3d">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-black uppercase text-[#FF933E] dark:text-[#03C988]">
              <IdentificationIcon className="w-4 h-4" />
              <span>{univProfile.name} • Academic Admissions</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#000000] dark:text-[#FFFFFF]">
              {currentLang === 'as' ? `${univProfile.asName}ৰ নামভৰ্তি আৰু পাঠ্যক্ৰম` : `${univProfile.name} Admissions & Programmes`}
            </h1>
            <p className="text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80 max-w-2xl leading-relaxed">
              {currentLang === 'as'
                ? `স্নাতকোত্তৰ DUPGET প্ৰৱেশ পৰীক্ষা, সমৰ্থ পৰ্টেলৰ চাৰি বছৰীয়া স্নাতক (FYUGP) আৰু ডক্টৰেট (Ph.D.) ডিগ্ৰীৰ নামভৰ্তি পদ্ধতি।`
                : `Official guidelines for Postgraduate DUPGET entrance test, Samarth portal FYUGP UG admissions, degree programmes, and Ph.D. vacancies.`}
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('assistant', { prefillQuery: `What is the admission procedure, entrance test (DUPGET), and eligibility criteria for ${univProfile.name}?` })}
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl font-black text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-[#000000] transition-all cursor-pointer shadow-xs text-xs sm:text-sm shrink-0"
          >
            <SparklesIcon className="w-4 h-4" />
            <span>{currentLang === 'as' ? 'ভৰ্তিৰ বিষয়ে সোধক' : 'Ask AI About Admissions'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Tab Bar */}
      <div className="bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('procedures')}
              className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition-all ${
                activeTab === 'procedures'
                  ? 'bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] shadow-xs'
                  : 'bg-white dark:bg-[#00337C] text-[#000000] dark:text-[#FFFFFF] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 hover:bg-[#FFE9A9]/30'
              }`}
            >
              Admission Procedures ({admissionsList.length})
            </button>
            <button
              onClick={() => setActiveTab('programmes')}
              className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition-all ${
                activeTab === 'programmes'
                  ? 'bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] shadow-xs'
                  : 'bg-white dark:bg-[#00337C] text-[#000000] dark:text-[#FFFFFF] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 hover:bg-[#FFE9A9]/30'
              }`}
            >
              Degree Programmes ({programmesList.length})
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <SearchIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search DUPGET, M.Tech, eligibility..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#13005A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Procedures Tab */}
      {activeTab === 'procedures' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAdmissions.map((adm) => (
            <div
              key={adm.id}
              className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 space-y-4 shadow-xs hover:border-[#FF933E] dark:hover:border-[#03C988] transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-[#FFE9A9] dark:bg-[#13005A] text-[#000000] dark:text-[#FFFFFF] border border-[#FFCB56] dark:border-[#03C988]">
                  {adm.category}
                </span>
                <button
                  onClick={() => onNavigateTab('assistant', { prefillQuery: currentLang === 'as' ? adm.asTitle || adm.title : adm.title })}
                  className="text-xs font-black text-[#FF933E] dark:text-[#03C988] hover:underline flex items-center space-x-1"
                >
                  <span>Ask AI</span>
                  <ArrowRightIcon className="w-3 h-3" />
                </button>
              </div>

              <div>
                <h3 className="text-base font-black text-[#000000] dark:text-[#FFFFFF]">
                  {adm.title}
                </h3>
                {adm.asTitle && (
                  <p className="text-xs font-bold text-[#FF933E] dark:text-[#03C988] mt-0.5">
                    {adm.asTitle}
                  </p>
                )}
              </div>

              <div className="p-3 rounded-2xl bg-[#FFE9A9]/20 dark:bg-[#13005A] space-y-1 text-xs">
                <div>
                  <span className="text-[10px] text-[#000000]/60 dark:text-[#FFFFFF]/60 block font-bold">Important Dates:</span>
                  <span className="font-bold text-[#000000] dark:text-[#FFFFFF]">{adm.dates}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#000000]/60 dark:text-[#FFFFFF]/60 block font-bold">Fee Structure:</span>
                  <span className="font-bold text-[#FF933E] dark:text-[#03C988]">{adm.fee}</span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <span className="font-bold text-[#000000] dark:text-[#FFFFFF] block">Minimum Eligibility:</span>
                <p className="text-[#000000]/70 dark:text-[#FFFFFF]/80 leading-relaxed">
                  {currentLang === 'as' && adm.asEligibility ? adm.asEligibility : adm.eligibility}
                </p>
              </div>

              <div className="space-y-1 text-xs">
                <span className="font-bold text-[#000000] dark:text-[#FFFFFF] block">Application Steps:</span>
                <ul className="list-disc pl-4 space-y-0.5 text-[#000000]/70 dark:text-[#FFFFFF]/70">
                  {(adm.steps || []).map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-[#73A5CA]/30 dark:border-[#1C82AD]/30 flex items-center justify-between text-xs">
                <a
                  href={adm.portalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-[11px] text-[#FF933E] dark:text-[#03C988] hover:underline"
                >
                  Official Portal ↗
                </a>
                <span className="text-[10px] text-[#03C988] font-bold flex items-center space-x-1">
                  <ShieldCheckIcon className="w-3.5 h-3.5" />
                  <span>Verified Pathway</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Degree Programmes Tab */}
      {activeTab === 'programmes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProgrammes.map((prog) => (
            <div
              key={prog.id}
              className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 space-y-3 shadow-xs hover:border-[#FF933E] dark:hover:border-[#03C988] transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-[#FFE9A9] dark:bg-[#13005A] text-[#000000] dark:text-[#FFFFFF] border border-[#FFCB56] dark:border-[#03C988]">
                  {prog.level} • {prog.code}
                </span>
                <button
                  onClick={() => onNavigateTab('assistant', { prefillQuery: `Eligibility and intake for ${prog.name} at ${univProfile.name}` })}
                  className="text-xs font-black text-[#FF933E] dark:text-[#03C988] hover:underline flex items-center space-x-1"
                >
                  <span>Ask AI</span>
                  <ArrowRightIcon className="w-3 h-3" />
                </button>
              </div>

              <div>
                <h3 className="text-base font-black text-[#000000] dark:text-[#FFFFFF]">
                  {prog.name}
                </h3>
                {prog.asName && (
                  <p className="text-xs font-bold text-[#FF933E] dark:text-[#03C988] mt-0.5">
                    {prog.asName}
                  </p>
                )}
              </div>

              <div className="p-3 rounded-2xl bg-[#FFE9A9]/20 dark:bg-[#13005A] grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-[#000000]/60 dark:text-[#FFFFFF]/60 block font-bold">Department:</span>
                  <span className="font-bold text-[#000000] dark:text-[#FFFFFF]">{prog.department}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#000000]/60 dark:text-[#FFFFFF]/60 block font-bold">Intake Capacity:</span>
                  <span className="font-bold text-[#FF933E] dark:text-[#03C988]">{prog.intake} Seats ({prog.duration})</span>
                </div>
              </div>

              <div className="text-xs space-y-0.5">
                <span className="font-bold text-[#000000] dark:text-[#FFFFFF] block">Admission Eligibility:</span>
                <p className="text-[#000000]/70 dark:text-[#FFFFFF]/80 leading-relaxed">
                  {currentLang === 'as' && prog.asEligibility ? prog.asEligibility : prog.eligibility}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
