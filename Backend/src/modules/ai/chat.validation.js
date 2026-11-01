import { z } from 'zod';

export const querySchema = z.object({
  body: z.object({
    query: z.string().min(2, 'Query cannot be empty'),
    sessionId: z.string().uuid().optional(),
    language: z.enum(['en', 'as']).optional(),
    university: z.string().optional(),
    category: z.string().optional(),
  }),
});

export const saveAnswerSchema = z.object({
  body: z.object({
    query: z.string().min(2, 'Query is required'),
    answer: z.string().min(2, 'Answer is required'),
    source: z.string().optional(),
    page: z.string().optional(),
    category: z.string().optional(),
  }),
});

export const feedbackSchema = z.object({
  body: z.object({
    queryText: z.string().optional(),
    answerSnippet: z.string().optional(),
    rating: z.number().min(1).max(5).optional(),
    type: z.string().optional().default('Accurate Citation'),
    comments: z.string().optional(),
    university: z.string().optional(),
  }),
});

