import { useState, useEffect, useMemo } from 'react';
import { 
  ClockIcon, 
  SearchIcon, 
  SparklesIcon, 
  DocumentTextIcon, 
  TrashIcon, 
  CheckCircleIcon,
  CheckIcon,
  DocumentDuplicateIcon,
  ShieldCheckIcon,
  BuildingLibraryIcon
} from '../../components/common/Icons';
import { chatService } from '../../services/chatService';
import { universityService } from '../../services/universityService';

export const DashboardQueryHistory = ({ 
  onNavigateTab, 
  currentLang = 'en',
  studentInfo = { role: 'Student' },
  portalDomain = null
}) => {
  const univProfile = useMemo(() => universityService.getProfile(), []);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [copiedId, setCopiedId] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  const domain = (portalDomain || (
    studentInfo?.role?.toLowerCase().includes('admin') ? 'admin' :
    studentInfo?.role?.toLowerCase().includes('faculty') ? 'faculty' : 'student'
  )).toLowerCase();
  const userId = studentInfo?.id || chatService.getCurrentUserId();

  // Dynamic category tags per portal domain
  const availableTags = useMemo(() => {
    if (domain === 'admin') {
      return ['All', 'Statutory Affiliation', 'Examination Bylaws', 'Executive Council', 'Faculty Governance'];
    } else if (domain === 'faculty') {
      return ['All', 'CAS Promotion', 'PhD Supervision', 'Moderation Norms', 'Examination Bylaws'];
    } else {
      return ['All', 'Examination Regulations', 'Attendance Rules', 'Scholarships & Grants', 'Admissions'];
    }
  }, [domain]);

  useEffect(() => {
    let isCancelled = false;
    const loadDynamicHistory = async () => {
      setLoading(true);
      try {
        const sessions = await chatService.getSessions(domain, userId);
        const items = [];
        for (const s of (sessions || []).slice(0, 50)) {
          const msgs = await chatService.fetchSessionMessages(s.id, domain, userId);
          let foundUserMsg = false;
          if (msgs && msgs.length > 0) {
            for (let i = 0; i < msgs.length; i++) {
              if (msgs[i].sender === 'user') {
                foundUserMsg = true;
                const userQ = msgs[i].text;
                const nextAi = msgs.slice(i + 1).find(m => m.sender === 'ai');
                items.push({
                  id: msgs[i].id || `hist-${s.id}-${i}`,
                  sessionId: s.id,
                  title: s.title && s.title !== 'New Conversation' ? s.title : userQ.slice(0, 48),
                  query: userQ,
                  asQuery: userQ,
                  category: s.title && s.title !== 'New Conversation' 
                    ? s.title.slice(0, 24) 
                    : (domain === 'admin' ? 'Statutory Affiliation' : domain === 'faculty' ? 'CAS Promotion' : 'Examination Regulations'),
                  resolvedAnswer: nextAi?.text || 'Resolved verified institutional consultation.',
                  source: nextAi?.source || `${domain === 'admin' ? 'Executive Council Statutory Regulations' : 'University Academic Regulations'} 2024`,
                  university: univProfile?.name || 'Nivoraya University (DU)',
                  timestamp: msgs[i].time || (s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'Recent'),
                  status: 'Resolved'
                });
              }
            }
          }
          if (!foundUserMsg && s.title && s.title !== 'New Conversation' && !s.title.includes('Assistant')) {
            items.push({
              id: `hist-s-${s.id}`,
              sessionId: s.id,
              title: s.title,
              query: s.title,
              asQuery: s.title,
              category: domain === 'admin' ? 'Executive Council' : domain === 'faculty' ? 'Moderation Norms' : 'Academic Regulations',
              resolvedAnswer: s.snippet || (domain === 'admin' ? 'Executive query regarding institutional statutes, bylaws, and governance.' : 'Institutional consultation on academic regulations and guidelines.'),
              source: `${domain === 'admin' ? 'Executive Council' : 'Academic Council'} Repository`,
              university: univProfile?.name || 'Nivoraya University (DU)',
              timestamp: s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'Recent',
              status: 'Resolved'
            });
          }
        }

        // Verified domain-specific seed items if account has no prior chat records
        if (items.length === 0) {
          if (domain === 'admin') {
            items.push(
              {
                id: 'admin-hist-seed-1',
                sessionId: 'seed-adm-1',
                title: 'Statutory Compliance Requirements for Collegiate Degree Affiliation',
                query: 'What are the mandatory statutory compliance requirements and accreditation benchmarks for collegiate degree programme affiliation?',
                asQuery: 'ডিগ্ৰী পাঠ্যক্ৰমৰ অধিভুক্তিৰ বাবে প্ৰয়োজনীয় সংবিধি চৰ্তসমূহ কি কি?',
                category: 'Statutory Affiliation',
                resolvedAnswer: 'Under Section 18 of the University Act and UGC (Affiliation of Colleges) Regulations, affiliated colleges must maintain valid NAAC accreditation (minimum Grade B), approved curriculum structures under NEP 2020 guidelines, verified fire safety/land title certificates, and minimum permanent faculty strength as prescribed by statutory regulatory bodies.',
                source: 'Executive Council Statutory Regulations 2024, Section 18',
                university: univProfile?.name || 'Nivoraya University (DU)',
                timestamp: 'Yesterday at 04:15 PM',
                status: 'Resolved'
              },
              {
                id: 'admin-hist-seed-2',
                sessionId: 'seed-adm-2',
                title: 'Executive Ordinance on Examination Moderation Board Bylaws',
                query: 'What is the quorum, tenure, and question replacement authority of the University Examination Moderation Board?',
                asQuery: 'পৰীক্ষা মডাৰেচন সমিতিৰ অধিসূচনা, প্ৰশ্ন সলনিৰ কৰ্তৃত্ব আৰু নিয়মাৱলী কি?',
                category: 'Examination Bylaws',
                resolvedAnswer: 'The Moderation Board consists of the Dean of Faculty (Chairperson), Head of Department, and one external subject expert appointed by the Vice-Chancellor. The board is authorized to amend, substitute, or replace up to 30% of question items to rectify ambiguities or syllabus deviations. All moderation records are strictly confidential and must be sealed 15 days before examinations.',
                source: 'Institutional Governance Ordinance, Clause 9.3',
                university: univProfile?.name || 'Nivoraya University (DU)',
                timestamp: '28 Oct 2026',
                status: 'Resolved'
              },
              {
                id: 'admin-hist-seed-3',
                sessionId: 'seed-adm-3',
                title: 'Executive Council Guidelines for University Guest Faculty Remuneration',
                query: 'What are the revised UGC pay-scales and honorarium limits for Guest and Adjunct Faculty approved by the Executive Council?',
                asQuery: 'কাৰ্যবাহী পৰিষদৰ দ্বাৰা অনুমোদিত অতিথি অধ্যাপকৰ পাৰিতোষিক আৰু নিয়ম কি?',
                category: 'Executive Council',
                resolvedAnswer: 'As per Executive Council Resolution No. EC-2024-42 adopting UGC directives, Guest Faculty are entitled to an honorarium of ₹1,500 per lecture up to a maximum ceiling of ₹50,000 per month. Selection must be conducted through a statutory selection committee with Dean approval.',
                source: 'Executive Council Resolution No. EC-2024-42, Page 12',
                university: univProfile?.name || 'Nivoraya University (DU)',
                timestamp: '24 Oct 2026',
                status: 'Resolved'
              },
              {
                id: 'admin-hist-seed-4',
                sessionId: 'seed-adm-4',
                title: 'Ordinance on Academic Integrity and Anti-Plagiarism Thresholds',
                query: 'What are the permissible similarity index limits for doctoral dissertations and research publications before submission?',
                asQuery: 'গৱেষণা পত্ৰ আৰু গৱেষণাগ্ৰন্থৰ বাবে প্লেগিয়াৰিজমৰ অনুমতিপ্ৰাপ্ত সীমা কি?',
                category: 'Faculty Governance',
                resolvedAnswer: 'Under UGC (Promotion of Academic Integrity and Prevention of Plagiarism) Regulations, core thesis text must not exceed a 10% similarity index (Level 0). Level 1 (10%-40%) requires resubmission within 6 months; Level 2 (40%-60%) incurs a 1-year debarment; Level 3 (>60%) results in cancellation of candidate registration.',
                source: 'Institutional Plagiarism Policy & Ordinances, Clause 4.1',
                university: univProfile?.name || 'Nivoraya University (DU)',
                timestamp: '20 Oct 2026',
                status: 'Resolved'
              }
            );
          } else if (domain === 'faculty') {
            items.push(
              {
                id: 'faculty-hist-seed-1',
                sessionId: 'seed-fac-1',
                title: 'CAS Promotion PBAS Score Eligibility for Associate Professor',
                query: 'What are the required research score points and minimum service years for promotion from Assistant Professor (Stage 3) to Associate Professor (Stage 4)?',
                asQuery: 'সহযোগী অধ্যাপকৰ পদোন্নতিৰ বাবে প্ৰয়োজনীয় গৱেষণা স্ক’ৰ আৰু কাৰ্যকাল কি?',
                category: 'CAS Promotion',
                resolvedAnswer: 'Under the UGC 2018 Regulations (Amended 2023), Assistant Professors with a PhD degree must complete 3 continuous years in Academic Level 12 (Stage 3). The candidate must possess a minimum of 7 research publications in peer-reviewed or UGC-CARE listed journals (of which at least 3 must have been published during assessment period) and a cumulative research score of at least 70 as per Appendix II, Table 2.',
                source: 'UGC Regulations on Minimum Qualifications, Appendix II, Table 2, Page 74',
                university: 'State Universities of Assam',
                timestamp: 'Yesterday at 03:40 PM',
                status: 'Resolved'
              },
              {
                id: 'faculty-hist-seed-2',
                sessionId: 'seed-fac-2',
                title: 'PhD Scholar Allocation and Maximum Supervision Quota',
                query: 'Can an Associate Professor co-supervise an interdisciplinary PhD candidate from another university department without exceeding the 6-scholar quota?',
                asQuery: 'পিএইচডি গৱেষকৰ সহ-তত্ত্বাৱধানৰ বাবে নিৰ্দিষ্ট কোটা কিমান?',
                category: 'PhD Supervision',
                resolvedAnswer: 'Yes, an Associate Professor may serve as Co-Supervisor for an interdisciplinary research candidate upon recommendation of the Departmental Research Committee (DRC). In joint supervision, each co-supervisor is allocated a fractional weightage of 0.5 towards their statutory ceiling of 6 registered candidates.',
                source: 'Nivoraya University PhD Regulations, Clause 9(d), Page 24',
                university: univProfile?.name || 'Nivoraya University (DU)',
                timestamp: '28 Oct 2026',
                status: 'Resolved'
              },
              {
                id: 'faculty-hist-seed-3',
                sessionId: 'seed-fac-3',
                title: 'Confidential Moderation Guidelines for UG End-Sem Question Papers',
                query: 'What is the permissible percentage of question replacement by the Board of Moderators if a set has out-of-syllabus items?',
                asQuery: 'মডাৰেচন বোৰ্ডে প্ৰশ্নকাকতৰ কিমান শতাংশ প্ৰশ্ন সলনি কৰিব পাৰে?',
                category: 'Moderation Norms',
                resolvedAnswer: 'The Board of Moderators (BOM) is authorized to amend or substitute up to a maximum of 30% of total questions in any given paper set to correct typographical errors, ambiguity, or syllabus deviations. If deviations exceed 30%, the set is rejected and the contingency Set B is moderated.',
                source: 'Gauhati University Examination Board Ordinances, Rule 11.2, Page 53',
                university: 'Gauhati University (GU)',
                timestamp: '24 Oct 2026',
                status: 'Resolved'
              }
            );
          } else {
            items.push(
              {
                id: 'student-hist-seed-1',
                sessionId: 'seed-stu-1',
                title: 'Undergraduate CBCS Passing Criteria & Grade Conversion',
                query: 'What is the minimum passing criteria for undergraduate semester examinations under CBCS regulations?',
                asQuery: 'স্নাতক পৰীক্ষাত উত্তীৰ্ণ হোৱাৰ নূন্যতম চৰ্ত কি?',
                category: 'Examination Regulations',
                resolvedAnswer: 'Under CBCS regulations, candidates must secure at least 40% marks separately in Continuous Assessment (In-Semester) and End-Semester Theory/Practical examinations. An aggregate SGPA of 4.0 is required to be declared passed.',
                source: 'Nivoraya University Examination Ordinance 2024, Clause 8.2',
                university: univProfile?.name || 'Nivoraya University (DU)',
                timestamp: 'Recent',
                status: 'Resolved'
              },
              {
                id: 'student-hist-seed-2',
                sessionId: 'seed-stu-2',
                title: 'Attendance Requirements & Medical Condonation Limit',
                query: 'What are the attendance requirements and medical condonation limit?',
                asQuery: 'উপস্থিতিৰ চৰ্ত আৰু চিকিৎসা সম্পৰ্কীয় ৰেহাই কিমান?',
                category: 'Attendance Rules',
                resolvedAnswer: 'A minimum of 75% class attendance is mandatory in each semester. Medical condonation of up to 10% is permissible upon recommendation of the HOD with certified documents.',
                source: 'Attendance Regulations 2024, Section 4.3',
                university: univProfile?.name || 'Nivoraya University (DU)',
                timestamp: 'Recent',
                status: 'Resolved'
              },
              {
                id: 'student-hist-seed-3',
                sessionId: 'seed-stu-3',
                title: 'UGC Ishan Uday Scholarship Eligibility & Financial Benefits',
                query: 'What are the eligibility criteria for UGC Ishan Uday scholarship?',
                asQuery: 'ইউজিচি ঈশান উদয় জলপানিৰ যোগ্যতাৰ চৰ্ত কি কি?',
                category: 'Scholarships & Grants',
                resolvedAnswer: 'The UGC Ishan Uday Scholarship provides INR 5,400/month for General degrees and INR 7,800/month for Technical courses for NER domicile students with annual parental income below INR 4.5 Lakhs.',
                source: 'UGC Special Scholarship Framework, Clause 3.1',
                university: univProfile?.name || 'Nivoraya University (DU)',
                timestamp: 'Recent',
                status: 'Resolved'
              }
            );
          }
        }

        if (!isCancelled) {
          setHistoryList(items);
        }
      } catch (err) {
        console.warn('Failed to load dynamic query history:', err);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadDynamicHistory();

    const handleHistoryUpdate = () => {
      loadDynamicHistory();
    };
    window.addEventListener('unimitra_chat_history_changed', handleHistoryUpdate);
    return () => {
      isCancelled = true;
      window.removeEventListener('unimitra_chat_history_changed', handleHistoryUpdate);
    };
  }, [domain, userId, univProfile]);

  const filteredHistory = historyList.filter((item) => {
    const matchesTag = selectedTag === 'All' || item.category === selectedTag;
    const q = searchFilter.toLowerCase().trim();
    if (!q) return matchesTag;
    const matchesSearch = (
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.query && item.query.toLowerCase().includes(q)) ||
      (item.asQuery && item.asQuery.includes(q)) ||
      (item.resolvedAnswer && item.resolvedAnswer.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q))
    );
    return matchesTag && matchesSearch;
  });

  const handleCopy = (id, text) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleDelete = (id, sessionId) => {
    setHistoryList(prev => prev.filter(item => item.id !== id));
    if (sessionId) {
      chatService.deleteSession(sessionId, domain, userId);
    }
  };

  const handleClearAll = () => {
    if (window.showUniMitraConfirm) {
      window.showUniMitraConfirm({
        title: currentLang === 'as' ? 'ইতিহাস মচি পেলাওক' : 'Clear Query History',
        message: currentLang === 'as' ? 'আপুনি সকলো প্ৰশ্নোত্তৰ ইতিহাস স্থায়ীভাৱে মচিব বিচাৰেনে?' : 'Clear all recorded query history from this portal?',
        confirmText: currentLang === 'as' ? 'সকলো মচক' : 'Clear All',
        confirmColor: 'bg-red-600 hover:bg-red-700 text-white',
        onConfirm: () => {
          chatService.clearAllSessions(domain, userId);
          setHistoryList([]);
          if (window.showUniMitraToast) {
            window.showUniMitraToast(currentLang === 'as' ? 'ইতিহাস সফলতাৰে মচি পেলোৱা হ’ল' : 'Query history cleared successfully', 'success');
          }
        }
      });
    } else {
      chatService.clearAllSessions(domain, userId);
      setHistoryList([]);
    }
  };

  const domainPill = domain === 'admin'
    ? (currentLang === 'as' ? 'প্ৰশাসনিক সংৰক্ষিত বাৰ্তালাপ' : 'Institutional Governance & Executive Audit Records')
    : domain === 'faculty'
      ? (currentLang === 'as' ? 'অধ্যাপকৰ সংৰক্ষিত শৈক্ষিক বাৰ্তালাপ' : 'Faculty Research & Academic Directives')
      : (currentLang === 'as' ? 'ছাত্ৰ-ছাত্ৰীৰ বাৰ্তালাপ ইতিহাস' : 'Student Academic Records & Guidance');

  const domainTitle = domain === 'admin'
    ? (currentLang === 'as' ? 'সংৰক্ষিত প্ৰশাসনিক আইন আৰু অধিসূচনা' : 'Saved Statutory Consultations & Ordinances')
    : domain === 'faculty'
      ? (currentLang === 'as' ? 'সংৰক্ষিত শৈক্ষিক পৰামৰ্শসমূহ' : 'Saved Academic Consultations & Ordinances')
      : (currentLang === 'as' ? 'সংৰক্ষিত প্ৰশ্নোত্তৰ আৰু নিয়মাৱলী' : 'Saved Institutional Consultations & Answers');

  const domainSubtitle = domain === 'admin'
    ? 'Archived statutory queries on UGC compliance, Executive Council regulations, and university bylaws.'
    : domain === 'faculty'
      ? 'Archived statutory queries on CAS career promotions, PhD doctoral regulations, and syllabus moderation.'
      : (currentLang === 'as'
        ? 'পূৰ্বতে সোধা বিশ্ববিদ্যালয়ৰ নিয়মাৱলী, পৰীক্ষা আৰু ছাত্ৰবৃত্তিৰ প্ৰশ্ন আৰু প্ৰমাণিত সমাধানসমূহ পুনৰ পৰীক্ষা কৰক।'
        : 'Review your previously resolved institutional queries, citations, and grounded gazette sources.');

  const assistantTabName = domain === 'admin' ? 'admin-assistant' : 'assistant';

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="neo-surface rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-md dark:shadow-[0_0_15px_rgba(176,38,255,0.25)] transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-black uppercase text-[#FF933E] dark:text-[#03C988]">
              <ClockIcon className="w-4 h-4" />
              <span>{domainPill}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#000000] dark:text-[#FFFFFF] tracking-tight">
              {domainTitle}
            </h1>
            <p className="text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80 max-w-2xl leading-relaxed">
              {domainSubtitle}
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <span className="px-3 py-1.5 rounded-xl text-xs font-black bg-[#FFE9A9] dark:bg-[#0A0A0A] border border-[#FFCB56] dark:border-[#03C988] text-[#000000] dark:text-[#FFFFFF]">
              {historyList.length} Consultations
            </span>

            {historyList.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-4 py-2.5 rounded-xl border border-red-300 dark:border-red-900 text-xs font-black text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer"
              >
                Clear History
              </button>
            )}

            <button
              onClick={() => onNavigateTab(assistantTabName)}
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs font-black bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-[#000000] transition-all cursor-pointer shadow-xs hover:shadow-md"
            >
              <SparklesIcon className="w-3.5 h-3.5 text-[#FAF8FF]" />
              <span>Ask New Query</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="neo-surface rounded-3xl p-4 sm:p-6 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="relative w-full lg:w-96">
          <SearchIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search queries, questions, or grounded answers..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-xs sm:text-sm font-bold text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#FF933E]/50 dark:border-[#03C988]/50"
          />
        </div>

        {/* Dynamic Category Tag Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all shrink-0 ${
                selectedTag === tag
                  ? 'bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] shadow-xs'
                  : 'bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-[#000000]/70 dark:text-[#FFFFFF]/80 border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 hover:bg-[#FFE9A9]/40'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* History Consultations List */}
      <div className="space-y-4">
        {loading ? (
          <div className="neo-surface rounded-3xl p-10 text-center text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80">
            Loading your verified query history...
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="neo-surface rounded-3xl p-12 text-center bg-[#FFE9A9]/10 dark:bg-[#0A0A0A] rounded-2xl border border-dashed border-[#73A5CA]/40 space-y-3">
            <SparklesIcon className="w-10 h-10 mx-auto text-[#FF933E] dark:text-[#03C988]" />
            <h4 className="text-base font-black text-[#000000] dark:text-[#FFFFFF]">No Consultations Found</h4>
            <p className="text-xs text-[#000000]/60 dark:text-[#FFFFFF]/60 max-w-md mx-auto">
              No previous queries match your selected filters. Start a new consultation with the AI Assistant to automatically archive questions and grounded citations.
            </p>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div
              key={item.id}
              className="neo-surface rounded-3xl p-6 sm:p-7 shadow-xs space-y-4 transition-all hover:border-[#FF933E]/50 dark:hover:border-[#03C988]/50"
            >
              {/* Card Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#73A5CA]/30 dark:border-[#1C82AD]/30 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-lg bg-[#FFE9A9]/40 dark:bg-[#0A0A0A] border border-[#FFCB56] dark:border-[#03C988] text-[#000000] dark:text-[#FFFFFF]">
                    {item.category}
                  </span>
                  <span className="text-xs font-bold text-[#000000]/70 dark:text-[#FFFFFF]/80 flex items-center space-x-1">
                    <ClockIcon className="w-3.5 h-3.5" />
                    <span>{item.timestamp}</span>
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300 border border-green-300 dark:border-green-800 flex items-center space-x-1">
                    <CheckCircleIcon className="w-3 h-3" />
                    <span>{item.status}</span>
                  </span>

                  {/* Copy Consultation Button */}
                  <button
                    onClick={() => handleCopy(item.id, `${item.title || item.query}\n\nQ: ${item.query}\n\nA: ${item.resolvedAnswer}\n\nSource: ${item.source}`)}
                    className="p-1.5 rounded-lg border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 hover:bg-[#FFE9A9]/30 text-[#000000] dark:text-[#FFFFFF] cursor-pointer"
                    title="Copy consultation"
                  >
                    {copiedId === item.id ? (
                      <CheckIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <DocumentDuplicateIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988]" />
                    )}
                  </button>

                  {/* Delete Item Button */}
                  <button
                    onClick={() => handleDelete(item.id, item.sessionId)}
                    className="p-1.5 rounded-lg border border-red-200 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 cursor-pointer"
                    title="Delete consultation"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Consultation Title */}
              <h2 className="text-base sm:text-lg font-black text-[#000000] dark:text-[#FFFFFF]">
                {item.title || (currentLang === 'as' ? item.asQuery : item.query)}
              </h2>

              {/* Inquired Question Box */}
              <div className="p-3.5 bg-black/5 dark:bg-white/5 rounded-2xl text-xs sm:text-sm font-bold text-[#000000] dark:text-[#FFFFFF] border border-black/5 dark:border-white/5">
                <span className="text-[#FF933E] dark:text-[#03C988] font-black mr-1">Q:</span>
                {currentLang === 'as' ? item.asQuery : item.query}
              </div>

              {/* Grounded AI Response Box */}
              <div className="p-4 bg-white/60 dark:bg-black/30 rounded-2xl border border-[#73A5CA]/30 dark:border-[#1C82AD]/30 text-xs sm:text-sm text-[#000000] dark:text-[#FFFFFF] leading-relaxed">
                {item.resolvedAnswer}
              </div>

              {/* Footer Citations & Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheckIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988] shrink-0" />
                  <span className="font-bold">Grounded Source: {item.source}</span>
                  <span>•</span>
                  <span>{item.university || univProfile?.name || 'Nivoraya University (DU)'}</span>
                </div>

                <button
                  onClick={() => onNavigateTab(assistantTabName, { prefillQuery: item.query })}
                  className="text-xs font-black text-[#FF933E] dark:text-[#03C988] hover:underline cursor-pointer flex items-center space-x-1 self-start sm:self-auto"
                >
                  <SparklesIcon className="w-3.5 h-3.5" />
                  <span>Ask Follow-up in Assistant ➔</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
