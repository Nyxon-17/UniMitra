import { z } from 'zod';

export const querySchema = z.object({
  body: z.object({
    query: z.string().min(1, 'Query cannot be empty'),
    sessionId: z.string().optional().nullable(),
    language: z.string().optional().nullable(),
    university: z.string().optional().nullable(),
    category: z.string().optional().nullable(),
  }),
});

export const saveAnswerSchema = z.object({
  body: z.object({
    query: z.string().min(2, 'Query is required'),
    answer: z.string().min(2, 'Answer is required'),
    source: z.string().optional().nullable(),
    page: z.string().optional().nullable(),
    category: z.string().optional().nullable(),
  }),
});

export const feedbackSchema = z.object({
  body: z.object({
    queryText: z.string().optional().nullable(),
    answerSnippet: z.string().optional().nullable(),
    rating: z.number().min(1).max(5).optional(),
    type: z.string().optional().default('Accurate Citation'),
    comments: z.string().optional().nullable(),
    university: z.string().optional().nullable(),
  }),
});
