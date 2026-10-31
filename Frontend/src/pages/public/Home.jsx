import { useState } from 'react';
import { UniversityHero3D } from '../../components/common/Graphic3D';
import { CollegeBoyUniversityBackground } from '../../components/common/CollegeBoyUniversityBackground';
import { 
  SearchIcon, 
  BuildingLibraryIcon, 
  BrainIcon, 
  ShieldCheckIcon, 
  ArrowRightIcon, 
  CheckCircleIcon, 
  DocumentTextIcon, 
  ClipboardDocumentCheckIcon, 
  BanknotesIcon, 
  BuildingOfficeIcon,
  IdentificationIcon,
  UserGroupIcon
} from '../../components/common/Icons';

export const Home = ({ onNavigate, onOpenAuth, currentLang = 'en', isLoggedIn = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDemoTab, setActiveDemoTab] = useState('as');
  const [demoInput, setDemoInput] = useState('গুৱাহাটী বিশ্ববিদ্যালয়ৰ স্নাতকোত্তৰ হোষ্টেল আবণ্টন আৰু ছাত্ৰবৃত্তিৰ চৰ্ত কি?');
  const [demoResponse, setDemoResponse] = useState({
    answer: 'গুৱাহাটী বিশ্ববিদ্যালয়ৰ অফিচিয়েল নিয়মাৱলী আৰু অধিসূচনা অনুসৰি স্নাতকোত্তৰ হোষ্টেল আবণ্টন মেধা তালিকা (Merit List) আৰু দূৰত্বৰ ভিত্তিত কৰা হয়। ছাত্ৰবৃত্তিৰ বাবে ন্যূনতম ৫৫% নম্বৰ আৰু বাৰ্ষিক পাৰিবাৰিক আয় ২.৫ লাখতকৈ কম হ’ব লাগে। সকলো তথ্য মূল নথিত সংলগ্ন আছে।',
    source: 'GU_Hostel_Scholarship_Regulations_2024.pdf',
    page: 'পৃষ্ঠা নং ১২, ধাৰা ৪.২',
    confidence: 'প্ৰমাণিত অফিচিয়েল মিল (Grounded Citation)',
  });

  const handleDemoSwitch = (lang) => {
    setActiveDemoTab(lang);
    if (lang === 'as') {
      setDemoInput('গুৱাহাটী বিশ্ববিদ্যালয়ৰ স্নাতকোত্তৰ হোষ্টেল আবণ্টন আৰু ছাত্ৰবৃত্তিৰ চৰ্ত কি?');
      setDemoResponse({
        answer: 'গুৱাহাটী বিশ্ববিদ্যালয়ৰ অফিচিয়েল নিয়মাৱলী আৰু অধিসূচনা অনুসৰি স্নাতকোত্তৰ হোষ্টেল আবণ্টন মেধা তালিকা (Merit List) আৰু দূৰত্বৰ ভিত্তিত কৰা হয়। ছাত্ৰবৃত্তিৰ বাবে ন্যূনতম ৫৫% নম্বৰ আৰু বাৰ্ষিক পাৰিবাৰিক আয় ২.৫ লাখতকৈ কম হ’ব লাগে। সকলো তথ্য মূল নথিত সংলগ্ন আছে।',
        source: 'GU_Hostel_Scholarship_Regulations_2024.pdf',
        page: 'পৃষ্ঠা নং ১২, ধাৰা ৪.২',
        confidence: 'প্ৰমাণিত অফিচিয়েল মিল (Grounded Citation)',
      });
    } else {
      setDemoInput('What is the minimum attendance requirement and re-evaluation procedure for Dibrugarh University examinations?');
      setDemoResponse({
        answer: 'According to official Dibrugarh University Examination Ordinances, students must maintain a minimum of 75% class attendance to be eligible for end-semester examinations. Re-evaluation applications must be submitted within 20 days of mark sheet publication through the official portal with the prescribed fee.',
        source: 'DU_Examination_Regulations_Gazette.pdf',
        page: 'Page 22, Ordinance 9.3',
        confidence: 'Institutional Ordinance Match',
      });
    }
  };

  const handlePortalAccess = () => {
    if (isLoggedIn) {
      if (onNavigate) onNavigate('dashboard');
    } else {
      if (onOpenAuth) onOpenAuth('login');
    }
  };

  const universitiesList = [
    { name: 'Gauhati University', code: 'GU', city: 'Guwahati', domains: 'Regulations, Exams & Scholarships' },
    { name: 'Dibrugarh University', code: 'DU', city: 'Dibrugarh', domains: 'Admissions, Ordinances & Hostels' },
    { name: 'Tezpur University', code: 'TU', city: 'Napaam, Tezpur', domains: 'Academic Programs & Research Grants' },
    { name: 'Cotton University', code: 'CU', city: 'Panbazar, Guwahati', domains: 'Degree Ordinances & Campus Facilities' },
    { name: 'Assam University', code: 'AUS', city: 'Silchar', domains: 'Post-Matric Schemes & Exam Criteria' },
    { name: 'Bodoland University', code: 'BU', city: 'Kokrajhar', domains: 'Admission Procedures & Notifications' },
  ];

  return (
    <div className="bg-[#FAF8FF] dark:bg-[#0A0718] min-h-screen text-[#0F172A] dark:text-[#FAF8FF] transition-colors duration-200">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-[#E0D4FD] dark:border-[#3B2868] bg-grid-pattern">
        {/* Animated College Boy in Background Looking to their University */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none opacity-85 dark:opacity-45 z-0">
          <CollegeBoyUniversityBackground className="w-full h-full" showOverlay={true} />
        </div>
        {/* Soft Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#6D28D9]/20 via-[#E0D4FD]/25 to-[#DDD6FE]/40 dark:from-[#3B2868]/20 dark:via-[#150F2C] dark:to-[#C4B5FD]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content (Cols 7) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-[#0F172A] dark:text-[#FAF8FF]">
                {currentLang === 'as' ? (
                  <>
                    অসমৰ বিশ্ববিদ্যালয়সমূহৰ শৈক্ষিক আৰু প্ৰশাসনিক তথ্য এতিয়া <span className="text-[#6D28D9] underline decoration-[#DDD6FE] decoration-4">দ্বিভাষিক AI</span> সহায়কত
                  </>
                ) : (
                  <>
                    Your University. Your Language. <span className="text-[#6D28D9] dark:text-[#C4B5FD]">Your AI Assistant.</span>
                  </>
                )}
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-[#555375] dark:text-[#C4B5FD] max-w-2xl leading-relaxed">
                {currentLang === 'as'
                  ? 'ছাত্ৰ-ছাত্ৰী, অধ্যাপক আৰু প্ৰশাসনিক কৰ্মচাৰীসকলৰ বাবে বিশ্ববিদ্যালয়ৰ নিয়মাৱলী, পৰীক্ষাৰ মূল্যায়ন, ভৰ্তি প্ৰক্ৰিয়া, ছাত্ৰবৃত্তি আৰু চৌহদৰ সুবিধাসমূহৰ সঠিক পৃষ্ঠা নম্বৰসহ বিশ্বাসযোগ্য উত্তৰ লাভ কৰক।'
                  : 'Empowering students, faculty members, and administrative staff to access verified university regulations, examinations, academic programs, scholarships, admission procedures, and campus facilities in Assamese and English.'}
              </p>

              {/* Quick Institutional Inquiry Box */}
              <div className="bg-white dark:bg-[#150F2C] p-3 rounded-3xl border-2 border-[#E0D4FD] dark:border-[#3B2868] shadow-elevated-sage dark:shadow-elevated-gold max-w-xl mx-auto lg:mx-0">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 flex items-center px-4 bg-[#FAF8FF] dark:bg-[#0A0718] rounded-2xl border border-[#E0D4FD] dark:border-[#3B2868]">
                    <SearchIcon className="w-5 h-5 text-[#6D28D9] mr-2 shrink-0" />
                    <input 
                      type="text" 
                      placeholder={currentLang === 'as' ? 'নিয়ম, পৰীক্ষা, ভৰ্তি বা ছাত্ৰবৃত্তিৰ প্ৰশ্ন লিখক...' : 'Ask regulations, exams, admissions, scholarships...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full py-3 bg-transparent text-xs sm:text-sm text-[#0F172A] dark:text-[#FAF8FF] placeholder-[#555375]/70 dark:placeholder-[#C4B5FD]/60 focus:outline-none font-semibold"
                    />
                  </div>
                  <button 
                    onClick={handlePortalAccess}
                    className="flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl bg-[#4C1D95] hover:bg-[#8F00FF] text-white text-xs sm:text-sm font-black transition-all cursor-pointer shadow-md shrink-0"
                  >
                    <span>{currentLang === 'as' ? 'সহায়কক সোধক' : 'Ask Assistant'}</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Popular Institutional Query Topics */}
                <div className="flex flex-wrap items-center gap-2 mt-3 pt-2.5 border-t border-[#E0D4FD]/60 dark:border-[#3B2868] text-xs text-[#555375] dark:text-[#C4B5FD]">
                  <span className="font-bold">Topics:</span>
                  <span onClick={handlePortalAccess} className="bg-[#E0D4FD]/25 dark:bg-[#0A0718] px-2.5 py-1 rounded-xl text-[#0F172A] dark:text-[#FAF8FF] hover:bg-[#6D28D9] hover:text-white cursor-pointer transition-all">GU Exam Re-evaluation</span>
                  <span onClick={handlePortalAccess} className="bg-[#E0D4FD]/25 dark:bg-[#0A0718] px-2.5 py-1 rounded-xl text-[#0F172A] dark:text-[#FAF8FF] hover:bg-[#6D28D9] hover:text-white cursor-pointer transition-all">DU PG Scholarship Norms</span>
                  <span onClick={handlePortalAccess} className="bg-[#E0D4FD]/25 dark:bg-[#0A0718] px-2.5 py-1 rounded-xl text-[#0F172A] dark:text-[#FAF8FF] hover:bg-[#6D28D9] hover:text-white cursor-pointer transition-all">Hostel Admission Rules</span>
                </div>
              </div>

              {/* Key Trust Signals */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-5 pt-2 text-xs sm:text-sm font-black text-[#0F172A] dark:text-[#C4B5FD]">
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-[#10B981] dark:text-[#FAF8FF]" />
                  <span>Official University Gazettes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-[#10B981] dark:text-[#FAF8FF]" />
                  <span>Exact PDF Page Numbers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-[#10B981] dark:text-[#FAF8FF]" />
                  <span>Assamese + English Natural Language</span>
                </div>
              </div>

            </div>

            {/* Right 3D Visual Hub (Cols 5) */}
            <div className="lg:col-span-5 flex justify-center">
              <UniversityHero3D />
            </div>

          </div>
        </div>
      </section>

      {/* LIVE INTERACTIVE GROUNDED ASSISTANCE PREVIEW */}
      <section className="py-20 bg-white/70 dark:bg-[#150F2C]/70 backdrop-blur-xs border-b border-[#E0D4FD] dark:border-[#3B2868] transition-colors duration-200">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-black text-[#0F172A] dark:text-[#FAF8FF]">
              {currentLang === 'as' 
                ? 'UniMitra-ই বিশ্ববিদ্যালয়ৰ প্ৰশ্নৰ উত্তৰ কেনেদৰে দিয়ে চাওক' 
                : 'See How UniMitra Answers Institutional Queries'}
            </h2>
            <p className="text-sm sm:text-base text-[#555375] dark:text-[#C4B5FD] mt-3">
              Answers are grounded strictly in verified institutional ordinances, circulars, and notifications — avoiding generic web hallucinations.
            </p>
          </div>

          {/* Interactive Demo Card */}
          <div className="w-full max-w-5xl mx-auto bg-[#FAF8FF] dark:bg-[#0A0718] border-2 border-[#E0D4FD] dark:border-[#3B2868] rounded-3xl shadow-elevated-sage dark:shadow-elevated-gold overflow-hidden">
            
            {/* Card Header */}
            <div className="bg-[#6D28D9] dark:bg-[#1C1438] px-5 sm:px-7 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-white">
              <div className="flex items-center space-x-2">
                <div className="w-3.5 h-3.5 rounded-full bg-[#FAF8FF]"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-[#E0D4FD]"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-[#DDD6FE]"></div>
                <span className="text-xs sm:text-sm font-black ml-2 text-[#FAF8FF] dark:text-[#FAF8FF]">
                  UniMitra Live Institutional Assistant
                </span>
              </div>
              
              {/* Language Switch Pills */}
              <div className="flex items-center space-x-1 bg-black/20 p-1 rounded-xl">
                <button
                  onClick={() => handleDemoSwitch('as')}
                  className={`px-3 py-1.5 text-xs font-black rounded-lg cursor-pointer transition-all ${
                    activeDemoTab === 'as' ? 'bg-[#FAF8FF] text-[#0F172A] shadow-xs' : 'text-[#FAF8FF] hover:text-white'
                  }`}
                >
                  অসমীয়া
                </button>
                <button
                  onClick={() => handleDemoSwitch('en')}
                  className={`px-3 py-1.5 text-xs font-black rounded-lg cursor-pointer transition-all ${
                    activeDemoTab === 'en' ? 'bg-[#FAF8FF] text-[#0F172A] shadow-xs' : 'text-[#FAF8FF] hover:text-white'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Institutional Query Box */}
              <div className="bg-white dark:bg-[#150F2C] border border-[#E0D4FD] dark:border-[#3B2868] rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-[#555375] dark:text-[#C4B5FD] mb-2">
                  <span className="text-[#6D28D9] dark:text-[#FAF8FF] font-black flex items-center space-x-1.5">
                    <span>Inquiry Query (প্ৰশ্ন)</span>
                  </span>
                  <span className="text-[#0F172A] dark:text-[#FAF8FF] bg-[#DDD6FE] dark:bg-[#3B2868] px-2 py-0.5 rounded text-[10px] font-black">
                    Institutional Regulation Check
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-[#FAF8FF] bg-[#FAF8FF] dark:bg-[#0A0718] p-3.5 rounded-xl border border-[#E0D4FD] dark:border-[#3B2868]">
                  {demoInput}
                </div>
              </div>

              {/* RAG Workflow Strip */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#E0D4FD]/20 dark:bg-[#150F2C] rounded-2xl border border-[#E0D4FD] dark:border-[#3B2868] text-xs font-bold text-[#0F172A] dark:text-[#C4B5FD]">
                <span className="text-[#6D28D9] dark:text-[#FAF8FF]">1. Natural Language Parse</span>
                <span className="text-[#6D28D9]">➔</span>
                <span className="text-[#6D28D9] dark:text-[#FAF8FF]">2. Multilingual E5 Vector Retrieval</span>
                <span className="text-[#6D28D9]">➔</span>
                <span className="text-[#6D28D9] dark:text-[#FAF8FF]">3. Grounded Citation Extraction</span>
              </div>

              {/* Grounded Institutional Answer */}
              <div className="bg-white dark:bg-[#150F2C] border-2 border-[#6D28D9] dark:border-[#C4B5FD]/70 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E0D4FD]/60 dark:border-[#3B2868]">
                  <div className="flex items-center space-x-2 text-[#6D28D9] dark:text-[#FAF8FF] font-black text-sm">
                    <CheckCircleIcon className="w-5 h-5 text-[#10B981] dark:text-[#FAF8FF]" />
                    <span>Verified Institutional Answer</span>
                  </div>
                  <span className="text-xs bg-[#E0D4FD]/30 dark:bg-[#0A0718] text-[#0F172A] dark:text-[#FAF8FF] px-3 py-1 rounded-xl font-bold border border-[#6D28D9]/30">
                    {demoResponse.confidence}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#0F172A] dark:text-slate-100 leading-relaxed font-semibold">
                  {demoResponse.answer}
                </p>

                {/* Grounding Source Badge */}
                <div className="mt-5 pt-4 border-t border-[#E0D4FD]/60 dark:border-[#3B2868] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-2 text-[#555375] dark:text-[#C4B5FD]">
                    <DocumentTextIcon className="w-4 h-4 text-[#6D28D9]" />
                    <span className="font-bold">{demoResponse.source}</span>
                    <span className="text-[#6D28D9]">•</span>
                    <span className="text-[#6D28D9] dark:text-[#FAF8FF] font-black">{demoResponse.page}</span>
                  </div>
                  <button 
                    onClick={handlePortalAccess}
                    className="text-xs font-black text-[#6D28D9] dark:text-[#FAF8FF] hover:underline cursor-pointer"
                  >
                    Open Document in Portal ↗
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 6 INSTITUTIONAL DOMAINS */}
      <section className="py-20 bg-transparent border-b border-[#E0D4FD] dark:border-[#3B2868] transition-colors duration-200">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-black text-[#0F172A] dark:text-[#FAF8FF]">
              {currentLang === 'as' 
                ? 'UniMitra-ৰ সেৱা আৰু শৈক্ষিক তথ্যৰ পৰিসৰ' 
                : 'Comprehensive University Assistance Scope'}
            </h2>
            <p className="text-sm sm:text-base text-[#555375] dark:text-[#C4B5FD] mt-3">
              Built to serve students, faculty members, and administrative staff across all major Assam universities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Domain 1: Regulations */}
            <div className="bg-white dark:bg-[#150F2C] border-2 border-[#E0D4FD] dark:border-[#3B2868] rounded-3xl p-6 shadow-sm hover:border-[#6D28D9] transition-all card-3d">
              <div className="w-12 h-12 rounded-2xl bg-[#E0D4FD]/30 dark:bg-[#0A0718] border border-[#6D28D9]/40 flex items-center justify-center mb-5">
                <BuildingLibraryIcon className="w-6 h-6 text-[#6D28D9] dark:text-[#FAF8FF]" />
              </div>
              <h3 className="text-lg font-black text-[#0F172A] dark:text-[#FAF8FF] mb-2">
                University Regulations & Ordinances
              </h3>
              <p className="text-xs sm:text-sm text-[#555375] dark:text-[#C4B5FD] leading-relaxed">
                Institutional statutes, code of conduct, academic council policies, attendance thresholds, and grievance redressal mechanisms.
              </p>
            </div>

            {/* Domain 2: Examinations */}
            <div className="bg-white dark:bg-[#150F2C] border-2 border-[#E0D4FD] dark:border-[#3B2868] rounded-3xl p-6 shadow-sm hover:border-[#6D28D9] transition-all card-3d">
              <div className="w-12 h-12 rounded-2xl bg-[#DDD6FE] dark:bg-[#0A0718] border border-[#E0D4FD] dark:border-[#3B2868] flex items-center justify-center mb-5">
                <ClipboardDocumentCheckIcon className="w-6 h-6 text-[#6D28D9] dark:text-[#FAF8FF]" />
              </div>
              <h3 className="text-lg font-black text-[#0F172A] dark:text-[#FAF8FF] mb-2">
                Examinations & Evaluation Rules
              </h3>
              <p className="text-xs sm:text-sm text-[#555375] dark:text-[#C4B5FD] leading-relaxed">
                Passing criteria, grading system (CBCS / NEP 2020), back paper rules, re-evaluation guidelines, and exam schedules.
              </p>
            </div>

            {/* Domain 3: Academic Programs */}
            <div className="bg-white dark:bg-[#150F2C] border-2 border-[#E0D4FD] dark:border-[#3B2868] rounded-3xl p-6 shadow-sm hover:border-[#6D28D9] transition-all card-3d">
              <div className="w-12 h-12 rounded-2xl bg-[#E0D4FD]/30 dark:bg-[#0A0718] border border-[#6D28D9]/40 flex items-center justify-center mb-5">
                <IdentificationIcon className="w-6 h-6 text-[#6D28D9] dark:text-[#FAF8FF]" />
              </div>
              <h3 className="text-lg font-black text-[#0F172A] dark:text-[#FAF8FF] mb-2">
                Academic Programs & Degrees
              </h3>
              <p className="text-xs sm:text-sm text-[#555375] dark:text-[#C4B5FD] leading-relaxed">
                Undergraduate, Postgraduate, Diploma, and Ph.D. degree structures, department profiles, duration, and credit frameworks.
              </p>
            </div>

            {/* Domain 4: Scholarships */}
            <div className="bg-white dark:bg-[#150F2C] border-2 border-[#E0D4FD] dark:border-[#3B2868] rounded-3xl p-6 shadow-sm hover:border-[#6D28D9] transition-all card-3d">
              <div className="w-12 h-12 rounded-2xl bg-[#DDD6FE] dark:bg-[#0A0718] border border-[#E0D4FD] dark:border-[#3B2868] flex items-center justify-center mb-5">
                <BanknotesIcon className="w-6 h-6 text-[#6D28D9] dark:text-[#FAF8FF]" />
              </div>
              <h3 className="text-lg font-black text-[#0F172A] dark:text-[#FAF8FF] mb-2">
                Scholarships & Financial Grants
              </h3>
              <p className="text-xs sm:text-sm text-[#555375] dark:text-[#C4B5FD] leading-relaxed">
                State merit schemes, Ishan Uday scholarships, post-matric funds, eligibility criteria, required documentation, and deadlines.
              </p>
            </div>

            {/* Domain 5: Admissions */}
            <div className="bg-white dark:bg-[#150F2C] border-2 border-[#E0D4FD] dark:border-[#3B2868] rounded-3xl p-6 shadow-sm hover:border-[#6D28D9] transition-all card-3d">
              <div className="w-12 h-12 rounded-2xl bg-[#E0D4FD]/30 dark:bg-[#0A0718] border border-[#6D28D9]/40 flex items-center justify-center mb-5">
                <DocumentTextIcon className="w-6 h-6 text-[#6D28D9] dark:text-[#FAF8FF]" />
              </div>
              <h3 className="text-lg font-black text-[#0F172A] dark:text-[#FAF8FF] mb-2">
                Admission Procedures & Cut-Offs
              </h3>
              <p className="text-xs sm:text-sm text-[#555375] dark:text-[#C4B5FD] leading-relaxed">
                Step-by-step application steps, entrance test guidelines, reservation policies, document verification, and seat matrices.
              </p>
            </div>

            {/* Domain 6: Campus Facilities */}
            <div className="bg-white dark:bg-[#150F2C] border-2 border-[#E0D4FD] dark:border-[#3B2868] rounded-3xl p-6 shadow-sm hover:border-[#6D28D9] transition-all card-3d">
              <div className="w-12 h-12 rounded-2xl bg-[#DDD6FE] dark:bg-[#0A0718] border border-[#E0D4FD] dark:border-[#3B2868] flex items-center justify-center mb-5">
                <BuildingOfficeIcon className="w-6 h-6 text-[#6D28D9] dark:text-[#FAF8FF]" />
              </div>
              <h3 className="text-lg font-black text-[#0F172A] dark:text-[#FAF8FF] mb-2">
                Campus Facilities & Services
              </h3>
              <p className="text-xs sm:text-sm text-[#555375] dark:text-[#C4B5FD] leading-relaxed">
                Hostel allotment guidelines, central library timing, health centers, student welfare cells, laboratory guidelines, and sports facilities.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* SUPPORTED UNIVERSITIES DIRECTORY */}
      <section className="py-20 bg-white/70 dark:bg-[#150F2C]/70 backdrop-blur-xs border-b border-[#E0D4FD] dark:border-[#3B2868] transition-colors duration-200">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-8 mb-8 border-b border-[#E0D4FD]/60 dark:border-[#3B2868] gap-4">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-[#FAF8FF]">
                {currentLang === 'as' ? 'অসমৰ অগ্ৰণী বিশ্ববিদ্যালয়সমূহ' : 'Universities in Assam Knowledge Base'}
              </h3>
              <p className="text-xs sm:text-sm text-[#555375] dark:text-[#C4B5FD] mt-1">
                Centralized access to official regulations, admissions, notices, and ordinances across institutions.
              </p>
            </div>
            <button 
              onClick={handlePortalAccess}
              className="px-5 py-2.5 text-xs sm:text-sm font-black text-white bg-[#4C1D95] hover:bg-[#8F00FF] rounded-2xl border border-[#6D28D9] transition-all cursor-pointer self-start sm:self-auto shadow-xs"
            >
              Enter University Portal ➔
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {universitiesList.map((univ) => (
              <div 
                key={univ.code}
                className="bg-[#FAF8FF] dark:bg-[#0A0718] border-2 border-[#E0D4FD] dark:border-[#3B2868] rounded-3xl p-6 hover:border-[#6D28D9] transition-all cursor-pointer"
                onClick={handlePortalAccess}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-white dark:bg-[#150F2C] border border-[#E0D4FD] dark:border-[#3B2868] text-[#0F172A] dark:text-[#FAF8FF]">
                    {univ.code}
                  </span>
                  <span className="text-[10px] font-black text-[#0F172A] dark:text-[#FAF8FF] bg-[#DDD6FE] dark:bg-[#3B2868] px-2.5 py-1 rounded-lg">
                    Institutional Index
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-black text-[#0F172A] dark:text-[#FAF8FF] mb-1">{univ.name}</h4>
                <p className="text-xs text-[#555375] dark:text-[#C4B5FD] mb-4">{univ.city}</p>
                <div className="flex items-center justify-between pt-3 border-t border-[#E0D4FD]/60 dark:border-[#3B2868] text-xs text-[#555375] dark:text-[#C4B5FD]">
                  <span className="font-semibold">{univ.domains}</span>
                  <span className="font-black text-[#6D28D9] dark:text-[#FAF8FF] flex items-center space-x-1">
                    <span>Ask AI</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-br from-[#4C1D95] via-[#3B0764] to-[#0A0718] text-[#FAF8FF]">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <CollegeBoyUniversityBackground className="w-full h-full" showOverlay={false} />
        </div>
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#FAF8FF]">
            {currentLang === 'as' 
              ? 'বিশ্ববিদ্যালয়ৰ শৈক্ষিক আৰু প্ৰশাসনিক তথ্য এতিয়া আঙুলিৰ মূৰত' 
              : 'Your University. Your Language. Your AI Assistant.'}
          </h2>

          <p className="text-sm sm:text-lg text-[#C4B5FD] max-w-2xl mx-auto leading-relaxed">
            Join students, faculty members, and administrative staff across Assam accessing natural language answers to official university regulations, exams, admissions, and facilities.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <button 
              onClick={() => onOpenAuth && onOpenAuth('login')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-white bg-[#4C1D95] hover:bg-[#8F00FF] transition-all cursor-pointer shadow-elevated-sage text-sm"
            >
              Sign In to Access Portal
            </button>
            <button 
              onClick={() => onNavigate && onNavigate('features')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-[#FAF8FF] bg-transparent border-2 border-[#3B2868] hover:border-[#FAF8FF] transition-all cursor-pointer text-sm"
            >
              Explore Assistance Services
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
