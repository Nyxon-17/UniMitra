import { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/public/Home';
import { Features } from './pages/public/Features';
import { HowItWorks } from './pages/public/HowItWorks';
import { Faq } from './pages/public/Faq';
import { About } from './pages/public/About';
import { Contact } from './pages/public/Contact';
import { AuthModal } from './components/auth/AuthModal';

// Student Dashboard Components & Sub-pages
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { DashboardHome } from './pages/dashboard/DashboardHome';
import { DashboardAiAssistant } from './pages/dashboard/DashboardAiAssistant';
import { DashboardSyllabus } from './pages/dashboard/DashboardSyllabus';
import { DashboardCompare } from './pages/dashboard/DashboardCompare';
import { DashboardProfile } from './pages/dashboard/DashboardProfile';
import { AdminConsole } from './pages/admin/AdminConsole';

export function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' | 'features' | 'faq' | 'about' | 'contact' | 'dashboard'
  const [dashboardTab, setDashboardTab] = useState('overview'); // 'overview' | 'assistant' | 'syllabus' | 'profile'
  const [assistantPrefill, setAssistantPrefill] = useState('');
  
  const [lang, setLang] = useState('en'); // 'en' or 'as'
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' or 'register'

  // Student Authentication State - Optional session (no lock on curriculums or dashboard)
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('unimitra_auth_logged_in') === 'true';
    }
    return false;
  });

  // Universal student profile - No single university specified or locked
  const [studentInfo, setStudentInfo] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('unimitra_student_info');
      if (savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch {
          // fallback
        }
      }
    }
    return {
      name: 'Student Scholar',
      email: 'student@unimitra.edu',
      course: 'Higher Education Curriculums',
      semester: 'Semester 3'
    };
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

  // Login Success Handler: Activates optional session
  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true);
    localStorage.setItem('unimitra_auth_logged_in', 'true');
    
    if (user?.name) {
      const updatedInfo = {
        ...studentInfo,
        name: user.name,
        email: user.email || studentInfo.email,
      };
      setStudentInfo(updatedInfo);
      localStorage.setItem('unimitra_student_info', JSON.stringify(updatedInfo));
    }

    setCurrentPage('dashboard');
    setDashboardTab('overview');
  };

  // Sign Out Handler: Revokes session and returns to home
  const handleSignOut = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('unimitra_auth_logged_in');
    setCurrentPage('home');
  };

  // Direct Navigation: Open to all pages with zero login gating
  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleNavigateDashboardTab = (tab, payload) => {
    setDashboardTab(tab);
    if (payload?.prefillQuery) {
      setAssistantPrefill(payload.prefillQuery);
    }
  };

  const handleUpdateStudentInfo = (updated) => {
    const newInfo = { ...studentInfo, ...updated };
    setStudentInfo(newInfo);
    localStorage.setItem('unimitra_student_info', JSON.stringify(newInfo));
  };

  // Student Dashboard / Study Hub View - Accessible by ALL students without requiring login
  if (currentPage === 'dashboard') {
    return (
      <DashboardLayout
        activeTab={dashboardTab}
        onSelectTab={setDashboardTab}
        onExitDashboard={() => setCurrentPage('home')}
        onOpenAdmin={() => setCurrentPage('admin')}
        onSignOut={handleSignOut}
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
        {dashboardTab === 'compare' && (
          <DashboardCompare
            onNavigateTab={handleNavigateDashboardTab}
            currentLang={lang}
          />
        )}
        {dashboardTab === 'profile' && (
          <DashboardProfile
            currentLang={lang}
            studentInfo={studentInfo}
            onUpdateStudentInfo={handleUpdateStudentInfo}
          />
        )}
      </DashboardLayout>
    );
  }

  // Admin Knowledge Base & Document Ingestion Console
  if (currentPage === 'admin') {
    return (
      <AdminConsole
        onExit={() => setCurrentPage('home')}
        currentLang={lang}
        onToggleLang={toggleLanguage}
        isDark={theme === 'dark'}
        onToggleTheme={toggleTheme}
      />
    );
  }

  // Public Layout
  return (
    <div className={`min-h-screen flex flex-col bg-[#FAFAFC] dark:bg-[#0B1320] text-[#073B4C] dark:text-slate-100 selection:bg-[#FFD166] selection:text-[#073B4C] transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Top Public Navigation */}
      <Navbar 
        activePage={currentPage} 
        onNavigate={handleNavigate} 
        onOpenAuth={handleOpenAuth}
        currentLang={lang} 
        onToggleLang={toggleLanguage}
        isDark={theme === 'dark'}
        onToggleTheme={toggleTheme}
        isLoggedIn={isLoggedIn}
        studentInfo={studentInfo}
        onSignOut={handleSignOut}
      />

      {/* Main Dynamic Viewport */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <Home onNavigate={handleNavigate} onOpenAuth={handleOpenAuth} currentLang={lang} />
        )}
        {currentPage === 'features' && (
          <Features onNavigate={handleNavigate} onOpenAuth={handleOpenAuth} currentLang={lang} />
        )}
        {currentPage === 'how-it-works' && (
          <HowItWorks onNavigate={handleNavigate} onOpenAuth={handleOpenAuth} currentLang={lang} />
        )}
        {currentPage === 'faq' && (
          <Faq onNavigate={handleNavigate} onOpenAuth={handleOpenAuth} currentLang={lang} />
        )}
        {currentPage === 'about' && (
          <About onNavigate={handleNavigate} onOpenAuth={handleOpenAuth} currentLang={lang} />
        )}
        {currentPage === 'contact' && (
          <Contact onNavigate={handleNavigate} onOpenAuth={handleOpenAuth} currentLang={lang} />
        )}
      </main>

      {/* Academic Portal Footer */}
      <Footer 
        onNavigate={handleNavigate} 
        onOpenAuth={handleOpenAuth}
        currentLang={lang} 
      />

      {/* Optional Floating Login & Registration Modal for Students */}
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
