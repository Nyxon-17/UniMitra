import { useState } from 'react';
import { UniversityHero3D } from '../../components/common/Graphic3D';
import { 
  SearchIcon, 
  AcademicCapIcon, 
  BrainIcon, 
  ShieldCheckIcon, 
  ArrowRightIcon, 
  CheckCircleIcon,
  DocumentTextIcon,
  LanguageIcon
} from '../../components/common/Icons';

export const Home = ({ onNavigate, onOpenAuth, currentLang = 'en' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDemoTab, setActiveDemoTab] = useState('as');
  const [demoInput, setDemoInput] = useState('গুৱাহাটী বিশ্ববিদ্যালয়ৰ BCA ৩য় ষাণ্মাসিকৰ Database Management Systems ৰ সিলেবাছ দিয়ক।');
  const [demoResponse, setDemoResponse] = useState({
    answer: 'গুৱাহাটী বিশ্ববিদ্যালয়ৰ BCA ৩য় ষাণ্মাসিকৰ অফিচিয়েল পাঠ্যক্ৰম অনুসৰি Database Management Systems (BCA-HC-3016) বিষয়ৰ মূল বিষয়সমূহ হ’ল: ১/ Relational Data Model আৰু SQL, ২/ Normalization (1NF, 2NF, 3NF, BCNF), ৩/ Transaction Management, আৰু ৪/ Indexing & B-Trees।',
    source: 'GU_BCA_Syllabus.pdf',
    page: 'পৃষ্ঠা নং ৪২',
    confidence: 'সঠিক অফিচিয়েল মিল (Verified)',
  });

  const handleDemoSwitch = (lang) => {
    setActiveDemoTab(lang);
    if (lang === 'as') {
      setDemoInput('গুৱাহাটী বিশ্ববিদ্যালয়ৰ BCA ৩য় ষাণ্মাসিকৰ Database Management Systems ৰ সিলেবাছ দিয়ক।');
      setDemoResponse({
        answer: 'গুৱাহাটী বিশ্ববিদ্যালয়ৰ BCA ৩য় ষাণ্মাসিকৰ অফিচিয়েল পাঠ্যক্ৰম অনুসৰি Database Management Systems (BCA-HC-3016) বিষয়ৰ মূল বিষয়সমূহ হ’ল: ১/ Relational Data Model আৰু SQL, ২/ Normalization (1NF, 2NF, 3NF, BCNF), ৩/ Transaction Management, আৰু ৪/ Indexing & B-Trees।',
        source: 'GU_BCA_Syllabus.pdf',
        page: 'পৃষ্ঠা নং ৪২',
        confidence: 'সঠিক অফিচিয়েল মিল (Verified)',
      });
    } else {
      setDemoInput('What are the passing criteria and examination rules for Dibrugarh University Undergraduate courses?');
      setDemoResponse({
        answer: 'According to official Dibrugarh University examination guidelines, students must secure a minimum of 40% marks in both End-Semester Examinations and In-Semester Internal Assessments separately to successfully pass each subject.',
        source: 'DU_Examination_Regulations.pdf',
        page: 'Page 18, Section 10',
        confidence: 'Official Document Match',
      });
    }
  };

  const universitiesList = [
    { name: 'Gauhati University', code: 'GU', city: 'Guwahati', courses: '140+ Courses' },
    { name: 'Dibrugarh University', code: 'DU', city: 'Dibrugarh', courses: '115+ Courses' },
    { name: 'Tezpur University', code: 'TU', city: 'Napaam, Tezpur', courses: '85+ Programs' },
    { name: 'Cotton University', code: 'CU', city: 'Panbazar, Guwahati', courses: '60+ Courses' },
    { name: 'Assam University', code: 'AUS', city: 'Silchar', courses: '95+ Programs' },
    { name: 'Bodoland University', code: 'BU', city: 'Kokrajhar', courses: '50+ Courses' },
  ];

  return (
    <div className="bg-[#FAFAFC] dark:bg-[#0B1320] min-h-screen text-[#073B4C] dark:text-slate-100 transition-colors duration-200">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200 dark:border-slate-800 bg-grid-pattern">
        {/* Ambient Gradient Highlights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#118AB2]/10 via-[#06D6A0]/10 to-[#FF7F50]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content (Cols 7) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-[#073B4C] dark:text-white">
                {currentLang === 'as' ? (
                  <>
                    বিশ্ববিদ্যালয়ৰ শৈক্ষিক তথ্য এতিয়া আপোনাৰ নিজৰ <span className="text-[#FF7F50] underline decoration-[#FFD166] decoration-4">অসমীয়া ভাষাত</span>
                  </>
                ) : (
                  <>
                    Instant, Verified Academic Answers for Every <span className="text-[#118AB2] dark:text-[#06D6A0]">Assam University</span> Student
                  </>
                )}
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                {currentLang === 'as'
                  ? 'গৌহাটী, ডিব্ৰুগড়, তেজপুৰকে ধৰি অসমৰ সকলো বিশ্ববিদ্যালয়ৰ অফিচিয়েল পাঠ্যক্ৰম, নিয়ম আৰু প্ৰশ্নকাকতৰ পৰা পোনপটীয়া সঠিক পৃষ্ঠা নম্বৰসহ বিশ্বাসযোগ্য উত্তৰ লাভ কৰক।'
                  : 'Access official syllabuses, semester exam rules, course structures, and get direct, verified answers with exact page numbers in both Assamese and English.'}
              </p>

              {/* Quick Academic Search Bar */}
              <div className="bg-white dark:bg-[#111C2E] p-3 rounded-2xl border-2 border-slate-300 dark:border-slate-700 shadow-elevated-card max-w-xl mx-auto lg:mx-0">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 flex items-center px-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <SearchIcon className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
                    <input 
                      type="text" 
                      placeholder={currentLang === 'as' ? 'বিষয়, পাঠ্যক্ৰম বা প্ৰশ্ন লিখক...' : 'Search subject, syllabus, course details...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full py-3 bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                    />
                  </div>
                  <button 
                    onClick={() => onNavigate && onNavigate('contact')}
                    className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-[#118AB2] hover:bg-[#0E7497] text-white text-sm font-bold transition-all cursor-pointer shadow-md shrink-0"
                  >
                    <span>{currentLang === 'as' ? 'বিচাৰক' : 'Ask Question'}</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Popular Search Tags */}
                <div className="flex flex-wrap items-center gap-2 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-bold">Popular:</span>
                  <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-300 hover:text-[#118AB2] cursor-pointer">GU BCA 3rd Sem</span>
                  <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-300 hover:text-[#118AB2] cursor-pointer">DU Exam Guidelines</span>
                  <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-300 hover:text-[#118AB2] cursor-pointer">Tezpur Univ Syllabus</span>
                </div>
              </div>

              {/* Key Trust Signals */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-[#06D6A0]" />
                  <span>Zero Fake Information</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-[#06D6A0]" />
                  <span>Exact PDF Page Numbers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-[#06D6A0]" />
                  <span>Assamese + English Support</span>
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

      {/* LIVE INTERACTIVE QUESTION & ANSWER PREVIEW */}
      <section className="py-20 bg-white dark:bg-[#0E1726] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-[#073B4C] dark:text-white">
              {currentLang === 'as' 
                ? 'UniMitra-ই কেনেদৰে প্ৰশ্নৰ উত্তৰ দিয়ে চাওক' 
                : 'See How UniMitra Answers Your Questions'}
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 mt-3">
              Unlike generic search, UniMitra only quotes from official university documents and provides exact page references.
            </p>
          </div>

          {/* Interactive Demo Card */}
          <div className="max-w-4xl mx-auto bg-white dark:bg-[#111C2E] border-2 border-slate-300 dark:border-slate-700 rounded-2xl shadow-elevated-cerulean overflow-hidden">
            
            {/* Card Header */}
            <div className="bg-[#073B4C] px-4 sm:px-6 py-3.5 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-white">
              <div className="flex items-center space-x-2">
                <div className="w-3.5 h-3.5 rounded-full bg-[#FF7F50]"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-[#FFD166]"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-[#06D6A0]"></div>
                <span className="text-sm font-bold ml-2 text-slate-200">UniMitra Live Academic Assistant</span>
              </div>
              
              {/* Language Switch Pills */}
              <div className="flex items-center space-x-1 bg-white/10 p-1 rounded-xl">
                <button
                  onClick={() => handleDemoSwitch('as')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                    activeDemoTab === 'as' ? 'bg-[#FF7F50] text-white shadow-sm' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  অসমীয়া
                </button>
                <button
                  onClick={() => handleDemoSwitch('en')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                    activeDemoTab === 'en' ? 'bg-[#118AB2] text-white shadow-sm' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-6 sm:p-8 space-y-6 bg-slate-50/60 dark:bg-[#0E1726]/60">
              
              {/* Student Query Box */}
              <div className="bg-white dark:bg-[#162235] border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                  <span className="text-[#118AB2] dark:text-[#FFD166] flex items-center space-x-1.5">
                    <span>Student Inquiry (প্ৰশ্ন)</span>
                  </span>
                  <span className="text-[#06D6A0]">Verified University Question</span>
                </div>
                <div className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  {demoInput}
                </div>
              </div>

              {/* Simple Workflow Strip */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#073B4C]/5 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span className="text-[#118AB2] dark:text-[#06D6A0]">1. Select University</span>
                <span className="text-slate-400">➔</span>
                <span className="text-[#06D6A0] dark:text-[#FFD166]">2. Match Official Document</span>
                <span className="text-slate-400">➔</span>
                <span className="text-[#FF7F50]">3. Page-Verified Answer</span>
              </div>

              {/* AI Verified Answer Output */}
              <div className="bg-white dark:bg-[#162235] border-2 border-[#06D6A0]/40 rounded-2xl p-6 shadow-elevated-mint relative">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-2 text-[#06D6A0] font-bold text-sm">
                    <CheckCircleIcon className="w-5 h-5" />
                    <span>Verified Academic Answer</span>
                  </div>
                  <span className="text-xs bg-[#E6FBF5] dark:bg-slate-800 text-[#06D6A0] px-3 py-1 rounded-lg font-bold border border-[#06D6A0]/30">
                    {demoResponse.confidence}
                  </span>
                </div>

                <p className="text-sm sm:text-base text-slate-800 dark:text-slate-100 leading-relaxed">
                  {demoResponse.answer}
                </p>

                {/* Grounding Source Badge */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
                    <DocumentTextIcon className="w-4 h-4 text-[#118AB2]" />
                    <span className="font-bold">{demoResponse.source}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-[#FF7F50] font-bold">{demoResponse.page}</span>
                  </div>
                  <button 
                    onClick={() => alert("Official university PDF reader opens in Dashboard.")}
                    className="text-xs font-bold text-[#118AB2] dark:text-[#FFD166] hover:underline cursor-pointer"
                  >
                    View Official Document ↗
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 4 CORE ADVANTAGES */}
      <section className="py-20 bg-[#FAFAFC] dark:bg-[#0B1320] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-[#073B4C] dark:text-white">
              {currentLang === 'as' 
                ? 'UniMitra কিয় ছাত্ৰ-ছাত্ৰীৰ বাবে বিশ্বস্ত?' 
                : 'Why Students & Teachers Trust UniMitra'}
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 mt-3">
              Designed specifically for higher education across Assam with complete accuracy and zero guesswork.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Advantage 1 */}
            <div className="bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm hover:border-[#118AB2] hover:shadow-elevated-cerulean transition-all card-3d">
              <div className="w-12 h-12 rounded-xl bg-[#E7F3F7] dark:bg-slate-800 border border-[#118AB2]/30 flex items-center justify-center mb-5">
                <AcademicCapIcon className="w-6 h-6 text-[#118AB2]" />
              </div>
              <h3 className="text-lg font-bold text-[#073B4C] dark:text-white mb-2">
                Separate University Guidance
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Each university has its own dedicated documents. Gauhati University students never receive mixed-up Dibrugarh University rules.
              </p>
            </div>

            {/* Advantage 2 */}
            <div className="bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm hover:border-[#FF7F50] hover:shadow-elevated-coral transition-all card-3d">
              <div className="w-12 h-12 rounded-xl bg-[#FFF0EB] dark:bg-slate-800 border border-[#FF7F50]/30 flex items-center justify-center mb-5">
                <LanguageIcon className="w-6 h-6 text-[#FF7F50]" />
              </div>
              <h3 className="text-lg font-bold text-[#073B4C] dark:text-white mb-2">
                Native Assamese Language
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Ask in original Assamese script (অসমীয়া) or everyday Romanized spelling. The assistant clearly understands both.
              </p>
            </div>

            {/* Advantage 3 */}
            <div className="bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm hover:border-[#06D6A0] hover:shadow-elevated-mint transition-all card-3d">
              <div className="w-12 h-12 rounded-xl bg-[#E6FBF5] dark:bg-slate-800 border border-[#06D6A0]/30 flex items-center justify-center mb-5">
                <ShieldCheckIcon className="w-6 h-6 text-[#06D6A0]" />
              </div>
              <h3 className="text-lg font-bold text-[#073B4C] dark:text-white mb-2">
                Exact Page Citations
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Every single answer references the exact PDF file and page number so students can verify directly before their exams.
              </p>
            </div>

            {/* Advantage 4 */}
            <div className="bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm hover:border-[#FFD166] hover:shadow-md transition-all card-3d">
              <div className="w-12 h-12 rounded-xl bg-[#FFF9E6] dark:bg-slate-800 border border-[#FFD166]/50 flex items-center justify-center mb-5">
                <BrainIcon className="w-6 h-6 text-[#D9A300]" />
              </div>
              <h3 className="text-lg font-bold text-[#073B4C] dark:text-white mb-2">
                Instant Academic Search
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Lightning fast searches across hundreds of department syllabuses, course credits, and semester guidelines in seconds.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* SUPPORTED UNIVERSITIES DIRECTORY */}
      <section className="py-20 bg-white dark:bg-[#0E1726] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-8 mb-8 border-b border-slate-100 dark:border-slate-800 gap-4">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#073B4C] dark:text-white">
                {currentLang === 'as' ? 'অসমৰ অগ্ৰণী বিশ্ববিদ্যালয়সমূহ' : 'Supported Assam Universities'}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Explore standardized syllabuses, departmental regulations, and study guides.
              </p>
            </div>
            <button 
              onClick={() => onNavigate && onNavigate('universities')}
              className="px-5 py-2.5 text-xs sm:text-sm font-bold text-[#118AB2] dark:text-[#FFD166] bg-[#E7F3F7] dark:bg-slate-800 rounded-xl border border-[#118AB2]/30 hover:bg-[#118AB2] hover:text-white transition-all cursor-pointer self-start sm:self-auto"
            >
              View All 26 Universities ➔
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {universitiesList.map((univ) => (
              <div 
                key={univ.code}
                className="bg-[#FAFAFC] dark:bg-[#111C2E] border border-slate-200 dark:border-slate-700 rounded-2xl p-6 hover:border-[#118AB2] hover:shadow-md transition-all cursor-pointer"
                onClick={() => alert(`Selected ${univ.name}. Academic course catalog will open in Dashboard.`)}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
                    {univ.code}
                  </span>
                  <span className="text-xs font-bold text-[#06D6A0] bg-[#E6FBF5] dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                    Active Catalog
                  </span>
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{univ.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{univ.city}</p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  <span>{univ.courses}</span>
                  <span className="font-bold text-[#118AB2] dark:text-[#FFD166] flex items-center space-x-1">
                    <span>Explore</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-20 bg-[#073B4C] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            {currentLang === 'as' 
              ? 'আপোনাৰ বিশ্ববিদ্যালয়ৰ পাঠ্যক্ৰম এতিয়া আঙুলিৰ মূৰত' 
              : 'Empower Your Academic Journey with UniMitra'}
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Join thousands of university scholars across Assam enjoying instant answers to syllabus questions, exam blueprints, and course guidelines.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <button 
              onClick={() => onOpenAuth && onOpenAuth('register')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-white bg-[#FF7F50] hover:bg-[#E86B3D] transition-all cursor-pointer shadow-elevated-coral text-sm"
            >
              Sign In Free as Student
            </button>
            <button 
              onClick={() => onNavigate && onNavigate('universities')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-white bg-transparent border-2 border-slate-500 hover:border-white transition-all cursor-pointer text-sm"
            >
              Explore Universities in Assam
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
