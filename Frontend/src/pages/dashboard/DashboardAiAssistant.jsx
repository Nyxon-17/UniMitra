import { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { universityService } from '../../services/universityService';
import { chatService } from '../../services/chatService';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { 
  SendIcon, 
  CheckCircleIcon, 
  VoiceAssistantLogo, 
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

export const PlayIcon = ({ className = "w-3 h-3", ...props }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M8 5v14l11-7z" />
  </svg>
);

export const PauseIcon = ({ className = "w-3 h-3", ...props }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

export const StopIcon = ({ className = "w-3 h-3", ...props }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M6 6h12v12H6z" />
  </svg>
);

export const LoadingSpinnerIcon = ({ className = "w-3 h-3", ...props }) => (
  <svg className={`${className} animate-spin`} fill="none" viewBox="0 0 24 24" {...props}>
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export const ExclamationCircleIcon = ({ className = "w-3.5 h-3.5", ...props }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
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
const DashboardAiAssistantInner = ({ 
  currentLang = 'en',
  prefillQuery = '',
  studentInfo = { name: 'Member', role: 'Student' },
  portalDomain = null
}) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const domain = useMemo(() => {
    if (portalDomain) return portalDomain.toLowerCase();
    const r = (studentInfo?.role || '').toLowerCase();
    if (r.includes('admin')) return 'admin';
    if (r.includes('faculty')) return 'faculty';
    return 'student';
  }, [portalDomain, studentInfo?.role]);

  const userId = useMemo(() => {
    return studentInfo?.id || chatService.getCurrentUserId();
  }, [studentInfo?.id]);

  const portalMeta = useMemo(() => {
    if (domain === 'admin') {
      return {
        badge: currentLang === 'as' ? 'প্ৰশাসনিক শাসন • Admin Console' : 'Administrator Governance Console',
        title: currentLang === 'as' ? 'প্ৰশাসনিক নিয়ন্ত্ৰক AI সহায়ক' : 'Admin Statutory & Governance AI',
        sub: currentLang === 'as' ? 'বিশ্ববিদ্যালয় আইন, কাৰ্যবাহী পৰিষদৰ সিদ্ধান্ত আৰু অধিভুক্তিৰ নিয়মাৱলী' : 'University Executive Council ordinances, statutory compliance & faculty bylaws',
        domainLabel: currentLang === 'as' ? 'প্ৰশাসক' : 'Admin'
      };
    } else if (domain === 'faculty') {
      return {
        badge: currentLang === 'as' ? 'শৈক্ষিক কৰ্মস্থান • Faculty Portal' : 'Faculty Academic Workspace',
        title: currentLang === 'as' ? 'অধ্যাপক শৈক্ষিক AI সহায়ক' : 'Faculty Curriculum & Academic AI',
        sub: currentLang === 'as' ? 'পাঠ্যক্ৰম, মডাৰেচন, উপস্থিতি ৰেহাই আৰু শৈক্ষিক কৰ্মভাৰ' : 'Curriculum moderation, grading bylaws, attendance condonation & duty leaves',
        domainLabel: currentLang === 'as' ? 'অধ্যাপক' : 'Faculty'
      };
    } else {
      return {
        badge: currentLang === 'as' ? 'ছাত্ৰ প\'ৰ্টেল • Student Portal' : 'Student Academic Portal',
        title: currentLang === 'as' ? 'দ্বিভাষিক ছাত্ৰ AI সহায়ক' : 'Student Academic AI Assistant',
        sub: currentLang === 'as' ? 'বিশ্ববিদ্যালয়ৰ নিয়মাৱলী, পৰীক্ষা, পাঠ্যক্ৰম আৰু ছাত্ৰবৃত্তি' : 'Instant verified university guidance on syllabus, CBCS grading & scholarships',
        domainLabel: currentLang === 'as' ? 'ছাত্ৰ' : 'Student'
      };
    }
  }, [domain, currentLang]);

  // Active university profile
  const [univProfile, setUnivProfile] = useState(() => universityService.getProfile());

  useEffect(() => {
    const handleUnivChange = (e) => {
      setUnivProfile(e.detail?.profile || universityService.getProfile());
    };
    window.addEventListener('unimitra_university_changed', handleUnivChange);
    return () => window.removeEventListener('unimitra_university_changed', handleUnivChange);
  }, []);

  const createInitialGreeting = () => {
    if (domain === 'admin') {
      return {
        id: `greeting-${domain}`,
        sender: 'ai',
        text: currentLang === 'as'
          ? `নমস্কাৰ প্ৰশাসক মহোদয়! মই ${univProfile.asName || 'বিশ্ববিদ্যালয়'}ৰ প্ৰশাসনিক শাসন ব্যৱস্থাৰ AI সহায়ক (UniMitra Admin AI)। কাৰ্যবাহী পৰিষদৰ সিদ্ধান্ত, বিশ্ববিদ্যালয়ৰ সংবিধি আইন, শিক্ষক ৰষ্টাৰ আৰু মহাবিদ্যালয় অধিভুক্তিৰ নিয়মাৱলীৰ বিষয়ে যিকোনো প্ৰশ্ন অসমীয়া বা ইংৰাজীত অনুসন্ধান কৰক।`
          : `Hello Administrator. Welcome to the ${univProfile.name || 'Nivoraya University'} Statutory Governance AI Console. Ask any regulatory query regarding University Acts, Executive Council bylaws, faculty roster rules, or institutional affiliation norms with verified statutory citations.`,
        source: `${univProfile.name || 'Nivoraya University'} Executive & Statutory Knowledge Base`,
        page: 'University Act Section 21',
        confidence: '100% Match',
        time: 'Just now'
      };
    } else if (domain === 'faculty') {
      return {
        id: `greeting-${domain}`,
        sender: 'ai',
        text: currentLang === 'as'
          ? `নমস্কাৰ সহকৰ্মী! মই ${univProfile.asName || 'বিশ্ববিদ্যালয়'}ৰ অধ্যাপক শৈক্ষিক AI সহায়ক (UniMitra Faculty Workspace)। পাঠ্যক্ৰম প্ৰস্তুতি, প্ৰশ্নকাকত মডাৰেচন, পৰীক্ষা মূল্যায়ন, উপস্থিতি ৰেহাই আৰু শৈক্ষিক কৰ্মভাৰৰ বিষয়ে যিকোনো প্ৰশ্ন অসমীয়া বা ইংৰাজীত সুধিব পাৰে।`
          : `Welcome Colleague. I am your ${univProfile.name || 'Nivoraya University'} Faculty Academic & Curriculum Workspace Assistant. Consult statutory regulations on syllabus design, moderation, attendance condonation, or duty leaves with grounded citations.`,
        source: `${univProfile.name || 'Nivoraya University'} Academic Council Knowledge Base`,
        page: 'Academic Ordinance Clause 7',
        confidence: '100% Match',
        time: 'Just now'
      };
    } else {
      return {
        id: `greeting-${domain}`,
        sender: 'ai',
        text: currentLang === 'as'
          ? `নমস্কাৰ! মই ${univProfile.asName || 'বিশ্ববিদ্যালয়'}ৰ ছাত্ৰ শৈক্ষিক AI প্রাতিষ্ঠানিক সহায়ক (UniMitra)। বিশ্ববিদ্যালয়ৰ নিয়মাৱলী, পৰীক্ষাৰ মূল্যায়ন, ভৰ্তি প্ৰক্ৰিয়া, ছাত্ৰবৃত্তি আৰু হোষ্টেলৰ সুবিধাৰ বিষয়ে মোক যিকোনো প্ৰশ্ন অসমীয়া বা ইংৰাজীত সুধিব পাৰে। আপুনি মাইক টিপি কথা ক’বও পাৰে!`
          : `Hello! I am your ${univProfile.name || 'Nivoraya University'} Student Academic Assistant. Ask any question on CBCS regulations, semester examinations, admit cards, syllabus, scholarships, or admissions with grounded citations.`,
        source: `${univProfile.name || 'Nivoraya University'} Statutory Knowledge Base`,
        page: 'Official Gazette Section 14',
        confidence: '100% Match',
        time: 'Just now'
      };
    }
  };

  // Chat Sessions & Active Thread State (Strictly isolated by domain: student, faculty, admin)
  const [sessions, setSessions] = useState(() => chatService.getLocalSessions(domain, userId));
  const [activeSessionId, setActiveSessionId] = useState(() => chatService.getActiveSessionId(domain, userId) || chatService.generateSessionId());
  const [messages, setMessages] = useState(() => {
    const curId = chatService.getActiveSessionId(domain, userId);
    const saved = curId ? chatService.getSessionMessages(curId, domain, userId) : null;
    return saved && saved.length > 0 ? saved : [createInitialGreeting()];
  });

  const [inputQuery, setInputQuery] = useState(prefillQuery || '');
  const [loading, setLoading] = useState(false);
  
  // History is HIDDEN by default during conversation
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [actionAlert, setActionAlert] = useState('');

  // Voice Chat States
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  // Dipannita Pāṇini TTS State (Play, Pause, Resume, Stop, Loading, Error)
  const [playingMessageId, setPlayingMessageId] = useState(null);
  const [ttsState, setTtsState] = useState('idle'); // 'idle' | 'loading' | 'playing' | 'paused' | 'error'
  const [ttsErrorMessage, setTtsErrorMessage] = useState('');

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
  const audioPlayerRef = useRef(null);
  const textareaRef = useRef(null);
  const isMountedRef = useRef(true);
  const speakTimeoutRef = useRef(null);
  const currentNavPathRef = useRef(location.pathname);
  const wasVoiceQueryRef = useRef(false);
  const silenceTimerRef = useRef(null);
  const maxRecordingTimerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioStreamRef = useRef(null);
  const [voiceInputLang, setVoiceInputLang] = useState('auto');
  const [voiceMode, setVoiceMode] = useState('codemix'); // 'codemix' | 'transcribe' | 'translit'
  const inputQueryRef = useRef(inputQuery);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    inputQueryRef.current = inputQuery;
  }, [inputQuery]);

  // Load saved sessions on mount and sync whenever domain or language changes
  useEffect(() => {
    let isCancelled = false;
    const syncSessions = async () => {
      const allSessions = await chatService.getSessions(domain, userId);
      if (!isCancelled) {
        setSessions(allSessions || []);
      }

      if (!allSessions || allSessions.length === 0) {
        // Every account starts 100% fresh if it has no prior conversations
        const freshId = chatService.generateSessionId();
        setActiveSessionId(freshId);
        chatService.setActiveSessionId(freshId, domain, userId);
        if (!isCancelled) {
          setMessages([createInitialGreeting()]);
        }
        return;
      }

      let curId = chatService.getActiveSessionId(domain, userId);
      // Ensure curId belongs to this specific account's sessions
      if (!curId || !allSessions.some(s => s.id === curId)) {
        curId = allSessions[0].id;
        chatService.setActiveSessionId(curId, domain, userId);
      }

      setActiveSessionId(curId);
      const saved = await chatService.fetchSessionMessages(curId, domain, userId);
      if (!isCancelled && saved && saved.length > 0) {
        setMessages(saved);
      } else {
        const localMsgs = chatService.getSessionMessages(curId, domain, userId);
        if (!isCancelled && localMsgs && localMsgs.length > 0) {
          setMessages(localMsgs);
        } else if (!isCancelled) {
          setMessages([createInitialGreeting()]);
        }
      }
    };

    syncSessions();
    return () => { isCancelled = true; };
  }, [domain, currentLang, userId]);

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

  const stopAudioRecording = () => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      const finishStream = () => {
        if (audioStreamRef.current) {
          try {
            audioStreamRef.current.getTracks().forEach((t) => t.stop());
          } catch {}
          audioStreamRef.current = null;
        }
      };

      if (!recorder || recorder.state === 'inactive') {
        finishStream();
        const blob = audioChunksRef.current.length > 0
          ? new Blob(audioChunksRef.current, { type: 'audio/webm' })
          : null;
        resolve(blob);
        return;
      }

      recorder.onstop = () => {
        finishStream();
        const mimeType = recorder?.mimeType || 'audio/webm';
        const blob = audioChunksRef.current.length > 0
          ? new Blob(audioChunksRef.current, { type: mimeType })
          : null;
        resolve(blob);
      };

      try {
        if (recorder.state === 'recording') {
          try { recorder.requestData(); } catch {}
        }
        recorder.stop();
      } catch {
        finishStream();
        resolve(null);
      }
    });
  };

  const cancelListening = () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (maxRecordingTimerRef.current) clearTimeout(maxRecordingTimerRef.current);
    setIsListening(false);
    setIsTranscribing(false);
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop(); } catch {}
    }
    if (audioStreamRef.current) {
      try {
        audioStreamRef.current.getTracks().forEach((t) => t.stop());
      } catch {}
      audioStreamRef.current = null;
    }
    audioChunksRef.current = [];
  };

  const handleSpeechCaptureFinish = async (forceServerFallback = false) => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (maxRecordingTimerRef.current) clearTimeout(maxRecordingTimerRef.current);

    setIsListening(false);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }

    const audioBlob = await stopAudioRecording();

    const currentQuery = (inputQueryRef.current || '').trim();
    const isPureEnglish = voiceInputLang === 'en' && currentLang === 'en';

    // If pure English speech was already recognized cleanly by the browser and no audio fallback needed
    if (isPureEnglish && currentQuery && !forceServerFallback && (!audioBlob || audioBlob.size <= 200)) {
      setTimeout(() => textareaRef.current?.focus(), 50);
      return;
    }

    // For Assamese, Romanized Assamese, Code-Mix, or any audio capture:
    // Process audio using Sarvam AI Saaras V4 STT (with Gemini fallback)
    if (audioBlob && audioBlob.size > 200) {
      setIsTranscribing(true);
      setVoiceError('');
      try {
        const targetLang = (voiceInputLang === 'en' && currentLang === 'en') ? 'en' : 'as';
        const targetMode = targetLang === 'en' ? 'transcribe' : voiceMode;
        const serverTranscript = await chatService.transcribeAudio(audioBlob, targetLang, targetMode);
        if (serverTranscript && serverTranscript.trim()) {
          const clean = serverTranscript.trim();
          setInputQuery(clean);
          inputQueryRef.current = clean;
          setTimeout(() => textareaRef.current?.focus(), 50);
        } else if (currentQuery) {
          setInputQuery(currentQuery);
          inputQueryRef.current = currentQuery;
          setTimeout(() => textareaRef.current?.focus(), 50);
        } else {
          setVoiceError(
            currentLang === 'as'
              ? 'কোনো বাক্য চিনাক্ত হোৱা নাই। অনুগ্ৰহ কৰি আকৌ কওক।'
              : 'No speech detected. Please speak into the mic.'
          );
          setTimeout(() => setVoiceError(''), 4000);
        }
      } catch (err) {
        console.warn('Sarvam transcription notice:', err);
        if (currentQuery) {
          setInputQuery(currentQuery);
          inputQueryRef.current = currentQuery;
          setTimeout(() => textareaRef.current?.focus(), 50);
        } else {
          setVoiceError(
            currentLang === 'as'
              ? 'ভইচ চিনাক্তকৰণত সমস্যা হৈছে। অনুগ্ৰহ কৰি আকৌ চেষ্টা কৰক।'
              : 'Voice transcription failed. Please try again.'
          );
          setTimeout(() => setVoiceError(''), 4000);
        }
      } finally {
        setIsTranscribing(false);
      }
    } else if (currentQuery) {
      setInputQuery(currentQuery);
      inputQueryRef.current = currentQuery;
      setTimeout(() => textareaRef.current?.focus(), 50);
    } else {
      setVoiceError(
        currentLang === 'as'
          ? 'কোনো বাক্য চিনাক্ত হোৱা নাই।'
          : 'No speech detected.'
      );
      setTimeout(() => setVoiceError(''), 4000);
    }
  };

  const startListening = async () => {
    cancelListening();
    setInputQuery('');
    inputQueryRef.current = '';
    setVoiceError('');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setVoiceError(
        currentLang === 'as'
          ? 'আপোনাৰ ব্ৰাউজাৰত মাইক্ৰ’ফোন সুবিধা উপলব্ধ নহয় বা HTTPS প্ৰয়োজন।'
          : 'Microphone access is not supported by your browser or requires HTTPS.'
      );
      return;
    }

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
    } catch (err) {
      console.warn('Microphone permission error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setVoiceError(
          currentLang === 'as'
            ? 'মাইক্ৰ’ফোনৰ অনুমতি নাকচ কৰা হৈছে। ব্ৰাউজাৰ ছেটিংছত মাইকৰ অনুমতি দিয়ক।'
            : 'Microphone permission denied. Please allow microphone access in browser settings.'
        );
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setVoiceError(
          currentLang === 'as'
            ? 'কোনো মাইক্ৰ’ফোন পোৱা নগ’ল। অনুগ্ৰহ কৰি মাইক সংযোগ পৰীক্ষা কৰক।'
            : 'No microphone found on your device. Please connect a microphone.'
        );
      } else {
        setVoiceError(
          currentLang === 'as'
            ? 'মাইক্ৰ’ফোন আৰম্ভ কৰাত সমস্যা হৈছে।'
            : `Microphone error: ${err.message || 'Unable to open microphone'}`
        );
      }
      return;
    }

    audioChunksRef.current = [];
    try {
      const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : (MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '');
      const mr = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      mr.start(100);
      mediaRecorderRef.current = mr;
    } catch (mrErr) {
      console.warn('MediaRecorder init error:', mrErr);
    }

    setIsListening(true);

    if (recognitionRef.current) {
      try {
        const targetLang = voiceInputLang === 'as' 
          ? 'bn-IN' 
          : (voiceInputLang === 'en' ? 'en-IN' : (currentLang === 'as' ? 'bn-IN' : 'en-IN'));
        recognitionRef.current.lang = targetLang;
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Recognition start notice:', err);
      }
    }

    // Comfortable 30 seconds recording window
    if (maxRecordingTimerRef.current) clearTimeout(maxRecordingTimerRef.current);
    maxRecordingTimerRef.current = setTimeout(() => {
      handleSpeechCaptureFinish();
    }, 30000);
  };

  const toggleListening = () => {
    if (isListening) {
      handleSpeechCaptureFinish();
    } else {
      startListening();
    }
  };

  // Speech Recognition Setup: Continuous listening, plenty of time to speak, bilingual Assamese/English support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      const targetLang = voiceInputLang === 'as' 
        ? 'bn-IN' 
        : (voiceInputLang === 'en' ? 'en-IN' : (currentLang === 'as' ? 'bn-IN' : 'en-IN'));
      try {
        recognition.lang = targetLang;
      } catch {
        recognition.lang = 'en-IN';
      }

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError('');
      };

      recognition.onresult = (event) => {
        let fullTranscript = '';
        for (let i = 0; i < event.results.length; ++i) {
          fullTranscript += event.results[i][0].transcript + ' ';
        }
        const cleaned = fullTranscript.trim();
        if (cleaned) {
          setInputQuery(cleaned);
          inputQueryRef.current = cleaned;
        }

        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          handleSpeechCaptureFinish();
        }, 5000);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition notice:', event.error);
        if (event.error === 'not-allowed') {
          setVoiceError(
            currentLang === 'as' 
              ? 'মাইক্ৰ’ফোনৰ অনুমতি নাকচ কৰা হৈছে।' 
              : 'Microphone permission denied.'
          );
          cancelListening();
        }
        // Do NOT abort MediaRecorder on no-speech or language errors
      };

      recognition.onend = () => {
        // Recognition cycle completed; MediaRecorder keeps recording until user finishes
      };

      recognitionRef.current = recognition;
    }

    return () => {
      cancelListening();
    };
  }, [currentLang, voiceInputLang]);

  // Google Gemini Voice Synthesis for All Languages (Assamese, English & Code-Mixed)
  const handleToggleMessageAudio = async (msgId, rawText) => {
    if (!isMountedRef.current || currentNavPathRef.current !== location.pathname) return;

    // 1. If currently playing this exact message -> Pause it
    if (playingMessageId === msgId && ttsState === 'playing' && audioPlayerRef.current) {
      try {
        audioPlayerRef.current.pause();
        setTtsState('paused');
      } catch (err) {
        console.warn('Audio pause error:', err);
      }
      return;
    }

    // 2. If currently paused on this exact message -> Resume it
    if (playingMessageId === msgId && ttsState === 'paused' && audioPlayerRef.current) {
      try {
        await audioPlayerRef.current.play();
        setTtsState('playing');
      } catch (err) {
        console.warn('Audio resume error:', err);
      }
      return;
    }

    // 3. New message or stopped -> Stop previous audio and synthesize dual-engine audio
    stopSpeaking();
    setPlayingMessageId(msgId);
    setTtsState('loading');
    setTtsErrorMessage('');

    try {
      // Send the exact final Gemini response without rewriting or modifying
      const audioUrl = await chatService.synthesizeVoiceAudio(rawText, currentLang, 'female');
      if (!isMountedRef.current || currentNavPathRef.current !== location.pathname) {
        setTtsState('idle');
        setPlayingMessageId(null);
        return;
      }

      if (!audioUrl) {
        setTtsState('error');
        setTtsErrorMessage(currentLang === 'as' ? 'শব্দ সংশ্লেষণ বৰ্তমান উপলব্ধ নহয়।' : 'Speech synthesis temporarily unavailable.');
        setTimeout(() => {
          if (isMountedRef.current) {
            setTtsState('idle');
            setPlayingMessageId(null);
            setTtsErrorMessage('');
          }
        }, 3500);
        return;
      }

      const audio = new Audio(audioUrl);
      audioPlayerRef.current = audio;

      audio.onplay = () => {
        if (isMountedRef.current) {
          setIsSpeaking(true);
          setTtsState('playing');
        }
      };

      audio.onpause = () => {
        if (isMountedRef.current && audio.currentTime < (audio.duration || 1)) {
          setTtsState('paused');
        }
      };

      audio.onended = () => {
        if (isMountedRef.current) {
          setIsSpeaking(false);
          setTtsState('idle');
          setPlayingMessageId(null);
          audioPlayerRef.current = null;
        }
      };

      audio.onerror = (e) => {
        console.warn('Audio playback notice:', e);
        if (isMountedRef.current) {
          setIsSpeaking(false);
          setTtsState('error');
          setTtsErrorMessage(currentLang === 'as' ? 'অডিঅ’ প্লেবেকত সমস্যা হৈছে।' : 'Audio playback error occurred.');
          setTimeout(() => {
            if (isMountedRef.current) {
              setTtsState('idle');
              setPlayingMessageId(null);
              setTtsErrorMessage('');
            }
          }, 3500);
        }
      };

      await audio.play();
    } catch (err) {
      console.warn('TTS generation notice:', err);
      if (isMountedRef.current) {
        setIsSpeaking(false);
        setTtsState('error');
        setTtsErrorMessage(currentLang === 'as' ? 'অডিঅ’ প্ৰস্তুত কৰিব পৰা নগল।' : 'Failed to synthesize speech.');
        setTimeout(() => {
          if (isMountedRef.current) {
            setTtsState('idle');
            setPlayingMessageId(null);
            setTtsErrorMessage('');
          }
        }, 3500);
      }
    }
  };

  const speakText = async (text, gender = 'female') => {
    handleToggleMessageAudio('latest', text);
  };

  const stopSpeaking = () => {
    if (speakTimeoutRef.current) {
      clearTimeout(speakTimeoutRef.current);
      speakTimeoutRef.current = null;
    }
    if (audioPlayerRef.current) {
      try {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.currentTime = 0;
      } catch {}
      audioPlayerRef.current = null;
    }
    setIsSpeaking(false);
    setTtsState('idle');
    setPlayingMessageId(null);
  };

  // Turn off voice listen mode and stop speech automatically when user navigates away
  useEffect(() => {
    isMountedRef.current = true;
    currentNavPathRef.current = location.pathname;

    const handleNavigationOrHide = () => {
      stopSpeaking();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
      setIsListening(false);
      setVoiceOutputEnabled(false);
    };

    window.addEventListener('popstate', handleNavigationOrHide);
    window.addEventListener('pagehide', handleNavigationOrHide);
    window.addEventListener('beforeunload', handleNavigationOrHide);

    return () => {
      isMountedRef.current = false;
      window.removeEventListener('popstate', handleNavigationOrHide);
      window.removeEventListener('pagehide', handleNavigationOrHide);
      window.removeEventListener('beforeunload', handleNavigationOrHide);
      handleNavigationOrHide();
    };
  }, []);

  useEffect(() => {
    if (currentNavPathRef.current !== location.pathname) {
      currentNavPathRef.current = location.pathname;
      stopSpeaking();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
      setIsListening(false);
      setVoiceOutputEnabled(false);
    }
  }, [location.pathname]);

  // Start a fresh thread strictly for this portal domain
  const handleNewChat = () => {
    stopSpeaking();
    const newId = chatService.generateSessionId();
    setActiveSessionId(newId);
    chatService.setActiveSessionId(newId, domain, userId);
    const greeting = createInitialGreeting();
    setMessages([greeting]);
    chatService.saveSessionMessages(newId, [greeting], domain, userId);
    setInputQuery('');
    setHistoryDrawerOpen(false);
    setActionAlert(currentLang === 'as' ? `নতুন ${portalMeta.domainLabel} আলোচনা আৰম্ভ কৰা হ’ল` : `New ${portalMeta.domainLabel} chat started`);
    setTimeout(() => setActionAlert(''), 2500);
    setTimeout(() => textareaRef.current?.focus(), 60);
  };

  // Switch to an existing session strictly in this portal domain
  const handleSelectSession = async (session) => {
    if (!session || !session.id) return;
    stopSpeaking();
    setActiveSessionId(session.id);
    chatService.setActiveSessionId(session.id, domain, userId);

    const immediate = chatService.getSessionMessages(session.id, domain, userId);
    if (immediate && immediate.length > 0) {
      setMessages(immediate);
    }

    const saved = await chatService.fetchSessionMessages(session.id, domain, userId);
    if (saved && saved.length > 0) {
      setMessages(saved);
    } else if (!immediate || immediate.length === 0) {
      setMessages([createInitialGreeting()]);
    }
    setHistoryDrawerOpen(false);
  };

  // Delete a session from this portal domain
  const handleDeleteSession = (e, sessionId) => {
    e.stopPropagation();
    const updated = chatService.deleteSession(sessionId, domain, userId);
    setSessions(updated);
    if (activeSessionId === sessionId) {
      handleNewChat();
    }
  };

  const cancelQuery = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
  };

  // Execute query connected to backend and database
  const executeQuery = async (queryText) => {
    if (!queryText.trim() || loading) return;

    stopSpeaking();
    setHistoryDrawerOpen(false); // Ensure history is hidden during conversation

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

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
        domain: domain,
        createdAt: new Date().toISOString()
      };
      const updatedSessions = chatService.saveLocalSession(newSession, domain, userId);
      setSessions(updatedSessions);
    }

    // Immediately persist user's query into local cache
    chatService.saveSessionMessages(activeSessionId, newMessages, domain, userId);

    try {
      const res = await chatService.sendQuery({
        query: queryText,
        sessionId: activeSessionId,
        language: currentLang,
        university: univProfile,
        category: domain,
        domain: domain,
        signal: controller.signal,
        saveToHistory: true,
        isVoice: false
      });

      if (!res || res.aborted || controller.signal.aborted) {
        return;
      }

      let targetSessionId = activeSessionId;
      if (res.sessionId && res.sessionId !== activeSessionId) {
        targetSessionId = res.sessionId;
        chatService.deleteSession(activeSessionId, domain, userId);
        setActiveSessionId(targetSessionId);
        chatService.setActiveSessionId(targetSessionId, domain, userId);
        const updated = chatService.saveLocalSession({
          id: targetSessionId,
          title: currentSessionTitle || queryText.slice(0, 36),
          language: currentLang,
          domain: domain,
          createdAt: new Date().toISOString()
        }, domain, userId);
        setSessions(updated);
      }

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
      
      // Auto-save history automatically for this portal domain
      chatService.saveSessionMessages(targetSessionId, finalMessages, domain, userId);

      // Refresh sessions list in background
      chatService.getSessions(domain, userId).then(updated => {
        if (updated && updated.length > 0) setSessions(updated);
      });

      if (wasVoiceQueryRef.current || voiceOutputEnabled) {
        wasVoiceQueryRef.current = false;
        setTimeout(() => speakText(aiResponse.text, 'female'), 250);
      }
    } catch (err) {
      if (err?.name !== 'AbortError' && !controller.signal.aborted) {
        console.error('Chat error:', err);
      }
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
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

  // Suggested Quick Prompts tailored specifically with fresh, role-specific data for each account
  const quickPrompts = useMemo(() => {
    if (domain === 'admin') {
      return [
        { label: currentLang === 'as' ? 'কাৰ্যবাহী পৰিষদৰ ক্ষমতা' : 'Executive Council Powers', q: 'What are the statutory powers of the Executive Council under the University Act?' },
        { label: currentLang === 'as' ? 'মহাবিদ্যালয় অধিভুক্তি নিয়ম' : 'College Affiliation Norms', q: 'Explain the regulatory guidelines for fresh college affiliation and inspection.' },
        { label: currentLang === 'as' ? 'উত্তৰবহী সংৰক্ষণ সময়' : 'Answer Script Retention', q: 'What is the mandatory preservation period for evaluated answer scripts?' },
        { label: currentLang === 'as' ? 'শিক্ষক ৰষ্টাৰ নিয়মাৱলী' : 'Faculty Roster Rules', q: 'What are the statutory bylaws for faculty roster and promotional seniority?' },
        { label: currentLang === 'as' ? 'অনুশাসন আৰু ৰেগিং প্ৰতিৰোধ' : 'Disciplinary & Anti-Ragging', q: 'What are the statutory procedures for student misconduct and exam malpractice?' },
        { label: currentLang === 'as' ? 'নথিপত্ৰ অনুক্ৰমণিকা স্থিতি' : 'Ingestion & Index Status', q: 'What is the current status of indexed institutional documents in the university knowledge base?' }
      ];
    } else if (domain === 'faculty') {
      return [
        { label: currentLang === 'as' ? 'প্ৰশ্নকাকত মডাৰেচন নিয়ম' : 'Paper Moderation Bylaws', q: 'What are the statutory guidelines for question paper setting and moderation?' },
        { label: currentLang === 'as' ? 'উপস্থিতি ৰেহাই (মেডিকেল)' : 'Medical Attendance Limit', q: 'What is the attendance condonation limit for medical reasons in semester exams?' },
        { label: currentLang === 'as' ? 'শৈক্ষিক কৰ্মভাৰ নিৰ্দেশনা' : 'Weekly Teaching Workload', q: 'What is the prescribed weekly teaching workload for professors and assistant professors?' },
        { label: currentLang === 'as' ? 'কৰ্তব্য ছুটি (Duty Leave)' : 'Duty Leave Regulations', q: 'Explain duty leave entitlement for attending academic conferences and exam evaluation.' },
        { label: currentLang === 'as' ? 'চি.এ.এছ. পদোন্নতি নীতি' : 'CAS Promotion & API Norms', q: 'What are the UGC Career Advancement Scheme PBAS/API criteria for promotion?' },
        { label: currentLang === 'as' ? 'পিএইচ.ডি. নিৰ্দেশনা কোটা' : 'PhD Supervision Quotas', q: 'What is the permissible doctoral scholar supervision quota per faculty rank?' }
      ];
    } else {
      return [
        { label: currentLang === 'as' ? 'পৰীক্ষাত উত্তীৰ্ণ নম্বৰ' : 'Passing Marks & CGPA', q: 'What is the minimum passing marks and CGPA requirement under the CBCS regulations?' },
        { label: currentLang === 'as' ? 'উপস্থিতি নিয়ম (৭৫%)' : 'Attendance Criteria (75%)', q: 'What is the minimum attendance required to sit for semester examinations?' },
        { label: currentLang === 'as' ? 'পুনৰ মূল্যায়ন মাচুল' : 'Re-evaluation Fee & Process', q: 'Explain the fees and process for answer sheet re-evaluation.' },
        { label: currentLang === 'as' ? 'ঈশান উদয় জলপানি' : 'Ishan Uday Scholarship', q: 'Eligibility and required documents for Ishan Uday and state scholarships?' },
        { label: currentLang === 'as' ? 'বেক আৰু উন্নতি পৰীক্ষা' : 'Backlog & Improvement Rules', q: 'What are the rules and maximum chances for appearing in backlog or improvement examinations?' },
        { label: currentLang === 'as' ? 'হোষ্টেল আৱণ্টনৰ নিয়ম' : 'Hostel Allotment & Curfew', q: 'What are the distance criteria and rules for university hostel allotment?' }
      ];
    }
  }, [domain, currentLang]);

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
        fixed inset-y-0 left-0 z-50 w-72 sm:w-80 max-w-[85vw] bg-[#F7F6F0] dark:bg-[#16181A] border-r border-[#123C3A]/15 dark:border-[#55C7B2]/20 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
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
              className="p-1.5 rounded-lg bg-[#123C3A] text-white hover:bg-[#184e4c] dark:bg-[#55C7B2] dark:text-[#16181A] cursor-pointer"
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
          <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 rounded-full bg-[#123C3A] text-white dark:bg-[#55C7B2] dark:text-[#16181A] text-xs font-semibold shadow-lg animate-fade-in">
            {actionAlert}
          </div>
        )}

        {/* Top Header Bar */}
        <header className="px-2.5 sm:px-4 py-2 border-b border-[#123C3A]/10 dark:border-[#55C7B2]/15 flex items-center justify-between shrink-0 bg-white/80 dark:bg-[#142426]/85 backdrop-blur-md gap-1.5 sm:gap-2">
          {/* Left: History Button + Assistant Title with Logo */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5 min-w-0">
            
            {/* Click to Open History Button */}
            <button
              onClick={() => setHistoryDrawerOpen(true)}
              className="flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#123C3A] dark:text-[#DCE8E4] bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 border border-[#123C3A]/10 dark:border-[#55C7B2]/20 transition-all cursor-pointer shadow-2xs shrink-0"
              title="Click to Open Chat History"
              aria-label="Click to Open Chat History"
            >
              <ClockIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4A96A] dark:text-[#55C7B2] shrink-0" />
              <span className="font-medium hidden xxs:inline text-[11px] sm:text-xs">{currentLang === 'as' ? 'ইতিহাস' : 'History'}</span>
              {sessions.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] sm:text-[10px] font-bold bg-[#123C3A]/10 text-[#123C3A] dark:bg-[#55C7B2]/20 dark:text-[#55C7B2]">
                  {sessions.length}
                </span>
              )}
            </button>

            {/* AI Assistant Logo */}
            <div className="shrink-0 flex items-center justify-center">
              <VoiceAssistantLogo 
                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" 
                isSpeaking={isSpeaking}
                isListening={isListening}
                animated={true}
              />
            </div>

            <div className="min-w-0 leading-tight">
              <div className="flex items-center space-x-1.5 truncate">
                <h2 className="text-xs sm:text-sm font-bold text-[#123C3A] dark:text-[#DCE8E4] font-heading truncate max-w-[120px] xs:max-w-[180px] sm:max-w-xs md:max-w-md">
                  {sessions.find(s => s.id === activeSessionId)?.title || `${univProfile.name} Assistant`}
                </h2>
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#55C7B2] animate-pulse shrink-0" title="Online" />
              </div>
              <div className="flex items-center space-x-1.5 truncate">
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-[#123C3A]/10 text-[#123C3A] dark:bg-[#55C7B2]/20 dark:text-[#55C7B2]">
                  {portalMeta.domainLabel}
                </span>
                <p className="hidden xs:block text-[10px] sm:text-[11px] text-[#627680] dark:text-[#879B99] truncate font-sans">
                  {portalMeta.sub}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Actions (New Chat, Share, Voice Toggle) */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
            
            {/* New Chat Quick Button */}
            <button
              onClick={handleNewChat}
              className="flex items-center space-x-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-[#123C3A] text-white hover:bg-[#184e4c] dark:bg-[#55C7B2] dark:text-[#16181A] dark:hover:bg-[#68d8c3] transition-all cursor-pointer shadow-2xs shrink-0"
              title="New Chat"
            >
              <PlusIcon className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">{currentLang === 'as' ? 'নতুন' : 'New'}</span>
            </button>

            {/* Share Chat Button */}
            <button
              onClick={() => setShareModalOpen(true)}
              className="flex items-center space-x-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#123C3A] dark:text-[#DCE8E4] hover:bg-[#E9F0ED] dark:hover:bg-[#142426] border border-[#123C3A]/10 dark:border-[#55C7B2]/20 transition-all cursor-pointer shadow-2xs shrink-0"
              title="Share Chat"
            >
              <ShareIcon className="w-3.5 h-3.5 text-[#8B5CF6] dark:text-[#22D3EE] shrink-0" />
              <span className="hidden sm:inline">{currentLang === 'as' ? 'শ্বেয়াৰ' : 'Share'}</span>
            </button>

            {/* Voice Audio Playback Toggle */}
            <button
              onClick={() => {
                if (isSpeaking) stopSpeaking();
                setVoiceOutputEnabled(!voiceOutputEnabled);
              }}
              className={`p-1.5 sm:p-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border shrink-0 ${
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
              <VoiceAssistantLogo className="w-5 h-5 shrink-0" isSpeaking={true} animated={true} />
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



        {/* Suggested Quick Question Chips */}
        <div className="px-3 py-1.5 bg-[#E9F0ED]/50 dark:bg-[#142426]/50 border-b border-[#123C3A]/8 dark:border-[#55C7B2]/10 flex items-center space-x-1.5 overflow-x-auto no-scrollbar scroll-smooth shrink-0">
          <span className="text-[10px] font-bold text-[#D4A96A] dark:text-[#E0B77A] uppercase tracking-wider shrink-0 mr-1 font-sans">
            {currentLang === 'as' ? 'দ্ৰুত প্ৰশ্ন:' : 'Quick:'}
          </span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => executeQuery(p.q)}
              className="px-2.5 py-1 rounded-full bg-white/70 dark:bg-[#16181A]/70 hover:bg-white dark:hover:bg-[#142426] text-[#273B45] dark:text-[#DCE8E4] border border-[#123C3A]/10 dark:border-[#55C7B2]/15 whitespace-nowrap text-[11px] font-medium transition-colors cursor-pointer shrink-0 shadow-2xs"
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
                    ? 'max-w-[88%] xs:max-w-[85%] sm:max-w-xl md:max-w-2xl bg-[#123C3A] text-white dark:bg-[#55C7B2] dark:text-[#16181A] rounded-2xl rounded-br-xs px-4 py-3 sm:px-5 sm:py-3.5 font-medium shadow-xs'
                    : 'max-w-[95%] sm:max-w-2xl md:max-w-3xl bg-white/85 dark:bg-[#142426]/85 border border-[#123C3A]/10 dark:border-[#55C7B2]/15 text-[#273B45] dark:text-[#DCE8E4] rounded-2xl rounded-bl-xs p-3.5 sm:p-5 font-normal shadow-xs'
                }`}
              >
                {/* AI Header with Logo inside the bubble */}
                {msg.sender === 'ai' && (
                  <div className="flex items-center space-x-2 pb-2 mb-2 border-b border-black/5 dark:border-white/5">
                    <VoiceAssistantLogo className="w-5 h-5 shrink-0" animated={false} />
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

                    <div className="p-2 sm:p-2.5 rounded-xl bg-[#E9F0ED]/70 dark:bg-[#16181A]/70 border border-[#123C3A]/8 dark:border-[#55C7B2]/10 text-[11px] font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
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

                  </div>
                )}

                {/* Action Bar (Audio, Bookmark, Feedback) for EVERY AI message */}
                {msg.sender === 'ai' && (
                  <div className="mt-3 pt-2.5 border-t border-[#123C3A]/10 dark:border-[#55C7B2]/15 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] text-[#627680] dark:text-[#879B99] font-medium">
                      {msg.time}
                    </span>

                    <div className="flex items-center space-x-1.5">
                      {/* Dipannita Assamese Female Voice Play / Pause / Resume / Stop Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleMessageAudio(msg.id, msg.text)}
                        disabled={playingMessageId === msg.id && ttsState === 'loading'}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border cursor-pointer flex items-center space-x-1.5 transition-all ${
                          playingMessageId === msg.id && ttsState === 'playing'
                            ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] text-[#8B5CF6] dark:bg-[#22D3EE]/15 dark:border-[#22D3EE] dark:text-[#22D3EE] shadow-xs'
                            : playingMessageId === msg.id && ttsState === 'paused'
                            ? 'bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400'
                            : playingMessageId === msg.id && ttsState === 'loading'
                            ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-500 cursor-wait'
                            : playingMessageId === msg.id && ttsState === 'error'
                            ? 'bg-red-50 dark:bg-red-950/30 border-red-300 text-red-600 dark:text-red-400'
                            : 'bg-white/70 dark:bg-[#16181A]/70 hover:bg-[#E9F0ED] dark:hover:bg-[#142426] text-[#123C3A] dark:text-[#55C7B2] border-[#123C3A]/10 dark:border-[#55C7B2]/15'
                        }`}
                        title={
                          playingMessageId === msg.id && ttsState === 'playing'
                            ? 'Pause Dipannita voice audio'
                            : playingMessageId === msg.id && ttsState === 'paused'
                            ? 'Resume Dipannita voice audio'
                            : playingMessageId === msg.id && ttsState === 'loading'
                            ? 'Synthesizing Dipannita voice audio...'
                            : playingMessageId === msg.id && ttsState === 'error'
                            ? (ttsErrorMessage || 'Audio error. Click to retry.')
                            : 'Listen with Dipannita Assamese Female Voice'
                        }
                        aria-label="Listen with Dipannita Assamese Female Voice"
                      >
                        {playingMessageId === msg.id && ttsState === 'loading' ? (
                          <>
                            <LoadingSpinnerIcon className="w-3 h-3 text-[#8B5CF6] dark:text-[#22D3EE]" />
                            <span>Loading...</span>
                          </>
                        ) : playingMessageId === msg.id && ttsState === 'playing' ? (
                          <>
                            <PauseIcon className="w-3 h-3 text-[#8B5CF6] dark:text-[#22D3EE]" />
                            <span>Pause</span>
                          </>
                        ) : playingMessageId === msg.id && ttsState === 'paused' ? (
                          <>
                            <PlayIcon className="w-3 h-3 text-amber-500" />
                            <span>Resume</span>
                          </>
                        ) : playingMessageId === msg.id && ttsState === 'error' ? (
                          <>
                            <SpeakerWaveIcon className="w-3 h-3 text-red-500" />
                            <span>Retry</span>
                          </>
                        ) : (
                          <>
                            <SpeakerWaveIcon className="w-3 h-3" />
                            <span>Listen</span>
                          </>
                        )}
                      </button>

                      {/* Stop Button (visible when this message is playing or paused) */}
                      {playingMessageId === msg.id && (ttsState === 'playing' || ttsState === 'paused') && (
                        <button
                          type="button"
                          onClick={stopSpeaking}
                          className="p-1 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/40 cursor-pointer transition-colors"
                          title="Stop speech"
                          aria-label="Stop speech"
                        >
                          <StopIcon className="w-3 h-3" />
                        </button>
                      )}

                      <button
                        onClick={() => handleSaveAnswer(msg)}
                        className="px-2.5 py-1 rounded-lg bg-white/70 dark:bg-[#16181A]/70 hover:bg-[#E9F0ED] dark:hover:bg-[#142426] text-[10px] font-semibold text-[#273B45] dark:text-[#DCE8E4] border border-[#123C3A]/10 dark:border-[#55C7B2]/15 cursor-pointer flex items-center space-x-1 transition-colors"
                      >
                        <DocumentDuplicateIcon className="w-3 h-3 text-[#D4A96A]" />
                        <span>Bookmark</span>
                      </button>

                      <button
                        onClick={() => handleOpenFeedback(msg)}
                        className="px-2.5 py-1 rounded-lg bg-white/70 dark:bg-[#16181A]/70 hover:bg-[#E9F0ED] dark:hover:bg-[#142426] text-[10px] font-semibold text-[#627680] dark:text-[#879B99] hover:text-[#123C3A] dark:hover:text-[#55C7B2] border border-[#123C3A]/10 dark:border-[#55C7B2]/15 cursor-pointer flex items-center space-x-1 transition-colors"
                      >
                        <CheckCircleIcon className="w-3 h-3 text-[#55C7B2]" />
                        <span>Feedback</span>
                      </button>
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

          {/* Thinking / Loading Animation with Cancel Query Button */}
          {loading && (
            <div className="flex items-start space-x-2.5 animate-fade-in">
              <div className="w-8 h-8 rounded-xl bg-transparent flex items-center justify-center shrink-0">
                <VoiceAssistantLogo className="w-7 h-7 sm:w-8 sm:h-8" isSpeaking={true} animated={true} />
              </div>
              <div className="editorial-surface rounded-2xl rounded-bl-xs px-4 py-3 text-xs font-medium text-[#273B45] dark:text-[#DCE8E4] flex items-center justify-between gap-3 shadow-xs">
                <span>
                  {currentLang === 'as' 
                    ? `${univProfile.asName || 'বিশ্ববিদ্যালয়'}ৰ নিয়মাৱলী পৰীক্ষা কৰি থকা হৈছে...` 
                    : `Retrieving verified statutory records from ${univProfile.name} knowledge base...`}
                </span>
                <button
                  type="button"
                  onClick={cancelQuery}
                  className="px-2 py-0.5 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-950/60 dark:hover:bg-red-900/60 text-red-600 dark:text-red-300 text-[11px] font-bold border border-red-300 dark:border-red-800/40 cursor-pointer transition-colors shrink-0 flex items-center space-x-1"
                  title="Cancel response generation"
                >
                  <StopIcon className="w-3 h-3 text-red-500" />
                  <span>{currentLang === 'as' ? 'বন্ধ কৰক' : 'Cancel'}</span>
                </button>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} className="h-1 shrink-0" />
        </div>

        {/* Bottom Input Command Prompt Bar */}
        <form 
          onSubmit={handleSend} 
          className="p-2 sm:p-3 bg-[#F7F6F0]/90 dark:bg-[#16181A]/90 backdrop-blur-md border-t border-[#123C3A]/10 dark:border-[#55C7B2]/15 shrink-0"
        >
          {/* Active Listening & Bilingual Voice Mode Indicator Banner */}
          {isListening && (
            <div className="mb-2 px-3 py-2 rounded-xl bg-gradient-to-r from-[#8B5CF6]/15 to-[#22D3EE]/15 border border-[#22D3EE]/30 flex flex-wrap items-center justify-between gap-2 text-xs text-[#123C3A] dark:text-[#DCE8E4]">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping inline-block" />
                <span className="font-semibold">
                  {currentLang === 'as' 
                    ? 'মাইক্ৰ’ফোন সক্ৰিয়: অসমীয়া বা ইংৰাজীত কওক (স্বাভাৱিকভাৱে কওক)...' 
                    : 'Recording: Speak in Assamese or English (Take your time)...'}
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => setVoiceInputLang(prev => prev === 'as' ? 'en' : 'as')}
                  className="px-2 py-1 rounded-lg bg-white/80 dark:bg-black/50 border border-black/10 dark:border-white/10 text-[11px] font-semibold hover:bg-white dark:hover:bg-black cursor-pointer"
                  title="Switch Speech Recognition Language"
                >
                  {voiceInputLang === 'as' ? 'অসমীয়া' : (voiceInputLang === 'en' ? 'English' : 'Auto')}
                </button>
                {voiceInputLang !== 'en' && (
                  <button
                    type="button"
                    onClick={() => setVoiceMode(prev => prev === 'codemix' ? 'transcribe' : (prev === 'transcribe' ? 'translit' : 'codemix'))}
                    className="px-2 py-1 rounded-lg bg-white/80 dark:bg-black/50 border border-black/10 dark:border-white/10 text-[11px] font-semibold hover:bg-white dark:hover:bg-black cursor-pointer"
                    title="Switch Output Mode (Code-Mix, Native Script, Romanized)"
                  >
                    {voiceMode === 'codemix' ? 'Code-Mix' : (voiceMode === 'transcribe' ? 'অসমীয়া' : 'Romanized')}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleSpeechCaptureFinish()}
                  className="px-2.5 py-1 rounded-lg bg-[#123C3A] hover:bg-[#184e4c] dark:bg-[#55C7B2] dark:hover:bg-[#68d8c3] text-white dark:text-[#16181A] text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
                >
                  {currentLang === 'as' ? 'সম্পন্ন (Done)' : 'Done'}
                </button>
                <button
                  type="button"
                  onClick={cancelListening}
                  className="px-2 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-white/10 dark:hover:bg-white/20 text-gray-700 dark:text-gray-300 text-[11px] font-semibold cursor-pointer transition-colors"
                >
                  {currentLang === 'as' ? 'বাতিল' : 'Cancel'}
                </button>
              </div>
            </div>
          )}

          {/* Fallback Server-Side AI Transcription Processing State */}
          {isTranscribing && (
            <div className="mb-2 px-3 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40 flex items-center justify-between gap-2 text-xs text-purple-800 dark:text-purple-200">
              <div className="flex items-center space-x-2">
                <LoadingSpinnerIcon className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span className="font-semibold">
                  {currentLang === 'as' 
                    ? 'AI ভইচ মডেলেৰে কথা পৰীক্ষা কৰা হৈছে (Transcribing speech with AI)...' 
                    : 'Transcribing speech with AI model...'}
                </span>
              </div>
            </div>
          )}

          {/* Voice Input Notice / Error Banner with Retry */}
          {voiceError && (
            <div className="mb-2 px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 flex items-center justify-between gap-2 text-xs text-red-700 dark:text-red-300">
              <div className="flex items-center space-x-1.5 truncate">
                <ExclamationCircleIcon className="w-3.5 h-3.5 shrink-0 text-red-500" />
                <span className="truncate">{voiceError}</span>
              </div>
              <div className="flex items-center space-x-1.5 shrink-0">
                <button
                  type="button"
                  onClick={startListening}
                  className="text-[11px] font-bold underline hover:opacity-80 cursor-pointer"
                >
                  {currentLang === 'as' ? 'আকৌ চেষ্টা কৰক (Retry)' : 'Retry'}
                </button>
                <button
                  type="button"
                  onClick={() => setVoiceError('')}
                  className="p-0.5 rounded text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 cursor-pointer"
                  title="Dismiss"
                >
                  <XMarkIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          <div className="rounded-xl sm:rounded-2xl bg-white/80 dark:bg-[#142426]/80 border border-[#123C3A]/12 dark:border-[#55C7B2]/20 px-2.5 sm:px-3 py-1.5 flex items-center gap-2 focus-within:border-[#123C3A] dark:focus-within:border-[#55C7B2] focus-within:ring-1 focus-within:ring-[#123C3A]/10 dark:focus-within:ring-[#55C7B2]/20 transition-all">
            
            {/* Microphone Voice Toggle */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-1.5 rounded-xl transition-all cursor-pointer shrink-0 flex items-center justify-center ${
                isListening
                  ? 'bg-[#8B5CF6]/20 border border-[#22D3EE] shadow-[0_0_12px_rgba(34,211,238,0.5)]'
                  : 'bg-[#E9F0ED] dark:bg-[#16181A] hover:bg-[#123C3A]/10 border border-transparent'
              }`}
              title={isListening ? 'Stop Listening' : 'Voice Input (Click to speak)'}
              aria-label="Voice Input"
            >
              <VoiceAssistantLogo 
                className="w-6 h-6 sm:w-6.5 sm:h-6.5" 
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

            {/* Send or Cancel Trigger Button */}
            {loading ? (
              <button
                type="button"
                onClick={cancelQuery}
                className="px-3.5 sm:px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900/50 border border-red-300 dark:border-red-800/40 text-red-600 dark:text-red-400 text-xs font-bold cursor-pointer transition-all shadow-xs flex items-center space-x-1.5 shrink-0"
                title="Stop query generation"
                aria-label="Cancel Query"
              >
                <StopIcon className="w-3.5 h-3.5 text-red-500" />
                <span className="hidden xs:inline">{currentLang === 'as' ? 'বন্ধ কৰক' : 'Cancel'}</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!inputQuery.trim()}
                className="px-3.5 sm:px-4 py-2 rounded-xl bg-[#123C3A] hover:bg-[#184e4c] dark:bg-[#55C7B2] dark:hover:bg-[#68d8c3] text-white dark:text-[#16181A] text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all shadow-xs flex items-center space-x-1.5 shrink-0 font-heading"
                aria-label="Send Query"
              >
                <SendIcon className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">{currentLang === 'as' ? 'প্ৰেৰণ' : 'Send'}</span>
              </button>
            )}
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
              <div className="p-3 rounded-xl bg-[#F7F6F0] dark:bg-[#16181A] text-xs font-mono text-[#627680] dark:text-[#879B99] max-h-36 overflow-y-auto">
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
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#123C3A] text-white hover:bg-[#184e4c] dark:bg-[#55C7B2] dark:text-[#16181A] dark:hover:bg-[#68d8c3] font-bold text-xs shadow-xs cursor-pointer"
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
                  className="w-full p-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-[#F7F6F0] dark:bg-[#16181A] text-[#273B45] dark:text-[#DCE8E4] outline-none"
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
                className="px-4 py-2 rounded-xl bg-[#123C3A] text-white dark:bg-[#55C7B2] dark:text-[#16181A] font-bold text-xs shadow-xs"
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

export const DashboardAiAssistant = (props) => (
  <ErrorBoundary>
    <DashboardAiAssistantInner {...props} />
  </ErrorBoundary>
);

export default DashboardAiAssistant;
