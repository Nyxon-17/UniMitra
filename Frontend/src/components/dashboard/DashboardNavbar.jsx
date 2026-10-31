import { 
  MenuIcon, 
  SearchIcon, 
  BellIcon, 
  SunIcon, 
  MoonIcon,
  SparklesIcon,
  UserGroupIcon
} from '../common/Icons';

export const DashboardNavbar = ({ 
  onToggleSidebar, 
  currentLang = 'en', 
  onToggleLang, 
  isDark = false, 
  onToggleTheme,
  onNavigateAi,
  studentInfo = { name: 'Scholar', role: 'Student' }
}) => {
  return (
    <header className="sticky top-0 z-30 h-20 bg-white/95 dark:bg-[#120B24]/95 backdrop-blur-xs border-b border-[#E0D4FD] dark:border-[#3B2868] transition-colors duration-200 px-4 sm:px-6 lg:px-8 shadow-xs">
      <div className="flex items-center justify-between h-full">
        
        {/* Left: Mobile Sidebar Button + Search Input */}
        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 max-w-lg">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-[#1E1035] dark:text-[#FAF8FF] hover:bg-[#E0D4FD]/40 dark:hover:bg-[#1A0F33] cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <MenuIcon className="w-6 h-6" />
          </button>

          {/* Institutional Search Bar */}
          <div className="relative w-full hidden sm:block">
            <SearchIcon className="w-4 h-4 text-[#8F00FF] dark:text-[#FBBF24] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={currentLang === 'as' ? 'নিয়ম, পৰীক্ষা, ভৰ্তি বা ছাত্ৰবৃত্তি বিচাৰক...' : 'Search regulations, exams, admissions, scholarships...'}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0A0718] text-[#1E1035] dark:text-[#FAF8FF] outline-none focus:border-[#8F00FF] dark:focus:border-[#FBBF24] transition-all font-semibold"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Quick Ask AI Assistant - Deep Violet button with Amber Accent */}
          <button
            onClick={onNavigateAi}
            className="hidden md:flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-black text-white bg-[#4C1D95] hover:bg-[#8F00FF] transition-all cursor-pointer shadow-xs dark:shadow-[0_0_12px_rgba(176,38,255,0.35)] shrink-0"
          >
            <SparklesIcon className="w-3.5 h-3.5 text-[#DDD6FE] dark:text-[#FBBF24]" />
            <span>{currentLang === 'as' ? 'AI সহায়কক সোধক' : 'Ask AI Assistant'}</span>
          </button>

          {/* Language Switcher */}
          <div className="flex items-center p-1 bg-[#E0D4FD]/30 dark:bg-[#0A0718] rounded-xl border border-[#E0D4FD] dark:border-[#3B2868]">
            <button
              onClick={() => currentLang !== 'as' && onToggleLang()}
              className={`px-2 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                currentLang === 'as'
                  ? 'bg-[#4C1D95] text-white shadow-xs'
                  : 'text-[#1E1035] dark:text-[#C4B5FD]'
              }`}
            >
              অসমীয়া
            </button>
            <button
              onClick={() => currentLang !== 'en' && onToggleLang()}
              className={`px-2 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                currentLang === 'en'
                  ? 'bg-[#4C1D95] text-white shadow-xs'
                  : 'text-[#1E1035] dark:text-[#C4B5FD]'
              }`}
            >
              EN
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0A0718] text-[#1E1035] dark:text-[#FBBF24] hover:bg-[#E0D4FD]/40 cursor-pointer dark:hover:shadow-[0_0_10px_rgba(251,191,36,0.25)]"
          >
            {isDark ? <SunIcon className="w-4 h-4 text-[#FBBF24]" /> : <MoonIcon className="w-4 h-4 text-[#4C1D95]" />}
          </button>

          {/* Notifications Indicator */}
          <button
            onClick={() => alert("No pending institutional notices or circular alerts.")}
            className="relative p-2 rounded-xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0A0718] text-[#1E1035] dark:text-[#FAF8FF] hover:bg-[#E0D4FD]/40 cursor-pointer"
            aria-label="View notifications"
          >
            <BellIcon className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-[#10B981] absolute top-1.5 right-1.5 ring-2 ring-white dark:ring-[#120B24]"></span>
          </button>

          {/* User Profile Badge */}
          <div className="flex items-center space-x-2 pl-2 border-l border-[#E0D4FD] dark:border-[#3B2868]">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6D28D9] to-[#8F00FF] text-white flex items-center justify-center font-black text-xs shadow-xs">
              {studentInfo?.name?.charAt(0) || 'U'}
            </div>
            <div className="hidden xl:block text-left leading-tight">
              <span className="text-xs font-black text-[#1E1035] dark:text-[#FAF8FF] block truncate max-w-[120px]">
                {studentInfo?.name || 'Member'}
              </span>
              <span className="text-[10px] text-[#555375] dark:text-[#C4B5FD] font-semibold">
                {studentInfo?.role || 'Student'}
              </span>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
