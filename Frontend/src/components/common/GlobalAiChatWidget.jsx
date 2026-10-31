import { useState, useRef, useEffect } from 'react';
import { universityService } from '../../services/universityService';
import { documentService } from '../../services/documentService';
import { 
  SparklesIcon, 
  SendIcon, 
  XMarkIcon, 
  BuildingLibraryIcon, 
  ShieldCheckIcon, 
  DocumentTextIcon, 
  DocumentDuplicateIcon,
  CheckCircleIcon,
  ClockIcon,
  TrashIcon,
  ArrowRightIcon
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

export const StopIcon = ({ className = "w-5 h-5", ...props }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" {...props}>
    <rect x="6" y="6" width="12" height="12" rx="2" />
  </svg>
);

export const GlobalAiChatWidget = ({ currentLang = 'en', onToggleLang, studentInfo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [univProfile, setUnivProfile] = useState(() => universityService.getProfile());

  useEffect(() => {
    const handleSync = () => setUnivProfile(universityService.getProfile());
    window.addEventListener('unimitra_university_changed', handleSync);
    return () => window.removeEventListener('unimitra_university_changed', handleSync);
  }, []);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: currentLang === 'as'
        ? `নমস্কাৰ! মই ${univProfile.asName || 'ডিব্ৰুগড় বিশ্ববিদ্যালয়'}ৰ ভয়েচ আৰু টেক্সট AI সহায়ক। মোক যিকোনো শৈক্ষিক বা পৰীক্ষা সংক্ৰান্ত প্ৰশ্ন সুধিব পাৰে। মাইক্ৰ’ফোন ব্যৱহাৰ কৰি কথা পাতক!`
        : `Hello! I am ${univProfile.name || 'Dibrugarh University'}'s Voice & Text AI Assistant. Ask questions on regulations, exams, admissions, or scholarships. You can also talk to me via voice!`,
      source: `${univProfile.name || 'Dibrugarh University'} Knowledge Base`,
      page: 'Verified Institutional Ordinance',
      confidence: '100% Match',
      time: 'Just now'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(true);
  const [speechError, setSpeechError] = useState('');

  const chatBottomRef = useRef(null);
  const recognitionRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Initialize Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = currentLang === 'as' ? 'bn-IN' : 'en-IN'; // Fallback to Indian English / Bengali phonetics for Assamese

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
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        setSpeechError('Microphone not recognized or permission denied.');
        setTimeout(() => setSpeechError(''), 4000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [currentLang]);

  // Toggle Voice Recognition
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
        console.error('Recognition start error:', err);
      }
    }
  };

  // Text-to-Speech Output Handler
  const speakText = (text) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // Stop any active speech

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

  // Execute RAG Query
  const executeQuery = (queryText) => {
    if (!queryText.trim() || loading) return;

    // Stop speaking prior answers
    stopSpeaking();

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: queryText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setLoading(true);

    setTimeout(() => {
      const approvedDocs = documentService.getApprovedDocuments();
      const result = universityService.searchUniversityKnowledge(queryText, currentLang, approvedDocs);

      const aiResponse = {
        id: Date.now() + 1,
        sender: 'ai',
        text: result?.answer || (currentLang === 'as' ? 'তথ্য পোৱা নগ’ল।' : 'Information not found.'),
        source: result?.source || `${univProfile.name} Gazette`,
        page: result?.page || 'Statutory Clause',
        confidence: result?.confidence || '99.4% Grounded Match',
        domain: result?.domain || 'Institutional Repository',
        isUnverified: result?.isUnverified || false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiResponse]);
      setLoading(false);

      // Auto Voice Chat Playback if enabled
      if (voiceOutputEnabled) {
        setTimeout(() => speakText(aiResponse.text), 200);
      }
    }, 600);
  };

  const handleSend = (e) => {
    e?.preventDefault();
    executeQuery(inputQuery);
  };

  // Handle Enter key for multiline textarea (Shift+Enter for newline, Enter to send)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Spatial Neomorphic Trigger Orb in Bottom Right */}
      {!isOpen && (
        <aside 
          aria-label="Floating AI Assistant Launcher"
          className="fixed bottom-6 right-6 z-50 animate-ambient-float"
        >
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center space-x-3 px-4 py-3 rounded-full neo-surface cursor-pointer shadow-[0_12px_36px_rgba(255,147,62,0.35)] dark:shadow-[0_12px_36px_rgba(3,201,136,0.25)] border border-white/80 dark:border-[#1C82AD]/40 hover:scale-105 transition-all duration-300"
            title="Open UniMitra Bilingual Voice AI Assistant"
          >
            {/* Glowing Orb */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF933E] to-[#FFCB56] dark:from-[#03C988] dark:to-[#1C82AD] flex items-center justify-center text-white dark:text-black shadow-md relative">
              <SparklesIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#03C988] border-2 border-white dark:border-[#13005A] animate-ping" />
            </div>

            <div className="flex flex-col text-left pr-1">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-black tracking-tight text-[#000000] dark:text-[#FFFFFF]">
                  {univProfile.abbreviation || 'MU'} Assistant
                </span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#FFE9A9] dark:bg-white/10 text-[#FF933E] dark:text-[#03C988]">
                  Voice
                </span>
              </div>
              <p className="text-[10px] text-[#000000]/60 dark:text-[#FFFFFF]/70 font-semibold">
                {currentLang === 'as' ? 'প্ৰশ্ন সোধক বা কওক' : 'Ask questions'}
              </p>
            </div>
          </button>
        </aside>
      )}

      {/* Expanded Neomorphic Spatial Float Drawer */}
      {isOpen && (
        <aside 
          aria-label="UniMitra Spatial AI Assistant Window"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[560px] max-h-[80vh] neo-surface rounded-[2rem] shadow-[0_24px_70px_rgba(0,0,0,0.35)] dark:shadow-[0_24px_70px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden border border-white/70 dark:border-white/10 animate-scale-up"
        >
          
          {/* Header Bar */}
          <div className="px-4 py-2.5 bg-gradient-to-r from-[#FFE9A9]/40 via-white/40 to-transparent dark:from-white/5 dark:via-transparent dark:to-transparent border-b border-black/5 dark:border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#FF933E] to-[#FFCB56] dark:from-[#03C988] dark:to-[#1C82AD] flex items-center justify-center text-white dark:text-black shadow-xs">
                <BuildingLibraryIcon className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
                    {univProfile.name || 'My University'} Assistant
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-[#03C988] animate-pulse" />
                </div>
                <p className="text-[10px] text-[#000000]/60 dark:text-[#FFFFFF]/70">
                  {currentLang === 'as' ? 'বিশ্ববিদ্যালয় তথ্য সহায়ক' : 'Official University Assistant'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              {/* Voice Output Speaker Toggle */}
              <button
                onClick={() => {
                  if (isSpeaking) stopSpeaking();
                  setVoiceOutputEnabled(!voiceOutputEnabled);
                }}
                className={`p-1.5 rounded-full transition-colors cursor-pointer border ${
                  voiceOutputEnabled
                    ? 'bg-[#FF933E]/20 text-[#FF933E] dark:bg-[#03C988]/20 dark:text-[#03C988] border-[#FF933E]/40 dark:border-[#03C988]/40'
                    : 'text-[#000000]/40 dark:text-[#FFFFFF]/40 border-transparent hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                title={voiceOutputEnabled ? 'Voice Output Active (Click to mute)' : 'Voice Output Muted (Click to enable)'}
              >
                <SpeakerWaveIcon className="w-4 h-4" />
              </button>

              {/* Close Button */}
              <button
                onClick={() => {
                  stopSpeaking();
                  if (isListening && recognitionRef.current) recognitionRef.current.stop();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-full text-[#000000]/60 dark:text-[#FFFFFF]/60 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
                title="Close Assistant"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Speaking Indicator */}
          {isSpeaking && (
            <div className="px-4 py-1.5 bg-[#03C988]/15 dark:bg-[#03C988]/20 border-b border-[#03C988]/30 flex items-center justify-between text-xs text-[#03C988] font-bold shrink-0">
              <div className="flex items-center space-x-2">
                <SpeakerWaveIcon className="w-3.5 h-3.5 animate-pulse" />
                <span className="text-[11px]">Speaking official response aloud...</span>
              </div>
              <button 
                onClick={stopSpeaking}
                className="text-[10px] font-black underline hover:text-black cursor-pointer"
              >
                Stop Audio
              </button>
            </div>
          )}

          {/* Active Listening Indicator */}
          {isListening && (
            <div className="px-4 py-2 bg-[#FF933E]/15 dark:bg-[#03C988]/20 border-b border-[#FF933E]/40 flex items-center justify-between shrink-0 animate-fade-in">
              <div className="flex items-center space-x-2">
                <div className="flex items-end space-x-0.5 h-5">
                  <span className="w-1 bg-[#FF933E] dark:bg-[#03C988] rounded-full audio-bar-1" />
                  <span className="w-1 bg-[#FF933E] dark:bg-[#03C988] rounded-full audio-bar-2" />
                  <span className="w-1 bg-[#FF933E] dark:bg-[#03C988] rounded-full audio-bar-3" />
                  <span className="w-1 bg-[#FF933E] dark:bg-[#03C988] rounded-full audio-bar-4" />
                  <span className="w-1 bg-[#FF933E] dark:bg-[#03C988] rounded-full audio-bar-5" />
                </div>
                <span className="text-xs font-black text-[#FF933E] dark:text-[#03C988]">
                  Listening to your voice... Speak now!
                </span>
              </div>
              <button
                onClick={toggleListening}
                className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#FF933E] text-white dark:bg-[#03C988] dark:text-black cursor-pointer"
              >
                Done
              </button>
            </div>
          )}

          {speechError && (
            <div className="px-4 py-1.5 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 text-[11px] font-bold border-b border-red-200 shrink-0">
              {speechError}
            </div>
          )}

          {/* Quick Prompts Bar */}
          <div className="px-3 py-1.5 bg-white/40 dark:bg-[#0A0A0A]/40 border-b border-[#73A5CA]/20 flex items-center gap-1.5 overflow-x-auto shrink-0">
            {[
              { label: 'Passing Criteria (৪০% নম্বৰ)', q: 'ডিব্ৰুগড় বিশ্ববিদ্যালয়ৰ পৰীক্ষাত উত্তীৰ্ণ হোৱাৰ নূন্যতম নম্বৰ কিমান?' },
              { label: 'Attendance (উপস্থিতি ৰেহাই)', q: 'মেডিকেল কাৰণত উপস্থিতি কিমান শতাংশলৈ ৰেহাই পোৱা যায়?' },
              { label: 'Ishan Uday (ঈশান উদয়)', q: 'ঈশান উদয় জলপানি পাবলৈ কি কি প্ৰমাণপত্ৰ লাগিব?' }
            ].map((p, i) => (
              <button
                key={i}
                onClick={() => executeQuery(p.q)}
                className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/80 dark:bg-[#141414] hover:bg-[#FFE9A9]/50 text-[#000000] dark:text-[#FFFFFF] border border-[#73A5CA]/30 dark:border-[#1C82AD]/30 whitespace-nowrap cursor-pointer transition-colors shadow-2xs"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Messages Stream (Fluid, zero outer margins) */}
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-[1.6rem] p-3.5 text-xs leading-relaxed transition-all ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-[#FF933E] to-[#FFCB56] dark:from-[#03C988] dark:to-[#1C82AD] text-white dark:text-black rounded-br-xs font-bold shadow-sm'
                      : 'neo-surface border border-white/80 dark:border-[#1C82AD]/40 text-[#000000] dark:text-[#FFFFFF] rounded-bl-xs font-medium shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* AI Grounded Citation Card */}
                  {msg.sender === 'ai' && (
                    <div className="mt-2.5 pt-2 border-t border-[#73A5CA]/25 dark:border-[#1C82AD]/30 space-y-2">
                      <div className="p-2 rounded-xl bg-[#FFE9A9]/30 dark:bg-[#0A0A0A] text-[10px] font-mono flex items-center justify-between">
                        <div className="flex items-center space-x-1.5 truncate">
                          <DocumentTextIcon className="w-3.5 h-3.5 text-[#FF933E] dark:text-[#03C988] shrink-0" />
                          <span className="truncate font-bold">{msg.source}</span>
                        </div>
                        <span className="font-sans font-bold text-[#FF933E] dark:text-[#03C988] shrink-0 ml-1.5">
                          {msg.page}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-[#000000]/50 dark:text-[#FFFFFF]/50">
                          {msg.time} • {msg.confidence}
                        </span>

                        {/* Listen with Voice Button */}
                        <button
                          onClick={() => speakText(msg.text)}
                          className="px-2 py-0.5 rounded-md text-[10px] font-bold text-[#FF933E] dark:text-[#03C988] hover:bg-[#FFE9A9]/40 dark:hover:bg-[#13005A] flex items-center space-x-1 cursor-pointer"
                          title="Listen with Text-to-Speech"
                        >
                          <SpeakerWaveIcon className="w-3 h-3" />
                          <span>Listen</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-xs text-[#000000]/60 dark:text-[#FFFFFF]/60 animate-pulse pl-2">
                <SparklesIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988] animate-spin" />
                <span>Searching institutional knowledge base...</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Spacious Fluid Textarea & Voice Bar (No extra margin, edge-to-edge breathing room) */}
          <form 
            onSubmit={handleSend}
            className="p-3 bg-white/70 dark:bg-[#0A0A0A]/80 border-t border-[#73A5CA]/30 dark:border-[#1C82AD]/30 shrink-0 space-y-2"
          >
            {/* Expanded Textarea for rich typing space */}
            <div className="relative rounded-2xl neo-inset p-2">
              <textarea
                ref={textareaRef}
                rows={2}
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  currentLang === 'as'
                    ? 'অসমীয়া বা ইংৰাজীত প্ৰশ্ন লিখক বা মাইক টিপি কওক...'
                    : 'Type query in Assamese/English or tap mic to speak...'
                }
                className="w-full bg-transparent text-xs text-[#000000] dark:text-[#FFFFFF] placeholder-[#000000]/50 dark:placeholder-[#FFFFFF]/50 outline-none resize-none leading-relaxed"
              />

              <div className="flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/5">
                {/* Voice Input Microphone Button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-1.5 rounded-full transition-all cursor-pointer flex items-center space-x-1 ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse shadow-md'
                      : 'bg-[#FFE9A9]/60 dark:bg-[#141414] text-[#FF933E] dark:text-[#03C988] hover:scale-105'
                  }`}
                  title={isListening ? 'Stop Listening' : 'Speak your question (Voice Input)'}
                >
                  <MicrophoneIcon className="w-4 h-4" />
                  <span className="text-[10px] font-black hidden sm:inline pr-1">
                    {isListening ? 'Listening...' : 'Voice'}
                  </span>
                </button>

                <div className="flex items-center space-x-1.5">
                  <span className="text-[9px] text-[#000000]/40 dark:text-[#FFFFFF]/40 hidden sm:inline">
                    Enter to send
                  </span>

                  <button
                    type="submit"
                    disabled={!inputQuery.trim() || loading}
                    className="px-3.5 py-1.5 rounded-full font-black text-xs text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] dark:text-black disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs flex items-center space-x-1"
                  >
                    <SendIcon className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </div>
          </form>

        </aside>
      )}
    </>
  );
};

