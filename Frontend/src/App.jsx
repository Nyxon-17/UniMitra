import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
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
import { AdminConsole } from './pages/admin/AdminConsole';

export function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [assistantPrefill, setAssistantPrefill] = useState('');
  const [lang, setLang] = useState('en'); // 'en' or 'as'
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] = useState('student'); // 'student' | 'faculty' | 'admin'
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

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

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

    // Role-based routing: Admin directly to Admin Console; Students & Faculty to Assistant Dashboard
    if (user?.role === 'Admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  // Sign Out Handler: Revokes session, clears dashboard lock, and returns to home
  const handleSignOut = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('unimitra_auth_logged_in');
    navigate('/');
  };

  // Safe Navigation: Protects Dashboard & Admin Console; guests are prompted to log in
  const handleNavigate = (page) => {
    if (!page || page === 'home' || page === '/') {
      navigate('/');
    } else if (page === 'dashboard') {
      if (!isLoggedIn) {
        handleOpenAuth('login', 'student');
        return;
      }
      navigate('/dashboard');
    } else if (page === 'admin') {
      if (!isLoggedIn || studentInfo?.role !== 'Admin') {
        handleOpenAuth('login', 'admin');
        return;
      }
      navigate('/admin');
    } else {
      navigate(`/${page.replace(/^\//, '')}`);
    }
  };

  const handleSelectDashboardTab = (tabId) => {
    if (tabId === 'overview') {
      navigate('/dashboard');
    } else {
      navigate(`/dashboard/${tabId}`);
    }
  };

  const handleNavigateDashboardTab = (tabId, payload) => {
    if (payload?.prefillQuery) {
      setAssistantPrefill(payload.prefillQuery);
    }
    handleSelectDashboardTab(tabId);
  };

  const handleUpdateStudentInfo = (updated) => {
    const newInfo = { ...studentInfo, ...updated };
    setStudentInfo(newInfo);
    localStorage.setItem('unimitra_student_info', JSON.stringify(newInfo));
  };

  // Derive active navbar page from current pathname
  const getActivePage = () => {
    const p = location.pathname;
    if (p === '/' || p === '') return 'home';
    if (p.startsWith('/features')) return 'features';
    if (p.startsWith('/how-it-works')) return 'how-it-works';
    if (p.startsWith('/faq')) return 'faq';
    if (p.startsWith('/about')) return 'about';
    if (p.startsWith('/contact')) return 'contact';
    if (p.startsWith('/auth')) return 'auth';
    if (p.startsWith('/admin')) return 'admin';
    if (p.startsWith('/dashboard')) return 'dashboard';
    return 'home';
  };

  // Derive active dashboard tab from current pathname
  const getActiveDashboardTab = () => {
    const p = location.pathname;
    if (p.includes('/dashboard/assistant')) return 'assistant';
    if (p.includes('/dashboard/regulations')) return 'regulations';
    if (p.includes('/dashboard/admissions')) return 'admissions';
    if (p.includes('/dashboard/scholarships')) return 'scholarships';
    if (p.includes('/dashboard/facilities')) return 'facilities';
    if (p.includes('/dashboard/history')) return 'history';
    if (p.includes('/dashboard/profile')) return 'profile';
    return 'overview';
  };

  // Public Layout Wrapper with Shared Navbar and Institutional Footer
  const PublicLayout = ({ children, hideFooter = false }) => (
    <div className={`min-h-screen flex flex-col bg-[#FEFAF3] dark:bg-[#15370D] text-[#15370D] dark:text-[#FFF2B4] selection:bg-[#84A282] selection:text-white transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
      <Navbar 
        activePage={getActivePage()} 
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
      <main className="flex-1">
        {children}
      </main>
      {!hideFooter && (
        <Footer 
          onNavigate={handleNavigate} 
          onOpenAuth={handleOpenAuth}
          currentLang={lang} 
        />
      )}
    </div>
  );

  return (
    <>
      <Routes>
        {/* Public Institutional Portal Routes */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home 
                onNavigate={handleNavigate} 
                onOpenAuth={handleOpenAuth} 
                currentLang={lang} 
                isLoggedIn={isLoggedIn}
              />
            </PublicLayout>
          }
        />
        <Route
          path="/features"
          element={
            <PublicLayout>
              <Features 
                onNavigate={handleNavigate} 
                onOpenAuth={handleOpenAuth} 
                currentLang={lang} 
                isLoggedIn={isLoggedIn}
              />
            </PublicLayout>
          }
        />
        <Route
          path="/how-it-works"
          element={
            <PublicLayout>
              <HowItWorks 
                onNavigate={handleNavigate} 
                onOpenAuth={handleOpenAuth} 
                currentLang={lang} 
                isLoggedIn={isLoggedIn}
              />
            </PublicLayout>
          }
        />
        <Route
          path="/faq"
          element={
            <PublicLayout>
              <Faq 
                onNavigate={handleNavigate} 
                onOpenAuth={handleOpenAuth} 
                currentLang={lang} 
                isLoggedIn={isLoggedIn}
              />
            </PublicLayout>
          }
        />
        <Route
          path="/about"
          element={
            <PublicLayout>
              <About 
                onNavigate={handleNavigate} 
                onOpenAuth={handleOpenAuth} 
                currentLang={lang} 
                isLoggedIn={isLoggedIn}
              />
            </PublicLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <PublicLayout>
              <Contact currentLang={lang} />
            </PublicLayout>
          }
        />
        <Route
          path="/auth"
          element={
            <PublicLayout hideFooter>
              <AuthPortal
                initialRole={authModalRole}
                initialMode={authModalMode}
                currentLang={lang}
                onSuccessLogin={handleLoginSuccess}
                onCancel={() => navigate('/')}
              />
            </PublicLayout>
          }
        />

        {/* Admin Knowledge Base & Document Ingestion Console */}
        <Route
          path="/admin"
          element={
            <AdminConsole
              onExit={() => {
                if (isLoggedIn) {
                  navigate('/dashboard');
                } else {
                  navigate('/');
                }
              }}
              currentLang={lang}
              onToggleLang={toggleLanguage}
              isDark={theme === 'dark'}
              onToggleTheme={toggleTheme}
            />
          }
        />

        {/* Protected University Assistance Dashboard (Direct Nested Routing) */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <DashboardLayout
                activeTab={getActiveDashboardTab()}
                onSelectTab={handleSelectDashboardTab}
                onOpenAdmin={() => navigate('/admin')}
                onSignOut={handleSignOut}
                currentLang={lang}
                onToggleLang={toggleLanguage}
                isDark={theme === 'dark'}
                onToggleTheme={toggleTheme}
                studentInfo={studentInfo}
              />
            ) : (
              <Navigate to="/auth" state={{ from: location.pathname }} replace />
            )
          }
        >
          <Route index element={<DashboardHome onNavigateTab={handleNavigateDashboardTab} currentLang={lang} studentInfo={studentInfo} />} />
          <Route path="overview" element={<DashboardHome onNavigateTab={handleNavigateDashboardTab} currentLang={lang} studentInfo={studentInfo} />} />
          <Route path="assistant" element={<DashboardAiAssistant currentLang={lang} prefillQuery={assistantPrefill} studentInfo={studentInfo} />} />
          <Route path="regulations" element={<DashboardRegulations onNavigateTab={handleNavigateDashboardTab} currentLang={lang} />} />
          <Route path="admissions" element={<DashboardAdmissions onNavigateTab={handleNavigateDashboardTab} currentLang={lang} />} />
          <Route path="scholarships" element={<DashboardScholarships onNavigateTab={handleNavigateDashboardTab} currentLang={lang} />} />
          <Route path="facilities" element={<DashboardFacilities onNavigateTab={handleNavigateDashboardTab} currentLang={lang} />} />
          <Route path="history" element={<DashboardQueryHistory onNavigateTab={handleNavigateDashboardTab} currentLang={lang} />} />
          <Route path="profile" element={<DashboardProfile currentLang={lang} studentInfo={studentInfo} onUpdateStudentInfo={handleUpdateStudentInfo} />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Catch-all Wildcard Route */}
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
