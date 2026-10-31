import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8FF] dark:bg-[#0A0718] border-b border-[#E0D4FD] dark:border-[#3B2868] transition-colors duration-200 shadow-xs">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-4">
          
          {/* Logo & Institutional Brand */}
          <div 
            className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer select-none shrink-0" 
            onClick={() => handleNav('home')}
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#6D28D9] via-[#8F00FF] to-[#4C1D95] dark:from-[#4C1D95] dark:to-[#8F00FF] flex items-center justify-center text-white shadow-md border-2 border-[#E0D4FD] dark:border-[#B026FF]/50 dark:shadow-[0_0_12px_rgba(176,38,255,0.4)]">
              <BuildingLibraryIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#FAF8FF]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[#0F172A] dark:text-[#FAF8FF]">
                  Uni<span className="text-[#8F00FF] dark:text-[#00F5D4]">Mitra</span>
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#555375] dark:text-[#C4B5FD] font-semibold tracking-tight hidden xs:block">
                {currentLang === 'as' ? 'বিশ্ববিদ্যালয়ৰ দ্বিভাষিক AI সহায়ক' : 'Bilingual Smart University Assistant'}
              </p>
            </div>
          </div>

          {/* Center Navigation Links - Well-proportioned size & length */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  currentActive === link.id
                    ? 'bg-[#6D28D9]/15 dark:bg-[#B026FF]/20 text-[#6D28D9] dark:text-[#00F5D4] border border-[#6D28D9]/50 dark:border-[#00F5D4]/40 dark:shadow-[0_0_12px_rgba(0,245,212,0.2)]'
                    : 'text-[#0F172A] dark:text-[#FAF8FF]/80 hover:text-[#6D28D9] dark:hover:text-[#00F5D4] hover:bg-[#E0D4FD]/35 dark:hover:bg-[#150F2C]'
                }`}
              >
                {currentLang === 'as' ? link.asLabel : link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Tools: Language, Theme, Portal Auth */}
          <div className="hidden md:flex items-center space-x-2 shrink-0">
            
            {/* Direct Language Switcher */}
            <div className="flex items-center p-1 bg-[#E0D4FD]/30 dark:bg-[#150F2C] rounded-xl border border-[#E0D4FD] dark:border-[#3B2868]">
              <button
                onClick={() => currentLang !== 'as' && onToggleLang()}
                className={`px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  currentLang === 'as'
                    ? 'bg-[#4C1D95] text-white shadow-xs'
                    : 'text-[#0F172A] dark:text-[#C4B5FD] hover:text-[#0F172A] dark:hover:text-[#FAF8FF]'
                }`}
              >
                অসমীয়া
              </button>
              <button
                onClick={() => currentLang !== 'en' && onToggleLang()}
                className={`px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  currentLang === 'en'
                    ? 'bg-[#4C1D95] text-white shadow-xs'
                    : 'text-[#0F172A] dark:text-[#C4B5FD] hover:text-[#0F172A] dark:hover:text-[#FAF8FF]'
                }`}
              >
                English
              </button>
            </div>

            {/* Dark / Light Theme Toggle Button with Neon border in Dark Mode */}
            <button
              onClick={onToggleTheme}
              aria-label="Toggle Dark and Light Mode"
              className="p-2 sm:p-2.5 rounded-xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#150F2C] text-[#0F172A] dark:text-[#00F5D4] hover:bg-[#E0D4FD]/40 dark:hover:border-[#00F5D4]/60 transition-colors cursor-pointer dark:hover:shadow-[0_0_10px_rgba(0,245,212,0.3)]"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <SunIcon className="w-5 h-5 text-[#00F5D4]" /> : <MoonIcon className="w-5 h-5 text-[#4C1D95]" />}
            </button>

            {/* Admin Console Shortcut */}
            <button
              onClick={() => {
                if (isLoggedIn && studentInfo?.role === 'Admin') {
                  handleNav('admin');
                } else if (onOpenAuth) {
                  onOpenAuth('login', 'admin');
                } else {
                  navigate('/auth?role=admin');
                }
              }}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-bold text-[#4C1D95] dark:text-[#C4B5FD] bg-[#DDD6FE]/60 dark:bg-[#1C1438] hover:bg-[#DDD6FE] dark:hover:bg-[#25124D] border border-[#E0D4FD] dark:border-[#B026FF]/40 transition-all cursor-pointer whitespace-nowrap"
              title="Official Document Ingestion Admin"
            >
              {currentLang === 'as' ? 'প্ৰশাসন কেন্দ্ৰ' : 'Admin Console'}
            </button>

            {/* Auth Controls: Deep Violet Button with Electric Violet & Neon Glow */}
            {!isLoggedIn ? (
              <button 
                onClick={() => onOpenAuth ? onOpenAuth('login', 'student') : navigate('/auth')}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-black text-white bg-[#4C1D95] hover:bg-[#8F00FF] transition-all cursor-pointer shadow-xs border border-[#E0D4FD]/40 dark:border-[#B026FF]/60 dark:hover:shadow-[0_0_16px_rgba(176,38,255,0.45)] whitespace-nowrap"
              >
                {currentLang === 'as' ? 'লগ-ইন / প্ৰৱেশ' : 'Sign In'}
              </button>
            ) : (
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <button
                  onClick={() => handleNav('dashboard')}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black text-white bg-[#4C1D95] hover:bg-[#8F00FF] transition-all cursor-pointer shadow-xs dark:border dark:border-[#B026FF]/40"
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
              className="p-2 rounded-xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#150F2C] text-[#0F172A] dark:text-[#00F5D4] cursor-pointer"
            >
              {isDark ? <SunIcon className="w-5 h-5 text-[#00F5D4]" /> : <MoonIcon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#150F2C] text-[#0F172A] dark:text-[#FAF8FF] cursor-pointer"
              aria-label="Toggle Mobile Navigation Menu"
            >
              {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8FF] dark:bg-[#0A0718] border-b border-[#E0D4FD] dark:border-[#3B2868] px-4 pt-3 pb-6 space-y-4 shadow-xl">
          
          {/* Mobile Language Switcher */}
          <div className="flex items-center justify-between p-2.5 bg-[#E0D4FD]/30 dark:bg-[#150F2C] rounded-2xl border border-[#E0D4FD] dark:border-[#3B2868]">
            <span className="text-xs font-bold text-[#0F172A] dark:text-[#FAF8FF] flex items-center space-x-1.5">
              <LanguageIcon className="w-4 h-4 text-[#6D28D9] dark:text-[#C4B5FD]" />
              <span>ভাষা / Language:</span>
            </span>
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => currentLang !== 'as' && onToggleLang()}
                className={`px-3 py-1.5 rounded-lg text-xs font-black ${
                  currentLang === 'as' ? 'bg-[#4C1D95] text-white' : 'text-[#0F172A] dark:text-[#C4B5FD]'
                }`}
              >
                অসমীয়া
              </button>
              <button
                onClick={() => currentLang !== 'en' && onToggleLang()}
                className={`px-3 py-1.5 rounded-lg text-xs font-black ${
                  currentLang === 'en' ? 'bg-[#4C1D95] text-white' : 'text-[#0F172A] dark:text-[#C4B5FD]'
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
                    ? 'bg-[#6D28D9]/20 dark:bg-[#3B2868]/40 text-[#6D28D9] dark:text-[#00F5D4] border border-[#6D28D9]/50'
                    : 'text-[#0F172A] dark:text-[#FAF8FF] hover:bg-[#E0D4FD]/30 dark:hover:bg-[#150F2C]'
                }`}
              >
                {currentLang === 'as' ? link.asLabel : link.label}
              </button>
            ))}
          </div>

          {/* Mobile Action Buttons */}
          <div className="pt-2 border-t border-[#E0D4FD] dark:border-[#3B2868] space-y-2">
            {!isLoggedIn ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenAuth) onOpenAuth('login', 'student');
                  else navigate('/auth');
                }}
                className="w-full py-3 rounded-xl text-sm font-black bg-[#4C1D95] hover:bg-[#8F00FF] text-white text-center shadow-md cursor-pointer transition-colors"
              >
                {currentLang === 'as' ? 'লগ-ইন / প্ৰৱেশ কৰক' : 'Sign In to Portal'}
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => handleNav('dashboard')}
                  className="w-full py-3 rounded-xl text-sm font-black bg-[#4C1D95] hover:bg-[#8F00FF] text-white text-center shadow-md cursor-pointer"
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
                if (isLoggedIn && studentInfo?.role === 'Admin') {
                  handleNav('admin');
                } else if (onOpenAuth) {
                  onOpenAuth('login', 'admin');
                } else {
                  navigate('/auth?role=admin');
                }
              }}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-[#4C1D95] dark:text-[#FAF8FF] bg-[#DDD6FE] dark:bg-[#1C1438] text-center border border-[#E0D4FD] dark:border-[#3B2868] cursor-pointer"
            >
              {currentLang === 'as' ? 'প্ৰশাসন নথিপত্ৰ পৰিচালনা' : 'Admin Console (Document Ingest)'}
            </button>
          </div>

        </div>
      )}
    </header>
  );
};
