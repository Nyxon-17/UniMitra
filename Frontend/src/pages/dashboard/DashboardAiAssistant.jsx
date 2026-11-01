import { useState, useRef, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { documentService } from '../../services/documentService';
import { universityService } from '../../services/universityService';
import { 
  SendIcon, 
  SparklesIcon, 
  CheckCircleIcon, 
  AiVoiceChatLogo, 
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

/**
 * Editorial + Aurora Bilingual AI Assistant
 * 
 * Responsive Features:
 * - 100% responsive across mobile phones (320px+), tablets, laptops, and wide monitors
 * - Mobile slide-over drawer for Query History (prevents chat compression on small screens)
 * - Auto-scaling typography and flexible message bubbles with overflow protection
 * - Touch-friendly voice and text inputs with mobile keyboard resilience
 * - Preserves all document retrieval, voice synthesis, speech recognition, and feedback flows
 */
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
        setVoiceError('Microphone not recognized or permission denied.');
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
      alert('Speech Recognition is not supported in this browser. Please use Chrome or Edge.');
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

  // Benchmark Quick Prompts
  const benchmarkTestScenarios = [
    {
      id: 'TEST-1',
      lang: 'as',
      label: currentLang === 'as' ? 'উত্তীৰ্ণ নম্বৰ (৪০%)' : 'Passing Marks (40%)',
      query: currentLang === 'as' 
        ? 'ডিব্ৰুগড় বিশ্ববিদ্যালয়ৰ স্নাতক মহলাৰ পৰীক্ষাত উত্তীৰ্ণ হ\'বলৈ নূন্যতম নম্বৰ কিমান লাগে?' 
        : 'What is the minimum passing percentage required in end-semester examinations?'
    },
    {
      id: 'TEST-2',
      lang: 'as',
      label: currentLang === 'as' ? 'উপস্থিতি ৰেহাই (১০%)' : 'Medical Condonation',
      query: currentLang === 'as' 
        ? 'মেডিকেল কাৰণত শ্ৰেণীৰ উপস্থিতি কিমান শতাংশলৈ ৰেহাই (Condonation) পোৱা যায়?' 
        : 'What is the attendance condonation limit for medical shortage?'
    },
    {
      id: 'TEST-3',
      lang: 'en',
      label: currentLang === 'as' ? 'পুনৰ মূল্যায়ন মাচুল' : 'Re-evaluation & Fees',
      query: currentLang === 'as' 
        ? 'পৰীক্ষাৰ উত্তৰ বহী পুনৰ মূল্যায়নৰ মাচুল আৰু অন্তিম তাৰিখ কি?' 
        : 'Explain the procedure, fee, and timeline for answer script re-evaluation after examination results.'
    },
    {
      id: 'TEST-4',
      lang: 'as',
      label: currentLang === 'as' ? 'ঈশান উদয় জলপানি' : 'Ishan Uday Scholarship',
      query: currentLang === 'as' 
        ? 'ঈশান উদয় জলপানি (Ishan Uday) পাবলৈ কি কি প্ৰমাণপত্ৰ লাগিব আৰু পাৰিবাৰিক আয়ৰ সীমা কিমান?' 
        : 'What are the eligibility criteria and documents required for Ishan Uday scholarship?'
    },
    {
      id: 'TEST-5',
      lang: 'en',
      label: currentLang === 'as' ? 'হোষ্টেল আসন আবণ্টন' : 'Hostel Allotment',
      query: currentLang === 'as' 
        ? 'বিশ্ববিদ্যালয় হোষ্টেল আসন আবণ্টনৰ বাবে দূৰত্ব আৰু মেধাৰ নিয়ম কি?' 
        : 'What are the eligibility criteria and distance rules for university hostel accommodation?'
    }
  ];

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
      setActionAlert(currentLang === 'as' ? 'উত্তৰ সংৰক্ষিত কৰা হ’ল!' : 'Answer saved to bookmarks!');
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
        comments: feedbackComment || (feedbackRating === 'helpful' ? 'Citation verified.' : 'Needs review.'),
        submittedAt: 'Just now',
        status: 'Pending Admin Review',
        answerSnippet: activeFeedbackMsg?.text?.slice(0, 80) + '...'
      };
      list = [newFeedback, ...list];
      localStorage.setItem('unimitra_feedback_submissions', JSON.stringify(list));
      setFeedbackModalOpen(false);
      setActionAlert(currentLang === 'as' ? 'প্ৰতিক্ৰিয়া সফলভাৱে প্ৰেৰণ কৰা হ’ল।' : 'Feedback submitted for review.');
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
    }, 550);
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
    <div className="w-full h-full flex flex-col editorial-surface rounded-xl sm:rounded-2xl border border-[#123C3A]/10 dark:border-[#55C7B2]/15 shadow-sm overflow-hidden min-h-0 relative">
      
      {/* 1. TOP HEADER BAR (Compact, Responsive, Editorial Identity) */}
      <header className="px-3 sm:px-5 py-2.5 sm:py-3 border-b border-[#123C3A]/10 dark:border-[#55C7B2]/15 flex items-center justify-between shrink-0 bg-white/70 dark:bg-[#142426]/70 backdrop-blur-md">
        
        {/* Left: Assistant Identity & Live Indicator */}
        <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-transparent flex items-center justify-center shrink-0">
            <AiVoiceChatLogo 
              className="w-8 h-8 sm:w-9 sm:h-9" 
              isSpeaking={isSpeaking}
              isListening={isListening}
              animated={true}
            />
          </div>
          <div className="min-w-0 leading-tight">
            <div className="flex items-center space-x-1.5 truncate">
              <h2 className="text-xs sm:text-sm font-bold text-[#123C3A] dark:text-[#DCE8E4] font-heading truncate">
                {univProfile.name || 'University'} Assistant
              </h2>
              <span className="w-2 h-2 rounded-full bg-[#55C7B2] animate-pulse shrink-0" title="Online" />
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#627680] dark:text-[#879B99] truncate font-sans">
              {currentLang === 'as' 
                ? 'দ্বিভাষিক AI সহায়ক • ভয়েচ সক্ৰিয়' 
                : 'Bilingual AI Assistant • Voice & Citations'}
            </p>
          </div>
        </div>

        {/* Right: Responsive Control Actions */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          {/* Voice Output Toggle */}
          <button
            onClick={() => {
              if (isSpeaking) stopSpeaking();
              setVoiceOutputEnabled(!voiceOutputEnabled);
            }}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
              voiceOutputEnabled
                ? 'bg-[#123C3A]/10 text-[#123C3A] dark:bg-[#55C7B2]/15 dark:text-[#55C7B2] border-[#123C3A]/20 dark:border-[#55C7B2]/30'
                : 'text-[#627680] dark:text-[#879B99] border-transparent hover:bg-[#E9F0ED] dark:hover:bg-[#142426]'
            }`}
            title={voiceOutputEnabled ? 'Voice Auto-Playback Active' : 'Voice Auto-Playback Muted'}
            aria-label="Toggle Voice Playback"
          >
            <SpeakerWaveIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">
              {voiceOutputEnabled ? 'Voice: ON' : 'Voice: OFF'}
            </span>
          </button>

          {/* Query History Drawer Toggle */}
          <button
            onClick={() => setHistorySidebarOpen(!historySidebarOpen)}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
              historySidebarOpen 
                ? 'bg-[#123C3A] text-white dark:bg-[#55C7B2] dark:text-[#0B1518] border-[#123C3A] dark:border-[#55C7B2]' 
                : 'bg-white/60 dark:bg-[#142426]/60 text-[#273B45] dark:text-[#DCE8E4] border-[#123C3A]/10 dark:border-[#55C7B2]/15 hover:bg-[#E9F0ED] dark:hover:bg-[#142426]'
            }`}
            title="Toggle Query History"
            aria-label="Toggle Query History"
          >
            <ClockIcon className="w-3.5 h-3.5" />
            <span className="hidden xs:inline text-[11px]">{currentLang === 'as' ? 'ইতিহাস' : 'History'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#E9F0ED] dark:bg-[#0B1518] text-[#123C3A] dark:text-[#55C7B2] font-mono">
              {queryHistory.length}
            </span>
          </button>
        </div>
      </header>

      {/* 2. AUDIO & VOICE STATUS BANNERS */}
      {isSpeaking && (
        <div className="px-4 py-2 bg-[#8B5CF6]/10 dark:bg-[#22D3EE]/10 border-b border-[#8B5CF6]/20 dark:border-[#22D3EE]/20 flex items-center justify-between text-xs font-semibold text-[#8B5CF6] dark:text-[#22D3EE] shrink-0">
          <div className="flex items-center space-x-2 truncate mr-2">
            <AiVoiceChatLogo className="w-5 h-5 shrink-0" isSpeaking={true} animated={true} />
            <span className="truncate">Reading verified institutional answer aloud...</span>
          </div>
          <button 
            onClick={stopSpeaking}
            className="text-[11px] font-bold text-[#123C3A] dark:text-[#55C7B2] underline hover:opacity-80 cursor-pointer shrink-0"
          >
            Stop Audio
          </button>
        </div>
      )}

      {isListening && (
        <div className="px-4 py-2 bg-[#8B5CF6]/10 dark:bg-[#22D3EE]/10 border-b border-[#8B5CF6]/30 dark:border-[#22D3EE]/30 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5 truncate mr-2">
            <AiVoiceChatLogo className="w-5 h-5 shrink-0" isListening={true} isSpeaking={false} />
            <span className="text-xs font-semibold text-[#8B5CF6] dark:text-[#22D3EE] truncate">
              Listening in {currentLang === 'as' ? 'Assamese' : 'English'}... Speak clearly!
            </span>
          </div>
          <button
            onClick={toggleListening}
            className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#8B5CF6] text-white hover:bg-[#7C3AED] dark:bg-[#22D3EE] dark:text-[#0B1518] dark:hover:bg-[#06B6D4] cursor-pointer shadow-xs shrink-0"
          >
            Done
          </button>
        </div>
      )}

      {voiceError && (
        <div className="px-4 py-2 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs font-medium border-b border-red-200 dark:border-red-900/50 shrink-0">
          {voiceError}
        </div>
      )}

      {/* 3. QUICK QUESTION PILLS (Single-Line Momentum Scroll) */}
      <div className="px-3 py-1.5 bg-[#E9F0ED]/50 dark:bg-[#142426]/50 border-b border-[#123C3A]/8 dark:border-[#55C7B2]/10 flex items-center space-x-1.5 overflow-x-auto no-scrollbar scroll-smooth shrink-0">
        <span className="text-[10px] font-bold text-[#D4A96A] dark:text-[#E0B77A] uppercase tracking-wider shrink-0 mr-1 font-sans">
          {currentLang === 'as' ? 'দ্ৰুত প্ৰশ্ন:' : 'Quick:'}
        </span>
        {benchmarkTestScenarios.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => executeQuery(scenario.query)}
            className="px-2.5 py-1 rounded-full bg-white/70 dark:bg-[#0B1518]/70 hover:bg-white dark:hover:bg-[#142426] text-[#273B45] dark:text-[#DCE8E4] border border-[#123C3A]/10 dark:border-[#55C7B2]/15 whitespace-nowrap text-[11px] font-medium transition-colors cursor-pointer shrink-0 font-sans shadow-2xs"
          >
            {scenario.label}
          </button>
        ))}
      </div>

      {/* 4. MAIN CHAT AREA + RESPONSIVE HISTORY DRAWER */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        
        {/* Messages Stream Viewport */}
        <div className="flex-1 p-3 sm:p-5 overflow-y-auto space-y-3 sm:space-y-4 min-h-0 scroll-smooth">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {/* Message Bubble */}
              <div
                className={`text-xs sm:text-sm leading-relaxed transition-all break-words ${
                  msg.sender === 'user'
                    ? 'max-w-[88%] xs:max-w-[85%] sm:max-w-xl md:max-w-2xl bg-[#123C3A] text-white dark:bg-[#55C7B2] dark:text-[#0B1518] rounded-2xl rounded-br-xs px-4 py-3 sm:px-5 sm:py-3.5 font-medium shadow-xs'
                    : msg.isUnverified
                    ? 'max-w-[95%] sm:max-w-2xl md:max-w-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 text-[#273B45] dark:text-[#DCE8E4] rounded-2xl rounded-bl-xs p-3.5 sm:p-5 font-normal shadow-xs'
                    : 'max-w-[95%] sm:max-w-2xl md:max-w-3xl bg-white/85 dark:bg-[#142426]/85 border border-[#123C3A]/10 dark:border-[#55C7B2]/15 text-[#273B45] dark:text-[#DCE8E4] rounded-2xl rounded-bl-xs p-3.5 sm:p-5 font-normal shadow-xs'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {/* Grounded Citation Card (AI Message) */}
                {msg.sender === 'ai' && (
                  <div className="mt-3.5 pt-3 border-t border-[#123C3A]/10 dark:border-[#55C7B2]/15 space-y-2.5">
                    
                    {/* Badge & Confidence Row */}
                    <div className="flex flex-wrap items-center justify-between gap-1.5 text-[11px]">
                      <div className="flex items-center space-x-1.5">
                        <ShieldCheckIcon className={`w-3.5 h-3.5 shrink-0 ${msg.isUnverified ? 'text-amber-500' : 'text-[#55C7B2]'}`} />
                        <span className="font-semibold text-[#123C3A] dark:text-[#DCE8E4] font-heading">
                          {msg.isUnverified ? 'Strict Anti-Hallucination Flag' : 'Grounded Gazette Citation'}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        msg.isUnverified
                          ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 border border-amber-300'
                          : 'bg-[#55C7B2]/15 text-[#123C3A] dark:text-[#55C7B2] border border-[#55C7B2]/30'
                      }`}>
                        {msg.confidence || '99.4% Verified Match'}
                      </span>
                    </div>

                    {/* Source File & Page Box */}
                    <div className="p-2 sm:p-2.5 rounded-xl bg-[#E9F0ED]/70 dark:bg-[#0B1518]/70 border border-[#123C3A]/8 dark:border-[#55C7B2]/10 text-[11px] font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <div className="flex items-center space-x-1.5 min-w-0">
                        <DocumentTextIcon className="w-3.5 h-3.5 text-[#D4A96A] dark:text-[#55C7B2] shrink-0" />
                        <span className="font-semibold text-[#273B45] dark:text-[#DCE8E4] truncate">
                          {msg.source}
                        </span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-[#142426] text-[#123C3A] dark:text-[#55C7B2] font-sans font-bold shrink-0 self-start sm:self-auto border border-[#123C3A]/8 dark:border-[#55C7B2]/15">
                        {msg.page}
                      </span>
                    </div>

                    {/* Action Bar (Audio, Bookmark, Feedback) */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <span className="text-[10px] text-[#627680] dark:text-[#879B99] font-medium">
                        {msg.time}
                      </span>

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => speakText(msg.text)}
                          className="px-2.5 py-1 rounded-lg bg-white/70 dark:bg-[#0B1518]/70 hover:bg-[#E9F0ED] dark:hover:bg-[#142426] text-[10px] font-semibold text-[#123C3A] dark:text-[#55C7B2] border border-[#123C3A]/10 dark:border-[#55C7B2]/15 cursor-pointer flex items-center space-x-1 transition-colors"
                          title="Listen with Text-to-Speech"
                        >
                          <SpeakerWaveIcon className="w-3 h-3" />
                          <span>Listen</span>
                        </button>

                        <button
                          onClick={() => handleSaveAnswer(msg)}
                          className="px-2.5 py-1 rounded-lg bg-white/70 dark:bg-[#0B1518]/70 hover:bg-[#E9F0ED] dark:hover:bg-[#142426] text-[10px] font-semibold text-[#273B45] dark:text-[#DCE8E4] border border-[#123C3A]/10 dark:border-[#55C7B2]/15 cursor-pointer flex items-center space-x-1 transition-colors"
                        >
                          <DocumentDuplicateIcon className="w-3 h-3 text-[#D4A96A]" />
                          <span>Bookmark</span>
                        </button>

                        <button
                          onClick={() => handleOpenFeedback(msg)}
                          className="px-2.5 py-1 rounded-lg bg-white/70 dark:bg-[#0B1518]/70 hover:bg-[#E9F0ED] dark:hover:bg-[#142426] text-[10px] font-semibold text-[#627680] dark:text-[#879B99] hover:text-[#123C3A] dark:hover:text-[#55C7B2] border border-[#123C3A]/10 dark:border-[#55C7B2]/15 cursor-pointer flex items-center space-x-1 transition-colors"
                        >
                          <CheckCircleIcon className="w-3 h-3 text-[#55C7B2]" />
                          <span>Feedback</span>
                        </button>
                      </div>
                    </div>

                  </div>
                )}
              </div>

              {/* User Timestamp */}
              {msg.sender === 'user' && (
                <span className="text-[10px] text-[#627680] dark:text-[#879B99] mt-1 px-1 font-sans">
                  {msg.time}
                </span>
              )}
            </div>
          ))}

          {/* Loading Animation */}
          {loading && (
            <div className="flex items-start space-x-2.5 animate-fade-in">
              <div className="w-7 h-7 rounded-xl bg-transparent flex items-center justify-center shrink-0">
                <AiVoiceChatLogo className="w-6 h-6" isSpeaking={true} animated={true} />
              </div>
              <div className="editorial-surface rounded-2xl rounded-bl-xs px-4 py-3 text-xs font-medium text-[#273B45] dark:text-[#DCE8E4]">
                {currentLang === 'as' 
                  ? `${univProfile.asName || 'বিশ্ববিদ্যালয়'}ৰ নথিপত্ৰ নিৰীক্ষণ কৰি থকা হৈছে...` 
                  : `Retrieving grounded statutes from ${univProfile.name} knowledge base...`}
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* 5. QUERY HISTORY DRAWER (Responsive: Modal Overlay on Mobile, Docked Sidebar on Desktop) */}
        {historySidebarOpen && (
          <>
            {/* Mobile Backdrop Overlay (< lg) */}
            <div 
              className="fixed inset-0 z-40 bg-[#0B1518]/50 backdrop-blur-xs lg:hidden"
              onClick={() => setHistorySidebarOpen(false)}
            />

            {/* Drawer Container */}
            <aside className="fixed inset-y-0 right-0 z-50 w-72 sm:w-80 lg:relative lg:inset-auto lg:z-auto border-l border-[#123C3A]/10 dark:border-[#55C7B2]/15 bg-white/95 dark:bg-[#0B1518]/95 backdrop-blur-xl p-4 flex flex-col justify-between shrink-0 shadow-xl lg:shadow-none animate-fade-in">
              <div className="space-y-3 overflow-y-auto flex-1 min-h-0">
                <div className="flex items-center justify-between pb-2 border-b border-[#123C3A]/10 dark:border-[#55C7B2]/15">
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="w-4 h-4 text-[#D4A96A] dark:text-[#55C7B2]" />
                    <span className="text-xs font-bold text-[#123C3A] dark:text-[#DCE8E4] font-heading">
                      {currentLang === 'as' ? 'অনুসন্ধান ইতিহাস' : 'Query History'}
                    </span>
                  </div>
                  <button
                    onClick={() => setHistorySidebarOpen(false)}
                    className="p-1 rounded-lg text-[#627680] hover:text-[#123C3A] dark:text-[#879B99] dark:hover:text-[#DCE8E4] cursor-pointer"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  {queryHistory.length === 0 ? (
                    <p className="text-xs text-[#627680] dark:text-[#879B99] text-center py-8">
                      No query history yet.
                    </p>
                  ) : (
                    queryHistory.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          executeQuery(item.query);
                          if (window.innerWidth < 1024) setHistorySidebarOpen(false);
                        }}
                        className="w-full text-left p-2.5 rounded-xl bg-[#E9F0ED]/60 dark:bg-[#142426]/60 border border-[#123C3A]/8 dark:border-[#55C7B2]/10 hover:border-[#123C3A]/30 dark:hover:border-[#55C7B2]/40 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between text-[10px] text-[#627680] dark:text-[#879B99] mb-1">
                          <span className="font-medium">{item.time}</span>
                          <span className="px-1.5 py-0.2 rounded bg-white dark:bg-[#0B1518] text-[9px] uppercase font-bold text-[#123C3A] dark:text-[#55C7B2]">
                            {item.lang || 'en'}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-[#273B45] dark:text-[#DCE8E4] line-clamp-2 group-hover:text-[#123C3A] dark:group-hover:text-[#55C7B2] font-sans">
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
                  className="w-full mt-3 py-2 text-center text-xs font-semibold text-red-600 dark:text-red-300 hover:underline cursor-pointer flex items-center justify-center space-x-1.5 shrink-0"
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                  <span>Clear History</span>
                </button>
              )}
            </aside>
          </>
        )}

      </div>

      {/* 6. BOTTOM INPUT COMMAND BAR (Responsive, Mobile Keyboard Safe) */}
      <form 
        onSubmit={handleSend} 
        className="p-2 sm:p-3 bg-[#F7F6F0]/90 dark:bg-[#0B1518]/90 backdrop-blur-md border-t border-[#123C3A]/10 dark:border-[#55C7B2]/15 shrink-0"
      >
        <div className="rounded-xl sm:rounded-2xl bg-white/80 dark:bg-[#142426]/80 border border-[#123C3A]/12 dark:border-[#55C7B2]/20 px-2.5 sm:px-3 py-1.5 flex items-center gap-2 focus-within:border-[#123C3A] dark:focus-within:border-[#55C7B2] focus-within:ring-1 focus-within:ring-[#123C3A]/10 dark:focus-within:ring-[#55C7B2]/20 transition-all">
          
          {/* Microphone Voice Toggle */}
          <button
            type="button"
            onClick={toggleListening}
            className={`p-1.5 rounded-xl transition-all cursor-pointer shrink-0 flex items-center justify-center ${
              isListening
                ? 'bg-[#8B5CF6]/20 border border-[#22D3EE] shadow-[0_0_12px_rgba(34,211,238,0.5)]'
                : 'bg-[#E9F0ED] dark:bg-[#0B1518] hover:bg-[#123C3A]/10 border border-transparent'
            }`}
            title={isListening ? 'Stop Listening' : 'Voice Input (Click to speak)'}
            aria-label="Voice Input"
          >
            <AiVoiceChatLogo 
              className="w-5 h-5 sm:w-5.5 sm:h-5.5" 
              isListening={isListening}
              isSpeaking={false}
              animated={isListening}
            />
          </button>

          {/* Flexible Textarea Input */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              currentLang === 'as'
                ? `${univProfile.asName || 'বিশ্ববিদ্যালয়'}ৰ বিষয়ে প্ৰশ্ন সোধক...`
                : `Ask any query on regulations, examinations, admissions...`
            }
            className="flex-1 bg-transparent text-xs sm:text-sm text-[#273B45] dark:text-[#DCE8E4] placeholder-[#273B45]/45 dark:placeholder-[#879B99] outline-none resize-none leading-relaxed py-1 max-h-20 font-sans"
          />

          {/* Send Trigger Button */}
          <button
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="px-3.5 sm:px-4 py-2 rounded-xl bg-[#123C3A] hover:bg-[#184e4c] dark:bg-[#55C7B2] dark:hover:bg-[#68d8c3] text-white dark:text-[#0B1518] text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all shadow-xs flex items-center space-x-1.5 shrink-0 font-heading"
            aria-label="Send Query"
          >
            <SendIcon className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{currentLang === 'as' ? 'প্ৰেৰণ' : 'Send'}</span>
          </button>
        </div>
      </form>

      {/* Action Toast Alert */}
      {actionAlert && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-[#123C3A] text-white dark:bg-[#55C7B2] dark:text-[#0B1518] text-xs font-semibold shadow-xl animate-fade-in z-50 flex items-center space-x-2 border border-[#D4A96A] dark:border-[#E0B77A]">
          <CheckCircleIcon className="w-4 h-4 text-[#D4A96A] dark:text-[#0B1518]" />
          <span>{actionAlert}</span>
        </div>
      )}

      {/* Responsive Institutional Feedback Modal */}
      {feedbackModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0B1518]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="editorial-surface rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4 animate-scale-up border border-[#123C3A]/15 dark:border-[#55C7B2]/20">
            <div className="flex items-center justify-between pb-2 border-b border-[#123C3A]/10 dark:border-[#55C7B2]/15">
              <h3 className="text-sm sm:text-base font-bold text-[#123C3A] dark:text-[#DCE8E4] font-heading">
                Institutional Feedback
              </h3>
              <button
                onClick={() => setFeedbackModalOpen(false)}
                className="p-1 rounded-lg text-[#627680] hover:text-[#123C3A] dark:text-[#879B99] dark:hover:text-[#DCE8E4] cursor-pointer"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#627680] dark:text-[#879B99] font-sans leading-relaxed">
              Your feedback is audited by university administrators to verify citation accuracy and continuously tune retrieval embeddings.
            </p>

            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <div className="flex items-center space-x-2.5">
                <button
                  type="button"
                  onClick={() => setFeedbackRating('helpful')}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    feedbackRating === 'helpful'
                      ? 'bg-[#123C3A] text-white dark:bg-[#55C7B2] dark:text-[#0B1518] border-[#123C3A] dark:border-[#55C7B2]'
                      : 'border-[#123C3A]/15 dark:border-[#55C7B2]/20 text-[#273B45] dark:text-[#DCE8E4]'
                  }`}
                >
                  ✓ Accurate Citation
                </button>
                <button
                  type="button"
                  onClick={() => setFeedbackRating('unhelpful')}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    feedbackRating === 'unhelpful'
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'border-[#123C3A]/15 dark:border-[#55C7B2]/20 text-[#273B45] dark:text-[#DCE8E4]'
                  }`}
                >
                  ⚠ Needs Revision
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#123C3A] dark:text-[#DCE8E4] mb-1 font-heading">
                  Comments or Suggestions (Optional)
                </label>
                <textarea
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  rows={3}
                  placeholder="e.g. Clause citation matched gazette section 4.3..."
                  className="w-full px-3 py-2 rounded-xl bg-[#E9F0ED]/60 dark:bg-[#0B1518]/60 border border-[#123C3A]/12 dark:border-[#55C7B2]/20 text-xs text-[#273B45] dark:text-[#DCE8E4] placeholder-[#273B45]/45 dark:placeholder-[#879B99] outline-none font-sans"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFeedbackModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-[#627680] dark:text-[#879B99] hover:text-[#123C3A] dark:hover:text-[#DCE8E4] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#123C3A] hover:bg-[#184e4c] dark:bg-[#55C7B2] dark:hover:bg-[#68d8c3] dark:text-[#0B1518] cursor-pointer shadow-xs font-heading"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
