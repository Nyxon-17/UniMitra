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

// Institutional University Assistance Dashboard Components & Pages
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { DashboardHome } from './pages/dashboard/DashboardHome';
import { DashboardAiAssistant } from './pages/dashboard/DashboardAiAssistant';
import { DashboardRegulations } from './pages/dashboard/DashboardRegulations';
import { DashboardAdmissions } from './pages/dashboard/DashboardAdmissions';
import { DashboardScholarships } from './pages/dashboard/DashboardScholarships';
import { DashboardFacilities } from './pages/dashboard/DashboardFacilities';
import { DashboardQueryHistory } from './pages/dashboard/DashboardQueryHistory';
import { DashboardProfile } from './pages/dashboard/DashboardProfile';
import { AdminConsole } from './pages/admin/AdminConsole';

export function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' | 'features' | 'how-it-works' | 'faq' | 'about' | 'contact' | 'dashboard' | 'admin'
  const [dashboardTab, setDashboardTab] = useState('overview'); // 'overview' | 'assistant' | 'regulations' | 'admissions' | 'scholarships' | 'facilities' | 'history' | 'profile'
  const [assistantPrefill, setAssistantPrefill] = useState('');
  
  const [lang, setLang] = useState('en'); // 'en' or 'as'
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' or 'register'

  // Dashboard Access Gating: Dashboard can access ONLY after login
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('unimitra_auth_logged_in') === 'true';
    }
    return false;
  });

  // User Profile: Universal across universities, supporting Students, Faculty & Staff
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
      name: 'Scholar Member',
      email: 'member@university.ac.in',
      role: 'Student',
      department: 'Higher Education Studies'
    };
  });
  
  // Theme state: Light theme (84A282, B8CFB3, FEFAF3, F6E2E9) & Dark theme (FFF2B4, E5CD82, 728E6D, 15370D)
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

  // Login Success Handler: Gates access into University Assistance Dashboard
  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true);
    localStorage.setItem('unimitra_auth_logged_in', 'true');
    
    if (user?.name || user?.email) {
      const updatedInfo = {
        ...studentInfo,
        name: user.name || studentInfo.name,
        email: user.email || studentInfo.email,
        role: user.role || studentInfo.role
      };
      setStudentInfo(updatedInfo);
      localStorage.setItem('unimitra_student_info', JSON.stringify(updatedInfo));
    }

    // Direct into dashboard after login
    setCurrentPage('dashboard');
    setDashboardTab('overview');
  };

  // Sign Out Handler: Revokes session, clears dashboard lock, and returns to home
  const handleSignOut = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('unimitra_auth_logged_in');
    setCurrentPage('home');
  };

  // Safe Navigation: Protects Dashboard; guests are prompted to log in
  const handleNavigate = (page) => {
    if (page === 'dashboard' && !isLoggedIn) {
      handleOpenAuth('login');
      return;
    }
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

  // University Assistance Dashboard View - Accessible ONLY after authentication
  if (currentPage === 'dashboard') {
    if (!isLoggedIn) {
      // Safety guard: if session lost, revert to home & open sign-in
      setCurrentPage('home');
      handleOpenAuth('login');
      return null;
    }

    return (
      <DashboardLayout
        activeTab={dashboardTab}
        onSelectTab={setDashboardTab}
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
        {dashboardTab === 'regulations' && (
          <DashboardRegulations
            onNavigateTab={handleNavigateDashboardTab}
            currentLang={lang}
          />
        )}
        {dashboardTab === 'admissions' && (
          <DashboardAdmissions
            onNavigateTab={handleNavigateDashboardTab}
            currentLang={lang}
          />
        )}
        {dashboardTab === 'scholarships' && (
          <DashboardScholarships
            onNavigateTab={handleNavigateDashboardTab}
            currentLang={lang}
          />
        )}
        {dashboardTab === 'facilities' && (
          <DashboardFacilities
            onNavigateTab={handleNavigateDashboardTab}
            currentLang={lang}
          />
        )}
        {dashboardTab === 'history' && (
          <DashboardQueryHistory
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
        onExit={() => {
          if (isLoggedIn) {
            setCurrentPage('dashboard');
          } else {
            setCurrentPage('home');
          }
        }}
        currentLang={lang}
        onToggleLang={toggleLanguage}
        isDark={theme === 'dark'}
        onToggleTheme={toggleTheme}
      />
    );
  }

  // Public Layout
  return (
    <div className={`min-h-screen flex flex-col bg-[#FEFAF3] dark:bg-[#15370D] text-[#15370D] dark:text-[#FFF2B4] selection:bg-[#84A282] selection:text-white transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
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
          <Home 
            onNavigate={handleNavigate} 
            onOpenAuth={handleOpenAuth} 
            currentLang={lang} 
            isLoggedIn={isLoggedIn}
          />
        )}
        {currentPage === 'features' && (
          <Features 
            onNavigate={handleNavigate} 
            onOpenAuth={handleOpenAuth} 
            currentLang={lang} 
            isLoggedIn={isLoggedIn}
          />
        )}
        {currentPage === 'how-it-works' && (
          <HowItWorks 
            onNavigate={handleNavigate} 
            onOpenAuth={handleOpenAuth} 
            currentLang={lang} 
            isLoggedIn={isLoggedIn}
          />
        )}
        {currentPage === 'faq' && (
          <Faq 
            onNavigate={handleNavigate} 
            onOpenAuth={handleOpenAuth} 
            currentLang={lang} 
            isLoggedIn={isLoggedIn}
          />
        )}
        {currentPage === 'about' && (
          <About 
            onNavigate={handleNavigate} 
            onOpenAuth={handleOpenAuth} 
            currentLang={lang} 
            isLoggedIn={isLoggedIn}
          />
        )}
        {currentPage === 'contact' && (
          <Contact 
            currentLang={lang} 
          />
        )}
      </main>

      {/* Institutional Academic Portal Footer */}
      <Footer 
        onNavigate={handleNavigate} 
        onOpenAuth={handleOpenAuth}
        currentLang={lang} 
      />

      {/* Floating Login & Registration Modal */}
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
