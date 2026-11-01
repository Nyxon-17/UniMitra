import * as authService from './auth.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { env } from '../../config/env.js';

// Helper to set HTTP-only auth cookie
const setAuthCookie = (res, token) => {
  const isProd = env.NODE_ENV === 'production';
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: '/',
  });
};

/**
 * Student Registration
 * POST /api/v1/auth/student/register
 */
export const registerStudent = async (req, res, next) => {
  try {
    const result = await authService.registerStudent(req.body);
    if (result.token) {
      setAuthCookie(res, result.token);
    }
    return ApiResponse.created(res, result, 'Student registered successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * Student OTP Verification
 * POST /api/v1/auth/student/verify-otp
 */
export const verifyStudentOtp = async (req, res, next) => {
  try {
    const result = await authService.verifyStudentOtp(req.body);
    setAuthCookie(res, result.token);
    return ApiResponse.success(res, result, 'Student OTP verified successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * Google Authentication (One-Tap / Sign-In Button)
 * POST /api/v1/auth/google
 */
export const loginGoogle = async (req, res, next) => {
  try {
    const result = await authService.loginOrRegisterWithGoogle(req.body);
    setAuthCookie(res, result.token);
    return ApiResponse.success(res, result, 'Google authentication successful.');
  } catch (err) {
    next(err);
  }
};

/**
 * Student Login
 * POST /api/v1/auth/student/login
 */
export const loginStudent = async (req, res, next) => {
  try {
    const result = await authService.loginStudent(req.body);
    setAuthCookie(res, result.token);
    return ApiResponse.success(res, result, 'Student logged in successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * Faculty Registration
 * POST /api/v1/auth/faculty/register
 */
export const registerFaculty = async (req, res, next) => {
  try {
    const result = await authService.registerFaculty(req.body);
    return ApiResponse.created(res, result, result.message);
  } catch (err) {
    next(err);
  }
};

/**
 * Faculty Login (Step 1: Credentials)
 * POST /api/v1/auth/faculty/login
 */
export const loginFaculty = async (req, res, next) => {
  try {
    const result = await authService.loginFacultyCredentials(req.body);
    return ApiResponse.success(res, result, result.message);
  } catch (err) {
    next(err);
  }
};

/**
 * Faculty OTP Verification (Step 2)
 * POST /api/v1/auth/faculty/verify-otp
 */
export const verifyFacultyOtp = async (req, res, next) => {
  try {
    const result = await authService.verifyFacultyOtp(req.body);
    setAuthCookie(res, result.token);
    return ApiResponse.success(res, result, 'Faculty authentication verified.');
  } catch (err) {
    next(err);
  }
};

/**
 * Admin Login (Step 1: Credentials)
 * POST /api/v1/auth/admin/login
 */
export const loginAdmin = async (req, res, next) => {
  try {
    const result = await authService.loginAdminCredentials(req.body);
    return ApiResponse.success(res, result, result.message);
  } catch (err) {
    next(err);
  }
};

/**
 * Admin OTP Verification (Step 2)
 * POST /api/v1/auth/admin/verify-otp
 */
export const verifyAdminOtp = async (req, res, next) => {
  try {
    const result = await authService.verifyAdminOtp(req.body);
    setAuthCookie(res, result.token);
    return ApiResponse.success(res, result, 'Admin authentication verified.');
  } catch (err) {
    next(err);
  }
};

/**
 * Generic OTP Resend
 * POST /api/v1/auth/otp/resend
 */
export const resendOtp = async (req, res, next) => {
  try {
    const result = await authService.resendOtp(req.body);
    return ApiResponse.success(res, result, result.message);
  } catch (err) {
    next(err);
  }
};

/**
 * Current User Profile
 * GET /api/v1/auth/me
 */
export const getCurrentUser = async (req, res, next) => {
  try {
    const profile = await authService.getProfileById(req.user.id);
    return ApiResponse.success(res, { user: profile }, 'Profile retrieved.');
  } catch (err) {
    next(err);
  }
};

/**
 * Update Current Profile
 * PATCH /api/v1/auth/me
 */
export const updateCurrentUser = async (req, res, next) => {
  try {
    const updated = await authService.updateProfile(req.user.id, req.body);
    return ApiResponse.success(res, { user: updated }, 'Profile updated successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * Logout
 * POST /api/v1/auth/logout
 */
export const logout = async (req, res) => {
  res.clearCookie('token', { path: '/' });
  return ApiResponse.success(res, null, 'Signed out successfully.');
};

