import { useState } from 'react';
import { 
  BuildingLibraryIcon, 
  ClipboardDocumentCheckIcon, 
  CheckCircleIcon, 
  SearchIcon, 
  DocumentTextIcon, 
  SparklesIcon, 
  ClockIcon, 
  ArrowRightIcon,
  ShieldCheckIcon
} from '../../components/common/Icons';

export const DashboardExaminations = ({ onNavigateTab, currentLang = 'en' }) => {
  const [selectedUniv, setSelectedUniv] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Comprehensive University Examination Ordinances Data
  const examGuidelines = [
    {
      id: 'EXAM-01',
      title: 'Undergraduate Minimum Passing Marks & Credit Requirement',
      asTitle: 'স্নাতক পৰীক্ষাৰ নূন্যতম উত্তীৰ্ণ নম্বৰ আৰু ক্ৰেডিটৰ নিয়ম',
      university: 'Gauhati University (GU)',
      category: 'Passing Criteria',
      ordinanceNo: 'GU/AC/ORD/2023/41',
      summary: 'Candidates must secure a minimum of 40% marks in end-semester theory and practical examinations separately, along with 40% aggregate in continuous internal assessment.',
      asSummary: 'পৰীক্ষাৰ্থীয়ে অন্তিম ষাণ্মাসিকৰ তাত্বিক আৰু ব্যৱহাৰিক পৰীক্ষাত সুকীয়াকৈ নূন্যতম ৪০% নম্বৰ আৰু আভ্যন্তৰীণ মূল্যায়নত ৪০% নম্বৰ লাভ কৰা বাধ্যতামূলক।',
      details: [
        'End-Semester Theory: 40% minimum passing mark',
        'Practical / Viva Voce: 40% minimum passing mark',
        'Continuous Internal Assessment (CIA): 40% minimum aggregate',
        'Mandatory minimum 75% physical attendance to be eligible for admit card issue.'
      ],
      citation: 'GU UG Examination Ordinance (Amended 2023), Section 8.2, Page 29'
    },
    {
      id: 'EXAM-02',
      title: 'Arrear, Backlog & Betterment Examination Regulations',
      asTitle: 'বেক আৰু বেটাৰমেণ্ট পৰীক্ষাৰ বিধি',
      university: 'Dibrugarh University (DU)',
      category: 'Backlog Rules',
      ordinanceNo: 'DU/EXAM/REG/2024/18',
      summary: 'A student with backlog courses may clear them in the corresponding subsequent semester examination (odd with odd, even with even) within a maximum span of N+2 years.',
      asSummary: 'যিকোনো ষাণ্মাসিকত অনুত্তীৰ্ণ হোৱা পাঠ্যক্ৰমসমূহ পৰৱৰ্তী অনুৰূপ ষাণ্মাসিকৰ পৰীক্ষাত (যুগ্মৰ সৈতে যুগ্ম, অযুগ্মৰ সৈতে অযুগ্ম) সৰ্বাধিক N+2 বছৰৰ ভিতৰত সম্পূৰ্ণ কৰিব পাৰিব।',
      details: [
        'Odd semester arrears appear during Odd semester examinations.',
        'Even semester arrears appear during Even semester examinations.',
        'Maximum completion period: Course duration + 2 additional academic years.',
        'Betterment option permitted only in up to two theory courses per semester.'
      ],
      citation: 'Dibrugarh University CBCS Exam Ordinance, Clause 12(A), Page 44'
    },
    {
      id: 'EXAM-03',
      title: 'Grade Point System & CGPA to Percentage Conversion',
      asTitle: 'গ্ৰেড পইণ্ট ব্যৱস্থা আৰু CGPA পৰা শতাংশলৈ পৰিৱৰ্তন',
      university: 'All Universities (UGC NEP Standard)',
      category: 'Grading System',
      ordinanceNo: 'UGC-CBCS-STATUTE-V4',
      summary: 'Standard 10-point letter grading system applied across Assam state universities. Formula: Percentage (%) = CGPA × 10 (or institutional multiplier).',
      asSummary: 'অসমৰ বিশ্ববিদ্যালয়সমূহত মান্য ১০ পইণ্টৰ গ্ৰেডিং ব্যৱস্থা। শতকৰা হাৰ গণনাৰ সূত্ৰ: শতাংশ (%) = CGPA × ১০।',
      details: [
        'O (Outstanding): 10 Grade Points (90% - 100%)',
        'A+ (Excellent): 9 Grade Points (80% - 89%)',
        'A (Very Good): 8 Grade Points (70% - 79%)',
        'B+ (Good): 7 Grade Points (60% - 69%)',
        'B (Above Average): 6 Grade Points (50% - 59%)',
        'C (Average): 5 Grade Points (40% - 49%)',
        'F (Fail): 0 Grade Points (Below 40%)'
      ],
      citation: 'UGC National Guidelines for Evaluation & Academic Transcripts, Gazette Doc 14'
    },
    {
      id: 'EXAM-04',
      title: 'Scrutiny, Answer Script Re-checking & Photocopy Rules',
      asTitle: 'উত্তৰবহী পুনৰীক্ষণ আৰু প্ৰতিলিপি লাভৰ চৰকাৰী নিয়ম',
      university: 'Gauhati University (GU)',
      category: 'Re-evaluation',
      ordinanceNo: 'GU/EXAM/REV/ORD-09',
      summary: 'Students may apply for answer-script re-evaluation or obtain certified photocopies within 15 calendar days from the date of online result publication.',
      asSummary: 'ফলাফল ঘোষণাৰ ১৫ দিনৰ ভিতৰত মাচুলসহ উত্তৰবহী পুনৰীক্ষণ (Re-evaluation) বা প্ৰতিলিপিৰ বাবে অনলাইন আৱেদন কৰিব পাৰি।',
      details: [
        'Application window: Strict 15 days post-result declaration.',
        'Standard scrutiny fee: ₹350 per theory paper.',
        'Certified photocopy fee: ₹500 per theory paper.',
        'Mark revision takes effect only if there is a minimum deviation of +5% or more.'
      ],
      citation: 'GU Examination Evaluation Rules, Statute 24, Page 112'
    },
    {
      id: 'EXAM-05',
      title: 'Attendance Condonation & Examination Eligibility',
      asTitle: 'উপস্থিতিৰ ৰেহাই আৰু পৰীক্ষাত অৱতীৰ্ণ হোৱাৰ যোগ্যতা',
      university: 'Tezpur University (TU)',
      category: 'Eligibility',
      ordinanceNo: 'TU/ACAD/ORD-ATTN/2023',
      summary: 'Mandatory minimum 75% attendance required. Condonation of up to 10% (granting eligibility down to 65%) strictly allowed on valid certified medical grounds.',
      asSummary: 'নূন্যতম ৭৫% উপস্থিতি বাধ্যতামূলক। চিকিৎসাৰ প্ৰমাণপত্ৰ সাপেক্ষে বিভাগীয় মুৰব্বীৰ অনুমোদনত সৰ্বাধিক ১০% লৈকে ৰেহাই সম্ভৱ।',
      details: [
        '75% and above: Full examination eligibility.',
        '65% to 74%: Eligible only with Medical Condonation Certificate and HOD recommendation.',
        'Below 65%: Non-collegiate status, debarred from end-semester examination.'
      ],
      citation: 'Tezpur University Academic Regulations, Ordinance 15.3, Page 38'
    }
  ];

  // Filtered list
  const filteredGuidelines = examGuidelines.filter((item) => {
    const matchesUniv = selectedUniv === 'All' || item.university.includes(selectedUniv) || item.university.includes('All Universities');
    const matchesCategory = activeCategory === 'all' || item.category.toLowerCase().includes(activeCategory.toLowerCase());
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.asTitle.includes(searchQuery) ||
                          item.citation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesUniv && matchesCategory && matchesSearch;
  });

  const handleAskAiAboutExam = (title) => {
    if (onNavigateTab) {
      onNavigateTab('assistant', { prefillQuery: `What are the official rules and guidelines for: ${title}?` });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Card */}
      <div className="bg-white dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D] rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-black tracking-wider uppercase text-[#84A282] dark:text-[#FFF2B4]">
              {currentLang === 'as' ? 'পৰীক্ষা আৰু মূল্যায়ন নিৰ্দেশনা' : 'Institutional Examination Guidelines & Ordinances'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#15370D] dark:text-[#FFF2B4] tracking-tight">
              {currentLang === 'as' ? 'বিশ্ববিদ্যালয়ৰ পৰীক্ষা তথ্য আৰু মূল্যায়ন নীতি' : 'Official University Examination Rules & Passing Criteria'}
            </h1>
            <p className="text-xs sm:text-sm text-[#4F6D4B] dark:text-[#E5CD82] max-w-2xl leading-relaxed">
              {currentLang === 'as'
                ? 'উত্তীৰ্ণ নম্বৰ, বেক পৰীক্ষাৰ নিয়ম, CGPA গণনা, উপস্থিতিৰ ৰেহাই আৰু উত্তৰবহী পুনৰীক্ষণ সম্পৰ্কীয় চৰকাৰী নিয়মসমূহ।'
                : 'Verified statutes on passing criteria, arrear/backlog clearing, CGPA conversion formulas, scrutiny re-evaluation, and attendance condonation across Assam universities.'}
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handleAskAiAboutExam('Examination Backlog and Grading Rules')}
              className="flex items-center space-x-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black text-white bg-[#84A282] hover:bg-[#728E6D] transition-all cursor-pointer shadow-sm"
            >
              <SparklesIcon className="w-4 h-4 text-[#FFF2B4]" />
              <span>{currentLang === 'as' ? 'AI ক পৰীক্ষাৰ নিয়ম সোধক' : 'Ask AI About Exam Rules'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D] rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full lg:w-96">
          <SearchIcon className="w-4 h-4 text-[#84A282] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={currentLang === 'as' ? 'পৰীক্ষাৰ নিয়ম বা অধিসূচনা বিচাৰক...' : 'Search exam rules, CGPA, backlogs...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#B8CFB3] dark:border-[#728E6D] bg-[#FEFAF3] dark:bg-[#15370D] text-xs font-bold text-[#15370D] dark:text-[#FFF2B4] outline-none focus:border-[#84A282]"
          />
        </div>

        {/* University Filter & Category Filter */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <select
            value={selectedUniv}
            onChange={(e) => setSelectedUniv(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-[#B8CFB3] dark:border-[#728E6D] bg-[#FEFAF3] dark:bg-[#15370D] text-xs font-bold text-[#15370D] dark:text-[#FFF2B4] outline-none focus:border-[#84A282] cursor-pointer"
          >
            <option value="All">All Universities (সকলো বিশ্ববিদ্যালয়)</option>
            <option value="Gauhati">Gauhati University (GU)</option>
            <option value="Dibrugarh">Dibrugarh University (DU)</option>
            <option value="Tezpur">Tezpur University (TU)</option>
          </select>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['all', 'Passing Criteria', 'Backlog Rules', 'Grading System', 'Re-evaluation'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all ${
                  activeCategory === cat
                    ? 'bg-[#84A282] text-white shadow-xs'
                    : 'bg-[#FEFAF3] dark:bg-[#15370D] text-[#4F6D4B] dark:text-[#E5CD82] border border-[#B8CFB3] dark:border-[#728E6D]'
                }`}
              >
                {cat === 'all' ? 'All Rules' : cat}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Examination Ordinances Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGuidelines.map((guideline) => (
          <div 
            key={guideline.id}
            className="bg-white dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D] rounded-3xl p-6 sm:p-7 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-xl bg-[#F6E2E9] dark:bg-[#728E6D] text-[#15370D] dark:text-[#FFF2B4] border border-[#B8CFB3] dark:border-[#E5CD82]/40">
                  {guideline.category}
                </span>
                <span className="text-xs font-bold text-[#4F6D4B] dark:text-[#E5CD82] font-mono">
                  {guideline.ordinanceNo}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-black text-[#15370D] dark:text-[#FFF2B4] leading-snug">
                {currentLang === 'as' ? guideline.asTitle : guideline.title}
              </h2>

              <p className="text-xs sm:text-sm text-[#4F6D4B] dark:text-[#E5CD82] leading-relaxed">
                {currentLang === 'as' ? guideline.asSummary : guideline.summary}
              </p>

              {/* Specific Ordinance Bullet Points */}
              <div className="p-3.5 bg-[#FEFAF3] dark:bg-[#15370D] rounded-2xl border border-[#B8CFB3]/60 dark:border-[#728E6D] space-y-1.5">
                <span className="text-[10px] font-black uppercase text-[#84A282] dark:text-[#FFF2B4] block">
                  Statutory Rule Points:
                </span>
                <ul className="space-y-1">
                  {guideline.details.map((point, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs text-[#15370D] dark:text-[#FFF2B4]">
                      <CheckCircleIcon className="w-3.5 h-3.5 text-[#84A282] shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Citation & Action */}
            <div className="pt-3 border-t border-[#B8CFB3]/50 dark:border-[#728E6D]/50 flex items-center justify-between gap-2">
              <div className="flex items-center space-x-1.5 text-[11px] text-[#4F6D4B] dark:text-[#E5CD82]">
                <ShieldCheckIcon className="w-4 h-4 text-[#84A282] shrink-0" />
                <span className="truncate max-w-[200px] sm:max-w-[280px]" title={guideline.citation}>
                  {guideline.citation}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleAskAiAboutExam(guideline.title)}
                className="px-3 py-1.5 rounded-xl text-xs font-black text-[#15370D] dark:text-[#15370D] bg-[#E5CD82] dark:bg-[#FFF2B4] hover:bg-[#d6be73] transition-all cursor-pointer shadow-xs shrink-0 flex items-center space-x-1"
              >
                <span>Ask AI</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

