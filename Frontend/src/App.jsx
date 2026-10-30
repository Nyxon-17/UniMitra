import { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/public/Home';
import { Features } from './pages/public/Features';
import { Universities } from './pages/public/Universities';
import { Faq } from './pages/public/Faq';
import { About } from './pages/public/About';
import { Contact } from './pages/public/Contact';
import { AuthModal } from './components/auth/AuthModal';

export function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [lang, setLang] = useState('en'); // 'en' or 'as'
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' or 'register'
  
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('unimitra_theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  // Apply dark mode class to <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('unimitra_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('unimitra_theme', 'light');
    }
  }, [theme]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'as' : 'en'));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleOpenAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[#FAFAFC] dark:bg-[#0B1320] text-[#073B4C] dark:text-slate-100 selection:bg-[#FFD166] selection:text-[#073B4C] transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Top Navigation */}
      <Navbar 
        activePage={currentPage} 
        onNavigate={setCurrentPage} 
        onOpenAuth={handleOpenAuth}
        currentLang={lang} 
        onToggleLang={toggleLanguage}
        isDark={theme === 'dark'}
        onToggleTheme={toggleTheme}
      />

      {/* Main Dynamic Viewport */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <Home onNavigate={setCurrentPage} onOpenAuth={handleOpenAuth} currentLang={lang} />
        )}
        {currentPage === 'features' && (
          <Features onNavigate={setCurrentPage} onOpenAuth={handleOpenAuth} currentLang={lang} />
        )}
        {currentPage === 'universities' && (
          <Universities onNavigate={setCurrentPage} onOpenAuth={handleOpenAuth} currentLang={lang} />
        )}
        {currentPage === 'faq' && (
          <Faq onNavigate={setCurrentPage} onOpenAuth={handleOpenAuth} currentLang={lang} />
        )}
        {currentPage === 'about' && (
          <About onNavigate={setCurrentPage} onOpenAuth={handleOpenAuth} currentLang={lang} />
        )}
        {currentPage === 'contact' && (
          <Contact onNavigate={setCurrentPage} onOpenAuth={handleOpenAuth} currentLang={lang} />
        )}
      </main>

      {/* Academic Portal Footer */}
      <Footer 
        onNavigate={setCurrentPage} 
        onOpenAuth={handleOpenAuth}
        currentLang={lang} 
      />

      {/* Floating Login & Registration Modal for Students */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        currentLang={lang}
      />
    </div>
  );
}

export default App;
