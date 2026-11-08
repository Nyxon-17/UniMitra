import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from cwd as well as Backend root
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

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
  SUPER_ADMIN_NAME: z.string().default('Super Administrator'),
  SUPER_ADMIN_EMAIL: z.string().default('admin@unimitra.edu.in'),
  SUPER_ADMIN_PASSWORD: z.string().default('admin@unimitra'),
  AI_SERVICE_URL: z.string().url().default('http://localhost:8000'),
  AI_SERVICE_SECRET: z.string().default('unimitra_internal_ai_secret_2026'),
  CORS_ORIGIN: z.string().default('http://localhost:5173,http://localhost:3000'),
  GOOGLE_CLIENT_ID: z.string().optional().default(''),
  BAKBAK_API_KEY: z.string().default('eX2lWnCNyy6JtU6KgUhBC4rpE6o8Bluw'),
  SARVAM_API_KEY: z.string().default('sk_rpxvjns7_HBb8Pp89bNVWzfv4mCWpSlkC'),
  SARVAM_BASE_URL: z.string().default('https://api.sarvam.ai'),
  GEMINI_API_KEY: z.string().default(''),
  // Brevo SMTP Config
  SMTP_HOST: z.string().default('smtp-relay.brevo.com'),
  SMTP_PORT: z.string().default('587').transform(Number),
  SMTP_SECURE: z.union([z.string(), z.boolean()]).default('false').transform(val => val === true || val === 'true'),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASS: z.string().optional().default(''),
  SENDER_EMAIL: z.string().optional().default('yourappmail.co@gmail.com'),
  EMAIL_FROM: z.string().optional().default('"UniMitra" <yourappmail.co@gmail.com>'),
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
