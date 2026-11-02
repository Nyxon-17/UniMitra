import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { universityService } from '../../services/universityService';
import { documentService } from '../../services/documentService';
import { chatService } from '../../services/chatService';
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

export const GlobalAiChatWidget = ({ currentLang = 'en', onToggleLang, studentInfo }) => {
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
      // Normal click/tap -> open assistant
      setIsDragging(false);
      setIsOpen(true);
      setIsMinimized(false);
    }
  };

  const location = useLocation();
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const [currentResult, setCurrentResult] = useState(null);

  const recognitionRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const currentNavPathRef = useRef(location.pathname);
  const isWidgetMountedRef = useRef(true);

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

  // Initialize Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = currentLang === 'as' ? 'bn-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError('');
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setInputQuery(transcript);
      };

      recognition.onerror = (event) => {
        if (event.error !== 'no-speech') {
          setSpeechError(`Microphone issue: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (audioPlayerRef.current) {
        try { audioPlayerRef.current.pause(); } catch (e) {}
        audioPlayerRef.current = null;
      }
      window.speechSynthesis?.cancel();
    };
  }, [currentLang]);

  const fallbackSpeechSynthesis = (cleanText, gender = 'male') => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = currentLang === 'as' ? 'bn-IN' : 'en-IN';
    utterance.rate = 1.0;
    utterance.pitch = gender === 'female' ? 1.08 : 0.88;
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    window.speechSynthesis.speak(utterance);
  };

  // Ultra-Fast Voice Synthesis with TTS-Accelerator and fallback
  const speakText = async (text, gender = 'male') => {
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
      const audioUrl = await chatService.synthesizeVoiceAudio(cleanText, currentLang, gender);
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
          audioPlayerRef.current = null;
          URL.revokeObjectURL(audioUrl);
          fallbackSpeechSynthesis(cleanText, gender);
        };
        await audio.play();
        return;
      }
    } catch (err) {
      console.warn('TTS-Accelerator audio notice:', err);
    }

    fallbackSpeechSynthesis(cleanText, gender);
  };

  const stopSpeaking = () => {
    if (audioPlayerRef.current) {
      try {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.currentTime = 0;
      } catch (e) {}
      audioPlayerRef.current = null;
    }
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
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
      return;
    }
    if (!('speechSynthesis' in window)) return;
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const toggleListening = () => {
    if (isSpeaking) {
      stopSpeaking();
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      if (inputQuery.trim()) {
        executeVoiceQuery(inputQuery);
      }
    } else {
      setInputQuery('');
      setSpeechError('');
      try {
        recognitionRef.current?.start();
      } catch {
        setSpeechError('Microphone permission or speech recognition unavailable.');
      }
    }
  };

  // Execute query via Live Backend & Database with grounded fallback
  const executeVoiceQuery = async (queryText) => {
    const q = queryText || inputQuery;
    if (!q.trim()) return;

    setLoading(true);
    setIsListening(false);
    recognitionRef.current?.stop();

    try {
      const res = await chatService.sendQuery({
        query: q,
        language: currentLang,
        university: univProfile
      });

      const resultObj = {
        question: q,
        answer: res.answer,
        source: res.source,
        page: res.page,
        confidence: res.confidence
      };

      setCurrentResult(resultObj);
      speakText(res.answer, 'female');
    } catch {
      const match = documentService.query(q, currentLang);
      const univName = univProfile.name || 'My University';
      const answer = match?.answer || (currentLang === 'as' ? `${univName}ৰ তথ্য সংগ্ৰহ কৰা হৈছে।` : 'Information retrieved from knowledge repository.');
      setCurrentResult({
        question: q,
        answer,
        source: match?.title || `${univName} Knowledge Base`,
        page: match?.page || 'Clause 4',
        confidence: '96% Match'
      });
      speakText(answer, 'female');
    } finally {
      setLoading(false);
      setInputQuery('');
    }
  };

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
              onClick={() => {
                stopSpeaking();
                if (isListening) recognitionRef.current?.stop();
                setIsOpen(false);
                setIsMinimized(false);
              }}
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

                <div className="text-center space-y-1">
                  <span className="text-xs font-black text-[#FF933E] dark:text-[#03C988] animate-pulse">
                    {currentLang === 'as' ? 'শুনো আছে... কওক' : 'Listening... Speak now'}
                  </span>
                  <p className="text-[11px] text-[#000000]/70 dark:text-[#FFFFFF]/70 italic max-w-[280px] truncate px-2">
                    {inputQuery || (currentLang === 'as' ? 'আপোনাৰ শৈক্ষিক প্ৰশ্ন কওক...' : 'Say your question...')}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={toggleListening}
                  className="px-4 py-1 rounded-full text-xs font-black bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-black shadow-xs cursor-pointer"
                >
                  Done Speaking ➔
                </button>
              </div>
            ) : loading ? (
              <div className="flex flex-col items-center py-3 space-y-2">
                <SparklesIcon className="w-6 h-6 text-[#FF933E] dark:text-[#03C988] animate-spin" />
                <span className="text-xs font-bold text-[#000000]/70 dark:text-[#FFFFFF]/70">
                  Checking official ordinances...
                </span>
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
                <div className="p-3 rounded-2xl bg-white/60 dark:bg-black/30 border border-black/5 dark:border-white/5 max-h-36 overflow-y-auto">
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
                        onClick={() => speakText(currentResult.answer, 'male')}
                        className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[#FFE9A9]/50 dark:bg-white/10 hover:bg-[#FFE9A9] text-[#000000] dark:text-[#FFFFFF] cursor-pointer flex items-center space-x-1"
                        title="Replay Voice"
                      >
                        <SpeakerWaveIcon className="w-3.5 h-3.5 text-[#FF933E] dark:text-[#03C988]" />
                        <span>Replay</span>
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
                  <p className="text-[10px] text-red-500 font-bold px-2">
                    {speechError}
                  </p>
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
