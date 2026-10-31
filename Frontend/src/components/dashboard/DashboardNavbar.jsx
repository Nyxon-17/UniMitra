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
    <header className="sticky top-0 z-30 h-20 bg-[#FEFAF3]/95 dark:bg-[#1C4412]/95 backdrop-blur-xs border-b border-[#B8CFB3] dark:border-[#728E6D] transition-colors duration-200 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-full">
        
        {/* Left: Mobile Sidebar Button + Search Input */}
        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 max-w-lg">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-[#15370D] dark:text-[#FFF2B4] hover:bg-[#B8CFB3]/30 dark:hover:bg-[#15370D] cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <MenuIcon className="w-6 h-6" />
          </button>

          {/* Institutional Search Bar */}
          <div className="relative w-full hidden sm:block">
            <SearchIcon className="w-4 h-4 text-[#84A282] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={currentLang === 'as' ? 'নিয়ম, পৰীক্ষা, ভৰ্তি বা ছাত্ৰবৃত্তি বিচাৰক...' : 'Search regulations, exams, admissions, scholarships...'}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl border border-[#B8CFB3] dark:border-[#728E6D] bg-white dark:bg-[#15370D] text-[#15370D] dark:text-[#FFF2B4] outline-none focus:border-[#84A282] transition-all font-semibold"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Quick Ask AI Assistant */}
          <button
            onClick={onNavigateAi}
            className="hidden md:flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-black text-white bg-[#84A282] hover:bg-[#6F8E6D] transition-all cursor-pointer shadow-elevated-sage shrink-0"
          >
            <SparklesIcon className="w-3.5 h-3.5 text-[#FFF2B4]" />
            <span>{currentLang === 'as' ? 'AI সহায়কক সোধক' : 'Ask AI Assistant'}</span>
          </button>

          {/* Language Switcher */}
          <div className="flex items-center p-1 bg-[#B8CFB3]/30 dark:bg-[#15370D] rounded-xl border border-[#B8CFB3] dark:border-[#728E6D]">
            <button
              onClick={() => currentLang !== 'as' && onToggleLang()}
              className={`px-2 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                currentLang === 'as'
                  ? 'bg-[#84A282] text-white shadow-xs'
                  : 'text-[#15370D] dark:text-[#E5CD82]'
              }`}
            >
              অসমীয়া
            </button>
            <button
              onClick={() => currentLang !== 'en' && onToggleLang()}
              className={`px-2 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                currentLang === 'en'
                  ? 'bg-[#84A282] text-white shadow-xs'
                  : 'text-[#15370D] dark:text-[#E5CD82]'
              }`}
            >
              EN
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-xl border border-[#B8CFB3] dark:border-[#728E6D] bg-white dark:bg-[#15370D] text-[#15370D] dark:text-[#FFF2B4] hover:bg-[#B8CFB3]/30 cursor-pointer"
          >
            {isDark ? <SunIcon className="w-4 h-4 text-[#FFF2B4]" /> : <MoonIcon className="w-4 h-4 text-[#15370D]" />}
          </button>

          {/* Notifications Indicator */}
          <button
            onClick={() => alert("No pending institutional notices or circular alerts.")}
            className="relative p-2 rounded-xl border border-[#B8CFB3] dark:border-[#728E6D] bg-white dark:bg-[#15370D] text-[#15370D] dark:text-[#FFF2B4] hover:bg-[#B8CFB3]/30 cursor-pointer"
            aria-label="View notifications"
          >
            <BellIcon className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-[#84A282] absolute top-1.5 right-1.5 ring-2 ring-white dark:ring-[#15370D]"></span>
          </button>

          {/* User Profile Badge */}
          <div className="flex items-center space-x-2 pl-2 border-l border-[#B8CFB3] dark:border-[#728E6D]">
            <div className="w-8 h-8 rounded-xl bg-[#84A282] text-white flex items-center justify-center font-black text-xs shadow-xs">
              {studentInfo?.name?.charAt(0) || 'U'}
            </div>
            <div className="hidden xl:block text-left leading-tight">
              <span className="text-xs font-black text-[#15370D] dark:text-[#FFF2B4] block truncate max-w-[120px]">
                {studentInfo?.name || 'Member'}
              </span>
              <span className="text-[10px] text-[#4F6D4B] dark:text-[#E5CD82] font-semibold">
                {studentInfo?.role || 'Student'}
              </span>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
