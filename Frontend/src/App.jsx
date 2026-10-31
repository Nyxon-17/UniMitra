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

// Student Dashboard Components & Sub-pages
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { DashboardHome } from './pages/dashboard/DashboardHome';
import { DashboardAiAssistant } from './pages/dashboard/DashboardAiAssistant';
import { DashboardSyllabus } from './pages/dashboard/DashboardSyllabus';
import { DashboardSaved } from './pages/dashboard/DashboardSaved';
import { DashboardProfile } from './pages/dashboard/DashboardProfile';

export function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' | 'features' | 'universities' | 'faq' | 'about' | 'contact' | 'dashboard'
  const [dashboardTab, setDashboardTab] = useState('overview'); // 'overview' | 'assistant' | 'syllabus' | 'saved' | 'profile'
  const [assistantPrefill, setAssistantPrefill] = useState('');
  
  const [lang, setLang] = useState('en'); // 'en' or 'as'
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' or 'register'

  const [studentInfo, setStudentInfo] = useState({
    name: 'Priyanku Sarma',
    email: 'priyanku.sarma@gauhati.ac.in',
    university: 'Gauhati University',
    course: 'BCA (Semester 3)',
    semester: 'Semester 3',
    college: 'Cotton University affiliated campus, Jalukbari'
  });
  
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
  }, [currentPage, dashboardTab]);

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

  const handleLoginSuccess = (user) => {
    if (user?.name) {
      setStudentInfo((prev) => ({
        ...prev,
        name: user.name,
        email: user.email || prev.email,
      }));
    }
    setCurrentPage('dashboard');
    setDashboardTab('overview');
  };

  const handleNavigateDashboardTab = (tab, payload) => {
    setDashboardTab(tab);
    if (payload?.prefillQuery) {
      setAssistantPrefill(payload.prefillQuery);
    }
  };

  // If in Student Dashboard mode, render 3D Dashboard Layout with sidebar and dashboard navbar
  if (currentPage === 'dashboard') {
    return (
      <DashboardLayout
        activeTab={dashboardTab}
        onSelectTab={setDashboardTab}
        onExitDashboard={() => setCurrentPage('home')}
        currentLang={lang}
        onToggleLang={toggleLanguage}
        isDark={theme === 'dark'}
        onToggleTheme={toggleTheme}
        studentInfo={studentInfo}
      >
        {dashboardTab === 'overview' && (
          <DashboardHome
            onNavigateTab={handleNavigateDashboardTab}
            currentLang={lang}
            studentInfo={studentInfo}
          />
        )}
        {dashboardTab === 'assistant' && (
          <DashboardAiAssistant
            currentLang={lang}
            prefillQuery={assistantPrefill}
            studentInfo={studentInfo}
          />
        )}
        {dashboardTab === 'syllabus' && (
          <DashboardSyllabus
            onNavigateTab={handleNavigateDashboardTab}
            currentLang={lang}
            studentInfo={studentInfo}
          />
        )}
        {dashboardTab === 'saved' && (
          <DashboardSaved
            onNavigateTab={handleNavigateDashboardTab}
            currentLang={lang}
            studentInfo={studentInfo}
          />
        )}
        {dashboardTab === 'profile' && (
          <DashboardProfile
            currentLang={lang}
            studentInfo={studentInfo}
            onUpdateStudentInfo={(updated) => setStudentInfo((prev) => ({ ...prev, ...updated }))}
          />
        )}
      </DashboardLayout>
    );
  }

  // Otherwise, render Public University Platform Layout
  return (
    <div className={`min-h-screen flex flex-col bg-[#FAFAFC] dark:bg-[#0B1320] text-[#073B4C] dark:text-slate-100 selection:bg-[#FFD166] selection:text-[#073B4C] transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Top Public Navigation */}
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
        onSuccessLogin={handleLoginSuccess}
      />
    </div>
  );
}

export default App;
