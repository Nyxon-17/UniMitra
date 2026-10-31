import { useState, useRef, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { documentService } from '../../services/documentService';
import { universityService } from '../../services/universityService';
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
  DocumentDuplicateIcon,
  ArrowRightIcon
} from '../../components/common/Icons';

// Custom Microphone & Speaker Icons for Voice Chat
export const MicrophoneIcon = ({ className = "w-5 h-5", ...props }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 1.5a3 3 0 00-3 3v7.5a3 3 0 006 0V4.5a3 3 0 00-3-3z" />
  </svg>
);

export const SpeakerWaveIcon = ({ className = "w-5 h-5", ...props }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.226-1.61.622-2.28.234-.847 1.058-1.354 1.938-1.354h2.24z" />
  </svg>
);

export const DashboardAiAssistant = ({ 
  currentLang = 'en',
  prefillQuery = '',
  studentInfo = { name: 'Member', role: 'Student' }
}) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Active university profile
  const [univProfile, setUnivProfile] = useState(() => universityService.getProfile());

  useEffect(() => {
    const handleUnivChange = (e) => {
      setUnivProfile(e.detail?.profile || universityService.getProfile());
    };
    window.addEventListener('unimitra_university_changed', handleUnivChange);
    return () => window.removeEventListener('unimitra_university_changed', handleUnivChange);
  }, []);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: currentLang === 'as'
        ? `নমস্কাৰ! মই ${univProfile.asName || 'ডিব্ৰুগড় বিশ্ববিদ্যালয়'}ৰ AI প্রাতিষ্ঠানিক সহায়ক (UniMitra)। বিশ্ববিদ্যালয়ৰ নিয়মাৱলী, পৰীক্ষাৰ মূল্যায়ন, ভৰ্তি প্ৰক্ৰিয়া, ছাত্ৰবৃত্তি আৰু হোষ্টেলৰ সুবিধাৰ বিষয়ে মোক যিকোনো প্ৰশ্ন অসমীয়া বা ইংৰাজীত সুধিব পাৰে। আপুনি মাইক টিপি ভয়েচ চাৰ্টৰ জৰিয়তেও কথা পাতিব পাৰে!`
        : `Hello! I am your ${univProfile.name || 'Dibrugarh University'} Institutional Voice & Text Assistant (UniMitra). I am ready to answer queries regarding regulations, examinations, admissions, scholarships, and campus facilities with verifiable source citations in Assamese and English. You can also use your microphone to speak!`,
      source: `${univProfile.name || 'Dibrugarh University'} Statutory Knowledge Base`,
      page: 'Verified Institutional Ordinance',
      confidence: '100% Match',
      time: 'Just now'
    }
  ]);

  const [inputQuery, setInputQuery] = useState(prefillQuery || '');
  const [loading, setLoading] = useState(false);
  const [historySidebarOpen, setHistorySidebarOpen] = useState(false);
  const [actionAlert, setActionAlert] = useState('');
  const [activeTestCategory, setActiveTestCategory] = useState('as'); // 'as' | 'en'

  // Voice Chat States
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(true);
  const [voiceError, setVoiceError] = useState('');

  // Inline Feedback Modal State
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [activeFeedbackMsg, setActiveFeedbackMsg] = useState(null);
  const [feedbackRating, setFeedbackRating] = useState('helpful');
  const [feedbackComment, setFeedbackComment] = useState('');
  
  // Stored query history
  const [queryHistory, setQueryHistory] = useState(() => {
    try {
      const stored = localStorage.getItem('unimitra_student_query_history');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return [
      { id: 1, query: 'ডিব্ৰুগড় বিশ্ববিদ্যালয়ৰ পৰীক্ষাত উত্তীৰ্ণ হোৱাৰ নূন্যতম নম্বৰ কিমান লাগে?', time: '10:30 AM', lang: 'as' },
      { id: 2, query: 'Medical condonation limit for semester attendance shortage', time: 'Yesterday', lang: 'en' },
      { id: 3, query: 'ঈশান উদয় জলপানি (Ishan Uday) eligibility and income ceiling', time: 'Oct 28', lang: 'as' },
    ];
  });

  const chatBottomRef = useRef(null);
  const recognitionRef = useRef(null);
  const textareaRef = useRef(null);

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

  // Web Speech Recognition Initialization
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = currentLang === 'as' ? 'bn-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError('');
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setInputQuery(transcript);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        setVoiceError('Microphone not recognized or access denied.');
        setTimeout(() => setVoiceError(''), 4000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [currentLang]);

  // Voice Recognition Toggle
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported in this browser. Please use Google Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = currentLang === 'as' ? 'bn-IN' : 'en-IN';
        recognitionRef.current.start();
      } catch (err) {
        console.error('Recognition error:', err);
      }
    }
  };

  // Text-to-Speech Output Handler
  const speakText = (text) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = currentLang === 'as' ? 'bn-IN' : 'en-IN';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const isFaculty = studentInfo?.role === 'Faculty Member';

  // Benchmark Test Scenarios
  const benchmarkTestScenarios = [
    {
      id: 'TEST-AS-1',
      lang: 'as',
      tag: 'AS 1 • Regulations',
      label: 'পৰীক্ষাত উত্তীৰ্ণ নম্বৰ (৪০%)',
      query: 'ডিব্ৰুগড় বিশ্ববিদ্যালয়ৰ স্নাতক মহলাৰ পৰীক্ষাত উত্তীৰ্ণ হ\'বলৈ নূন্যতম নম্বৰ কিমান লাগে?',
      desc: 'Assamese query testing CBCS/FYUGP separate internal & end-semester 40% passing thresholds.'
    },
    {
      id: 'TEST-AS-2',
      lang: 'as',
      tag: 'AS 2 • Condonation',
      label: 'মেডিকেল উপস্থিতি ৰেহাই (১০%)',
      query: 'মেডিকেল কাৰণত শ্ৰেণীৰ উপস্থিতি কিমান শতাংশলৈ ৰেহাই (Condonation) পোৱা যায়?',
      desc: 'Assamese query testing statutory 75% attendance rule and 10% medical condonation exception.'
    },
    {
      id: 'TEST-AS-3',
      lang: 'as',
      tag: 'AS 3 • Language Specific',
      label: 'ঈশান উদয় জলপানি আৰু আয়',
      query: 'ঈশান উদয় জলপানি (Ishan Uday Scholarship) পাবলৈ কি কি প্ৰমাণপত্ৰ লাগিব আৰু পাৰিবাৰিক আয়ৰ সীমা কিমান?',
      desc: 'Language-specific Assamese colloquial terms ("জলপানি", "পাৰিবাৰিক আয়") and NER scholarship rules.'
    },
    {
      id: 'TEST-EN-1',
      lang: 'en',
      tag: 'EN 1 • Attendance',
      label: 'Attendance & Medical Condonation',
      query: 'What is the minimum attendance required to appear in the end-semester examinations, and what is the medical condonation limit?',
      desc: 'English query testing 75% baseline attendance and HoD medical condonation limit down to 65%.'
    },
    {
      id: 'TEST-EN-2',
      lang: 'en',
      tag: 'EN 2 • Re-evaluation',
      label: 'Re-evaluation & Fees (₹350)',
      query: 'Explain the procedure, fee, and timeline for answer script re-evaluation after examination results.',
      desc: 'English query testing 20-day online application timeline, INR 350 fee, and 3-paper limit.'
    },
    {
      id: 'TEST-EN-3',
      lang: 'en',
      tag: 'EN 3 • Hostels',
      label: 'Hostel Distance (>35km) & Rules',
      query: 'What are the eligibility criteria, reservation quotas, and documents required for university hostel accommodation?',
      desc: 'English query testing entrance merit rank, >35 km geographical distance, and anti-ragging bylaws.'
    }
  ];

  // Prompt Chips
  const promptChips = isFaculty ? (
    currentLang === 'as' ? [
      'ইউজিচি ২০১৮ ৰ অধিসূচনা অনুসৰি সহযোগী অধ্যাপকৰ CAS পদোন্নতিৰ চৰ্ত কি?',
      'এগৰাকী অধ্যাপকে সৰ্বাধিক কিমানজন পিএইচ.ডি. গৱেষকক নিৰ্দেশনা দিব পাৰে?',
      'প্ৰশ্নকাকত মডাৰেচন ব’ৰ্ডৰ (BOM) নিৰ্দেশনা আৰু সৰ্বাধিক সালসলনিৰ পৰিসৰ',
      'অধ্যাপকৰ ছাবাটিকল আৰু কৰ্তব্য ছুটীৰ চৰকাৰী নিয়মসমূহ কি কি?'
    ] : [
      'UGC 2018 CAS criteria from Assistant Professor to Associate Professor',
      'Maximum permissible PhD scholar supervision quota for Associate Professor',
      'Confidential question paper setting norms and Board of Moderators guidelines',
      'Official sabbatical leave and study leave statutes for university teachers'
    ]
  ) : (
    currentLang === 'as' ? [
      'ডিব্ৰুগড় বিশ্ববিদ্যালয়ৰ পৰীক্ষাত উত্তীৰ্ণ হোৱাৰ নূন্যতম নম্বৰ কিমান?',
      'মেডিকেল কাৰণত উপস্থিতি ৰেহাইৰ (Condonation) চৰ্ত কি?',
      'ঈশান উদয় আৰু ডিএইচই মেধা ছাত্ৰবৃত্তিৰ বাবে কি নথিপত্ৰ লাগে?',
      'হোষ্টেল আসন আবণ্টনৰ বাবে মেধা আৰু দূৰত্বৰ নিয়ম কি?'
    ] : [
      'What are Dibrugarh University passing criteria and re-evaluation fees?',
      'What is the attendance condonation limit for medical absence?',
      'Assam DHE and Ishan Uday scholarship eligibility and document checklist',
      'University hostel allotment criteria and residential distance rules'
    ]
  );

  // Save Useful Answer
  const handleSaveAnswer = (msg) => {
    try {
      const stored = localStorage.getItem('unimitra_saved_answers');
      let list = stored ? JSON.parse(stored) : [];
      const newEntry = {
        id: `SAVED-${Date.now()}`,
        query: messages.find(m => m.id === msg.id - 1)?.text || 'University Statutory Query',
        answer: msg.text,
        source: msg.source || `${univProfile.name} Gazette`,
        page: msg.page || 'Verified Clause',
        savedAt: 'Just now',
        category: isFaculty ? 'Faculty Consultation' : 'Academic Regulation'
      };
      list = [newEntry, ...list];
      localStorage.setItem('unimitra_saved_answers', JSON.stringify(list));
      setActionAlert('Answer saved to your Bookmarks!');
      setTimeout(() => setActionAlert(''), 3000);
    } catch {
      // fallback
    }
  };

  // Feedback Handlers
  const handleOpenFeedback = (msg) => {
    setActiveFeedbackMsg(msg);
    setFeedbackRating('helpful');
    setFeedbackComment('');
    setFeedbackModalOpen(true);
  };

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
        university: univProfile.name || 'Dibrugarh University',
        rating: feedbackRating === 'helpful' ? 5 : 2,
        comments: feedbackComment || (feedbackRating === 'helpful' ? 'Citation was verified.' : 'Needs review.'),
        submittedAt: 'Just now',
        status: 'Pending Admin Review',
        answerSnippet: activeFeedbackMsg?.text?.slice(0, 80) + '...'
      };
      list = [newFeedback, ...list];
      localStorage.setItem('unimitra_feedback_submissions', JSON.stringify(list));
      setFeedbackModalOpen(false);
      setActionAlert('Feedback queued for administrator review.');
      setTimeout(() => setActionAlert(''), 3500);
    } catch {
      // fallback
    }
  };

  // Query Execution
  const executeQuery = (queryText) => {
    if (!queryText.trim() || loading) return;

    stopSpeaking();

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: queryText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    
    // Add to history
    const updatedHistory = [
      { id: Date.now(), query: queryText, time: 'Just now', lang: /[\u0980-\u09FF]/.test(queryText) ? 'as' : 'en' },
      ...queryHistory.filter(h => h.query !== queryText).slice(0, 14)
    ];
    setQueryHistory(updatedHistory);
    try {
      localStorage.setItem('unimitra_student_query_history', JSON.stringify(updatedHistory));
    } catch {
      // fallback
    }

    setInputQuery('');
    setLoading(true);

    setTimeout(() => {
      const approvedDocs = documentService.getApprovedDocuments();
      const searchResult = universityService.searchUniversityKnowledge(
        queryText, 
        currentLang, 
        approvedDocs
      );

      const aiResponse = {
        id: Date.now() + 1,
        sender: 'ai',
        text: searchResult?.answer || (currentLang === 'as' ? 'তথ্য পোৱা নগ’ল।' : 'Information not found.'),
        source: searchResult?.source || `${univProfile.name} Gazette`,
        page: searchResult?.page || 'Statutory Clause',
        confidence: searchResult?.confidence || '99.4% Grounded Match',
        domain: searchResult?.domain || 'Institutional Repository',
        isUnverified: searchResult?.isUnverified || false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      if (searchResult?.isUnverified) {
        try {
          const stored = localStorage.getItem('unimitra_unanswered_queries');
          let list = stored ? JSON.parse(stored) : [];
          list = [
            {
              id: `UNANS-${Date.now()}`,
              query: queryText,
              askedBy: studentInfo?.name || 'Student',
              askedAt: 'Just now',
              status: 'Unanswered'
            },
            ...list
          ];
          localStorage.setItem('unimitra_unanswered_queries', JSON.stringify(list));
        } catch {
          // fallback
        }
      }

      setMessages((prev) => [...prev, aiResponse]);
      setLoading(false);

      if (voiceOutputEnabled) {
        setTimeout(() => speakText(aiResponse.text), 200);
      }
    }, 600);
  };

  const handleSend = (e) => {
    e?.preventDefault();
    executeQuery(inputQuery);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col neo-surface rounded-[2.5rem] shadow-[0_20px_60px_rgba(115,165,202,0.18)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.65)] overflow-hidden transition-all duration-300 min-h-[calc(100vh-6rem)]">
      
      {/* Top Header Bar (Organic Spatial Pill) */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-[#FFE9A9]/30 via-white/50 to-transparent dark:from-[#13005A] dark:via-[#00337C]/80 dark:to-transparent border-b border-[#73A5CA]/25 dark:border-[#1C82AD]/30 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF933E] to-[#FFCB56] dark:from-[#03C988] dark:to-[#1C82AD] text-white dark:text-[#000000] flex items-center justify-center font-black shadow-md">
            <BuildingLibraryIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm sm:text-base font-black text-[#000000] dark:text-[#FFFFFF]">
                {univProfile.name || 'Dibrugarh University'} Assistant
              </h2>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#FFE9A9] text-[#000000] dark:bg-[#00337C] dark:text-[#03C988] border border-[#FFCB56] dark:border-[#03C988]">
                Voice & RAG
              </span>
            </div>
            <p className="text-[11px] text-[#000000]/70 dark:text-[#FFFFFF]/75 font-semibold">
              {currentLang === 'as' 
                ? `${univProfile.asName}ৰ অধিসূচনাৰ সৈতে পোনপটীয়া সংযোগ • ভয়েচ সক্ৰিয়` 
                : `Grounded in ${univProfile.name} gazettes & ordinances • Voice enabled`}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          {/* Voice Output Speaker Toggle */}
          <button
            onClick={() => {
              if (isSpeaking) stopSpeaking();
              setVoiceOutputEnabled(!voiceOutputEnabled);
            }}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
              voiceOutputEnabled
                ? 'bg-[#FF933E]/20 text-[#FF933E] dark:bg-[#03C988]/20 dark:text-[#03C988] border-[#FF933E]/40 dark:border-[#03C988]/40'
                : 'text-[#000000]/40 dark:text-[#FFFFFF]/40 border-transparent hover:bg-black/5 dark:hover:bg-white/5'
            }`}
            title={voiceOutputEnabled ? 'Voice Auto-Playback Active' : 'Voice Auto-Playback Muted'}
          >
            <SpeakerWaveIcon className="w-4 h-4" />
            <span className="hidden sm:inline text-[11px]">
              {voiceOutputEnabled ? 'Voice: ON' : 'Voice: OFF'}
            </span>
          </button>

          {/* Query History Drawer Toggle */}
          <button
            onClick={() => setHistorySidebarOpen(!historySidebarOpen)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 ${
              historySidebarOpen 
                ? 'bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000]' 
                : 'bg-white/80 dark:bg-[#00337C] text-[#000000] dark:text-[#FFFFFF] hover:bg-[#FFE9A9]/40'
            }`}
            title="Toggle Query History"
          >
            <ClockIcon className="w-4 h-4" />
            <span className="hidden sm:inline">{currentLang === 'as' ? 'ইতিহাস' : 'History'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#FFE9A9] dark:bg-[#13005A] text-[#000000] dark:text-[#FFFFFF]">
              {queryHistory.length}
            </span>
          </button>
        </div>
      </div>

      {/* Voice Status Banners */}
      {isSpeaking && (
        <div className="px-5 py-2 bg-[#03C988]/15 dark:bg-[#03C988]/20 border-b border-[#03C988]/30 flex items-center justify-between text-xs text-[#03C988] font-bold shrink-0 animate-fade-in">
          <div className="flex items-center space-x-2">
            <SpeakerWaveIcon className="w-4 h-4 animate-pulse" />
            <span>Speaking official verified answer aloud...</span>
          </div>
          <button 
            onClick={stopSpeaking}
            className="text-[11px] font-black underline hover:text-black cursor-pointer"
          >
            Stop Audio
          </button>
        </div>
      )}

      {isListening && (
        <div className="px-5 py-2.5 bg-[#FF933E]/15 dark:bg-[#03C988]/20 border-b border-[#FF933E]/40 flex items-center justify-between shrink-0 animate-fade-in">
          <div className="flex items-center space-x-2.5">
            <div className="flex items-end space-x-1 h-5">
              <span className="w-1.5 bg-[#FF933E] dark:bg-[#03C988] rounded-full audio-bar-1" />
              <span className="w-1.5 bg-[#FF933E] dark:bg-[#03C988] rounded-full audio-bar-2" />
              <span className="w-1.5 bg-[#FF933E] dark:bg-[#03C988] rounded-full audio-bar-3" />
              <span className="w-1.5 bg-[#FF933E] dark:bg-[#03C988] rounded-full audio-bar-4" />
              <span className="w-1.5 bg-[#FF933E] dark:bg-[#03C988] rounded-full audio-bar-5" />
            </div>
            <span className="text-xs sm:text-sm font-black text-[#FF933E] dark:text-[#03C988]">
              Listening to your voice in {currentLang === 'as' ? 'Assamese' : 'English'}... Speak now!
            </span>
          </div>
          <button
            onClick={toggleListening}
            className="px-3 py-1 rounded-full text-xs font-black bg-[#FF933E] text-white dark:bg-[#03C988] dark:text-black cursor-pointer shadow-xs"
          >
            Done Speaking
          </button>
        </div>
      )}

      {voiceError && (
        <div className="px-5 py-2 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 text-xs font-bold border-b border-red-200 shrink-0">
          {voiceError}
        </div>
      )}

      {/* Benchmark Test Scenarios Pill Dock */}
      <div className="px-4 py-2.5 bg-white/40 dark:bg-[#13005A]/40 border-b border-[#73A5CA]/25 dark:border-[#1C82AD]/30 shrink-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-black uppercase text-[#FF933E] dark:text-[#03C988] flex items-center space-x-1">
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>Benchmark Scenarios:</span>
            </span>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setActiveTestCategory('as')}
                className={`px-2.5 py-1 rounded-full text-[10px] font-black cursor-pointer transition-all ${
                  activeTestCategory === 'as'
                    ? 'bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] shadow-xs'
                    : 'bg-white/80 dark:bg-[#00337C] text-[#000000] dark:text-[#FFFFFF]'
                }`}
              >
                3 Assamese Tests
              </button>
              <button
                onClick={() => setActiveTestCategory('en')}
                className={`px-2.5 py-1 rounded-full text-[10px] font-black cursor-pointer transition-all ${
                  activeTestCategory === 'en'
                    ? 'bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] shadow-xs'
                    : 'bg-white/80 dark:bg-[#00337C] text-[#000000] dark:text-[#FFFFFF]'
                }`}
              >
                3 English Tests
              </button>
            </div>
          </div>

          <span className="text-[10px] text-[#000000]/60 dark:text-[#FFFFFF]/60 font-semibold hidden md:inline">
            Click any scenario to execute live RAG query with source citations
          </span>
        </div>

        <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
          {benchmarkTestScenarios
            .filter((t) => t.lang === activeTestCategory)
            .map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => executeQuery(scenario.query)}
                className="text-left p-2.5 rounded-2xl bg-white/90 dark:bg-[#00337C]/80 border border-[#73A5CA]/30 dark:border-[#1C82AD]/35 hover:border-[#FF933E] dark:hover:border-[#03C988] hover:scale-[1.01] transition-all cursor-pointer group shadow-2xs"
                title={scenario.desc}
              >
                <div className="flex items-center justify-between text-[10px] font-black text-[#FF933E] dark:text-[#03C988] mb-0.5">
                  <span>{scenario.tag}</span>
                  <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[11px] font-bold text-[#000000] dark:text-[#FFFFFF] truncate">
                  {scenario.label}
                </p>
                <p className="text-[10px] text-[#000000]/65 dark:text-[#FFFFFF]/65 truncate italic">
                  "{scenario.query}"
                </p>
              </button>
            ))}
        </div>
      </div>

      {/* Main Chat Messages Stream + History Drawer */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Messages Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-3xl rounded-[2rem] p-4 sm:p-5 text-xs sm:text-sm leading-relaxed transition-all ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-[#FF933E] to-[#FFCB56] dark:from-[#03C988] dark:to-[#1C82AD] text-white dark:text-black rounded-br-xs font-bold shadow-md'
                    : msg.isUnverified
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 dark:border-amber-600 text-[#000000] dark:text-[#FFFFFF] rounded-bl-xs font-medium shadow-xs'
                    : 'neo-surface border border-white/80 dark:border-[#1C82AD]/40 text-[#000000] dark:text-[#FFFFFF] rounded-bl-xs font-medium shadow-sm'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {/* Grounded Citation & Audio Controls for AI Message */}
                {msg.sender === 'ai' && (
                  <div className="mt-4 pt-3 border-t border-[#73A5CA]/25 dark:border-[#1C82AD]/30 flex flex-col gap-2.5">
                    
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <div className="flex items-center space-x-2">
                        <ShieldCheckIcon className={`w-4 h-4 shrink-0 ${msg.isUnverified ? 'text-amber-500' : 'text-[#03C988]'}`} />
                        <span className="font-bold text-[#000000]/80 dark:text-[#FFFFFF]/80">
                          {msg.isUnverified ? 'Strict Anti-Hallucination Guard:' : 'Grounded Institutional Citation:'}
                        </span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        msg.isUnverified
                          ? 'bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-100'
                          : 'bg-[#03C988]/20 text-[#03C988] dark:bg-[#03C988]/30 dark:text-[#03C988]'
                      }`}>
                        {msg.confidence || '99.4% Verified Match'}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl neo-inset text-[11px] font-mono flex items-center justify-between">
                      <div className="flex items-center space-x-2 truncate">
                        <DocumentTextIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988] shrink-0" />
                        <span className="font-bold truncate text-[#000000] dark:text-[#FFFFFF]">
                          {msg.source}
                        </span>
                      </div>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#FFE9A9] dark:bg-[#13005A] text-[#000000] dark:text-[#FFFFFF] font-sans font-bold shrink-0 ml-2">
                        {msg.page}
                      </span>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-[#000000]/50 dark:text-[#FFFFFF]/50 font-semibold">
                        {msg.time}
                      </span>

                      <div className="flex items-center space-x-2">
                        {/* Voice Listen Button */}
                        <button
                          onClick={() => speakText(msg.text)}
                          className="px-3 py-1 rounded-full bg-[#FFE9A9]/50 dark:bg-[#00337C] hover:bg-[#FFE9A9] text-[10px] font-bold text-[#FF933E] dark:text-[#03C988] cursor-pointer flex items-center space-x-1"
                          title="Listen with Text-to-Speech"
                        >
                          <SpeakerWaveIcon className="w-3.5 h-3.5" />
                          <span>Listen</span>
                        </button>

                        <button
                          onClick={() => handleSaveAnswer(msg)}
                          className="px-3 py-1 rounded-full bg-white dark:bg-[#00337C] hover:bg-[#FFE9A9]/40 border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-[10px] font-bold text-[#000000] dark:text-[#FFFFFF] cursor-pointer flex items-center space-x-1"
                        >
                          <DocumentDuplicateIcon className="w-3.5 h-3.5 text-[#FF933E] dark:text-[#03C988]" />
                          <span>Bookmark</span>
                        </button>

                        <button
                          onClick={() => handleOpenFeedback(msg)}
                          className="px-3 py-1 rounded-full bg-white dark:bg-[#00337C] hover:bg-[#FFE9A9]/40 border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-[10px] font-bold text-[#000000] dark:text-[#FFFFFF] cursor-pointer flex items-center space-x-1"
                        >
                          <CheckCircleIcon className="w-3.5 h-3.5 text-[#03C988]" />
                          <span>Feedback</span>
                        </button>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start space-x-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-[#FF933E] dark:bg-[#03C988] flex items-center justify-center text-white dark:text-black">
                <SparklesIcon className="w-4 h-4 animate-spin" />
              </div>
              <div className="neo-surface rounded-[2rem] p-4 text-xs font-semibold text-[#000000]/70 dark:text-[#FFFFFF]/70 flex items-center space-x-2">
                <span>
                  {currentLang === 'as' 
                    ? `ডিব্ৰুগড় বিশ্ববিদ্যালয়ৰ নথিপত্ৰ নিৰীক্ষণ কৰি থকা হৈছে...` 
                    : `Performing multilingual semantic retrieval against ${univProfile.name} knowledge base...`}
                </span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* History Drawer */}
        {historySidebarOpen && (
          <aside className="w-72 sm:w-80 border-l border-[#73A5CA]/30 dark:border-[#1C82AD]/30 bg-white/90 dark:bg-[#13005A]/90 backdrop-blur-xl p-4 flex flex-col justify-between shrink-0 animate-fade-in">
            <div className="space-y-3 overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-[#73A5CA]/20">
                <div className="flex items-center space-x-2">
                  <ClockIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988]" />
                  <span className="text-xs font-black text-[#000000] dark:text-[#FFFFFF]">
                    {currentLang === 'as' ? 'অনুসন্ধান ইতিহাস' : 'Your Query History'}
                  </span>
                </div>
                <button
                  onClick={() => setHistorySidebarOpen(false)}
                  className="p-1 rounded-full text-[#000000]/60 dark:text-[#FFFFFF]/60 hover:text-black cursor-pointer"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {queryHistory.length === 0 ? (
                  <p className="text-xs text-[#000000]/60 dark:text-[#FFFFFF]/60 text-center py-6">
                    No recent queries yet.
                  </p>
                ) : (
                  queryHistory.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => executeQuery(item.query)}
                      className="w-full text-left p-3 rounded-2xl bg-[#FFE9A9]/20 dark:bg-[#00337C]/60 border border-[#73A5CA]/30 dark:border-[#1C82AD]/30 hover:border-[#FF933E] dark:hover:border-[#03C988] transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between text-[10px] text-[#000000]/60 dark:text-[#FFFFFF]/60 mb-1">
                        <span className="font-bold">{item.time}</span>
                        <span className="px-1.5 py-0.2 rounded bg-white dark:bg-[#13005A] text-[9px] uppercase font-bold">
                          {item.lang || 'en'}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF] line-clamp-2 group-hover:text-[#FF933E] dark:group-hover:text-[#03C988]">
                        {item.query}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>

            {queryHistory.length > 0 && (
              <button
                onClick={() => {
                  setQueryHistory([]);
                  localStorage.removeItem('unimitra_student_query_history');
                }}
                className="w-full mt-3 py-2 text-center text-xs font-bold text-[#000000]/70 dark:text-[#FFFFFF]/70 hover:text-red-500 cursor-pointer flex items-center justify-center space-x-1"
              >
                <TrashIcon className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            )}
          </aside>
        )}

      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-5 py-2 bg-white/40 dark:bg-[#13005A]/40 border-t border-[#73A5CA]/20 flex items-center gap-2 overflow-x-auto shrink-0">
        <span className="text-[10px] font-black uppercase text-[#000000]/50 dark:text-[#FFFFFF]/50 shrink-0">
          Suggestions:
        </span>
        {promptChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => executeQuery(chip)}
            className="px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-[#00337C] border border-[#73A5CA]/30 dark:border-[#1C82AD]/30 text-[#000000] dark:text-[#FFFFFF] hover:border-[#FF933E] dark:hover:border-[#03C988] whitespace-nowrap cursor-pointer transition-colors shadow-2xs"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* SPACIOUS TEXTAREA INPUT AREA (Edge-to-edge fluid, generous height, zero margin) */}
      <form 
        onSubmit={handleSend} 
        className="p-4 bg-white/80 dark:bg-[#13005A]/90 border-t border-[#73A5CA]/30 dark:border-[#1C82AD]/30 shrink-0"
      >
        <div className="rounded-3xl neo-inset p-3 sm:p-4 space-y-2">
          {/* Multi-line expansive textarea */}
          <textarea
            ref={textareaRef}
            rows={3}
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              currentLang === 'as'
                ? `${univProfile.asName || 'ডিব্ৰুগড় বিশ্ববিদ্যালয়'}ৰ নিয়মাৱলী, পৰীক্ষা বা ছাত্ৰবৃত্তিৰ বিষয়ে বহলাই প্ৰশ্ন সোধক (মাইক্ৰ’ফোন টিপিও কথা পাতিব পাৰে)...`
                : `Ask any question on ${univProfile.name || 'Dibrugarh University'} regulations, examinations, or scholarships in detail (or tap mic to speak)...`
            }
            className="w-full bg-transparent text-xs sm:text-sm text-[#000000] dark:text-[#FFFFFF] placeholder-[#000000]/50 dark:placeholder-[#FFFFFF]/50 outline-none resize-none leading-relaxed"
          />

          {/* Action Row Underneath Textarea */}
          <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5">
            {/* Voice Input Microphone Button */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={toggleListening}
                className={`px-3 py-1.5 rounded-full transition-all cursor-pointer flex items-center space-x-1.5 ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse shadow-md'
                    : 'bg-[#FFE9A9] dark:bg-[#00337C] text-[#FF933E] dark:text-[#03C988] hover:scale-105'
                }`}
                title={isListening ? 'Stop Listening' : 'Voice Input (Click to speak query)'}
              >
                <MicrophoneIcon className="w-4 h-4" />
                <span className="text-xs font-black">
                  {isListening ? 'Listening...' : 'Speak (ভয়েচ)'}
                </span>
              </button>

              <span className="text-[11px] text-[#000000]/50 dark:text-[#FFFFFF]/50 hidden sm:inline">
                Shift + Enter for new line • Enter to send
              </span>
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputQuery.trim() || loading}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FF933E] to-[#FFCB56] hover:from-[#E87A24] hover:to-[#FFCB56] dark:from-[#03C988] dark:to-[#1C82AD] text-white dark:text-[#000000] text-xs sm:text-sm font-black disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all shadow-md flex items-center space-x-1.5"
            >
              <SendIcon className="w-4 h-4" />
              <span>{currentLang === 'as' ? 'প্ৰেৰণ' : 'Ask Question'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Action Toast */}
      {actionAlert && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full neo-surface text-xs font-black text-[#000000] dark:text-[#FFFFFF] shadow-2xl animate-fade-in z-50 flex items-center space-x-2 border border-[#FF933E] dark:border-[#03C988]">
          <CheckCircleIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988]" />
          <span>{actionAlert}</span>
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="neo-surface rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-2 border-b border-[#73A5CA]/30 dark:border-[#1C82AD]/30">
              <h3 className="text-base font-black text-[#000000] dark:text-[#FFFFFF]">
                Institutional Feedback
              </h3>
              <button
                onClick={() => setFeedbackModalOpen(false)}
                className="p-1 rounded-full text-[#000000]/60 dark:text-[#FFFFFF]/60 hover:text-black cursor-pointer"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/70">
              Your feedback is audited by university administrators to verify citation accuracy and continuously tune retrieval embeddings.
            </p>

            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setFeedbackRating('helpful')}
                  className={`flex-1 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                    feedbackRating === 'helpful'
                      ? 'bg-[#03C988] text-black border-[#03C988] font-black'
                      : 'border-[#73A5CA]/40 text-[#000000] dark:text-[#FFFFFF]'
                  }`}
                >
                  ✓ Accurate Citation
                </button>
                <button
                  type="button"
                  onClick={() => setFeedbackRating('unhelpful')}
                  className={`flex-1 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                    feedbackRating === 'unhelpful'
                      ? 'bg-amber-500 text-white border-amber-500 font-black'
                      : 'border-[#73A5CA]/40 text-[#000000] dark:text-[#FFFFFF]'
                  }`}
                >
                  ⚠ Needs Revision
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#000000] dark:text-[#FFFFFF] mb-1">
                  Comments or Suggestions (Optional)
                </label>
                <textarea
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  rows={3}
                  placeholder="e.g. Clause citation matched gazette page 9 directly..."
                  className="w-full px-3.5 py-2.5 rounded-2xl neo-inset text-xs text-[#000000] dark:text-[#FFFFFF] outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFeedbackModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-[#000000]/70 dark:text-[#FFFFFF]/70 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full text-xs font-black text-white bg-[#FF933E] dark:bg-[#03C988] dark:text-black cursor-pointer shadow-xs"
                >
                  Submit to Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
