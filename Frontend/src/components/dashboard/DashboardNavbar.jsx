import { useState, useEffect, useRef } from 'react';
import { universityService } from '../../services/universityService';
import { 
  MenuIcon, 
  SearchIcon, 
  BellIcon, 
  SunIcon, 
  MoonIcon,
  SparklesIcon,
  VoiceAssistantLogo,
  BuildingLibraryIcon
} from '../common/Icons';

/**
 * Editorial + Aurora Dashboard Top Navigation
 * Minimal, transparent with backdrop blur, fine hairline dividers, and elegant typography.
 */
export const DashboardNavbar = ({ 
  onToggleSidebar, 
  currentLang = 'en', 
  onToggleLang, 
  isDark = false, 
  onToggleTheme,
  onNavigateAi,
  studentInfo = { name: 'Scholar', role: 'Student' }
}) => {
  const [noticesOpen, setNoticesOpen] = useState(false);
  const [notices, setNotices] = useState(() => universityService.getNotices());
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleSync = () => setNotices(universityService.getNotices());
    window.addEventListener('unimitra_university_changed', handleSync);
    return () => window.removeEventListener('unimitra_university_changed', handleSync);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setNoticesOpen(false);
      }
    };
    if (noticesOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [noticesOpen]);

  return (
    <header className="sticky top-0 z-30 h-18 bg-[#F7F6F0]/85 dark:bg-[#16181A]/85 backdrop-blur-md border-b border-[#123C3A]/10 dark:border-[#55C7B2]/15 transition-colors duration-300 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-full">
        
        {/* Left: Mobile Drawer Trigger + Minimal Editorial Search */}
        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 max-w-lg">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-[#273B45] dark:text-[#DCE8E4] hover:bg-[#E9F0ED] dark:hover:bg-[#142426] transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <MenuIcon className="w-5 h-5" />
          </button>

          <img 
            src="/unimitra-emblem.png" 
            alt="UniMitra Emblem" 
            className="w-7 h-7 object-contain lg:hidden" 
          />

          {/* Institutional Search Bar - Hairline border, subtle ambient focus */}
          <div className="relative w-full hidden sm:block">
            <SearchIcon className="w-4 h-4 text-[#123C3A]/60 dark:text-[#55C7B2]/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={currentLang === 'as' ? 'বিশ্ববিদ্যালয় নিয়মাৱলী, পৰীক্ষা বা ছাত্ৰবৃত্তি বিচাৰক...' : 'Search university regulations, exams, admissions, grants...'}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-[#123C3A]/12 dark:border-[#55C7B2]/20 bg-white/70 dark:bg-[#142426]/70 text-[#273B45] dark:text-[#DCE8E4] placeholder-[#273B45]/45 dark:placeholder-[#879B99] outline-none focus:border-[#123C3A] dark:focus:border-[#55C7B2] focus:ring-1 focus:ring-[#123C3A]/10 dark:focus:ring-[#55C7B2]/20 transition-all font-sans"
            />
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Quick Ask AI Assistant - Editorial Primary Button with Champagne highlight */}
          <button
            onClick={onNavigateAi}
            className="hidden md:flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-[#123C3A] hover:bg-[#184e4c] dark:bg-[#55C7B2] dark:hover:bg-[#68d8c3] dark:text-[#16181A] transition-all cursor-pointer shadow-xs shrink-0 font-heading"
          >
            <VoiceAssistantLogo className="w-5.5 h-5.5" animated={true} />
            <span>{currentLang === 'as' ? 'AI সহায়কক সোধক' : 'Ask AI Assistant'}</span>
          </button>

          {/* Bilingual Switcher (Assamese / English) */}
          <div className="flex items-center p-0.5 bg-[#E9F0ED] dark:bg-[#142426] rounded-xl border border-[#123C3A]/10 dark:border-[#55C7B2]/15">
            <button
              onClick={() => currentLang !== 'as' && onToggleLang()}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer font-assamese ${
                currentLang === 'as'
                  ? 'bg-white dark:bg-[#16181A] text-[#123C3A] dark:text-[#55C7B2] shadow-xs'
                  : 'text-[#627680] dark:text-[#879B99] hover:text-[#273B45] dark:hover:text-[#DCE8E4]'
              }`}
            >
              অসমীয়া
            </button>
            <button
              onClick={() => currentLang !== 'en' && onToggleLang()}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer font-sans ${
                currentLang === 'en'
                  ? 'bg-white dark:bg-[#16181A] text-[#123C3A] dark:text-[#55C7B2] shadow-xs'
                  : 'text-[#627680] dark:text-[#879B99] hover:text-[#273B45] dark:hover:text-[#DCE8E4]'
              }`}
            >
              EN
            </button>
          </div>

          {/* Theme Toggle - Light (#F7F6F0) / Dark (#16181A) */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-xl border border-[#123C3A]/10 dark:border-[#55C7B2]/15 bg-white/60 dark:bg-[#142426]/60 text-[#273B45] dark:text-[#E0B77A] hover:bg-[#E9F0ED] dark:hover:bg-[#142426] transition-colors cursor-pointer"
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDark ? <SunIcon className="w-4 h-4 text-[#E0B77A]" /> : <MoonIcon className="w-4 h-4 text-[#123C3A]" />}
          </button>

          {/* Institutional Notification Bell with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setNoticesOpen(!noticesOpen)}
              className="relative p-2 rounded-xl border border-[#123C3A]/10 dark:border-[#55C7B2]/15 bg-white/60 dark:bg-[#142426]/60 text-[#273B45] dark:text-[#DCE8E4] hover:bg-[#E9F0ED] dark:hover:bg-[#142426] transition-colors cursor-pointer"
              aria-label="View notifications"
            >
              <BellIcon className="w-4 h-4" />
              {notices.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#D4A96A] dark:bg-[#55C7B2] absolute top-1.5 right-1.5 ring-2 ring-white dark:ring-[#16181A]" />
              )}
            </button>

            {noticesOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#142426] border border-[#123C3A]/15 dark:border-[#55C7B2]/20 shadow-2xl p-4 space-y-3 z-50 animate-scale-up">
                <div className="flex items-center justify-between border-b border-[#123C3A]/10 dark:border-[#55C7B2]/15 pb-2">
                  <span className="text-xs font-bold text-[#123C3A] dark:text-[#DCE8E4] font-heading">
                    Official Notices & Gazettes ({notices.length})
                  </span>
                  <span className="text-[10px] text-[#627680] dark:text-[#879B99]">
                    Latest Circulars
                  </span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {notices.map((n) => (
                    <div
                      key={n.id}
                      className="p-2.5 rounded-xl bg-[#F7F6F0] dark:bg-[#16181A] border border-[#123C3A]/10 dark:border-[#55C7B2]/10 space-y-1 hover:border-[#D4A96A] transition-colors"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-mono font-bold text-[#D4A96A] dark:text-[#55C7B2]">{n.refNo}</span>
                        <span className="text-[#627680] dark:text-[#879B99]">{n.date}</span>
                      </div>
                      <h5 className="text-xs font-bold text-[#123C3A] dark:text-[#DCE8E4] line-clamp-1">{n.title}</h5>
                      <p className="text-[11px] text-[#627680] dark:text-[#879B99] line-clamp-2">{n.summary}</p>
                      {n.pdfUrl && (
                        <div className="pt-1 flex justify-end">
                          <a
                            href={n.pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => setNoticesOpen(false)}
                            className="text-[10px] font-bold text-[#123C3A] dark:text-[#55C7B2] hover:underline"
                          >
                            Open PDF Notice ↗
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Student Profile Stamp */}
          <div className="flex items-center space-x-2.5 pl-2 border-l border-[#123C3A]/10 dark:border-[#55C7B2]/15">
            <div className="w-8 h-8 rounded-xl bg-[#123C3A] dark:bg-[#55C7B2] text-[#D4A96A] dark:text-[#16181A] flex items-center justify-center font-bold text-xs font-heading">
              {studentInfo?.name?.charAt(0) || 'U'}
            </div>
            <div className="hidden xl:block text-left leading-tight">
              <span className="text-xs font-semibold text-[#273B45] dark:text-[#DCE8E4] block truncate max-w-[120px] font-heading">
                {studentInfo?.name || 'Member'}
              </span>
              <span className="text-[10px] text-[#627680] dark:text-[#879B99] font-medium">
                {studentInfo?.role || 'Student'}
              </span>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
