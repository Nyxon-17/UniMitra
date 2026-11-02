import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import { prisma } from '../../config/prisma.js';
import { env } from '../../config/env.js';
import { ApiError } from '../../utils/apiError.js';
import { logger } from '../../config/logger.js';

// In-memory OTP storage with TTL (5 minutes)
// Key: identifier (email or memberId), Value: { otp: string, expiresAt: number, role?: string, tempUser?: any }
const otpStore = new Map();

/**
 * Generate a random 6-digit OTP
 */
const generateOtpCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Set OTP for an identifier (5 minutes expiry)
 */
export const saveOtp = (identifier, role = null, tempUser = null) => {
  const code = env.NODE_ENV === 'development' ? '123456' : generateOtpCode();
  const expiresAt = Date.now() + 5 * 60 * 1000;
  otpStore.set(identifier.toLowerCase(), { otp: code, expiresAt, role, tempUser });
  logger.info({ identifier, code }, 'OTP generated for user');
  return code;
};

/**
 * Verify OTP
 */
export const verifyOtpCode = (identifier, code) => {
  const record = otpStore.get(identifier.toLowerCase());
  if (!record) {
    // In dev mode, allow default demo OTP 123456 as fallback
    if (env.NODE_ENV === 'development' && code === '123456') {
      return { success: true };
    }
    return { success: false, reason: 'OTP expired or not found. Please request a new one.' };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(identifier.toLowerCase());
    return { success: false, reason: 'OTP has expired. Please request a new one.' };
  }

  if (record.otp !== code && !(env.NODE_ENV === 'development' && code === '123456')) {
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

  return {
    user: sanitizeProfile(profile),
    token,
    otpSent: true,
    ...(env.NODE_ENV === 'development' ? { devOtp: otp } : {}),
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
  facultyId,
  department,
  designation,
  password,
  preferredLanguage = 'en',
}) => {
  const normalizedEmail = officialEmail.toLowerCase().trim();

  const existing = await prisma.profile.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    throw ApiError.conflict('An account with this official email address already exists.');
  }

  const memberId = await generateUniqueMemberId();
  const passwordHash = await bcrypt.hash(password, 10);

  const profile = await prisma.profile.create({
    data: {
      email: normalizedEmail,
      memberId,
      facultyId: facultyId || 'FAC-INST',
      fullName: fullName.trim(),
      passwordHash,
      role: 'faculty',
      department,
      designation,
      preferredLang: preferredLanguage,
      isActive: true,
      isVerified: true,
    },
  });

  return {
    memberId,
    user: sanitizeProfile(profile),
    message: `Faculty account registered! Your unique Member ID is ${memberId}.`,
  };
};

/**
 * 4. Step 1: Faculty Login by Member ID and Password
 */
export const loginFacultyCredentials = async ({ memberId, password }) => {
  const trimmedId = memberId.trim();

  const profile = await prisma.profile.findFirst({
    where: {
      OR: [
        { memberId: trimmedId },
        { email: trimmedId.toLowerCase() },
      ],
    },
  });

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

  const otp = saveOtp(profile.memberId || profile.email, 'faculty', { profileId: profile.id });

  return {
    requiresOtp: true,
    memberId: profile.memberId,
    email: profile.email,
    message: 'Credentials verified. Please enter the 6-digit OTP code.',
    ...(env.NODE_ENV === 'development' ? { devOtp: otp } : {}),
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

  const profile = await prisma.profile.findFirst({
    where: {
      OR: [
        { memberId: identifier },
        { email: identifier.toLowerCase() },
      ],
    },
  });

  if (!profile) {
    throw ApiError.notFound('Faculty profile not found.');
  }

  const token = generateToken(profile);

  return {
    user: sanitizeProfile(profile),
    token,
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

  return {
    requiresOtp: true,
    email: admin.email,
    name: admin.fullName,
    message: 'Admin credentials accepted. Please verify with the 6-digit OTP code.',
    ...(env.NODE_ENV === 'development' ? { devOtp: otp } : {}),
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
  return {
    message: 'A fresh 6-digit OTP code has been dispatched.',
    ...(env.NODE_ENV === 'development' ? { devOtp: code } : {}),
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

  return {
    user: sanitizeProfile(profile),
    token,
    isNewUser: !profile.createdAt || (Date.now() - new Date(profile.createdAt).getTime() < 10000),
  };
};
