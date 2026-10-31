import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  BuildingLibraryIcon, 
  AcademicCapIcon, 
  ShieldCheckIcon, 
  IdentificationIcon,
  EnvelopeIcon,
  LockClosedIcon,
  KeyIcon,
  CheckCircleIcon,
  CheckIcon,
  DocumentDuplicateIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  UserGroupIcon,
  ClockIcon,
  EyeIcon,
  EyeSlashIcon
} from '../../components/common/Icons';

export const AuthPortal = ({ 
  initialRole = 'student', 
  initialMode = 'login', 
  currentLang = 'en', 
  onSuccessLogin,
  onCancel
}) => {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');
  const modeParam = searchParams.get('mode');

  // Active role tab: 'student' | 'faculty' | 'admin'
  const [activeRole, setActiveRole] = useState(
    roleParam && ['student', 'faculty', 'admin'].includes(roleParam) ? roleParam : initialRole
  );
  
  // Active mode per role: 'login' | 'register'
  const [activeMode, setActiveMode] = useState(
    modeParam && ['login', 'register'].includes(modeParam) ? modeParam : initialMode
  );

  useEffect(() => {
    if (roleParam && ['student', 'faculty', 'admin'].includes(roleParam)) {
      setActiveRole(roleParam);
    }
    if (modeParam && ['login', 'register'].includes(modeParam)) {
      setActiveMode(modeParam);
    }
  }, [roleParam, modeParam]);

  // Flow steps for multi-step verification:
  // Student: 'form' | 'otp'
  // Faculty: 'form' | 'created_id' | 'login_credentials' | 'login_otp'
  // Admin: 'credentials' | 'otp'
  const [step, setStep] = useState('form');

  // Generated Unique Member ID for newly registered faculty member
  const [generatedMemberId, setGeneratedMemberId] = useState('');
  const [copiedId, setCopiedId] = useState(false);

  // Common OTP state (6 separate digits)
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);

  // Resend countdown timer (60 seconds)
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Feedback & Loading status
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
    superPassword: '',
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

  // Reset steps and status whenever switching role or mode
  useEffect(() => {
    setActiveRole(initialRole);
    setActiveMode(initialMode);
    setStep(initialMode === 'register' ? 'form' : (initialRole === 'admin' ? 'credentials' : (initialRole === 'faculty' ? 'login_credentials' : 'form')));
    setStatus({ loading: false, success: false, message: '', error: null });
  }, [initialRole, initialMode]);

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

  // Handle individual OTP digit changes
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-advance to next box if character was entered
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

  // Copy Faculty Member ID helper
  const handleCopyMemberId = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(generatedMemberId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  // =========================================================================
  // 1. STUDENT AUTH HANDLERS
  // =========================================================================

  // Student Sign In
  const handleStudentLogin = (e) => {
    e.preventDefault();
    if (!studentLogin.email || !studentLogin.password) {
      setStatus({ loading: false, success: false, message: '', error: 'Please enter both email and password.' });
      return;
    }

    setStatus({ loading: true, success: false, message: '', error: null });

    setTimeout(() => {
      setStatus({
        loading: false,
        success: true,
        message: currentLang === 'as' 
          ? 'ছাত্ৰ প্ৰৱেশ সফল হৈছে! সহায়ক প’ৰ্টেল খুলি আছে...' 
          : 'Student sign in successful! Accessing UniMitra Portal...',
        error: null,
      });

      setTimeout(() => {
        if (onSuccessLogin) {
          onSuccessLogin({
            name: studentLogin.email.split('@')[0],
            email: studentLogin.email,
            role: 'Student',
            department: 'Higher Education'
          });
        }
      }, 700);
    }, 600);
  };

  // Student Register: Step 1 (Form submit -> Trigger OTP)
  const handleStudentRegSubmit = (e) => {
    e.preventDefault();
    if (studentReg.password !== studentReg.confirmPassword) {
      setStatus({ loading: false, success: false, message: '', error: 'Passwords do not match.' });
      return;
    }
    if (studentReg.password.length < 6) {
      setStatus({ loading: false, success: false, message: '', error: 'Password must be at least 6 characters long.' });
      return;
    }

    setStatus({ loading: true, success: false, message: '', error: null });

    // Simulate sending 6-digit verification code to student's email
    setTimeout(() => {
      setStatus({ loading: false, success: false, message: '', error: null });
      setStep('otp');
      resetOtp();
    }, 500);
  };

  // Student Register: Step 2 (Verify OTP)
  const handleVerifyStudentOtp = (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setStatus({ loading: false, success: false, message: '', error: 'Please enter all 6 digits of the OTP.' });
      return;
    }

    setStatus({ loading: true, success: false, message: '', error: null });

    setTimeout(() => {
      setStatus({
        loading: false,
        success: true,
        message: currentLang === 'as'
          ? 'পঞ্জীয়ন আৰু পৰীক্ষণ সফল হৈছে! স্বাগতম জনাইছোঁ।'
          : 'Registration & email verified successfully! Welcome to UniMitra.',
        error: null,
      });

      setTimeout(() => {
        if (onSuccessLogin) {
          onSuccessLogin({
            name: studentReg.fullName,
            email: studentReg.email,
            role: 'Student',
            department: 'Undergraduate / Postgraduate Studies'
          });
        }
      }, 800);
    }, 600);
  };

  // =========================================================================
  // 2. FACULTY MEMBER AUTH HANDLERS
  // =========================================================================

  // Faculty Register: Step 1 (Form submit -> Generate Unique Member ID)
  const handleFacultyRegSubmit = (e) => {
    e.preventDefault();
    if (facultyReg.password !== facultyReg.confirmPassword) {
      setStatus({ loading: false, success: false, message: '', error: 'Passwords do not match.' });
      return;
    }
    if (facultyReg.password.length < 6) {
      setStatus({ loading: false, success: false, message: '', error: 'Password must be at least 6 characters long.' });
      return;
    }

    setStatus({ loading: true, success: false, message: '', error: null });

    setTimeout(() => {
      // Generate a unique institutional member ID: UM-FAC- + 4 random digits
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      const newMemberId = `UM-FAC-${randomCode}`;
      setGeneratedMemberId(newMemberId);
      
      // Auto-prefill the login ID field so the member can easily sign in
      setFacultyLogin((prev) => ({ ...prev, memberId: newMemberId }));

      setStatus({ loading: false, success: true, message: '', error: null });
      setStep('created_id');
    }, 700);
  };

  // Faculty Sign In: Step 1 (Member ID + Password submit -> Trigger OTP)
  const handleFacultyLoginCredentials = (e) => {
    e.preventDefault();
    if (!facultyLogin.memberId || !facultyLogin.password) {
      setStatus({ loading: false, success: false, message: '', error: 'Please provide both your Member ID and Password.' });
      return;
    }

    setStatus({ loading: true, success: false, message: '', error: null });

    // Simulate OTP sent to official/registered faculty email
    setTimeout(() => {
      setStatus({ loading: false, success: false, message: '', error: null });
      setStep('login_otp');
      resetOtp();
    }, 600);
  };

  // Faculty Sign In: Step 2 (Verify OTP)
  const handleVerifyFacultyOtp = (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setStatus({ loading: false, success: false, message: '', error: 'Please enter all 6 digits of the OTP.' });
      return;
    }

    setStatus({ loading: true, success: false, message: '', error: null });

    setTimeout(() => {
      setStatus({
        loading: false,
        success: true,
        message: currentLang === 'as'
          ? 'অধ্যাপক প্ৰৱেশ সফল হৈছে! বিশ্ববিদ্যালয় প’ৰ্টেল খুলি আছে...'
          : 'Faculty verification successful! Loading institutional workspace...',
        error: null,
      });

      setTimeout(() => {
        if (onSuccessLogin) {
          onSuccessLogin({
            name: facultyReg.fullName || 'Prof. Faculty Member',
            email: facultyReg.officialEmail || `${facultyLogin.memberId.toLowerCase()}@unimitra.edu.in`,
            role: 'Faculty Member',
            department: facultyReg.department || 'Academic Affairs',
            designation: facultyReg.designation || 'Faculty Member',
            memberId: facultyLogin.memberId,
            facultyId: facultyReg.facultyId || 'FAC-INST'
          });
        }
      }, 800);
    }, 600);
  };

  // =========================================================================
  // 3. SUPER ADMIN AUTH HANDLERS
  // =========================================================================

  // Admin Sign In: Step 1 (Super credentials -> Trigger OTP to super email)
  const handleAdminCredentials = (e) => {
    e.preventDefault();
    if (!adminLogin.superEmail || !adminLogin.superPassword) {
      setStatus({ loading: false, success: false, message: '', error: 'Please enter Super Email and Password.' });
      return;
    }

    setStatus({ loading: true, success: false, message: '', error: null });

    // Simulate OTP dispatch to super email
    setTimeout(() => {
      setStatus({ loading: false, success: false, message: '', error: null });
      setStep('otp');
      resetOtp();
    }, 600);
  };

  // Admin Sign In: Step 2 (Verify Super Admin OTP)
  const handleVerifyAdminOtp = (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setStatus({ loading: false, success: false, message: '', error: 'Please enter all 6 digits of the OTP.' });
      return;
    }

    setStatus({ loading: true, success: false, message: '', error: null });

    setTimeout(() => {
      setStatus({
        loading: false,
        success: true,
        message: currentLang === 'as'
          ? 'প্ৰশাসক সুৰক্ষিত প্ৰৱেশ সফল হৈছে! Admin Console খুলি আছে...'
          : 'Super Administrator verified! Opening Knowledge Base Console...',
        error: null,
      });

      setTimeout(() => {
        if (onSuccessLogin) {
          onSuccessLogin({
            name: adminLogin.superName || 'Super Administrator',
            email: adminLogin.superEmail,
            role: 'Admin',
            department: 'Institutional Governance'
          });
        }
      }, 700);
    }, 600);
  };

  // Switch Role tab helper
  const handleSelectRole = (newRole) => {
    setActiveRole(newRole);
    setStatus({ loading: false, success: false, message: '', error: null });
    
    if (newRole === 'admin') {
      setActiveMode('login');
      setStep('credentials');
    } else if (newRole === 'faculty') {
      setActiveMode('login');
      setStep('login_credentials');
    } else {
      setActiveMode('login');
      setStep('form');
    }
  };

  return (
    <div className="bg-transparent relative z-10 min-h-screen text-[#0F172A] dark:text-[#FAF8FF] py-12 px-4 sm:px-6 lg:px-10 xl:px-12 transition-colors duration-200">
      <div className="w-full max-w-6xl mx-auto space-y-8">

        {/* Back / Cancel button if provided */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="inline-flex items-center space-x-2 text-xs sm:text-sm font-black text-[#555375] dark:text-[#C4B5FD] hover:text-[#0F172A] dark:hover:text-[#FAF8FF] transition-colors cursor-pointer"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>{currentLang === 'as' ? 'মূল পৃষ্ঠালৈ উভতি যাওক' : 'Back to Home'}</span>
          </button>
        )}

        {/* Top Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-gradient-to-tr from-[#6D28D9] to-[#E0D4FD] text-white shadow-md border-2 border-[#6D28D9]/40">
            <BuildingLibraryIcon className="w-8 h-8 text-[#FAF8FF]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] dark:text-[#FAF8FF] tracking-tight">
            Uni<span className="text-[#6D28D9] dark:text-[#C4B5FD]">Mitra</span> Institutional Portals
          </h1>
          <p className="text-xs sm:text-sm text-[#555375] dark:text-[#C4B5FD] max-w-xl mx-auto font-medium">
            {currentLang === 'as'
              ? 'অসমৰ উচ্চ শিক্ষা প্ৰতিষ্ঠানসমূহৰ বাবে নিৰ্দিষ্ট ছাত্ৰ, অধ্যাপক আৰু প্ৰশাসনিক প্ৰৱেশদ্বাৰ।'
              : 'Dedicated institutional authentication portals for Students, Faculty Members, and System Administrators across Assam.'}
          </p>
        </div>

        {/* =================================================================== */}
        {/* ROLE SELECTOR CARDS: 3 DISTINCT PORTALS                             */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Student Portal */}
          <button
            type="button"
            onClick={() => handleSelectRole('student')}
            className={`p-5 rounded-3xl border-2 text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              activeRole === 'student'
                ? 'bg-white dark:bg-[#150F2C] border-[#6D28D9] dark:border-[#FAF8FF] shadow-md scale-[1.02]'
                : 'bg-white/60 dark:bg-[#150F2C]/50 border-[#E0D4FD] dark:border-[#3B2868] hover:border-[#6D28D9]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#6D28D9] text-white flex items-center justify-center font-black">
                  <AcademicCapIcon className="w-5 h-5 text-[#FAF8FF]" />
                </div>
                {activeRole === 'student' && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#6D28D9] text-white">
                    Active
                  </span>
                )}
              </div>
              <h3 className="text-base font-black text-[#0F172A] dark:text-[#FAF8FF]">
                {currentLang === 'as' ? 'ছাত্ৰ-ছাত্ৰী প’ৰ্টেল' : 'Student Portal'}
              </h3>
              <p className="text-xs text-[#555375] dark:text-[#C4B5FD] mt-1 line-clamp-2">
                {currentLang === 'as'
                  ? 'ই-মেইল আৰু পাছৱৰ্ডৰ সৈতে পঞ্জীয়ন আৰু OTP পৰীক্ষণ।'
                  : 'Email & password sign in with 6-digit email OTP verification on registration.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E0D4FD]/40 dark:border-[#3B2868]/40 flex items-center justify-between text-[11px] font-bold text-[#6D28D9] dark:text-[#FAF8FF]">
              <span>Sign In / Register</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* Card 2: Faculty Member Portal */}
          <button
            type="button"
            onClick={() => handleSelectRole('faculty')}
            className={`p-5 rounded-3xl border-2 text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              activeRole === 'faculty'
                ? 'bg-white dark:bg-[#150F2C] border-[#6D28D9] dark:border-[#FAF8FF] shadow-md scale-[1.02]'
                : 'bg-white/60 dark:bg-[#150F2C]/50 border-[#E0D4FD] dark:border-[#3B2868] hover:border-[#6D28D9]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#3B2868] text-[#FAF8FF] flex items-center justify-center font-black">
                  <IdentificationIcon className="w-5 h-5" />
                </div>
                {activeRole === 'faculty' && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#3B2868] text-[#FAF8FF]">
                    Active
                  </span>
                )}
              </div>
              <h3 className="text-base font-black text-[#0F172A] dark:text-[#FAF8FF]">
                {currentLang === 'as' ? 'অধ্যাপক প’ৰ্টেল' : 'Faculty Member Portal'}
              </h3>
              <p className="text-xs text-[#555375] dark:text-[#C4B5FD] mt-1 line-clamp-2">
                {currentLang === 'as'
                  ? 'বিশ্ববিদ্যালয় ই-মেইল, পদবীৰ সৈতে পঞ্জীয়ন কৰি Unique Member ID আৰু OTP ৰে প্ৰৱেশ।'
                  : 'Register with official university email to generate a Unique Member ID; login with Member ID + OTP.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E0D4FD]/40 dark:border-[#3B2868]/40 flex items-center justify-between text-[11px] font-bold text-[#6D28D9] dark:text-[#FAF8FF]">
              <span>Member ID + OTP Access</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* Card 3: Admin Portal (Super User) */}
          <button
            type="button"
            onClick={() => handleSelectRole('admin')}
            className={`p-5 rounded-3xl border-2 text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              activeRole === 'admin'
                ? 'bg-white dark:bg-[#150F2C] border-[#6D28D9] dark:border-[#FAF8FF] shadow-md scale-[1.02]'
                : 'bg-white/60 dark:bg-[#150F2C]/50 border-[#E0D4FD] dark:border-[#3B2868] hover:border-[#6D28D9]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0F172A] text-[#FAF8FF] border border-[#3B2868] flex items-center justify-center font-black">
                  <ShieldCheckIcon className="w-5 h-5 text-[#FAF8FF]" />
                </div>
                {activeRole === 'admin' && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#0F172A] text-[#FAF8FF] border border-[#3B2868]">
                    Active
                  </span>
                )}
              </div>
              <h3 className="text-base font-black text-[#0F172A] dark:text-[#FAF8FF]">
                {currentLang === 'as' ? 'প্ৰশাসন (Super User)' : 'Administrator Console'}
              </h3>
              <p className="text-xs text-[#555375] dark:text-[#C4B5FD] mt-1 line-clamp-2">
                {currentLang === 'as'
                  ? 'ছুপাৰ ব্যৱহাৰকাৰীৰ ই-মেইল আৰু পাছৱৰ্ডসহ ছুপাৰ ই-মেইললৈ প্ৰেৰিত বাধ্যতামূলক OTP।'
                  : 'Super User credentials with mandatory 6-digit OTP dispatched to super email.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E0D4FD]/40 dark:border-[#3B2868]/40 flex items-center justify-between text-[11px] font-bold text-[#6D28D9] dark:text-[#FAF8FF]">
              <span>Super Admin + OTP</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </div>
          </button>

        </div>

        {/* =================================================================== */}
        {/* ACTIVE PORTAL CONTAINER                                             */}
        {/* =================================================================== */}
        <div className="bg-white dark:bg-[#150F2C] border-2 border-[#E0D4FD] dark:border-[#3B2868] rounded-3xl p-6 sm:p-10 shadow-sm">
          
          {/* Sub-Header & Mode Toggle (Only for Student and Faculty) */}
          {activeRole !== 'admin' && step !== 'created_id' && step !== 'otp' && step !== 'login_otp' && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 mb-6 border-b border-[#E0D4FD]/40 dark:border-[#3B2868]/40">
              <div>
                <h2 className="text-xl font-black text-[#0F172A] dark:text-[#FAF8FF]">
                  {activeRole === 'student' 
                    ? (activeMode === 'login' ? 'Student Sign In' : 'Create Student Account')
                    : (activeMode === 'login' ? 'Faculty Member Sign In' : 'Faculty Member Registration')
                  }
                </h2>
                <p className="text-xs text-[#555375] dark:text-[#C4B5FD]">
                  {activeRole === 'student'
                    ? (activeMode === 'login' ? 'Enter your registered student credentials' : 'Register with email & complete OTP verification')
                    : (activeMode === 'login' ? 'Enter your Unique Member ID & Password' : 'Register with official university credentials')
                  }
                </p>
              </div>

              {/* Mode Toggle Buttons */}
              <div className="flex bg-[#FAF8FF] dark:bg-[#0A0718] p-1 rounded-2xl border border-[#E0D4FD] dark:border-[#3B2868] text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setActiveMode('login');
                    setStep(activeRole === 'faculty' ? 'login_credentials' : 'form');
                    setStatus({ loading: false, success: false, message: '', error: null });
                  }}
                  className={`px-4 py-2 font-black rounded-xl transition-all cursor-pointer ${
                    activeMode === 'login'
                      ? 'bg-[#6D28D9] text-white shadow-xs'
                      : 'text-[#0F172A] dark:text-[#C4B5FD]'
                  }`}
                >
                  {currentLang === 'as' ? 'প্ৰৱেশ (Sign In)' : 'Sign In'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveMode('register');
                    setStep('form');
                    setStatus({ loading: false, success: false, message: '', error: null });
                  }}
                  className={`px-4 py-2 font-black rounded-xl transition-all cursor-pointer ${
                    activeMode === 'register'
                      ? 'bg-[#6D28D9] text-white shadow-xs'
                      : 'text-[#0F172A] dark:text-[#C4B5FD]'
                  }`}
                >
                  {currentLang === 'as' ? 'পঞ্জীয়ন (Register)' : 'Register'}
                </button>
              </div>
            </div>
          )}

          {/* Success / Error Messages */}
          {status.success && status.message && (
            <div className="mb-6 p-4 rounded-2xl bg-[#E0D4FD]/30 dark:bg-[#0A0718] border-2 border-[#6D28D9] flex items-center space-x-2 text-xs sm:text-sm font-black text-[#0F172A] dark:text-[#FAF8FF]">
              <CheckCircleIcon className="w-5 h-5 text-[#10B981] shrink-0" />
              <span>{status.message}</span>
            </div>
          )}

          {status.error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-900 text-xs sm:text-sm text-red-700 dark:text-red-300 font-bold">
              {status.error}
            </div>
          )}

          {/* ================================================================= */}
          {/* SECTION 1: STUDENT PORTAL VIEWS                                   */}
          {/* ================================================================= */}
          {activeRole === 'student' && (
            <>
              {/* 1A. Student Login */}
              {activeMode === 'login' && (
                <form onSubmit={handleStudentLogin} className="space-y-4 max-w-lg mx-auto">
                  <div>
                    <label className="block text-xs font-black text-[#0F172A] dark:text-[#FAF8FF] mb-1">
                      Student Email Address <span className="text-[#6D28D9]">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <EnvelopeIcon className="w-4 h-4 text-[#555375] absolute left-3.5 pointer-events-none" />
                      <input
                        type="email"
                        required
                        placeholder="student@university.ac.in"
                        value={studentLogin.email}
                        onChange={(e) => setStudentLogin({ ...studentLogin, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-2xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0A0718] text-[#0F172A] dark:text-[#FAF8FF] outline-none focus:border-[#6D28D9]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#0F172A] dark:text-[#FAF8FF] mb-1">
                      Password <span className="text-[#6D28D9]">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <LockClosedIcon className="w-4 h-4 text-[#555375] absolute left-3.5 pointer-events-none" />
                      <input
                        type={showPasswords.studentLogin ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={studentLogin.password}
                        onChange={(e) => setStudentLogin({ ...studentLogin, password: e.target.value })}
                        className="w-full pl-10 pr-11 py-3 text-xs sm:text-sm rounded-2xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0A0718] text-[#0F172A] dark:text-[#FAF8FF] outline-none focus:border-[#6D28D9]"
                      />
                      <button
                        type="button"
                        onClick={() => toggleShowPassword('studentLogin')}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#555375] hover:text-[#0F172A] dark:text-[#C4B5FD] dark:hover:text-[#FAF8FF] transition-colors cursor-pointer"
                        title={showPasswords.studentLogin ? "Hide password" : "Show password"}
                        aria-label={showPasswords.studentLogin ? "Hide password" : "Show password"}
                      >
                        {showPasswords.studentLogin ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center space-x-2 text-[#555375] dark:text-[#C4B5FD] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={studentLogin.rememberMe}
                        onChange={(e) => setStudentLogin({ ...studentLogin, rememberMe: e.target.checked })}
                        className="w-4 h-4 text-[#6D28D9] rounded border-[#E0D4FD]"
                      />
                      <span>Remember active student session</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={status.loading}
                    className="w-full py-3.5 px-4 rounded-2xl font-black text-sm text-white bg-[#4C1D95] hover:bg-[#3B2868] transition-all cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    {status.loading ? 'Authenticating Student...' : (currentLang === 'as' ? 'ছাত্ৰ প’ৰ্টেলত প্ৰৱেশ কৰক' : 'Sign In to Student Portal')}
                  </button>
                </form>
              )}

              {/* 1B. Student Registration: Step 1 (Form) */}
              {activeMode === 'register' && step === 'form' && (
                <form onSubmit={handleStudentRegSubmit} className="space-y-4 max-w-lg mx-auto">
                  <div>
                    <label className="block text-xs font-black text-[#0F172A] dark:text-[#FAF8FF] mb-1">
                      Full Name <span className="text-[#6D28D9]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Saikia"
                      value={studentReg.fullName}
                      onChange={(e) => setStudentReg({ ...studentReg, fullName: e.target.value })}
                      className="w-full px-4 py-3 text-xs sm:text-sm rounded-2xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0A0718] text-[#0F172A] dark:text-[#FAF8FF] outline-none focus:border-[#6D28D9]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#0F172A] dark:text-[#FAF8FF] mb-1">
                      Email Address <span className="text-[#6D28D9]">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <EnvelopeIcon className="w-4 h-4 text-[#555375] absolute left-3.5 pointer-events-none" />
                      <input
                        type="email"
                        required
                        placeholder="student@gmail.com"
                        value={studentReg.email}
                        onChange={(e) => setStudentReg({ ...studentReg, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-2xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0A0718] text-[#0F172A] dark:text-[#FAF8FF] outline-none focus:border-[#6D28D9]"
                      />
                    </div>
                    <span className="text-[11px] text-[#555375] dark:text-[#C4B5FD] mt-1 block">
                      A 6-digit verification code will be sent to this email.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-[#0F172A] dark:text-[#FAF8FF] mb-1">
                        Create Password <span className="text-[#6D28D9]">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type={showPasswords.studentReg ? "text" : "password"}
                          required
                          placeholder="Min. 6 chars"
                          value={studentReg.password}
                          onChange={(e) => setStudentReg({ ...studentReg, password: e.target.value })}
                          className="w-full pl-4 pr-11 py-3 text-xs sm:text-sm rounded-2xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0A0718] text-[#0F172A] dark:text-[#FAF8FF] outline-none focus:border-[#6D28D9]"
                        />
                        <button
                          type="button"
                          onClick={() => toggleShowPassword('studentReg')}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#555375] hover:text-[#0F172A] dark:text-[#C4B5FD] dark:hover:text-[#FAF8FF] transition-colors cursor-pointer"
                          title={showPasswords.studentReg ? "Hide password" : "Show password"}
                          aria-label={showPasswords.studentReg ? "Hide password" : "Show password"}
                        >
                          {showPasswords.studentReg ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-[#0F172A] dark:text-[#FAF8FF] mb-1">
                        Confirm Password <span className="text-[#6D28D9]">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type={showPasswords.studentRegConfirm ? "text" : "password"}
                          required
                          placeholder="Re-enter password"
                          value={studentReg.confirmPassword}
                          onChange={(e) => setStudentReg({ ...studentReg, confirmPassword: e.target.value })}
                          className="w-full pl-4 pr-11 py-3 text-xs sm:text-sm rounded-2xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0A0718] text-[#0F172A] dark:text-[#FAF8FF] outline-none focus:border-[#6D28D9]"
                        />
                        <button
                          type="button"
                          onClick={() => toggleShowPassword('studentRegConfirm')}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#555375] hover:text-[#0F172A] dark:text-[#C4B5FD] dark:hover:text-[#FAF8FF] transition-colors cursor-pointer"
                          title={showPasswords.studentRegConfirm ? "Hide password" : "Show password"}
                          aria-label={showPasswords.studentRegConfirm ? "Hide password" : "Show password"}
                        >
                          {showPasswords.studentRegConfirm ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={status.loading}
                    className="w-full py-3.5 px-4 rounded-2xl font-black text-sm text-white bg-[#4C1D95] hover:bg-[#3B2868] transition-all cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    {status.loading ? 'Sending OTP Code...' : (currentLang === 'as' ? 'OTP প্ৰেৰণ কৰক আৰু আগবাঢ়ক' : 'Send Verification OTP & Proceed')}
                  </button>
                </form>
              )}

              {/* 1C. Student Registration: Step 2 (OTP Verification) */}
              {activeMode === 'register' && step === 'otp' && (
                <div className="max-w-md mx-auto text-center space-y-6">
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-[#E0D4FD]/40 dark:bg-[#0A0718] text-[#6D28D9] dark:text-[#FAF8FF] mx-auto flex items-center justify-center font-black">
                      <KeyIcon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-black text-[#0F172A] dark:text-[#FAF8FF]">
                      Verify Student Email
                    </h3>
                    <p className="text-xs text-[#555375] dark:text-[#C4B5FD]">
                      Enter the 6-digit verification code sent to <strong className="text-[#0F172A] dark:text-[#FAF8FF]">{studentReg.email}</strong>
                    </p>
                  </div>

                  <form onSubmit={handleVerifyStudentOtp} className="space-y-6">
                    {/* 6 Digit Inputs */}
                    <div className="flex justify-center gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (otpRefs.current[idx] = el)}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          className="w-11 h-13 sm:w-12 sm:h-14 text-center font-black text-lg rounded-2xl border-2 border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0A0718] text-[#0F172A] dark:text-[#FAF8FF] outline-none focus:border-[#6D28D9]"
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#555375] dark:text-[#C4B5FD]">
                      <button
                        type="button"
                        onClick={() => setStep('form')}
                        className="text-[#6D28D9] font-black hover:underline cursor-pointer"
                      >
                        Change Email
                      </button>
                      <div>
                        {canResend ? (
                          <button
                            type="button"
                            onClick={() => {
                              resetOtp();
                              setStatus({ loading: false, success: true, message: 'New OTP dispatched to student email.', error: null });
                            }}
                            className="text-[#6D28D9] font-black hover:underline cursor-pointer"
                          >
                            Resend Code
                          </button>
                        ) : (
                          <span className="flex items-center space-x-1">
                            <ClockIcon className="w-3.5 h-3.5" />
                            <span>Resend in {timer}s</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={status.loading}
                      className="w-full py-3.5 px-4 rounded-2xl font-black text-sm text-white bg-[#4C1D95] hover:bg-[#3B2868] transition-all cursor-pointer shadow-sm disabled:opacity-50"
                    >
                      {status.loading ? 'Verifying Student Account...' : 'Complete Registration & Sign In'}
                    </button>
                  </form>
                </div>
              )}
            </>
          )}

          {/* ================================================================= */}
          {/* SECTION 2: FACULTY MEMBER PORTAL VIEWS                             */}
          {/* ================================================================= */}
          {activeRole === 'faculty' && (
            <>
              {/* 2A. Faculty Registration: Step 1 (Form) */}
              {activeMode === 'register' && step === 'form' && (
                <form onSubmit={handleFacultyRegSubmit} className="space-y-4 max-w-2xl mx-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-black text-[#0F172A] dark:text-[#FAF8FF] mb-1">
                        Full Name <span className="text-[#6D28D9]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. Diganta Goswami"
                        value={facultyReg.fullName}
                        onChange={(e) => setFacultyReg({ ...facultyReg, fullName: e.target.value })}
                        className="w-full px-4 py-3 text-xs sm:text-sm rounded-2xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0A0718] text-[#0F172A] dark:text-[#FAF8FF] outline-none focus:border-[#6D28D9]"
                      />
                    </div>

                    {/* Faculty ID */}
                    <div>
                      <label className="block text-xs font-black text-[#0F172A] dark:text-[#FAF8FF] mb-1">
                        Institutional Faculty ID <span className="text-[#6D28D9]">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <IdentificationIcon className="w-4 h-4 text-[#555375] absolute left-3.5 pointer-events-none" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. GU-FAC-2024-81"
                          value={facultyReg.facultyId}
                          onChange={(e) => setFacultyReg({ ...facultyReg, facultyId: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-2xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0A0718] text-[#0F172A] dark:text-[#FAF8FF] outline-none focus:border-[#6D28D9]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* University Official Email */}
                    <div>
                      <label className="block text-xs font-black text-[#0F172A] dark:text-[#FAF8FF] mb-1">
                        University Official Email <span className="text-[#6D28D9]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="faculty@gauhati.ac.in"
                        value={facultyReg.officialEmail}
                        onChange={(e) => setFacultyReg({ ...facultyReg, officialEmail: e.target.value })}
                        className="w-full px-4 py-3 text-xs sm:text-sm rounded-2xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0A0718] text-[#0F172A] dark:text-[#FAF8FF] outline-none focus:border-[#6D28D9]"
                      />
                    </div>

                    {/* Member / Personal Email */}
                    <div>
                      <label className="block text-xs font-black text-[#0F172A] dark:text-[#FAF8FF] mb-1">
                        Personal / Member Email <span className="text-[#6D28D9]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="personal.email@gmail.com"
                        value={facultyReg.memberEmail}
                        onChange={(e) => setFacultyReg({ ...facultyReg, memberEmail: e.target.value })}
                        className="w-full px-4 py-3 text-xs sm:text-sm rounded-2xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0A0718] text-[#0F172A] dark:text-[#FAF8FF] outline-none focus:border-[#6D28D9]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Department Dropdown */}
                    <div>
                      <label className="block text-xs font-black text-[#0F172A] dark:text-[#FAF8FF] mb-1">
                        Academic Department <span className="text-[#6D28D9]">*</span>
                      </label>
                      <select
                        value={facultyReg.department}
                        onChange={(e) => setFacultyReg({ ...facultyReg, department: e.target.value })}
                        className="w-full px-4 py-3 text-xs sm:text-sm rounded-2xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0A0718] text-[#0F172A] dark:text-[#FAF8FF] outline-none focus:border-[#6D28D9] cursor-pointer"
                      >
                        {departmentOptions.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>

                    {/* Designation Dropdown */}
                    <div>
                      <label className="block text-xs font-black text-[#0F172A] dark:text-[#FAF8FF] mb-1">
                        Designation / Position <span className="text-[#6D28D9]">*</span>
                      </label>
                      <select
                        value={facultyReg.designation}
                        onChange={(e) => setFacultyReg({ ...facultyReg, designation: e.target.value })}
                        className="w-full px-4 py-3 text-xs sm:text-sm rounded-2xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0A0718] text-[#0F172A] dark:text-[#FAF8FF] outline-none focus:border-[#6D28D9] cursor-pointer"
                      >
                        {designationOptions.map((desig) => (
                          <option key={desig} value={desig}>{desig}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Create Password */}
                    <div>
                      <label className="block text-xs font-black text-[#0F172A] dark:text-[#FAF8FF] mb-1">
                        Create Password <span className="text-[#6D28D9]">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type={showPasswords.facultyReg ? "text" : "password"}
                          required
                          placeholder="Min. 6 chars"
                          value={facultyReg.password}
                          onChange={(e) => setFacultyReg({ ...facultyReg, password: e.target.value })}
                          className="w-full pl-4 pr-11 py-3 text-xs sm:text-sm rounded-2xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0A0718] text-[#0F172A] dark:text-[#FAF8FF] outline-none focus:border-[#6D28D9]"
                        />
                        <button
                          type="button"
                          onClick={() => toggleShowPassword('facultyReg')}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#555375] hover:text-[#0F172A] dark:text-[#C4B5FD] dark:hover:text-[#FAF8FF] transition-colors cursor-pointer"
                          title={showPasswords.facultyReg ? "Hide password" : "Show password"}
                          aria-label={showPasswords.facultyReg ? "Hide password" : "Show password"}
                        >
                          {showPasswords.facultyReg ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-xs font-black text-[#0F172A] dark:text-[#FAF8FF] mb-1">
                        Confirm Password <span className="text-[#6D28D9]">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type={showPasswords.facultyRegConfirm ? "text" : "password"}
                          required
                          placeholder="Re-enter password"
                          value={facultyReg.confirmPassword}
                          onChange={(e) => setFacultyReg({ ...facultyReg, confirmPassword: e.target.value })}
                          className="w-full pl-4 pr-11 py-3 text-xs sm:text-sm rounded-2xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0A0718] text-[#0F172A] dark:text-[#FAF8FF] outline-none focus:border-[#6D28D9]"
                        />
                        <button
                          type="button"
                          onClick={() => toggleShowPassword('facultyRegConfirm')}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#555375] hover:text-[#0F172A] dark:text-[#C4B5FD] dark:hover:text-[#FAF8FF] transition-colors cursor-pointer"
                          title={showPasswords.facultyRegConfirm ? "Hide password" : "Show password"}
                          aria-label={showPasswords.facultyRegConfirm ? "Hide password" : "Show password"}
                        >
                          {showPasswords.facultyRegConfirm ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={status.loading}
                    className="w-full py-3.5 px-4 rounded-2xl font-black text-sm text-[#0F172A] dark:text-[#FAF8FF] bg-[#C4B5FD] dark:bg-[#FAF8FF] hover:bg-[#d6be73] transition-all cursor-pointer shadow-sm disabled:opacity-50 mt-2"
                  >
                    {status.loading ? 'Registering Faculty Member...' : (currentLang === 'as' ? 'পঞ্জীয়ন সম্পূৰ্ণ কৰক আৰু Member ID প্ৰস্তুত কৰক' : 'Complete Registration & Generate Unique Member ID')}
                  </button>
                </form>
              )}

              {/* 2B. Faculty Registration: Step 2 (Display Generated Unique Member ID) */}
              {activeMode === 'register' && step === 'created_id' && (
                <div className="max-w-lg mx-auto text-center space-y-6">
                  <div className="w-14 h-14 rounded-3xl bg-[#3B2868] text-[#FAF8FF] mx-auto flex items-center justify-center font-black shadow-md">
                    <CheckCircleIcon className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-[#FAF8FF]">
                      Faculty Member Account Created!
                    </h3>
                    <p className="text-xs sm:text-sm text-[#555375] dark:text-[#C4B5FD]">
                      Your institutional profile has been verified. A Unique Member ID has been generated for you. Please save this ID to sign in.
                    </p>
                  </div>

                  {/* Highlighted Unique Member ID Box */}
                  <div className="p-6 rounded-3xl bg-[#FAF8FF] dark:bg-[#0A0718] border-2 border-dashed border-[#6D28D9] dark:border-[#FAF8FF] space-y-3">
                    <span className="text-xs font-black uppercase tracking-wider text-[#555375] dark:text-[#C4B5FD]">
                      Your Unique Member ID
                    </span>
                    <div className="flex items-center justify-center space-x-3">
                      <span className="text-2xl sm:text-3xl font-black tracking-widest text-[#0F172A] dark:text-[#FAF8FF]">
                        {generatedMemberId}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyMemberId}
                        className="p-2 rounded-xl bg-white dark:bg-[#150F2C] border border-[#E0D4FD] dark:border-[#3B2868] text-[#0F172A] dark:text-[#FAF8FF] hover:bg-[#E0D4FD]/30 transition-colors cursor-pointer"
                        title="Copy Member ID"
                      >
                        {copiedId ? <CheckIcon className="w-5 h-5 text-green-600" /> : <DocumentDuplicateIcon className="w-5 h-5 text-[#6D28D9]" />}
                      </button>
                    </div>
                    {copiedId && (
                      <span className="text-[11px] font-bold text-green-600 dark:text-green-400 block">
                        Copied to clipboard!
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveMode('login');
                        setStep('login_credentials');
                        setStatus({ loading: false, success: false, message: '', error: null });
                      }}
                      className="w-full py-3.5 px-4 rounded-2xl font-black text-sm text-white bg-[#4C1D95] hover:bg-[#3B2868] transition-all cursor-pointer shadow-sm"
                    >
                      Proceed to Faculty Sign In with Member ID & OTP
                    </button>
                  </div>
                </div>
              )}

              {/* 2C. Faculty Login: Step 1 (Member ID + Password) */}
              {activeMode === 'login' && step === 'login_credentials' && (
                <form onSubmit={handleFacultyLoginCredentials} className="space-y-4 max-w-lg mx-auto">
                  <div>
                    <label className="block text-xs font-black text-[#0F172A] dark:text-[#FAF8FF] mb-1">
                      Unique Faculty Member ID <span className="text-[#6D28D9]">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <IdentificationIcon className="w-4 h-4 text-[#555375] absolute left-3.5 pointer-events-none" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. UM-FAC-7821"
                        value={facultyLogin.memberId}
                        onChange={(e) => setFacultyLogin({ ...facultyLogin, memberId: e.target.value.toUpperCase() })}
                        className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm font-mono font-bold tracking-wider rounded-2xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0A0718] text-[#0F172A] dark:text-[#FAF8FF] outline-none focus:border-[#6D28D9]"
                      />
                    </div>
                    <span className="text-[11px] text-[#555375] dark:text-[#C4B5FD] mt-1 block">
                      Use the unique member ID generated during your faculty registration.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#0F172A] dark:text-[#FAF8FF] mb-1">
                      Password <span className="text-[#6D28D9]">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <LockClosedIcon className="w-4 h-4 text-[#555375] absolute left-3.5 pointer-events-none" />
                      <input
                        type={showPasswords.facultyLogin ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={facultyLogin.password}
                        onChange={(e) => setFacultyLogin({ ...facultyLogin, password: e.target.value })}
                        className="w-full pl-10 pr-11 py-3 text-xs sm:text-sm rounded-2xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0A0718] text-[#0F172A] dark:text-[#FAF8FF] outline-none focus:border-[#6D28D9]"
                      />
                      <button
                        type="button"
                        onClick={() => toggleShowPassword('facultyLogin')}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#555375] hover:text-[#0F172A] dark:text-[#C4B5FD] dark:hover:text-[#FAF8FF] transition-colors cursor-pointer"
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
                    className="w-full py-3.5 px-4 rounded-2xl font-black text-sm text-white bg-[#3B2868] hover:bg-[#5b7357] transition-all cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    {status.loading ? 'Validating Faculty Member...' : (currentLang === 'as' ? 'OTP প্ৰেৰণ কৰক আৰু পৰীক্ষা কৰক' : 'Send Login OTP & Verify Identity')}
                  </button>
                </form>
              )}

              {/* 2D. Faculty Login: Step 2 (6-Digit OTP verification) */}
              {activeMode === 'login' && step === 'login_otp' && (
                <div className="max-w-md mx-auto text-center space-y-6">
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-[#3B2868] text-[#FAF8FF] mx-auto flex items-center justify-center font-black shadow-xs">
                      <KeyIcon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-black text-[#0F172A] dark:text-[#FAF8FF]">
                      Faculty Two-Factor OTP Verification
                    </h3>
                    <p className="text-xs text-[#555375] dark:text-[#C4B5FD]">
                      A 6-digit authentication code has been sent to the registered email linked to Member ID <strong className="text-[#0F172A] dark:text-[#FAF8FF]">{facultyLogin.memberId}</strong>.
                    </p>
                  </div>

                  <form onSubmit={handleVerifyFacultyOtp} className="space-y-6">
                    <div className="flex justify-center gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (otpRefs.current[idx] = el)}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          className="w-11 h-13 sm:w-12 sm:h-14 text-center font-black text-lg rounded-2xl border-2 border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0A0718] text-[#0F172A] dark:text-[#FAF8FF] outline-none focus:border-[#3B2868]"
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#555375] dark:text-[#C4B5FD]">
                      <button
                        type="button"
                        onClick={() => setStep('login_credentials')}
                        className="text-[#6D28D9] font-black hover:underline cursor-pointer"
                      >
                        Re-enter Member ID
                      </button>
                      <div>
                        {canResend ? (
                          <button
                            type="button"
                            onClick={() => {
                              resetOtp();
                              setStatus({ loading: false, success: true, message: 'New OTP dispatched to faculty email.', error: null });
                            }}
                            className="text-[#6D28D9] font-black hover:underline cursor-pointer"
                          >
                            Resend Code
                          </button>
                        ) : (
                          <span className="flex items-center space-x-1">
                            <ClockIcon className="w-3.5 h-3.5" />
                            <span>Resend in {timer}s</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={status.loading}
                      className="w-full py-3.5 px-4 rounded-2xl font-black text-sm text-[#0F172A] bg-[#C4B5FD] dark:bg-[#FAF8FF] hover:bg-[#d6be73] transition-all cursor-pointer shadow-sm disabled:opacity-50"
                    >
                      {status.loading ? 'Authenticating Faculty Member...' : 'Verify OTP & Access Faculty Dashboard'}
                    </button>
                  </form>
                </div>
              )}
            </>
          )}

          {/* ================================================================= */}
          {/* SECTION 3: SUPER ADMIN PORTAL VIEWS                               */}
          {/* ================================================================= */}
          {activeRole === 'admin' && (
            <>
              {/* 3A. Admin Step 1: Super User Credentials */}
              {step === 'credentials' && (
                <div className="max-w-lg mx-auto space-y-6">
                  <div className="text-center space-y-1">
                    <div className="w-12 h-12 rounded-2xl bg-[#0F172A] text-[#FAF8FF] border border-[#3B2868] mx-auto flex items-center justify-center font-black mb-3">
                      <ShieldCheckIcon className="w-6 h-6 text-[#FAF8FF]" />
                    </div>
                    <h3 className="text-xl font-black text-[#0F172A] dark:text-[#FAF8FF]">
                      Super User Console Access
                    </h3>
                    <p className="text-xs text-[#555375] dark:text-[#C4B5FD]">
                      Centralized document ingestion, vector indexing & university crawler management.
                    </p>
                  </div>

                  <form onSubmit={handleAdminCredentials} className="space-y-4">
                    {/* Super User Name */}
                    <div>
                      <label className="block text-xs font-black text-[#0F172A] dark:text-[#FAF8FF] mb-1">
                        Super User Name <span className="text-[#6D28D9]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="System Administrator"
                        value={adminLogin.superName}
                        onChange={(e) => setAdminLogin({ ...adminLogin, superName: e.target.value })}
                        className="w-full px-4 py-3 text-xs sm:text-sm rounded-2xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0A0718] text-[#0F172A] dark:text-[#FAF8FF] outline-none focus:border-[#6D28D9]"
                      />
                    </div>

                    {/* Super Email */}
                    <div>
                      <label className="block text-xs font-black text-[#0F172A] dark:text-[#FAF8FF] mb-1">
                        Super User Email <span className="text-[#6D28D9]">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <EnvelopeIcon className="w-4 h-4 text-[#555375] absolute left-3.5 pointer-events-none" />
                        <input
                          type="email"
                          required
                          placeholder="admin@unimitra.edu.in"
                          value={adminLogin.superEmail}
                          onChange={(e) => setAdminLogin({ ...adminLogin, superEmail: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-2xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0A0718] text-[#0F172A] dark:text-[#FAF8FF] outline-none focus:border-[#6D28D9]"
                        />
                      </div>
                      <span className="text-[11px] text-[#555375] dark:text-[#C4B5FD] mt-1 block">
                        A mandatory 6-digit OTP will be dispatched to this super email.
                      </span>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-xs font-black text-[#0F172A] dark:text-[#FAF8FF] mb-1">
                        Super Password <span className="text-[#6D28D9]">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <LockClosedIcon className="w-4 h-4 text-[#555375] absolute left-3.5 pointer-events-none" />
                        <input
                          type={showPasswords.adminLogin ? "text" : "password"}
                          required
                          placeholder="••••••••"
                          value={adminLogin.superPassword}
                          onChange={(e) => setAdminLogin({ ...adminLogin, superPassword: e.target.value })}
                          className="w-full pl-10 pr-11 py-3 text-xs sm:text-sm rounded-2xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0A0718] text-[#0F172A] dark:text-[#FAF8FF] outline-none focus:border-[#6D28D9]"
                        />
                        <button
                          type="button"
                          onClick={() => toggleShowPassword('adminLogin')}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#555375] hover:text-[#0F172A] dark:text-[#C4B5FD] dark:hover:text-[#FAF8FF] transition-colors cursor-pointer"
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
                      className="w-full py-3.5 px-4 rounded-2xl font-black text-sm text-[#FAF8FF] bg-[#0F172A] hover:bg-[#150F2C] border border-[#3B2868] transition-all cursor-pointer shadow-sm disabled:opacity-50"
                    >
                      {status.loading ? 'Verifying Super Credentials...' : 'Send OTP to Super Email & Continue'}
                    </button>
                  </form>
                </div>
              )}

              {/* 3B. Admin Step 2: OTP Sent to Super Email */}
              {step === 'otp' && (
                <div className="max-w-md mx-auto text-center space-y-6">
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-[#0F172A] text-[#FAF8FF] border border-[#3B2868] mx-auto flex items-center justify-center font-black">
                      <KeyIcon className="w-6 h-6 text-[#FAF8FF]" />
                    </div>
                    <h3 className="text-lg font-black text-[#0F172A] dark:text-[#FAF8FF]">
                      Super Admin OTP Verification
                    </h3>
                    <p className="text-xs text-[#555375] dark:text-[#C4B5FD]">
                      Enter the 6-digit security code sent to super email <strong className="text-[#0F172A] dark:text-[#FAF8FF]">{adminLogin.superEmail}</strong>
                    </p>
                  </div>

                  <form onSubmit={handleVerifyAdminOtp} className="space-y-6">
                    <div className="flex justify-center gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (otpRefs.current[idx] = el)}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          className="w-11 h-13 sm:w-12 sm:h-14 text-center font-black text-lg rounded-2xl border-2 border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0A0718] text-[#0F172A] dark:text-[#FAF8FF] outline-none focus:border-[#3B2868]"
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#555375] dark:text-[#C4B5FD]">
                      <button
                        type="button"
                        onClick={() => setStep('credentials')}
                        className="text-[#6D28D9] font-black hover:underline cursor-pointer"
                      >
                        Change Super Email
                      </button>
                      <div>
                        {canResend ? (
                          <button
                            type="button"
                            onClick={() => {
                              resetOtp();
                              setStatus({ loading: false, success: true, message: 'New OTP sent to super email.', error: null });
                            }}
                            className="text-[#6D28D9] font-black hover:underline cursor-pointer"
                          >
                            Resend Code
                          </button>
                        ) : (
                          <span className="flex items-center space-x-1">
                            <ClockIcon className="w-3.5 h-3.5" />
                            <span>Resend in {timer}s</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={status.loading}
                      className="w-full py-3.5 px-4 rounded-2xl font-black text-sm text-[#0F172A] bg-[#FAF8FF] hover:bg-[#C4B5FD] transition-all cursor-pointer shadow-sm disabled:opacity-50"
                    >
                      {status.loading ? 'Authorizing Super Admin...' : 'Verify OTP & Launch Admin Console'}
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

