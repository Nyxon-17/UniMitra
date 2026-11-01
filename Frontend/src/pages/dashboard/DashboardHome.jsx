import { useState, useEffect } from 'react';
import { universityService } from '../../services/universityService';
import { 
  SparklesIcon, 
  VoiceAssistantLogo, 
  BuildingLibraryIcon, 
  ClipboardDocumentCheckIcon, 
  BanknotesIcon, 
  BuildingOfficeIcon, 
  IdentificationIcon, 
  ArrowRightIcon, 
  SearchIcon, 
  DocumentTextIcon, 
  ShieldCheckIcon,
  CheckCircleIcon
} from '../../components/common/Icons';

/**
 * Editorial + Aurora Student Portal / Dashboard Overview
 * 
 * Design Features:
 * - Editorial Typography & Generous Whitespace (Plus Jakarta Sans + Inter)
 * - Open, asymmetric visual layout (breaking away from generic rectangular cards)
 * - Fine hairline dividers and subtle aurora atmospheric backdrops
 * - Fully bilingual (Assamese + English) with synchronized university profile
 * - Deep Forest Teal (#123C3A), Champagne Accent (#D4A96A), Luminous Mint (#55C7B2)
 */
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

  const handleQuickAsk = (e) => {
    e.preventDefault();
    if (!quickQuestion.trim()) return;
    onNavigateTab('assistant', { prefillQuery: quickQuestion });
  };

  const sampleQueries = currentLang === 'as' ? [
    'পৰীক্ষাত বহিবলৈ ন্যূনতম উপস্থিতিৰ হাৰ কিমান?',
    'স্নাতকোত্তৰ হোষ্টেল আবণ্টন আৰু মেধা তালিকাৰ চৰ্ত',
    'উচ্চ শিক্ষা সঞ্চালকালয়ৰ ছাত্ৰবৃত্তি আৰু মাচুল ৰেহাই'
  ] : [
    'Attendance condonation criteria & medical exemption limits',
    'Re-evaluation fee and deadline after result publication',
    'Assam DHE combined merit scholarship eligibility criteria'
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

  return (
    <div className="space-y-10 sm:space-y-12">
      
      {/* 1. ASYMMETRIC EDITORIAL MASTHEAD */}
      <section className="relative editorial-surface rounded-2xl p-6 sm:p-10 overflow-hidden">
        {/* Soft atmospheric ambient glow */}
        <div 
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-40 dark:opacity-25 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(85, 199, 178, 0.35) 0%, rgba(212, 169, 106, 0.15) 60%, transparent 80%)' }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          
          {/* Left Editorial Text Column */}
          <div className="space-y-4 max-w-2xl">
            {/* Institution Badge & Accreditation */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-[#E9F0ED] dark:bg-[#142426] text-[#123C3A] dark:text-[#55C7B2] border border-[#123C3A]/10 dark:border-[#55C7B2]/20 font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4A96A] dark:bg-[#55C7B2] animate-pulse" />
                <span>{univProfile.code} Verified Portal</span>
              </span>

              <span className="text-[11px] font-medium text-[#627680] dark:text-[#879B99]">
                {univProfile.naacAccreditation} • {univProfile.city}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#123C3A] dark:text-[#DCE8E4] font-heading leading-[1.15]">
              {currentLang === 'as' ? (
                <>
                  নমস্কাৰ, <span className="text-[#D4A96A] dark:text-[#E0B77A]">{studentInfo.name}</span>!
                  <span className="block text-2xl sm:text-3xl lg:text-4xl font-normal mt-1 text-[#273B45] dark:text-[#DCE8E4]/80">
                    {univProfile.asName}ৰ শৈক্ষিক আৰু প্ৰশাসনিক কেন্দ্ৰ
                  </span>
                </>
              ) : (
                <>
                  Welcome, <span className="text-[#D4A96A] dark:text-[#E0B77A]">{studentInfo.name}</span>.
                  <span className="block text-2xl sm:text-3xl lg:text-4xl font-normal mt-1 text-[#273B45] dark:text-[#DCE8E4]/80">
                    {univProfile.name} Knowledge Hub
                  </span>
                </>
              )}
            </h1>

            {/* Sub-description */}
            <p className="text-sm sm:text-base text-[#627680] dark:text-[#879B99] leading-relaxed font-sans">
              {currentLang === 'as'
                ? 'অসমৰ বিশ্ববিদ্যালয়ৰ সংবিধিবদ্ধ অধিসূচনা, পৰীক্ষাৰ মূল্যায়ন, ভৰ্তি প্ৰক্ৰিয়া আৰু ছাত্ৰবৃত্তিৰ তথ্য সঠিক পৃষ্ঠা নম্বৰ আৰু চৰকাৰী গেজেট উদ্ধৃতিসহ সংৰক্ষিত।'
                : 'Access institutional statutes, examination ordinances, merit criteria, scholarships, and campus facilities with verifiable gazette citations in Assamese and English.'}
            </p>
          </div>

          {/* Right Action Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab('assistant')}
              className="flex items-center space-x-2 px-5 py-3 rounded-xl font-semibold text-white bg-[#123C3A] hover:bg-[#1a514e] dark:bg-[#55C7B2] dark:hover:bg-[#6be0cb] dark:text-[#16181A] transition-all cursor-pointer shadow-xs font-heading text-xs sm:text-sm"
            >
              <VoiceAssistantLogo className="w-6 h-6" animated={true} />
              <span>{currentLang === 'as' ? 'AI সহায়কক সোধক' : 'Ask AI Assistant'}</span>
            </button>

            <button
              onClick={() => onNavigateTab('regulations')}
              className="px-4 py-3 rounded-xl font-medium text-[#123C3A] dark:text-[#DCE8E4] bg-white/70 dark:bg-[#142426]/70 hover:bg-[#E9F0ED] dark:hover:bg-[#142426] transition-all cursor-pointer text-xs sm:text-sm border border-[#123C3A]/10 dark:border-[#55C7B2]/20 font-sans"
            >
              {currentLang === 'as' ? 'নিয়মাৱলী চাওক' : 'Browse Statutes'}
            </button>

            <button
              onClick={() => onNavigateTab('scholarships')}
              className="flex items-center space-x-2 px-4 py-3 rounded-xl font-medium text-[#123C3A] dark:text-[#DCE8E4] bg-[#E9F0ED]/70 dark:bg-[#142426]/70 hover:bg-[#E9F0ED] dark:hover:bg-[#142426] transition-all cursor-pointer text-xs sm:text-sm border border-[#123C3A]/10 dark:border-[#55C7B2]/20 font-sans"
            >
              <BanknotesIcon className="w-4 h-4 text-[#D4A96A] dark:text-[#55C7B2]" />
              <span>{currentLang === 'as' ? 'ছাত্ৰবৃত্তি' : 'Scholarships'}</span>
            </button>
          </div>

        </div>
      </section>

      {/* 2. ARCHITECTURAL NATURAL LANGUAGE SEARCH COMMAND BAR */}
      <section className="space-y-3">
        <form 
          onSubmit={handleQuickAsk}
          className="relative editorial-surface rounded-2xl p-2 sm:p-2.5 flex flex-col sm:flex-row items-center gap-2"
        >
          <div className="flex-1 flex items-center px-4 w-full">
            <SearchIcon className="w-5 h-5 text-[#123C3A]/60 dark:text-[#55C7B2]/70 mr-3 shrink-0" />
            <input
              type="text"
              placeholder={
                currentLang === 'as'
                  ? `${univProfile.asName}ৰ নিয়মাৱলী, পৰীক্ষা বা ছাত্ৰবৃত্তিৰ বিষয়ে প্ৰশ্ন সোধক...`
                  : `Ask natural language queries regarding ${univProfile.name} regulations, exams, grants...`
              }
              value={quickQuestion}
              onChange={(e) => setQuickQuestion(e.target.value)}
              className="w-full py-2.5 bg-transparent text-sm sm:text-base text-[#273B45] dark:text-[#DCE8E4] placeholder-[#273B45]/45 dark:placeholder-[#879B99] outline-none font-sans"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold text-white bg-[#123C3A] hover:bg-[#1a514e] dark:bg-[#55C7B2] dark:hover:bg-[#6be0cb] dark:text-[#16181A] transition-all cursor-pointer shadow-xs text-xs sm:text-sm shrink-0 font-heading"
          >
            <span>{currentLang === 'as' ? 'উত্তৰ অন্বেষণ কৰক' : 'Query Knowledge Base'}</span>
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </form>

        {/* Suggested Queries Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-1 px-1">
          <span className="text-[11px] font-semibold text-[#627680] dark:text-[#879B99] uppercase tracking-wider mr-1">
            {currentLang === 'as' ? 'সঘনাই সোধা প্ৰশ্ন:' : 'Common Topics:'}
          </span>
          {sampleQueries.map((topic, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onNavigateTab('assistant', { prefillQuery: topic })}
              className="text-xs px-3 py-1 rounded-full bg-white/60 dark:bg-[#142426]/60 hover:bg-[#E9F0ED] dark:hover:bg-[#142426] text-[#273B45] dark:text-[#DCE8E4]/90 border border-[#123C3A]/10 dark:border-[#55C7B2]/15 transition-all cursor-pointer truncate max-w-xs font-sans"
            >
              {topic}
            </button>
          ))}
        </div>
      </section>

      {/* 3. ASYMMETRIC INSTITUTIONAL KNOWLEDGE DOMAIN MATRIX */}
      <section className="space-y-6">
        
        {/* Section Header with Editorial Thin Rule */}
        <div className="flex items-end justify-between border-b border-[#123C3A]/10 dark:border-[#55C7B2]/15 pb-4">
          <div>
            <span className="text-[11px] font-semibold tracking-widest text-[#D4A96A] dark:text-[#E0B77A] uppercase font-sans">
              Official Repository Matrix
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#123C3A] dark:text-[#DCE8E4] font-heading mt-0.5">
              {currentLang === 'as' ? `${univProfile.asName}ৰ শৈক্ষিক শিতানসমূহ` : 'Institutional Knowledge Domains'}
            </h2>
          </div>
          <span className="text-xs font-medium text-[#627680] dark:text-[#879B99] hidden sm:block">
            {regulations.length + examinations.length + programmes.length + scholarships.length + facilities.length} Total Verified Documents
          </span>
        </div>

        {/* Asymmetric Split Layout: 2 Dominant Hero Columns + 3 Horizontal Ledgers */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Dominant Domain Card 1: Statutory Regulations & Ordinances (Col 6) */}
          <div 
            onClick={() => onNavigateTab('regulations')}
            className="lg:col-span-6 group editorial-surface rounded-2xl p-7 flex flex-col justify-between space-y-6 cursor-pointer hover:border-[#123C3A]/25 dark:hover:border-[#55C7B2]/40 transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-[#123C3A]/8 dark:bg-[#55C7B2]/10 border border-[#123C3A]/12 dark:border-[#55C7B2]/20 flex items-center justify-center text-[#123C3A] dark:text-[#55C7B2]">
                  <BuildingLibraryIcon className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#E9F0ED] dark:bg-[#142426] text-[#123C3A] dark:text-[#55C7B2] border border-[#123C3A]/10 dark:border-[#55C7B2]/20 font-sans">
                  {regulations.length} Verified Statutes
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#123C3A] dark:text-[#DCE8E4] font-heading group-hover:text-[#D4A96A] dark:group-hover:text-[#55C7B2] transition-colors">
                  {currentLang === 'as' ? 'বিশ্ববিদ্যালয় নিয়মাৱলী আৰু অধিসূচনা' : 'Statutory Regulations & Ordinances'}
                </h3>
                <p className="text-xs sm:text-sm text-[#627680] dark:text-[#879B99] mt-2 leading-relaxed font-sans">
                  Attendance clauses (minimum 75%), executive council circulars, code of conduct, disciplinary statues, and university ordinances with clause citation.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#123C3A]/10 dark:border-[#55C7B2]/15 flex items-center justify-between text-xs font-semibold text-[#123C3A] dark:text-[#55C7B2] font-heading">
              <span>{currentLang === 'as' ? 'অধিসূচনা চাওক' : 'Explore Statutes & Clauses'}</span>
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Dominant Domain Card 2: Examinations & Grading (Col 6) */}
          <div 
            onClick={() => onNavigateTab('examinations')}
            className="lg:col-span-6 group editorial-surface rounded-2xl p-7 flex flex-col justify-between space-y-6 cursor-pointer hover:border-[#123C3A]/25 dark:hover:border-[#55C7B2]/40 transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-[#123C3A]/8 dark:bg-[#55C7B2]/10 border border-[#123C3A]/12 dark:border-[#55C7B2]/20 flex items-center justify-center text-[#123C3A] dark:text-[#55C7B2]">
                  <ClipboardDocumentCheckIcon className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#E9F0ED] dark:bg-[#142426] text-[#123C3A] dark:text-[#55C7B2] border border-[#123C3A]/10 dark:border-[#55C7B2]/20 font-sans">
                  {examinations.length} Active Guidelines
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#123C3A] dark:text-[#DCE8E4] font-heading group-hover:text-[#D4A96A] dark:group-hover:text-[#55C7B2] transition-colors">
                  {currentLang === 'as' ? 'পৰীক্ষা আৰু মূল্যায়ন ব্যৱস্থা' : 'Examinations & Grading Ordinances'}
                </h3>
                <p className="text-xs sm:text-sm text-[#627680] dark:text-[#879B99] mt-2 leading-relaxed font-sans">
                  End-semester 40% passing criteria, in-semester sessionals, re-evaluation timelines (within 20 days), grace marks, and back-paper policy.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#123C3A]/10 dark:border-[#55C7B2]/15 flex items-center justify-between text-xs font-semibold text-[#123C3A] dark:text-[#55C7B2] font-heading">
              <span>{currentLang === 'as' ? 'পৰীক্ষাৰ নিয়ম চাওক' : 'Inspect Evaluation Norms'}</span>
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Open Horizontal Ledger Strip (Col 12 - 3 Supplementary Domains in Generous Row) */}
          <div className="lg:col-span-12 editorial-surface rounded-2xl p-6 sm:p-7">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-[#123C3A]/10 dark:divide-[#55C7B2]/15">
              
              {/* Domain 3: Programmes & Admissions */}
              <div 
                onClick={() => onNavigateTab('admissions')}
                className="group pt-4 md:pt-0 md:px-5 first:pl-0 cursor-pointer space-y-3"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-[#E9F0ED] dark:bg-[#142426] flex items-center justify-center text-[#123C3A] dark:text-[#55C7B2]">
                    <IdentificationIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#123C3A] dark:text-[#DCE8E4] font-heading group-hover:text-[#D4A96A] dark:group-hover:text-[#55C7B2] transition-colors">
                      {currentLang === 'as' ? 'পাঠ্যক্ৰম আৰু নামভৰ্তি' : 'Programmes & Admissions'}
                    </h4>
                    <span className="text-[11px] text-[#627680] dark:text-[#879B99]">
                      {programmes.length} Degree Programmes
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#627680] dark:text-[#879B99] leading-relaxed">
                  Eligibility thresholds, entrance examinations, reservation quotas, and semester fee structures.
                </p>
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#123C3A] dark:text-[#55C7B2] group-hover:underline">
                  <span>Explore Admissions</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Domain 4: Scholarships & Grants */}
              <div 
                onClick={() => onNavigateTab('scholarships')}
                className="group pt-4 md:pt-0 md:px-5 cursor-pointer space-y-3"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-[#E9F0ED] dark:bg-[#142426] flex items-center justify-center text-[#123C3A] dark:text-[#55C7B2]">
                    <BanknotesIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#123C3A] dark:text-[#DCE8E4] font-heading group-hover:text-[#D4A96A] dark:group-hover:text-[#55C7B2] transition-colors">
                      {currentLang === 'as' ? 'ছাত্ৰবৃত্তি আৰু আৰ্থিক অনুদান' : 'Scholarships & Grants'}
                    </h4>
                    <span className="text-[11px] text-[#627680] dark:text-[#879B99]">
                      {scholarships.length} State Schemes
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#627680] dark:text-[#879B99] leading-relaxed">
                  Assam DHE combined merit scholarship, Ishan Uday, minority stipends, and post-matric fee waivers.
                </p>
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#123C3A] dark:text-[#55C7B2] group-hover:underline">
                  <span>Review Grant Schemes</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Domain 5: Campus Facilities & Hostels */}
              <div 
                onClick={() => onNavigateTab('facilities')}
                className="group pt-4 md:pt-0 md:px-5 last:pr-0 cursor-pointer space-y-3"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-[#E9F0ED] dark:bg-[#142426] flex items-center justify-center text-[#123C3A] dark:text-[#55C7B2]">
                    <BuildingOfficeIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#123C3A] dark:text-[#DCE8E4] font-heading group-hover:text-[#D4A96A] dark:group-hover:text-[#55C7B2] transition-colors">
                      {currentLang === 'as' ? 'চৌহদৰ সুবিধা আৰু হোষ্টেল' : 'Campus Facilities & Hostels'}
                    </h4>
                    <span className="text-[11px] text-[#627680] dark:text-[#879B99]">
                      {facilities.length} Verified Facilities
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#627680] dark:text-[#879B99] leading-relaxed">
                  Hostel seat reservation criteria, central library timings, research labs, and student health center.
                </p>
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#123C3A] dark:text-[#55C7B2] group-hover:underline">
                  <span>Inspect Facilities</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 4. GROUNDED CITATION & EVIDENCE LEDGER */}
      <section className="editorial-surface rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#123C3A]/10 dark:border-[#55C7B2]/15 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#123C3A]/10 dark:bg-[#55C7B2]/15 flex items-center justify-center text-[#123C3A] dark:text-[#55C7B2]">
              <ShieldCheckIcon className="w-5 h-5 text-[#123C3A] dark:text-[#55C7B2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#123C3A] dark:text-[#DCE8E4] font-heading">
                {currentLang === 'as' ? 'প্ৰমাণিত পৃষ্ঠা উদ্ধৃতি আৰু গেজেট সংলগ্নতা' : 'Verifiable Gazette Citations & Audit Proof'}
              </h3>
              <p className="text-xs text-[#627680] dark:text-[#879B99]">
                Every AI response is grounded directly in official university circulars. Zero hallucinations.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('history')}
            className="text-xs font-semibold text-[#D4A96A] dark:text-[#55C7B2] hover:underline cursor-pointer self-start sm:self-auto font-heading"
          >
            {currentLang === 'as' ? 'পূৰ্বৰ বাৰ্তালাপ চাওক ➔' : 'View Full Query Audit Log ➔'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentAnswers.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white/70 dark:bg-[#142426]/70 border border-[#123C3A]/10 dark:border-[#55C7B2]/15 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#E9F0ED] dark:bg-[#16181A] text-[#123C3A] dark:text-[#55C7B2]">
                  {item.domain}
                </span>
                <span className="text-[11px] text-[#627680] dark:text-[#879B99]">
                  {item.date}
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-[#273B45] dark:text-[#DCE8E4]">
                "{currentLang === 'as' ? item.asQ : item.q}"
              </p>

              <div className="pt-2 border-t border-[#123C3A]/8 dark:border-[#55C7B2]/10 flex items-center justify-between text-[11px] text-[#627680] dark:text-[#879B99]">
                <div className="flex items-center space-x-1.5 truncate mr-2">
                  <DocumentTextIcon className="w-3.5 h-3.5 text-[#D4A96A] dark:text-[#55C7B2] shrink-0" />
                  <span className="font-mono truncate">{item.source}</span>
                </div>
                <strong className="text-[#123C3A] dark:text-[#55C7B2] shrink-0 font-sans font-semibold">
                  {item.page}
                </strong>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
