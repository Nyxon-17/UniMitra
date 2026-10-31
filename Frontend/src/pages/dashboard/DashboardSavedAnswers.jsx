import { useState, useEffect } from 'react';
import { 
  BuildingLibraryIcon, 
  DocumentTextIcon, 
  TrashIcon, 
  DocumentDuplicateIcon, 
  CheckIcon, 
  SearchIcon, 
  SparklesIcon, 
  ClockIcon,
  ShieldCheckIcon
} from '../../components/common/Icons';

export const DashboardSavedAnswers = ({ onNavigateTab, currentLang = 'en' }) => {
  // Initial default saved answers for demo
  const initialSaved = [
    {
      id: 'SAVED-1',
      query: 'What is the minimum attendance required to appear for semester examinations?',
      asQuery: 'ষাণ্মাসিক পৰীক্ষাত অৱতীৰ্ণ হ’বলৈ নূন্যতম কিমান উপস্থিতিৰ প্ৰয়োজন?',
      answer: 'Students must maintain a minimum of 75% attendance in theory and practical sessions. Special condonation of up to 10% (allowing students with 65%-74% attendance) may be granted by the Head of Department exclusively on verified medical grounds accompanied by a medical practitioner certificate.',
      source: 'Gauhati University Academic Regulations & Ordinances',
      page: 'Statute 12.4, Page 31',
      savedAt: 'Today at 11:30 AM',
      category: 'Attendance & Regulations'
    },
    {
      id: 'SAVED-2',
      query: 'What is the annual parental income ceiling for the Assam DHE Combined Merit Scholarship?',
      asQuery: 'অসম চৰকাৰৰ DHE কম্বাইণ্ড মেৰিট স্কলাৰশ্বিপৰ বাবে অভিভাৱকৰ বাৰ্ষিক আয়ৰ সীমা কিমান?',
      answer: 'The annual parental/guardian gross income from all sources must not exceed ₹2,500,000 (Two Lakh Fifty Thousand Rupees). The applicant must be a permanent domicile of Assam and possess a valid income certificate issued by the competent Circle Officer or Revenue Authority.',
      source: 'Directorate of Higher Education (DHE) Assam Official Notification',
      page: 'Circular DHE/EG/Schol/2024/09, Clause 4',
      savedAt: 'Yesterday at 04:15 PM',
      category: 'Scholarships'
    },
    {
      id: 'SAVED-3',
      query: 'What is the official formula to convert CBCS CGPA to percentage?',
      asQuery: 'CBCS গ্ৰেডিং ব্যৱস্থাত CGPA ৰ পৰা শতাংশলৈ পৰিৱৰ্তন কৰাৰ সূত্ৰ কি?',
      answer: 'Under the CBCS regulation of state universities in Assam (following UGC norms), the percentage of marks is calculated as: Percentage (%) = CGPA × 10. For instance, a CGPA of 7.82 equates to 78.20% on the transcript scale.',
      source: 'UGC CBCS Guidelines & Assam University Statutes',
      page: 'Ordinance V, Page 16',
      savedAt: '2 days ago',
      category: 'Examinations'
    }
  ];

  const [savedList, setSavedList] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('unimitra_saved_answers');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // fallback
        }
      }
    }
    return initialSaved;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Sync saved answers
  useEffect(() => {
    localStorage.setItem('unimitra_saved_answers', JSON.stringify(savedList));
  }, [savedList]);

  // Remove saved answer
  const handleDelete = (id) => {
    setSavedList((prev) => prev.filter((item) => item.id !== id));
  };

  // Copy text to clipboard
  const handleCopy = (id, text) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const filteredList = savedList.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.query.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q) ||
      (item.category && item.category.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header Card */}
      <div className="bg-white dark:bg-[#150F2C] border-2 border-[#E0D4FD] dark:border-[#3B2868] rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black tracking-wider uppercase text-[#6D28D9] dark:text-[#FAF8FF]">
              {currentLang === 'as' ? 'সংৰক্ষিত উত্তৰ আৰু নিৰ্ভুল উদ্ধৃতি' : 'Personal Knowledge Bookmarks'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-[#FAF8FF] tracking-tight">
              {currentLang === 'as' ? 'সংৰক্ষিত শৈক্ষিক উত্তৰসমূহ' : 'Saved Useful Answers & Citations'}
            </h1>
            <p className="text-xs sm:text-sm text-[#555375] dark:text-[#C4B5FD] mt-1">
              Quick access to bookmarked AI explanations, ordinance interpretations, and scholarship guidelines.
            </p>
          </div>

          <div className="shrink-0 flex items-center space-x-2">
            <span className="text-xs font-black px-3.5 py-1.5 rounded-xl bg-[#DDD6FE] dark:bg-[#3B2868] text-[#0F172A] dark:text-[#FAF8FF]">
              {savedList.length} Saved Items
            </span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-[#150F2C] border-2 border-[#E0D4FD] dark:border-[#3B2868] rounded-3xl p-4 sm:p-6 shadow-sm">
        <div className="relative w-full">
          <SearchIcon className="w-4 h-4 text-[#6D28D9] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={currentLang === 'as' ? 'সংৰক্ষিত উত্তৰৰ মাজত অনুসন্ধান কৰক...' : 'Search your saved answers by keyword...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0F172A] text-xs font-bold text-[#0F172A] dark:text-[#FAF8FF] outline-none focus:border-[#6D28D9]"
          />
        </div>
      </div>

      {/* Saved Answers Cards */}
      {filteredList.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#150F2C] border-2 border-[#E0D4FD] dark:border-[#3B2868] rounded-3xl space-y-3">
          <DocumentTextIcon className="w-12 h-12 text-[#6D28D9] mx-auto opacity-50" />
          <h3 className="text-base font-black text-[#0F172A] dark:text-[#FAF8FF]">No saved answers found</h3>
          <p className="text-xs text-[#555375] dark:text-[#C4B5FD]">
            When you ask the AI assistant questions, click the bookmark icon on any answer to save it here for future reference.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredList.map((item) => (
            <div 
              key={item.id}
              className="bg-white dark:bg-[#150F2C] border-2 border-[#E0D4FD] dark:border-[#3B2868] rounded-3xl p-6 sm:p-7 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E0D4FD]/40 dark:border-[#3B2868]/40 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md bg-[#4C1D95] text-white">
                    {item.category || 'General'}
                  </span>
                  <span className="text-xs font-bold text-[#555375] dark:text-[#C4B5FD] flex items-center space-x-1">
                    <ClockIcon className="w-3.5 h-3.5" />
                    <span>{item.savedAt}</span>
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopy(item.id, item.answer)}
                    className="p-1.5 rounded-lg border border-[#E0D4FD] dark:border-[#3B2868] hover:bg-[#E0D4FD]/20 text-[#0F172A] dark:text-[#FAF8FF] cursor-pointer"
                    title="Copy Answer"
                  >
                    {copiedId === item.id ? <CheckIcon className="w-4 h-4 text-green-600" /> : <DocumentDuplicateIcon className="w-4 h-4 text-[#6D28D9]" />}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg border border-red-200 dark:border-red-900 hover:bg-red-50 text-red-600 dark:text-red-400 cursor-pointer"
                    title="Remove from Saved"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Question */}
              <h2 className="text-sm sm:text-base font-black text-[#0F172A] dark:text-[#FAF8FF]">
                Q: {currentLang === 'as' && item.asQuery ? item.asQuery : item.query}
              </h2>

              {/* Grounded Answer */}
              <div className="p-4 bg-[#FAF8FF] dark:bg-[#0F172A] rounded-2xl border border-[#E0D4FD]/60 dark:border-[#3B2868] text-xs sm:text-sm text-[#0F172A] dark:text-[#FAF8FF] leading-relaxed">
                {item.answer}
              </div>

              {/* Citation Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#555375] dark:text-[#C4B5FD]">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheckIcon className="w-4 h-4 text-[#6D28D9] shrink-0" />
                  <span className="font-bold">{item.source}</span>
                  <span>•</span>
                  <span className="text-[#6D28D9] dark:text-[#FAF8FF] font-semibold">{item.page}</span>
                </div>

                <button
                  onClick={() => onNavigateTab && onNavigateTab('assistant', { prefillQuery: item.query })}
                  className="text-xs font-bold text-[#6D28D9] dark:text-[#FAF8FF] hover:underline flex items-center space-x-1 cursor-pointer self-start sm:self-auto"
                >
                  <SparklesIcon className="w-3.5 h-3.5" />
                  <span>Ask Follow-up</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

