import { useState } from 'react';
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

  const institutionalDomains = [
    {
      id: 'regulations',
      title: 'University Regulations & Ordinances',
      asTitle: 'বিশ্ববিদ্যালয় নিয়মাৱলী আৰু অধিসূচনা',
      count: '64 Verified Statutes',
      desc: 'Attendance rules, academic council notifications, conduct codes, and grading ordinances.',
      icon: BuildingLibraryIcon,
      accent: 'bg-[#E0D4FD]/40'
    },
    {
      id: 'regulations',
      title: 'Examinations & Evaluation Guidelines',
      asTitle: 'পৰীক্ষাৰ মূল্যায়ন আৰু নিয়ম',
      count: '118 Active Guidelines',
      desc: 'In-semester sessionals, end-sem passing criteria (40%), re-evaluation fees, and back papers.',
      icon: ClipboardDocumentCheckIcon,
      accent: 'bg-[#FFE9A9]'
    },
    {
      id: 'admissions',
      title: 'Academic Programs & Admissions',
      asTitle: 'পাঠ্যক্ৰম আৰু নামভৰ্তি',
      count: '420+ Degree Programs',
      desc: 'UG, PG, and Ph.D. degree eligibility, entrance test dates, reservation quotas, and merit lists.',
      icon: IdentificationIcon,
      accent: 'bg-[#E0D4FD]/40'
    },
    {
      id: 'scholarships',
      title: 'Scholarships & State Grants',
      asTitle: 'ছাত্ৰবৃত্তি আৰু আৰ্থিক অনুদান',
      count: '24 Grant Schemes',
      desc: 'Assam DHE combined merit scholarship, Ishan Uday, post-matric funds, and deadlines.',
      icon: BanknotesIcon,
      accent: 'bg-[#FFE9A9]'
    },
    {
      id: 'facilities',
      title: 'Campus Facilities & Hostels',
      asTitle: 'চৌহদৰ সুবিধা আৰু হোষ্টেল',
      count: '82 Campus Centers',
      desc: 'Hostel seat allotment, central library hours, health centers, and student welfare cells.',
      icon: BuildingOfficeIcon,
      accent: 'bg-[#E0D4FD]/40'
    }
  ];

  const recentAnswers = [
    {
      q: 'What is the attendance condonation criteria for Gauhati University exams?',
      asQ: 'গুৱাহাটী বিশ্ববিদ্যালয়ৰ পৰীক্ষাত উপস্থিতি ৰেহাইৰ (Condonation) চৰ্ত কি?',
      domain: 'Regulations & Ordinances',
      source: 'GU_Examination_Ordinance_UG.pdf',
      page: 'Page 14, Clause 8.2',
      date: 'Today, 10:30 AM'
    },
    {
      q: 'What are the application deadlines and eligibility for DHE Combined Merit Scholarship?',
      asQ: 'উচ্চ শিক্ষা সঞ্চালকালয়ৰ মেধা বৃত্তিৰ যোগ্যতা আৰু অন্তিম তাৰিখ কি?',
      domain: 'Scholarships & Grants',
      source: 'Assam_DHE_Scholarship_Notice_2024.pdf',
      page: 'Page 3, Section 2',
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
      <div className="relative bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-md dark:shadow-[0_0_15px_rgba(176,38,255,0.25)] card-3d overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#6D28D9]/20 via-[#E0D4FD]/25 to-transparent rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-black tracking-wider uppercase text-[#FF933E] dark:text-[#03C988] dark:text-[#FFFFFF]">
              {currentLang === 'as' ? 'বিশ্ববিদ্যালয় শৈক্ষিক আৰু প্ৰশাসনিক কেন্দ্ৰ' : 'Institutional Assistance Portal • UniMitra'}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#000000] dark:text-[#FFFFFF] tracking-tight">
              {currentLang === 'as' 
                ? `নমস্কাৰ ${studentInfo.name}! বিশ্ববিদ্যালয়ৰ তথ্য অন্বেষণ কৰক` 
                : `Welcome, ${studentInfo.name}! Ask Any Institutional Query`}
            </h1>
            <p className="text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80 max-w-xl leading-relaxed">
              {currentLang === 'as'
                ? 'অসমৰ বিশ্ববিদ্যালয়সমূহৰ অফিচিয়েল নিয়মাৱলী, পৰীক্ষাৰ জাননী, ভৰ্তি প্ৰক্ৰিয়া আৰু ছাত্ৰবৃত্তিৰ তথ্য সঠিক পৃষ্ঠা নম্বৰসহ উপলব্ধ।'
                : 'Access verified institutional regulations, examination guidelines, degree admissions, scholarships, and campus services with grounded citations in Assamese and English.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab('assistant')}
              className="flex items-center space-x-2 px-5 py-3 rounded-2xl font-black text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-[#000000] transition-all cursor-pointer shadow-xs hover:shadow-md text-xs sm:text-sm"
            >
              <SparklesIcon className="w-4 h-4 text-[#FAF8FF]" />
              <span>{currentLang === 'as' ? 'সহায়কক সোধক' : 'Ask AI Assistant'}</span>
            </button>
            <button
              onClick={() => onNavigateTab('regulations')}
              className="px-5 py-3 rounded-2xl font-black text-[#000000] dark:text-[#FFFFFF] bg-[#FFE9A9]/20 dark:bg-[#13005A] hover:bg-[#E0D4FD]/40 transition-all cursor-pointer text-xs sm:text-sm border border-[#73A5CA]/40 dark:border-[#1C82AD]/40"
            >
              {currentLang === 'as' ? 'নিয়মাৱলী চাওক' : 'View Regulations'}
            </button>
            <button
              onClick={() => onNavigateTab('scholarships')}
              className="flex items-center space-x-2 px-5 py-3 rounded-2xl font-black text-[#000000] dark:text-[#FFFFFF] bg-[#FFE9A9] dark:bg-[#3B2868]/50 hover:bg-[#FFE9A9]/80 transition-all cursor-pointer text-xs sm:text-sm border border-[#73A5CA]/40 dark:border-[#1C82AD]/40"
            >
              <BanknotesIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988] dark:text-[#FFFFFF]" />
              <span>{currentLang === 'as' ? 'ছাত্ৰবৃত্তি' : 'Scholarships'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Natural Language Assistant Prompt Bar */}
      <div className="bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 rounded-3xl p-4 sm:p-5 shadow-xs">
        <form onSubmit={handleQuickAsk} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center px-4 bg-[#FFE9A9]/20 dark:bg-[#13005A] rounded-2xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40">
            <SearchIcon className="w-5 h-5 text-[#FF933E] dark:text-[#03C988] mr-3 shrink-0" />
            <input
              type="text"
              placeholder={currentLang === 'as' ? 'অসমৰ যিকোনো বিশ্ববিদ্যালয়ৰ নিয়মাৱলী বা পৰীক্ষাৰ প্ৰশ্ন সোধক...' : 'Ask any university regulation, examination rule, admission, or hostel query...'}
              value={quickQuestion}
              onChange={(e) => setQuickQuestion(e.target.value)}
              className="w-full py-3 bg-transparent text-xs sm:text-sm text-[#000000] dark:text-[#FFFFFF] placeholder-[#555375]/70 dark:placeholder-[#C4B5FD]/60 focus:outline-none font-semibold"
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-[#000000] text-white text-xs sm:text-sm font-black transition-all cursor-pointer shadow-xs shrink-0"
          >
            <span>{currentLang === 'as' ? 'তৎক্ষণাত সোধক' : 'Ask AI'}</span>
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Institutional Information Domains */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-black text-[#000000] dark:text-[#FFFFFF] flex items-center space-x-2">
            <BuildingLibraryIcon className="w-5 h-5 text-[#FF933E] dark:text-[#03C988]" />
            <span>{currentLang === 'as' ? 'প্ৰধান শৈক্ষিক আৰু প্ৰশাসনিক শিতানসমূহ' : 'Institutional Information Domains'}</span>
          </h2>
          <span className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80 font-bold">
            All Assam Universities
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {institutionalDomains.map((domain, index) => {
            const Icon = domain.icon;
            return (
              <div
                key={index}
                onClick={() => onNavigateTab(domain.id)}
                className="bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 rounded-3xl p-5 hover:border-[#6D28D9] transition-all cursor-pointer card-3d flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-2xl ${domain.accent} border border-[#6D28D9]/30 flex items-center justify-center text-[#FF933E] dark:text-[#03C988] dark:text-[#FFFFFF]`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-lg bg-[#FFE9A9]/20 dark:bg-[#13005A] text-[#000000] dark:text-[#FFFFFF] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40">
                      {domain.count}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                    {currentLang === 'as' ? domain.asTitle : domain.title}
                  </h3>
                  <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80 leading-relaxed">
                    {domain.desc}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-[#73A5CA]/40/40 dark:border-[#1C82AD]/40 flex items-center justify-between text-xs font-black text-[#FF933E] dark:text-[#03C988] dark:text-[#FFFFFF]">
                  <span>Explore Verified Gazettes</span>
                  <span>➔</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Grounded Resolutions */}
      <div className="bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#73A5CA]/40/60 dark:border-[#1C82AD]/40 pb-3">
          <div className="flex items-center space-x-2 text-[#000000] dark:text-[#FFFFFF] font-black text-sm sm:text-base">
            <ShieldCheckIcon className="w-5 h-5 text-[#FF933E] dark:text-[#03C988]" />
            <span>Recent Grounded Inquiries with Page Citations</span>
          </div>
          <button
            onClick={() => onNavigateTab('history')}
            className="text-xs font-black text-[#FF933E] dark:text-[#03C988] dark:text-[#FFFFFF] hover:underline cursor-pointer"
          >
            View All History ➔
          </button>
        </div>

        <div className="space-y-3">
          {recentAnswers.map((item, idx) => (
            <div key={idx} className="bg-[#FFE9A9]/20 dark:bg-[#13005A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#FFE9A9] dark:bg-[#00337C] text-[#000000] dark:text-[#FFFFFF] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40">
                  {item.domain}
                </span>
                <h4 className="text-xs sm:text-sm font-black text-[#000000] dark:text-[#FFFFFF]">
                  {currentLang === 'as' ? item.asQ : item.q}
                </h4>
                <div className="flex items-center space-x-2 text-[11px] text-[#000000]/70 dark:text-[#FFFFFF]/80">
                  <DocumentTextIcon className="w-3.5 h-3.5 text-[#FF933E] dark:text-[#03C988]" />
                  <span>{item.source}</span>
                  <span>•</span>
                  <strong className="text-[#FF933E] dark:text-[#03C988] dark:text-[#FFFFFF]">{item.page}</strong>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('assistant', { prefillQuery: item.q })}
                className="px-3.5 py-1.5 rounded-xl text-xs font-black text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-[#000000] transition-all cursor-pointer self-start sm:self-auto shrink-0"
              >
                Re-Query
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
