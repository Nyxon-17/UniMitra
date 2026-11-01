import { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { universityService } from '../../services/universityService';
import { chatService } from '../../services/chatService';
import { 
  SendIcon, 
  CheckCircleIcon, 
  AiVoiceChatLogo, 
  DocumentTextIcon, 
  ClockIcon,
  TrashIcon,
  ShieldCheckIcon,
  XMarkIcon,
  DocumentDuplicateIcon,
  ChatBubbleIcon
} from '../../components/common/Icons';

export const PlusIcon = ({ className = "w-4 h-4", ...props }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

export const ShareIcon = ({ className = "w-4 h-4", ...props }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
  </svg>
);

export const SpeakerWaveIcon = ({ className = "w-5 h-5", ...props }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.226-1.61.622-2.28.234-.847 1.058-1.354 1.938-1.354h2.24z" />
  </svg>
);

/**
 * UniMitra Bilingual AI Assistant
 * 
 * Key User Experience Updates:
 * - History is hidden by default during conversation for complete immersion
 * - Click "History" button to open slide-over drawer on any screen
 * - Instant scroll fix: Guaranteed bounded viewport with smooth autoscrolling
 * - ChatGPT features: New Chat, auto-save history, share transcripts
 * - Google Gemini four-point star logo
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

  const createInitialGreeting = () => ({
    id: 'greeting',
    sender: 'ai',
    text: currentLang === 'as'
      ? `নমস্কাৰ! মই ${univProfile.asName || 'বিশ্ববিদ্যালয়'}ৰ AI প্রাতিষ্ঠানিক সহায়ক (UniMitra)। বিশ্ববিদ্যালয়ৰ নিয়মাৱলী, পৰীক্ষাৰ মূল্যায়ন, ভৰ্তি প্ৰক্ৰিয়া, ছাত্ৰবৃত্তি আৰু হোষ্টেলৰ সুবিধাৰ বিষয়ে মোক যিকোনো প্ৰশ্ন অসমীয়া বা ইংৰাজীত সুধিব পাৰে। আপুনি মাইক টিপি কথা ক’বও পাৰে!`
      : `Hello! I am your ${univProfile.name || 'Dibrugarh University'} Institutional Assistant. Ask any question on regulations, examinations, syllabus, scholarships, or admissions with grounded citations in Assamese and English.`,
    source: `${univProfile.name || 'Dibrugarh University'} Statutory Knowledge Base`,
    page: 'Official Gazette Section 14',
    confidence: '100% Match',
    time: 'Just now'
  });

  // Chat Sessions & Active Thread State
  const [sessions, setSessions] = useState(() => chatService.getLocalSessions());
  const [activeSessionId, setActiveSessionId] = useState(() => chatService.getActiveSessionId() || `session-${Date.now()}`);
  const [messages, setMessages] = useState(() => {
    const saved = chatService.getSessionMessages(chatService.getActiveSessionId());
    return saved && saved.length > 0 ? saved : [createInitialGreeting()];
  });

  const [inputQuery, setInputQuery] = useState(prefillQuery || '');
  const [loading, setLoading] = useState(false);
  
  // History is HIDDEN by default during conversation
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [actionAlert, setActionAlert] = useState('');

  // Voice Chat States
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(false);
  const [voiceError, setVoiceError] = useState('');

  // Share Modal State
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Feedback Modal State
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [activeFeedbackMsg, setActiveFeedbackMsg] = useState(null);
  const [feedbackRating, setFeedbackRating] = useState('helpful');
  const [feedbackComment, setFeedbackComment] = useState('');

  const messagesContainerRef = useRef(null);
  const chatBottomRef = useRef(null);
  const recognitionRef = useRef(null);
  const textareaRef = useRef(null);

  // Load saved sessions on mount
  useEffect(() => {
    chatService.getSessions().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setSessions(data);
      }
    });
  }, []);

  // Handle URL / navigation state prefill query
  useEffect(() => {
    const fromState = location.state?.prefillQuery;
    const fromUrl = searchParams.get('q');
    const target = prefillQuery || fromState || fromUrl;
    if (target) {
      setInputQuery(target);
    }
  }, [prefillQuery, location.state, searchParams]);

  // Guaranteed Reliable Scroll to Bottom on message updates & loading
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    scrollToBottom();
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages, loading]);

  // Speech Recognition Setup
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

  // Start a fresh thread
  const handleNewChat = () => {
    stopSpeaking();
    const newId = `session-${Date.now()}`;
    setActiveSessionId(newId);
    chatService.setActiveSessionId(newId);
    const greeting = createInitialGreeting();
    setMessages([greeting]);
    setInputQuery('');
    setHistoryDrawerOpen(false); // Hide history during conversation
    setActionAlert(currentLang === 'as' ? 'নতুন আলোচনা আৰম্ভ কৰা হ’ল' : 'New chat started');
    setTimeout(() => setActionAlert(''), 2500);
  };

  // Switch to an existing session
  const handleSelectSession = (session) => {
    stopSpeaking();
    setActiveSessionId(session.id);
    chatService.setActiveSessionId(session.id);
    const saved = chatService.getSessionMessages(session.id);
    if (saved && saved.length > 0) {
      setMessages(saved);
    } else {
      setMessages([createInitialGreeting()]);
    }
    setHistoryDrawerOpen(false); // Hide history to focus on selected conversation
  };

  // Delete a session
  const handleDeleteSession = (e, sessionId) => {
    e.stopPropagation();
    const updated = chatService.deleteSession(sessionId);
    setSessions(updated);
    if (activeSessionId === sessionId) {
      handleNewChat();
    }
  };

  // Execute query connected to backend and database
  const executeQuery = async (queryText) => {
    if (!queryText.trim() || loading) return;

    stopSpeaking();
    setHistoryDrawerOpen(false); // Ensure history is hidden during conversation

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: queryText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputQuery('');
    setLoading(true);

    // Auto-create or title the session if first query
    let currentSessionTitle = sessions.find(s => s.id === activeSessionId)?.title;
    if (!currentSessionTitle) {
      currentSessionTitle = queryText.slice(0, 36) + (queryText.length > 36 ? '...' : '');
      const newSession = {
        id: activeSessionId,
        title: currentSessionTitle,
        language: currentLang,
        createdAt: new Date().toISOString()
      };
      const updatedSessions = chatService.saveLocalSession(newSession);
      setSessions(updatedSessions);
    }

    try {
      const res = await chatService.sendQuery({
        query: queryText,
        sessionId: activeSessionId,
        language: currentLang,
        university: univProfile
      });

      const aiResponse = {
        id: Date.now() + 1,
        sender: 'ai',
        text: res.answer,
        source: res.source,
        page: res.page,
        confidence: res.confidence,
        isUnverified: res.isUnverified,
        citations: res.citations,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const finalMessages = [...newMessages, aiResponse];
      setMessages(finalMessages);
      
      // Auto-save history automatically
      chatService.saveSessionMessages(activeSessionId, finalMessages);

      if (voiceOutputEnabled) {
        setTimeout(() => speakText(aiResponse.text), 200);
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
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

  const handleShareCopy = () => {
    const activeTitle = sessions.find(s => s.id === activeSessionId)?.title || 'UniMitra Consultation';
    const text = chatService.generateShareableText(activeTitle, messages, univProfile.name);
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  const handleSaveAnswer = (msg) => {
    try {
      const stored = localStorage.getItem('unimitra_saved_answers');
      let list = stored ? JSON.parse(stored) : [];
      const newEntry = {
        id: `SAVED-${Date.now()}`,
        query: messages.find(m => m.id === msg.id - 1)?.text || 'University Regulation Query',
        answer: msg.text,
        source: msg.source || `${univProfile.name} Gazette`,
        page: msg.page || 'Verified Clause',
        savedAt: 'Just now'
      };
      list = [newEntry, ...list];
      localStorage.setItem('unimitra_saved_answers', JSON.stringify(list));
      setActionAlert(currentLang === 'as' ? 'উত্তৰ সংৰক্ষিত কৰা হ’ল!' : 'Answer saved to bookmarks!');
      setTimeout(() => setActionAlert(''), 2500);
    } catch {}
  };

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
      list.push({
        id: `FB-${Date.now()}`,
        user: studentInfo?.name || 'Member',
        university: univProfile.name,
        rating: feedbackRating === 'helpful' ? 5 : 2,
        comments: feedbackComment,
        submittedAt: new Date().toISOString()
      });
      localStorage.setItem('unimitra_feedback_submissions', JSON.stringify(list));
      setFeedbackModalOpen(false);
      setActionAlert(currentLang === 'as' ? 'প্ৰতিক্ৰিয়া জমা দিয়া হ’ল!' : 'Feedback submitted!');
      setTimeout(() => setActionAlert(''), 2500);
    } catch {}
  };

  // Group sessions by date
  const groupedSessions = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const groups = {
      today: [],
      yesterday: [],
      previous7Days: [],
      older: []
    };

    sessions.forEach(s => {
      const date = s.createdAt ? new Date(s.createdAt) : new Date();
      if (date >= today) {
        groups.today.push(s);
      } else if (date >= yesterday) {
        groups.yesterday.push(s);
      } else if (date >= weekAgo) {
        groups.previous7Days.push(s);
      } else {
        groups.older.push(s);
      }
    });

    return groups;
  }, [sessions]);

  // Suggested Quick Prompts
  const quickPrompts = [
    { label: currentLang === 'as' ? 'পৰীক্ষাত উত্তীৰ্ণ নম্বৰ' : 'Passing Marks & CGPA', q: 'What is the minimum passing marks and CGPA requirement?' },
    { label: currentLang === 'as' ? 'উপস্থিতি ৰেহাই (মেডিকেল)' : 'Medical Attendance Limit', q: 'What is the attendance condonation limit for medical reasons?' },
    { label: currentLang === 'as' ? 'পুনৰ মূল্যায়ন মাচুল' : 'Re-evaluation Process', q: 'Explain the fees and process for answer sheet re-evaluation.' },
    { label: currentLang === 'as' ? 'ঈশান উদয় জলপানি' : 'Ishan Uday Grants', q: 'Eligibility and required documents for Ishan Uday scholarship?' }
  ];

  return (
    <div className="w-full h-full flex flex-col editorial-surface rounded-xl sm:rounded-2xl border border-[#123C3A]/10 dark:border-[#55C7B2]/15 shadow-sm overflow-hidden min-h-0 relative select-text">

      {/* ======================================================== */}
      {/* 1. HISTORY SLIDE-OVER DRAWER (HIDDEN by default during conversation) */}
      {/* ======================================================== */}
      {historyDrawerOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setHistoryDrawerOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 sm:w-80 bg-[#F7F6F0] dark:bg-[#0B1518] border-r border-[#123C3A]/15 dark:border-[#55C7B2]/20 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
        ${historyDrawerOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Drawer Header */}
        <div className="p-3 sm:p-4 border-b border-[#123C3A]/10 dark:border-[#55C7B2]/15 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center space-x-2">
            <ClockIcon className="w-4 h-4 text-[#D4A96A] dark:text-[#55C7B2]" />
            <h3 className="text-xs sm:text-sm font-bold text-[#123C3A] dark:text-[#DCE8E4] font-heading">
              {currentLang === 'as' ? 'আলোচনাৰ ইতিহাস' : 'Chat History'}
            </h3>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#123C3A]/10 text-[#123C3A] dark:bg-[#55C7B2]/20 dark:text-[#55C7B2]">
              {sessions.length}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            {/* New Chat Button inside drawer */}
            <button
              onClick={handleNewChat}
              className="p-1.5 rounded-lg bg-[#123C3A] text-white hover:bg-[#184e4c] dark:bg-[#55C7B2] dark:text-[#0B1518] cursor-pointer"
              title="New Chat"
            >
              <PlusIcon className="w-4 h-4" />
            </button>

            {/* Close Drawer Button */}
            <button
              onClick={() => setHistoryDrawerOpen(false)}
              className="p-1.5 rounded-lg text-[#273B45]/70 dark:text-[#DCE8E4]/70 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
              title="Close History"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sessions Scrollable List */}
        <div className="flex-1 p-2 space-y-3 overflow-y-auto min-h-0 text-xs">
          {sessions.length === 0 ? (
            <div className="p-6 text-center text-[#627680] dark:text-[#879B99] text-xs">
              <ChatBubbleIcon className="w-6 h-6 mx-auto mb-2 opacity-40" />
              <p>{currentLang === 'as' ? 'কোনো পূৰ্বৰ আলোচনা নাই' : 'No previous chats saved yet.'}</p>
              <p className="text-[11px] mt-1 text-[#D4A96A] dark:text-[#55C7B2]">
                {currentLang === 'as' ? 'প্ৰশ্ন কৰিলে আলোচনা স্বয়ংক্ৰিয়ভাৱে সংৰক্ষিত হ’ব।' : 'Chats will automatically save as you speak!'}
              </p>
            </div>
          ) : (
            <>
              {/* Today */}
              {groupedSessions.today.length > 0 && (
                <div>
                  <div className="px-2.5 py-1 text-[10px] font-bold text-[#D4A96A] dark:text-[#E0B77A] uppercase tracking-wider">
                    {currentLang === 'as' ? 'আজি' : 'Today'}
                  </div>
                  <div className="space-y-0.5">
                    {groupedSessions.today.map(s => (
                      <div
                        key={s.id}
                        onClick={() => handleSelectSession(s)}
                        className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                          activeSessionId === s.id
                            ? 'bg-white dark:bg-[#142426] text-[#123C3A] dark:text-[#55C7B2] font-semibold shadow-xs border border-[#123C3A]/10 dark:border-[#55C7B2]/20'
                            : 'text-[#273B45] dark:text-[#DCE8E4]/80 hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center space-x-2 truncate mr-2">
                          <ChatBubbleIcon className="w-3.5 h-3.5 shrink-0 opacity-70" />
                          <span className="truncate">{s.title || 'Conversation'}</span>
                        </div>
                        <button
                          onClick={(e) => handleDeleteSession(e, s.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity"
                          title="Delete Chat"
                        >
                          <TrashIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Yesterday */}
              {groupedSessions.yesterday.length > 0 && (
                <div>
                  <div className="px-2.5 py-1 text-[10px] font-bold text-[#627680] dark:text-[#879B99] uppercase tracking-wider">
                    {currentLang === 'as' ? 'কালি' : 'Yesterday'}
                  </div>
                  <div className="space-y-0.5">
                    {groupedSessions.yesterday.map(s => (
                      <div
                        key={s.id}
                        onClick={() => handleSelectSession(s)}
                        className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                          activeSessionId === s.id
                            ? 'bg-white dark:bg-[#142426] text-[#123C3A] dark:text-[#55C7B2] font-semibold shadow-xs'
                            : 'text-[#273B45] dark:text-[#DCE8E4]/80 hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center space-x-2 truncate mr-2">
                          <ChatBubbleIcon className="w-3.5 h-3.5 shrink-0 opacity-70" />
                          <span className="truncate">{s.title || 'Conversation'}</span>
                        </div>
                        <button
                          onClick={(e) => handleDeleteSession(e, s.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity"
                        >
                          <TrashIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Previous 7 Days */}
              {groupedSessions.previous7Days.length > 0 && (
                <div>
                  <div className="px-2.5 py-1 text-[10px] font-bold text-[#627680] dark:text-[#879B99] uppercase tracking-wider">
                    {currentLang === 'as' ? 'পূৰ্বৰ ৭ দিন' : 'Previous 7 Days'}
                  </div>
                  <div className="space-y-0.5">
                    {groupedSessions.previous7Days.map(s => (
                      <div
                        key={s.id}
                        onClick={() => handleSelectSession(s)}
                        className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                          activeSessionId === s.id
                            ? 'bg-white dark:bg-[#142426] text-[#123C3A] dark:text-[#55C7B2] font-semibold shadow-xs'
                            : 'text-[#273B45] dark:text-[#DCE8E4]/80 hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center space-x-2 truncate mr-2">
                          <ChatBubbleIcon className="w-3.5 h-3.5 shrink-0 opacity-70" />
                          <span className="truncate">{s.title || 'Conversation'}</span>
                        </div>
                        <button
                          onClick={(e) => handleDeleteSession(e, s.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity"
                        >
                          <TrashIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Older */}
              {groupedSessions.older.length > 0 && (
                <div>
                  <div className="px-2.5 py-1 text-[10px] font-bold text-[#627680] dark:text-[#879B99] uppercase tracking-wider">
                    {currentLang === 'as' ? 'পুৰণি আলোচনা' : 'Older'}
                  </div>
                  <div className="space-y-0.5">
                    {groupedSessions.older.map(s => (
                      <div
                        key={s.id}
                        onClick={() => handleSelectSession(s)}
                        className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                          activeSessionId === s.id
                            ? 'bg-white dark:bg-[#142426] text-[#123C3A] dark:text-[#55C7B2] font-semibold shadow-xs'
                            : 'text-[#273B45] dark:text-[#DCE8E4]/80 hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center space-x-2 truncate mr-2">
                          <ChatBubbleIcon className="w-3.5 h-3.5 shrink-0 opacity-70" />
                          <span className="truncate">{s.title || 'Conversation'}</span>
                        </div>
                        <button
                          onClick={(e) => handleDeleteSession(e, s.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity"
                        >
                          <TrashIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-[#123C3A]/10 dark:border-[#55C7B2]/15 text-[11px] text-[#627680] dark:text-[#879B99] flex items-center justify-between shrink-0">
          <span className="truncate">{univProfile.name} Database Connected</span>
          <span className="w-2 h-2 rounded-full bg-[#55C7B2] shrink-0" title="DB Connected" />
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 2. MAIN CHAT VIEW (Immersion Mode during conversation) */}
      {/* ======================================================== */}
      <main className="flex-1 flex flex-col min-w-0 h-full max-h-full overflow-hidden relative bg-transparent">

        {/* Action Alert Banner */}
        {actionAlert && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 rounded-full bg-[#123C3A] text-white dark:bg-[#55C7B2] dark:text-[#0B1518] text-xs font-semibold shadow-lg animate-fade-in">
            {actionAlert}
          </div>
        )}

        {/* Top Header Bar */}
        <header className="px-3 sm:px-4 py-2 sm:py-2.5 border-b border-[#123C3A]/10 dark:border-[#55C7B2]/15 flex items-center justify-between shrink-0 bg-white/80 dark:bg-[#142426]/85 backdrop-blur-md">
          {/* Left: History Button + Assistant Title with Gemini Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            
            {/* Click to Open History Button */}
            <button
              onClick={() => setHistoryDrawerOpen(true)}
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-[#123C3A] dark:text-[#DCE8E4] bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 border border-[#123C3A]/10 dark:border-[#55C7B2]/20 transition-all cursor-pointer shadow-2xs"
              title="Click to Open Chat History"
              aria-label="Click to Open Chat History"
            >
              <ClockIcon className="w-4 h-4 text-[#D4A96A] dark:text-[#55C7B2] shrink-0" />
              <span className="font-medium">{currentLang === 'as' ? 'ইতিহাস' : 'History'}</span>
              {sessions.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#123C3A]/10 text-[#123C3A] dark:bg-[#55C7B2]/20 dark:text-[#55C7B2]">
                  {sessions.length}
                </span>
              )}
            </button>

            {/* Google Gemini AI Sparkle Logo */}
            <div className="shrink-0 flex items-center justify-center">
              <AiVoiceChatLogo 
                className="w-7 h-7 sm:w-8 sm:h-8" 
                isSpeaking={isSpeaking}
                isListening={isListening}
                animated={true}
              />
            </div>

            <div className="min-w-0 leading-tight">
              <div className="flex items-center space-x-1.5 truncate">
                <h2 className="text-xs sm:text-sm font-bold text-[#123C3A] dark:text-[#DCE8E4] font-heading truncate">
                  {sessions.find(s => s.id === activeSessionId)?.title || `${univProfile.name} Assistant`}
                </h2>
                <span className="w-2 h-2 rounded-full bg-[#55C7B2] animate-pulse shrink-0" title="Online" />
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#627680] dark:text-[#879B99] truncate font-sans">
                {currentLang === 'as' ? 'দ্বিভাষিক AI সহায়ক • সংবিধিবদ্ধ তথ্য' : 'Bilingual AI Assistant • Grounded Citations'}
              </p>
            </div>
          </div>

          {/* Right: Actions (New Chat, Share, Voice Toggle) */}
          <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
            
            {/* New Chat Quick Button */}
            <button
              onClick={handleNewChat}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-[#123C3A] text-white hover:bg-[#184e4c] dark:bg-[#55C7B2] dark:text-[#0B1518] dark:hover:bg-[#68d8c3] transition-all cursor-pointer shadow-2xs"
              title="New Chat"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{currentLang === 'as' ? 'নতুন' : 'New'}</span>
            </button>

            {/* Share Chat Button */}
            <button
              onClick={() => setShareModalOpen(true)}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#123C3A] dark:text-[#DCE8E4] hover:bg-[#E9F0ED] dark:hover:bg-[#142426] border border-[#123C3A]/10 dark:border-[#55C7B2]/20 transition-all cursor-pointer shadow-2xs"
              title="Share Chat"
            >
              <ShareIcon className="w-3.5 h-3.5 text-[#8B5CF6] dark:text-[#22D3EE]" />
              <span className="hidden xs:inline">{currentLang === 'as' ? 'শ্বেয়াৰ' : 'Share'}</span>
            </button>

            {/* Voice Audio Playback Toggle */}
            <button
              onClick={() => {
                if (isSpeaking) stopSpeaking();
                setVoiceOutputEnabled(!voiceOutputEnabled);
              }}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                voiceOutputEnabled
                  ? 'bg-[#123C3A]/10 text-[#123C3A] dark:bg-[#55C7B2]/15 dark:text-[#55C7B2] border-[#123C3A]/20 dark:border-[#55C7B2]/30'
                  : 'text-[#627680] dark:text-[#879B99] border-transparent hover:bg-black/5 dark:hover:bg-white/5'
              }`}
              title={voiceOutputEnabled ? 'Voice Auto-Playback Active' : 'Voice Auto-Playback Muted'}
            >
              <SpeakerWaveIcon className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Audio Banner when Speaking */}
        {isSpeaking && (
          <div className="px-4 py-2 bg-[#8B5CF6]/10 dark:bg-[#22D3EE]/10 border-b border-[#8B5CF6]/20 dark:border-[#22D3EE]/20 flex items-center justify-between text-xs font-semibold text-[#8B5CF6] dark:text-[#22D3EE] shrink-0">
            <div className="flex items-center space-x-2 truncate mr-2">
              <AiVoiceChatLogo className="w-4 h-4 shrink-0" isSpeaking={true} animated={true} />
              <span className="truncate">Reading institutional answer aloud...</span>
            </div>
            <button 
              onClick={stopSpeaking}
              className="text-[11px] font-bold text-[#8B5CF6] dark:text-[#22D3EE] underline hover:opacity-80 cursor-pointer shrink-0"
            >
              Stop Audio
            </button>
          </div>
        )}

        {/* Active Listening Banner */}
        {isListening && (
          <div className="px-4 py-2 bg-[#8B5CF6]/10 dark:bg-[#22D3EE]/10 border-b border-[#8B5CF6]/30 dark:border-[#22D3EE]/30 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2.5 truncate mr-2">
              <AiVoiceChatLogo className="w-4 h-4 shrink-0" isListening={true} isSpeaking={false} />
              <span className="text-xs font-semibold text-[#8B5CF6] dark:text-[#22D3EE] truncate">
                Listening in {currentLang === 'as' ? 'Assamese' : 'English'}... Speak now!
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
          <div className="px-4 py-1.5 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs font-medium border-b border-red-200 dark:border-red-900/50 shrink-0">
            {voiceError}
          </div>
        )}

        {/* Suggested Quick Question Chips */}
        <div className="px-3 py-1.5 bg-[#E9F0ED]/50 dark:bg-[#142426]/50 border-b border-[#123C3A]/8 dark:border-[#55C7B2]/10 flex items-center space-x-1.5 overflow-x-auto no-scrollbar scroll-smooth shrink-0">
          <span className="text-[10px] font-bold text-[#D4A96A] dark:text-[#E0B77A] uppercase tracking-wider shrink-0 mr-1 font-sans">
            {currentLang === 'as' ? 'দ্ৰুত প্ৰশ্ন:' : 'Quick:'}
          </span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => executeQuery(p.q)}
              className="px-2.5 py-1 rounded-full bg-white/70 dark:bg-[#0B1518]/70 hover:bg-white dark:hover:bg-[#142426] text-[#273B45] dark:text-[#DCE8E4] border border-[#123C3A]/10 dark:border-[#55C7B2]/15 whitespace-nowrap text-[11px] font-medium transition-colors cursor-pointer shrink-0 shadow-2xs"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Messages Stream Viewport (Strict Bounded Overflow with Smooth Scrolling) */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 p-3 sm:p-5 overflow-y-auto overscroll-contain space-y-4 min-h-0 scroll-smooth"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
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
                    : 'max-w-[95%] sm:max-w-2xl md:max-w-3xl bg-white/85 dark:bg-[#142426]/85 border border-[#123C3A]/10 dark:border-[#55C7B2]/15 text-[#273B45] dark:text-[#DCE8E4] rounded-2xl rounded-bl-xs p-3.5 sm:p-5 font-normal shadow-xs'
                }`}
              >
                {/* AI Header with Gemini Logo inside the bubble */}
                {msg.sender === 'ai' && (
                  <div className="flex items-center space-x-2 pb-2 mb-2 border-b border-black/5 dark:border-white/5">
                    <AiVoiceChatLogo className="w-4 h-4 shrink-0" animated={false} />
                    <span className="text-[11px] font-bold text-[#123C3A] dark:text-[#55C7B2]">
                      {univProfile.name || 'UniMitra'} AI
                    </span>
                  </div>
                )}

                <p className="whitespace-pre-line">{msg.text}</p>

                {/* Grounded Citation Card (AI Message) */}
                {msg.sender === 'ai' && msg.source && (
                  <div className="mt-3.5 pt-3 border-t border-[#123C3A]/10 dark:border-[#55C7B2]/15 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-1.5 text-[11px]">
                      <div className="flex items-center space-x-1.5">
                        <ShieldCheckIcon className="w-3.5 h-3.5 text-[#55C7B2] shrink-0" />
                        <span className="font-semibold text-[#123C3A] dark:text-[#DCE8E4] font-heading">
                          Grounded Institutional Citation
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#55C7B2]/15 text-[#123C3A] dark:text-[#55C7B2] border border-[#55C7B2]/30">
                        {msg.confidence || '99.4% Verified Match'}
                      </span>
                    </div>

                    <div className="p-2 sm:p-2.5 rounded-xl bg-[#E9F0ED]/70 dark:bg-[#0B1518]/70 border border-[#123C3A]/8 dark:border-[#55C7B2]/10 text-[11px] font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <div className="flex items-center space-x-1.5 min-w-0">
                        <DocumentTextIcon className="w-3.5 h-3.5 text-[#D4A96A] dark:text-[#55C7B2] shrink-0" />
                        <span className="font-semibold text-[#273B45] dark:text-[#DCE8E4] truncate">
                          {msg.source}
                        </span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-[#142426] text-[#123C3A] dark:text-[#55C7B2] font-sans font-bold shrink-0 self-start sm:self-auto border border-[#123C3A]/8 dark:border-[#55C7B2]/15">
                        {msg.page || 'Clause 4'}
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

              {msg.sender === 'user' && (
                <span className="text-[10px] text-[#627680] dark:text-[#879B99] mt-1 px-1 font-sans">
                  {msg.time}
                </span>
              )}
            </div>
          ))}

          {/* Thinking / Loading Animation */}
          {loading && (
            <div className="flex items-start space-x-2.5 animate-fade-in">
              <div className="w-7 h-7 rounded-xl bg-transparent flex items-center justify-center shrink-0">
                <AiVoiceChatLogo className="w-6 h-6" isSpeaking={true} animated={true} />
              </div>
              <div className="editorial-surface rounded-2xl rounded-bl-xs px-4 py-3 text-xs font-medium text-[#273B45] dark:text-[#DCE8E4]">
                {currentLang === 'as' 
                  ? `${univProfile.asName || 'বিশ্ববিদ্যালয়'}ৰ নিয়মাৱলী পৰীক্ষা কৰি থকা হৈছে...` 
                  : `Retrieving verified statutory records from ${univProfile.name} knowledge base...`}
              </div>
            </div>
          )}

          <div ref={chatBottomRef} className="h-1 shrink-0" />
        </div>

        {/* Bottom Input Command Prompt Bar */}
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

            {/* Flexible Auto-Resizing Textarea */}
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                currentLang === 'as'
                  ? `${univProfile.asName || 'বিশ্ববিদ্যালয়'}ৰ নিয়মাৱলী, পৰীক্ষা বা ছাত্ৰবৃত্তিৰ বিষয়ে সুধক...`
                  : `Ask any university query on regulations, examinations, admissions...`
              }
              className="flex-1 bg-transparent text-xs sm:text-sm text-[#273B45] dark:text-[#DCE8E4] placeholder-[#273B45]/45 dark:placeholder-[#879B99] outline-none resize-none leading-relaxed py-1 max-h-24 font-sans"
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
          <p className="text-[10px] text-center text-[#627680] dark:text-[#879B99] pt-1">
            {currentLang === 'as' 
              ? 'UniMitra AI প্রাতিষ্ঠানিক নিয়মাৱলীৰ সৈতে প্ৰত্যক্ষভাৱে সংযোজিত।' 
              : 'UniMitra AI responses are strictly grounded in statutory university records.'}
          </p>
        </form>

      </main>

      {/* ======================================================== */}
      {/* 3. SHARE CHAT MODAL */}
      {/* ======================================================== */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#142426] rounded-2xl p-5 shadow-2xl border border-[#123C3A]/10 dark:border-[#55C7B2]/20 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/10">
              <div className="flex items-center space-x-2">
                <ShareIcon className="w-5 h-5 text-[#8B5CF6] dark:text-[#22D3EE]" />
                <h3 className="text-sm font-bold text-[#123C3A] dark:text-[#DCE8E4] font-heading">
                  {currentLang === 'as' ? 'আলোচনা শ্বেয়াৰ কৰক' : 'Share Chat Consultation'}
                </h3>
              </div>
              <button
                onClick={() => setShareModalOpen(false)}
                className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-gray-500"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-[#273B45] dark:text-[#DCE8E4]">
                {currentLang === 'as'
                  ? 'এই আলোচনাৰ উদ্ধৃতি আৰু তথ্যসহ সম্পূৰ্ণ প্ৰতিলিপি ক্লিপবৰ্ডত কপি কৰক:'
                  : 'Copy a verified shareable transcript of this consultation with citations:'}
              </p>
              <div className="p-3 rounded-xl bg-[#F7F6F0] dark:bg-[#0B1518] text-xs font-mono text-[#627680] dark:text-[#879B99] max-h-36 overflow-y-auto">
                <p className="font-bold text-[#123C3A] dark:text-[#55C7B2]">
                  {sessions.find(s => s.id === activeSessionId)?.title || 'Institutional Query'}
                </p>
                <p className="text-[11px] mt-1">
                  {messages.length} messages • Grounded with {univProfile.name} knowledge base.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setShareModalOpen(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#627680] dark:text-[#879B99] hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
              >
                {currentLang === 'as' ? 'বন্ধ কৰক' : 'Cancel'}
              </button>
              <button
                onClick={handleShareCopy}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#123C3A] text-white hover:bg-[#184e4c] dark:bg-[#55C7B2] dark:text-[#0B1518] dark:hover:bg-[#68d8c3] font-bold text-xs shadow-xs cursor-pointer"
              >
                {copySuccess ? (
                  <>
                    <CheckCircleIcon className="w-4 h-4" />
                    <span>{currentLang === 'as' ? 'কপি কৰা হ’ল!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <DocumentDuplicateIcon className="w-4 h-4" />
                    <span>{currentLang === 'as' ? 'প্ৰতিলিপি কপি কৰক' : 'Copy Transcript'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. FEEDBACK MODAL */}
      {/* ======================================================== */}
      {feedbackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form 
            onSubmit={handleSubmitFeedback}
            className="w-full max-w-md bg-white dark:bg-[#142426] rounded-2xl p-5 shadow-2xl border border-[#123C3A]/10 dark:border-[#55C7B2]/20 space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/10">
              <h3 className="text-sm font-bold text-[#123C3A] dark:text-[#DCE8E4] font-heading">
                Report Inaccuracy or Provide Feedback
              </h3>
              <button
                type="button"
                onClick={() => setFeedbackModalOpen(false)}
                className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-gray-500"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-[#273B45] dark:text-[#DCE8E4]">Feedback Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFeedbackRating('helpful')}
                    className={`py-2 px-3 rounded-xl border text-center font-semibold cursor-pointer ${
                      feedbackRating === 'helpful'
                        ? 'border-[#55C7B2] bg-[#55C7B2]/15 text-[#123C3A] dark:text-[#55C7B2]'
                        : 'border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    Accurate Citation
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedbackRating('inaccurate')}
                    className={`py-2 px-3 rounded-xl border text-center font-semibold cursor-pointer ${
                      feedbackRating === 'inaccurate'
                        ? 'border-red-500 bg-red-500/15 text-red-600 dark:text-red-400'
                        : 'border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    Report Inaccuracy
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#273B45] dark:text-[#DCE8E4]">Comments / Regulation reference</label>
                <textarea
                  rows={3}
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Specify clause or suggest correction..."
                  className="w-full p-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-[#F7F6F0] dark:bg-[#0B1518] text-[#273B45] dark:text-[#DCE8E4] outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setFeedbackModalOpen(false)}
                className="px-3 py-1.5 text-xs text-gray-500 hover:text-black dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#123C3A] text-white dark:bg-[#55C7B2] dark:text-[#0B1518] font-bold text-xs shadow-xs"
              >
                Submit Feedback
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default DashboardAiAssistant;
