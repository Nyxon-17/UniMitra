import { useState } from 'react';
import { 
  BookmarkIcon, 
  SearchIcon, 
  SparklesIcon, 
  DocumentTextIcon, 
  CheckCircleIcon, 
  AcademicCapIcon 
} from '../../components/common/Icons';

export const DashboardSaved = ({ 
  onNavigateTab, 
  currentLang = 'en',
  studentInfo = { name: 'Student' }
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  const [savedItems, setSavedItems] = useState([
    {
      id: 1,
      subject: 'Database Management Systems',
      subjectCode: 'BCA-HC-3016',
      question: 'What is BCNF and how does it differ from 3NF in DBMS?',
      asQuestion: 'DBMS ত BCNF কি আৰু ই ৩NF তকৈ কিদৰে পৃথক?',
      answer: 'Boyce-Codd Normal Form (BCNF) is a stricter version of 3NF. A relation is in BCNF if and only if for every non-trivial functional dependency X → Y, X is a super key. In contrast, 3NF permits X → Y even if X is not a super key, provided Y is a prime attribute. Hence, every relation in BCNF is in 3NF, but not every 3NF relation is in BCNF.',
      asAnswer: 'বয়চ-কড নৰ্মেল ফৰ্ম (BCNF) হৈছে ৩NF ৰ এক অধিক কঠোৰ সংস্কৰণ। এটা সম্বন্ধ BCNF ত থাকে যদি আৰু মাত্ৰ যদি প্ৰতিটো কাৰ্যকৰী নিৰ্ভৰশীলতা X → Y ৰ বাবে X এটা চুপাৰ কী হয়। বিপৰীতে, ৩NF ত X এটা চুপাৰ কী নহ’লেও চলে যদিহে Y এটা প্ৰাইম এট্ৰিবিউট হয়।',
      source: 'GU_BCA_CBCS_Syllabus.pdf',
      page: 'Page 42, Module 3',
      savedAt: 'Oct 30, 2026'
    },
    {
      id: 2,
      subject: 'Operating Systems',
      subjectCode: 'BCA-HC-3026',
      question: 'Explain Round Robin Scheduling with Time Quantum calculation',
      asQuestion: 'টাইম কোৱাণ্টামৰ সৈতে ৰাউণ্ড ৰবিন শ্বিডিউলিং বুজাই দিয়ক',
      answer: 'Round Robin (RR) is a preemptive CPU scheduling algorithm designed especially for time-sharing systems. A small unit of time, called a time quantum or time slice (typically 10-100 ms), is allocated to each process in the ready queue. If the process does not complete within its quantum, it is preempted and added to the tail of the ready queue.',
      asAnswer: 'ৰাউণ্ড ৰবিন (RR) হৈছে এটা প্ৰিয়েম্পটিভ CPU শ্বিডিউলিং এলগৰিদম। ৰেডি কিউত থকা প্ৰতিটো প্ৰক্ৰিয়াক টাইম কোৱাণ্টাম নামৰ এটা নিৰ্দিষ্ট সময়ৰ অংশ প্ৰদান কৰা হয়। যদি প্ৰক্ৰিয়াটো সেই সময়ত শেষ নহয়, ইয়াক প্ৰিয়েম্পট কৰি কিউৰ শেষত যোগ কৰা হয়।',
      source: 'GU_BCA_OS_Unit2.pdf',
      page: 'Page 19, Unit 2',
      savedAt: 'Oct 29, 2026'
    },
    {
      id: 3,
      subject: 'Computer Networks',
      subjectCode: 'BCA-HC-3036',
      question: 'Difference between IPv4 and IPv6 header structure',
      asQuestion: 'IPv4 আৰু IPv6 হেডাৰ গঠনৰ মাজত পাৰ্থক্য',
      answer: 'IPv4 headers have a variable length ranging from 20 to 60 bytes with 14 fields and checksum verification. IPv6 features a simplified, fixed header size of 40 bytes with 8 fields, eliminating header checksum to speed up packet processing at routers. IPv6 supports 128-bit addresses compared to 32-bit addresses in IPv4.',
      asAnswer: 'IPv4 হেডাৰৰ দৈৰ্ঘ্য ২০ ৰ পৰা ৬০ বাইটৰ ভিতৰত সালসলনি হয় আৰু ইয়াত ১৪ টা ফিল্ড থাকে। ইয়াৰ বিপৰীতে IPv6 ৰ হেডাৰ ৪০ বাইটৰ এক নিৰ্দিষ্ট আকাৰৰ আৰু ইয়াত ৮ টা সৰল ফিল্ড থাকে, যিয়ে ৰাউটাৰত তথ্য প্ৰক্ৰিয়াকৰণ ত্বৰান্বিত কৰে।',
      source: 'GU_BCA_Networking_Course.pdf',
      page: 'Page 88, Unit 3',
      savedAt: 'Oct 28, 2026'
    }
  ]);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRemove = (id) => {
    setSavedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const filteredItems = savedItems.filter((item) => {
    const matchesFilter = selectedSubjectFilter === 'all' || item.subjectCode === selectedSubjectFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = item.question.toLowerCase().includes(q) || 
                          item.answer.toLowerCase().includes(q) || 
                          (item.asQuestion && item.asQuestion.toLowerCase().includes(q));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* 3D Header Section */}
      <div className="bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-elevated-cerulean card-3d">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-black tracking-wider uppercase text-[#118AB2] dark:text-[#FFD166]">
              <BookmarkIcon className="w-4 h-4 text-[#FF7F50]" />
              <span>{currentLang === 'as' ? 'ব্যক্তিগত শৈক্ষিক সংগ্ৰহ • সংৰক্ষিত উত্তৰ' : 'Universal Study Archive • Saved Notes & Citations'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#073B4C] dark:text-white">
              {currentLang === 'as' ? 'সংৰক্ষিত প্ৰশ্নোত্তৰ আৰু টোকা' : 'Saved Answers & Study Bookmarks'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
              {currentLang === 'as'
                ? 'আপুনি সংৰক্ষণ কৰা সকলো শৈক্ষিক ব্যাখ্যা, পৃষ্ঠাৰ প্ৰসংগ আৰু পাঠ্যপুথিৰ উদ্ধৃতি ইয়াত সাঁচি ৰখা হৈছে।'
                : 'All academic explanations, verified page references, and key formula summaries you bookmarked during study sessions.'}
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => onNavigateTab('assistant')}
              className="flex items-center space-x-2 px-5 py-3 rounded-2xl font-bold text-white bg-[#FF7F50] hover:bg-[#E86B3D] transition-all cursor-pointer shadow-elevated-coral text-xs sm:text-sm"
            >
              <SparklesIcon className="w-4 h-4 text-[#FFD166]" />
              <span>{currentLang === 'as' ? 'সহায়কক সুধক' : 'Ask Assistant'}</span>
            </button>
          </div>
        </div>

        {/* Filter Ribbon */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0">
            <span className="text-xs font-bold text-slate-400 mr-2 uppercase tracking-wider shrink-0">
              {currentLang === 'as' ? 'ফিল্টাৰ:' : 'Filter:'}
            </span>
            <button
              onClick={() => setSelectedSubjectFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                selectedSubjectFilter === 'all'
                  ? 'bg-[#118AB2] text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {currentLang === 'as' ? 'সকলো বিষয়' : 'All Subjects'}
            </button>
            <button
              onClick={() => setSelectedSubjectFilter('BCA-HC-3016')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                selectedSubjectFilter === 'BCA-HC-3016'
                  ? 'bg-[#118AB2] text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              DBMS (3016)
            </button>
            <button
              onClick={() => setSelectedSubjectFilter('BCA-HC-3026')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                selectedSubjectFilter === 'BCA-HC-3026'
                  ? 'bg-[#118AB2] text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Operating Systems (3026)
            </button>
            <button
              onClick={() => setSelectedSubjectFilter('BCA-HC-3036')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                selectedSubjectFilter === 'BCA-HC-3036'
                  ? 'bg-[#118AB2] text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Networks (3036)
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={currentLang === 'as' ? 'সংৰক্ষিত উত্তৰ বিচাৰক...' : 'Search saved notes...'}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-[#118AB2] transition-all"
            />
          </div>
        </div>
      </div>

      {/* Bookmarked Cards List */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-[#111C2E] border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl">
            <BookmarkIcon className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">
              {currentLang === 'as' ? 'কোনো সংৰক্ষিত টোকা পোৱা নগ’ল।' : 'No saved answers found in your bookmarks.'}
            </p>
            <button
              onClick={() => onNavigateTab('assistant')}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#118AB2] hover:bg-[#0E7292] transition-colors cursor-pointer"
            >
              Browse AI Assistant
            </button>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm card-3d space-y-4 transition-all"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black bg-[#118AB2]/10 dark:bg-[#118AB2]/30 text-[#118AB2] dark:text-sky-300">
                    {item.subjectCode}
                  </span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {item.subject}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                  <DocumentTextIcon className="w-3.5 h-3.5 text-[#118AB2]" />
                  <span>{item.source} • {item.page}</span>
                </div>
              </div>

              {/* Question */}
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {currentLang === 'as' && item.asQuestion ? item.asQuestion : item.question}
              </h3>

              {/* Answer Content */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                {currentLang === 'as' && item.asAnswer ? item.asAnswer : item.answer}
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">
                  Saved on {item.savedAt}
                </span>

                <div className="flex items-center space-x-2">
                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopy(item.id, currentLang === 'as' && item.asAnswer ? item.asAnswer : item.answer)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    {copiedId === item.id ? (
                      <span className="text-emerald-500 font-bold">✓ Copied</span>
                    ) : (
                      'Copy Text'
                    )}
                  </button>

                  {/* Continue Chat Button */}
                  <button
                    onClick={() => onNavigateTab('assistant', { prefillQuery: `Can you elaborate further on: ${item.question}` })}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#118AB2] hover:bg-[#0E7292] transition-colors cursor-pointer shadow-xs"
                  >
                    <SparklesIcon className="w-3 h-3 text-[#FFD166]" />
                    <span>Ask More</span>
                  </button>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                    title="Remove Bookmark"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

