import { useState } from 'react';
import { AcademicCapIcon, MenuIcon, XMarkIcon, SparklesIcon, SunIcon, MoonIcon, LanguageIcon } from '../common/Icons';

export const Navbar = ({ 
  activePage = 'home', 
  onNavigate, 
  onOpenAuth,
  currentLang = 'en', 
  onToggleLang,
  isDark = false,
  onToggleTheme
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { id: 'home', label: 'Home', asLabel: 'মূল পৃষ্ঠা' },
    { id: 'features', label: 'Features', asLabel: 'সুবিধাসমূহ' },
    { id: 'universities', label: 'Universities', asLabel: 'বিশ্ববিদ্যালয়সমূহ' },
    { id: 'faq', label: 'FAQ', asLabel: 'প্ৰশ্নোত্তৰ' },
    { id: 'about', label: 'About Us', asLabel: 'আমাৰ বিষয়ে' },
    { id: 'contact', label: 'Contact', asLabel: 'যোগাযোগ' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-[#0E1726] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div 
            className="flex items-center space-x-3 cursor-pointer select-none" 
            onClick={() => handleNav('home')}
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#118AB2] to-[#06D6A0] flex items-center justify-center text-white shadow-md border border-[#118AB2]/30">
              <AcademicCapIcon className="w-6 h-6 text-[#FFD166]" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#073B4C] dark:text-white">
                Uni<span className="text-[#FF7F50]">Mitra</span>
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-tight">
                {currentLang === 'as' ? 'বিশ্ববিদ্যালয়ৰ শৈক্ষিক সহায়ক' : 'University Academic Assistant'}
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activePage === link.id
                    ? 'bg-[#E7F3F7] dark:bg-[#118AB2]/20 text-[#118AB2] dark:text-[#FFD166] border border-[#118AB2]/30'
                    : 'text-slate-700 dark:text-slate-200 hover:text-[#118AB2] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {currentLang === 'as' ? link.asLabel : link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Tools: Language Switcher, Dark/White Mode, Sign In */}
          <div className="hidden md:flex items-center space-x-2.5">
            
            {/* Direct Language Switcher on Navbar */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => currentLang !== 'as' && onToggleLang()}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentLang === 'as'
                    ? 'bg-[#FF7F50] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>অসমীয়া</span>
              </button>
              <button
                onClick={() => currentLang !== 'en' && onToggleLang()}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentLang === 'en'
                    ? 'bg-[#118AB2] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>English</span>
              </button>
            </div>

            {/* Dark / Light Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              aria-label="Toggle Dark and Light Mode"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <SunIcon className="w-5 h-5 text-[#FFD166]" /> : <MoonIcon className="w-5 h-5 text-slate-700" />}
            </button>

            {/* Floating Sign In Modal Trigger */}
            <button 
              onClick={() => onOpenAuth && onOpenAuth('login')}
              className="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-[#118AB2] dark:text-[#06D6A0] bg-white dark:bg-slate-800 border-2 border-[#118AB2] dark:border-[#06D6A0] hover:bg-[#E7F3F7] dark:hover:bg-slate-700 transition-all cursor-pointer"
            >
              {currentLang === 'as' ? 'লগ-ইন' : 'Sign In'}
            </button>

            {/* Floating Student Registration Modal Trigger */}
            <button 
              onClick={() => onOpenAuth && onOpenAuth('register')}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#FF7F50] hover:bg-[#E86B3D] transition-all cursor-pointer shadow-elevated-coral shrink-0"
            >
              <SparklesIcon className="w-4 h-4 text-[#FFD166]" />
              <span>{currentLang === 'as' ? 'পঞ্জীয়ন' : 'Register Free'}</span>
            </button>

          </div>

          {/* Mobile Right Controls */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-300 cursor-pointer"
            >
              {isDark ? <SunIcon className="w-5 h-5 text-[#FFD166]" /> : <MoonIcon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#0E1726] border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-4 shadow-xl">
          
          {/* Mobile Language Switcher */}
          <div className="flex items-center justify-between p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center space-x-1.5">
              <LanguageIcon className="w-4 h-4 text-[#118AB2]" />
              <span>ভাষা / Language:</span>
            </span>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => currentLang !== 'as' && onToggleLang()}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  currentLang === 'as' ? 'bg-[#FF7F50] text-white' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                অসমীয়া
              </button>
              <button
                onClick={() => currentLang !== 'en' && onToggleLang()}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  currentLang === 'en' ? 'bg-[#118AB2] text-white' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                English
              </button>
            </div>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold ${
                  activePage === link.id
                    ? 'bg-[#E7F3F7] dark:bg-[#118AB2]/20 text-[#118AB2] dark:text-[#FFD166]' 
                    : 'text-slate-800 dark:text-slate-200'
                }`}
              >
                {currentLang === 'as' ? link.asLabel : link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 flex flex-col space-y-2">
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth && onOpenAuth('login');
              }}
              className="w-full py-2.5 rounded-xl text-sm font-bold text-[#118AB2] dark:text-[#06D6A0] border-2 border-[#118AB2] dark:border-[#06D6A0] text-center"
            >
              Student Sign In
            </button>
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth && onOpenAuth('register');
              }}
              className="w-full py-3 rounded-xl text-sm font-bold text-white bg-[#FF7F50] text-center shadow-md"
            >
              Register Free Account
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
