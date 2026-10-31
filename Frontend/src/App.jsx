import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';

// Public Layout Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Public Pages
import { Home } from './pages/public/Home';
import { Features } from './pages/public/Features';
import { HowItWorks } from './pages/public/HowItWorks';
import { Faq } from './pages/public/Faq';
import { About } from './pages/public/About';
import { Contact } from './pages/public/Contact';
import { AuthModal } from './components/auth/AuthModal';
import { AuthPortal } from './pages/public/AuthPortal';

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
import { DashboardExaminations } from './pages/dashboard/DashboardExaminations';
import { DashboardSavedAnswers } from './pages/dashboard/DashboardSavedAnswers';
import { DashboardFeedback } from './pages/dashboard/DashboardFeedback';
import { DashboardFacultyExams } from './pages/faculty/DashboardFacultyExams';
import { DashboardFacultyDocuments } from './pages/faculty/DashboardFacultyDocuments';
import { DashboardFacultySaved } from './pages/faculty/DashboardFacultySaved';
import { AdminConsole } from './pages/admin/AdminConsole';

// Smooth Scroll to Top on Route Change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

// Public Layout with Persistent Header and Footer
function PublicLayoutWrapper({
  currentLang,
  onToggleLang,
  isDark,
  onToggleTheme,
  isLoggedIn,
  studentInfo,
  onSignOut,
  onOpenAuth,
  onNavigate
}) {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith('/auth');

  return (
    <div className={`min-h-screen flex flex-col bg-[#FEFAF3] dark:bg-[#15370D] text-[#15370D] dark:text-[#FFF2B4] selection:bg-[#84A282] selection:text-white transition-colors duration-200 ${isDark ? 'dark' : ''}`}>
      {/* Top Public Navigation */}
      <Navbar 
        onNavigate={onNavigate} 
        onOpenAuth={onOpenAuth}
        currentLang={currentLang} 
        onToggleLang={onToggleLang}
        isDark={isDark}
        onToggleTheme={onToggleTheme}
        isLoggedIn={isLoggedIn}
        studentInfo={studentInfo}
        onSignOut={onSignOut}
      />

      {/* Main Dynamic Viewport */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Institutional Academic Portal Footer (hidden on dedicated auth page) */}
      {!isAuthPage && (
        <Footer 
          onNavigate={onNavigate} 
          onOpenAuth={onOpenAuth}
          currentLang={currentLang} 
        />
      )}
    </div>
  );
}

// Protected Dashboard Layout Wrapper
function DashboardLayoutWrapper({
  isLoggedIn,
  onSignOut,
  currentLang,
  onToggleLang,
  isDark,
  onToggleTheme,
  studentInfo
}) {
  const location = useLocation();
  const navigate = useNavigate();

  // If user is not logged in, gate access and redirect to /auth
  if (!isLoggedIn) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  // Derive active tab from URL path (e.g. /dashboard/regulations -> 'regulations')
  const pathSegment = location.pathname.replace('/dashboard', '').replace(/^\//, '').split('/')[0] || 'overview';

  const handleSelectTab = (tabId) => {
    navigate(`/dashboard/${tabId}`);
  };

  const handleOpenAdmin = () => {
    navigate('/admin');
  };

  return (
    <DashboardLayout
      activeTab={pathSegment}
      onSelectTab={handleSelectTab}
      onOpenAdmin={handleOpenAdmin}
      onSignOut={onSignOut}
      currentLang={currentLang}
      onToggleLang={onToggleLang}
      isDark={isDark}
      onToggleTheme={onToggleTheme}
      studentInfo={studentInfo}
    >
      <Outlet />
    </DashboardLayout>
  );
}

export function App() {
  const navigate = useNavigate();
  const [lang, setLang] = useState('en'); // 'en' or 'as'
  const [assistantPrefill, setAssistantPrefill] = useState('');

  // Floating Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] = useState('student'); // 'student' | 'faculty' | 'admin'
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' or 'register'

  // Dashboard Access Gating: Gated after authentication
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

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'as' : 'en'));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleOpenAuth = (mode = 'login', role = 'student') => {
    setAuthModalMode(mode);
    setAuthModalRole(role);
    setAuthModalOpen(true);
  };

  // Login Success Handler: Gates access into University Assistance Dashboard or Admin Console
  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true);
    localStorage.setItem('unimitra_auth_logged_in', 'true');
    
    if (user) {
      const updatedInfo = {
        ...studentInfo,
        name: user.name || studentInfo.name,
        email: user.email || studentInfo.email,
        role: user.role || studentInfo.role,
        department: user.department || studentInfo.department,
        designation: user.designation || '',
        memberId: user.memberId || '',
        facultyId: user.facultyId || ''
      };
      setStudentInfo(updatedInfo);
      localStorage.setItem('unimitra_student_info', JSON.stringify(updatedInfo));
    }

    setAuthModalOpen(false);

    // Role-based routing: Admin directly to Admin Console; Students & Faculty to Assistant Dashboard
    if (user?.role === 'Admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard/overview');
    }
  };

  // Sign Out Handler: Revokes session, clears dashboard lock, and returns to home
  const handleSignOut = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('unimitra_auth_logged_in');
    navigate('/');
  };

  // Safe Navigation Handler across public and protected portals
  const handleNavigate = (page) => {
    if (page === 'dashboard') {
      if (!isLoggedIn) {
        handleOpenAuth('login', 'student');
        return;
      }
      navigate('/dashboard/overview');
      return;
    }
    if (page === 'admin') {
      if (!isLoggedIn || studentInfo?.role !== 'Admin') {
        navigate('/auth?role=admin');
        return;
      }
      navigate('/admin');
      return;
    }
    if (page === 'home') {
      navigate('/');
      return;
    }
    if (page === 'auth') {
      navigate('/auth');
      return;
    }
    navigate(`/${page}`);
  };

  const handleNavigateDashboardTab = (tab, payload) => {
    if (payload?.prefillQuery) {
      setAssistantPrefill(payload.prefillQuery);
    }
    navigate(`/dashboard/${tab}`, { state: payload });
  };

  const handleUpdateStudentInfo = (updated) => {
    const newInfo = { ...studentInfo, ...updated };
    setStudentInfo(newInfo);
    localStorage.setItem('unimitra_student_info', JSON.stringify(newInfo));
  };

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes Wrapped in PublicLayoutWrapper */}
        <Route
          element={
            <PublicLayoutWrapper
              currentLang={lang}
              onToggleLang={toggleLanguage}
              isDark={theme === 'dark'}
              onToggleTheme={toggleTheme}
              isLoggedIn={isLoggedIn}
              studentInfo={studentInfo}
              onSignOut={handleSignOut}
              onOpenAuth={handleOpenAuth}
              onNavigate={handleNavigate}
            />
          }
        >
          <Route
            index
            element={
              <Home 
                onNavigate={handleNavigate} 
                onOpenAuth={handleOpenAuth} 
                currentLang={lang} 
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route path="home" element={<Navigate to="/" replace />} />
          <Route
            path="features"
            element={
              <Features 
                onNavigate={handleNavigate} 
                onOpenAuth={handleOpenAuth} 
                currentLang={lang} 
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route
            path="how-it-works"
            element={
              <HowItWorks 
                onNavigate={handleNavigate} 
                onOpenAuth={handleOpenAuth} 
                currentLang={lang} 
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route
            path="faq"
            element={
              <Faq 
                onNavigate={handleNavigate} 
                onOpenAuth={handleOpenAuth} 
                currentLang={lang} 
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route
            path="about"
            element={
              <About 
                onNavigate={handleNavigate} 
                onOpenAuth={handleOpenAuth} 
                currentLang={lang} 
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route
            path="contact"
            element={
              <Contact 
                currentLang={lang} 
              />
            }
          />
          <Route
            path="auth"
            element={
              <AuthPortal
                initialRole={authModalRole}
                initialMode={authModalMode}
                currentLang={lang}
                onSuccessLogin={handleLoginSuccess}
                onCancel={() => navigate('/')}
              />
            }
          />
          <Route path="login" element={<Navigate to="/auth" replace />} />
        </Route>

        {/* Administrator Knowledge Base & Ingestion Console */}
        <Route
          path="admin"
          element={
            !isLoggedIn || studentInfo?.role !== 'Admin' ? (
              <Navigate to="/auth?role=admin" replace />
            ) : (
              <AdminConsole
                onExit={() => {
                  if (isLoggedIn) {
                    navigate('/dashboard/overview');
                  } else {
                    navigate('/');
                  }
                }}
                currentLang={lang}
                onToggleLang={toggleLanguage}
                isDark={theme === 'dark'}
                onToggleTheme={toggleTheme}
              />
            )
          }
        />

        {/* University Assistance Dashboard (Protected Portal) */}
        <Route
          path="dashboard"
          element={
            <DashboardLayoutWrapper
              isLoggedIn={isLoggedIn}
              onSignOut={handleSignOut}
              currentLang={lang}
              onToggleLang={toggleLanguage}
              isDark={theme === 'dark'}
              onToggleTheme={toggleTheme}
              studentInfo={studentInfo}
            />
          }
        >
          <Route index element={<Navigate to="/dashboard/overview" replace />} />
          <Route
            path="overview"
            element={
              <DashboardHome
                onNavigateTab={handleNavigateDashboardTab}
                currentLang={lang}
                studentInfo={studentInfo}
              />
            }
          />
          <Route
            path="assistant"
            element={
              <DashboardAiAssistant
                currentLang={lang}
                prefillQuery={assistantPrefill}
                studentInfo={studentInfo}
              />
            }
          />
          <Route
            path="regulations"
            element={
              <DashboardRegulations
                onNavigateTab={handleNavigateDashboardTab}
                currentLang={lang}
              />
            }
          />
          <Route
            path="examinations"
            element={
              <DashboardExaminations
                onNavigateTab={handleNavigateDashboardTab}
                currentLang={lang}
              />
            }
          />
          <Route
            path="admissions"
            element={
              <DashboardAdmissions
                onNavigateTab={handleNavigateDashboardTab}
                currentLang={lang}
              />
            }
          />
          <Route
            path="scholarships"
            element={
              <DashboardScholarships
                onNavigateTab={handleNavigateDashboardTab}
                currentLang={lang}
              />
            }
          />
          <Route
            path="facilities"
            element={
              <DashboardFacilities
                onNavigateTab={handleNavigateDashboardTab}
                currentLang={lang}
              />
            }
          />
          <Route
            path="history"
            element={
              <DashboardQueryHistory
                onNavigateTab={handleNavigateDashboardTab}
                currentLang={lang}
              />
            }
          />
          <Route
            path="saved-answers"
            element={
              <DashboardSavedAnswers
                onNavigateTab={handleNavigateDashboardTab}
                currentLang={lang}
              />
            }
          />
          <Route
            path="feedback"
            element={
              <DashboardFeedback
                currentLang={lang}
                studentInfo={studentInfo}
              />
            }
          />
          <Route
            path="faculty-exams"
            element={
              <DashboardFacultyExams
                onNavigateTab={handleNavigateDashboardTab}
                currentLang={lang}
                studentInfo={studentInfo}
              />
            }
          />
          <Route
            path="faculty-documents"
            element={
              <DashboardFacultyDocuments
                onNavigateTab={handleNavigateDashboardTab}
                currentLang={lang}
              />
            }
          />
          <Route
            path="faculty-saved"
            element={
              <DashboardFacultySaved
                onNavigateTab={handleNavigateDashboardTab}
                currentLang={lang}
              />
            }
          />
          <Route
            path="profile"
            element={
              <DashboardProfile
                currentLang={lang}
                studentInfo={studentInfo}
                onUpdateStudentInfo={handleUpdateStudentInfo}
              />
            }
          />
          <Route path="*" element={<Navigate to="/dashboard/overview" replace />} />
        </Route>

        {/* Catch-All Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Floating Multi-Portal Login & Registration Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialRole={authModalRole}
        initialMode={authModalMode}
        currentLang={lang}
        onSuccessLogin={handleLoginSuccess}
      />
    </>
  );
}

export default App;
