import { z } from 'zod';

export const studentRegisterSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    preferredLanguage: z.enum(['en', 'as']).default('en').optional(),
  }),
});

export const studentLoginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().optional(),
  }),
});

export const facultyRegisterSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    officialEmail: z.string().email('Invalid official email address'),
    facultyId: z.string().optional().default('FAC-INST'),
    department: z.string().min(2, 'Department is required'),
    designation: z.string().min(2, 'Designation is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    preferredLanguage: z.enum(['en', 'as']).default('en').optional(),
  }),
});

export const facultyLoginSchema = z.object({
  body: z.object({
    memberId: z.string().min(3, 'Member ID is required'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const adminLoginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid admin email'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    identifier: z.string().min(1, 'Email or Member ID is required'),
    otp: z.string().length(6, 'OTP must be 6 digits'),
    role: z.enum(['student', 'faculty', 'admin', 'super_admin']).optional(),
  }),
});

export const resendOtpSchema = z.object({
  body: z.object({
    identifier: z.string().min(1, 'Email or Member ID is required'),
    role: z.enum(['student', 'faculty', 'admin']).optional(),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).optional(),
    avatarUrl: z.string().url().optional().nullable(),
    department: z.string().optional().nullable(),
    designation: z.string().optional().nullable(),
    preferredLanguage: z.enum(['en', 'as']).optional(),
  }),
});

export const googleAuthSchema = z.object({
  body: z.object({
    credential: z.string().min(1, 'Google credential token is required'),
    role: z.enum(['student']).optional().default('student'),
  }),
});

