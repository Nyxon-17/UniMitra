import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';
import { logger } from './logger.js';

// Public client for user-level interactions
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false
  }
});

// Admin service-role client for backend storage & user provisioning
export const supabaseAdmin = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Storage Bucket Constants
export const STORAGE_BUCKETS = {
  DOCUMENTS: 'unimitra-documents',
  NOTICES: 'unimitra-notices',
  AUDIO: 'unimitra-audio'
};

// Helper: Ensure storage buckets exist
export const ensureStorageBuckets = async () => {
  try {
    const { data: buckets, error } = await supabaseAdmin.storage.listBuckets();
    if (error) {
      logger.warn({ err: error.message }, 'Failed to list Supabase storage buckets (check credentials)');
      return;
    }

    const existingNames = (buckets || []).map(b => b.name);
    for (const bucketName of Object.values(STORAGE_BUCKETS)) {
      if (!existingNames.includes(bucketName)) {
        const { error: createError } = await supabaseAdmin.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 52428800 // 50MB
        });
        if (createError) {
          logger.warn({ bucket: bucketName, err: createError.message }, 'Could not create storage bucket');
        } else {
          logger.info({ bucket: bucketName }, 'Supabase storage bucket initialized');
        }
      }
    }
  } catch (err) {
    logger.warn({ err: err.message }, 'Supabase storage initialization skipped (check SUPABASE_URL)');
  }
};

