import { useState, useEffect, useRef } from 'react';
import { 
  XMarkIcon, 
  BuildingLibraryIcon, 
  AcademicCapIcon,
  IdentificationIcon,
  ShieldCheckIcon,
  CheckCircleIcon, 
  CheckIcon,
  DocumentDuplicateIcon,
  ArrowRightIcon,
  EnvelopeIcon,
  LockClosedIcon,
  KeyIcon,
  ClockIcon,
  EyeIcon,
  EyeSlashIcon
} from '../common/Icons';
import { authService } from '../../services/authService';

export const AuthModal = ({ 
  isOpen, 
  onClose, 
  initialRole = 'student', 
  initialMode = 'login', 
  currentLang = 'en', 
  onSuccessLogin 
}) => {
  // Roles: 'student' | 'faculty' | 'admin'
  const [role, setRole] = useState(initialRole);
  
  // Modes: 'login' | 'register'
  const [mode, setMode] = useState(initialMode);

  // Steps:
  // Student: 'form' | 'otp'
  // Faculty: 'form' | 'created_id' | 'login_credentials' | 'login_otp'
  // Admin: 'credentials' | 'otp'
  const [step, setStep] = useState('form');

  // Generated Unique Member ID for Faculty
  const [generatedMemberId, setGeneratedMemberId] = useState('');
  const [copiedId, setCopiedId] = useState(false);

  // 6-digit OTP state
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);

  // Countdown timer for OTP resend
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Status message state
  const [status, setStatus] = useState({ loading: false, success: false, message: '', error: null });

  // Password visibility state with eye buttons
  const [showPasswords, setShowPasswords] = useState({
    studentLogin: false,
    studentReg: false,
    studentRegConfirm: false,
    facultyLogin: false,
    facultyReg: false,
    facultyRegConfirm: false,
    adminLogin: false,
  });

  const toggleShowPassword = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // 1. Student Form State
  const [studentReg, setStudentReg] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [studentLogin, setStudentLogin] = useState({
    email: '',
    password: '',
    rememberMe: true,
  });

  // 2. Faculty Member Form State
  const [facultyReg, setFacultyReg] = useState({
    fullName: '',
    officialEmail: '',
    memberEmail: '',
    facultyId: '',
    department: 'Computer Science & Engineering',
    designation: 'Assistant Professor',
    password: '',
    confirmPassword: '',
  });

  const [facultyLogin, setFacultyLogin] = useState({
    memberId: '',
    password: '',
  });

  // 3. Super Admin Form State
  const [adminLogin, setAdminLogin] = useState({
    superName: 'System Administrator',
    superEmail: 'admin@unimitra.edu.in',
    superPassword: 'admin@unimitra',
  });

  // Department options for faculty
  const departmentOptions = [
    'Computer Science & Engineering',
    'Information Technology',
    'Mathematics & Statistics',
    'Physics',
    'Chemistry',
    'Life Sciences & Biotechnology',
    'Assamese & Regional Studies',
    'English & Foreign Languages',
    'Commerce & Management Studies',
    'Law & Legal Studies',
    'Economics & Public Policy'
  ];

  // Designation options for faculty
  const designationOptions = [
    'Professor',
    'Associate Professor',
    'Assistant Professor',
    'Head of Department (HOD)',
    'Dean of Academic Affairs',
    'Visiting Faculty / Fellow'
  ];

  // Reset when modal opens or initial props change
  useEffect(() => {
    setRole(initialRole);
    setMode(initialMode);
    setStep(
      initialMode === 'register' 
        ? 'form' 
        : (initialRole === 'admin' ? 'credentials' : (initialRole === 'faculty' ? 'login_credentials' : 'form'))
    );
    setOtp(['', '', '', '', '', '']);
    setStatus({ loading: false, success: false, message: '', error: null });
  }, [initialRole, initialMode, isOpen]);

  // Handle countdown timer for OTP
  useEffect(() => {
    let interval = null;
    const isOtpStep = step === 'otp' || step === 'login_otp';
    if (isOtpStep && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Handle Escape key to close modal
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

  // OTP handlers
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

  const resetOtp = () => {
    setOtp(['', '', '', '', '', '']);
    setTimer(60);
    setCanResend(false);
  };

  const handleCopyMemberId = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(generatedMemberId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  // Switch role tab helper
  const handleSelectRole = (newRole) => {
    setRole(newRole);
    setStatus({ loading: false, success: false, message: '', error: null });
    
    if (newRole === 'admin') {
      setMode('login');
      setStep('credentials');
    } else if (newRole === 'faculty') {
      setMode('login');
      setStep('login_credentials');
    } else {
      setMode('login');
      setStep('form');
    }
  };

  // 1. Student Handlers
  const handleStudentLogin = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, message: '', error: null });

    try {
      const res = await authService.loginStudent({
        email: studentLogin.email,
        password: studentLogin.password,
        rememberMe: studentLogin.rememberMe,
      });

      setStatus({
        loading: false,
        success: true,
        message: currentLang === 'as' ? 'ছাত্ৰ প্ৰৱেশ সফল হৈছে!' : 'Student signed in successfully!',
        error: null,
      });

      setTimeout(() => {
        onClose();
        if (onSuccessLogin) {
          onSuccessLogin(res.user);
        }
      }, 500);
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        message: '',
        error: err.message || 'Login failed. Please check your credentials.',
      });
    }
  };

  const handleStudentRegSubmit = async (e) => {
    e.preventDefault();
    if (studentReg.password !== studentReg.confirmPassword) {
      setStatus({ loading: false, success: false, message: '', error: 'Passwords do not match.' });
      return;
    }
    if (studentReg.password.length < 6) {
      setStatus({ loading: false, success: false, message: '', error: 'Password must be at least 6 characters.' });
      return;
    }

    setStatus({ loading: true, success: false, message: '', error: null });
    try {
      const res = await authService.registerStudent({
        fullName: studentReg.fullName,
        email: studentReg.email,
        password: studentReg.password,
        preferredLanguage: currentLang,
      });

      setStatus({
        loading: false,
        success: true,
        message: res.devOtp ? `OTP generated: ${res.devOtp}` : 'OTP sent to your email!',
        error: null,
      });
      setStep('otp');
      resetOtp();
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        message: '',
        error: err.message || 'Registration failed.',
      });
    }
  };

  const handleVerifyStudentOtp = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setStatus({ loading: false, success: false, message: '', error: 'Please enter all 6 digits.' });
      return;
    }

    setStatus({ loading: true, success: false, message: '', error: null });
    try {
      const res = await authService.verifyStudentOtp({
        identifier: studentReg.email,
        otp: code,
      });

      setStatus({
        loading: false,
        success: true,
        message: 'Account verified! Accessing UniMitra Portal...',
        error: null,
      });

      setTimeout(() => {
        onClose();
        if (onSuccessLogin) {
          onSuccessLogin(res.user);
        }
      }, 500);
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        message: '',
        error: err.message || 'Invalid OTP code.',
      });
    }
  };

  // 2. Faculty Handlers
  const handleFacultyRegSubmit = async (e) => {
    e.preventDefault();
    if (facultyReg.password !== facultyReg.confirmPassword) {
      setStatus({ loading: false, success: false, message: '', error: 'Passwords do not match.' });
      return;
    }
    if (facultyReg.password.length < 6) {
      setStatus({ loading: false, success: false, message: '', error: 'Password must be at least 6 characters.' });
      return;
    }

    setStatus({ loading: true, success: false, message: '', error: null });
    try {
      const res = await authService.registerFaculty({
        fullName: facultyReg.fullName,
        officialEmail: facultyReg.officialEmail,
        facultyId: facultyReg.facultyId,
        department: facultyReg.department,
        designation: facultyReg.designation,
        password: facultyReg.password,
        preferredLanguage: currentLang,
      });

      const newMemberId = res.memberId || res.user?.memberId;
      setGeneratedMemberId(newMemberId);
      setFacultyLogin((prev) => ({ ...prev, memberId: newMemberId }));
      setStatus({ loading: false, success: true, message: res.message || 'Faculty registered successfully!', error: null });
      setStep('created_id');
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        message: '',
        error: err.message || 'Faculty registration failed.',
      });
    }
  };

  const handleFacultyLoginCredentials = async (e) => {
    e.preventDefault();
    if (!facultyLogin.memberId || !facultyLogin.password) {
      setStatus({ loading: false, success: false, message: '', error: 'Please enter Member ID and Password.' });
      return;
    }

    setStatus({ loading: true, success: false, message: '', error: null });
    try {
      const res = await authService.loginFacultyCredentials({
        memberId: facultyLogin.memberId,
        password: facultyLogin.password,
      });

      setStatus({
        loading: false,
        success: true,
        message: res.devOtp ? `Credentials verified! (Dev OTP: ${res.devOtp})` : 'Credentials verified. OTP sent to registered email.',
        error: null,
      });
      setStep('login_otp');
      resetOtp();
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        message: '',
        error: err.message || 'Invalid Member ID or password.',
      });
    }
  };

  const handleVerifyFacultyOtp = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setStatus({ loading: false, success: false, message: '', error: 'Please enter all 6 digits.' });
      return;
    }

    setStatus({ loading: true, success: false, message: '', error: null });
    try {
      const res = await authService.verifyFacultyOtp({
        identifier: facultyLogin.memberId,
        otp: code,
      });

      setStatus({
        loading: false,
        success: true,
        message: 'Faculty credentials verified! Opening workspace...',
        error: null,
      });

      setTimeout(() => {
        onClose();
        if (onSuccessLogin) {
          onSuccessLogin(res.user);
        }
      }, 500);
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        message: '',
        error: err.message || 'Invalid OTP code.',
      });
    }
  };

  // 3. Admin Handlers
  const handleAdminCredentials = async (e) => {
    e.preventDefault();
    if (!adminLogin.superEmail || !adminLogin.superPassword) {
      setStatus({ loading: false, success: false, message: '', error: 'Please enter Super Email and Password.' });
      return;
    }

    setStatus({ loading: true, success: false, message: '', error: null });
    try {
      const res = await authService.loginAdminCredentials({
        email: adminLogin.superEmail,
        password: adminLogin.superPassword,
      });

      setStatus({
        loading: false,
        success: true,
        message: res.devOtp ? `Credentials accepted! (Dev OTP: ${res.devOtp})` : 'Credentials accepted. OTP sent to Super Admin email.',
        error: null,
      });
      setStep('otp');
      resetOtp();
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        message: '',
        error: err.message || 'Invalid Super Administrator credentials.',
      });
    }
  };

  const handleVerifyAdminOtp = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setStatus({ loading: false, success: false, message: '', error: 'Please enter all 6 digits.' });
      return;
    }

    setStatus({ loading: true, success: false, message: '', error: null });
    try {
      const res = await authService.verifyAdminOtp({
        identifier: adminLogin.superEmail,
        otp: code,
      });

      setStatus({
        loading: false,
        success: true,
        message: 'Super Administrator verified! Launching Admin Console...',
        error: null,
      });

      setTimeout(() => {
        onClose();
        if (onSuccessLogin) {
          onSuccessLogin(res.user);
        }
      }, 500);
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        message: '',
        error: err.message || 'Invalid OTP code.',
      });
    }
  };

  // 4. Resend OTP Handler
  const handleResendOtp = async () => {
    if (!canResend) return;
    setStatus({ loading: true, success: false, message: '', error: null });
    try {
      const identifier = role === 'admin' 
        ? adminLogin.superEmail 
        : (role === 'faculty' ? facultyLogin.memberId : studentReg.email);
      const res = await authService.resendOtp({ identifier, role });
      resetOtp();
      setStatus({
        loading: false,
        success: true,
        message: res.devOtp ? `Fresh OTP generated: ${res.devOtp}` : (res.message || 'New OTP code sent!'),
        error: null,
      });
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        message: '',
        error: err.message || 'Failed to resend OTP.',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity duration-200" 
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-[#FAF8FF] dark:bg-black border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 rounded-3xl shadow-2xl z-10 overflow-hidden my-auto max-h-[92vh] flex flex-col transition-all duration-200">
        
        {/* Header with Brand & Close Button */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#E0D4FD]/25 dark:bg-black border-b border-[#73A5CA]/40 dark:border-[#1C82AD]/40 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#6D28D9] to-[#E0D4FD] flex items-center justify-center text-white shadow-xs">
              <BuildingLibraryIcon className="w-5 h-5 text-[#FAF8FF]" />
            </div>
            <div>
              <span className="text-lg font-black text-[#000000] dark:text-[#FFFFFF] leading-tight">
                Uni<span className="text-[#8F00FF]">Mitra</span>
              </span>
              <span className="text-[11px] text-[#000000]/70 dark:text-[#FFFFFF]/80 block font-semibold leading-none">
                {role === 'student' ? 'Student Portal' : (role === 'faculty' ? 'Faculty Member Portal' : 'Admin Console')}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#000000]/70 hover:text-[#000000] dark:text-[#FFFFFF]/80 dark:hover:text-[#FAF8FF] hover:bg-[#E0D4FD]/30 dark:hover:bg-[#1A0F33] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Role Switcher Tabs */}
        <div className="px-6 pt-4 shrink-0 space-y-3">
          <div className="flex bg-[#E0D4FD]/30 dark:bg-black p-1 rounded-2xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-xs">
            <button
              type="button"
              onClick={() => handleSelectRole('student')}
              className={`flex-1 py-2 font-black rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                role === 'student'
                  ? 'bg-[#6D28D9] text-white shadow-xs'
                  : 'text-[#000000] dark:text-[#FFFFFF]/80'
              }`}
            >
              <AcademicCapIcon className="w-3.5 h-3.5" />
              <span>Student</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectRole('faculty')}
              className={`flex-1 py-2 font-black rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                role === 'faculty'
                  ? 'bg-[#6D28D9] text-white shadow-xs'
                  : 'text-[#000000] dark:text-[#FFFFFF]/80'
              }`}
            >
              <IdentificationIcon className="w-3.5 h-3.5" />
              <span>Faculty</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectRole('admin')}
              className={`flex-1 py-2 font-black rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                role === 'admin'
                  ? 'bg-[#6D28D9] text-white shadow-xs'
                  : 'text-[#000000] dark:text-[#FFFFFF]/80'
              }`}
            >
              <ShieldCheckIcon className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>

          {/* Mode Switcher: Sign In vs Register (for Student & Faculty) */}
          {role !== 'admin' && step !== 'created_id' && step !== 'otp' && step !== 'login_otp' && (
            <div className="flex bg-white dark:bg-black p-1 rounded-xl border border-[#E0D4FD]/70 dark:border-[#3B2868]/70 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setStep(role === 'faculty' ? 'login_credentials' : 'form');
                  setStatus({ loading: false, success: false, message: '', error: null });
                }}
                className={`flex-1 py-1.5 font-black rounded-lg transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-[#FFE9A9] dark:bg-[#141414] text-[#000000] dark:text-[#FFFFFF]'
                    : 'text-[#000000]/70 dark:text-[#FFFFFF]/80'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setStep('form');
                  setStatus({ loading: false, success: false, message: '', error: null });
                }}
                className={`flex-1 py-1.5 font-black rounded-lg transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-[#FFE9A9] dark:bg-[#141414] text-[#000000] dark:text-[#FFFFFF]'
                    : 'text-[#000000]/70 dark:text-[#FFFFFF]/80'
                }`}
              >
                Register
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {/* Status Banner */}
          {status.success && status.message && (
            <div className="p-3 rounded-2xl bg-[#E0D4FD]/40 dark:bg-black border-2 border-[#FF933E]/50 dark:border-[#03C988]/50 text-center space-y-0.5">
              <div className="flex items-center justify-center space-x-1.5 text-[#000000] dark:text-[#FFFFFF] font-black text-xs sm:text-sm">
                <CheckCircleIcon className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>{status.message}</span>
              </div>
            </div>
          )}

          {status.error && (
            <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-900 text-xs text-red-700 dark:text-red-300 font-bold">
              {status.error}
            </div>
          )}

          {/* ========================================================= */}
          {/* 1. STUDENT FLOW                                           */}
          {/* ========================================================= */}
          {role === 'student' && (
            <>
              {mode === 'login' && (
                <form onSubmit={handleStudentLogin} className="space-y-3">
                  <div>
                    <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                      Student Email <span className="text-[#6D28D9]">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <EnvelopeIcon className="w-4 h-4 text-[#000000]/70 absolute left-3 pointer-events-none" />
                      <input
                        type="email"
                        required
                        placeholder="student@university.ac.in"
                        value={studentLogin.email}
                        onChange={(e) => setStudentLogin({ ...studentLogin, email: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-white dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#FF933E] dark:focus:border-[#03C988]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                      Password <span className="text-[#6D28D9]">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <LockClosedIcon className="w-4 h-4 text-[#000000]/70 absolute left-3 pointer-events-none" />
                      <input
                        type={showPasswords.studentLogin ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={studentLogin.password}
                        onChange={(e) => setStudentLogin({ ...studentLogin, password: e.target.value })}
                        className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-white dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#FF933E] dark:focus:border-[#03C988]"
                      />
                      <button
                        type="button"
                        onClick={() => toggleShowPassword('studentLogin')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#000000]/70 hover:text-[#000000] dark:text-[#FFFFFF]/80 dark:hover:text-[#FAF8FF] transition-colors cursor-pointer"
                        title={showPasswords.studentLogin ? "Hide password" : "Show password"}
                        aria-label={showPasswords.studentLogin ? "Hide password" : "Show password"}
                      >
                        {showPasswords.studentLogin ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={status.loading}
                    className="w-full py-3 px-4 rounded-xl font-black text-xs sm:text-sm text-white bg-[#4C1D95] hover:bg-[#3B2868] transition-all cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    {status.loading ? 'Signing In...' : 'Sign In as Student'}
                  </button>
                </form>
              )}

              {mode === 'register' && step === 'form' && (
                <form onSubmit={handleStudentRegSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                      Full Name <span className="text-[#6D28D9]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Partha Pratim Nath"
                      value={studentReg.fullName}
                      onChange={(e) => setStudentReg({ ...studentReg, fullName: e.target.value })}
                      className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-white dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#FF933E] dark:focus:border-[#03C988]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                      Email Address <span className="text-[#6D28D9]">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <EnvelopeIcon className="w-4 h-4 text-[#000000]/70 absolute left-3 pointer-events-none" />
                      <input
                        type="email"
                        required
                        placeholder="student@gmail.com"
                        value={studentReg.email}
                        onChange={(e) => setStudentReg({ ...studentReg, email: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-white dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#FF933E] dark:focus:border-[#03C988]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                        Password <span className="text-[#6D28D9]">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type={showPasswords.studentReg ? "text" : "password"}
                          required
                          placeholder="Min 6 chars"
                          value={studentReg.password}
                          onChange={(e) => setStudentReg({ ...studentReg, password: e.target.value })}
                          className="w-full pl-3 pr-8 py-2.5 text-xs sm:text-sm rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-white dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#FF933E] dark:focus:border-[#03C988]"
                        />
                        <button
                          type="button"
                          onClick={() => toggleShowPassword('studentReg')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#000000]/70 hover:text-[#000000] dark:text-[#FFFFFF]/80 dark:hover:text-[#FAF8FF] transition-colors cursor-pointer"
                          title={showPasswords.studentReg ? "Hide password" : "Show password"}
                          aria-label={showPasswords.studentReg ? "Hide password" : "Show password"}
                        >
                          {showPasswords.studentReg ? <EyeSlashIcon className="w-3.5 h-3.5" /> : <EyeIcon className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                        Confirm <span className="text-[#6D28D9]">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type={showPasswords.studentRegConfirm ? "text" : "password"}
                          required
                          placeholder="Re-enter"
                          value={studentReg.confirmPassword}
                          onChange={(e) => setStudentReg({ ...studentReg, confirmPassword: e.target.value })}
                          className="w-full pl-3 pr-8 py-2.5 text-xs sm:text-sm rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-white dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#FF933E] dark:focus:border-[#03C988]"
                        />
                        <button
                          type="button"
                          onClick={() => toggleShowPassword('studentRegConfirm')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#000000]/70 hover:text-[#000000] dark:text-[#FFFFFF]/80 dark:hover:text-[#FAF8FF] transition-colors cursor-pointer"
                          title={showPasswords.studentRegConfirm ? "Hide password" : "Show password"}
                          aria-label={showPasswords.studentRegConfirm ? "Hide password" : "Show password"}
                        >
                          {showPasswords.studentRegConfirm ? <EyeSlashIcon className="w-3.5 h-3.5" /> : <EyeIcon className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={status.loading}
                    className="w-full py-3 px-4 rounded-xl font-black text-xs sm:text-sm text-white bg-[#4C1D95] hover:bg-[#3B2868] transition-all cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    Send 6-Digit OTP & Continue
                  </button>
                </form>
              )}

              {mode === 'register' && step === 'otp' && (
                <div className="text-center space-y-4">
                  <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80">
                    Enter 6-digit code sent to <strong className="text-[#000000] dark:text-[#FFFFFF]">{studentReg.email}</strong>
                  </p>

                  <form onSubmit={handleVerifyStudentOtp} className="space-y-4">
                    <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (otpRefs.current[idx] = el)}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          className="w-10 h-12 text-center font-black text-base rounded-xl border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-white dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#FF933E] dark:focus:border-[#03C988]"
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80">
                      <button
                        type="button"
                        onClick={() => setStep('form')}
                        className="text-[#6D28D9] font-black hover:underline cursor-pointer"
                      >
                        Edit Details
                      </button>
                      {canResend ? (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          className="text-[#FF933E] dark:text-[#03C988] font-black hover:underline cursor-pointer"
                        >
                          Resend OTP
                        </button>
                      ) : (
                        <span>{timer}s remaining</span>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={status.loading}
                      className="w-full py-3 px-4 rounded-xl font-black text-xs sm:text-sm text-white bg-[#4C1D95] hover:bg-[#3B2868] transition-all cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      {status.loading ? 'Verifying...' : 'Verify OTP & Complete Registration'}
                    </button>
                  </form>
                </div>
              )}
            </>
          )}

          {/* ========================================================= */}
          {/* 2. FACULTY MEMBER FLOW                                    */}
          {/* ========================================================= */}
          {role === 'faculty' && (
            <>
              {mode === 'login' && step === 'login_credentials' && (
                <form onSubmit={handleFacultyLoginCredentials} className="space-y-3">
                  <div>
                    <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                      Unique Faculty Member ID <span className="text-[#6D28D9]">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <IdentificationIcon className="w-4 h-4 text-[#000000]/70 absolute left-3 pointer-events-none" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. UM-FAC-7821"
                        value={facultyLogin.memberId}
                        onChange={(e) => setFacultyLogin({ ...facultyLogin, memberId: e.target.value.toUpperCase() })}
                        className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm font-mono font-bold tracking-wider rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-white dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#FF933E] dark:focus:border-[#03C988]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                      Password <span className="text-[#6D28D9]">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <LockClosedIcon className="w-4 h-4 text-[#000000]/70 absolute left-3 pointer-events-none" />
                      <input
                        type={showPasswords.facultyLogin ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={facultyLogin.password}
                        onChange={(e) => setFacultyLogin({ ...facultyLogin, password: e.target.value })}
                        className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-white dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#FF933E] dark:focus:border-[#03C988]"
                      />
                      <button
                        type="button"
                        onClick={() => toggleShowPassword('facultyLogin')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#000000]/70 hover:text-[#000000] dark:text-[#FFFFFF]/80 dark:hover:text-[#FAF8FF] transition-colors cursor-pointer"
                        title={showPasswords.facultyLogin ? "Hide password" : "Show password"}
                        aria-label={showPasswords.facultyLogin ? "Hide password" : "Show password"}
                      >
                        {showPasswords.facultyLogin ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={status.loading}
                    className="w-full py-3 px-4 rounded-xl font-black text-xs sm:text-sm text-white bg-[#3B2868] hover:bg-[#5b7357] transition-all cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    Send OTP to Registered Email
                  </button>
                </form>
              )}

              {mode === 'login' && step === 'login_otp' && (
                <div className="text-center space-y-4">
                  <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80">
                    Enter 6-digit OTP sent to email associated with Member ID <strong className="text-[#000000] dark:text-[#FFFFFF]">{facultyLogin.memberId}</strong>
                  </p>

                  <form onSubmit={handleVerifyFacultyOtp} className="space-y-4">
                    <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (otpRefs.current[idx] = el)}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          className="w-10 h-12 text-center font-black text-base rounded-xl border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-white dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#3B2868]"
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80">
                      <button
                        type="button"
                        onClick={() => setStep('login_credentials')}
                        className="text-[#6D28D9] font-black hover:underline cursor-pointer"
                      >
                        Change ID
                      </button>
                      {canResend ? (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          className="text-[#FF933E] dark:text-[#03C988] font-black hover:underline cursor-pointer"
                        >
                          Resend OTP
                        </button>
                      ) : (
                        <span>{timer}s remaining</span>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={status.loading}
                      className="w-full py-3 px-4 rounded-xl font-black text-xs sm:text-sm text-[#000000] bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] hover:bg-[#d6be73] transition-all cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      Verify OTP & Access Portal
                    </button>
                  </form>
                </div>
              )}

              {mode === 'register' && step === 'form' && (
                <form onSubmit={handleFacultyRegSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                        Full Name <span className="text-[#6D28D9]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Dr. Full Name"
                        value={facultyReg.fullName}
                        onChange={(e) => setFacultyReg({ ...facultyReg, fullName: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-white dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#FF933E] dark:focus:border-[#03C988]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                        Faculty ID <span className="text-[#6D28D9]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="GU-FAC-2024"
                        value={facultyReg.facultyId}
                        onChange={(e) => setFacultyReg({ ...facultyReg, facultyId: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-white dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#FF933E] dark:focus:border-[#03C988]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                      Official University Email <span className="text-[#6D28D9]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="faculty@gauhati.ac.in"
                      value={facultyReg.officialEmail}
                      onChange={(e) => setFacultyReg({ ...facultyReg, officialEmail: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-white dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#FF933E] dark:focus:border-[#03C988]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                      Member / Personal Email <span className="text-[#6D28D9]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="personal.email@gmail.com"
                      value={facultyReg.memberEmail}
                      onChange={(e) => setFacultyReg({ ...facultyReg, memberEmail: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-white dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#FF933E] dark:focus:border-[#03C988]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                        Department <span className="text-[#6D28D9]">*</span>
                      </label>
                      <select
                        value={facultyReg.department}
                        onChange={(e) => setFacultyReg({ ...facultyReg, department: e.target.value })}
                        className="w-full px-2 py-2 text-xs rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-white dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#FF933E] dark:focus:border-[#03C988]"
                      >
                        {departmentOptions.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                        Designation <span className="text-[#6D28D9]">*</span>
                      </label>
                      <select
                        value={facultyReg.designation}
                        onChange={(e) => setFacultyReg({ ...facultyReg, designation: e.target.value })}
                        className="w-full px-2 py-2 text-xs rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-white dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#FF933E] dark:focus:border-[#03C988]"
                      >
                        {designationOptions.map((desig) => (
                          <option key={desig} value={desig}>{desig}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                        Password <span className="text-[#6D28D9]">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type={showPasswords.facultyReg ? "text" : "password"}
                          required
                          placeholder="••••••••"
                          value={facultyReg.password}
                          onChange={(e) => setFacultyReg({ ...facultyReg, password: e.target.value })}
                          className="w-full pl-3 pr-8 py-2 text-xs rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-white dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#FF933E] dark:focus:border-[#03C988]"
                        />
                        <button
                          type="button"
                          onClick={() => toggleShowPassword('facultyReg')}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-[#000000]/70 hover:text-[#000000] dark:text-[#FFFFFF]/80 dark:hover:text-[#FAF8FF] transition-colors cursor-pointer"
                          title={showPasswords.facultyReg ? "Hide password" : "Show password"}
                          aria-label={showPasswords.facultyReg ? "Hide password" : "Show password"}
                        >
                          {showPasswords.facultyReg ? <EyeSlashIcon className="w-3.5 h-3.5" /> : <EyeIcon className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                        Confirm <span className="text-[#6D28D9]">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type={showPasswords.facultyRegConfirm ? "text" : "password"}
                          required
                          placeholder="••••••••"
                          value={facultyReg.confirmPassword}
                          onChange={(e) => setFacultyReg({ ...facultyReg, confirmPassword: e.target.value })}
                          className="w-full pl-3 pr-8 py-2 text-xs rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-white dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#FF933E] dark:focus:border-[#03C988]"
                        />
                        <button
                          type="button"
                          onClick={() => toggleShowPassword('facultyRegConfirm')}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-[#000000]/70 hover:text-[#000000] dark:text-[#FFFFFF]/80 dark:hover:text-[#FAF8FF] transition-colors cursor-pointer"
                          title={showPasswords.facultyRegConfirm ? "Hide password" : "Show password"}
                          aria-label={showPasswords.facultyRegConfirm ? "Hide password" : "Show password"}
                        >
                          {showPasswords.facultyRegConfirm ? <EyeSlashIcon className="w-3.5 h-3.5" /> : <EyeIcon className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={status.loading}
                    className="w-full py-3 px-4 rounded-xl font-black text-xs sm:text-sm text-[#000000] bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] hover:bg-[#d6be73] transition-all cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    Register & Generate Unique Member ID
                  </button>
                </form>
              )}

              {mode === 'register' && step === 'created_id' && (
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#3B2868] text-[#FAF8FF] mx-auto flex items-center justify-center font-black">
                    <CheckCircleIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#000000] dark:text-[#FFFFFF]">
                      Faculty Member ID Created!
                    </h3>
                    <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80 mt-0.5">
                      Please copy your Member ID to sign in.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAF8FF] dark:bg-black border-2 border-dashed border-[#FF933E]/50 dark:border-[#03C988]/50 dark:border-[#FAF8FF] flex items-center justify-between">
                    <span className="font-mono text-xl font-black tracking-widest text-[#000000] dark:text-[#FFFFFF]">
                      {generatedMemberId}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyMemberId}
                      className="p-1.5 rounded-lg bg-white dark:bg-black border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 cursor-pointer"
                    >
                      {copiedId ? <CheckIcon className="w-4 h-4 text-green-600" /> : <DocumentDuplicateIcon className="w-4 h-4 text-[#6D28D9]" />}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setStep('login_credentials');
                      setStatus({ loading: false, success: false, message: '', error: null });
                    }}
                    className="w-full py-3 px-4 rounded-xl font-black text-xs sm:text-sm text-white bg-[#4C1D95] hover:bg-[#3B2868] transition-all cursor-pointer shadow-xs"
                  >
                    Sign In with Member ID & OTP
                  </button>
                </div>
              )}
            </>
          )}

          {/* ========================================================= */}
          {/* 3. ADMIN FLOW (SUPER USER)                                */}
          {/* ========================================================= */}
          {role === 'admin' && (
            <>
              {step === 'credentials' && (
                <form onSubmit={handleAdminCredentials} className="space-y-3">
                  <div>
                    <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                      Super User Name <span className="text-[#6D28D9]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="System Administrator"
                      value={adminLogin.superName}
                      onChange={(e) => setAdminLogin({ ...adminLogin, superName: e.target.value })}
                      className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-white dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#FF933E] dark:focus:border-[#03C988]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                      Super Email <span className="text-[#6D28D9]">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <EnvelopeIcon className="w-4 h-4 text-[#000000]/70 absolute left-3 pointer-events-none" />
                      <input
                        type="email"
                        required
                        placeholder="admin@unimitra.edu.in"
                        value={adminLogin.superEmail}
                        onChange={(e) => setAdminLogin({ ...adminLogin, superEmail: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-white dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#FF933E] dark:focus:border-[#03C988]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                      Super Password <span className="text-[#6D28D9]">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <LockClosedIcon className="w-4 h-4 text-[#000000]/70 absolute left-3 pointer-events-none" />
                      <input
                        type={showPasswords.adminLogin ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={adminLogin.superPassword}
                        onChange={(e) => setAdminLogin({ ...adminLogin, superPassword: e.target.value })}
                        className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-white dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#FF933E] dark:focus:border-[#03C988]"
                      />
                      <button
                        type="button"
                        onClick={() => toggleShowPassword('adminLogin')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#000000]/70 hover:text-[#000000] dark:text-[#FFFFFF]/80 dark:hover:text-[#FAF8FF] transition-colors cursor-pointer"
                        title={showPasswords.adminLogin ? "Hide password" : "Show password"}
                        aria-label={showPasswords.adminLogin ? "Hide password" : "Show password"}
                      >
                        {showPasswords.adminLogin ? <EyeSlashIcon className="w-4 h-4 text-[#FAF8FF]" /> : <EyeIcon className="w-4 h-4 text-[#FAF8FF]" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={status.loading}
                    className="w-full py-3 px-4 rounded-xl font-black text-xs sm:text-sm text-[#FAF8FF] bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-[#000000] border border-[#3B2868] transition-all cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    Send Super Admin OTP
                  </button>
                </form>
              )}

              {step === 'otp' && (
                <div className="text-center space-y-4">
                  <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80">
                    Enter 6-digit OTP sent to super email <strong className="text-[#000000] dark:text-[#FFFFFF]">{adminLogin.superEmail}</strong>
                  </p>

                  <form onSubmit={handleVerifyAdminOtp} className="space-y-4">
                    <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (otpRefs.current[idx] = el)}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          className="w-10 h-12 text-center font-black text-base rounded-xl border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-white dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#3B2868]"
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80">
                      <button
                        type="button"
                        onClick={() => setStep('credentials')}
                        className="text-[#6D28D9] font-black hover:underline cursor-pointer"
                      >
                        Change Super Email
                      </button>
                      {canResend ? (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          className="text-[#FF933E] dark:text-[#03C988] font-black hover:underline cursor-pointer"
                        >
                          Resend OTP
                        </button>
                      ) : (
                        <span>{timer}s remaining</span>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={status.loading}
                      className="w-full py-3 px-4 rounded-xl font-black text-xs sm:text-sm text-[#000000] bg-[#FAF8FF] hover:bg-[#C4B5FD] transition-all cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      Verify OTP & Open Admin Console
                    </button>
                  </form>
                </div>
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
};
