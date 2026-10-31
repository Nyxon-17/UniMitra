import { useState } from 'react';
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

  const handleNav = (page) => {
    if (page === 'dashboard' && !isLoggedIn) {
      if (onOpenAuth) onOpenAuth('login');
      return;
    }
    if (onNavigate) {
      onNavigate(page);
    }
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { id: 'home', label: 'Home', asLabel: 'মূল পৃষ্ঠা' },
    { id: 'features', label: 'Services & Scope', asLabel: 'সেৱা আৰু সুবিধাসমূহ' },
    { id: 'how-it-works', label: 'How It Works', asLabel: 'কাৰ্যপ্ৰণালী' },
    { id: 'faq', label: 'FAQ', asLabel: 'প্ৰশ্নোত্তৰ' },
    { id: 'about', label: 'About UniMitra', asLabel: 'আমাৰ বিষয়ে' },
    { id: 'contact', label: 'Helpdesk & Support', asLabel: 'সহায় আৰু যোগাযোগ' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FEFAF3] dark:bg-[#15370D] border-b border-[#B8CFB3] dark:border-[#728E6D] transition-colors duration-200 shadow-xs">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Institutional Brand */}
          <div 
            className="flex items-center space-x-3 cursor-pointer select-none" 
            onClick={() => handleNav('home')}
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#84A282] to-[#B8CFB3] dark:from-[#728E6D] dark:to-[#1C4412] flex items-center justify-center text-white shadow-md border-2 border-[#84A282]/40 dark:border-[#E5CD82]/40">
              <BuildingLibraryIcon className="w-6 h-6 text-[#FEFAF3] dark:text-[#FFF2B4]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#15370D] dark:text-[#FFF2B4]">
                  Uni<span className="text-[#84A282] dark:text-[#E5CD82]">Mitra</span>
                </span>
              </div>
              <p className="text-[11px] text-[#4F6D4B] dark:text-[#E5CD82] font-semibold tracking-tight">
                {currentLang === 'as' ? 'বিশ্ববিদ্যালয়ৰ দ্বিভাষিক AI সহায়ক' : 'Bilingual Smart University Assistant'}
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
                    ? 'bg-[#84A282]/20 dark:bg-[#728E6D]/30 text-[#15370D] dark:text-[#FFF2B4] border border-[#84A282] dark:border-[#E5CD82]/40'
                    : 'text-[#15370D] dark:text-[#FFF2B4]/80 hover:text-[#15370D] dark:hover:text-[#FFF2B4] hover:bg-[#B8CFB3]/30 dark:hover:bg-[#1C4412]'
                }`}
              >
                {currentLang === 'as' ? link.asLabel : link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Tools: Language, Theme, Portal Auth */}
          <div className="hidden md:flex items-center space-x-2.5">
            
            {/* Direct Language Switcher */}
            <div className="flex items-center p-1 bg-[#B8CFB3]/30 dark:bg-[#1C4412] rounded-xl border border-[#B8CFB3] dark:border-[#728E6D]">
              <button
                onClick={() => currentLang !== 'as' && onToggleLang()}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  currentLang === 'as'
                    ? 'bg-[#84A282] text-white shadow-xs'
                    : 'text-[#15370D] dark:text-[#E5CD82] hover:text-[#15370D] dark:hover:text-[#FFF2B4]'
                }`}
              >
                অসমীয়া
              </button>
              <button
                onClick={() => currentLang !== 'en' && onToggleLang()}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  currentLang === 'en'
                    ? 'bg-[#84A282] text-white shadow-xs'
                    : 'text-[#15370D] dark:text-[#E5CD82] hover:text-[#15370D] dark:hover:text-[#FFF2B4]'
                }`}
              >
                English
              </button>
            </div>

            {/* Dark / Light Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              aria-label="Toggle Dark and Light Mode"
              className="p-2.5 rounded-xl border border-[#B8CFB3] dark:border-[#728E6D] bg-[#FEFAF3] dark:bg-[#1C4412] text-[#15370D] dark:text-[#FFF2B4] hover:bg-[#B8CFB3]/40 dark:hover:bg-[#235417] transition-colors cursor-pointer"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <SunIcon className="w-5 h-5 text-[#FFF2B4]" /> : <MoonIcon className="w-5 h-5 text-[#15370D]" />}
            </button>

            {/* Admin Console Shortcut */}
            <button
              onClick={() => {
                if (isLoggedIn && studentInfo?.role === 'Admin') {
                  handleNav('admin');
                } else if (onOpenAuth) {
                  onOpenAuth('login', 'admin');
                }
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#15370D] dark:text-[#FFF2B4] bg-[#F6E2E9] dark:bg-[#728E6D]/40 hover:bg-[#F6E2E9]/80 dark:hover:bg-[#728E6D] border border-[#B8CFB3] dark:border-[#E5CD82]/40 transition-all cursor-pointer"
              title="Official Document Ingestion Admin"
            >
              {currentLang === 'as' ? 'প্ৰশাসন কেন্দ্ৰ' : 'Admin Console'}
            </button>

            {/* Auth Controls */}
            {!isLoggedIn ? (
              <button 
                onClick={() => onOpenAuth && onOpenAuth('login', 'student')}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-black text-[#15370D] dark:text-[#15370D] bg-[#84A282] dark:bg-[#FFF2B4] hover:bg-[#84A282]/80 dark:hover:bg-[#E5CD82] transition-all cursor-pointer shadow-xs border border-[#15370D]/20"
              >
                {currentLang === 'as' ? 'লগ-ইন / প্ৰৱেশ' : 'Sign In'}
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleNav('dashboard')}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black text-white bg-[#84A282] dark:bg-[#728E6D] hover:bg-[#739071] transition-all cursor-pointer shadow-xs"
                >
                  <UserIcon className="w-4 h-4 text-[#FFF2B4]" />
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
              className="p-2 rounded-xl border border-[#B8CFB3] dark:border-[#728E6D] bg-[#FEFAF3] dark:bg-[#1C4412] text-[#15370D] dark:text-[#FFF2B4] cursor-pointer"
            >
              {isDark ? <SunIcon className="w-5 h-5 text-[#FFF2B4]" /> : <MoonIcon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#15370D] dark:text-[#FFF2B4] hover:bg-[#B8CFB3]/30 dark:hover:bg-[#1C4412] cursor-pointer"
            >
              {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FEFAF3] dark:bg-[#15370D] border-b border-[#B8CFB3] dark:border-[#728E6D] px-4 pt-3 pb-6 space-y-4 shadow-xl">
          
          {/* Mobile Language Switcher */}
          <div className="flex items-center justify-between p-2.5 bg-[#B8CFB3]/30 dark:bg-[#1C4412] rounded-2xl border border-[#B8CFB3] dark:border-[#728E6D]">
            <span className="text-xs font-bold text-[#15370D] dark:text-[#FFF2B4] flex items-center space-x-1.5">
              <LanguageIcon className="w-4 h-4 text-[#84A282] dark:text-[#E5CD82]" />
              <span>ভাষা / Language:</span>
            </span>
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => currentLang !== 'as' && onToggleLang()}
                className={`px-3 py-1.5 rounded-lg text-xs font-black ${
                  currentLang === 'as' ? 'bg-[#84A282] text-white' : 'text-[#15370D] dark:text-[#E5CD82]'
                }`}
              >
                অসমীয়া
              </button>
              <button
                onClick={() => currentLang !== 'en' && onToggleLang()}
                className={`px-3 py-1.5 rounded-lg text-xs font-black ${
                  currentLang === 'en' ? 'bg-[#84A282] text-white' : 'text-[#15370D] dark:text-[#E5CD82]'
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
                  activePage === link.id
                    ? 'bg-[#84A282]/20 dark:bg-[#728E6D]/40 text-[#15370D] dark:text-[#FFF2B4] border border-[#84A282]'
                    : 'text-[#15370D] dark:text-[#FFF2B4] hover:bg-[#B8CFB3]/30 dark:hover:bg-[#1C4412]'
                }`}
              >
                {currentLang === 'as' ? link.asLabel : link.label}
              </button>
            ))}
          </div>

          {/* Mobile Action Buttons */}
          <div className="pt-2 border-t border-[#B8CFB3] dark:border-[#728E6D] space-y-2">
            {!isLoggedIn ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenAuth) onOpenAuth('login');
                }}
                className="w-full py-3 rounded-xl text-sm font-black bg-[#84A282] text-white text-center shadow-md cursor-pointer"
              >
                {currentLang === 'as' ? 'লগ-ইন / প্ৰৱেশ কৰক' : 'Sign In to Portal'}
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => handleNav('dashboard')}
                  className="w-full py-3 rounded-xl text-sm font-black bg-[#84A282] text-white text-center shadow-md cursor-pointer"
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
                }
              }}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-[#15370D] dark:text-[#FFF2B4] bg-[#F6E2E9] dark:bg-[#728E6D]/50 text-center border border-[#B8CFB3] dark:border-[#728E6D] cursor-pointer"
            >
              {currentLang === 'as' ? 'প্ৰশাসন নথিপত্ৰ পৰিচালনা' : 'Admin Console (Document Ingest)'}
            </button>
          </div>

        </div>
      )}
    </header>
  );
};
