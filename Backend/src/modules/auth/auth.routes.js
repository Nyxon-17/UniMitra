import { Router } from 'express';
import * as authController from './auth.controller.js';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/auth.js';
import { authLimiter } from '../../middleware/rateLimiter.js';
import {
  studentRegisterSchema,
  studentLoginSchema,
  facultyRegisterSchema,
  facultyLoginSchema,
  adminLoginSchema,
  verifyOtpSchema,
  resendOtpSchema,
  updateProfileSchema,
} from './auth.validation.js';

const router = Router();

// Apply auth rate limiter to public authentication endpoints
router.post('/student/register', authLimiter, validate(studentRegisterSchema), authController.registerStudent);
router.post('/student/login', authLimiter, validate(studentLoginSchema), authController.loginStudent);

router.post('/faculty/register', authLimiter, validate(facultyRegisterSchema), authController.registerFaculty);
router.post('/faculty/login', authLimiter, validate(facultyLoginSchema), authController.loginFaculty);
router.post('/faculty/verify-otp', authLimiter, validate(verifyOtpSchema), authController.verifyFacultyOtp);

router.post('/admin/login', authLimiter, validate(adminLoginSchema), authController.loginAdmin);
router.post('/admin/verify-otp', authLimiter, validate(verifyOtpSchema), authController.verifyAdminOtp);

router.post('/otp/resend', authLimiter, validate(resendOtpSchema), authController.resendOtp);

// Authenticated user profile routes
router.get('/me', authenticate, authController.getCurrentUser);
router.patch('/me', authenticate, validate(updateProfileSchema), authController.updateCurrentUser);
router.post('/logout', authController.logout);

export default router;

