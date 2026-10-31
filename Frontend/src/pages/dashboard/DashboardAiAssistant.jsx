import { useState, useRef, useEffect } from 'react';
import { 
  SendIcon, 
  SparklesIcon, 
  CheckCircleIcon, 
  DocumentTextIcon, 
  AcademicCapIcon,
  LanguageIcon 
} from '../../components/common/Icons';

export const DashboardAiAssistant = ({ 
  currentLang = 'en',
  prefillQuery = '',
  studentInfo = { name: 'Student' }
}) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: currentLang === 'as'
        ? 'নমস্কাৰ! মই UniMitra শৈক্ষিক সহায়ক। অসমৰ যিকোনো বিশ্ববিদ্যালয়ৰ পাঠ্যক্ৰম, পৰীক্ষাৰ নিয়ম বা প্ৰশ্নৰ বিষয়ে মোক সুধিব পাৰে।'
        : 'Hello! I am your UniMitra Academic Assistant. I am ready to answer any questions across all university syllabuses and course materials with exact page citations.',
      source: 'Official Academic Ingestion Engine',
      page: 'Verified',
      confidence: '100% Match',
      time: 'Just now'
    }
  ]);

  const [inputQuery, setInputQuery] = useState(prefillQuery || '');
  const [loading, setLoading] = useState(false);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    if (prefillQuery) {
      setInputQuery(prefillQuery);
    }
  }, [prefillQuery]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

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
    const sentText = inputQuery;
    setInputQuery('');
    setLoading(true);

    // Simulate verified academic document retrieval
    setTimeout(() => {
      let aiResponse = {
        id: Date.now() + 1,
        sender: 'ai',
        text: '',
        source: 'GU_BCA_CBCS_Syllabus.pdf',
        page: 'Page 38, Section 4',
        confidence: '99.2% Official Match',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      if (sentText.toLowerCase().includes('dbms') || sentText.includes('database')) {
        aiResponse.text = currentLang === 'as'
          ? 'গুৱাহাটী বিশ্ববিদ্যালয়ৰ BCA ৩য় ষাণ্মাসিকৰ DBMS পাঠ্যক্ৰম অনুসৰি ৫ টা মূল একক আছে: ১/ Data Models & ER Modeling, ২/ Relational Algebra & SQL, ৩/ Database Design & Normalization (1NF, 2NF, 3NF, BCNF), ৪/ Transaction & Concurrency Control, ৫/ File Organization & Indexing।'
          : 'According to Gauhati University BCA 3rd Semester DBMS syllabus, the core syllabus comprises 5 modules: 1/ Data Models & ER Modeling, 2/ Relational Algebra & SQL Queries, 3/ Normalization (1NF, 2NF, 3NF, BCNF), 4/ Transaction & Concurrency Control, and 5/ File Organization & Indexing.';
        aiResponse.source = 'GU_BCA_HC_3016_DBMS.pdf';
        aiResponse.page = 'Page 42, Module 3';
      } else if (sentText.toLowerCase().includes('pass') || sentText.includes('mark') || sentText.includes('নিয়ম')) {
        aiResponse.text = currentLang === 'as'
          ? 'গুৱাহাটী বিশ্ববিদ্যালয়ৰ CBCS নিয়ম অনুসৰি প্ৰতিটো পেপাৰত উত্তীৰ্ণ হ’বলৈ ছাত্ৰ-ছাত্ৰীয়ে In-Semester (Internal Assessment) আৰু End-Semester পৰীক্ষাত পৃথকে পৃথকে ন্যূনতম ৪০% নম্বৰ লাভ কৰিব লাগিব।'
          : 'According to Gauhati University CBCS Examination Regulations, students must secure a minimum of 40% aggregate in both In-Semester Assessments (Internal) and End-Semester Final Examinations separately to clear each course credit.';
        aiResponse.source = 'GU_CBCS_Regulations_UG.pdf';
        aiResponse.page = 'Page 14, Clause 8.2';
      } else {
        aiResponse.text = currentLang === 'as'
          ? `আপোনাৰ প্ৰশ্নটো (${sentText}) বিশ্ববিদ্যালয়ৰ মানক পাঠ্যক্ৰমৰ সৈতে নিৰীক্ষণ কৰা হৈছে। মূল পাঠ্যপুথি আৰু প্ৰশ্নকাকতৰ বিৱৰণ সংলগ্ন PDF পৃষ্ঠাত দিয়া হৈছে।`
          : `Your inquiry regarding "${sentText}" has been verified against the official university curriculum. All relevant units, prescribed authors, and question weightage are extracted from authorized documents.`;
      }

      setMessages((prev) => [...prev, aiResponse]);
      setLoading(false);
    }, 900);
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm overflow-hidden">
      
      {/* Chat Top Header */}
      <div className="px-6 py-4 bg-slate-50 dark:bg-[#0E1726] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF7F50] to-[#FFD166] flex items-center justify-center text-white shadow-sm">
            <SparklesIcon className="w-5 h-5 text-[#073B4C]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                UniMitra AI Study Assistant
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#06D6A0]/15 text-[#06D6A0] border border-[#06D6A0]/30 font-mono">
                GROUNDED IN OFFICIAL PDFS
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {currentLang === 'as' ? 'প্ৰৱেশ পৰিসৰ: অসমৰ সকলো বিশ্ববিদ্যালয়ৰ পাঠ্যক্ৰম' : 'Active Scope: All Assam University Curriculums'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (window.confirm("Clear current study chat session?")) {
              setMessages([messages[0]]);
            }
          }}
          className="text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-white px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer"
        >
          Clear Chat
        </button>
      </div>

      {/* Chat Message Scrollable Viewport */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            {/* Sender Label */}
            <div className="text-[11px] font-bold text-slate-400 mb-1 px-1 flex items-center space-x-1.5">
              <span>{msg.sender === 'user' ? 'You' : 'UniMitra Assistant'}</span>
              <span>•</span>
              <span>{msg.time}</span>
            </div>

            {/* Bubble */}
            <div
              className={`max-w-2xl rounded-2xl p-4 sm:p-5 shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-[#118AB2] text-white rounded-tr-none'
                  : 'bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border-2 border-slate-200 dark:border-slate-700 rounded-tl-none space-y-3'
              }`}
            >
              <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                {msg.text}
              </p>

              {/* Verified Document Citation Footnote (Only for AI) */}
              {msg.sender === 'ai' && msg.source && (
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
                    <DocumentTextIcon className="w-4 h-4 text-[#118AB2] dark:text-[#FFD166]" />
                    <span className="font-bold text-[11px]">{msg.source}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-[#FF7F50] font-bold text-[11px]">{msg.page}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => alert(`Opening official university document: ${msg.source}`)}
                      className="text-[11px] font-bold text-[#118AB2] dark:text-[#06D6A0] hover:underline cursor-pointer"
                    >
                      Open PDF Page ↗
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl w-fit border border-slate-200 dark:border-slate-700">
            <div className="w-4 h-4 border-2 border-[#118AB2] border-t-transparent rounded-full animate-spin"></div>
            <span>Matching official university syllabus documents...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Suggested Prompt Pills */}
      <div className="px-6 py-2.5 bg-slate-50/70 dark:bg-[#0E1726]/60 border-t border-slate-100 dark:border-slate-800 overflow-x-auto flex items-center space-x-2 text-xs">
        <span className="font-bold text-slate-400 shrink-0">Quick Ask:</span>
        <button
          onClick={() => setInputQuery('DBMS Unit 3 syllabus topics কি কি?')}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-xl text-slate-700 dark:text-slate-300 hover:text-[#118AB2] whitespace-nowrap cursor-pointer"
        >
          DBMS Unit 3 Syllabus
        </button>
        <button
          onClick={() => setInputQuery('GU BCA passing marks criteria in theory & practical')}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-xl text-slate-700 dark:text-slate-300 hover:text-[#118AB2] whitespace-nowrap cursor-pointer"
        >
          Passing Marks Criteria
        </button>
        <button
          onClick={() => setInputQuery('Operating Systems Linux Commands prescribed in syllabus')}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-xl text-slate-700 dark:text-slate-300 hover:text-[#118AB2] whitespace-nowrap cursor-pointer"
        >
          Linux Lab Practical List
        </button>
      </div>

      {/* Bottom Message Input Bar */}
      <form onSubmit={handleSend} className="p-4 bg-white dark:bg-[#111C2E] border-t border-slate-200 dark:border-slate-800 flex items-center space-x-3">
        <input
          type="text"
          placeholder={currentLang === 'as' ? 'অসমীয়া বা ইংৰাজীত প্ৰশ্ন সুধক...' : 'Ask your syllabus question in Assamese or English...'}
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-[#118AB2] focus:bg-white dark:focus:bg-slate-900"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || loading}
          className="px-5 py-3 rounded-2xl font-bold text-white bg-[#FF7F50] hover:bg-[#E86B3D] transition-all cursor-pointer shadow-elevated-coral disabled:opacity-50 shrink-0 flex items-center space-x-2"
        >
          <span>Send</span>
          <SendIcon className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};

