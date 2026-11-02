import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import { prisma } from '../../config/prisma.js';
import { env } from '../../config/env.js';
import { ApiError } from '../../utils/apiError.js';
import { logger } from '../../config/logger.js';
import { emailService } from '../../services/email.service.js';

// In-memory OTP storage with TTL (5 minutes)
// Key: identifier (email or memberId), Value: { otp: string, expiresAt: number, role?: string, tempUser?: any }
const otpStore = new Map();

/**
 * Generate a cryptographically secure dynamic 6-digit OTP (e.g. 749216)
 */
const generateOtpCode = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

/**
 * Set OTP for an identifier (5 minutes expiry)
 * Generates a dynamic, unique 6-digit OTP code every time (never static 123456)
 */
export const saveOtp = (identifier, role = null, tempUser = null) => {
  const code = generateOtpCode();
  const expiresAt = Date.now() + 5 * 60 * 1000;
  otpStore.set(identifier.toLowerCase(), { otp: code, expiresAt, role, tempUser });
  logger.info({ identifier, code }, 'Secure 6-digit OTP generated for user');
  return code;
};

/**
 * Verify OTP code strictly against the generated OTP
 */
export const verifyOtpCode = (identifier, code) => {
  const record = otpStore.get(identifier.toLowerCase());
  if (!record) {
    return { success: false, reason: 'OTP expired or not found. Please request a new one.' };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(identifier.toLowerCase());
    return { success: false, reason: 'OTP has expired. Please request a new one.' };
  }

  if (record.otp !== String(code).trim()) {
    return { success: false, reason: 'Invalid OTP code entered.' };
  }

  // Consume OTP
  otpStore.delete(identifier.toLowerCase());
  return { success: true, tempUser: record.tempUser, role: record.role };
};

/**
 * Generate JWT token
 */
export const generateToken = (user, expiresIn = env.JWT_EXPIRES_IN || '7d') => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.fullName || user.full_name || 'Member',
    memberId: user.memberId || user.member_id || null,
  };

  return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
};

/**
 * Generate a unique Member ID for Faculty (UM-FAC-XXXX)
 */
const generateUniqueMemberId = async () => {
  let unique = false;
  let memberId = '';
  let attempts = 0;

  while (!unique && attempts < 10) {
    attempts++;
    const code = Math.floor(1000 + Math.random() * 9000);
    memberId = `UM-FAC-${code}`;
    const existing = await prisma.profile.findUnique({
      where: { memberId },
    });
    if (!existing) {
      unique = true;
    }
  }

  return memberId;
};

/**
 * Sanitize profile object for client responses
 */
export const sanitizeProfile = (profile) => {
  if (!profile) return null;
  const { passwordHash, ...safeUser } = profile;
  return {
    id: safeUser.id,
    fullName: safeUser.fullName || safeUser.full_name,
    email: safeUser.email,
    role: safeUser.role,
    memberId: safeUser.memberId || safeUser.member_id,
    department: safeUser.department,
    designation: safeUser.designation,
    preferredLanguage: safeUser.preferredLang || safeUser.preferred_language || 'en',
    isActive: safeUser.isActive ?? safeUser.is_active ?? true,
    isVerified: safeUser.isVerified ?? safeUser.is_verified ?? false,
    createdAt: safeUser.createdAt || safeUser.created_at,
  };
};

/**
 * 1. Register Student
 */
export const registerStudent = async ({ fullName, email, password, preferredLanguage = 'en' }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await prisma.profile.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    throw ApiError.conflict('An account with this email address already exists.');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const profile = await prisma.profile.create({
    data: {
      email: normalizedEmail,
      fullName: fullName.trim(),
      passwordHash,
      role: 'student',
      preferredLang: preferredLanguage,
      department: 'Undergraduate / Postgraduate Studies',
      isActive: true,
      isVerified: true,
    },
  });

  const otp = saveOtp(normalizedEmail, 'student', { profileId: profile.id });
  const token = generateToken(profile);

  // Send OTP email via Brevo
  emailService.sendOtpEmail({
    to: normalizedEmail,
    name: profile.fullName,
    otp,
    role: 'student',
    reason: 'completing your student registration',
  }).catch((err) => logger.warn({ err: err.message }, 'Failed to dispatch student OTP email'));

  return {
    user: sanitizeProfile(profile),
    token,
    otpSent: true,
  };
};

/**
 * 1b. Verify Student OTP
 */
export const verifyStudentOtp = async ({ identifier, otp }) => {
  const verification = verifyOtpCode(identifier, otp);
  if (!verification.success) {
    throw ApiError.badRequest(verification.reason);
  }

  const profile = await prisma.profile.findUnique({
    where: { email: identifier.toLowerCase().trim() },
  });

  if (!profile) {
    throw ApiError.notFound('Student account not found.');
  }

  if (!profile.isVerified) {
    await prisma.profile.update({
      where: { id: profile.id },
      data: { isVerified: true },
    });
  }

  const token = generateToken(profile);

  // Send welcome message upon successful verification
  emailService.sendWelcomeEmail({
    to: profile.email,
    name: profile.fullName,
    role: 'student',
    loginTime: new Date(),
  }).catch((err) => logger.warn({ err: err.message }, 'Failed to dispatch student welcome email'));

  return {
    user: sanitizeProfile(profile),
    token,
  };
};

/**
 * 2. Login Student
 */
export const loginStudent = async ({ email, password, rememberMe = true }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const profile = await prisma.profile.findUnique({
    where: { email: normalizedEmail },
  });

  if (!profile) {
    throw ApiError.unauthorized('Invalid email or password.');
  }

  if (profile.role !== 'student' && profile.role !== 'admin' && profile.role !== 'super_admin') {
    throw ApiError.unauthorized('Account is not registered as a student.');
  }

  if (!profile.passwordHash) {
    if (password && password.length >= 6) {
      const passwordHash = await bcrypt.hash(password, 10);
      await prisma.profile.update({
        where: { id: profile.id },
        data: { passwordHash },
      });
      logger.info({ email: normalizedEmail }, 'Configured initial password for student account');
      profile.passwordHash = passwordHash;
    } else {
      throw ApiError.unauthorized('This account was created via Google Sign-In and has no password configured. Please sign in using "Continue with Google" or enter a password of at least 6 characters to configure password access.');
    }
  }

  const isMatch = await bcrypt.compare(password, profile.passwordHash);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password.');
  }

  if (!profile.isActive) {
    throw ApiError.forbidden('Your account has been deactivated. Please contact support.');
  }

  const expiresIn = rememberMe ? '30d' : '1d';
  const token = generateToken(profile, expiresIn);

  // Send welcome / login notification email
  emailService.sendWelcomeEmail({
    to: profile.email,
    name: profile.fullName,
    role: 'student',
    loginTime: new Date(),
  }).catch((err) => logger.warn({ err: err.message }, 'Failed to dispatch student login welcome email'));

  return {
    user: sanitizeProfile(profile),
    token,
  };
};

/**
 * 3. Register Faculty Member
 */
export const registerFaculty = async ({
  fullName,
  officialEmail,
  memberEmail,
  facultyId,
  department,
  designation,
  password,
  preferredLanguage = 'en',
}) => {
  const normalizedOfficialEmail = officialEmail.toLowerCase().trim();
  // Member email is the personal/member email where verification emails and OTPs are sent
  const normalizedMemberEmail = (memberEmail || officialEmail).toLowerCase().trim();

  // Check if either memberEmail or officialEmail is already registered
  const existing = await prisma.profile.findFirst({
    where: {
      OR: [
        { email: normalizedMemberEmail },
        { email: normalizedOfficialEmail },
      ],
    },
  });

  if (existing) {
    throw ApiError.conflict('An account with this email address already exists. Please sign in or use a different email.');
  }

  const memberId = await generateUniqueMemberId();
  const passwordHash = await bcrypt.hash(password, 10);

  // Store normalizedMemberEmail as primary email so all notifications, password resets, and OTPs go to member email
  const profile = await prisma.profile.create({
    data: {
      email: normalizedMemberEmail,
      memberId,
      facultyId: facultyId || 'FAC-INST',
      fullName: fullName.trim(),
      passwordHash,
      role: 'faculty',
      department,
      designation,
      preferredLang: preferredLanguage,
      isActive: true,
      isVerified: false, // OTP required on registration to activate account
      notificationPreferences: {
        officialEmail: normalizedOfficialEmail,
        memberEmail: normalizedMemberEmail,
        regulations: true,
        exams: true,
        scholarships: true,
        admissions: false,
      },
    },
  });

  // Generate 6-digit OTP for faculty registration verification
  const otp = saveOtp(memberId, 'faculty', { profileId: profile.id, memberEmail: normalizedMemberEmail });
  saveOtp(normalizedMemberEmail, 'faculty', { profileId: profile.id, memberId });

  // Send Registration Verification OTP email to MEMBER EMAIL (NOT UNIVERSITY EMAIL)
  emailService.sendOtpEmail({
    to: normalizedMemberEmail,
    name: profile.fullName,
    otp,
    role: 'faculty',
    reason: 'verifying your Faculty registration on UniMitra',
  }).catch((err) => logger.warn({ err: err.message }, 'Failed to dispatch faculty registration OTP email'));

  return {
    requiresOtp: true,
    memberId,
    memberEmail: normalizedMemberEmail,
    officialEmail: normalizedOfficialEmail,
    user: sanitizeProfile(profile),
    message: `Verification code sent to member email: ${normalizedMemberEmail}. Please enter the 6-digit OTP to complete registration.`,
  };
};

/**
 * 4. Step 1: Faculty Login by Member ID and Password
 */
export const loginFacultyCredentials = async ({ memberId, password }) => {
  const trimmedId = memberId.trim();

  let profile = await prisma.profile.findFirst({
    where: {
      OR: [
        { memberId: trimmedId },
        { email: trimmedId.toLowerCase() },
      ],
    },
  });

  // Also check if entered value matches officialEmail in notificationPreferences
  if (!profile) {
    const allFaculty = await prisma.profile.findMany({
      where: {
        role: { in: ['faculty', 'admin', 'super_admin'] },
      },
    });
    profile = allFaculty.find((f) => {
      const prefs = typeof f.notificationPreferences === 'object' ? f.notificationPreferences : {};
      return (
        prefs?.officialEmail?.toLowerCase() === trimmedId.toLowerCase() ||
        prefs?.memberEmail?.toLowerCase() === trimmedId.toLowerCase()
      );
    });
  }

  if (!profile) {
    throw ApiError.unauthorized('Invalid Member ID or password.');
  }

  if (profile.role !== 'faculty' && profile.role !== 'admin' && profile.role !== 'super_admin') {
    throw ApiError.unauthorized('Account does not hold faculty access privileges.');
  }

  if (!profile.passwordHash) {
    if (password && password.length >= 6) {
      const passwordHash = await bcrypt.hash(password, 10);
      await prisma.profile.update({
        where: { id: profile.id },
        data: { passwordHash },
      });
      logger.info({ memberId: profile.memberId }, 'Configured initial password for faculty account');
      profile.passwordHash = passwordHash;
    } else {
      throw ApiError.unauthorized('Faculty account password not configured. Please enter a valid password (min 6 characters) to initialize access.');
    }
  }

  const isMatch = await bcrypt.compare(password, profile.passwordHash);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid Member ID or password.');
  }

  if (!profile.isActive) {
    throw ApiError.forbidden('Your faculty account has been deactivated.');
  }

  // Get MEMBER EMAIL (NOT UNIVERSITY EMAIL)
  const prefs = typeof profile.notificationPreferences === 'object' ? profile.notificationPreferences : {};
  const memberEmail = prefs?.memberEmail || profile.email;

  const otp = saveOtp(profile.memberId || memberEmail, 'faculty', { profileId: profile.id, memberEmail });
  if (memberEmail && memberEmail !== profile.memberId) {
    saveOtp(memberEmail, 'faculty', { profileId: profile.id, memberId: profile.memberId });
  }

  // Send 2FA OTP email to faculty's MEMBER EMAIL (NOT UNIVERSITY EMAIL)
  emailService.sendOtpEmail({
    to: memberEmail,
    name: profile.fullName,
    otp,
    role: 'faculty',
    reason: 'Faculty Member 2-Factor Authentication sign-in',
  }).catch((err) => logger.warn({ err: err.message }, 'Failed to dispatch faculty OTP email'));

  const maskedEmail = memberEmail.replace(/^(.)(.*)(@.*)$/, (_, a, b, c) => `${a}***${c}`);

  return {
    requiresOtp: true,
    memberId: profile.memberId,
    email: maskedEmail,
    message: `Credentials verified. 6-digit OTP sent to your member email (${maskedEmail}).`,
  };
};

/**
 * 5. Step 2: Faculty OTP Verification
 */
export const verifyFacultyOtp = async ({ identifier, otp }) => {
  const verification = verifyOtpCode(identifier, otp);
  if (!verification.success) {
    throw ApiError.badRequest(verification.reason);
  }

  const trimmed = identifier.trim();
  let profile = await prisma.profile.findFirst({
    where: {
      OR: [
        { memberId: trimmed },
        { email: trimmed.toLowerCase() },
      ],
    },
  });

  if (!profile) {
    const allFaculty = await prisma.profile.findMany({
      where: {
        role: { in: ['faculty', 'admin', 'super_admin'] },
      },
    });
    profile = allFaculty.find((f) => {
      const prefs = typeof f.notificationPreferences === 'object' ? f.notificationPreferences : {};
      return (
        prefs?.officialEmail?.toLowerCase() === trimmed.toLowerCase() ||
        prefs?.memberEmail?.toLowerCase() === trimmed.toLowerCase()
      );
    });
  }

  if (!profile) {
    throw ApiError.notFound('Faculty profile not found.');
  }

  // Mark account as verified if it was unverified (registration OTP)
  if (!profile.isVerified) {
    await prisma.profile.update({
      where: { id: profile.id },
      data: { isVerified: true },
    });
    profile.isVerified = true;
  }

  const token = generateToken(profile);

  // Send welcome / login notification email to MEMBER EMAIL (NOT UNIVERSITY EMAIL)
  const prefs = typeof profile.notificationPreferences === 'object' ? profile.notificationPreferences : {};
  const recipientEmail = prefs?.memberEmail || profile.email;

  emailService.sendWelcomeEmail({
    to: recipientEmail,
    name: profile.fullName,
    role: 'faculty',
    memberId: profile.memberId,
    loginTime: new Date(),
  }).catch((err) => logger.warn({ err: err.message }, 'Failed to dispatch faculty welcome email'));

  return {
    user: sanitizeProfile(profile),
    token,
    memberId: profile.memberId,
  };
};

/**
 * 6. Admin Login Credentials & Seed Fallback
 */
export const loginAdminCredentials = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  let admin = await prisma.profile.findUnique({
    where: { email: normalizedEmail },
  });

  // Auto-seed default admin if logging in with default credentials for the first time
  if (!admin && normalizedEmail === 'admin@unimitra.edu.in' && password === 'admin@unimitra') {
    const passwordHash = await bcrypt.hash('admin@unimitra', 10);
    admin = await prisma.profile.create({
      data: {
        email: 'admin@unimitra.edu.in',
        fullName: 'System Administrator',
        passwordHash,
        role: 'super_admin',
        department: 'Institutional Governance',
        designation: 'Chief Administrator',
        isActive: true,
        preferredLang: 'en',
      },
    });
    logger.info('Auto-seeded default Super Admin account (admin@unimitra.edu.in)');
  }

  if (!admin) {
    throw ApiError.unauthorized('Invalid Administrator credentials.');
  }

  if (admin.role !== 'admin' && admin.role !== 'super_admin') {
    throw ApiError.unauthorized('Account does not possess Administrative privileges.');
  }

  const isMatch = await bcrypt.compare(password, admin.passwordHash);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid Administrator credentials.');
  }

  const otp = saveOtp(admin.email, 'admin', { profileId: admin.id });

  // Send 2FA OTP email to administrator email
  emailService.sendOtpEmail({
    to: admin.email,
    name: admin.fullName,
    otp,
    role: admin.role,
    reason: 'Administrator 2FA sign-in verification',
  }).catch((err) => logger.warn({ err: err.message }, 'Failed to dispatch admin OTP email'));

  return {
    requiresOtp: true,
    email: admin.email,
    name: admin.fullName,
    message: 'Admin credentials accepted. Please verify with the 6-digit OTP code.',
  };
};

/**
 * 7. Admin OTP Verification
 */
export const verifyAdminOtp = async ({ identifier, otp }) => {
  const verification = verifyOtpCode(identifier, otp);
  if (!verification.success) {
    throw ApiError.badRequest(verification.reason);
  }

  const admin = await prisma.profile.findUnique({
    where: { email: identifier.toLowerCase() },
  });

  if (!admin) {
    throw ApiError.notFound('Administrator account not found.');
  }

  const token = generateToken(admin);

  // Send welcome / login notification email upon successful admin login
  emailService.sendWelcomeEmail({
    to: admin.email,
    name: admin.fullName,
    role: admin.role,
    loginTime: new Date(),
  }).catch((err) => logger.warn({ err: err.message }, 'Failed to dispatch admin welcome email'));

  return {
    user: sanitizeProfile(admin),
    token,
  };
};

/**
 * 8. Resend OTP
 */
export const resendOtp = async ({ identifier, role }) => {
  const code = saveOtp(identifier, role);

  let targetEmail = identifier.includes('@') ? identifier.toLowerCase().trim() : null;
  let targetName = 'Member';

  if (!targetEmail) {
    const found = await prisma.profile.findFirst({
      where: {
        OR: [
          { memberId: identifier.trim() },
          { email: identifier.toLowerCase().trim() },
        ],
      },
    });
    if (found) {
      const prefs = typeof found.notificationPreferences === 'object' ? found.notificationPreferences : {};
      targetEmail = (found.role === 'faculty' && prefs?.memberEmail) ? prefs.memberEmail : found.email;
      targetName = found.fullName || 'Member';
    }
  } else if (role === 'faculty') {
    // If targetEmail is an official email, check if there is an associated memberEmail
    const found = await prisma.profile.findFirst({
      where: {
        role: { in: ['faculty', 'admin', 'super_admin'] },
        OR: [
          { email: targetEmail },
        ],
      },
    });
    if (found) {
      const prefs = typeof found.notificationPreferences === 'object' ? found.notificationPreferences : {};
      if (prefs?.memberEmail) {
        targetEmail = prefs.memberEmail;
      }
    }
  }

  if (targetEmail) {
    emailService.sendOtpEmail({
      to: targetEmail,
      name: targetName,
      otp: code,
      role: role || 'member',
      reason: 'your requested OTP resend',
    }).catch((err) => logger.warn({ err: err.message }, 'Failed to dispatch resent OTP email'));
  }

  return {
    message: 'A fresh 6-digit OTP code has been dispatched.',
  };
};

/**
 * 9. Get User Profile by ID
 */
export const getProfileById = async (id) => {
  const profile = await prisma.profile.findUnique({
    where: { id },
  });
  if (!profile) {
    throw ApiError.notFound('User profile not found.');
  }
  return sanitizeProfile(profile);
};

/**
 * 10. Update User Profile
 */
export const updateProfile = async (id, updateData) => {
  const data = {};
  if (updateData.fullName) data.fullName = updateData.fullName;
  if (updateData.department !== undefined) data.department = updateData.department;
  if (updateData.designation !== undefined) data.designation = updateData.designation;
  if (updateData.preferredLanguage) data.preferredLang = updateData.preferredLanguage;

  const updated = await prisma.profile.update({
    where: { id },
    data,
  });

  return sanitizeProfile(updated);
};

const getCleanClientId = () => env.GOOGLE_CLIENT_ID ? env.GOOGLE_CLIENT_ID.replace(/['"]/g, '').trim() : undefined;
const googleClient = new OAuth2Client(getCleanClientId());

/**
 * 11. Google ID Token / Access Token Verification
 */
export const verifyGoogleCredential = async (credential) => {
  const cleanCredential = (credential || '').trim();

  // Support development test credential
  if (env.NODE_ENV === 'development' && cleanCredential.startsWith('dev_mock_google')) {
    const delimiter = cleanCredential.includes('#') ? '#' : (cleanCredential.includes(':::') ? ':::' : '_');
    const tokens = cleanCredential.replace(/^dev_mock_google[:#_]*/, '').split(delimiter);
    const emailIdent = tokens[1] || 'scholar.assam@gmail.com';
    const email = emailIdent.includes('@') ? emailIdent : `${emailIdent}@gmail.com`;
    const name = tokens[2] ? tokens[2].replace(/[-_]/g, ' ') : 'Google Scholar Member';
    return {
      email,
      name,
      picture: 'https://lh3.googleusercontent.com/a/default-user',
      email_verified: true,
    };
  }

  const cleanId = getCleanClientId();

  // 1. Try google-auth-library ID token verification
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: cleanCredential,
      audience: cleanId || undefined,
    });
    const payload = ticket.getPayload();
    if (payload && payload.email) {
      return payload;
    }
  } catch (libErr) {
    logger.warn({ err: libErr.message }, 'google-auth-library verifyIdToken threw; trying tokeninfo / userinfo fallback');
  }

  // 2. Try Google TokenInfo API (for ID tokens)
  try {
    const res = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(cleanCredential)}`);
    if (res.data && res.data.email) {
      if (cleanId && res.data.aud && res.data.aud !== cleanId) {
        logger.warn({ aud: res.data.aud, expected: cleanId }, 'Google ID token audience mismatch');
      }
      return res.data;
    }
  } catch (tokenInfoErr) {
    logger.warn({ err: tokenInfoErr.message }, 'tokeninfo check failed; trying userinfo endpoint');
  }

  // 3. Try Google UserInfo API (for Access tokens)
  try {
    const userinfoRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${cleanCredential}` },
    });
    if (userinfoRes.data && userinfoRes.data.email) {
      return userinfoRes.data;
    }
  } catch (userinfoErr) {
    logger.error({ err: userinfoErr.message }, 'Google userinfo verification failed');
  }

  throw ApiError.unauthorized('Invalid Google credential token or token expired.');
};

/**
 * 12. Login or Auto-Register with Google (STRICTLY FOR STUDENTS ONLY)
 */
export const loginOrRegisterWithGoogle = async ({ credential, role = 'student' }) => {
  // Reject non-student role requests upfront
  if (role && role !== 'student') {
    throw ApiError.forbidden('Google Authentication is reserved exclusively for Students. Faculty Members and Administrators must sign in with their institutional credentials.');
  }

  const googleUser = await verifyGoogleCredential(credential);

  if (!googleUser || !googleUser.email) {
    throw ApiError.badRequest('Unable to retrieve verified email from Google identity.');
  }

  const normalizedEmail = googleUser.email.toLowerCase().trim();

  // Find existing profile in PostgreSQL
  let profile = await prisma.profile.findUnique({
    where: { email: normalizedEmail },
  });

  // If account already exists but is faculty or admin, prohibit Google Sign-In
  if (profile && profile.role !== 'student') {
    throw ApiError.forbidden('Google Sign-In is only allowed for Students. Faculty members and Administrators must sign in using their institutional Member ID / credentials.');
  }

  // If user does not exist, auto-register them strictly as a student
  if (!profile) {
    profile = await prisma.profile.create({
      data: {
        email: normalizedEmail,
        fullName: googleUser.name || googleUser.given_name || 'Google Student Member',
        role: 'student',
        department: 'Undergraduate / Postgraduate Studies',
        preferredLang: 'en',
        isActive: true,
        isVerified: true,
      },
    });

    logger.info({ email: normalizedEmail }, 'New Student auto-registered via Google Sign-In');
  }

  if (!profile.isActive) {
    throw ApiError.forbidden('Your account has been deactivated. Please contact administration.');
  }

  // Ensure isVerified is true since Google verifies email addresses
  if (!profile.isVerified) {
    profile = await prisma.profile.update({
      where: { id: profile.id },
      data: { isVerified: true },
    });
  }

  const token = generateToken(profile);

  // Send welcome / login notification email upon successful Google sign-in
  emailService.sendWelcomeEmail({
    to: profile.email,
    name: profile.fullName,
    role: 'student',
    loginTime: new Date(),
  }).catch((err) => logger.warn({ err: err.message }, 'Failed to dispatch Google login welcome email'));

  return {
    user: sanitizeProfile(profile),
    token,
    isNewUser: !profile.createdAt || (Date.now() - new Date(profile.createdAt).getTime() < 10000),
  };
};
