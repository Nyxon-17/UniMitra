import { useState, useEffect, useRef } from 'react';
import { 
  XMarkIcon, 
  BuildingLibraryIcon, 
  CheckCircleIcon, 
  ArrowLeftIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserGroupIcon
} from '../common/Icons';

export const AuthModal = ({ isOpen, onClose, initialMode = 'login', currentLang = 'en', onSuccessLogin }) => {
  // Modes: 'login' | 'register' | 'forgot'
  const [mode, setMode] = useState(initialMode);
  
  // Registration steps: 'form' | 'otp'
  const [regStep, setRegStep] = useState('form');
  
  // Forgot password steps: 'email' | 'otp'
  const [forgotStep, setForgotStep] = useState('email');

  // Selected institutional role
  const [userRole, setUserRole] = useState('Student');

  // Form states
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
        message: 'Authentication successful! Loading University Assistance Portal...',
        error: null,
      });
      setTimeout(() => {
        onClose();
        if (onSuccessLogin) {
          onSuccessLogin({ 
            email: loginData.email, 
            name: loginData.email.split('@')[0],
            role: userRole 
          });
        }
      }, 900);
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

  // 3. Registration Step 2 (Verify OTP)
  const handleVerifyRegisterOtp = (e) => {
    e.preventDefault();
    const fullCode = otp.join('');
    if (fullCode.length < 6) {
      setAuthStatus({ loading: false, success: false, message: '', error: 'Please enter all 6 digits.' });
      return;
    }

    setAuthStatus({ loading: true, success: false, message: '', error: null });

    setTimeout(() => {
      setAuthStatus({
        loading: false,
        success: true,
        message: 'Account verified! Signing you into the University Portal...',
        error: null,
      });
      setTimeout(() => {
        onClose();
        if (onSuccessLogin) {
          onSuccessLogin({ 
            name: registerData.fullName, 
            email: registerData.email,
            role: userRole
          });
        }
      }, 1000);
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
      }, 1200);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Dimmed Floating Backdrop */}
      <div 
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity duration-200" 
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-[440px] bg-[#FEFAF3] dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D] rounded-3xl shadow-2xl z-10 overflow-hidden my-auto max-h-[92vh] flex flex-col transition-all duration-200">
        
        {/* Compact Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#B8CFB3]/25 dark:bg-[#15370D] border-b border-[#B8CFB3] dark:border-[#728E6D] shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#84A282] to-[#B8CFB3] flex items-center justify-center text-white shadow-xs">
              <BuildingLibraryIcon className="w-5 h-5 text-[#FEFAF3]" />
            </div>
            <div>
              <span className="text-lg font-black text-[#15370D] dark:text-[#FFF2B4] leading-tight">
                Uni<span className="text-[#84A282]">Mitra</span>
              </span>
              <span className="text-[11px] text-[#4F6D4B] dark:text-[#E5CD82] block font-semibold leading-none">
                {mode === 'login' ? 'University Portal Sign In' : mode === 'register' ? 'New Institutional Account' : 'Password Recovery'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#4F6D4B] hover:text-[#15370D] dark:text-[#E5CD82] dark:hover:text-[#FFF2B4] hover:bg-[#B8CFB3]/30 dark:hover:bg-[#15370D] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Only displayed in Login / Register modes */}
        {mode !== 'forgot' && (
          <div className="px-6 pt-4 shrink-0 space-y-3">
            <div className="flex bg-[#B8CFB3]/30 dark:bg-[#15370D] p-1 rounded-2xl border border-[#B8CFB3] dark:border-[#728E6D] text-xs">
              <button
                onClick={() => {
                  setMode('login');
                  setRegStep('form');
                  setAuthStatus({ loading: false, success: false, message: '', error: null });
                }}
                className={`flex-1 py-2 font-black rounded-xl transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-[#84A282] text-white shadow-xs'
                    : 'text-[#15370D] dark:text-[#E5CD82] hover:text-[#15370D] dark:hover:text-[#FFF2B4]'
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
                className={`flex-1 py-2 font-black rounded-xl transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-[#84A282] text-white shadow-xs'
                    : 'text-[#15370D] dark:text-[#E5CD82] hover:text-[#15370D] dark:hover:text-[#FFF2B4]'
                }`}
              >
                {currentLang === 'as' ? 'পঞ্জীয়ন (Register)' : 'Register'}
              </button>
            </div>

            {/* Institutional Role Selector */}
            <div className="flex items-center justify-between text-[11px] font-bold text-[#4F6D4B] dark:text-[#E5CD82]">
              <span className="flex items-center space-x-1">
                <UserGroupIcon className="w-3.5 h-3.5 text-[#84A282]" />
                <span>Institutional Role:</span>
              </span>
              <div className="flex items-center space-x-1">
                {['Student', 'Faculty Member', 'Staff'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setUserRole(role)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-black cursor-pointer transition-all ${
                      userRole === role
                        ? 'bg-[#F6E2E9] dark:bg-[#728E6D] text-[#15370D] dark:text-[#FFF2B4] border border-[#B8CFB3] dark:border-[#E5CD82]/40'
                        : 'text-[#4F6D4B] dark:text-[#E5CD82] hover:bg-[#B8CFB3]/20'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {/* Success Banner */}
          {authStatus.success && (
            <div className="p-3 rounded-2xl bg-[#B8CFB3]/40 dark:bg-[#15370D] border-2 border-[#84A282] text-center space-y-0.5">
              <div className="flex items-center justify-center space-x-1.5 text-[#15370D] dark:text-[#FFF2B4] font-black text-xs sm:text-sm">
                <CheckCircleIcon className="w-4 h-4 text-[#84A282] shrink-0" />
                <span>{authStatus.message}</span>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {authStatus.error && (
            <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-900 text-xs text-red-700 dark:text-red-300 font-bold">
              {authStatus.error}
            </div>
          )}

          {/* ========================================================= */}
          {/* 1. LOGIN VIEW                                             */}
          {/* ========================================================= */}
          {mode === 'login' && (
            <div className="space-y-3.5">
              <form onSubmit={handleLoginSubmit} className="space-y-3">
                {/* Email Input */}
                <div>
                  <label className="block text-xs font-black text-[#15370D] dark:text-[#FFF2B4] mb-1">
                    Institutional / Personal Email <span className="text-[#84A282]">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <EnvelopeIcon className="w-4 h-4 text-[#4F6D4B] absolute left-3 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="user@university.ac.in"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-[#B8CFB3] dark:border-[#728E6D] bg-white dark:bg-[#15370D] text-[#15370D] dark:text-[#FFF2B4] outline-none focus:border-[#84A282] transition-all"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-black text-[#15370D] dark:text-[#FFF2B4]">
                      Password <span className="text-[#84A282]">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setForgotStep('email');
                        setAuthStatus({ loading: false, success: false, message: '', error: null });
                      }}
                      className="text-[11px] text-[#84A282] dark:text-[#E5CD82] font-black hover:underline cursor-pointer"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <LockClosedIcon className="w-4 h-4 text-[#4F6D4B] absolute left-3 pointer-events-none" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-[#B8CFB3] dark:border-[#728E6D] bg-white dark:bg-[#15370D] text-[#15370D] dark:text-[#FFF2B4] outline-none focus:border-[#84A282] transition-all"
                    />
                  </div>
                </div>

                {/* Remember Session */}
                <div className="flex items-center pt-0.5">
                  <input
                    id="remember-session"
                    type="checkbox"
                    checked={loginData.rememberMe}
                    onChange={(e) => setLoginData({ ...loginData, rememberMe: e.target.checked })}
                    className="w-4 h-4 text-[#84A282] rounded border-[#B8CFB3] cursor-pointer"
                  />
                  <label htmlFor="remember-session" className="ml-2 text-xs text-[#4F6D4B] dark:text-[#E5CD82] cursor-pointer font-semibold">
                    Remember active university session
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={authStatus.loading}
                  className="w-full py-3 rounded-2xl font-black text-white bg-[#84A282] hover:bg-[#6F8E6D] transition-all cursor-pointer shadow-elevated-sage text-xs sm:text-sm disabled:opacity-50 mt-1"
                >
                  {authStatus.loading ? 'Signing in...' : `Enter Portal as ${userRole}`}
                </button>

                <div className="text-center text-xs text-[#4F6D4B] dark:text-[#E5CD82] pt-1">
                  Need a new account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setRegStep('form');
                    }}
                    className="font-black text-[#84A282] dark:text-[#FFF2B4] hover:underline cursor-pointer"
                  >
                    Register Free
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. REGISTRATION VIEW                                      */}
          {/* ========================================================= */}
          {mode === 'register' && (
            <div>
              {regStep === 'form' ? (
                <form onSubmit={handleRegisterFormSubmit} className="space-y-3">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-black text-[#15370D] dark:text-[#FFF2B4] mb-1">
                      Full Name <span className="text-[#84A282]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Abhilash Sharma"
                      value={registerData.fullName}
                      onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#B8CFB3] dark:border-[#728E6D] bg-white dark:bg-[#15370D] text-[#15370D] dark:text-[#FFF2B4] outline-none focus:border-[#84A282]"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-black text-[#15370D] dark:text-[#FFF2B4] mb-1">
                      Email Address (6-digit code sent here) <span className="text-[#84A282]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@university.ac.in"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#B8CFB3] dark:border-[#728E6D] bg-white dark:bg-[#15370D] text-[#15370D] dark:text-[#FFF2B4] outline-none focus:border-[#84A282]"
                    />
                  </div>

                  {/* Password & Confirm */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-black text-[#15370D] dark:text-[#FFF2B4] mb-1">
                        Password <span className="text-[#84A282]">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Min 6 chars"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-[#B8CFB3] dark:border-[#728E6D] bg-white dark:bg-[#15370D] text-[#15370D] dark:text-[#FFF2B4] outline-none focus:border-[#84A282]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-[#15370D] dark:text-[#FFF2B4] mb-1">
                        Confirm <span className="text-[#84A282]">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Repeat"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                        className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-[#B8CFB3] dark:border-[#728E6D] bg-white dark:bg-[#15370D] text-[#15370D] dark:text-[#FFF2B4] outline-none focus:border-[#84A282]"
                      />
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="flex items-start pt-1">
                    <input
                      id="accept-terms"
                      type="checkbox"
                      required
                      checked={registerData.agreeTerms}
                      onChange={(e) => setRegisterData({ ...registerData, agreeTerms: e.target.checked })}
                      className="w-4 h-4 text-[#84A282] rounded border-[#B8CFB3] mt-0.5 cursor-pointer"
                    />
                    <label htmlFor="accept-terms" className="ml-2 text-[11px] text-[#4F6D4B] dark:text-[#E5CD82]">
                      I agree to UniMitra institutional guidelines.
                    </label>
                  </div>

                  {/* Submit -> Go to OTP */}
                  <button
                    type="submit"
                    disabled={authStatus.loading}
                    className="w-full py-3 rounded-2xl font-black text-white bg-[#84A282] hover:bg-[#6F8E6D] transition-all cursor-pointer shadow-elevated-sage text-xs sm:text-sm disabled:opacity-50 mt-1"
                  >
                    {authStatus.loading ? 'Sending Code...' : 'Send Verification OTP ➔'}
                  </button>

                  <div className="text-center text-xs text-[#4F6D4B] dark:text-[#E5CD82] pt-1">
                    Already registered?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="font-black text-[#84A282] dark:text-[#FFF2B4] hover:underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              ) : (
                /* Step 2: 6-Digit Email OTP */
                <form onSubmit={handleVerifyRegisterOtp} className="space-y-4">
                  <div className="text-center space-y-1">
                    <div className="w-11 h-11 rounded-2xl bg-[#B8CFB3]/40 dark:bg-[#15370D] text-[#84A282] dark:text-[#FFF2B4] flex items-center justify-center mx-auto border border-[#B8CFB3]">
                      <EnvelopeIcon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-black text-[#15370D] dark:text-[#FFF2B4]">Verify Email Address</h3>
                    <p className="text-xs text-[#4F6D4B] dark:text-[#E5CD82]">
                      Verification code sent to <strong>{registerData.email}</strong>
                    </p>
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
                        className="w-10 h-12 sm:w-12 sm:h-13 text-center text-lg sm:text-xl font-black rounded-2xl border-2 border-[#B8CFB3] dark:border-[#728E6D] bg-white dark:bg-[#15370D] text-[#15370D] dark:text-[#FFF2B4] focus:border-[#84A282] outline-none shadow-xs"
                      />
                    ))}
                  </div>

                  {/* Resend */}
                  <div className="text-center text-xs text-[#4F6D4B] dark:text-[#E5CD82]">
                    {canResend ? (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="font-black text-[#84A282] dark:text-[#FFF2B4] hover:underline cursor-pointer"
                      >
                        Resend Code
                      </button>
                    ) : (
                      <span>Resend code in <strong>{timer}s</strong></span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={authStatus.loading}
                    className="w-full py-3 rounded-2xl font-black text-white bg-[#84A282] hover:bg-[#6F8E6D] transition-all cursor-pointer shadow-elevated-sage text-xs sm:text-sm disabled:opacity-50"
                  >
                    {authStatus.loading ? 'Verifying...' : 'Verify & Enter Portal'}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setRegStep('form')}
                      className="text-xs font-bold text-[#4F6D4B] dark:text-[#E5CD82] hover:underline flex items-center justify-center space-x-1 mx-auto cursor-pointer"
                    >
                      <ArrowLeftIcon className="w-3.5 h-3.5" />
                      <span>Back to Registration</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. FORGOT PASSWORD VIEW                                   */}
          {/* ========================================================= */}
          {mode === 'forgot' && (
            <div className="space-y-4">
              {forgotStep === 'email' ? (
                <form onSubmit={handleForgotEmailSubmit} className="space-y-3.5">
                  <div className="text-center space-y-1">
                    <div className="w-11 h-11 rounded-2xl bg-[#F6E2E9] dark:bg-[#15370D] text-[#84A282] flex items-center justify-center mx-auto border border-[#B8CFB3]">
                      <LockClosedIcon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-black text-[#15370D] dark:text-[#FFF2B4]">Recover Password</h3>
                    <p className="text-xs text-[#4F6D4B] dark:text-[#E5CD82]">
                      Enter your email to receive a 6-digit recovery code.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#15370D] dark:text-[#FFF2B4] mb-1">
                      Email Address <span className="text-[#84A282]">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <EnvelopeIcon className="w-4 h-4 text-[#4F6D4B] absolute left-3 pointer-events-none" />
                      <input
                        type="email"
                        required
                        placeholder="user@university.ac.in"
                        value={forgotData.email}
                        onChange={(e) => setForgotData({ ...forgotData, email: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-[#B8CFB3] dark:border-[#728E6D] bg-white dark:bg-[#15370D] text-[#15370D] dark:text-[#FFF2B4] outline-none focus:border-[#84A282]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authStatus.loading}
                    className="w-full py-3 rounded-2xl font-black text-white bg-[#84A282] hover:bg-[#6F8E6D] transition-all cursor-pointer shadow-elevated-sage text-xs sm:text-sm disabled:opacity-50"
                  >
                    {authStatus.loading ? 'Sending Code...' : 'Send Recovery Code ➔'}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-xs font-black text-[#4F6D4B] dark:text-[#E5CD82] hover:underline flex items-center justify-center space-x-1 mx-auto cursor-pointer"
                    >
                      <ArrowLeftIcon className="w-3.5 h-3.5" />
                      <span>Back to Sign In</span>
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleForgotResetSubmit} className="space-y-3.5">
                  <div className="text-center space-y-1">
                    <h3 className="text-base font-black text-[#15370D] dark:text-[#FFF2B4]">Reset Password with OTP</h3>
                    <p className="text-xs text-[#4F6D4B] dark:text-[#E5CD82]">
                      Code sent to <strong>{forgotData.email}</strong>
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
                        className="w-10 h-12 sm:w-12 sm:h-13 text-center text-lg sm:text-xl font-black rounded-2xl border-2 border-[#B8CFB3] dark:border-[#728E6D] bg-white dark:bg-[#15370D] text-[#15370D] dark:text-[#FFF2B4] focus:border-[#84A282] outline-none shadow-xs"
                      />
                    ))}
                  </div>

                  {/* New Passwords */}
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-xs font-black text-[#15370D] dark:text-[#FFF2B4] mb-1">
                        New Password <span className="text-[#84A282]">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Min 6 characters"
                        value={forgotData.newPassword}
                        onChange={(e) => setForgotData({ ...forgotData, newPassword: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#B8CFB3] dark:border-[#728E6D] bg-white dark:bg-[#15370D] text-[#15370D] dark:text-[#FFF2B4] outline-none focus:border-[#84A282]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-[#15370D] dark:text-[#FFF2B4] mb-1">
                        Confirm New Password <span className="text-[#84A282]">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Repeat new password"
                        value={forgotData.confirmPassword}
                        onChange={(e) => setForgotData({ ...forgotData, confirmPassword: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#B8CFB3] dark:border-[#728E6D] bg-white dark:bg-[#15370D] text-[#15370D] dark:text-[#FFF2B4] outline-none focus:border-[#84A282]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authStatus.loading}
                    className="w-full py-3 rounded-2xl font-black text-white bg-[#84A282] hover:bg-[#6F8E6D] transition-all cursor-pointer shadow-elevated-sage text-xs sm:text-sm disabled:opacity-50"
                  >
                    {authStatus.loading ? 'Updating...' : 'Set New Password'}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setForgotStep('email')}
                      className="text-xs font-bold text-[#4F6D4B] dark:text-[#E5CD82] hover:underline flex items-center justify-center space-x-1 mx-auto cursor-pointer"
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
