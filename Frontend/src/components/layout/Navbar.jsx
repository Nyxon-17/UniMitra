import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { universityService } from '../../services/universityService';
import { BuildingLibraryIcon, MenuIcon, XMarkIcon, SunIcon, MoonIcon, LanguageIcon, ArrowRightOnRectangleIcon, UserIcon } from '../common/Icons';

export const Navbar = ({ 
  activePage = 'home', 
  onNavigate, 
  onOpenAuth,
  currentLang = 'en', 
  onToggleLang, 
  isDark = false, 
  onToggleTheme, 
  isLoggedIn = false,
  studentInfo,
  onSignOut
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [univProfile, setUnivProfile] = useState(() => universityService.getProfile());

  useEffect(() => {
    const handleSync = () => {
      setUnivProfile(universityService.getProfile());
    };
    window.addEventListener('unimitra_university_changed', handleSync);
    return () => window.removeEventListener('unimitra_university_changed', handleSync);
  }, []);

  // Derive active link ID from current URL pathname
  const getActiveId = () => {
    const p = location.pathname;
    if (p === '/' || p === '/home') return 'home';
    if (p.startsWith('/features')) return 'features';
    if (p.startsWith('/how-it-works')) return 'how-it-works';
    if (p.startsWith('/faq')) return 'faq';
    if (p.startsWith('/about')) return 'about';
    if (p.startsWith('/contact')) return 'contact';
    if (p.startsWith('/auth')) return 'auth';
    if (p.startsWith('/admin')) return 'admin';
    if (p.startsWith('/dashboard')) return 'dashboard';
    return activePage || 'home';
  };

  const currentActive = getActiveId();

  const handleNav = (page) => {
    if (page === 'dashboard' && !isLoggedIn) {
      if (onOpenAuth) onOpenAuth('login', 'student');
      else navigate('/auth');
      return;
    }
    if (onNavigate) {
      onNavigate(page);
    }
    if (page === 'home') navigate('/');
    else if (page === 'dashboard') navigate('/dashboard/overview');
    else if (page === 'admin') navigate('/admin');
    else if (page === 'auth') navigate('/auth');
    else navigate(`/${page}`);
    
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { id: 'home', label: 'Home', asLabel: 'মূল পৃষ্ঠা' },
    { id: 'features', label: 'Features', asLabel: 'বৈশিষ্ট্যসমূহ' },
    { id: 'how-it-works', label: 'How It Works', asLabel: 'কাৰ্যপ্ৰণালী' },
    { id: 'faq', label: 'FAQ', asLabel: 'প্ৰশ্নোত্তৰ' },
    { id: 'about', label: 'About Us', asLabel: 'আমাৰ বিষয়ে' },
    { id: 'contact', label: 'Support', asLabel: 'সহায় আৰু যোগাযোগ' },
    { id: 'admin', label: 'Admin Portal', asLabel: 'প্ৰশাসন কেন্দ্ৰ' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8FF]/95 dark:bg-[#0A0718]/95 backdrop-blur-xs border-b border-[#73A5CA]/35 dark:border-[#1C82AD]/40 transition-colors duration-200 shadow-xs">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-4">
          
          {/* Logo & Institutional Brand */}
          <div 
            className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer select-none shrink-0" 
            onClick={() => handleNav('home')}
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#73A5CA] via-[#FFCB56] to-[#FF933E] dark:from-[#13005A] dark:to-[#00337C] flex items-center justify-center text-white shadow-md border-2 border-[#73A5CA]/40 dark:border-[#03C988]/50 dark:shadow-[0_0_12px_rgba(176,38,255,0.4)]">
              <BuildingLibraryIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#FAF8FF]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[#000000] dark:text-[#FFFFFF]">
                  Uni<span className="text-[#FF933E] dark:text-[#03C988]">Mitra</span>
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#000000]/70 dark:text-[#FFFFFF]/70 font-semibold tracking-tight hidden xs:block">
                {currentLang === 'as' ? 'বিশ্ববিদ্যালয়ৰ দ্বিভাষিক AI সহায়ক' : 'Bilingual Smart University Assistant'}
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  currentActive === link.id
                    ? 'bg-[#FFE9A9] dark:bg-[#00337C] text-[#000000] dark:text-[#FFFFFF] border border-[#FFCB56] dark:border-[#03C988] shadow-xs'
                    : 'text-[#000000] dark:text-[#FFFFFF]/80 hover:text-[#FF933E] dark:hover:text-[#03C988] hover:bg-[#FFE9A9]/40 dark:hover:bg-[#13005A]'
                }`}
              >
                {currentLang === 'as' ? link.asLabel : link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Tools: Language, Theme, Portal Auth */}
          <div className="hidden md:flex items-center space-x-2 shrink-0">
            
            {/* Direct Language Switcher */}
            <div className="flex items-center p-1 bg-[#FFE9A9]/40 dark:bg-[#00337C] rounded-xl border border-[#73A5CA]/35 dark:border-[#1C82AD]/40">
              <button
                onClick={() => currentLang !== 'as' && onToggleLang()}
                className={`px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  currentLang === 'as'
                    ? 'bg-[#FF933E] text-white shadow-xs'
                    : 'text-[#000000] dark:text-[#FFFFFF] hover:text-[#FF933E] dark:hover:text-[#03C988]'
                }`}
              >
                অসমীয়া
              </button>
              <button
                onClick={() => currentLang !== 'en' && onToggleLang()}
                className={`px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  currentLang === 'en'
                    ? 'bg-[#FF933E] text-white shadow-xs'
                    : 'text-[#000000] dark:text-[#FFFFFF] hover:text-[#FF933E] dark:hover:text-[#03C988]'
                }`}
              >
                English
              </button>
            </div>

            {/* Dark / Light Theme Toggle Button with Amber/Violet border */}
            <button
              onClick={onToggleTheme}
              aria-label="Toggle Dark and Light Mode"
              className="p-2 sm:p-2.5 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/50 bg-[#FFE9A9]/30 dark:bg-[#00337C] text-[#000000] dark:text-[#03C988] hover:bg-[#FFE9A9] dark:hover:border-[#03C988] transition-colors cursor-pointer"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <SunIcon className="w-5 h-5 text-[#03C988]" /> : <MoonIcon className="w-5 h-5 text-[#FF933E]" />}
            </button>

            {/* Admin Console Shortcut */}
            <button
              onClick={() => handleNav('admin')}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-bold text-[#FF933E] dark:text-[#03C988] bg-[#FFE9A9]/40 dark:bg-[#13005A] hover:bg-[#FFE9A9] dark:hover:bg-[#00337C] border border-[#FFCB56] dark:border-[#03C988]/40 transition-all cursor-pointer whitespace-nowrap"
              title="Official Document Ingestion Admin"
            >
              {currentLang === 'as' ? 'প্ৰশাসন কেন্দ্ৰ' : 'Admin Console'}
            </button>

            {/* Auth Controls */}
            {!isLoggedIn ? (
              <button 
                onClick={() => onOpenAuth ? onOpenAuth('login', 'student') : navigate('/auth')}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-black text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-[#000000] transition-all cursor-pointer shadow-xs border border-[#FF933E] dark:border-[#03C988] whitespace-nowrap"
              >
                {currentLang === 'as' ? 'লগ-ইন / প্ৰৱেশ' : 'Sign In'}
              </button>
            ) : (
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <button
                  onClick={() => handleNav('dashboard')}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] transition-all cursor-pointer shadow-xs dark:border dark:border-[#B026FF]/40"
                >
                  <UserIcon className="w-4 h-4 text-[#FAF8FF]" />
                  <span>{currentLang === 'as' ? 'সহায়ক প’ৰ্টেল' : 'Portal'}</span>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to sign out from the university assistant?")) {
                      if (onSignOut) onSignOut();
                    }
                  }}
                  className="p-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-950/40 transition-colors cursor-pointer border border-red-300 dark:border-red-900/50"
                  title="Sign Out"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>

          {/* Mobile Right Controls */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl border border-[#73A5CA]/35 dark:border-[#1C82AD]/40 bg-[#FAF8FF] dark:bg-[#120B24] text-[#000000] dark:text-[#03C988] cursor-pointer"
            >
              {isDark ? <SunIcon className="w-5 h-5 text-[#03C988]" /> : <MoonIcon className="w-5 h-5 text-[#FF933E]" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-[#73A5CA]/35 dark:border-[#1C82AD]/40 bg-[#FAF8FF] dark:bg-[#120B24] text-[#000000] dark:text-[#FFFFFF] cursor-pointer"
              aria-label="Toggle Mobile Navigation Menu"
            >
              {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#00337C] border-b border-[#73A5CA]/35 dark:border-[#1C82AD]/40 px-4 pt-3 pb-6 space-y-4 shadow-xl">
          
          {/* Mobile Language Switcher */}
          <div className="flex items-center justify-between p-2.5 bg-[#FFE9A9]/30 dark:bg-[#13005A] rounded-2xl border border-[#73A5CA]/35 dark:border-[#1C82AD]/40">
            <span className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF] flex items-center space-x-1.5">
              <LanguageIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988]" />
              <span>ভাষা / Language:</span>
            </span>
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => currentLang !== 'as' && onToggleLang()}
                className={`px-3 py-1.5 rounded-lg text-xs font-black ${
                  currentLang === 'as' ? 'bg-[#FF933E] text-white' : 'text-[#000000] dark:text-[#FFFFFF]'
                }`}
              >
                অসমীয়া
              </button>
              <button
                onClick={() => currentLang !== 'en' && onToggleLang()}
                className={`px-3 py-1.5 rounded-lg text-xs font-black ${
                  currentLang === 'en' ? 'bg-[#FF933E] text-white' : 'text-[#000000] dark:text-[#FFFFFF]'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold ${
                  currentActive === link.id
                    ? 'bg-[#FFE9A9] dark:bg-[#13005A] text-[#FF933E] dark:text-[#03C988] border border-[#FFCB56] dark:border-[#03C988]'
                    : 'text-[#000000] dark:text-[#FFFFFF] hover:bg-[#FFE9A9]/30 dark:hover:bg-[#13005A]'
                }`}
              >
                {currentLang === 'as' ? link.asLabel : link.label}
              </button>
            ))}
          </div>

          {/* Mobile Action Buttons */}
          <div className="pt-2 border-t border-[#73A5CA]/35 dark:border-[#1C82AD]/40 space-y-2">
            {!isLoggedIn ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenAuth) onOpenAuth('login', 'student');
                  else navigate('/auth');
                }}
                className="w-full py-3 rounded-xl text-sm font-black bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white text-center shadow-md cursor-pointer transition-colors"
              >
                {currentLang === 'as' ? 'লগ-ইন / প্ৰৱেশ কৰক' : 'Sign In to Portal'}
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => handleNav('dashboard')}
                  className="w-full py-3 rounded-xl text-sm font-black bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white text-center shadow-md cursor-pointer"
                >
                  {currentLang === 'as' ? 'বিশ্ববিদ্যালয় সহায়ক প’ৰ্টেল' : 'Open University Portal'}
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onSignOut) onSignOut();
                  }}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-red-600 dark:text-red-300 bg-red-100 dark:bg-red-950/40 text-center cursor-pointer border border-red-300 dark:border-red-900/50"
                >
                  {currentLang === 'as' ? 'লগ-আউট' : 'Sign Out'}
                </button>
              </div>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleNav('admin');
              }}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-[#FF933E] dark:text-[#FFFFFF] bg-[#DDD6FE] dark:bg-[#1A0F33] text-center border border-[#73A5CA]/35 dark:border-[#1C82AD]/40 cursor-pointer"
            >
              {currentLang === 'as' ? 'প্ৰশাসন নথিপত্ৰ পৰিচালনা' : 'Admin Console (Document Ingest)'}
            </button>
          </div>

        </div>
      )}
    </header>
  );
};
