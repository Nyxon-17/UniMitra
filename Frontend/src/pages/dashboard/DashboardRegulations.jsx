import { useState } from 'react';
import { 
  BuildingLibraryIcon, 
  SearchIcon, 
  SparklesIcon, 
  DocumentTextIcon, 
  CheckCircleIcon, 
  ClipboardDocumentCheckIcon, 
  ChevronDownIcon,
  ShieldCheckIcon
} from '../../components/common/Icons';

export const DashboardRegulations = ({ 
  onNavigateTab, 
  currentLang = 'en'
}) => {
  const [selectedUniversity, setSelectedUniversity] = useState('All Universities');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDoc, setExpandedDoc] = useState('REG-GU-001');

  const universities = [
    'All Universities',
    'Gauhati University (GU)',
    'Dibrugarh University (DU)',
    'Tezpur University (TU)',
    'Cotton University (CU)',
    'Assam University (Silchar)',
    'Bodoland University (BU)'
  ];

  const categories = [
    'All',
    'Examination & Evaluation',
    'Attendance & Condonation',
    'Academic Council Ordinances',
    'Code of Conduct & Anti-Ragging',
    'Degree Passing Criteria (CBCS/NEP)'
  ];

  const regulationsList = [
    {
      id: 'REG-GU-001',
      title: 'Undergraduate CBCS Examination Ordinance & Re-evaluation Regulations',
      asTitle: 'স্নাতক পৰীক্ষা অধিসূচনা আৰু পুনৰমূল্যায়ন নিয়মাৱলী',
      university: 'Gauhati University (GU)',
      category: 'Examination & Evaluation',
      lastUpdated: '18 August 2024',
      ordinanceClause: 'Gazette Ordinance 8.1 - 8.9',
      summary: 'Mandates minimum 40% aggregate in internal sessional and end-semester examinations separately. Provides 20 days window for online re-evaluation script applications.',
      sections: [
        {
          heading: 'Section 8.2: Sessional & End-Semester Thresholds',
          details: 'A candidate must obtain at least 40% marks in In-Semester Internal Assessment (20 marks) and End-Semester final exams (80 marks) separately to earn course credits.'
        },
        {
          heading: 'Section 8.5: Re-evaluation & Script Photocopy Request',
          details: 'Applications for answer script re-evaluation must be submitted within 20 days of online mark sheet declaration with prescribed fees of INR 350 per theory paper.'
        },
        {
          heading: 'Section 8.8: Back Paper Clearance Window',
          details: 'Failed papers in an odd semester can be cleared only in subsequent odd semesters. Maximum permissible duration for 3-year degree completion is 5 academic years (N+2).'
        }
      ],
      pdfSource: 'GU_Examination_Regulations_2024.pdf (Pages 12-28)'
    },
    {
      id: 'REG-DU-002',
      title: 'Statutory Regulations on Class Attendance & Condonation Rules',
      asTitle: 'শ্ৰেণী উপস্থিতি আৰু ৰেহাইৰ বিধিবদ্ধ নিয়মাৱলী',
      university: 'Dibrugarh University (DU)',
      category: 'Attendance & Condonation',
      lastUpdated: '02 July 2024',
      ordinanceClause: 'Academic Ordinance 4.3',
      summary: 'Specifies 75% mandatory class attendance across all enrolled faculties. Authorizes Departmental Heads to condone up to 10% strictly for verified medical grounds.',
      sections: [
        {
          heading: 'Section 4.3.1: Minimum Attendance Obligation',
          details: '75% attendance in theory lectures and lab sessions is mandatory for all students to qualify for issuance of examination admit cards.'
        },
        {
          heading: 'Section 4.3.3: Medical Condonation Protocol',
          details: 'Absence due to illness supported by registered medical officer certificate may be condoned up to 10% (permitting 65% minimum).'
        }
      ],
      pdfSource: 'DU_Attendance_Statutes_Gazette.pdf (Pages 4-9)'
    },
    {
      id: 'REG-TU-003',
      title: 'Tezpur University Academic Council Ordinance on Student Grievance Redressal',
      asTitle: 'ছাত্ৰ অভিযোগ নিবাৰণ আৰু চৌহদ আচৰণ বিধি',
      university: 'Tezpur University (TU)',
      category: 'Code of Conduct & Anti-Ragging',
      lastUpdated: '15 September 2024',
      ordinanceClause: 'Statute 26 (Student Affairs)',
      summary: 'Outlines standard operating procedures for internal complaints committee, institutional ombudsperson, anti-ragging measures, and disciplinary penalties.',
      sections: [
        {
          heading: 'Clause 6: Institutional Ombudsperson Escalation',
          details: 'Students with unresolved academic or facility disputes may file a formal complaint with the university ombudsperson within 15 working days.'
        },
        {
          heading: 'Clause 9: Statutory Anti-Ragging Protocol',
          details: 'Strict zero-tolerance policy in compliance with UGC regulations 2009. Mandatory affidavits required from every scholar and guardian.'
        }
      ],
      pdfSource: 'TU_Academic_Council_Statutes.pdf (Pages 32-45)'
    }
  ];

  const filteredRegulations = regulationsList.filter((reg) => {
    const matchUniv = selectedUniversity === 'All Universities' || reg.university.includes(selectedUniversity.split(' ')[0]);
    const matchCat = selectedCategory === 'All' || reg.category === selectedCategory;
    const matchSearch = !searchQuery.trim() || 
      reg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchUniv && matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-md dark:shadow-[0_0_15px_rgba(176,38,255,0.25)] card-3d">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-black uppercase text-[#FF933E] dark:text-[#03C988] dark:text-[#FFFFFF]">
              <BuildingLibraryIcon className="w-4 h-4" />
              <span>Official University Gazettes & Ordinances</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#000000] dark:text-[#FFFFFF]">
              {currentLang === 'as' ? 'বিশ্ববিদ্যালয় নিয়মাৱলী আৰু অধিসূচনা' : 'University Regulations & Ordinances'}
            </h1>
            <p className="text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80 max-w-2xl leading-relaxed">
              {currentLang === 'as'
                ? 'অসমৰ বিশ্ববিদ্যালয়সমূহৰ পৰীক্ষাৰ মূল্যায়ন, উপস্থিতিৰ চৰ্ত, পুনৰমূল্যায়নৰ মাচুল আৰু আইনী অধিসূচনাসমূহ অন্বেষণ কৰক।'
                : 'Browse verified statutory regulations, attendance rules, re-evaluation guidelines, and academic council ordinances across Assam universities.'}
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('assistant', { prefillQuery: 'Summarize Gauhati and Dibrugarh University examination passing marks and attendance rules.' })}
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl font-black text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-[#000000] transition-all cursor-pointer shadow-xs hover:shadow-md text-xs sm:text-sm shrink-0"
          >
            <SparklesIcon className="w-4 h-4 text-[#FAF8FF]" />
            <span>{currentLang === 'as' ? 'সহায়কক সোধক' : 'Ask AI to Explain'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* University Selector */}
          <div>
            <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
              Select University
            </label>
            <select
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#13005A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none"
            >
              {universities.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
              Regulation Domain
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#13005A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none"
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Keyword Search */}
          <div>
            <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
              Search Clauses
            </label>
            <div className="relative">
              <SearchIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Attendance, re-evaluation, passing..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#13005A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Regulations List */}
      <div className="space-y-4">
        {filteredRegulations.map((reg) => {
          const isExpanded = expandedDoc === reg.id;
          return (
            <div
              key={reg.id}
              className="bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 rounded-3xl overflow-hidden shadow-xs transition-all"
            >
              <div 
                onClick={() => setExpandedDoc(isExpanded ? '' : reg.id)}
                className="p-5 sm:p-6 cursor-pointer hover:bg-[#E0D4FD]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] text-white">
                      {reg.university}
                    </span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#FFE9A9] dark:bg-[#13005A] text-[#000000] dark:text-[#FFFFFF] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40">
                      {reg.category}
                    </span>
                    <span className="text-[10px] text-[#000000]/70 dark:text-[#FFFFFF]/80 font-semibold">
                      Updated: {reg.lastUpdated}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-[#000000] dark:text-[#FFFFFF] pt-1">
                    {currentLang === 'as' ? reg.asTitle : reg.title}
                  </h3>
                  <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80">
                    {reg.summary}
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className="text-xs font-black text-[#FF933E] dark:text-[#03C988] dark:text-[#FFFFFF]">
                    {isExpanded ? 'Hide Clauses' : 'View Clauses'}
                  </span>
                  <div className={`w-8 h-8 rounded-xl bg-[#FFE9A9]/20 dark:bg-[#13005A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 flex items-center justify-center text-[#FF933E] dark:text-[#03C988] dark:text-[#FFFFFF] transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                    <ChevronDownIcon className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-[#73A5CA]/40/40 dark:border-[#1C82AD]/40 space-y-4 bg-[#FFE9A9]/20/50 dark:bg-[#13005A]/40">
                  <div className="space-y-3 pt-2">
                    {reg.sections.map((sec, sidx) => (
                      <div key={sidx} className="p-4 rounded-2xl bg-white dark:bg-[#00337C] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 space-y-1">
                        <h4 className="text-xs sm:text-sm font-black text-[#000000] dark:text-[#FFFFFF]">
                          {sec.heading}
                        </h4>
                        <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80 leading-relaxed">
                          {sec.details}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[#73A5CA]/40/40 dark:border-[#1C82AD]/40 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-2 text-[#000000]/70 dark:text-[#FFFFFF]/80">
                      <DocumentTextIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988]" />
                      <span className="font-bold">Original Citation: {reg.pdfSource}</span>
                    </div>
                    <button
                      onClick={() => onNavigateTab('assistant', { prefillQuery: `What are the details of ${reg.title}?` })}
                      className="text-xs font-black text-[#FF933E] dark:text-[#03C988] dark:text-[#FFFFFF] hover:underline cursor-pointer flex items-center space-x-1"
                    >
                      <SparklesIcon className="w-3.5 h-3.5" />
                      <span>Ask AI Questions on this Document ➔</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

