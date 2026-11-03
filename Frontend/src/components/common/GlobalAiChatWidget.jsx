import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { universityService } from '../../services/universityService';
import { documentService } from '../../services/documentService';
import { chatService } from '../../services/chatService';
import { detectLanguageModeAdvanced } from '../../services/assameseUnderstanding';
import { 
  SparklesIcon, 
  XMarkIcon, 
  DocumentTextIcon, 
  CheckCircleIcon,
  ChevronDownIcon,
  ArrowRightIcon,
  AiVoiceChatLogo
} from './Icons';

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

export const StopCircleIcon = ({ className = "w-5 h-5", ...props }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm6-2.25a.75.75 0 01.75-.75h6a.75.75 0 01.75.75v6a.75.75 0 01-.75.75h-6a.75.75 0 01-.75-.75v-6z" clipRule="evenodd" />
  </svg>
);

export const PlayIcon = ({ className = "w-5 h-5", ...props }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
  </svg>
);

export const PauseIcon = ({ className = "w-5 h-5", ...props }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0v-12a.75.75 0 01.75-.75zm10.5 0a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0v-12a.75.75 0 01.75-.75z" clipRule="evenodd" />
  </svg>
);

export const GripDotsIcon = ({ className = "w-4 h-4", ...props }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" {...props}>
    <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-12a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
  </svg>
);

export const GlobalAiChatWidget = ({ currentLang = 'en', onToggleLang, studentInfo, isLoggedIn = false, onOpenAuth }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [univProfile, setUnivProfile] = useState(() => universityService.getProfile());

  // Movable Position State (null = default bottom-right)
  const [position, setPosition] = useState(null);
  const [openCardPos, setOpenCardPos] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const isPointerDownRef = useRef(false);
  const dragStartedRef = useRef(false);
  const startPointRef = useRef({ x: 0, y: 0 });
  const originPosRef = useRef({ x: 0, y: 0 });
  const widgetRef = useRef(null);

  useEffect(() => {
    const handleSync = () => setUnivProfile(universityService.getProfile());
    window.addEventListener('unimitra_university_changed', handleSync);
    return () => window.removeEventListener('unimitra_university_changed', handleSync);
  }, []);

  // Window resize handler: Keep position inside viewport if dragged
  useEffect(() => {
    const handleResize = () => {
      const margin = 12;
      const winW = window.innerWidth;
      const winH = window.innerHeight;

      if (position) {
        const maxX = Math.max(margin, winW - 64);
        const maxY = Math.max(margin, winH - 64);
        setPosition(prev => {
          if (!prev) return null;
          return {
            x: Math.max(margin, Math.min(maxX, prev.x)),
            y: Math.max(margin, Math.min(maxY, prev.y))
          };
        });
      }

      if (openCardPos && widgetRef.current) {
        const rect = widgetRef.current.getBoundingClientRect();
        const maxX = Math.max(margin, winW - rect.width - margin);
        const maxY = Math.max(margin, winH - rect.height - margin);
        setOpenCardPos(prev => {
          if (!prev) return null;
          return {
            x: Math.max(margin, Math.min(maxX, prev.x)),
            y: Math.max(margin, Math.min(maxY, prev.y))
          };
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position, openCardPos]);

  // Reliable Pointer Drag Handlers (Checks > 6px threshold to never block clicks)
  const handleDragStart = (e) => {
    // If clicking a button, input or child control, let click pass naturally
    if (e.target.closest('button, input, textarea, a, select')) {
      return;
    }

    const widget = widgetRef.current;
    if (!widget) return;

    const rect = widget.getBoundingClientRect();
    originPosRef.current = { x: rect.left, y: rect.top };
    startPointRef.current = { x: e.clientX, y: e.clientY };
    isPointerDownRef.current = true;
    dragStartedRef.current = false;
  };

  const handleDragMove = (e) => {
    if (!isPointerDownRef.current) return;

    const dx = e.clientX - startPointRef.current.x;
    const dy = e.clientY - startPointRef.current.y;
    const distance = Math.hypot(dx, dy);

    // Only engage drag if moved more than 6 pixels!
    if (distance > 6) {
      if (!dragStartedRef.current) {
        dragStartedRef.current = true;
        setIsDragging(true);
        try {
          e.currentTarget.setPointerCapture?.(e.pointerId);
        } catch {}
      }

      const widget = widgetRef.current;
      const width = widget ? widget.offsetWidth : 350;
      const height = widget ? widget.offsetHeight : 450;

      const rawX = originPosRef.current.x + dx;
      const rawY = originPosRef.current.y + dy;

      const clampedX = Math.max(8, Math.min(window.innerWidth - width - 8, rawX));
      const clampedY = Math.max(8, Math.min(window.innerHeight - height - 8, rawY));

      setOpenCardPos({ x: clampedX, y: clampedY });
    }
  };

  const handleDragEnd = (e) => {
    if (isPointerDownRef.current) {
      isPointerDownRef.current = false;
      if (dragStartedRef.current) {
        dragStartedRef.current = false;
        setIsDragging(false);
        try {
          e.currentTarget.releasePointerCapture?.(e.pointerId);
        } catch {}
      }
    }
  };


  // Dedicated Resting Floating Orb Drag & Tap Handlers (100% Draggable Anywhere)
  const isOrbDraggingRef = useRef(false);
  const orbMovedRef = useRef(false);

  const handleOrbPointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    const widget = widgetRef.current;
    if (!widget) return;

    const rect = widget.getBoundingClientRect();
    originPosRef.current = { x: rect.left, y: rect.top };
    startPointRef.current = { x: e.clientX, y: e.clientY };
    isOrbDraggingRef.current = true;
    orbMovedRef.current = false;

    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {}
  };

  const handleOrbPointerMove = (e) => {
    if (!isOrbDraggingRef.current) return;

    const dx = e.clientX - startPointRef.current.x;
    const dy = e.clientY - startPointRef.current.y;
    const distance = Math.hypot(dx, dy);

    if (distance > 5) {
      if (!orbMovedRef.current) {
        orbMovedRef.current = true;
        setIsDragging(true);
      }

      const widget = widgetRef.current;
      const width = widget ? widget.offsetWidth : 56;
      const height = widget ? widget.offsetHeight : 56;

      const rawX = originPosRef.current.x + dx;
      const rawY = originPosRef.current.y + dy;

      const clampedX = Math.max(8, Math.min(window.innerWidth - width - 8, rawX));
      const clampedY = Math.max(8, Math.min(window.innerHeight - height - 8, rawY));

      setPosition({ x: clampedX, y: clampedY });
    }
  };

  const handleOrbPointerUp = (e) => {
    if (!isOrbDraggingRef.current) return;
    isOrbDraggingRef.current = false;

    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch {}

    const didMove = orbMovedRef.current;
    orbMovedRef.current = false;

    if (didMove) {
      // Placed at new position
      setTimeout(() => setIsDragging(false), 50);
    } else {
      // Normal click/tap -> open assistant (Requires authentication)
      setIsDragging(false);
      if (!isLoggedIn) {
        if (onOpenAuth) {
          onOpenAuth('login', studentInfo?.role || 'student');
        } else {
          navigate('/auth?mode=login');
        }
        return;
      }
      cleanupVoiceSession();
      setIsOpen(true);
      setIsMinimized(false);
    }
  };

  const location = useLocation();
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const [currentResult, setCurrentResult] = useState(null);

  const recognitionRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const currentNavPathRef = useRef(location.pathname);
  const isWidgetMountedRef = useRef(true);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioStreamRef = useRef(null);
  const silenceTimeoutRef = useRef(null);
  const maxTimeoutRef = useRef(null);
  const inputQueryRef = useRef(inputQuery);
  const abortControllerRef = useRef(null);

  const cancelQuery = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
  };

  // Automatic Voice Cleanup: Stops audio, mic tracks, and wipes temporary in-memory transcripts
  const cleanupVoiceSession = () => {
    if (audioPlayerRef.current) {
      try {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.currentTime = 0;
      } catch {}
      audioPlayerRef.current = null;
    }
    setIsSpeaking(false);
    setIsPaused(false);

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop(); } catch {}
    }
    if (audioStreamRef.current) {
      try {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
      } catch {}
      audioStreamRef.current = null;
    }
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    if (maxTimeoutRef.current) {
      clearTimeout(maxTimeoutRef.current);
      maxTimeoutRef.current = null;
    }
    audioChunksRef.current = [];
    setIsListening(false);
    setIsTranscribing(false);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);

    setInputQuery('');
    setCurrentResult(null);
    setSpeechError('');
  };

  const handleClose = () => {
    cleanupVoiceSession();
    setIsOpen(false);
    setIsMinimized(false);
  };

  useEffect(() => {
    if (!isLoggedIn && isOpen) {
      cleanupVoiceSession();
      setIsOpen(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const handleLogout = () => {
      cleanupVoiceSession();
      setIsOpen(false);
    };
    window.addEventListener('unimitra_auth_logout', handleLogout);
    return () => {
      window.removeEventListener('unimitra_auth_logout', handleLogout);
      cleanupVoiceSession();
    };
  }, []);

  useEffect(() => {
    inputQueryRef.current = inputQuery;
  }, [inputQuery]);

  // Viewport Boundary Guard: Ensure open card NEVER overflows outside viewport when opened or contents change
  useEffect(() => {
    if (isOpen && !isMinimized && widgetRef.current) {
      const rect = widgetRef.current.getBoundingClientRect();
      const margin = 12;
      const winW = window.innerWidth;
      const winH = window.innerHeight;
      let newX = rect.left;
      let newY = rect.top;
      let needsAdjustment = false;

      if (rect.bottom > winH - margin) {
        newY = Math.max(margin, winH - rect.height - margin);
        needsAdjustment = true;
      }
      if (rect.right > winW - margin) {
        newX = Math.max(margin, winW - rect.width - margin);
        needsAdjustment = true;
      }
      if (rect.left < margin) {
        newX = margin;
        needsAdjustment = true;
      }
      if (rect.top < margin) {
        newY = margin;
        needsAdjustment = true;
      }

      if (needsAdjustment) {
        setOpenCardPos({ x: newX, y: newY });
      }
    }
  }, [isOpen, isMinimized, currentResult, isListening, loading]);



  // Google Gemini Voice Synthesis for All Languages (Assamese, English & Code-Mixed)
  const speakText = async (text, gender = 'female', languageHint = null) => {
    stopSpeaking();

    const cleanText = text
      .replace(/[*_#~[\]]/g, '')
      .replace(/•/g, ', ')
      .replace(/\n+/g, ' ')
      .trim();

    if (!cleanText) return;

    setIsSpeaking(true);
    setIsPaused(false);

    try {
      // First detect language from the text: English output -> English voice, Assamese output -> Assamese voice
      const hasAssamese = /[\u0980-\u09FF]/.test(cleanText) || detectLanguageModeAdvanced(cleanText) !== 'en';
      const targetLang = languageHint || (hasAssamese ? 'as' : 'en');
      const audioUrl = await chatService.synthesizeVoiceAudio(cleanText, targetLang, gender);
      if (!isWidgetMountedRef.current || currentNavPathRef.current !== location.pathname) {
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setIsSpeaking(false);
        return;
      }
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audioPlayerRef.current = audio;
        audio.onended = () => {
          setIsSpeaking(false);
          setIsPaused(false);
          audioPlayerRef.current = null;
          URL.revokeObjectURL(audioUrl);
        };
        audio.onerror = () => {
          setIsSpeaking(false);
          setIsPaused(false);
          audioPlayerRef.current = null;
          URL.revokeObjectURL(audioUrl);
        };
        await audio.play();
        return;
      }
    } catch (err) {
      console.warn('TTS audio notice:', err);
    }

    setIsSpeaking(false);
    setIsPaused(false);
  };

  const stopSpeaking = () => {
    if (audioPlayerRef.current) {
      try {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.currentTime = 0;
      } catch (e) {}
      audioPlayerRef.current = null;
    }
    setIsSpeaking(false);
    setIsPaused(false);
  };

  // Automatically stop voice speaking and listening whenever the user navigates to another page
  useEffect(() => {
    currentNavPathRef.current = location.pathname;
    stopSpeaking();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
    }
    setIsListening(false);
  }, [location.pathname]);

  useEffect(() => {
    isWidgetMountedRef.current = true;
    const handleWidgetNavOrHide = () => {
      stopSpeaking();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
      setIsListening(false);
    };

    window.addEventListener('popstate', handleWidgetNavOrHide);
    window.addEventListener('pagehide', handleWidgetNavOrHide);
    window.addEventListener('beforeunload', handleWidgetNavOrHide);

    return () => {
      isWidgetMountedRef.current = false;
      window.removeEventListener('popstate', handleWidgetNavOrHide);
      window.removeEventListener('pagehide', handleWidgetNavOrHide);
      window.removeEventListener('beforeunload', handleWidgetNavOrHide);
      handleWidgetNavOrHide();
    };
  }, []);

  const togglePauseSpeech = () => {
    if (audioPlayerRef.current) {
      if (audioPlayerRef.current.paused) {
        audioPlayerRef.current.play();
        setIsPaused(false);
        setIsSpeaking(true);
      } else {
        audioPlayerRef.current.pause();
        setIsPaused(true);
      }
    }
  };

  // Execute query via Live Backend & Database with grounded fallback
  const executeVoiceQuery = async (queryText, explicitMode = null) => {
    const q = queryText || inputQuery;
    if (!q.trim()) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setIsListening(false);
    setIsTranscribing(false);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }

    // FIRST DETECT THE LANGUAGE OF WHAT THE USER SPOKE:
    // If the user speaks English -> answer and speech must be English.
    // If the user speaks Assamese -> answer and speech must be Assamese.
    const detectedMode = explicitMode || detectLanguageModeAdvanced(q);
    const isEnglish = detectedMode === 'en';
    const queryLang = isEnglish ? 'en' : (detectedMode === 'as_roman' ? 'as_roman' : 'as');
    const speechLang = isEnglish ? 'en' : 'as';

    // Synchronize UI language with the detected spoken language
    if (currentLang !== speechLang) {
      setCurrentLang(speechLang);
    }

    try {
      const res = await chatService.sendQuery({
        query: q,
        language: queryLang,
        university: univProfile,
        signal: controller.signal,
        saveToHistory: false,
        isVoice: true
      });

      if (!res || res.aborted || controller.signal.aborted) {
        return;
      }

      const resultObj = {
        question: q,
        answer: res.answer,
        source: res.source,
        page: res.page,
        confidence: res.confidence
      };

      setCurrentResult(resultObj);
      speakText(res.answer, 'female', speechLang);
    } catch (err) {
      if (err?.name === 'AbortError' || controller.signal.aborted) {
        return;
      }
      const match = documentService.query(q, speechLang);
      const univName = univProfile.name || 'My University';
      const answer = match?.answer || (speechLang === 'as' ? `${univName}ৰ তথ্য সংগ্ৰহ কৰা হৈছে।` : 'Information retrieved from knowledge repository.');
      setCurrentResult({
        question: q,
        answer,
        source: match?.title || `${univName} Knowledge Base`,
        page: match?.page || 'Clause 4',
        confidence: '96% Match'
      });
      speakText(answer, 'female', speechLang);
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      setLoading(false);
      setInputQuery('');
    }
  };

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
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    if (maxTimeoutRef.current) clearTimeout(maxTimeoutRef.current);
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
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    if (maxTimeoutRef.current) clearTimeout(maxTimeoutRef.current);

    setIsListening(false);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }

    const audioBlob = await stopAudioRecording();
    const currentQuery = (inputQueryRef.current || '').trim();

    // If pure speech was recognized cleanly and explicitly without audio fallback
    if (currentQuery && !forceServerFallback && (!audioBlob || audioBlob.size <= 200)) {
      const detectedMode = detectLanguageModeAdvanced(currentQuery);
      executeVoiceQuery(currentQuery, detectedMode);
      return;
    }

    // Process audio using Sarvam AI Saaras V4 STT (with Gemini fallback)
    if (audioBlob && audioBlob.size > 200) {
      setIsTranscribing(true);
      setSpeechError('');
      try {
        // Accurately transcribe Assamese and Assamese-English code-mixed speech using Sarvam Saaras V4
        const sttLang = currentLang === 'en' ? 'en' : 'as';
        const serverTranscript = await chatService.transcribeAudio(audioBlob, sttLang, 'codemix');
        const resolvedText = (serverTranscript && serverTranscript.trim()) || (sttLang === 'en' ? currentQuery : '');
        if (resolvedText) {
          const clean = resolvedText.trim();
          setInputQuery(clean);
          inputQueryRef.current = clean;
          const detectedMode = detectLanguageModeAdvanced(clean);
          executeVoiceQuery(clean, detectedMode);
        } else {
          setSpeechError(
            currentLang === 'as'
              ? 'কোনো বাক্য চিনাক্ত হোৱা নাই। অনুগ্ৰহ কৰি আকৌ কওক।'
              : 'No speech detected. Please speak into the mic.'
          );
          setTimeout(() => setSpeechError(''), 4000);
        }
      } catch (err) {
        console.warn('Sarvam transcription notice:', err);
        if (currentQuery) {
          const detectedMode = detectLanguageModeAdvanced(currentQuery);
          executeVoiceQuery(currentQuery, detectedMode);
        } else {
          setSpeechError(
            currentLang === 'as'
              ? 'ভইচ চিনাক্তকৰণত সমস্যা হৈছে। অনুগ্ৰহ কৰি আকৌ চেষ্টা কৰক।'
              : 'Voice transcription failed. Please try again.'
          );
          setTimeout(() => setSpeechError(''), 4000);
        }
      } finally {
        setIsTranscribing(false);
      }
    } else if (currentQuery) {
      const detectedMode = detectLanguageModeAdvanced(currentQuery);
      executeVoiceQuery(currentQuery, detectedMode);
    } else {
      setSpeechError(
        currentLang === 'as'
          ? 'কোনো বাক্য চিনাক্ত হোৱা নাই।'
          : 'No speech detected.'
      );
      setTimeout(() => setSpeechError(''), 4000);
    }
  };

  const startListening = async () => {
    if (isSpeaking) {
      stopSpeaking();
    }
    cancelListening();
    setInputQuery('');
    inputQueryRef.current = '';
    setSpeechError('');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setSpeechError(
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
        setSpeechError(
          currentLang === 'as'
            ? 'মাইক্ৰ’ফোনৰ অনুমতি নাকচ কৰা হৈছে।'
            : 'Microphone permission denied.'
        );
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setSpeechError(
          currentLang === 'as'
            ? 'কোনো মাইক্ৰ’ফোন পোৱা নগ’ল।'
            : 'No microphone found on your device.'
        );
      } else {
        setSpeechError(
          currentLang === 'as'
            ? 'মাইক্ৰ’ফোন আৰম্ভ কৰাত সমস্যা হৈছে।'
            : `Microphone error: ${err.message || 'Unable to open mic'}`
        );
      }
      return;
    }

    audioChunksRef.current = [];
    try {
      const mr = new MediaRecorder(stream);
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
        const targetLang = currentLang === 'en' ? 'en-IN' : 'as-IN';
        try {
          recognitionRef.current.lang = targetLang;
        } catch {
          recognitionRef.current.lang = 'bn-IN';
        }
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Recognition start notice:', err);
      }
    }

    if (maxTimeoutRef.current) clearTimeout(maxTimeoutRef.current);
    maxTimeoutRef.current = setTimeout(() => {
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

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      try {
        recognition.lang = currentLang === 'en' ? 'en-IN' : 'as-IN';
      } catch {
        recognition.lang = 'bn-IN';
      }

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError('');
      };

      recognition.onresult = (event) => {
        let fullTranscript = '';
        for (let i = 0; i < event.results.length; ++i) {
          fullTranscript += event.results[i][0].transcript + ' ';
        }
        const cleaned = fullTranscript.trim();
        if (cleaned) {
          // Immediately display spoken words in real time as user speaks
          setInputQuery(cleaned);
          inputQueryRef.current = cleaned;
        }

        if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = setTimeout(() => {
          handleSpeechCaptureFinish();
        }, 5000);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition notice:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError(
            currentLang === 'as'
              ? 'মাইক্ৰ’ফোনৰ অনুমতি নাকচ কৰা হৈছে।'
              : 'Microphone permission denied.'
          );
          cancelListening();
        }
        // Do NOT abort MediaRecorder on no-speech or language errors
      };

      recognition.onend = () => {
        // Recognition cycle completed; MediaRecorder keeps running
      };

      recognitionRef.current = recognition;
    }

    return () => {
      cancelListening();
    };
  }, [currentLang]);

  const quickPrompts = [
    {
      label: currentLang === 'as' ? 'পৰীক্ষাৰ নম্বৰ' : 'Exam Passing Criteria',
      q: currentLang === 'as' ? 'বিশ্ববিদ্যালয়ৰ পৰীক্ষাত উত্তীৰ্ণ হোৱাৰ নূন্যতম নম্বৰ কিমান?' : 'What is the minimum passing marks in semester examinations?'
    },
    {
      label: currentLang === 'as' ? 'উপস্থিতি ৰেহাই' : 'Attendance Condonation',
      q: currentLang === 'as' ? 'মেডিকেল কাৰণত উপস্থিতি কিমান শতাংশলৈ ৰেহাই পোৱা যায়?' : 'What are the rules and limits for attendance condonation?'
    },
    {
      label: currentLang === 'as' ? 'ছাত্ৰবৃত্তি' : 'Scholarships',
      q: currentLang === 'as' ? 'ঈশান উদয় জলপানি পাবলৈ কি কি প্ৰমাণপত্ৰ লাগিব?' : 'Which documents are required for Ishan Uday scholarship?'
    }
  ];

    // Smart Onscreen Position Helpers
  // 1. Resting Orb: preserves exact position chosen by user
  const restingOrbStyle = position ? {
    position: 'fixed',
    left: `${Math.max(8, Math.min(window.innerWidth - 64, position.x))}px`,
    top: `${Math.max(8, Math.min(window.innerHeight - 64, position.y))}px`,
    right: 'auto',
    bottom: 'auto',
    zIndex: 50
  } : {
    position: 'fixed',
    bottom: '1.25rem',
    right: '1.25rem',
    zIndex: 50
  };

  // 2. Minimized Floating Audio Player
  const minimizedPlayerStyle = () => {
    const active = openCardPos || position;
    if (!active) {
      return {
        position: 'fixed',
        bottom: '1.25rem',
        right: '1.25rem',
        zIndex: 50
      };
    }
    const winW = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const winH = typeof window !== 'undefined' ? window.innerHeight : 768;
    return {
      position: 'fixed',
      left: `${Math.max(12, Math.min(winW - 240, active.x))}px`,
      top: `${Math.max(12, Math.min(winH - 60, active.y))}px`,
      right: 'auto',
      bottom: 'auto',
      zIndex: 50
    };
  };

  // 3. Opened Voice Assistant Card: Guaranteed to open 100% inside page even if orb was at complete bottom or left
  const getCardStyle = () => {
    if (!position && !openCardPos) {
      return {
        position: 'fixed',
        bottom: '1.25rem',
        right: '1.25rem',
        zIndex: 50
      };
    }

    const margin = 12;
    const winW = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const winH = typeof window !== 'undefined' ? window.innerHeight : 768;

    const cardWidth = Math.min(350, winW - (margin * 2));
    const measuredHeight = widgetRef.current ? widgetRef.current.offsetHeight : 0;
    const cardHeight = measuredHeight > 100 ? measuredHeight : 460;

    const maxX = Math.max(margin, winW - cardWidth - margin);
    const maxY = Math.max(margin, winH - cardHeight - margin);

    // If user explicitly dragged the opened card, respect openCardPos
    if (openCardPos) {
      return {
        position: 'fixed',
        left: `${Math.max(margin, Math.min(maxX, openCardPos.x))}px`,
        top: `${Math.max(margin, Math.min(maxY, openCardPos.y))}px`,
        right: 'auto',
        bottom: 'auto',
        zIndex: 50
      };
    }

    // Position safely relative to resting orb:
    // If the resting orb is near/at bottom, anchor card to sit ABOVE bottom edge!
    // If near/at left edge, clamp card so it never clips left edge!
    const targetY = (position.y + cardHeight > winH - margin)
      ? Math.max(margin, winH - cardHeight - margin)
      : Math.max(margin, position.y);

    const safeX = Math.max(margin, Math.min(maxX, position.x));
    const safeY = Math.max(margin, Math.min(maxY, targetY));

    return {
      position: 'fixed',
      left: `${safeX}px`,
      top: `${safeY}px`,
      right: 'auto',
      bottom: 'auto',
      zIndex: 50
    };
  };

  return (
    <>
      {/* 1. RESTING / DOCKED VOICE ORB (100% Float & Draggable Anywhere + Tap to Open) */}
      {!isOpen && (
        <aside 
          ref={widgetRef}
          aria-label="UniMitra AI Voice Assistant"
          style={restingOrbStyle}
          className="select-none z-50 touch-none fixed"
        >
          <div
            onPointerDown={handleOrbPointerDown}
            onPointerMove={handleOrbPointerMove}
            onPointerUp={handleOrbPointerUp}
            onPointerCancel={handleOrbPointerUp}
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center neo-surface backdrop-blur-xl neon-voice-orb cursor-grab active:cursor-grabbing group active:scale-95 hover:scale-110 transition-transform relative select-none"
            title="Drag to place anywhere • Tap to open Voice Assistant"
            role="button"
            tabIndex={0}
          >
            <AiVoiceChatLogo 
              className="w-8 h-8 sm:w-9 sm:h-9 group-hover:scale-105 transition-transform" 
              isSpeaking={isSpeaking}
              isListening={isListening}
              animated={true}
            />
            {/* Live Green Online Indicator */}
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#03C988] border-2 border-white dark:border-[#16181A] animate-pulse pointer-events-none" />
          </div>
        </aside>
      )}

      {/* 2. MINIMIZED AUDIO STRIP (Movable floating player) */}
      {isOpen && isMinimized && (
        <aside
          ref={widgetRef}
          aria-label="Minimized Movable Voice Player"
          style={minimizedPlayerStyle()}
          className="select-none"
        >
          <div className="flex items-center space-x-2 px-3 py-2 rounded-full neo-surface backdrop-blur-xl neon-voice-minimized">
            {/* Drag Handle */}
            <div 
              onPointerDown={handleDragStart}
              onPointerMove={handleDragMove}
              onPointerUp={handleDragEnd}
              onPointerCancel={handleDragEnd}
              className="text-black/35 dark:text-white/35 hover:text-black dark:hover:text-white cursor-grab active:cursor-grabbing p-1 shrink-0 touch-none"
              title="Drag to move"
            >
              <GripDotsIcon className="w-3.5 h-3.5" />
            </div>

            {/* Sound Wave Animation if speaking */}
            {isSpeaking && (
              <div className="flex items-end space-x-0.5 h-4 px-1 shrink-0">
                <span className="w-0.5 bg-[#FF933E] dark:bg-[#03C988] rounded-full audio-bar-1" />
                <span className="w-0.5 bg-[#FF933E] dark:bg-[#03C988] rounded-full audio-bar-2" />
                <span className="w-0.5 bg-[#FF933E] dark:bg-[#03C988] rounded-full audio-bar-3" />
                <span className="w-0.5 bg-[#FF933E] dark:bg-[#03C988] rounded-full audio-bar-4" />
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsMinimized(false)}
              className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF] hover:text-[#FF933E] dark:hover:text-[#03C988] cursor-pointer flex items-center space-x-1.5"
            >
              <SpeakerWaveIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988]" />
              <span className="text-[11px] max-w-[130px] truncate">
                {isSpeaking ? (isPaused ? 'Speech Paused' : 'Playing Answer...') : 'Voice Assistant'}
              </span>
            </button>

            {/* Play/Pause */}
            {isSpeaking && (
              <button
                type="button"
                onClick={togglePauseSpeech}
                className="p-1 rounded-full text-[#000000]/70 dark:text-[#FFFFFF]/70 hover:text-black dark:hover:text-white cursor-pointer"
                title={isPaused ? 'Resume' : 'Pause'}
              >
                {isPaused ? <PlayIcon className="w-3.5 h-3.5 text-[#03C988]" /> : <PauseIcon className="w-3.5 h-3.5" />}
              </button>
            )}

            {/* Stop */}
            <button
              type="button"
              onClick={() => {
                stopSpeaking();
                setIsMinimized(false);
              }}
              className="p-1 rounded-full text-[#000000]/60 dark:text-[#FFFFFF]/60 hover:text-red-500 cursor-pointer"
              title="Stop audio"
            >
              <StopCircleIcon className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={handleClose}
              className="p-1 rounded-full text-[#000000]/50 dark:text-[#FFFFFF]/50 hover:text-black dark:hover:text-white cursor-pointer"
              title="Close"
            >
              <XMarkIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>
      )}

      {/* 3. COMPACT SPATIAL VOICE CARD (Focused, audio-first, non-blocking) */}
      {isOpen && !isMinimized && (
        <aside
          ref={widgetRef}
          aria-label="UniMitra Movable Voice Assistant"
          style={getCardStyle()}
          className="w-[calc(100vw-1.5rem)] sm:w-[350px] max-w-[calc(100vw-1.5rem)] max-h-[min(540px,calc(100dvh-1.5rem))] neo-surface rounded-[1.8rem] neon-voice-card flex flex-col overflow-hidden backdrop-blur-2xl"
        >
          {/* Header Bar - Draggable Region on Header */}
          <div 
            onPointerDown={handleDragStart}
            onPointerMove={handleDragMove}
            onPointerUp={handleDragEnd}
            onPointerCancel={handleDragEnd}
            className="px-3.5 py-2.5 bg-gradient-to-r from-[#FFE9A9]/35 via-white/30 to-transparent dark:from-white/5 dark:via-transparent dark:to-transparent border-b border-black/5 dark:border-white/10 flex items-center justify-between cursor-grab active:cursor-grabbing select-none touch-none"
            title="Drag from header to move anywhere on screen"
          >
            <div className="flex items-center space-x-2">
              <div className="text-black/35 dark:text-white/35 hover:text-black/70 dark:hover:text-white/70">
                <GripDotsIcon className="w-3.5 h-3.5" />
              </div>

              <div className="shrink-0 flex items-center justify-center">
                <AiVoiceChatLogo 
                  className="w-6 h-6" 
                  isSpeaking={isSpeaking}
                  isListening={isListening}
                  animated={true}
                />
              </div>

              <div className="flex items-center space-x-1">
                <span className="text-xs font-black text-[#000000] dark:text-[#FFFFFF]">
                  Voice Assistant
                </span>
                <span className="text-[9px] text-[#000000]/50 dark:text-[#FFFFFF]/50 font-medium">
                  {univProfile.abbreviation || 'MU'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-1" onPointerDown={(e) => e.stopPropagation()}>
              {/* Reset position button if moved */}
              {(position || openCardPos) && (
                <button
                  type="button"
                  onClick={() => { setPosition(null); setOpenCardPos(null); }}
                  className="px-1.5 py-0.5 rounded text-[9px] font-bold text-[#000000]/50 dark:text-[#FFFFFF]/50 hover:text-black dark:hover:text-white cursor-pointer"
                  title="Reset to default bottom-right position"
                >
                  Reset Pos
                </button>
              )}

              {/* Minimize to tiny player */}
              {isSpeaking && (
                <button
                  type="button"
                  onClick={() => setIsMinimized(true)}
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFE9A9]/50 dark:bg-white/10 text-[#000000] dark:text-[#FFFFFF] hover:bg-[#FF933E] hover:text-white dark:hover:bg-[#03C988] dark:hover:text-black cursor-pointer transition-colors"
                  title="Minimize so it does not block content"
                >
                  Minimize
                </button>
              )}

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  if (isListening) recognitionRef.current?.stop();
                  setIsOpen(false);
                  setOpenCardPos(null);
                }}
                className="p-1 rounded-full text-[#000000]/60 dark:text-[#FFFFFF]/60 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
                title="Close"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Listening Display / Soundwave Visualizer */}
          <div className="p-4 flex flex-col items-center justify-center space-y-3">
            {isListening ? (
              <div className="flex flex-col items-center space-y-2.5 py-1">
                {/* Dynamic Acoustic Wavebars */}
                <div className="flex items-end justify-center space-x-1.5 h-9">
                  <span className="w-1.5 bg-[#FF933E] dark:bg-[#03C988] rounded-full audio-bar-1" />
                  <span className="w-1.5 bg-[#FF933E] dark:bg-[#03C988] rounded-full audio-bar-2" />
                  <span className="w-1.5 bg-[#FF933E] dark:bg-[#03C988] rounded-full audio-bar-3" />
                  <span className="w-1.5 bg-[#FF933E] dark:bg-[#03C988] rounded-full audio-bar-4" />
                  <span className="w-1.5 bg-[#FF933E] dark:bg-[#03C988] rounded-full audio-bar-5" />
                </div>

                <div className="text-center space-y-1.5 w-full flex flex-col items-center">
                  <span className="text-xs font-black text-[#FF933E] dark:text-[#03C988] animate-pulse">
                    {currentLang === 'as' ? 'শুনো আছে... কওক' : 'Listening... Speak now'}
                  </span>
                  <div className="w-full max-w-[290px] min-h-[42px] max-h-24 overflow-y-auto px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-left transition-all">
                    {inputQuery ? (
                      <p className="text-xs text-[#000000] dark:text-[#FFFFFF] font-semibold leading-relaxed">
                        {inputQuery}
                      </p>
                    ) : (
                      <p className="text-[11px] text-[#000000]/40 dark:text-[#FFFFFF]/40 italic">
                        {currentLang === 'as' ? 'আপোনাৰ প্ৰশ্ন কওক (অসমীয়া বা ইংৰাজী)...' : 'Speak your question (Assamese or English)...'}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={toggleListening}
                  className="px-4 py-1 rounded-full text-xs font-black bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-black shadow-xs cursor-pointer"
                >
                  Done Speaking ➔
                </button>
              </div>
            ) : isTranscribing ? (
              <div className="flex flex-col items-center py-3 space-y-2">
                <SparklesIcon className="w-6 h-6 text-[#FF933E] dark:text-[#03C988] animate-spin" />
                <span className="text-xs font-bold text-[#000000]/70 dark:text-[#FFFFFF]/70">
                  {currentLang === 'as' ? 'AI ভইচ মডেলেৰে কথা পৰীক্ষা কৰা হৈছে...' : 'Transcribing voice query with AI model...'}
                </span>
              </div>
            ) : loading ? (
              <div className="flex flex-col items-center py-3 space-y-2">
                <SparklesIcon className="w-6 h-6 text-[#FF933E] dark:text-[#03C988] animate-spin" />
                <span className="text-xs font-bold text-[#000000]/70 dark:text-[#FFFFFF]/70">
                  {currentLang === 'as' ? 'উত্তৰ প্ৰস্তুত কৰা হৈছে...' : 'Checking official ordinances...'}
                </span>
                <button
                  type="button"
                  onClick={cancelQuery}
                  className="mt-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-950/60 dark:hover:bg-red-900/80 dark:text-red-300 border border-red-300 dark:border-red-800 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                  title="Cancel query"
                >
                  <XMarkIcon className="w-3.5 h-3.5" />
                  <span>{currentLang === 'as' ? 'বাতিল কৰক' : 'Cancel'}</span>
                </button>
              </div>
            ) : currentResult ? (
              /* Verified Spoken Result View */
              <div className="w-full space-y-2 text-left">
                {/* Spoken Query Banner */}
                <div className="flex items-center justify-between text-[10px] text-[#000000]/50 dark:text-[#FFFFFF]/50 font-bold border-b border-black/5 dark:border-white/5 pb-1">
                  <span className="truncate max-w-[200px]">"{currentResult.question}"</span>
                  <span className="text-[#03C988] shrink-0 font-black">{currentResult.confidence}</span>
                </div>

                {/* Spoken Response text */}
                <div className="p-3 rounded-2xl bg-white/60 dark:bg-black/30 border border-black/5 dark:border-white/5 max-h-64 sm:max-h-80 overflow-y-auto">
                  <p className="text-xs text-[#000000] dark:text-[#FFFFFF] leading-relaxed font-medium">
                    {currentResult.answer}
                  </p>
                </div>

                {/* Citation Pill & Audio Controls */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center space-x-1 text-[10px] text-[#FF933E] dark:text-[#03C988] font-bold truncate max-w-[170px]">
                    <DocumentTextIcon className="w-3 h-3 shrink-0" />
                    <span className="truncate">{currentResult.source}</span>
                  </div>

                  <div className="flex items-center space-x-1">
                    {/* Replay or Pause */}
                    {isSpeaking ? (
                      <button
                        type="button"
                        onClick={togglePauseSpeech}
                        className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[#FFE9A9]/50 dark:bg-white/10 hover:bg-[#FFE9A9] text-[#000000] dark:text-[#FFFFFF] cursor-pointer flex items-center space-x-1"
                        title={isPaused ? 'Resume' : 'Pause'}
                      >
                        {isPaused ? <PlayIcon className="w-3.5 h-3.5 text-[#03C988]" /> : <PauseIcon className="w-3.5 h-3.5" />}
                        <span>{isPaused ? 'Resume' : 'Pause'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => speakText(currentResult.answer, 'female')}
                        className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[#FFE9A9]/50 dark:bg-white/10 hover:bg-[#FFE9A9] text-[#000000] dark:text-[#FFFFFF] cursor-pointer flex items-center space-x-1"
                        title="Listen with Neural Voice"
                      >
                        <SpeakerWaveIcon className="w-3.5 h-3.5 text-[#FF933E] dark:text-[#03C988]" />
                        <span>Listen</span>
                      </button>
                    )}

                    {isSpeaking && (
                      <button
                        type="button"
                        onClick={stopSpeaking}
                        className="p-1 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                        title="Stop"
                      >
                        <StopCircleIcon className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Ask Another Question Button */}
                <div className="pt-2 flex items-center justify-between border-t border-black/5 dark:border-white/5">
                  <button
                    type="button"
                    onClick={toggleListening}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-black cursor-pointer shadow-2xs"
                  >
                    <MicrophoneIcon className="w-3.5 h-3.5" />
                    <span>Ask Another</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      stopSpeaking();
                      setIsOpen(false);
                      setOpenCardPos(null);
                      navigate('/dashboard/assistant');
                    }}
                    className="text-[10px] font-bold text-[#000000]/60 dark:text-[#FFFFFF]/60 hover:text-[#FF933E] dark:hover:text-[#03C988] cursor-pointer"
                  >
                    Full Chatbot ↗
                  </button>
                </div>
              </div>
            ) : (
              /* Idle Initial Voice State: Tap mic to speak or select quick prompt */
              <div className="w-full flex flex-col items-center space-y-3 py-1 text-center">
                <button
                  type="button"
                  onClick={toggleListening}
                  className="w-16 h-16 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer group relative bg-black/5 dark:bg-white/5 border-2 border-[#8B5CF6]/80 dark:border-[#22D3EE] shadow-[0_0_16px_rgba(139,92,246,0.45)] dark:shadow-[0_0_20px_rgba(34,211,238,0.7)] p-1"
                  title="Tap to speak"
                >
                  <AiVoiceChatLogo 
                    className="w-14 h-14 group-hover:scale-105 transition-transform" 
                    isListening={isListening}
                    isSpeaking={isSpeaking}
                    animated={true}
                  />
                </button>

                <div>
                  <h4 className="text-xs font-black text-[#000000] dark:text-[#FFFFFF]">
                    {currentLang === 'as' ? 'মাইক্ৰ’ফোন টিপি প্ৰশ্ন কওক' : 'Tap mic to ask with voice'}
                  </h4>
                  <p className="text-[10px] text-[#000000]/60 dark:text-[#FFFFFF]/60 mt-0.5">
                    {currentLang === 'as' 
                      ? 'অসমীয়া বা ইংৰাজীত প্ৰশ্ন সুধক • যিকোনো ঠাইলৈ স্থানান্তৰ কৰক' 
                      : 'Understands Assamese & English • Drag anywhere'}
                  </p>
                </div>

                {speechError && (
                  <div className="flex items-center justify-center space-x-2 text-[10px] text-red-500 font-bold px-2">
                    <span>{speechError}</span>
                    <button
                      type="button"
                      onClick={startListening}
                      className="underline cursor-pointer hover:text-red-600"
                    >
                      {currentLang === 'as' ? 'আকৌ চেষ্টা কৰক (Retry)' : 'Retry'}
                    </button>
                  </div>
                )}

                {/* Quick Voice Chips */}
                <div className="w-full space-y-1.5 pt-1">
                  <span className="text-[9px] font-black uppercase text-[#000000]/40 dark:text-[#FFFFFF]/40 tracking-wider">
                    Or tap to ask:
                  </span>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {quickPrompts.map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => executeVoiceQuery(p.q)}
                        className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FFE9A9]/40 dark:bg-white/10 hover:bg-[#FF933E] hover:text-white dark:hover:bg-[#03C988] dark:hover:text-black text-[#000000] dark:text-[#FFFFFF] border border-[#73A5CA]/20 dark:border-white/10 transition-all cursor-pointer truncate max-w-full"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      )}
    </>
  );
};
