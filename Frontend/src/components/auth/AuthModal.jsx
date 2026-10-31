import { useState, useEffect, useRef } from 'react';
import { 
  XMarkIcon, 
  AcademicCapIcon, 
  CheckCircleIcon, 
  ArrowLeftIcon,
  EnvelopeIcon,
  LockClosedIcon 
} from '../common/Icons';

export const AuthModal = ({ isOpen, onClose, initialMode = 'login', currentLang = 'en', onSuccessLogin }) => {
  // Modes: 'login' | 'register' | 'forgot'
  const [mode, setMode] = useState(initialMode);
  
  // Registration steps: 'form' | 'otp'
  const [regStep, setRegStep] = useState('form');
  
  // Forgot password steps: 'email' | 'otp'
  const [forgotStep, setForgotStep] = useState('email');

  // Form states - Strictly Email (no Roll No)
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: true,
  });

  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true,
  });

  const [forgotData, setForgotData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: '',
  });

  // OTP State (6 digits)
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);

  // Resend Countdown Timer
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Status
  const [authStatus, setAuthStatus] = useState({ loading: false, success: false, message: '', error: null });

  // Reset when modal opens/changes
  useEffect(() => {
    setMode(initialMode);
    setRegStep('form');
    setForgotStep('email');
    setOtp(['', '', '', '', '', '']);
    setAuthStatus({ loading: false, success: false, message: '', error: null });
  }, [initialMode, isOpen]);

  // Handle countdown timer for OTP
  useEffect(() => {
    let interval = null;
    if ((regStep === 'otp' || forgotStep === 'otp') && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [regStep, forgotStep, timer]);

  // Handle Escape key
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

  // OTP Input Handlers
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    const newOtp = [...otp];
    pastedData.forEach((char, i) => {
      if (/^\d$/.test(char) && i < 6) {
        newOtp[i] = char;
      }
    });
    setOtp(newOtp);
    const nextIndex = Math.min(pastedData.length, 5);
    otpRefs.current[nextIndex]?.focus();
  };

  const handleResendOtp = () => {
    setTimer(60);
    setCanResend(false);
    setAuthStatus({ loading: false, success: false, message: 'A new 6-digit verification code was sent to your email.', error: null });
  };

  // 1. Login Submit
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setAuthStatus({ loading: true, success: false, message: '', error: null });

    setTimeout(() => {
      setAuthStatus({
        loading: false,
        success: true,
        message: 'Login successful! Welcome to UniMitra.',
        error: null,
      });
      setTimeout(() => {
        onClose();
        if (onSuccessLogin) {
          onSuccessLogin({ email: loginData.email, name: loginData.email.split('@')[0] });
        }
      }, 1100);
    }, 600);
  };

  // 2. Registration Step 1 Submit (Requests OTP)
  const handleRegisterFormSubmit = (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      setAuthStatus({ loading: false, success: false, message: '', error: 'Passwords do not match.' });
      return;
    }
    if (registerData.password.length < 6) {
      setAuthStatus({ loading: false, success: false, message: '', error: 'Password must be at least 6 characters.' });
      return;
    }

    setAuthStatus({ loading: true, success: false, message: '', error: null });

    setTimeout(() => {
      setAuthStatus({ loading: false, success: false, message: '', error: null });
      setRegStep('otp');
      setTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
    }, 500);
  };

  // 3. Registration Step 2 Submit (Verifies Email OTP)
  const handleVerifyRegisterOtp = (e) => {
    e.preventDefault();
    const fullCode = otp.join('');
    if (fullCode.length < 6) {
      setAuthStatus({ loading: false, success: false, message: '', error: 'Please enter all 6 digits of the code.' });
      return;
    }

    setAuthStatus({ loading: true, success: false, message: '', error: null });

    setTimeout(() => {
      setAuthStatus({
        loading: false,
        success: true,
        message: 'Email verified! Account created successfully.',
        error: null,
      });
      setTimeout(() => {
        onClose();
        if (onSuccessLogin) {
          onSuccessLogin({ email: registerData.email, name: registerData.fullName || registerData.email.split('@')[0] });
        }
      }, 1200);
    }, 700);
  };

  // 4. Forgot Password Step 1
  const handleForgotEmailSubmit = (e) => {
    e.preventDefault();
    if (!forgotData.email) {
      setAuthStatus({ loading: false, success: false, message: '', error: 'Please enter your registered email address.' });
      return;
    }

    setAuthStatus({ loading: true, success: false, message: '', error: null });

    setTimeout(() => {
      setAuthStatus({ loading: false, success: false, message: '', error: null });
      setForgotStep('otp');
      setTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
    }, 500);
  };

  // 5. Forgot Password Step 2
  const handleForgotResetSubmit = (e) => {
    e.preventDefault();
    const fullCode = otp.join('');
    if (fullCode.length < 6) {
      setAuthStatus({ loading: false, success: false, message: '', error: 'Please enter all 6 digits.' });
      return;
    }
    if (forgotData.newPassword !== forgotData.confirmPassword) {
      setAuthStatus({ loading: false, success: false, message: '', error: 'Passwords do not match.' });
      return;
    }
    if (forgotData.newPassword.length < 6) {
      setAuthStatus({ loading: false, success: false, message: '', error: 'Password must be at least 6 characters.' });
      return;
    }

    setAuthStatus({ loading: true, success: false, message: '', error: null });

    setTimeout(() => {
      setAuthStatus({
        loading: false,
        success: true,
        message: 'Password updated! Please sign in with your new password.',
        error: null,
      });
      setTimeout(() => {
        setMode('login');
        setForgotStep('email');
        setAuthStatus({ loading: false, success: false, message: '', error: null });
      }, 1300);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Dimmed Floating Backdrop */}
      <div 
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity duration-200" 
        onClick={onClose}
      ></div>

      {/* Compact, Responsive Modal Centered Vertically and Horizontally with Margin */}
      <div className="relative w-full max-w-[420px] bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-10 overflow-hidden my-auto max-h-[92vh] flex flex-col transition-all duration-200">
        
        {/* Compact Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 dark:bg-[#0E1726] border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#118AB2] to-[#06D6A0] flex items-center justify-center text-white shadow-xs">
              <AcademicCapIcon className="w-5 h-5 text-[#FFD166]" />
            </div>
            <div>
              <span className="text-lg font-black text-[#073B4C] dark:text-white leading-tight">
                Uni<span className="text-[#FF7F50]">Mitra</span>
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold leading-none">
                {mode === 'login' ? 'Student Sign In' : mode === 'register' ? 'New Account' : 'Password Recovery'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher: Only displayed in Login / Register modes */}
        {mode !== 'forgot' && (
          <div className="px-5 pt-3.5 shrink-0">
            <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs">
              <button
                onClick={() => {
                  setMode('login');
                  setRegStep('form');
                  setAuthStatus({ loading: false, success: false, message: '', error: null });
                }}
                className={`flex-1 py-1.5 font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white dark:bg-[#162235] text-[#118AB2] dark:text-[#FFD166] shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {currentLang === 'as' ? 'লগ-ইন (Sign In)' : 'Sign In'}
              </button>

              <button
                onClick={() => {
                  setMode('register');
                  setRegStep('form');
                  setAuthStatus({ loading: false, success: false, message: '', error: null });
                }}
                className={`flex-1 py-1.5 font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-white dark:bg-[#162235] text-[#118AB2] dark:text-[#FFD166] shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {currentLang === 'as' ? 'পঞ্জীয়ন (Register)' : 'Register'}
              </button>
            </div>
          </div>
        )}

        {/* Scrollable Form Body with Clean Compact Spacing */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {/* Success Banner */}
          {authStatus.success && (
            <div className="p-3 rounded-xl bg-[#E6FBF5] dark:bg-slate-800 border border-[#06D6A0]/40 text-center space-y-0.5">
              <div className="flex items-center justify-center space-x-1.5 text-[#06D6A0] font-bold text-xs sm:text-sm">
                <CheckCircleIcon className="w-4 h-4 shrink-0" />
                <span>{authStatus.message}</span>
              </div>
            </div>
          )}

          {/* Info Banner */}
          {authStatus.message && !authStatus.success && (
            <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300">
              {authStatus.message}
            </div>
          )}

          {/* Error Banner */}
          {authStatus.error && (
            <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-xs text-red-600 dark:text-red-400 font-medium">
              {authStatus.error}
            </div>
          )}

          {/* ========================================================= */}
          {/* 1. STUDENT LOGIN VIEW (Compact, Email & Password only)   */}
          {/* ========================================================= */}
          {mode === 'login' && (
            <div className="space-y-3.5">
              
              {/* Google Sign In Quick Button */}
              <button
                type="button"
                onClick={() => alert("Google OAuth 2.0 login will connect via backend.")}
                className="w-full flex items-center justify-center space-x-2.5 py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
                <span className="bg-white dark:bg-[#111C2E] px-3 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                  or email
                </span>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-3">
                {/* Email Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address <span className="text-[#FF7F50]">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <EnvelopeIcon className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="student@example.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-[#118AB2] transition-all"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Password <span className="text-[#FF7F50]">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setForgotStep('email');
                        setAuthStatus({ loading: false, success: false, message: '', error: null });
                      }}
                      className="text-[11px] text-[#118AB2] dark:text-[#FFD166] font-bold hover:underline cursor-pointer"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <LockClosedIcon className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-[#118AB2] transition-all"
                    />
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center pt-0.5">
                  <input
                    id="compact-remember"
                    type="checkbox"
                    checked={loginData.rememberMe}
                    onChange={(e) => setLoginData({ ...loginData, rememberMe: e.target.checked })}
                    className="w-3.5 h-3.5 text-[#118AB2] rounded border-slate-300 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="compact-remember" className="ml-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                    Remember session
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={authStatus.loading}
                  className="w-full py-2.5 rounded-xl font-bold text-white bg-[#FF7F50] hover:bg-[#E86B3D] transition-all cursor-pointer shadow-elevated-coral text-xs sm:text-sm disabled:opacity-50 mt-1"
                >
                  {authStatus.loading ? 'Signing in...' : 'Sign In as Student'}
                </button>

                <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-1">
                  Don’t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setRegStep('form');
                    }}
                    className="font-bold text-[#118AB2] dark:text-[#FFD166] hover:underline cursor-pointer"
                  >
                    Register Free
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. REGISTRATION FLOW (Compact, Email OTP Verification)    */}
          {/* ========================================================= */}
          {mode === 'register' && (
            <div>
              {regStep === 'form' ? (
                <div className="space-y-3.5">
                  {/* Google Quick Sign Up */}
                  <button
                    type="button"
                    onClick={() => alert("Google OAuth registration will be initialized.")}
                    className="w-full flex items-center justify-center space-x-2.5 py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-xs"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Sign Up with Google</span>
                  </button>

                  <div className="relative flex items-center justify-center">
                    <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
                    <span className="bg-white dark:bg-[#111C2E] px-3 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                      or student email
                    </span>
                  </div>

                  <form onSubmit={handleRegisterFormSubmit} className="space-y-3">
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
                        className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-[#118AB2] transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Email Address (OTP sent here) <span className="text-[#FF7F50]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. priyanku@gmail.com"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-[#118AB2] transition-all"
                      />
                    </div>

                    {/* Password & Confirm */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Password <span className="text-[#FF7F50]">*</span>
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="Min 6 chars"
                          value={registerData.password}
                          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-[#118AB2] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Confirm Password <span className="text-[#FF7F50]">*</span>
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="Repeat"
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-[#118AB2] transition-all"
                        />
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="flex items-start pt-0.5">
                      <input
                        id="compact-terms"
                        type="checkbox"
                        required
                        checked={registerData.agreeTerms}
                        onChange={(e) => setRegisterData({ ...registerData, agreeTerms: e.target.checked })}
                        className="w-3.5 h-3.5 text-[#118AB2] rounded border-slate-300 focus:ring-0 mt-0.5 cursor-pointer"
                      />
                      <label htmlFor="compact-terms" className="ml-2 text-[11px] text-slate-600 dark:text-slate-400">
                        I agree to UniMitra academic terms.
                      </label>
                    </div>

                    {/* Submit -> Go to OTP */}
                    <button
                      type="submit"
                      disabled={authStatus.loading}
                      className="w-full py-2.5 rounded-xl font-bold text-white bg-[#06D6A0] hover:bg-[#05B889] transition-all cursor-pointer shadow-elevated-mint text-xs sm:text-sm disabled:opacity-50 mt-1"
                    >
                      {authStatus.loading ? 'Sending Code...' : 'Send Verification OTP ➔'}
                    </button>

                    <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-1">
                      Already registered?{' '}
                      <button
                        type="button"
                        onClick={() => setMode('login')}
                        className="font-bold text-[#118AB2] dark:text-[#FFD166] hover:underline cursor-pointer"
                      >
                        Sign In
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* Step 2: 6-Digit Email OTP */
                <form onSubmit={handleVerifyRegisterOtp} className="space-y-4">
                  <div className="text-center space-y-1">
                    <div className="w-10 h-10 rounded-xl bg-[#E7F3F7] dark:bg-slate-800 text-[#118AB2] dark:text-[#FFD166] flex items-center justify-center mx-auto">
                      <EnvelopeIcon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Verify Email Address</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Code sent to <strong className="text-[#118AB2] dark:text-[#FFD166]">{registerData.email}</strong>
                    </p>
                    <button
                      type="button"
                      onClick={() => setRegStep('form')}
                      className="text-[11px] text-slate-400 hover:text-slate-700 dark:hover:text-white underline cursor-pointer"
                    >
                      Edit details
                    </button>
                  </div>

                  {/* 6 Digit OTP Inputs */}
                  <div className="flex justify-center gap-1.5 sm:gap-2 py-1" onPaste={handleOtpPaste}>
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (otpRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-9 h-11 sm:w-11 sm:h-13 text-center text-lg sm:text-xl font-black rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-[#06D6A0] outline-none transition-all shadow-xs"
                      />
                    ))}
                  </div>

                  {/* Resend */}
                  <div className="text-center text-xs text-slate-500 dark:text-slate-400">
                    {canResend ? (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="font-bold text-[#118AB2] dark:text-[#FFD166] hover:underline cursor-pointer"
                      >
                        Resend Code
                      </button>
                    ) : (
                      <span>Resend code in <strong className="font-mono text-slate-700 dark:text-slate-300">{timer}s</strong></span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={authStatus.loading}
                    className="w-full py-2.5 rounded-xl font-bold text-white bg-[#06D6A0] hover:bg-[#05B889] transition-all cursor-pointer shadow-elevated-mint text-xs sm:text-sm disabled:opacity-50"
                  >
                    {authStatus.loading ? 'Verifying...' : 'Verify & Complete'}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setRegStep('form')}
                      className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white flex items-center justify-center space-x-1 mx-auto cursor-pointer"
                    >
                      <ArrowLeftIcon className="w-3.5 h-3.5" />
                      <span>Back to Form</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. FORGOT PASSWORD FLOW (Compact + OTP)                   */}
          {/* ========================================================= */}
          {mode === 'forgot' && (
            <div className="space-y-4">
              {forgotStep === 'email' ? (
                <form onSubmit={handleForgotEmailSubmit} className="space-y-3.5">
                  <div className="text-center space-y-1">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF0EB] dark:bg-slate-800 text-[#FF7F50] flex items-center justify-center mx-auto">
                      <LockClosedIcon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Recover Password</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Enter your email to receive a 6-digit reset code.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Student Email Address <span className="text-[#FF7F50]">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <EnvelopeIcon className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                      <input
                        type="email"
                        required
                        placeholder="student@example.com"
                        value={forgotData.email}
                        onChange={(e) => setForgotData({ ...forgotData, email: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-[#118AB2] transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authStatus.loading}
                    className="w-full py-2.5 rounded-xl font-bold text-white bg-[#118AB2] hover:bg-[#0E7497] transition-all cursor-pointer shadow-elevated-cerulean text-xs sm:text-sm disabled:opacity-50"
                  >
                    {authStatus.loading ? 'Sending Code...' : 'Send Reset Code ➔'}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white flex items-center justify-center space-x-1 mx-auto cursor-pointer"
                    >
                      <ArrowLeftIcon className="w-3.5 h-3.5" />
                      <span>Back to Sign In</span>
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleForgotResetSubmit} className="space-y-3.5">
                  <div className="text-center space-y-1">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Reset Password with OTP</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Code sent to <strong className="text-[#118AB2] dark:text-[#FFD166]">{forgotData.email}</strong>
                    </p>
                  </div>

                  {/* 6 Digit OTP */}
                  <div className="flex justify-center gap-1.5 sm:gap-2 py-1" onPaste={handleOtpPaste}>
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (otpRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-9 h-11 sm:w-11 sm:h-13 text-center text-lg sm:text-xl font-black rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-[#118AB2] outline-none transition-all shadow-xs"
                      />
                    ))}
                  </div>

                  {/* Resend */}
                  <div className="text-center text-xs text-slate-500 dark:text-slate-400">
                    {canResend ? (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="font-bold text-[#118AB2] dark:text-[#FFD166] hover:underline cursor-pointer"
                      >
                        Resend Code
                      </button>
                    ) : (
                      <span>Resend code in <strong className="font-mono text-slate-700 dark:text-slate-300">{timer}s</strong></span>
                    )}
                  </div>

                  {/* Passwords */}
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        New Password <span className="text-[#FF7F50]">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Min 6 characters"
                        value={forgotData.newPassword}
                        onChange={(e) => setForgotData({ ...forgotData, newPassword: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-[#118AB2]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Confirm New Password <span className="text-[#FF7F50]">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Repeat new password"
                        value={forgotData.confirmPassword}
                        onChange={(e) => setForgotData({ ...forgotData, confirmPassword: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-[#118AB2]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authStatus.loading}
                    className="w-full py-2.5 rounded-xl font-bold text-white bg-[#FF7F50] hover:bg-[#E86B3D] transition-all cursor-pointer shadow-elevated-coral text-xs sm:text-sm disabled:opacity-50"
                  >
                    {authStatus.loading ? 'Updating...' : 'Set New Password'}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setForgotStep('email')}
                      className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white flex items-center justify-center space-x-1 mx-auto cursor-pointer"
                    >
                      <ArrowLeftIcon className="w-3.5 h-3.5" />
                      <span>Back to Email Step</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
