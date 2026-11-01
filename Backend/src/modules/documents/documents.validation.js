import { z } from 'zod';

export const uploadDocumentSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title is required'),
    asTitle: z.string().optional(),
    university: z.string().min(2, 'University is required'),
    category: z.string().min(2, 'Category is required'),
    department: z.string().optional().default('Academic Department'),
    academicYear: z.string().optional().default('2024-2025'),
    publicationDate: z.string().optional(),
    summary: z.string().optional(),
    citation: z.string().optional(),
    sourceUrl: z.string().url().optional().or(z.literal('')),
    ocrApplied: z.string().or(z.boolean()).optional().transform(v => v === 'true' || v === true),
  }),
});

export const updateApprovalSchema = z.object({
  body: z.object({
    approvalStatus: z.enum(['approved', 'rejected']),
    adminFeedback: z.string().optional(),
  }),
});

export const documentFilterSchema = z.object({
  query: z.object({
    university: z.string().optional(),
    category: z.string().optional(),
    status: z.enum(['Draft', 'Pending Admin Approval', 'Processing', 'Indexed', 'Archived', 'Rejected']).optional(),
    approvalStatus: z.enum(['pending', 'approved', 'rejected']).optional(),
    department: z.string().optional(),
    search: z.string().optional(),
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('20'),
  }),
});

export const createCategorySchema = z.object({
  body: z.object({
    code: z.string().min(2, 'Category code is required'),
    name_en: z.string().min(2, 'English name is required'),
    name_as: z.string().optional(),
    description: z.string().optional(),
  }),
});
