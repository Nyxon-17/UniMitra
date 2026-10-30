import { useState } from 'react';
import { AcademicCapIcon, MenuIcon, XMarkIcon, SparklesIcon, SunIcon, MoonIcon, LanguageIcon } from '../common/Icons';

export const Navbar = ({ 
  activePage = 'home', 
  onNavigate, 
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

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[#0E1726] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
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
          <nav className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => handleNav('home')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activePage === 'home'
                  ? 'bg-[#E7F3F7] dark:bg-[#118AB2]/20 text-[#118AB2] dark:text-[#FFD166] border border-[#118AB2]/30'
                  : 'text-slate-700 dark:text-slate-200 hover:text-[#118AB2] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {currentLang === 'as' ? 'মূল পৃষ্ঠা' : 'Home'}
            </button>

            <button
              onClick={() => handleNav('about')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activePage === 'about'
                  ? 'bg-[#E7F3F7] dark:bg-[#118AB2]/20 text-[#118AB2] dark:text-[#FFD166] border border-[#118AB2]/30'
                  : 'text-slate-700 dark:text-slate-200 hover:text-[#118AB2] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {currentLang === 'as' ? 'আমাৰ বিষয়ে' : 'About Us'}
            </button>

            <button
              onClick={() => handleNav('contact')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activePage === 'contact'
                  ? 'bg-[#E7F3F7] dark:bg-[#118AB2]/20 text-[#118AB2] dark:text-[#FFD166] border border-[#118AB2]/30'
                  : 'text-slate-700 dark:text-slate-200 hover:text-[#118AB2] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {currentLang === 'as' ? 'যোগাযোগ' : 'Contact Us'}
            </button>
          </nav>

          {/* Right Action Tools: Language Switcher, Dark/White Mode, Sign In */}
          <div className="hidden md:flex items-center space-x-3">
            
            {/* Direct Language Switcher Toggle on Navbar */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => currentLang !== 'as' && onToggleLang()}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentLang === 'as'
                    ? 'bg-[#FF7F50] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>অসমীয়া</span>
              </button>
              <button
                onClick={() => currentLang !== 'en' && onToggleLang()}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
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

            {/* Sign In Button */}
            <button 
              onClick={() => alert("Sign In will be connected during authentication setup.")}
              className="px-4 py-2.5 rounded-xl text-sm font-bold text-[#118AB2] dark:text-[#06D6A0] bg-white dark:bg-slate-800 border-2 border-[#118AB2] dark:border-[#06D6A0] hover:bg-[#E7F3F7] dark:hover:bg-slate-700 transition-all cursor-pointer"
            >
              {currentLang === 'as' ? 'লগ-ইন' : 'Sign In'}
            </button>

            {/* Main Action Button */}
            <button 
              onClick={() => handleNav('home')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#FF7F50] hover:bg-[#E86B3D] transition-all cursor-pointer shadow-elevated-coral"
            >
              <SparklesIcon className="w-4 h-4 text-[#FFD166]" />
              <span>{currentLang === 'as' ? 'সহায়ক আৰম্ভ কৰক' : 'Ask Assistant'}</span>
            </button>

          </div>

          {/* Mobile Right Controls */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-300 cursor-pointer"
            >
              {isDark ? <SunIcon className="w-5 h-5 text-[#FFD166]" /> : <MoonIcon className="w-5 h-5" />}
            </button>

            {/* Mobile Menu Button */}
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
        <div className="md:hidden bg-white dark:bg-[#0E1726] border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-4 shadow-xl">
          
          {/* Mobile Language Switcher */}
          <div className="flex items-center justify-between p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center space-x-1.5">
              <LanguageIcon className="w-4 h-4 text-[#118AB2]" />
              <span>Language / ভাষা:</span>
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
            <button
              onClick={() => handleNav('home')}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold ${
                activePage === 'home' 
                  ? 'bg-[#E7F3F7] dark:bg-[#118AB2]/20 text-[#118AB2] dark:text-[#FFD166]' 
                  : 'text-slate-800 dark:text-slate-200'
              }`}
            >
              {currentLang === 'as' ? 'মূল পৃষ্ঠা (Home)' : 'Home'}
            </button>

            <button
              onClick={() => handleNav('about')}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold ${
                activePage === 'about' 
                  ? 'bg-[#E7F3F7] dark:bg-[#118AB2]/20 text-[#118AB2] dark:text-[#FFD166]' 
                  : 'text-slate-800 dark:text-slate-200'
              }`}
            >
              {currentLang === 'as' ? 'আমাৰ বিষয়ে (About)' : 'About UniMitra'}
            </button>

            <button
              onClick={() => handleNav('contact')}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold ${
                activePage === 'contact' 
                  ? 'bg-[#E7F3F7] dark:bg-[#118AB2]/20 text-[#118AB2] dark:text-[#FFD166]' 
                  : 'text-slate-800 dark:text-slate-200'
              }`}
            >
              {currentLang === 'as' ? 'যোগাযোগ (Contact)' : 'Contact Us'}
            </button>
          </div>

          <div className="pt-2 flex flex-col space-y-2">
            <button 
              onClick={() => alert("Sign In will be connected during authentication setup.")}
              className="w-full py-2.5 rounded-xl text-sm font-bold text-[#118AB2] dark:text-[#06D6A0] border-2 border-[#118AB2] dark:border-[#06D6A0] text-center"
            >
              Sign In
            </button>
            <button 
              onClick={() => handleNav('home')}
              className="w-full py-3 rounded-xl text-sm font-bold text-white bg-[#FF7F50] text-center shadow-md"
            >
              Ask Assistant
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
