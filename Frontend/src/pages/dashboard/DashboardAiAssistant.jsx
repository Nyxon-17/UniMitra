import { useState, useRef, useEffect } from 'react';
import { 
  SendIcon, 
  SparklesIcon, 
  CheckCircleIcon, 
  DocumentTextIcon, 
  BuildingLibraryIcon,
  LanguageIcon,
  ClockIcon,
  TrashIcon,
  ShieldCheckIcon
} from '../../components/common/Icons';

export const DashboardAiAssistant = ({ 
  currentLang = 'en',
  prefillQuery = '',
  studentInfo = { name: 'Member', role: 'Student' }
}) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: currentLang === 'as'
        ? 'নমস্কাৰ! মই UniMitra CampusIQ বিশ্ববিদ্যালয় সহায়ক। অসমৰ যিকোনো বিশ্ববিদ্যালয়ৰ নিয়মাৱলী, পৰীক্ষাৰ মূল্যায়ন, ভৰ্তি প্ৰক্ৰিয়া, ছাত্ৰবৃত্তি আৰু হোষ্টেলৰ সুবিধাৰ বিষয়ে মোক সুধিব পাৰে।'
        : 'Hello! I am your UniMitra CampusIQ Institutional Assistant. I am ready to answer queries regarding university regulations, examinations, admissions, scholarships, and campus facilities with verifiable source citations in Assamese and English.',
      source: 'Assam Higher Education Knowledge Repository',
      page: 'Verified Gazette',
      confidence: 'Institutional Match (100%)',
      time: 'Just now'
    }
  ]);

  const [inputQuery, setInputQuery] = useState(prefillQuery || '');
  const [loading, setLoading] = useState(false);
  const [historySidebarOpen, setHistorySidebarOpen] = useState(false);
  
  // Stored query history in session
  const [queryHistory, setQueryHistory] = useState([
    { id: 1, query: 'GU exam passing marks and re-evaluation rules', time: '10:30 AM' },
    { id: 2, query: 'DU attendance condonation limit for medical absence', time: 'Yesterday' },
    { id: 3, query: 'DHE Assam scholarship eligibility and income ceiling', time: 'Oct 28' },
  ]);

  const chatBottomRef = useRef(null);

  useEffect(() => {
    if (prefillQuery) {
      setInputQuery(prefillQuery);
    }
  }, [prefillQuery]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const promptChips = currentLang === 'as' ? [
    'গুৱাহাটী বিশ্ববিদ্যালয়ৰ পৰীক্ষাত উত্তীৰ্ণ হোৱাৰ নূন্যতম নম্বৰ কিমান?',
    'ডিব্ৰুগড় বিশ্ববিদ্যালয়ৰ উপস্থিতি ৰেহাইৰ (Condonation) চৰ্ত কি?',
    'উচ্চ শিক্ষা সঞ্চালকালয়ৰ মেধা ছাত্ৰবৃত্তিৰ বাবে কি নথিপত্ৰ লাগে?',
    'হোষ্টেল আসন আবণ্টনৰ বাবে মেধা আৰু দূৰত্বৰ নিয়ম কি?'
  ] : [
    'What are Gauhati University passing criteria and re-evaluation fees?',
    'What is Dibrugarh University attendance rule and condonation limit?',
    'Assam DHE Ishan Uday scholarship eligibility and document checklist',
    'University hostel allotment criteria and reservation quotas'
  ];

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
    <div className="h-[calc(100vh-8.5rem)] flex flex-col bg-white dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D] rounded-3xl shadow-sm overflow-hidden">
      
      {/* Chat Top Header */}
      <div className="px-6 py-4 bg-[#FEFAF3] dark:bg-[#15370D] border-b border-[#B8CFB3] dark:border-[#728E6D] flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#84A282] text-white flex items-center justify-center font-black shadow-xs">
            <BuildingLibraryIcon className="w-5 h-5 text-[#FEFAF3]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm sm:text-base font-black text-[#15370D] dark:text-[#FFF2B4]">
                CampusIQ Bilingual Assistant
              </h2>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#B8CFB3]/40 text-[#15370D] dark:bg-[#728E6D] dark:text-[#FFF2B4]">
                RAG Grounded
              </span>
            </div>
            <p className="text-[11px] text-[#4F6D4B] dark:text-[#E5CD82] font-semibold">
              {currentLang === 'as' ? 'অসমীয়া আৰু ইংৰাজীত প্ৰশ্ন সোধক • নিৰ্ভুল উদ্ধৃতি' : 'Ask in Assamese or English • Verifiable institutional citations'}
            </p>
          </div>
        </div>

        {/* Query History Drawer Toggle */}
        <button
          onClick={() => setHistorySidebarOpen(!historySidebarOpen)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border border-[#B8CFB3] dark:border-[#728E6D] ${
            historySidebarOpen 
              ? 'bg-[#84A282] text-white' 
              : 'bg-[#FEFAF3] dark:bg-[#1C4412] text-[#15370D] dark:text-[#FFF2B4] hover:bg-[#B8CFB3]/30'
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
                    ? 'bg-[#84A282] text-white rounded-br-xs font-bold shadow-xs'
                    : 'bg-[#FEFAF3] dark:bg-[#15370D] border-2 border-[#B8CFB3] dark:border-[#728E6D] text-[#15370D] dark:text-[#FFF2B4] rounded-bl-xs font-semibold shadow-xs'
                }`}
              >
                <p>{msg.text}</p>

                {/* Grounding Source Citation Card */}
                {msg.sender === 'ai' && msg.source && (
                  <div className="mt-3.5 pt-3 border-t border-[#B8CFB3]/60 dark:border-[#728E6D] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#4F6D4B] dark:text-[#E5CD82]">
                    <div className="flex items-center space-x-1.5">
                      <DocumentTextIcon className="w-3.5 h-3.5 text-[#84A282]" />
                      <span className="font-bold">{msg.source}</span>
                      <span>•</span>
                      <strong className="text-[#84A282] dark:text-[#FFF2B4]">{msg.page}</strong>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#B8CFB3]/30 dark:bg-[#1C4412] text-[#15370D] dark:text-[#FFF2B4] font-black border border-[#84A282]/30">
                      {msg.confidence}
                    </span>
                  </div>
                )}
              </div>

              <span className="text-[10px] text-[#4F6D4B] dark:text-[#E5CD82] mt-1 px-1 font-semibold">
                {msg.time}
              </span>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 p-4 bg-[#FEFAF3] dark:bg-[#15370D] border border-[#B8CFB3] dark:border-[#728E6D] rounded-2xl max-w-xs">
              <SparklesIcon className="w-4 h-4 text-[#84A282] animate-spin" />
              <span className="text-xs font-bold text-[#15370D] dark:text-[#FFF2B4]">
                Searching university regulations...
              </span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* History Slide-in Panel */}
        {historySidebarOpen && (
          <aside className="w-64 sm:w-72 bg-[#FEFAF3] dark:bg-[#15370D] border-l border-[#B8CFB3] dark:border-[#728E6D] p-4 flex flex-col justify-between shrink-0 overflow-y-auto">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#B8CFB3] dark:border-[#728E6D]">
                <span className="text-xs font-black uppercase text-[#15370D] dark:text-[#FFF2B4] flex items-center space-x-1">
                  <ClockIcon className="w-3.5 h-3.5 text-[#84A282]" />
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
                  <p className="text-xs text-[#4F6D4B] dark:text-[#E5CD82]">No queries in session.</p>
                ) : (
                  queryHistory.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setInputQuery(item.query);
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-white dark:bg-[#1C4412] border border-[#B8CFB3] dark:border-[#728E6D] hover:border-[#84A282] transition-all cursor-pointer text-xs"
                    >
                      <p className="font-bold text-[#15370D] dark:text-[#FFF2B4] truncate">
                        {item.query}
                      </p>
                      <span className="text-[10px] text-[#4F6D4B] dark:text-[#E5CD82]">
                        {item.time}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-[#B8CFB3] dark:border-[#728E6D] text-[10px] text-[#4F6D4B] dark:text-[#E5CD82]">
              Queries remain saved in your institutional session.
            </div>
          </aside>
        )}

      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-4 sm:px-6 py-2 bg-[#FEFAF3] dark:bg-[#15370D] border-t border-[#B8CFB3]/60 dark:border-[#728E6D] flex items-center space-x-2 overflow-x-auto shrink-0">
        <span className="text-[10px] font-black uppercase tracking-wider text-[#84A282] dark:text-[#E5CD82] shrink-0">
          Try:
        </span>
        {promptChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => setInputQuery(chip)}
            className="px-3 py-1 rounded-full text-[11px] font-bold bg-white dark:bg-[#1C4412] border border-[#B8CFB3] dark:border-[#728E6D] text-[#15370D] dark:text-[#FFF2B4] hover:bg-[#84A282] hover:text-white transition-all cursor-pointer shrink-0"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <div className="p-4 bg-white dark:bg-[#1C4412] border-t border-[#B8CFB3] dark:border-[#728E6D] shrink-0">
        <form onSubmit={handleSend} className="flex items-center space-x-3">
          <input
            type="text"
            placeholder={currentLang === 'as' ? 'বিশ্ববিদ্যালয়ৰ যিকোনো নিয়ম বা প্ৰশ্ন লিখক (অসমীয়া বা ইংৰাজী)...' : 'Ask about university regulations, exams, admissions, or scholarships...'}
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={loading}
            className="flex-1 py-3 px-4 rounded-2xl border-2 border-[#B8CFB3] dark:border-[#728E6D] bg-[#FEFAF3] dark:bg-[#15370D] text-xs sm:text-sm text-[#15370D] dark:text-[#FFF2B4] placeholder-[#4F6D4B]/70 dark:placeholder-[#E5CD82]/60 outline-none focus:border-[#84A282] font-semibold"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="p-3.5 rounded-2xl bg-[#84A282] hover:bg-[#6F8E6D] text-white transition-all cursor-pointer shadow-elevated-sage disabled:opacity-40 shrink-0"
            aria-label="Send query"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>

    </div>
  );
};
