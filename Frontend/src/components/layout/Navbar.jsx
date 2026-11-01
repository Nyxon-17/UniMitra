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
    setMobileMenuOpen(false);
    if (page === 'dashboard') {
      if (!isLoggedIn) {
        if (onOpenAuth) onOpenAuth('login', 'student');
        return;
      }
      navigate('/dashboard/overview');
      return;
    }
    if (page === 'admin') {
      if (!isLoggedIn || (studentInfo?.role !== 'Admin' && studentInfo?.role !== 'Super Admin')) {
        if (onOpenAuth) onOpenAuth('login', 'admin');
        return;
      }
      navigate('/admin');
      return;
    }
    if (page === 'auth' || page === 'login') {
      if (onOpenAuth) onOpenAuth('login', 'student');
      return;
    }
    if (page === 'home') {
      navigate('/');
      return;
    }
    navigate(`/${page}`);
  };

  const navLinks = [
    { id: 'home', label: 'Home', asLabel: 'মূল পৃষ্ঠা' },
    { id: 'features', label: 'Features', asLabel: 'বৈশিষ্ট্যসমূহ' },
    { id: 'how-it-works', label: 'How It Works', asLabel: 'কাৰ্যপ্ৰণালী' },
    { id: 'faq', label: 'FAQ', asLabel: 'প্ৰশ্নোত্তৰ' },
    { id: 'about', label: 'About Us', asLabel: 'আমাৰ বিষয়ে' },
    { id: 'contact', label: 'Support', asLabel: 'সহায় আৰু যোগাযোগ' }
  ];

  return (
    <header className="sticky top-2 z-40 w-full px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-all duration-300">
      <div className="h-14 sm:h-15 px-3.5 sm:px-5 rounded-full neo-surface flex items-center justify-between gap-2 sm:gap-4 shadow-[0_8px_30px_rgba(115,165,202,0.18)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)] border border-white/60 dark:border-[#1C82AD]/35 backdrop-blur-2xl">
        
        {/* Logo & Institutional Brand */}
        <div 
          className="flex items-center space-x-2 sm:space-x-2.5 cursor-pointer select-none shrink-0" 
          onClick={() => handleNav('home')}
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-[#73A5CA] via-[#FFCB56] to-[#FF933E] dark:from-[#03C988] dark:to-[#1C82AD] flex items-center justify-center text-white shadow-sm">
            <BuildingLibraryIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white dark:text-black" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-1">
              <span className="text-base sm:text-lg font-black tracking-tight text-[#000000] dark:text-[#FFFFFF]">
                Uni<span className="text-[#FF933E] dark:text-[#03C988]">Mitra</span>
              </span>
              <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-[#FFE9A9] dark:bg-white/10 text-[#000000] dark:text-[#03C988] hidden sm:inline">
                {univProfile.abbreviation || 'MU'}
              </span>
            </div>
          </div>
        </div>

        {/* Center Navigation Links (Compact Neomorphic Pills) */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNav(link.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                currentActive === link.id
                  ? 'bg-[#FF933E] text-white dark:bg-[#03C988] dark:text-[#000000] shadow-xs'
                  : 'text-[#000000]/80 dark:text-[#FFFFFF]/80 hover:text-[#FF933E] dark:hover:text-[#03C988] hover:bg-[#FFE9A9]/30 dark:hover:bg-white/10'
              }`}
            >
              {currentLang === 'as' ? link.asLabel : link.label}
            </button>
          ))}
        </nav>

        {/* Right Action Tools: Language, Theme, Portal Auth */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          
          {/* Direct Language Switcher */}
          <div className="flex items-center p-0.5 bg-[#FFE9A9]/30 dark:bg-[#0A0A0A] rounded-full border border-[#73A5CA]/30 dark:border-[#1C82AD]/40">
            <button
              onClick={() => currentLang !== 'as' && onToggleLang()}
              className={`px-2 py-0.5 rounded-full text-[11px] font-black transition-all cursor-pointer ${
                currentLang === 'as'
                  ? 'bg-[#FF933E] text-white dark:bg-[#03C988] dark:text-black shadow-2xs'
                  : 'text-[#000000] dark:text-[#FFFFFF] hover:text-[#FF933E]'
              }`}
            >
              অসমীয়া
            </button>
            <button
              onClick={() => currentLang !== 'en' && onToggleLang()}
              className={`px-2 py-0.5 rounded-full text-[11px] font-black transition-all cursor-pointer ${
                currentLang === 'en'
                  ? 'bg-[#FF933E] text-white dark:bg-[#03C988] dark:text-black shadow-2xs'
                  : 'text-[#000000] dark:text-[#FFFFFF] hover:text-[#FF933E]'
              }`}
            >
              EN
            </button>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle Dark and Light Mode"
            className="p-1.5 sm:p-2 rounded-full border border-[#73A5CA]/30 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-[#000000] dark:text-[#03C988] hover:bg-[#FFE9A9]/50 transition-colors cursor-pointer"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <SunIcon className="w-4 h-4 text-[#03C988]" /> : <MoonIcon className="w-4 h-4 text-[#FF933E]" />}
          </button>

          {/* Auth Controls */}
          {!isLoggedIn ? (
            <button 
              onClick={() => onOpenAuth && onOpenAuth('login', 'student')}
              className="px-3.5 py-1.5 rounded-full text-xs font-black text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] dark:text-[#000000] transition-all cursor-pointer shadow-xs whitespace-nowrap"
            >
              {currentLang === 'as' ? 'প্ৰৱেশ' : 'Sign In'}
            </button>
          ) : (
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => handleNav('dashboard')}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-black text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] dark:text-[#000000] transition-all cursor-pointer shadow-xs"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{currentLang === 'as' ? 'প’ৰ্টেল' : 'Portal'}</span>
              </button>

              <button
                onClick={onSignOut}
                title="Sign Out"
                className="p-1.5 rounded-full border border-red-300/60 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-full border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-[#000000] dark:text-[#FFFFFF]"
            aria-label="Toggle Mobile Navigation Menu"
          >
            {mobileMenuOpen ? <XMarkIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 rounded-3xl neo-surface bg-white/95 dark:bg-[#141414]/95 backdrop-blur-2xl border border-white/60 dark:border-[#1C82AD]/40 px-4 pt-3 pb-6 space-y-4 shadow-xl">
          
          {/* Mobile Language Switcher */}
          <div className="flex items-center justify-between p-2.5 bg-[#FFE9A9]/30 dark:bg-[#0A0A0A] rounded-2xl border border-[#73A5CA]/35 dark:border-[#1C82AD]/40">
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
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold ${
                  currentActive === link.id
                    ? 'bg-[#FF933E] text-white dark:bg-[#03C988] dark:text-[#000000] shadow-xs'
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
                }}
                className="w-full py-2.5 rounded-full text-xs font-black bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-[#000000] text-center shadow-md cursor-pointer transition-colors"
              >
                {currentLang === 'as' ? 'লগ-ইন / প্ৰৱেশ কৰক' : 'Sign In to Portal'}
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => handleNav('dashboard')}
                  className="w-full py-2.5 rounded-full text-xs font-black bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-[#000000] text-center shadow-md cursor-pointer"
                >
                  {currentLang === 'as' ? 'বিশ্ববিদ্যালয় সহায়ক প’ৰ্টেল' : 'Open University Portal'}
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onSignOut) onSignOut();
                  }}
                  className="w-full py-2 rounded-full text-xs font-bold text-red-600 dark:text-red-300 bg-red-100 dark:bg-red-950/40 text-center cursor-pointer border border-red-300 dark:border-red-900/50"
                >
                  {currentLang === 'as' ? 'লগ-আউট' : 'Sign Out'}
                </button>
              </div>
            )}
          </div>

        </div>
      )}
    </header>
  );
};
