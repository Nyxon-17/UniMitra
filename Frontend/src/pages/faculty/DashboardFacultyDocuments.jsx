import { useState } from 'react';
import { 
  BuildingLibraryIcon, 
  DocumentTextIcon, 
  ShieldCheckIcon, 
  SearchIcon, 
  EyeIcon, 
  SparklesIcon, 
  ArrowRightIcon, 
  CheckCircleIcon,
  XMarkIcon
} from '../../components/common/Icons';

export const DashboardFacultyDocuments = ({ onNavigateTab, currentLang = 'en' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalDoc, setActiveModalDoc] = useState(null);

  const facultyDocuments = [
    {
      id: 'FAC-DOC-01',
      title: 'UGC Regulations on Minimum Qualifications for Appointment & CAS Promotion (2018 Amended)',
      asTitle: 'ইউজিচি কেৰিয়াৰ এডভান্সমেণ্ট স্কিম (CAS) আৰু পদোন্নতিৰ নিয়মাৱলী',
      category: 'CAS Promotion & API',
      university: 'All Universities of Assam',
      refNo: 'UGC/REG/CAS/2018-AMEND-23',
      date: '18 July 2023',
      pages: 114,
      fileSize: '4.8 MB',
      verified: true,
      summary: 'Statutory criteria for Career Advancement Scheme (CAS) promotion from Assistant Professor (Stage 1 to Stage 2, 3) to Associate Professor and Professor. Details Annual Performance Assessment Reports (APAR) and PBAS methodology.',
      keyPoints: [
        'Research publications in UGC-CARE Listed / Scopus Journals.',
        'Assessment period: 4 years (with PhD) / 5 years (with MPhil) / 6 years (without).',
        'Mandatory Orientation / Faculty Induction Programme (FIP) and 1 Refresher Course.',
        'Screening-cum-Evaluation Committee grading criteria (Satisfactory / Good).'
      ],
      citation: 'UGC Notification No. F.1-2/2017, Appendix II, Table 1, Page 68'
    },
    {
      id: 'FAC-DOC-02',
      title: 'Faculty Workload Norms & Teaching-Learning Allocation Statutes',
      asTitle: 'অধ্যাপকৰ সাপ্তাহিক কৰ্মভাৰ আৰু পাঠদানৰ চৰকাৰী মানদণ্ড',
      category: 'Workload & Service',
      university: 'Gauhati University (GU)',
      categoryCode: 'WORKLOAD-09',
      refNo: 'GU/REG/ESTT/2023/502',
      date: '12 January 2024',
      pages: 28,
      fileSize: '1.9 MB',
      verified: true,
      summary: 'Prescribed direct teaching hours per week across academic ranks: 16 hours for Assistant Professors and 14 hours for Associate Professors and Professors, plus research and mentoring hours.',
      keyPoints: [
        'Assistant Professor: 16 direct teaching hours per week.',
        'Associate Professor & Professor: 14 direct teaching hours per week.',
        'A relaxation of 2 hours per week allowed for teachers actively guiding at least 3 PhD scholars.',
        'Total institutional engagement requirement: 40 hours per 5-day academic week.'
      ],
      citation: 'Gauhati University Academic Service Statutes, Clause 14.1, Page 12'
    },
    {
      id: 'FAC-DOC-03',
      title: 'Regulations Governing PhD Degree & Research Supervision Ordinances',
      asTitle: 'পিএইচ.ডি. গৱেষণা আৰু তত্ত্বাবধানৰ চৰকাৰী বিধিমলা',
      category: 'Research & PhD',
      university: 'Dibrugarh University (DU)',
      refNo: 'DU/ACAD/PHD-ORD/2023/88',
      date: '05 September 2023',
      pages: 56,
      fileSize: '3.1 MB',
      verified: true,
      summary: 'Eligibility for recognition as Research Supervisor, maximum permissible scholar allocation per faculty member, and doctoral committee review protocols.',
      keyPoints: [
        'Professor: Maximum 8 registered PhD scholars at any given time.',
        'Associate Professor: Maximum 6 registered PhD scholars.',
        'Assistant Professor (with PhD & minimum 3 peer-reviewed papers): Maximum 4 scholars.',
        'Mandatory 6-month pre-registration course work (minimum 12 credits).'
      ],
      citation: 'Dibrugarh University Research Council Ordinances, Section 9, Page 22'
    },
    {
      id: 'FAC-DOC-04',
      title: 'Sabbatical, Study Leave & Duty Leave Statues for Academic Staff',
      asTitle: 'অধ্যয়ন আৰু ছাবাটিকল ছুটীৰ বিশ্ববিদ্যালয় নিয়মাৱলী',
      category: 'Workload & Service',
      university: 'Tezpur University (TU)',
      refNo: 'TU/ESTT/LEAVE/2024/02',
      date: '28 February 2024',
      pages: 42,
      fileSize: '2.4 MB',
      verified: true,
      summary: 'Rules governing grant of Sabbatical Leave for research, post-doctoral fellowships, national conference duty leave, and patent preparation leave.',
      keyPoints: [
        'Sabbatical Leave: Up to 1 continuous year after minimum 6 years of substantive service.',
        'Study Leave: Maximum 3 years across full service for PhD completion or postdoctoral research.',
        'Duty Leave: Up to 30 days per academic calendar year for conference/symposium presentation.',
        'Full pay and allowances protected during approved sabbatical leave.'
      ],
      citation: 'Tezpur University Leave Code, Ordinance No. 21, Page 35'
    }
  ];

  const filteredDocs = facultyDocuments.filter((doc) => {
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.refNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-white dark:bg-[#150F2C] border-2 border-[#E0D4FD] dark:border-[#3B2868] rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black tracking-wider uppercase text-[#6D28D9] dark:text-[#FAF8FF]">
              {currentLang === 'as' ? 'অনুমোদিত প্ৰতিষ্ঠানিক সংগ্ৰহালয়' : 'Authorized Institutional Repository'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1E1035] dark:text-[#FAF8FF] tracking-tight">
              {currentLang === 'as' ? 'অধ্যাপক আৰু শৈক্ষিক নথিপত্ৰ ভাণ্ডাৰ' : 'Authorized Faculty Documents & Statutes'}
            </h1>
            <p className="text-xs sm:text-sm text-[#555375] dark:text-[#C4B5FD] mt-1">
              Statutory gazettes, UGC Career Advancement Scheme (CAS) guidelines, PhD supervision limits, and workload ordinances.
            </p>
          </div>

          <div className="shrink-0 flex items-center space-x-2">
            <span className="text-xs font-black px-3.5 py-1.5 rounded-xl bg-[#DDD6FE] dark:bg-[#3B2868] text-[#1E1035] dark:text-[#FAF8FF]">
              {facultyDocuments.length} Verified Gazettes
            </span>
          </div>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white dark:bg-[#150F2C] border-2 border-[#E0D4FD] dark:border-[#3B2868] rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <SearchIcon className="w-4 h-4 text-[#6D28D9] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search CAS, API scores, PhD rules, workload..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0A0718] text-xs font-bold text-[#1E1035] dark:text-[#FAF8FF] outline-none focus:border-[#6D28D9]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['All', 'CAS Promotion & API', 'Workload & Service', 'Research & PhD'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#4C1D95] text-white shadow-xs'
                  : 'bg-[#FAF8FF] dark:bg-[#0A0718] text-[#555375] dark:text-[#C4B5FD] border border-[#E0D4FD] dark:border-[#3B2868]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDocs.map((doc) => (
          <div 
            key={doc.id}
            className="bg-white dark:bg-[#150F2C] border-2 border-[#E0D4FD] dark:border-[#3B2868] rounded-3xl p-6 sm:p-7 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-xl bg-[#DDD6FE] dark:bg-[#3B2868] text-[#1E1035] dark:text-[#FAF8FF]">
                  {doc.category}
                </span>
                <span className="text-xs font-mono font-bold text-[#555375] dark:text-[#C4B5FD]">
                  {doc.refNo}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-black text-[#1E1035] dark:text-[#FAF8FF]">
                {currentLang === 'as' ? doc.asTitle : doc.title}
              </h2>

              <p className="text-xs sm:text-sm text-[#555375] dark:text-[#C4B5FD]">
                {doc.summary}
              </p>

              <div className="p-3 bg-[#FAF8FF] dark:bg-[#0A0718] rounded-2xl border border-[#E0D4FD]/60 dark:border-[#3B2868] space-y-1 text-xs">
                <span className="text-[10px] font-black uppercase text-[#6D28D9] dark:text-[#FAF8FF] block">
                  Core Statutory Provisions:
                </span>
                <ul className="space-y-0.5">
                  {doc.keyPoints.slice(0, 3).map((kp, idx) => (
                    <li key={idx} className="flex items-start space-x-1.5 text-[11px] text-[#1E1035] dark:text-[#FAF8FF]">
                      <span className="text-[#6D28D9]">•</span>
                      <span>{kp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E0D4FD]/50 dark:border-[#3B2868]/50 flex items-center justify-between gap-2">
              <div className="flex items-center space-x-1.5 text-[11px] text-[#555375] dark:text-[#C4B5FD]">
                <ShieldCheckIcon className="w-4 h-4 text-[#6D28D9] shrink-0" />
                <span className="truncate max-w-[200px]" title={doc.citation}>
                  {doc.citation}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveModalDoc(doc)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold border border-[#E0D4FD] dark:border-[#3B2868] hover:bg-[#E0D4FD]/20 text-[#1E1035] dark:text-[#FAF8FF] cursor-pointer flex items-center space-x-1"
                >
                  <EyeIcon className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateTab && onNavigateTab('assistant', { prefillQuery: `What are the criteria and provisions of: ${doc.title}?` })}
                  className="px-3 py-1.5 rounded-xl text-xs font-black text-white bg-[#6D28D9] hover:bg-[#3B2868] transition-all cursor-pointer shadow-xs flex items-center space-x-1"
                >
                  <span>Ask AI</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Inspect Document Modal */}
      {activeModalDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FAF8FF] dark:bg-[#150F2C] border-2 border-[#E0D4FD] dark:border-[#3B2868] rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E0D4FD] dark:border-[#3B2868] pb-3">
              <div className="flex items-center space-x-2">
                <DocumentTextIcon className="w-5 h-5 text-[#6D28D9]" />
                <span className="text-xs font-mono font-bold text-[#6D28D9] dark:text-[#FAF8FF]">{activeModalDoc.refNo}</span>
              </div>
              <button
                onClick={() => setActiveModalDoc(null)}
                className="p-1 rounded-lg text-[#555375] hover:text-[#1E1035] dark:text-[#C4B5FD] dark:hover:text-[#FAF8FF] cursor-pointer"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-lg font-black text-[#1E1035] dark:text-[#FAF8FF]">{activeModalDoc.title}</h3>
            
            <p className="text-xs sm:text-sm text-[#555375] dark:text-[#C4B5FD] leading-relaxed">
              {activeModalDoc.summary}
            </p>

            <div className="space-y-2 p-4 bg-white dark:bg-[#0A0718] rounded-2xl border border-[#E0D4FD] dark:border-[#3B2868]">
              <span className="text-xs font-black uppercase text-[#6D28D9] block">Verified Statutes & Ordinances</span>
              <ul className="space-y-1.5">
                {activeModalDoc.keyPoints.map((pt, i) => (
                  <li key={i} className="flex items-start space-x-2 text-xs text-[#1E1035] dark:text-[#FAF8FF]">
                    <CheckCircleIcon className="w-4 h-4 text-[#6D28D9] shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-[#E0D4FD]/25 dark:bg-[#0A0718] rounded-xl text-xs text-[#555375] dark:text-[#C4B5FD]">
              <strong>Exact Citation Source:</strong> {activeModalDoc.citation}
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  const doc = activeModalDoc;
                  setActiveModalDoc(null);
                  if (onNavigateTab) {
                    onNavigateTab('assistant', { prefillQuery: `Explain the detailed clauses in: ${doc.title}` });
                  }
                }}
                className="px-4 py-2 rounded-xl text-xs font-black text-white bg-[#6D28D9] hover:bg-[#3B2868] cursor-pointer shadow-xs"
              >
                Ask Assistant About This Document
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

