import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000').transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/postgres?schema=public'),
  DIRECT_URL: z.string().optional(),
  SUPABASE_URL: z.string().url().default('https://example.supabase.co'),
  SUPABASE_ANON_KEY: z.string().default('placeholder-anon-key'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().default('placeholder-service-role-key'),
  JWT_SECRET: z.string().min(8).default('unimitra-super-secret-jwt-key-change-in-production-2026'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  AI_SERVICE_URL: z.string().url().default('http://localhost:8000'),
  AI_SERVICE_SECRET: z.string().default('unimitra_internal_ai_secret_2026'),
  CORS_ORIGIN: z.string().default('http://localhost:5173,http://localhost:3000'),
  GOOGLE_CLIENT_ID: z.string().optional().default(''),
  BAKBAK_API_KEY: z.string().default('eX2lWnCNyy6JtU6KgUhBC4rpE6o8Bluw'),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('Environment validation error:', result.error.format());
    // Fallback to defaults in dev
    return envSchema.parse({});
  }
  return result.data;
};

export const env = parseEnv();
