import { useState } from 'react';
import { 
  SparklesIcon, 
  BookOpenIcon, 
  DocumentTextIcon, 
  CheckCircleIcon, 
  ArrowRightIcon, 
  SearchIcon,
  ScaleIcon 
} from '../../components/common/Icons';

export const DashboardHome = ({ 
  onNavigateTab, 
  currentLang = 'en',
  studentInfo = { name: 'Scholar', course: 'All Curriculums' }
}) => {
  const [quickQuestion, setQuickQuestion] = useState('');

  const currentSubjects = [
    { code: 'BCA-HC-3016', name: 'Database Management Systems', credits: '6 Credits', units: '5 Units', progress: '100% Ingested' },
    { code: 'BCA-HC-3026', name: 'Operating Systems & Linux Concepts', credits: '6 Credits', units: '4 Units', progress: '100% Ingested' },
    { code: 'BCA-HC-3036', name: 'Computer Networks & Protocols', credits: '6 Credits', units: '5 Units', progress: '100% Ingested' },
    { code: 'BCA-SE-3014', name: 'Web Technology & Scripting', credits: '4 Credits', units: '4 Units', progress: '100% Ingested' },
  ];

  const recentAnswers = [
    {
      q: 'What is BCNF and how does it differ from 3NF in DBMS?',
      asQ: 'DBMS ত BCNF কি আৰু ই ৩NF তকৈ কিদৰে পৃথক?',
      subject: 'Database Management Systems',
      source: 'GU_BCA_CBCS_Syllabus.pdf',
      page: 'Page 42, Module 3',
      date: 'Today, 10:30 AM'
    },
    {
      q: 'Explain Round Robin Scheduling with Time Quantum calculation',
      asQ: 'টাইম কোৱাণ্টামৰ সৈতে ৰাউণ্ড ৰবিন শ্বিডিউলিং বুজাই দিয়ক',
      subject: 'Operating Systems',
      source: 'GU_BCA_OS_Unit2.pdf',
      page: 'Page 19, Unit 2',
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
      
      {/* 3D Welcome Student Banner Card */}
      <div className="relative bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-elevated-cerulean card-3d overflow-hidden">
        {/* Subtle background gradient glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#118AB2]/10 via-[#06D6A0]/10 to-transparent rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-black tracking-wider uppercase text-[#118AB2] dark:text-[#FFD166]">
              {currentLang === 'as' ? 'উন্মুক্ত শৈক্ষিক হাব • সকলো পাঠ্যক্ৰম উপলব্ধ' : 'Universal Study Hub • All University Curriculums'}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#073B4C] dark:text-white tracking-tight">
              {currentLang === 'as' 
                ? 'নমস্কাৰ শিক্ষাৰ্থী! আপোনাৰ পাঠ্যক্ৰম অন্বেষণ কৰক' 
                : 'Welcome! Explore Any Course Curriculum'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              {currentLang === 'as'
                ? 'সকলো বিশ্ববিদ্যালয়ৰ অফিচিয়েল পাঠ্যক্ৰম আৰু নিয়ম সংলগ্ন কৰা হৈছে। যিকোনো বিষয়ৰ প্ৰশ্ন সুধক বা সিলেবাছ পৰীক্ষা কৰক।'
                : 'All official course materials and exam blueprints across Assam universities are verified. Ask any syllabus question or view official documents.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab('assistant')}
              className="flex items-center space-x-2 px-5 py-3 rounded-2xl font-bold text-white bg-[#FF7F50] hover:bg-[#E86B3D] transition-all cursor-pointer shadow-elevated-coral text-xs sm:text-sm"
            >
              <SparklesIcon className="w-4 h-4 text-[#FFD166]" />
              <span>{currentLang === 'as' ? 'সহায়কক সোধক' : 'Ask Assistant'}</span>
            </button>
            <button
              onClick={() => onNavigateTab('syllabus')}
              className="px-5 py-3 rounded-2xl font-bold text-[#118AB2] dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer text-xs sm:text-sm border border-slate-200 dark:border-slate-700"
            >
              {currentLang === 'as' ? 'পাঠ্যক্ৰম চাওক' : 'Browse Syllabus'}
            </button>
            <button
              onClick={() => onNavigateTab('compare')}
              className="flex items-center space-x-2 px-5 py-3 rounded-2xl font-bold text-[#06D6A0] hover:text-white bg-[#06D6A0]/10 hover:bg-[#06D6A0] transition-all cursor-pointer text-xs sm:text-sm border border-[#06D6A0]/30 shadow-sm"
            >
              <ScaleIcon className="w-4 h-4" />
              <span>{currentLang === 'as' ? 'পাঠ্যক্ৰম তুলনা' : 'Compare Curriculums'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 3D Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm card-3d">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Semester Courses</span>
            <div className="w-8 h-8 rounded-xl bg-[#E7F3F7] dark:bg-slate-800 text-[#118AB2] flex items-center justify-center">
              <BookOpenIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">4 Subjects</div>
          <span className="text-[11px] font-semibold text-[#06D6A0]">22 Total Credits</span>
        </div>

        <div className="bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm card-3d">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Verified PDFs</span>
            <div className="w-8 h-8 rounded-xl bg-[#E6FBF5] dark:bg-slate-800 text-[#06D6A0] flex items-center justify-center">
              <DocumentTextIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">100% Ingested</div>
          <span className="text-[11px] font-semibold text-[#118AB2] dark:text-[#FFD166]">Official Gauhati Univ</span>
        </div>

        <div className="bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm card-3d">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Curriculum Units</span>
            <div className="w-8 h-8 rounded-xl bg-[#FFF0EB] dark:bg-slate-800 text-[#FF7F50] flex items-center justify-center">
              <BookOpenIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">18 Modules</div>
          <span className="text-[11px] font-semibold text-[#FF7F50]">Full Syllabuses</span>
        </div>

        <div className="bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm card-3d">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Language Mode</span>
            <div className="w-8 h-8 rounded-xl bg-[#FFF9E6] dark:bg-slate-800 text-[#D9A300] flex items-center justify-center">
              <CheckCircleIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">অসমীয়া + EN</div>
          <span className="text-[11px] font-semibold text-[#06D6A0]">Bilingual Search</span>
        </div>

      </div>

      {/* Quick In-Dashboard Ask Assistant Card */}
      <div className="bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-7 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
          {currentLang === 'as' ? 'তৎক্ষণাত পাঠ্যক্ৰমৰ প্ৰশ্ন সোধক' : 'Ask Any Question to UniMitra'}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Type in Assamese or English to get exact syllabus modules, passing marks, or textbook recommendations.
        </p>

        <form onSubmit={handleQuickAsk} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative flex items-center">
            <SearchIcon className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              placeholder={currentLang === 'as' ? 'যিকোনো শৈক্ষিক প্ৰশ্ন লিখক (e.g. DBMS syllabus, passing criteria)...' : 'Ask about your syllabus (e.g. DBMS unit 3 topics, OS pass mark)...'}
              value={quickQuestion}
              onChange={(e) => setQuickQuestion(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-[#118AB2]"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl font-bold text-white bg-[#118AB2] hover:bg-[#0E7497] transition-all cursor-pointer shadow-md text-xs sm:text-sm flex items-center justify-center space-x-2 shrink-0"
          >
            <span>Ask Now</span>
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </form>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-bold">Suggestions:</span>
          <button 
            type="button"
            onClick={() => onNavigateTab('assistant', { prefillQuery: 'What are the prescribed reference books for Database Management Systems?' })}
            className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg hover:text-[#118AB2] cursor-pointer"
          >
            Prescribed DBMS Books
          </button>
          <button 
            type="button"
            onClick={() => onNavigateTab('assistant', { prefillQuery: 'What is the internal assessment mark distribution in GU BCA 3rd Sem?' })}
            className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg hover:text-[#118AB2] cursor-pointer"
          >
            Internal Assessment Rules
          </button>
          <button 
            type="button"
            onClick={() => onNavigateTab('assistant', { prefillQuery: 'গুৱাহাটী বিশ্ববিদ্যালয়ৰ ৩য় ষাণ্মাসিকৰ প্ৰশ্নকাকতৰ গাঁথনি কি?' })}
            className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg hover:text-[#118AB2] cursor-pointer"
          >
            অসমীয়া প্ৰশ্ন আৰ্হি
          </button>
        </div>
      </div>

      {/* 3D Multi-University Comparison Action Card */}
      <div className="relative bg-gradient-to-r from-[#118AB2]/10 via-[#06D6A0]/10 to-[#FFD166]/10 border-2 border-[#118AB2]/30 rounded-3xl p-6 sm:p-7 shadow-sm card-3d flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#118AB2] to-[#06D6A0] text-white flex items-center justify-center shadow-md shrink-0">
            <ScaleIcon className="w-6 h-6 text-[#FFD166]" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {currentLang === 'as' ? 'বিশ্ববিদ্যালয় পাঠ্যক্ৰম তুলনা কেন্দ্ৰ' : 'Multi-University Curriculum Comparison Engine'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {currentLang === 'as' 
                ? 'GU, DU, TU আৰু অন্যান্য বিশ্ববিদ্যালয়ৰ সিলেবাছ, ক্ৰেডিট আৰু নম্বৰ পদ্ধতি তুলনা কৰক।'
                : 'Compare syllabus coverage, credits, and examination schemes across GU, DU, TU & more side-by-side.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('compare')}
          className="flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl font-bold text-white bg-[#118AB2] hover:bg-[#0E7292] transition-all cursor-pointer shadow-elevated-cerulean text-xs sm:text-sm shrink-0"
        >
          <span>{currentLang === 'as' ? 'তুলনা কৰক' : 'Open Compare Studio'}</span>
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>

      {/* 2-Column Section: Available Subjects & Recent Questions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Semester Subjects (Cols 7) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Featured Semester Curriculums</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Syllabuses available for instant AI retrieval</p>
            </div>
            <button
              onClick={() => onNavigateTab('syllabus')}
              className="text-xs font-bold text-[#118AB2] dark:text-[#FFD166] hover:underline cursor-pointer"
            >
              View Full Syllabus ➔
            </button>
          </div>

          <div className="space-y-3">
            {currentSubjects.map((sub) => (
              <div 
                key={sub.code}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 hover:border-[#118AB2] transition-colors flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-mono font-bold bg-[#E7F3F7] dark:bg-slate-700 text-[#118AB2] dark:text-[#FFD166] px-2 py-0.5 rounded">
                      {sub.code}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{sub.credits}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{sub.name}</h4>
                </div>

                <button
                  onClick={() => onNavigateTab('syllabus', { subjectCode: sub.code })}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#118AB2] dark:text-[#06D6A0] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-[#E7F3F7] dark:hover:bg-slate-700 transition-all shrink-0 cursor-pointer"
                >
                  Explore
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Verified Answers with Citations (Cols 5) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Inquiries</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Answers with exact page numbers</p>
            </div>
            <button
              onClick={() => onNavigateTab('assistant')}
              className="text-xs font-bold text-[#118AB2] dark:text-[#FFD166] hover:underline cursor-pointer"
            >
              Ask AI ➔
            </button>
          </div>

          <div className="space-y-3.5">
            {recentAnswers.map((item, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 space-y-2"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-bold text-[#118AB2] dark:text-[#FFD166]">{item.subject}</span>
                  <span>{item.date}</span>
                </div>

                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {currentLang === 'as' ? item.asQ : item.q}
                </p>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                  <span className="text-[#06D6A0] font-bold flex items-center space-x-1">
                    <CheckCircleIcon className="w-3.5 h-3.5" />
                    <span>{item.page}</span>
                  </span>
                  <span className="text-slate-500 font-mono text-[10px]">{item.source}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};

