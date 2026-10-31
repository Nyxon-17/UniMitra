import { useState, useRef, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { 
  SendIcon, 
  SparklesIcon, 
  CheckCircleIcon, 
  DocumentTextIcon, 
  BuildingLibraryIcon,
  LanguageIcon,
  ClockIcon,
  TrashIcon,
  ShieldCheckIcon,
  CheckIcon,
  XMarkIcon,
  DocumentDuplicateIcon
} from '../../components/common/Icons';

export const DashboardAiAssistant = ({ 
  currentLang = 'en',
  prefillQuery = '',
  studentInfo = { name: 'Member', role: 'Student' }
}) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: currentLang === 'as'
        ? 'নমস্কাৰ! মই UniMitra বিশ্ববিদ্যালয় সহায়ক। অসমৰ যিকোনো বিশ্ববিদ্যালয়ৰ নিয়মাৱলী, পৰীক্ষাৰ মূল্যায়ন, ভৰ্তি প্ৰক্ৰিয়া, ছাত্ৰবৃত্তি আৰু হোষ্টেলৰ সুবিধাৰ বিষয়ে মোক সুধিব পাৰে।'
        : 'Hello! I am your UniMitra Institutional Assistant. I am ready to answer queries regarding university regulations, examinations, admissions, scholarships, and campus facilities with verifiable source citations in Assamese and English.',
      source: 'Assam Higher Education Knowledge Repository',
      page: 'Verified Gazette',
      confidence: 'Institutional Match (100%)',
      time: 'Just now'
    }
  ]);

  const [inputQuery, setInputQuery] = useState(prefillQuery || '');
  const [loading, setLoading] = useState(false);
  const [historySidebarOpen, setHistorySidebarOpen] = useState(false);
  const [actionAlert, setActionAlert] = useState('');

  // Inline Feedback Modal State
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [activeFeedbackMsg, setActiveFeedbackMsg] = useState(null);
  const [feedbackRating, setFeedbackRating] = useState('helpful'); // 'helpful' | 'unhelpful'
  const [feedbackComment, setFeedbackComment] = useState('');
  
  // Stored query history in session
  const [queryHistory, setQueryHistory] = useState([
    { id: 1, query: 'GU exam passing marks and re-evaluation rules', time: '10:30 AM' },
    { id: 2, query: 'DU attendance condonation limit for medical absence', time: 'Yesterday' },
    { id: 3, query: 'DHE Assam scholarship eligibility and income ceiling', time: 'Oct 28' },
  ]);

  const chatBottomRef = useRef(null);

  useEffect(() => {
    const fromState = location.state?.prefillQuery;
    const fromUrl = searchParams.get('q');
    const target = prefillQuery || fromState || fromUrl;
    if (target) {
      setInputQuery(target);
    }
  }, [prefillQuery, location.state, searchParams]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const isFaculty = studentInfo?.role === 'Faculty Member';

  const promptChips = isFaculty ? (
    currentLang === 'as' ? [
      'ইউজিচি ২০১৮ ৰ অধিসূচনা অনুসৰি সহযোগী অধ্যাপকৰ CAS পদোন্নতিৰ চৰ্ত কি?',
      'এগৰাকী অধ্যাপকে সৰ্বাধিক কিমানজন পিএইচ.ডি. গৱেষকক নিৰ্দেশনা দিব পাৰে?',
      'প্ৰশ্নকাকত মডাৰেচন ব’ৰ্ডৰ (BOM) নিৰ্দেশনা আৰু সৰ্বাধিক সালসলনিৰ পৰিসৰ',
      'অধ্যাপকৰ ছাবাটিকল আৰু কৰ্তব্য ছুটীৰ চৰকাৰী নিয়মসমূহ কি কি?'
    ] : [
      'UGC 2018 CAS criteria from Assistant Professor Stage 3 to Associate Professor',
      'Maximum permissible PhD scholar supervision quota for Associate Professor',
      'Confidential question paper setting norms and Board of Moderators (BOM) guidelines',
      'Official sabbatical leave and study leave statutes for university teachers'
    ]
  ) : (
    currentLang === 'as' ? [
      'গুৱাহাটী বিশ্ববিদ্যালয়ৰ পৰীক্ষাত উত্তীৰ্ণ হোৱাৰ নূন্যতম নম্বৰ কিমান?',
      'ডিব্ৰুগড় বিশ্ববিদ্যালয়ৰ উপস্থিতি ৰেহাইৰ (Condonation) চৰ্ত কি?',
      'উচ্চ শিক্ষা সঞ্চালকালয়ৰ মেধা ছাত্ৰবৃত্তিৰ বাবে কি নথিপত্ৰ লাগে?',
      'হোষ্টেল আসন আবণ্টনৰ বাবে মেধা আৰু দূৰত্বৰ নিয়ম কি?'
    ] : [
      'What are Gauhati University passing criteria and re-evaluation fees?',
      'What is Dibrugarh University attendance rule and condonation limit?',
      'Assam DHE Ishan Uday scholarship eligibility and document checklist',
      'University hostel allotment criteria and reservation quotas'
    ]
  );

  // Save Useful Answer Handler
  const handleSaveAnswer = (msg) => {
    try {
      const stored = localStorage.getItem('unimitra_saved_answers');
      let list = stored ? JSON.parse(stored) : [];
      const newEntry = {
        id: `SAVED-${Date.now()}`,
        query: messages.find(m => m.id === msg.id - 1)?.text || 'University Statutory Query',
        answer: msg.text,
        source: msg.source || 'University Regulation Gazette',
        page: msg.page || 'Verified Clause',
        savedAt: 'Just now',
        category: isFaculty ? 'Faculty Consultation' : 'Academic Regulation'
      };
      list = [newEntry, ...list];
      localStorage.setItem('unimitra_saved_answers', JSON.stringify(list));
      setActionAlert('Answer bookmarked to your Saved Answers repository!');
      setTimeout(() => setActionAlert(''), 3000);
    } catch {
      // fallback
    }
  };

  // Open Feedback Modal
  const handleOpenFeedback = (msg) => {
    setActiveFeedbackMsg(msg);
    setFeedbackRating('helpful');
    setFeedbackComment('');
    setFeedbackModalOpen(true);
  };

  // Submit Feedback Handler (Feeds directly to Administrator console)
  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    try {
      const stored = localStorage.getItem('unimitra_feedback_submissions');
      let list = stored ? JSON.parse(stored) : [];
      const newFeedback = {
        id: `FB-${Math.floor(1000 + Math.random() * 9000)}`,
        user: studentInfo?.name || 'Member',
        role: studentInfo?.role || 'Student',
        type: feedbackRating === 'helpful' ? 'Accurate Citation' : 'Reported Inaccuracy',
        university: 'Assam State Universities',
        rating: feedbackRating === 'helpful' ? 5 : 2,
        comments: feedbackComment || (feedbackRating === 'helpful' ? 'Citation was verified and accurate.' : 'Citation needs update.'),
        submittedAt: 'Just now',
        status: 'Pending Admin Review',
        answerSnippet: activeFeedbackMsg?.text?.slice(0, 80) + '...'
      };
      list = [newFeedback, ...list];
      localStorage.setItem('unimitra_feedback_submissions', JSON.stringify(list));
      setFeedbackModalOpen(false);
      setActionAlert('Feedback submitted! It is now queued for administrator review.');
      setTimeout(() => setActionAlert(''), 3500);
    } catch {
      // fallback
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputQuery.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputQuery,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    
    // Add to query history
    setQueryHistory((prev) => [
      { id: Date.now(), query: inputQuery, time: 'Just now' },
      ...prev.slice(0, 9)
    ]);

    const sentText = inputQuery;
    setInputQuery('');
    setLoading(true);

    // Simulate grounded RAG retrieval
    setTimeout(() => {
      let aiResponse = {
        id: Date.now() + 1,
        sender: 'ai',
        text: '',
        source: 'GU_Examination_Regulations_Gazette.pdf',
        page: 'Page 18, Ordinance 8.1',
        confidence: '99.4% Verified Match',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const lower = sentText.toLowerCase();

      if (lower.includes('pass') || lower.includes('mark') || lower.includes('নম্বৰ') || lower.includes('উত্তীৰ্ণ')) {
        aiResponse.text = currentLang === 'as'
          ? 'গুৱাহাটী আৰু ডিব্ৰুগড় বিশ্ববিদ্যালয়ৰ CBCS / NEP নিয়মাৱলী অনুসৰি, প্ৰতিটো বিষয়ত উত্তীৰ্ণ হ’বলৈ ছাত্ৰ-ছাত্ৰীয়ে In-Semester (Internal Sessional) আৰু End-Semester পৰীক্ষাত পৃথকে পৃথকে ন্যূনতম ৪০% নম্বৰ লাভ কৰিব লাগিব।'
          : 'According to official university examination ordinances, candidates must secure a minimum of 40% marks in In-Semester Internal Assessments and End-Semester Examinations separately to pass each paper under CBCS / NEP frameworks.';
        aiResponse.source = 'GU_Examination_Regulations_Ordinance.pdf';
        aiResponse.page = 'Page 14, Clause 8.2';
      } else if (lower.includes('attend') || lower.includes('উপস্থিতি') || lower.includes('condon')) {
        aiResponse.text = currentLang === 'as'
          ? 'বিশ্ববিদ্যালয়ৰ নিয়মাৱলী অনুসৰি নূন্যতম ৭৫% শ্ৰেণী উপস্থিতি বাধ্যতামূলক। প্ৰমাণিত চিকিৎসাজনিত কাৰণত বিভাগীয় মুৰব্বীৰ অনুমোদন সাপেক্ষে ৬৫% লৈকে ১০% ৰেহাই (Condonation) প্ৰদান কৰা হয়।'
          : 'Official university ordinances mandate a minimum of 75% class attendance in each academic semester. Condonation up to 10% (allowing students with 65%-74% attendance) is permitted strictly on medical grounds upon recommendation of the Department Head.';
        aiResponse.source = 'DU_Statutory_Attendance_Ordinances.pdf';
        aiResponse.page = 'Page 9, Section 4.3';
      } else if (lower.includes('scholarship') || lower.includes('বৃত্তি') || lower.includes('ishan') || lower.includes('dhe')) {
        aiResponse.text = currentLang === 'as'
          ? 'অসম চৰকাৰৰ উচ্চ শিক্ষা সঞ্চালকালয় (DHE) আৰু ঈশান উদয় ছাত্ৰবৃত্তিৰ বাবে পাৰিবাৰিক বার্ষিক আয় ৪.৫ লাখতকৈ কম হ’ব লাগে আৰু পূৰ্ববৰ্তী পৰীক্ষাত নূন্যতম ৬০% নম্বৰ থাকিব লাগিব। স্থায়ী বাসিন্দাৰ প্ৰমাণপত্ৰ (PRC) আৰু আয়ৰ প্ৰমাণপত্র বাধ্যতামূলক।'
          : 'Under Assam Directorate of Higher Education (DHE) schemes and Ishan Uday scholarships, applicant family annual income must not exceed INR 4.5 Lakhs with at least 60% marks in the qualifying board/degree exam. PRC, income certificate, and active bank account seeded with Aadhaar are required.';
        aiResponse.source = 'Assam_DHE_Scholarship_Norms_2024.pdf';
        aiResponse.page = 'Page 6, Clause 3.1';
      } else if (lower.includes('hostel') || lower.includes('হোষ্টেল') || lower.includes('facility')) {
        aiResponse.text = currentLang === 'as'
          ? 'বিশ্ববিদ্যালয় চৌহদৰ হোষ্টেল আসন আবণ্টন মেধা তালিকা (Merit Score) আৰু স্থায়ী ঘৰৰ দূৰত্বৰ ভিত্তিত কৰা হয়। ভৰ্তিৰ সময়ত স্থানীয় অভিভাৱকৰ সন্মতি আৰু এণ্টি-ৰেগিং শপতনামা দাখিল কৰা আৱশ্যক।'
          : 'University campus hostel allotments are determined strictly based on merit rankings in the qualifying entrance/semester exams combined with permanent residential distance from campus. Local guardian declarations and statutory anti-ragging affidavits are mandatory.';
        aiResponse.source = 'GU_Campus_Hostel_Allotment_Rules.pdf';
        aiResponse.page = 'Page 12, Rule 5';
      } else {
        aiResponse.text = currentLang === 'as'
          ? `আপোনাৰ অনুসন্ধান (${sentText}) বিশ্ববিদ্যালয়ৰ অফিচিয়েল নিয়মাৱলী আৰু অধিসূচনাৰ তথ্যভঁৰালৰ সৈতে নিৰীক্ষণ কৰা হৈছে। প্ৰয়োজনীয় অধিসূচনা আৰু কাৰ্যপ্ৰণালী মূল নথিত প্ৰকাশ কৰা হৈছে।`
          : `Your institutional inquiry regarding "${sentText}" has been verified against authorized university notifications and regulations. All relevant clauses and authority contacts are extracted from verified gazettes.`;
        aiResponse.source = 'State_Universities_Institutional_Gazette.pdf';
        aiResponse.page = 'Page 7, General Circular';
      }

      setMessages((prev) => [...prev, aiResponse]);
      setLoading(false);
    }, 900);
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 rounded-3xl shadow-sm overflow-hidden">
      
      {/* Chat Top Header */}
      <div className="px-6 py-4 bg-[#FFE9A9]/20 dark:bg-[#13005A] border-b border-[#73A5CA]/40 dark:border-[#1C82AD]/40 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] text-white flex items-center justify-center font-black shadow-xs">
            <BuildingLibraryIcon className="w-5 h-5 text-[#FAF8FF]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm sm:text-base font-black text-[#000000] dark:text-[#FFFFFF]">
                UniMitra Bilingual Assistant
              </h2>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#E0D4FD]/40 text-[#000000] dark:bg-[#3B2868] dark:text-[#FFFFFF]">
                RAG Grounded
              </span>
            </div>
            <p className="text-[11px] text-[#000000]/70 dark:text-[#FFFFFF]/80 font-semibold">
              {currentLang === 'as' ? 'অসমীয়া আৰু ইংৰাজীত প্ৰশ্ন সোধক • নিৰ্ভুল উদ্ধৃতি' : 'Ask in Assamese or English • Verifiable institutional citations'}
            </p>
          </div>
        </div>

        {/* Query History Drawer Toggle */}
        <button
          onClick={() => setHistorySidebarOpen(!historySidebarOpen)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 ${
            historySidebarOpen 
              ? 'bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] text-white' 
              : 'bg-[#FFE9A9]/20 dark:bg-[#00337C] text-[#000000] dark:text-[#FFFFFF] hover:bg-[#FFE9A9]/40'
          }`}
          title="Toggle Query History"
        >
          <ClockIcon className="w-4 h-4" />
          <span className="hidden sm:inline">{currentLang === 'as' ? 'ইতিহাস' : 'History'}</span>
        </button>
      </div>

      {/* Main Chat Viewport + Optional History Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Messages Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-2xl rounded-3xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed transition-all ${
                  msg.sender === 'user'
                    ? 'bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] text-white rounded-br-xs font-bold shadow-xs'
                    : 'bg-[#FFE9A9]/20 dark:bg-[#13005A] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-[#000000] dark:text-[#FFFFFF] rounded-bl-xs font-semibold shadow-xs'
                }`}
              >
                <p>{msg.text}</p>

                {/* Grounding Source Citation Card */}
                {msg.sender === 'ai' && msg.source && (
                  <div className="mt-3.5 pt-3 border-t border-[#73A5CA]/40/60 dark:border-[#1C82AD]/40 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#000000]/70 dark:text-[#FFFFFF]/80">
                    <div className="flex items-center space-x-1.5">
                      <DocumentTextIcon className="w-3.5 h-3.5 text-[#FF933E] dark:text-[#03C988]" />
                      <span className="font-bold">{msg.source}</span>
                      <span>•</span>
                      <strong className="text-[#FF933E] dark:text-[#03C988] dark:text-[#FFFFFF]">{msg.page}</strong>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#FFE9A9]/40 dark:bg-[#00337C] text-[#000000] dark:text-[#FFFFFF] font-black border border-[#6D28D9]/30">
                      {msg.confidence}
                    </span>
                  </div>
                )}

                {/* Save & Feedback Action Bar */}
                {msg.sender === 'ai' && (
                  <div className="mt-2.5 pt-2 border-t border-[#73A5CA]/40/40 dark:border-[#1C82AD]/40/40 flex items-center justify-between text-[11px]">
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleSaveAnswer(msg)}
                        className="px-2.5 py-1 rounded-lg bg-[#FFE9A9]/20 dark:bg-[#00337C] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 hover:bg-[#FFE9A9]/40 text-[#000000] dark:text-[#FFFFFF] font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                        title="Save answer to your bookmarks"
                      >
                        <CheckIcon className="w-3.5 h-3.5 text-[#FF933E] dark:text-[#03C988]" />
                        <span>Save Answer</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenFeedback(msg)}
                        className="px-2.5 py-1 rounded-lg bg-[#FFE9A9]/20 dark:bg-[#00337C] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 hover:bg-[#FFE9A9]/40 text-[#000000]/70 dark:text-[#FFFFFF]/80 font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                        title="Submit feedback or report issue"
                      >
                        <span>Feedback 💬</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <span className="text-[10px] text-[#000000]/70 dark:text-[#FFFFFF]/80 mt-1 px-1 font-semibold">
                {msg.time}
              </span>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 p-4 bg-[#FFE9A9]/20 dark:bg-[#13005A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 rounded-2xl max-w-xs">
              <SparklesIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988] animate-spin" />
              <span className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
                Searching university regulations...
              </span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* History Slide-in Panel */}
        {historySidebarOpen && (
          <aside className="w-64 sm:w-72 bg-[#FFE9A9]/20 dark:bg-[#13005A] border-l border-[#73A5CA]/40 dark:border-[#1C82AD]/40 p-4 flex flex-col justify-between shrink-0 overflow-y-auto">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#73A5CA]/40 dark:border-[#1C82AD]/40">
                <span className="text-xs font-black uppercase text-[#000000] dark:text-[#FFFFFF] flex items-center space-x-1">
                  <ClockIcon className="w-3.5 h-3.5 text-[#FF933E] dark:text-[#03C988]" />
                  <span>My Query History</span>
                </span>
                <button
                  onClick={() => setQueryHistory([])}
                  className="text-[10px] text-red-600 dark:text-red-400 hover:underline cursor-pointer"
                  title="Clear history"
                >
                  Clear
                </button>
              </div>

              <div className="space-y-2">
                {queryHistory.length === 0 ? (
                  <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80">No queries in session.</p>
                ) : (
                  queryHistory.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setInputQuery(item.query);
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-white dark:bg-[#00337C] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 hover:border-[#6D28D9] transition-all cursor-pointer text-xs"
                    >
                      <p className="font-bold text-[#000000] dark:text-[#FFFFFF] truncate">
                        {item.query}
                      </p>
                      <span className="text-[10px] text-[#000000]/70 dark:text-[#FFFFFF]/80">
                        {item.time}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-[10px] text-[#000000]/70 dark:text-[#FFFFFF]/80">
              Queries remain saved in your institutional session.
            </div>
          </aside>
        )}

      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-4 sm:px-6 py-2 bg-[#FFE9A9]/20 dark:bg-[#13005A] border-t border-[#73A5CA]/40/60 dark:border-[#1C82AD]/40 flex items-center space-x-2 overflow-x-auto shrink-0">
        <span className="text-[10px] font-black uppercase tracking-wider text-[#FF933E] dark:text-[#03C988] dark:text-[#FFFFFF]/80 shrink-0">
          Try:
        </span>
        {promptChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => setInputQuery(chip)}
            className="px-3 py-1 rounded-xl text-[11px] font-bold bg-white dark:bg-[#00337C] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-[#000000] dark:text-[#FFFFFF] hover:bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] hover:text-white transition-all cursor-pointer shrink-0"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <div className="p-4 bg-white dark:bg-[#00337C] border-t border-[#73A5CA]/40 dark:border-[#1C82AD]/40 shrink-0">
        <form onSubmit={handleSend} className="flex items-center space-x-3">
          <input
            type="text"
            placeholder={currentLang === 'as' ? 'বিশ্ববিদ্যালয়ৰ যিকোনো নিয়ম বা প্ৰশ্ন লিখক (অসমীয়া বা ইংৰাজী)...' : 'Ask about university regulations, exams, admissions, or scholarships...'}
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={loading}
            className="flex-1 py-3 px-4 rounded-2xl border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#13005A] text-xs sm:text-sm text-[#000000] dark:text-[#FFFFFF] placeholder-[#555375]/70 dark:placeholder-[#C4B5FD]/60 outline-none focus:border-[#6D28D9] font-semibold"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="p-3.5 rounded-2xl bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-[#000000] text-white transition-all cursor-pointer shadow-xs hover:shadow-md disabled:opacity-40 shrink-0"
            aria-label="Send query"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Action Toast Alert */}
      {actionAlert && (
        <div className="absolute top-20 right-6 z-50 bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] text-white px-4 py-2.5 rounded-2xl shadow-xs hover:shadow-md text-xs font-black flex items-center space-x-2 animate-bounce">
          <CheckCircleIcon className="w-4 h-4 text-[#FAF8FF]" />
          <span>{actionAlert}</span>
        </div>
      )}

      {/* Interactive Feedback Modal */}
      {feedbackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FFE9A9]/20 dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#73A5CA]/40 dark:border-[#1C82AD]/40 pb-3">
              <h3 className="text-sm font-black text-[#000000] dark:text-[#FFFFFF]">
                Submit Response Feedback
              </h3>
              <button
                type="button"
                onClick={() => setFeedbackModalOpen(false)}
                className="p-1 rounded-lg text-[#000000]/70 hover:text-[#000000] dark:text-[#FFFFFF]/80 dark:hover:text-[#FFFFFF] cursor-pointer"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitFeedback} className="space-y-3.5">
              <div>
                <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1.5">
                  Was this grounded answer helpful?
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFeedbackRating('helpful')}
                    className={`flex-1 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                      feedbackRating === 'helpful'
                        ? 'bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] text-white border-[#6D28D9]'
                        : 'bg-white dark:bg-[#13005A] text-[#000000] dark:text-[#FFFFFF] border-[#73A5CA]/40 dark:border-[#1C82AD]/40'
                    }`}
                  >
                    👍 Accurate & Helpful
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedbackRating('unhelpful')}
                    className={`flex-1 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                      feedbackRating === 'unhelpful'
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-white dark:bg-[#13005A] text-[#000000] dark:text-[#FFFFFF] border-[#73A5CA]/40 dark:border-[#1C82AD]/40'
                    }`}
                  >
                    👎 Needs Correction
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                  Comments / Discrepancy Note (Optional)
                </label>
                <textarea
                  rows={3}
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="e.g. Please verify with 2024 academic gazette..."
                  className="w-full p-3 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-white dark:bg-[#13005A] text-xs text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#6D28D9]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFeedbackModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#000000]/70 dark:text-[#FFFFFF]/80 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-black text-white bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] hover:bg-[#3B2868] cursor-pointer shadow-xs"
                >
                  Send to Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
