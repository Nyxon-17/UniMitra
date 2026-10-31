import { 
  MenuIcon, 
  SearchIcon, 
  BellIcon, 
  SunIcon, 
  MoonIcon,
  SparklesIcon
} from '../common/Icons';

export const DashboardNavbar = ({ 
  onToggleSidebar, 
  currentLang = 'en', 
  onToggleLang, 
  isDark = false, 
  onToggleTheme,
  onNavigateAi,
  studentInfo = { name: 'Student' }
}) => {
  return (
    <header className="sticky top-0 z-30 h-20 bg-white/95 dark:bg-[#111C2E]/95 backdrop-blur-xs border-b border-slate-200 dark:border-slate-800 transition-colors duration-200 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-full">
        
        {/* Left: Mobile Sidebar Button + Search Input */}
        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 max-w-lg">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Toggle sidebar menu"
          >
            <MenuIcon className="w-6 h-6" />
          </button>

          {/* Quick Academic Search in Dashboard */}
          <div className="relative w-full hidden sm:block">
            <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={currentLang === 'as' ? 'পাঠ্যক্ৰম, বিষয় বা কোড বিচাৰক...' : 'Search courses, subjects, or syllabus topics...'}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-[#118AB2] transition-all"
            />
          </div>
        </div>

        {/* Right: Actions (Ask AI pill, Language, Theme, Bell, Student Profile) */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Quick Ask AI Button */}
          <button
            onClick={onNavigateAi}
            className="hidden md:flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#FF7F50] hover:bg-[#E86B3D] transition-all cursor-pointer shadow-elevated-coral shrink-0"
          >
            <SparklesIcon className="w-3.5 h-3.5 text-[#FFD166]" />
            <span>{currentLang === 'as' ? 'সহায়কক সোধক' : 'Ask Assistant'}</span>
          </button>

          {/* Language Switcher */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => currentLang !== 'as' && onToggleLang()}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentLang === 'as'
                  ? 'bg-[#FF7F50] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              অসমীয়া
            </button>
            <button
              onClick={() => currentLang !== 'en' && onToggleLang()}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentLang === 'en'
                  ? 'bg-[#118AB2] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {isDark ? <SunIcon className="w-4 h-4 text-[#FFD166]" /> : <MoonIcon className="w-4 h-4" />}
          </button>

          {/* Notifications Indicator */}
          <button
            onClick={() => alert("No new semester notifications right now.")}
            className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <BellIcon className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-[#FF7F50] absolute top-1.5 right-1.5 ring-2 ring-white dark:ring-slate-900"></span>
          </button>

          {/* Student Avatar Pill */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#118AB2] to-[#073B4C] text-[#FFD166] font-extrabold flex items-center justify-center text-xs shadow-xs border border-[#118AB2]/40">
              {studentInfo.name.charAt(0)}
            </div>
            <div className="hidden xl:block text-left">
              <span className="text-xs font-bold text-slate-900 dark:text-white block leading-tight">
                {studentInfo.name}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-none">
                Student
              </span>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};

