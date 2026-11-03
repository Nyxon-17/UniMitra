import { universityService } from '../../services/universityService';
import { useState } from 'react';
import { 
  BuildingLibraryIcon, 
  ClipboardDocumentCheckIcon, 
  ShieldCheckIcon, 
  DocumentTextIcon, 
  SparklesIcon, 
  SearchIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '../../components/common/Icons';

export const DashboardFacultyExams = ({ onNavigateTab, currentLang = 'en', studentInfo }) => {
  const univProfile = universityService.getProfile();
  const [selectedUniv, setSelectedUniv] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const facultyExamDirectives = [
    {
      id: 'FAC-EX-01',
      title: 'Confidential Question Paper Setting & Moderation Norms',
      asTitle: 'গোপনীয় প্ৰশ্নকাকত প্ৰস্তুত আৰু মডাৰেচন নিৰ্দেশনা',
      ordinance: 'Statute SEC-7 / GU Academic Council 2023',
      university: 'Gauhati University (GU)',
      category: 'Paper Setting',
      summary: 'Guidelines for internal and external paper setters: submission of two balanced sets in sealed covers with detailed scoring keys and model solutions.',
      asSummary: 'প্ৰশ্নকাকত প্ৰস্তুতকৰ্তাৰ বাবে নিৰ্দেশনা: নিৰ্ধাৰিত সময়ৰ ভিতৰত উত্তৰৰ আৰ্হিসহ দুটা পৃথক প্ৰশ্নৰ চেট ছীল কৰি জমা দিয়া বাধ্যতামূলক।',
      duties: [
        'Prepare 2 complete sets (Set A & Set B) mapped strictly to Course Outcomes (COs).',
        'Provide comprehensive marking scheme and numerical answer key.',
        'Submit in sealed confidential envelope to the Controller of Examinations (CoE) by designated deadline.',
        'Board of Moderators (BOM) reviews balance, syllabus coverage, and removes ambiguity.'
      ],
      citation: 'GU Examination Code of Conduct, Chapter IV, Section 11, Page 52'
    },
    {
      id: 'FAC-EX-02',
      title: 'Continuous Internal Assessment (CIA) & Marks Submission Timelines',
      asTitle: 'আভ্যন্তৰীণ মূল্যায়ন (CIA) নম্বৰ সংৰক্ষণ আৰু দাখিলৰ সময়সীমা',
      ordinance: 'DU/CBCS-DIR/2024/07',
      university: 'Nivoraya University (DU)',
      category: 'Internal Assessment',
      summary: 'Teachers must maintain comprehensive records of sessional tests, assignments, and attendance scores, uploading verified marks to the portal 10 days before end-semester commencement.',
      asSummary: 'শিক্ষকসকলে অন্তিম ষাণ্মাসিক পৰীক্ষা আৰম্ভ হোৱাৰ ১০ দিন পূৰ্বে আভ্যন্তৰীণ মূল্যায়নৰ নম্বৰ প’ৰ্টেলত আপলোড কৰি স্বাক্ষৰিত প্ৰতিলিপি সংৰক্ষণ কৰিব লাগিব।',
      duties: [
        'Conduct 2 mandatory sessional tests and 1 home assignment / seminar per course.',
        'Display raw marks on departmental notice board for student verification before portal lock.',
        'Upload verified scores to the institutional examination portal 10 days prior to end-sem exams.',
        'Retain evaluated answer scripts and sessional records in department for minimum 1 academic year.'
      ],
      citation: 'Nivoraya University CBCS Evaluation Manual, Rule 6(b), Page 19'
    },
    {
      id: 'FAC-EX-03',
      title: 'Answer Script Evaluation, Zonal Centers & Spot Evaluation Statutes',
      asTitle: 'উত্তৰবহী মূল্যায়ন, জ’নেল কেন্দ্ৰ আৰু স্পট নিৰীক্ষণৰ বিধি',
      ordinance: 'TU/EXAM/ZONE/2023-V2',
      university: 'Tezpur University (TU)',
      category: 'Evaluation & Zonal Norms',
      summary: 'Examiners must complete spot evaluation within 14 calendar days, adhering strictly to the model scheme with a maximum daily quota of 30 answer scripts to preserve evaluation rigor.',
      asSummary: 'মূল্যায়নৰ মানদণ্ড বজাই ৰাখিবলৈ এগৰাকী শিক্ষকে দিনটোত সৰ্বাধিক ৩০ খন উত্তৰবহী পৰীক্ষা কৰিব পাৰিব আৰু ১৪ দিনৰ ভিতৰত ফলাফল দাখিল কৰিব লাগিব।',
      duties: [
        'Maximum daily evaluation ceiling: 30 scripts per examiner.',
        'Head Examiner moderates 10% sample of top, average, and failing scripts.',
        'Discrepancies exceeding 10% require mandatory re-checking of the entire batch.',
        'All marks entry done directly into the digital zonal marks sheet.'
      ],
      citation: 'Tezpur University Statutes on Academic Assessment, Clause 18, Page 77'
    },
    {
      id: 'FAC-EX-04',
      title: 'Examiner Remuneration & Invigilation Allowance Statutes',
      asTitle: 'পৰীক্ষকৰ পাৰিতোষিক আৰু নিৰীক্ষকৰ ভাট্টাৰ নিৰিখ',
      ordinance: 'DHE/EXAM/REMUN/2023/12',
      university: 'All State Universities of Assam',
      category: 'Remuneration',
      summary: 'Revised statutory remuneration rates for question paper setting, script evaluation, practical external examination, and superintendent allowances.',
      asSummary: 'প্ৰশ্ন প্ৰস্তুত, উত্তৰবহী মূল্যায়ন, ব্যৱহাৰিক পৰীক্ষা আৰু নিৰীক্ষণৰ চৰকাৰী অনুমোদিত পাৰিতোষিকৰ হাৰ।',
      duties: [
        'Theory Paper Setting: ₹1,800 to ₹2,500 per set based on credit weightage.',
        'Answer Script Evaluation: ₹35 per theory script (UG) / ₹50 (PG).',
        'Practical External Examiner fee: ₹60 per student + conveyance as per state TA/DA norms.',
        'Hall Invigilator allowance: ₹600 per 3-hour examination shift.'
      ],
      citation: 'Assam State Higher Education Gazette Notification, Order 2023/81'
    }
  ];

  const filtered = facultyExamDirectives.filter((d) => {
    const matchesUniv = selectedUniv === 'All' || d.university.includes(selectedUniv) || d.university.includes('All State');
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.citation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesUniv && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="neo-surface rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black tracking-wider uppercase text-[#FF933E] dark:text-[#03C988] dark:text-[#FFFFFF]">
              {currentLang === 'as' ? 'অধ্যাপক আৰু পৰীক্ষক নিৰ্দেশনা' : 'Faculty & Examiner Directives'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#000000] dark:text-[#FFFFFF] tracking-tight">
              {currentLang === 'as' ? 'পৰীক্ষা আৰু মূল্যায়নৰ প্ৰতিষ্ঠানিক বিধি' : 'Examination Guidelines & Evaluation Norms'}
            </h1>
            <p className="text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80 mt-1">
              Confidential paper setting rules, internal assessment recording norms, zonal evaluation guidelines, and remuneration statutes.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab && onNavigateTab('assistant', { prefillQuery: 'What are the official moderation guidelines for university end-semester question paper setting?' })}
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black text-white bg-[#3B2868] hover:bg-[#5b7357] transition-all cursor-pointer shadow-sm shrink-0"
          >
            <SparklesIcon className="w-4 h-4 text-[#FAF8FF]" />
            <span>Consult Faculty AI</span>
          </button>
        </div>
      </div>

      {/* Filter / Search */}
      <div className="neo-surface rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <SearchIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search evaluation norms, paper setting..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#FF933E]/50 dark:border-[#03C988]/50"
          />
        </div>

        <div className="w-full sm:w-auto px-4 py-2.5 rounded-2xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] flex items-center space-x-1.5">
          <span>{univProfile.name || 'Our University'} Examination Authority</span>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => (
          <div 
            key={item.id}
            className="neo-surface rounded-3xl p-6 sm:p-7 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-black uppercase text-[#000000]/80 dark:text-[#FFFFFF]/80">
                  {item.category}
                </span>
                <span className="text-xs font-mono font-bold text-[#000000]/70 dark:text-[#FFFFFF]/80">
                  {item.ordinance}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-black text-[#000000] dark:text-[#FFFFFF]">
                {currentLang === 'as' ? item.asTitle : item.title}
              </h2>

              <p className="text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80">
                {currentLang === 'as' ? item.asSummary : item.summary}
              </p>

              <div className="p-3.5 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] rounded-2xl border border-[#73A5CA]/40/60 dark:border-[#1C82AD]/40 space-y-1.5">
                <span className="text-[10px] font-black uppercase text-[#3B2868] dark:text-[#FFFFFF] block">
                  Mandatory Examiner Directives:
                </span>
                <ul className="space-y-1">
                  {item.duties.map((d, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs text-[#000000] dark:text-[#FFFFFF]">
                      <CheckCircleIcon className="w-3.5 h-3.5 text-[#FF933E] dark:text-[#03C988] shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-[#73A5CA]/40/50 dark:border-[#1C82AD]/40/50 flex items-center justify-between gap-2">
              <div className="flex items-center space-x-1.5 text-[11px] text-[#000000]/70 dark:text-[#FFFFFF]/80">
                <ShieldCheckIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988] shrink-0" />
                <span className="truncate max-w-[240px] font-medium" title={item.citation}>
                  {item.citation}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onNavigateTab && onNavigateTab('assistant', { prefillQuery: `What are the full details and statutes for: ${item.title}?` })}
                className="px-3 py-1.5 rounded-xl text-xs font-black text-white bg-[#3B2868] hover:bg-[#5b7357] transition-all cursor-pointer shadow-xs shrink-0 flex items-center space-x-1"
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

