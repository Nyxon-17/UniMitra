import { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/public/Home';
import { About } from './pages/public/About';
import { Contact } from './pages/public/Contact';

export function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [lang, setLang] = useState('en'); // 'en' or 'as'
  const [theme, setTheme] = useState(() => {
    // Check saved theme or system preference
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

  return (
    <div className={`min-h-screen flex flex-col bg-[#FAFAFC] dark:bg-[#0B1320] text-[#073B4C] dark:text-slate-100 selection:bg-[#FFD166] selection:text-[#073B4C] transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Navbar with prominent Language Switcher and Dark/White Mode Toggle */}
      <Navbar 
        activePage={currentPage} 
        onNavigate={setCurrentPage} 
        currentLang={lang} 
        onToggleLang={toggleLanguage}
        isDark={theme === 'dark'}
        onToggleTheme={toggleTheme}
      />

      {/* Main Dynamic Viewport */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <Home onNavigate={setCurrentPage} currentLang={lang} />
        )}
        {currentPage === 'about' && (
          <About onNavigate={setCurrentPage} currentLang={lang} />
        )}
        {currentPage === 'contact' && (
          <Contact onNavigate={setCurrentPage} currentLang={lang} />
        )}
      </main>

      {/* Comprehensive Academic Footer */}
      <Footer onNavigate={setCurrentPage} currentLang={lang} />
    </div>
  );
}

export default App;
