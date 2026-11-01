import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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
    name: user.full_name || user.fullName,
    memberId: user.member_id || user.memberId || null,
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
      where: { member_id: memberId },
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
  const { password_hash, ...safeUser } = profile;
  return {
    id: safeUser.id,
    fullName: safeUser.full_name,
    email: safeUser.email,
    role: safeUser.role,
    memberId: safeUser.member_id,
    department: safeUser.department,
    designation: safeUser.designation,
    preferredLanguage: safeUser.preferred_language,
    avatarUrl: safeUser.avatar_url,
    isActive: safeUser.is_active,
    createdAt: safeUser.created_at,
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

  // Store student in pending state or create directly with is_active = true
  const profile = await prisma.profile.create({
    data: {
      email: normalizedEmail,
      full_name: fullName.trim(),
      password_hash: passwordHash,
      role: 'student',
      preferred_language: preferredLanguage,
      department: 'Undergraduate / Postgraduate Studies',
      is_active: true,
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

  const isMatch = await bcrypt.compare(password, profile.password_hash);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password.');
  }

  if (!profile.is_active) {
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
      member_id: memberId,
      full_name: fullName.trim(),
      password_hash: passwordHash,
      role: 'faculty',
      department,
      designation,
      preferred_language: preferredLanguage,
      is_active: true,
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
        { member_id: trimmedId },
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

  const isMatch = await bcrypt.compare(password, profile.password_hash);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid Member ID or password.');
  }

  if (!profile.is_active) {
    throw ApiError.forbidden('Your faculty account has been deactivated.');
  }

  // Issue OTP for 2-step verification step required by the UI
  const otp = saveOtp(profile.member_id || profile.email, 'faculty', { profileId: profile.id });

  return {
    requiresOtp: true,
    memberId: profile.member_id,
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
        { member_id: identifier },
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
        full_name: 'System Administrator',
        password_hash: passwordHash,
        role: 'super_admin',
        department: 'Institutional Governance',
        designation: 'Chief Administrator',
        is_active: true,
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

  const isMatch = await bcrypt.compare(password, admin.password_hash);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid Administrator credentials.');
  }

  const otp = saveOtp(admin.email, 'admin', { profileId: admin.id });

  return {
    requiresOtp: true,
    email: admin.email,
    name: admin.full_name,
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
  if (updateData.fullName) data.full_name = updateData.fullName;
  if (updateData.avatarUrl !== undefined) data.avatar_url = updateData.avatarUrl;
  if (updateData.department !== undefined) data.department = updateData.department;
  if (updateData.designation !== undefined) data.designation = updateData.designation;
  if (updateData.preferredLanguage) data.preferred_language = updateData.preferredLanguage;

  const updated = await prisma.profile.update({
    where: { id },
    data,
  });

  return sanitizeProfile(updated);
};
