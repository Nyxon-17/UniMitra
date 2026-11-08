import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, useSearchParams, Outlet } from 'react-router-dom';

// Public Layout Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomeScreenBackground } from './components/common/HomeScreenBackground';

// Public Pages
import { Home } from './pages/public/Home';
import { Features } from './pages/public/Features';
import { HowItWorks } from './pages/public/HowItWorks';
import { Faq } from './pages/public/Faq';
import { About } from './pages/public/About';
import { Contact } from './pages/public/Contact';
import { AuthModal } from './components/auth/AuthModal';
import { authService } from './services/authService';

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
import { DashboardSyllabus } from './pages/dashboard/DashboardSyllabus';
import { DashboardCompare } from './pages/dashboard/DashboardCompare';
import { DashboardFacultyExams } from './pages/faculty/DashboardFacultyExams';
import { DashboardFacultyDocuments } from './pages/faculty/DashboardFacultyDocuments';
import { DashboardFacultySaved } from './pages/faculty/DashboardFacultySaved';
import { AdminConsole } from './pages/admin/AdminConsole';
import { GlobalAiChatWidget } from './components/common/GlobalAiChatWidget';
import { GlobalPopupNotification } from './components/common/GlobalPopupNotification';

// Smooth Scroll to Top on Route Change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

// Helper to trigger the Auth Modal popup without a separate page
function AuthPopupTrigger({ onOpenAuth }) {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'student';
  const mode = searchParams.get('mode') || 'login';

  useEffect(() => {
    onOpenAuth(mode, role);
  }, [mode, role, onOpenAuth]);

  return <Navigate to="/" replace />;
}

// Protected Admin Console Wrapper: triggers login popup if unauthenticated or not an admin
function AdminProtectedWrapper({
  isLoggedIn,
  studentInfo,
  onOpenAuth,
  onSignOut,
  currentLang,
  onToggleLang,
  isDark,
  onToggleTheme
}) {
  const navigate = useNavigate();
  const roleLower = (studentInfo?.role || '').toLowerCase();
  const isAdmin = isLoggedIn && roleLower.includes('admin');

  useEffect(() => {
    if (!isLoggedIn) {
      onOpenAuth('login', 'admin');
    }
  }, [isLoggedIn, onOpenAuth]);

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // Strict role isolation: if a Student or Faculty user tries to access /admin, redirect to their own portal
  if (!isAdmin) {
    if (roleLower.includes('faculty')) {
      return <Navigate to="/dashboard/faculty-exams" replace />;
    }
    return <Navigate to="/dashboard/overview" replace />;
  }

  return (
    <AdminConsole
      onExit={() => {
        if (onSignOut) {
          onSignOut();
        } else {
          navigate('/');
        }
      }}
      currentLang={currentLang}
      onToggleLang={onToggleLang}
      isDark={isDark}
      onToggleTheme={onToggleTheme}
      studentInfo={studentInfo}
    />
  );
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
  return (
    <div className={`relative min-h-screen flex flex-col bg-transparent text-[#000000] dark:text-[#FFFFFF] selection:bg-[#FF933E] selection:text-white dark:selection:bg-[#03C988] dark:selection:text-black transition-colors duration-200 ${isDark ? 'dark' : ''}`}>
      {/* Realistic Animated College Boy Looking to University Background on All Public Pages */}
      <HomeScreenBackground />
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
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>

      {/* Institutional Academic Portal Footer */}
      <Footer
        onNavigate={onNavigate}
        onOpenAuth={onOpenAuth}
        currentLang={currentLang}
        isLoggedIn={isLoggedIn}
        studentInfo={studentInfo}
      />
    </div>
  );
}

// Protected Dashboard Layout Wrapper (Dedicated Student & Faculty Portals)
function DashboardLayoutWrapper({
  isLoggedIn,
  onOpenAuth,
  onSignOut,
  currentLang,
  onToggleLang,
  isDark,
  onToggleTheme,
  studentInfo
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const roleLower = (studentInfo?.role || '').toLowerCase();
  const isFaculty = roleLower.includes('faculty');
  const isAdmin = roleLower.includes('admin');

  useEffect(() => {
    if (!isLoggedIn) {
      if (onOpenAuth) onOpenAuth('login', isFaculty ? 'faculty' : 'student');
    }
  }, [isLoggedIn, onOpenAuth, isFaculty]);

  // If user is not logged in, gate access and redirect to home with auth popup open
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // Strict role isolation: Admins belong to Admin Console (/admin), not Student/Faculty dashboard
  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  // Derive active tab from URL path
  const pathSegment = location.pathname.replace('/dashboard', '').replace(/^\//, '').split('/')[0] || (isFaculty ? 'faculty-exams' : 'overview');

  // Prevent Faculty from accessing Student-only pages
  const studentOnlyTabs = ['admissions', 'scholarships', 'facilities'];
  if (isFaculty && studentOnlyTabs.includes(pathSegment)) {
    return <Navigate to="/dashboard/faculty-exams" replace />;
  }

  // Prevent Student from accessing Faculty-only pages
  const facultyOnlyTabs = ['faculty-exams', 'faculty-documents'];
  if (!isFaculty && facultyOnlyTabs.includes(pathSegment)) {
    return <Navigate to="/dashboard/overview" replace />;
  }

  const handleSelectTab = (tabId) => {
    navigate(`/dashboard/${tabId}`);
  };

  const handleOpenAdmin = () => {
    if (isAdmin) {
      navigate('/admin');
    }
  };

  return (
    <DashboardLayout
      activeTab={pathSegment}
      onSelectTab={handleSelectTab}
      onOpenAdmin={isAdmin ? handleOpenAdmin : null}
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

  // Apply dark mode class to <html> element with smooth crossfade coordination
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('theme-transitioning');

    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('unimitra_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('unimitra_theme', 'light');
    }

    const timer = setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 450);

    return () => clearTimeout(timer);
  }, [theme]);

  // Restore and verify active session with Supabase PostgreSQL on mount
  useEffect(() => {
    if (authService.isAuthenticated()) {
      authService.getMe()
        .then((user) => {
          if (user) {
            setIsLoggedIn(true);
            setStudentInfo((prev) => ({
              ...prev,
              ...user,
            }));
          } else {
            setIsLoggedIn(false);
          }
        })
        .catch(() => {
          setIsLoggedIn(false);
        });
    }

    const handleAuthStateChange = (e) => {
      if (e.detail?.isLoggedIn === false) {
        setIsLoggedIn(false);
      }
    };
    window.addEventListener('unimitra_auth_state_changed', handleAuthStateChange);
    return () => window.removeEventListener('unimitra_auth_state_changed', handleAuthStateChange);
  }, []);

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

  // Login Success Handler: Strict role-based portal routing (Student -> Student Portal, Faculty -> Faculty Portal, Admin -> Admin Console)
  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true);
    localStorage.setItem('unimitra_auth_logged_in', 'true');

    const roleRaw = user?.role || studentInfo?.role || 'Student';
    const roleLower = roleRaw.toLowerCase();

    const formattedRole = roleLower.includes('admin')
      ? 'Admin'
      : (roleLower.includes('faculty') ? 'Faculty Member' : 'Student');

    const updatedInfo = {
      ...studentInfo,
      id: user?.id || user?._id || studentInfo?.id || 'usr-default',
      name: user?.name || user?.fullName || studentInfo.name,
      email: user?.email || studentInfo.email,
      role: formattedRole,
      department: user?.department || studentInfo.department,
      designation: user?.designation || '',
      memberId: user?.memberId || '',
      facultyId: user?.facultyId || ''
    };
    setStudentInfo(updatedInfo);
    localStorage.setItem('unimitra_student_info', JSON.stringify(updatedInfo));

    setAuthModalOpen(false);

    // Strict role-based routing: Portals do NOT merge!
    if (roleLower.includes('admin')) {
      navigate('/admin', { replace: true });
    } else if (roleLower.includes('faculty')) {
      navigate('/dashboard/faculty-exams', { replace: true });
    } else {
      navigate('/dashboard/overview', { replace: true });
    }
  };

  // Sign Out Handler: Revokes session, clears all authentication state, and returns directly to the public home page
  const handleSignOut = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Logout error:', err);
    }
    setIsLoggedIn(false);
    setStudentInfo({
      name: 'Scholar Member',
      email: 'member@university.ac.in',
      role: 'Student',
      department: 'Higher Education Studies'
    });
    localStorage.removeItem('unimitra_auth_logged_in');
    localStorage.removeItem('unimitra_student_info');
    localStorage.removeItem('unimitra_auth_token');
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (
          k &&
          (k.startsWith('unimitra_chat_sessions_guest') ||
            k.startsWith('unimitra_active_session_guest') ||
            k.startsWith('unimitra_messages_guest') ||
            k === 'unimitra_active_session_id' ||
            k === 'unimitra_chat_sessions_v2')
        ) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch {}
    navigate('/', { replace: true });
  };

  // Safe Navigation Handler across public and role-protected portals
  const handleNavigate = (page) => {
    const roleLower = (studentInfo?.role || '').toLowerCase();

    if (page === 'dashboard' || page === 'portal') {
      if (!isLoggedIn) {
        handleOpenAuth('login', 'student');
        return;
      }
      if (roleLower.includes('admin')) {
        navigate('/admin');
      } else if (roleLower.includes('faculty')) {
        navigate('/dashboard/faculty-exams');
      } else {
        navigate('/dashboard/overview');
      }
      return;
    }
    if (page === 'faculty') {
      if (!isLoggedIn || !roleLower.includes('faculty')) {
        handleOpenAuth('login', 'faculty');
        return;
      }
      navigate('/dashboard/faculty-exams');
      return;
    }
    if (page === 'admin') {
      if (!isLoggedIn || !roleLower.includes('admin')) {
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

  const handleUpdateStudentInfo = async (updated) => {
    const newInfo = { ...studentInfo, ...updated };
    setStudentInfo(newInfo);
    localStorage.setItem('unimitra_student_info', JSON.stringify(newInfo));

    if (authService.isAuthenticated()) {
      try {
        await authService.updateProfile({
          fullName: updated.name,
          department: updated.department,
          designation: updated.designation,
          preferredLanguage: updated.preferredLang,
        });
      } catch (err) {
        console.warn('Could not sync profile update to server:', err);
      }
    }
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
          {/* Auth Route: Triggers the Auth Popup Modal and returns cleanly to home */}
          <Route path="auth" element={<AuthPopupTrigger onOpenAuth={handleOpenAuth} />} />
          <Route path="login" element={<AuthPopupTrigger onOpenAuth={handleOpenAuth} />} />
        </Route>

        {/* Dedicated Faculty Portal Direct Routes */}
        <Route path="faculty" element={<Navigate to="/dashboard/faculty-exams" replace />} />
        <Route path="faculty/*" element={<Navigate to="/dashboard/faculty-exams" replace />} />

        {/* Administrator Knowledge Base & Ingestion Console - Accessible via Login Only */}
        <Route
          path="admin/*"
          element={
            <AdminProtectedWrapper
              isLoggedIn={isLoggedIn}
              studentInfo={studentInfo}
              onOpenAuth={handleOpenAuth}
              onSignOut={handleSignOut}
              currentLang={lang}
              onToggleLang={toggleLanguage}
              isDark={theme === 'dark'}
              onToggleTheme={toggleTheme}
            />
          }
        />
        <Route
          path="admin"
          element={
            <AdminProtectedWrapper
              isLoggedIn={isLoggedIn}
              studentInfo={studentInfo}
              onOpenAuth={handleOpenAuth}
              onSignOut={handleSignOut}
              currentLang={lang}
              onToggleLang={toggleLanguage}
              isDark={theme === 'dark'}
              onToggleTheme={toggleTheme}
            />
          }
        />

        {/* University Assistance Dashboard (Protected Portal) */}
        <Route
          path="dashboard"
          element={
            <DashboardLayoutWrapper
              isLoggedIn={isLoggedIn}
              onOpenAuth={handleOpenAuth}
              onSignOut={handleSignOut}
              currentLang={lang}
              onToggleLang={toggleLanguage}
              isDark={theme === 'dark'}
              onToggleTheme={toggleTheme}
              studentInfo={studentInfo}
            />
          }
        >
          <Route index element={<Navigate to={(studentInfo?.role || '').toLowerCase().includes('faculty') ? '/dashboard/faculty-exams' : '/dashboard/overview'} replace />} />
          <Route path="admin" element={<Navigate to="/admin" replace />} />
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
                key={`${studentInfo?.id || 'anon'}_${(studentInfo?.role || '').toLowerCase().includes('faculty') ? 'faculty' : 'student'}`}
                currentLang={lang}
                prefillQuery={assistantPrefill}
                studentInfo={studentInfo}
                portalDomain={(studentInfo?.role || '').toLowerCase().includes('faculty') ? 'faculty' : 'student'}
              />
            }
          />
          <Route
            path="faculty-assistant"
            element={
              <DashboardAiAssistant
                key={`${studentInfo?.id || 'anon'}_faculty`}
                currentLang={lang}
                prefillQuery={assistantPrefill}
                studentInfo={studentInfo}
                portalDomain="faculty"
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
                studentInfo={studentInfo}
                portalDomain={(studentInfo?.role || '').toLowerCase().includes('faculty') ? 'faculty' : 'student'}
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
                studentInfo={studentInfo}
              />
            }
          />
          <Route
            path="faculty-saved"
            element={<Navigate to="/dashboard/history" replace />}
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

      {/* Global Neomorphic Voice AI Assistant Widget - Accessible in ALL Portals (Requires Login) */}
      <GlobalAiChatWidget
        currentLang={lang}
        onToggleLang={toggleLanguage}
        studentInfo={studentInfo}
        isLoggedIn={isLoggedIn}
        onOpenAuth={(mode, role) => {
          setAuthModalRole(role || 'student');
          setAuthModalMode(mode || 'login');
          setAuthModalOpen(true);
        }}
      />

      {/* Global Interactive Popup & Toast Notification Center */}
      <GlobalPopupNotification />
    </>
  );
}

export default App;
