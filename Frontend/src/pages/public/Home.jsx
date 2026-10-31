import { useState } from 'react';
import { UniversityHero3D } from '../../components/common/Graphic3D';
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
    <div className="bg-[#FEFAF3] dark:bg-[#15370D] min-h-screen text-[#15370D] dark:text-[#FFF2B4] transition-colors duration-200">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-[#B8CFB3] dark:border-[#728E6D] bg-grid-pattern">
        {/* Soft Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#84A282]/20 via-[#B8CFB3]/25 to-[#F6E2E9]/40 dark:from-[#728E6D]/20 dark:via-[#1C4412] dark:to-[#E5CD82]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content (Cols 7) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Badge Tag */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#F6E2E9] dark:bg-[#1C4412] border border-[#B8CFB3] dark:border-[#728E6D] text-xs font-black text-[#15370D] dark:text-[#FFF2B4]">
                <span className="w-2 h-2 rounded-full bg-[#84A282] animate-pulse"></span>
                <span>CampusIQ • Smart University Assistant</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-[#15370D] dark:text-[#FFF2B4]">
                {currentLang === 'as' ? (
                  <>
                    অসমৰ বিশ্ববিদ্যালয়সমূহৰ শৈক্ষিক আৰু প্ৰশাসনিক তথ্য এতিয়া <span className="text-[#84A282] underline decoration-[#F6E2E9] decoration-4">দ্বিভাষিক AI</span> সহায়কত
                  </>
                ) : (
                  <>
                    Your University. Your Language. <span className="text-[#84A282] dark:text-[#E5CD82]">Your AI Assistant.</span>
                  </>
                )}
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-[#4F6D4B] dark:text-[#E5CD82] max-w-2xl leading-relaxed">
                {currentLang === 'as'
                  ? 'ছাত্ৰ-ছাত্ৰী, অধ্যাপক আৰু প্ৰশাসনিক কৰ্মচাৰীসকলৰ বাবে বিশ্ববিদ্যালয়ৰ নিয়মাৱলী, পৰীক্ষাৰ মূল্যায়ন, ভৰ্তি প্ৰক্ৰিয়া, ছাত্ৰবৃত্তি আৰু চৌহদৰ সুবিধাসমূহৰ সঠিক পৃষ্ঠা নম্বৰসহ বিশ্বাসযোগ্য উত্তৰ লাভ কৰক।'
                  : 'Empowering students, faculty members, and administrative staff to access verified university regulations, examinations, academic programs, scholarships, admission procedures, and campus facilities in Assamese and English.'}
              </p>

              {/* Quick Institutional Inquiry Box */}
              <div className="bg-white dark:bg-[#1C4412] p-3 rounded-3xl border-2 border-[#B8CFB3] dark:border-[#728E6D] shadow-elevated-sage dark:shadow-elevated-gold max-w-xl mx-auto lg:mx-0">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 flex items-center px-4 bg-[#FEFAF3] dark:bg-[#15370D] rounded-2xl border border-[#B8CFB3] dark:border-[#728E6D]">
                    <SearchIcon className="w-5 h-5 text-[#84A282] mr-2 shrink-0" />
                    <input 
                      type="text" 
                      placeholder={currentLang === 'as' ? 'নিয়ম, পৰীক্ষা, ভৰ্তি বা ছাত্ৰবৃত্তিৰ প্ৰশ্ন লিখক...' : 'Ask regulations, exams, admissions, scholarships...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full py-3 bg-transparent text-xs sm:text-sm text-[#15370D] dark:text-[#FFF2B4] placeholder-[#4F6D4B]/70 dark:placeholder-[#E5CD82]/60 focus:outline-none font-semibold"
                    />
                  </div>
                  <button 
                    onClick={handlePortalAccess}
                    className="flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl bg-[#84A282] hover:bg-[#6F8E6D] text-white text-xs sm:text-sm font-black transition-all cursor-pointer shadow-md shrink-0"
                  >
                    <span>{currentLang === 'as' ? 'সহায়কক সোধক' : 'Ask Assistant'}</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Popular Institutional Query Topics */}
                <div className="flex flex-wrap items-center gap-2 mt-3 pt-2.5 border-t border-[#B8CFB3]/60 dark:border-[#728E6D] text-xs text-[#4F6D4B] dark:text-[#E5CD82]">
                  <span className="font-bold">Topics:</span>
                  <span onClick={handlePortalAccess} className="bg-[#B8CFB3]/25 dark:bg-[#15370D] px-2.5 py-1 rounded-xl text-[#15370D] dark:text-[#FFF2B4] hover:bg-[#84A282] hover:text-white cursor-pointer transition-all">GU Exam Re-evaluation</span>
                  <span onClick={handlePortalAccess} className="bg-[#B8CFB3]/25 dark:bg-[#15370D] px-2.5 py-1 rounded-xl text-[#15370D] dark:text-[#FFF2B4] hover:bg-[#84A282] hover:text-white cursor-pointer transition-all">DU PG Scholarship Norms</span>
                  <span onClick={handlePortalAccess} className="bg-[#B8CFB3]/25 dark:bg-[#15370D] px-2.5 py-1 rounded-xl text-[#15370D] dark:text-[#FFF2B4] hover:bg-[#84A282] hover:text-white cursor-pointer transition-all">Hostel Admission Rules</span>
                </div>
              </div>

              {/* Key Trust Signals */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-5 pt-2 text-xs sm:text-sm font-black text-[#15370D] dark:text-[#E5CD82]">
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-[#84A282] dark:text-[#FFF2B4]" />
                  <span>Official University Gazettes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-[#84A282] dark:text-[#FFF2B4]" />
                  <span>Exact PDF Page Numbers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-[#84A282] dark:text-[#FFF2B4]" />
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
      <section className="py-20 bg-white dark:bg-[#1C4412] border-b border-[#B8CFB3] dark:border-[#728E6D] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-black text-[#15370D] dark:text-[#FFF2B4]">
              {currentLang === 'as' 
                ? 'UniMitra-ই বিশ্ববিদ্যালয়ৰ প্ৰশ্নৰ উত্তৰ কেনেদৰে দিয়ে চাওক' 
                : 'See How UniMitra Answers Institutional Queries'}
            </h2>
            <p className="text-sm sm:text-base text-[#4F6D4B] dark:text-[#E5CD82] mt-3">
              Answers are grounded strictly in verified institutional ordinances, circulars, and notifications — avoiding generic web hallucinations.
            </p>
          </div>

          {/* Interactive Demo Card */}
          <div className="max-w-4xl mx-auto bg-[#FEFAF3] dark:bg-[#15370D] border-2 border-[#B8CFB3] dark:border-[#728E6D] rounded-3xl shadow-elevated-sage dark:shadow-elevated-gold overflow-hidden">
            
            {/* Card Header */}
            <div className="bg-[#84A282] dark:bg-[#235417] px-5 sm:px-7 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-white">
              <div className="flex items-center space-x-2">
                <div className="w-3.5 h-3.5 rounded-full bg-[#FEFAF3]"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-[#B8CFB3]"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-[#F6E2E9]"></div>
                <span className="text-xs sm:text-sm font-black ml-2 text-[#FEFAF3] dark:text-[#FFF2B4]">
                  UniMitra Live Institutional Assistant (CampusIQ)
                </span>
              </div>
              
              {/* Language Switch Pills */}
              <div className="flex items-center space-x-1 bg-black/20 p-1 rounded-xl">
                <button
                  onClick={() => handleDemoSwitch('as')}
                  className={`px-3 py-1.5 text-xs font-black rounded-lg cursor-pointer transition-all ${
                    activeDemoTab === 'as' ? 'bg-[#FEFAF3] text-[#15370D] shadow-xs' : 'text-[#FFF2B4] hover:text-white'
                  }`}
                >
                  অসমীয়া
                </button>
                <button
                  onClick={() => handleDemoSwitch('en')}
                  className={`px-3 py-1.5 text-xs font-black rounded-lg cursor-pointer transition-all ${
                    activeDemoTab === 'en' ? 'bg-[#FEFAF3] text-[#15370D] shadow-xs' : 'text-[#FFF2B4] hover:text-white'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Institutional Query Box */}
              <div className="bg-white dark:bg-[#1C4412] border border-[#B8CFB3] dark:border-[#728E6D] rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-[#4F6D4B] dark:text-[#E5CD82] mb-2">
                  <span className="text-[#84A282] dark:text-[#FFF2B4] font-black flex items-center space-x-1.5">
                    <span>Inquiry Query (প্ৰশ্ন)</span>
                  </span>
                  <span className="text-[#15370D] dark:text-[#FFF2B4] bg-[#F6E2E9] dark:bg-[#728E6D] px-2 py-0.5 rounded text-[10px] font-black">
                    Institutional Regulation Check
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#15370D] dark:text-[#FFF2B4] bg-[#FEFAF3] dark:bg-[#15370D] p-3.5 rounded-xl border border-[#B8CFB3] dark:border-[#728E6D]">
                  {demoInput}
                </div>
              </div>

              {/* RAG Workflow Strip */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#B8CFB3]/20 dark:bg-[#1C4412] rounded-2xl border border-[#B8CFB3] dark:border-[#728E6D] text-xs font-bold text-[#15370D] dark:text-[#E5CD82]">
                <span className="text-[#84A282] dark:text-[#FFF2B4]">1. Natural Language Parse</span>
                <span className="text-[#84A282]">➔</span>
                <span className="text-[#84A282] dark:text-[#FFF2B4]">2. Multilingual E5 Vector Retrieval</span>
                <span className="text-[#84A282]">➔</span>
                <span className="text-[#84A282] dark:text-[#FFF2B4]">3. Grounded Citation Extraction</span>
              </div>

              {/* Grounded Institutional Answer */}
              <div className="bg-white dark:bg-[#1C4412] border-2 border-[#84A282] dark:border-[#E5CD82]/70 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#B8CFB3]/60 dark:border-[#728E6D]">
                  <div className="flex items-center space-x-2 text-[#84A282] dark:text-[#FFF2B4] font-black text-sm">
                    <CheckCircleIcon className="w-5 h-5 text-[#84A282] dark:text-[#FFF2B4]" />
                    <span>Verified Institutional Answer</span>
                  </div>
                  <span className="text-xs bg-[#B8CFB3]/30 dark:bg-[#15370D] text-[#15370D] dark:text-[#FFF2B4] px-3 py-1 rounded-xl font-bold border border-[#84A282]/30">
                    {demoResponse.confidence}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#15370D] dark:text-slate-100 leading-relaxed font-semibold">
                  {demoResponse.answer}
                </p>

                {/* Grounding Source Badge */}
                <div className="mt-5 pt-4 border-t border-[#B8CFB3]/60 dark:border-[#728E6D] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-2 text-[#4F6D4B] dark:text-[#E5CD82]">
                    <DocumentTextIcon className="w-4 h-4 text-[#84A282]" />
                    <span className="font-bold">{demoResponse.source}</span>
                    <span className="text-[#84A282]">•</span>
                    <span className="text-[#84A282] dark:text-[#FFF2B4] font-black">{demoResponse.page}</span>
                  </div>
                  <button 
                    onClick={handlePortalAccess}
                    className="text-xs font-black text-[#84A282] dark:text-[#FFF2B4] hover:underline cursor-pointer"
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
      <section className="py-20 bg-[#FEFAF3] dark:bg-[#15370D] border-b border-[#B8CFB3] dark:border-[#728E6D] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-black text-[#15370D] dark:text-[#FFF2B4]">
              {currentLang === 'as' 
                ? 'UniMitra-ৰ সেৱা আৰু শৈক্ষিক তথ্যৰ পৰিসৰ' 
                : 'Comprehensive University Assistance Scope'}
            </h2>
            <p className="text-sm sm:text-base text-[#4F6D4B] dark:text-[#E5CD82] mt-3">
              Built to serve students, faculty members, and administrative staff across all major Assam universities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Domain 1: Regulations */}
            <div className="bg-white dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D] rounded-3xl p-6 shadow-sm hover:border-[#84A282] transition-all card-3d">
              <div className="w-12 h-12 rounded-2xl bg-[#B8CFB3]/30 dark:bg-[#15370D] border border-[#84A282]/40 flex items-center justify-center mb-5">
                <BuildingLibraryIcon className="w-6 h-6 text-[#84A282] dark:text-[#FFF2B4]" />
              </div>
              <h3 className="text-lg font-black text-[#15370D] dark:text-[#FFF2B4] mb-2">
                University Regulations & Ordinances
              </h3>
              <p className="text-xs sm:text-sm text-[#4F6D4B] dark:text-[#E5CD82] leading-relaxed">
                Institutional statutes, code of conduct, academic council policies, attendance thresholds, and grievance redressal mechanisms.
              </p>
            </div>

            {/* Domain 2: Examinations */}
            <div className="bg-white dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D] rounded-3xl p-6 shadow-sm hover:border-[#84A282] transition-all card-3d">
              <div className="w-12 h-12 rounded-2xl bg-[#F6E2E9] dark:bg-[#15370D] border border-[#B8CFB3] dark:border-[#728E6D] flex items-center justify-center mb-5">
                <ClipboardDocumentCheckIcon className="w-6 h-6 text-[#84A282] dark:text-[#FFF2B4]" />
              </div>
              <h3 className="text-lg font-black text-[#15370D] dark:text-[#FFF2B4] mb-2">
                Examinations & Evaluation Rules
              </h3>
              <p className="text-xs sm:text-sm text-[#4F6D4B] dark:text-[#E5CD82] leading-relaxed">
                Passing criteria, grading system (CBCS / NEP 2020), back paper rules, re-evaluation guidelines, and exam schedules.
              </p>
            </div>

            {/* Domain 3: Academic Programs */}
            <div className="bg-white dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D] rounded-3xl p-6 shadow-sm hover:border-[#84A282] transition-all card-3d">
              <div className="w-12 h-12 rounded-2xl bg-[#B8CFB3]/30 dark:bg-[#15370D] border border-[#84A282]/40 flex items-center justify-center mb-5">
                <IdentificationIcon className="w-6 h-6 text-[#84A282] dark:text-[#FFF2B4]" />
              </div>
              <h3 className="text-lg font-black text-[#15370D] dark:text-[#FFF2B4] mb-2">
                Academic Programs & Degrees
              </h3>
              <p className="text-xs sm:text-sm text-[#4F6D4B] dark:text-[#E5CD82] leading-relaxed">
                Undergraduate, Postgraduate, Diploma, and Ph.D. degree structures, department profiles, duration, and credit frameworks.
              </p>
            </div>

            {/* Domain 4: Scholarships */}
            <div className="bg-white dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D] rounded-3xl p-6 shadow-sm hover:border-[#84A282] transition-all card-3d">
              <div className="w-12 h-12 rounded-2xl bg-[#F6E2E9] dark:bg-[#15370D] border border-[#B8CFB3] dark:border-[#728E6D] flex items-center justify-center mb-5">
                <BanknotesIcon className="w-6 h-6 text-[#84A282] dark:text-[#FFF2B4]" />
              </div>
              <h3 className="text-lg font-black text-[#15370D] dark:text-[#FFF2B4] mb-2">
                Scholarships & Financial Grants
              </h3>
              <p className="text-xs sm:text-sm text-[#4F6D4B] dark:text-[#E5CD82] leading-relaxed">
                State merit schemes, Ishan Uday scholarships, post-matric funds, eligibility criteria, required documentation, and deadlines.
              </p>
            </div>

            {/* Domain 5: Admissions */}
            <div className="bg-white dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D] rounded-3xl p-6 shadow-sm hover:border-[#84A282] transition-all card-3d">
              <div className="w-12 h-12 rounded-2xl bg-[#B8CFB3]/30 dark:bg-[#15370D] border border-[#84A282]/40 flex items-center justify-center mb-5">
                <DocumentTextIcon className="w-6 h-6 text-[#84A282] dark:text-[#FFF2B4]" />
              </div>
              <h3 className="text-lg font-black text-[#15370D] dark:text-[#FFF2B4] mb-2">
                Admission Procedures & Cut-Offs
              </h3>
              <p className="text-xs sm:text-sm text-[#4F6D4B] dark:text-[#E5CD82] leading-relaxed">
                Step-by-step application steps, entrance test guidelines, reservation policies, document verification, and seat matrices.
              </p>
            </div>

            {/* Domain 6: Campus Facilities */}
            <div className="bg-white dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D] rounded-3xl p-6 shadow-sm hover:border-[#84A282] transition-all card-3d">
              <div className="w-12 h-12 rounded-2xl bg-[#F6E2E9] dark:bg-[#15370D] border border-[#B8CFB3] dark:border-[#728E6D] flex items-center justify-center mb-5">
                <BuildingOfficeIcon className="w-6 h-6 text-[#84A282] dark:text-[#FFF2B4]" />
              </div>
              <h3 className="text-lg font-black text-[#15370D] dark:text-[#FFF2B4] mb-2">
                Campus Facilities & Services
              </h3>
              <p className="text-xs sm:text-sm text-[#4F6D4B] dark:text-[#E5CD82] leading-relaxed">
                Hostel allotment guidelines, central library timing, health centers, student welfare cells, laboratory guidelines, and sports facilities.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* SUPPORTED UNIVERSITIES DIRECTORY */}
      <section className="py-20 bg-white dark:bg-[#1C4412] border-b border-[#B8CFB3] dark:border-[#728E6D] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-8 mb-8 border-b border-[#B8CFB3]/60 dark:border-[#728E6D] gap-4">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#15370D] dark:text-[#FFF2B4]">
                {currentLang === 'as' ? 'অসমৰ অগ্ৰণী বিশ্ববিদ্যালয়সমূহ' : 'Universities in Assam Knowledge Base'}
              </h3>
              <p className="text-xs sm:text-sm text-[#4F6D4B] dark:text-[#E5CD82] mt-1">
                Centralized access to official regulations, admissions, notices, and ordinances across institutions.
              </p>
            </div>
            <button 
              onClick={handlePortalAccess}
              className="px-5 py-2.5 text-xs sm:text-sm font-black text-white bg-[#84A282] hover:bg-[#6F8E6D] rounded-2xl border border-[#84A282] transition-all cursor-pointer self-start sm:self-auto shadow-xs"
            >
              Enter University Portal ➔
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {universitiesList.map((univ) => (
              <div 
                key={univ.code}
                className="bg-[#FEFAF3] dark:bg-[#15370D] border-2 border-[#B8CFB3] dark:border-[#728E6D] rounded-3xl p-6 hover:border-[#84A282] transition-all cursor-pointer"
                onClick={handlePortalAccess}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-white dark:bg-[#1C4412] border border-[#B8CFB3] dark:border-[#728E6D] text-[#15370D] dark:text-[#FFF2B4]">
                    {univ.code}
                  </span>
                  <span className="text-[10px] font-black text-[#15370D] dark:text-[#FFF2B4] bg-[#F6E2E9] dark:bg-[#728E6D] px-2.5 py-1 rounded-lg">
                    Institutional Index
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-black text-[#15370D] dark:text-[#FFF2B4] mb-1">{univ.name}</h4>
                <p className="text-xs text-[#4F6D4B] dark:text-[#E5CD82] mb-4">{univ.city}</p>
                <div className="flex items-center justify-between pt-3 border-t border-[#B8CFB3]/60 dark:border-[#728E6D] text-xs text-[#4F6D4B] dark:text-[#E5CD82]">
                  <span className="font-semibold">{univ.domains}</span>
                  <span className="font-black text-[#84A282] dark:text-[#FFF2B4] flex items-center space-x-1">
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
      <section className="py-20 bg-[#15370D] text-[#FEFAF3]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-block px-3 py-1 rounded-full bg-[#1C4412] text-xs font-black text-[#FFF2B4] border border-[#728E6D]">
            Official Institutional Assistance
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#FFF2B4]">
            {currentLang === 'as' 
              ? 'বিশ্ববিদ্যালয়ৰ শৈক্ষিক আৰু প্ৰশাসনিক তথ্য এতিয়া আঙুলিৰ মূৰত' 
              : 'Your University. Your Language. Your AI Assistant.'}
          </h2>

          <p className="text-sm sm:text-lg text-[#E5CD82] max-w-2xl mx-auto leading-relaxed">
            Join students, faculty members, and administrative staff across Assam accessing natural language answers to official university regulations, exams, admissions, and facilities.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <button 
              onClick={() => onOpenAuth && onOpenAuth('login')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-white bg-[#84A282] hover:bg-[#6F8E6D] transition-all cursor-pointer shadow-elevated-sage text-sm"
            >
              Sign In to Access Portal
            </button>
            <button 
              onClick={() => onNavigate && onNavigate('features')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-[#FFF2B4] bg-transparent border-2 border-[#728E6D] hover:border-[#FFF2B4] transition-all cursor-pointer text-sm"
            >
              Explore Assistance Services
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
