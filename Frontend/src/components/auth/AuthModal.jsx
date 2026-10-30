import { useState, useEffect } from 'react';
import { XMarkIcon, AcademicCapIcon, CheckCircleIcon } from '../common/Icons';

export const AuthModal = ({ isOpen, onClose, initialMode = 'login', currentLang = 'en' }) => {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [loginData, setLoginData] = useState({
    university: 'Gauhati University (GU)',
    emailOrRoll: '',
    password: '',
    rememberMe: true,
  });

  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    university: 'Gauhati University (GU)',
    course: 'BCA (Bachelor of Computer Applications)',
    semester: 'Semester 3',
    password: '',
    confirmPassword: '',
    agreeTerms: true,
  });

  const [authStatus, setAuthStatus] = useState({ loading: false, success: false, error: null });

  useEffect(() => {
    setMode(initialMode);
    setAuthStatus({ loading: false, success: false, error: null });
  }, [initialMode, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const universities = [
    'Gauhati University (GU)',
    'Dibrugarh University (DU)',
    'Tezpur University (TU)',
    'Assam University (Silchar)',
    'Cotton University (CU)',
    'Bodoland University (BU)',
    'Assam Science & Technology University (ASTU)',
    'Assam Agricultural University (AAU)',
    'Kumar Bhaskar Varma University',
    'Bhattadev University',
    'Madhabdev University',
    'Other Assam University / College'
  ];

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setAuthStatus({ loading: true, success: false, error: null });

    setTimeout(() => {
      setAuthStatus({
        loading: false,
        success: true,
        error: null,
      });
      setTimeout(() => {
        onClose();
      }, 1500);
    }, 800);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      setAuthStatus({ loading: false, success: false, error: 'Passwords do not match.' });
      return;
    }

    setAuthStatus({ loading: true, success: false, error: null });

    setTimeout(() => {
      setAuthStatus({
        loading: false,
        success: true,
        error: null,
      });
      setTimeout(() => {
        onClose();
      }, 1500);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dimmed Floating Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200" 
        onClick={onClose}
      ></div>

      {/* Main Floating Modal Window */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-10 overflow-hidden my-8 transition-colors duration-200">
        
        {/* Top Floating Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-[#0E1726] border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#118AB2] to-[#06D6A0] flex items-center justify-center text-white">
              <AcademicCapIcon className="w-5 h-5 text-[#FFD166]" />
            </div>
            <div>
              <span className="text-xl font-black text-[#073B4C] dark:text-white">
                Uni<span className="text-[#FF7F50]">Mitra</span>
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Student Portal</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Login / Registration */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/40 p-1.5 m-6 mb-4 rounded-xl">
          <button
            onClick={() => {
              setMode('login');
              setAuthStatus({ loading: false, success: false, error: null });
            }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white dark:bg-[#162235] text-[#118AB2] dark:text-[#FFD166] shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {currentLang === 'as' ? 'ছাত্ৰ লগ-ইন (Sign In)' : 'Student Sign In'}
          </button>

          <button
            onClick={() => {
              setMode('register');
              setAuthStatus({ loading: false, success: false, error: null });
            }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-white dark:bg-[#162235] text-[#118AB2] dark:text-[#FFD166] shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {currentLang === 'as' ? 'নতুন ছাত্ৰ পঞ্জীয়ন (Register)' : 'New Student Register'}
          </button>
        </div>

        {/* Form Body */}
        <div className="px-6 pb-6">
          
          {/* Success Message Banner */}
          {authStatus.success && (
            <div className="mb-4 p-4 rounded-xl bg-[#E6FBF5] dark:bg-slate-800 border-2 border-[#06D6A0]/40 text-center space-y-1">
              <div className="flex items-center justify-center space-x-1.5 text-[#06D6A0] font-bold text-sm">
                <CheckCircleIcon className="w-5 h-5" />
                <span>
                  {mode === 'login' ? 'Login Successful!' : 'Registration Successful!'}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Welcome to UniMitra. Redirecting to your academic dashboard...
              </p>
            </div>
          )}

          {/* Error Message Banner */}
          {authStatus.error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-xs text-red-600 dark:text-red-400 font-medium">
              {authStatus.error}
            </div>
          )}

          {/* Quick Continue with Google Button */}
          <button
            type="button"
            onClick={() => alert("Google OAuth 2.0 flow will connect via your Google Client ID.")}
            className="w-full flex items-center justify-center space-x-3 py-3 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-200 transition-all cursor-pointer mb-5 shadow-xs"
          >
            {/* Google G Logo SVG */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>
              {mode === 'login' ? 'Continue with Google Account' : 'Sign Up with Google Account'}
            </span>
          </button>

          <div className="relative flex items-center justify-center mb-5">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
            <span className="bg-white dark:bg-[#111C2E] px-3 text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Or with email
            </span>
          </div>

          {/* ======================= LOGIN FORM ======================= */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* University Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Your University
                </label>
                <select
                  value={loginData.university}
                  onChange={(e) => setLoginData({ ...loginData, university: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-[#118AB2] cursor-pointer"
                >
                  {universities.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              {/* Email or Roll Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Student Email or Roll Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. rahul@gauhati.ac.in or 21034001"
                  value={loginData.emailOrRoll}
                  onChange={(e) => setLoginData({ ...loginData, emailOrRoll: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-[#118AB2]"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert("Password reset link will be sent to your student email.")}
                    className="text-xs text-[#118AB2] dark:text-[#FFD166] font-semibold hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-[#118AB2]"
                />
              </div>

              {/* Remember checkbox */}
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  checked={loginData.rememberMe}
                  onChange={(e) => setLoginData({ ...loginData, rememberMe: e.target.checked })}
                  className="w-4 h-4 text-[#118AB2] rounded border-slate-300 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="remember" className="ml-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                  Remember my session on this device
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={authStatus.loading}
                className="w-full py-3 rounded-xl font-bold text-white bg-[#FF7F50] hover:bg-[#E86B3D] transition-all cursor-pointer shadow-elevated-coral text-sm disabled:opacity-50 mt-2"
              >
                {authStatus.loading ? 'Signing in...' : 'Sign In as Student'}
              </button>

              <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
                Don’t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-bold text-[#118AB2] dark:text-[#FFD166] hover:underline cursor-pointer"
                >
                  Register Free
                </button>
              </div>
            </form>
          ) : (
            /* ======================= REGISTRATION FORM ======================= */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name <span className="text-[#FF7F50]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priyanku Sarma"
                  value={registerData.fullName}
                  onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-[#118AB2]"
                />
              </div>

              {/* Student Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Student / Personal Email <span className="text-[#FF7F50]">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. priyanku@gmail.com"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-[#118AB2]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* University */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    University <span className="text-[#FF7F50]">*</span>
                  </label>
                  <select
                    value={registerData.university}
                    onChange={(e) => setRegisterData({ ...registerData, university: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-[#118AB2] cursor-pointer"
                  >
                    {universities.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>

                {/* Semester */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Current Semester
                  </label>
                  <select
                    value={registerData.semester}
                    onChange={(e) => setRegisterData({ ...registerData, semester: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-[#118AB2] cursor-pointer"
                  >
                    <option>Semester 1</option>
                    <option>Semester 2</option>
                    <option>Semester 3</option>
                    <option>Semester 4</option>
                    <option>Semester 5</option>
                    <option>Semester 6</option>
                    <option>Semester 7</option>
                    <option>Semester 8</option>
                  </select>
                </div>
              </div>

              {/* Password fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Password <span className="text-[#FF7F50]">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-[#118AB2]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Confirm Password <span className="text-[#FF7F50]">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Repeat password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-[#118AB2]"
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start pt-1">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  checked={registerData.agreeTerms}
                  onChange={(e) => setRegisterData({ ...registerData, agreeTerms: e.target.checked })}
                  className="w-4 h-4 text-[#118AB2] rounded border-slate-300 focus:ring-0 mt-0.5 cursor-pointer"
                />
                <label htmlFor="terms" className="ml-2 text-xs text-slate-600 dark:text-slate-400">
                  I agree to UniMitra’s academic code of conduct and document usage terms.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={authStatus.loading}
                className="w-full py-3 rounded-xl font-bold text-white bg-[#06D6A0] hover:bg-[#05B889] transition-all cursor-pointer shadow-elevated-mint text-sm disabled:opacity-50 mt-2"
              >
                {authStatus.loading ? 'Creating Student Account...' : 'Complete Free Registration'}
              </button>

              <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-1">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-[#118AB2] dark:text-[#FFD166] hover:underline cursor-pointer"
                >
                  Sign In Here
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};

