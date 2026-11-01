import { z } from 'zod';

export const createNoticeSchema = z.object({
  body: z.object({
    title_en: z.string().min(3, 'English title is required'),
    title_as: z.string().optional(),
    content_en: z.string().min(5, 'English content is required'),
    content_as: z.string().optional(),
    category: z.string().optional().default('General Notice'),
    university: z.string().optional(),
    is_pinned: z.string().or(z.boolean()).optional().transform(v => v === 'true' || v === true),
    source_url: z.string().url().optional().or(z.literal('')),
  }),
});

export const updateNoticeSchema = z.object({
  body: z.object({
    title_en: z.string().min(3).optional(),
    title_as: z.string().optional(),
    content_en: z.string().min(5).optional(),
    content_as: z.string().optional(),
    category: z.string().optional(),
    is_pinned: z.boolean().optional(),
    is_active: z.boolean().optional(),
  }),
});

