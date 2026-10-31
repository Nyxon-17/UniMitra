import { useState, useEffect } from 'react';
import { universityService } from '../../services/universityService';
import { 
  SparklesIcon, 
  BuildingLibraryIcon, 
  ClipboardDocumentCheckIcon, 
  BanknotesIcon, 
  BuildingOfficeIcon, 
  IdentificationIcon, 
  CheckCircleIcon, 
  ArrowRightIcon, 
  SearchIcon,
  DocumentTextIcon,
  ShieldCheckIcon
} from '../../components/common/Icons';

export const DashboardHome = ({ 
  onNavigateTab, 
  currentLang = 'en',
  studentInfo = { name: 'Scholar', role: 'Student' }
}) => {
  const [quickQuestion, setQuickQuestion] = useState('');
  const [univProfile, setUnivProfile] = useState(() => universityService.getProfile());
  const [regulations, setRegulations] = useState(() => universityService.getRegulations());
  const [examinations, setExaminations] = useState(() => universityService.getExaminations());
  const [programmes, setProgrammes] = useState(() => universityService.getProgrammes());
  const [scholarships, setScholarships] = useState(() => universityService.getScholarships());
  const [facilities, setFacilities] = useState(() => universityService.getFacilities());

  useEffect(() => {
    const handleSync = () => {
      setUnivProfile(universityService.getProfile());
      setRegulations(universityService.getRegulations());
      setExaminations(universityService.getExaminations());
      setProgrammes(universityService.getProgrammes());
      setScholarships(universityService.getScholarships());
      setFacilities(universityService.getFacilities());
    };
    window.addEventListener('unimitra_university_changed', handleSync);
    return () => window.removeEventListener('unimitra_university_changed', handleSync);
  }, []);

  const institutionalDomains = [
    {
      id: 'regulations',
      title: 'Statutory Regulations & Ordinances',
      asTitle: 'বিশ্ববিদ্যালয় নিয়মাৱলী আৰু অধিসূচনা',
      count: `${regulations.length} Verified Statutes`,
      desc: 'Attendance rules, academic council notifications, conduct codes, and grading ordinances.',
      icon: BuildingLibraryIcon,
      accent: 'bg-[#FFE9A9]/50'
    },
    {
      id: 'examinations',
      title: 'Examinations & Evaluation Guidelines',
      asTitle: 'পৰীক্ষাৰ মূল্যায়ন আৰু নিয়ম',
      count: `${examinations.length} Active Guidelines`,
      desc: 'In-semester sessionals, end-sem passing criteria (40%), re-evaluation fees, and back papers.',
      icon: ClipboardDocumentCheckIcon,
      accent: 'bg-[#FFE9A9]'
    },
    {
      id: 'admissions',
      title: 'Academic Programmes & Admissions',
      asTitle: 'পাঠ্যক্ৰম আৰু নামভৰ্তি',
      count: `${programmes.length} Degree Programmes`,
      desc: 'UG, PG, and Ph.D. degree eligibility, entrance test dates, reservation quotas, and merit lists.',
      icon: IdentificationIcon,
      accent: 'bg-[#FFE9A9]/50'
    },
    {
      id: 'scholarships',
      title: 'Scholarships & State Grants',
      asTitle: 'ছাত্ৰবৃত্তি আৰু আৰ্থিক অনুদান',
      count: `${scholarships.length} Grant Schemes`,
      desc: 'Assam DHE combined merit scholarship, Ishan Uday, post-matric funds, and deadlines.',
      icon: BanknotesIcon,
      accent: 'bg-[#FFE9A9]'
    },
    {
      id: 'facilities',
      title: 'Campus Facilities & Hostels',
      asTitle: 'চৌহদৰ সুবিধা আৰু হোষ্টেল',
      count: `${facilities.length} Campus Centers`,
      desc: 'Hostel seat allotment, central library hours, health centers, and student welfare cells.',
      icon: BuildingOfficeIcon,
      accent: 'bg-[#FFE9A9]/50'
    }
  ];

  const recentAnswers = [
    {
      q: `What is the attendance condonation criteria for ${univProfile.name}?`,
      asQ: `${univProfile.asName}ত উপস্থিতি ৰেহাইৰ (Condonation) চৰ্ত কি?`,
      domain: 'Regulations & Ordinances',
      source: 'DU_Attendance_Regulations_2024.pdf',
      page: 'Section 4.3, Page 9',
      date: 'Today, 10:30 AM'
    },
    {
      q: 'What are the application deadlines and eligibility for DHE and Ishan Uday Scholarships?',
      asQ: 'উচ্চ শিক্ষা সঞ্চালকালয় আৰু ঈশান উদয় মেধা বৃত্তিৰ যোগ্যতা কি?',
      domain: 'Scholarships & Grants',
      source: 'Assam_DHE_Scholarship_Norms_2024.pdf',
      page: 'Section 3.1, Clause 5',
      date: 'Yesterday'
    }
  ];

  const handleQuickAsk = (e) => {
    e.preventDefault();
    if (!quickQuestion.trim()) return;
    onNavigateTab('assistant', { prefillQuery: quickQuestion });
  };

  return (
    <div className="space-y-8">
      
      {/* 3D Welcome Institutional Banner Card */}
      <div className="relative neo-surface rounded-3xl p-6 sm:p-8 shadow-sm transition-all duration-300 overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-black tracking-wider uppercase text-[#FF933E] dark:text-[#03C988]">
              {currentLang === 'as' ? `${univProfile.asName} শৈক্ষিক আৰু প্ৰশাসনিক কেন্দ্ৰ` : `${univProfile.name} Institutional Portal • UniMitra`}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#000000] dark:text-[#FFFFFF] tracking-tight">
              {currentLang === 'as' 
                ? `নমস্কাৰ ${studentInfo.name}! ${univProfile.asName}ৰ তথ্য অন্বেষণ কৰক` 
                : `Welcome, ${studentInfo.name}! Explore ${univProfile.name}`}
            </h1>
            <p className="text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80 max-w-xl leading-relaxed">
              {currentLang === 'as'
                ? `${univProfile.asName}ৰ অফিচিয়েল নিয়মাৱলী, পৰীক্ষাৰ মূল্যায়ন, ভৰ্তি প্ৰক্ৰিয়া আৰু ছাত্ৰবৃত্তিৰ তথ্য সঠিক পৃষ্ঠা নম্বৰ আৰু উদ্ধৃতিসহ উপলব্ধ।`
                : `Access verified institutional regulations, examination guidelines, degree admissions, scholarships, and campus services with grounded citations in Assamese and English.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab('assistant')}
              className="flex items-center space-x-2 px-5 py-3 rounded-2xl font-black text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-[#000000] transition-all cursor-pointer shadow-xs text-xs sm:text-sm"
            >
              <SparklesIcon className="w-4 h-4" />
              <span>{currentLang === 'as' ? 'সহায়কক সোধক' : 'Ask AI Assistant'}</span>
            </button>
            <button
              onClick={() => onNavigateTab('regulations')}
              className="px-5 py-3 rounded-2xl font-black text-[#000000] dark:text-[#FFFFFF] bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] hover:bg-[#FFE9A9]/40 transition-all cursor-pointer text-xs sm:text-sm border border-[#73A5CA]/40 dark:border-[#1C82AD]/40"
            >
              {currentLang === 'as' ? 'নিয়মাৱলী চাওক' : 'View Regulations'}
            </button>
            <button
              onClick={() => onNavigateTab('scholarships')}
              className="flex items-center space-x-2 px-5 py-3 rounded-2xl font-black text-[#000000] dark:text-[#FFFFFF] bg-[#FFE9A9] dark:bg-[#0A0A0A] hover:bg-[#FFE9A9]/80 transition-all cursor-pointer text-xs sm:text-sm border border-[#73A5CA]/40 dark:border-[#1C82AD]/40"
            >
              <BanknotesIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988]" />
              <span>{currentLang === 'as' ? 'ছাত্ৰবৃত্তি' : 'Scholarships'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Natural Language Assistant Prompt Bar */}
      <div className="neo-surface rounded-3xl p-4 sm:p-5 shadow-xs">
        <form onSubmit={handleQuickAsk} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center px-4 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] rounded-2xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40">
            <SearchIcon className="w-5 h-5 text-[#FF933E] dark:text-[#03C988] mr-3 shrink-0" />
            <input
              type="text"
              placeholder={
                currentLang === 'as'
                  ? `${univProfile.asName}ৰ নিয়মাৱলী, পৰীক্ষা বা ছাত্ৰবৃত্তিৰ বিষয়ে প্ৰশ্ন সোধক...`
                  : `Ask in Assamese or English about ${univProfile.name} regulations, exams, hostels...`
              }
              value={quickQuestion}
              onChange={(e) => setQuickQuestion(e.target.value)}
              className="w-full py-3 bg-transparent text-xs sm:text-sm text-[#000000] dark:text-[#FFFFFF] placeholder-[#000000]/50 dark:placeholder-[#FFFFFF]/50 outline-none"
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl font-black text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-[#000000] transition-all cursor-pointer shadow-xs text-xs sm:text-sm shrink-0"
          >
            <SparklesIcon className="w-4 h-4" />
            <span>{currentLang === 'as' ? 'উত্তৰ সন্ধান কৰক' : 'Search Knowledge Base'}</span>
          </button>
        </form>
      </div>

      {/* Institutional Domains Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-black text-[#000000] dark:text-[#FFFFFF]">
            {currentLang === 'as' ? `${univProfile.asName}ৰ শৈক্ষিক ক্ষেত্ৰসমূহ` : `${univProfile.name} Institutional Knowledge Domains`}
          </h2>
          <span className="text-xs font-bold text-[#FF933E] dark:text-[#03C988]">
            {univProfile.naacAccreditation}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {institutionalDomains.map((domain) => {
            const Icon = domain.icon;
            return (
              <div
                key={domain.id}
                onClick={() => onNavigateTab(domain.id)}
                className="group relative neo-surface rounded-3xl p-5 sm:p-6 shadow-xs hover:border-[#FF933E] dark:hover:border-[#03C988] transition-all cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFE9A9] dark:bg-[#0A0A0A] border border-[#FFCB56] dark:border-[#03C988] flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#FF933E] dark:text-[#03C988]" />
                    </div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#FFE9A9]/40 dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF]">
                      {domain.count}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-[#000000] dark:text-[#FFFFFF] group-hover:text-[#FF933E] dark:group-hover:text-[#03C988] transition-colors">
                      {currentLang === 'as' ? domain.asTitle : domain.title}
                    </h3>
                    <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/70 mt-1 line-clamp-2">
                      {domain.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#73A5CA]/30 dark:border-[#1C82AD]/30 flex items-center justify-between text-xs font-black text-[#FF933E] dark:text-[#03C988]">
                  <span>{currentLang === 'as' ? 'অধিক তথ্য চাওক' : 'Explore Domain'}</span>
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grounded Institutional Citations Callout */}
      <div className="neo-surface rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center space-x-2">
          <ShieldCheckIcon className="w-5 h-5 text-[#03C988]" />
          <h3 className="text-base font-black text-[#000000] dark:text-[#FFFFFF]">
            Grounded & Verifiable Institutional Citations
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recentAnswers.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/30 dark:border-[#1C82AD]/30 space-y-2"
            >
              <span className="text-[10px] font-black uppercase text-[#FF933E] dark:text-[#03C988]">
                {item.domain}
              </span>
              <p className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
                "{currentLang === 'as' ? item.asQ : item.q}"
              </p>
              <div className="flex items-center justify-between text-[11px] font-mono text-[#000000]/60 dark:text-[#FFFFFF]/60 pt-1">
                <span>{item.source}</span>
                <span className="font-sans font-bold text-[#03C988]">{item.page}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
