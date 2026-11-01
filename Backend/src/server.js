import app from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { prisma } from './config/prisma.js';
import { ensureStorageBuckets } from './config/supabase.js';

let server;

async function bootstrap() {
  try {
    logger.info('Initializing UniMitra Backend Gateway...');

    // 1. Verify Prisma / PostgreSQL Connection
    try {
      await prisma.$connect();
      logger.info('Connected to PostgreSQL Database via Prisma successfully.');
    } catch (dbErr) {
      logger.warn({ err: dbErr.message }, 'Database connection notice: Continuing in offline/mock mode if DB is pending setup.');
    }

    // 2. Initialize Supabase Storage buckets if configured
    try {
      await ensureStorageBuckets();
    } catch (storageErr) {
      logger.warn({ err: storageErr.message }, 'Supabase Storage initialization skipped or deferred.');
    }

    // 3. Start Express HTTP Server
    server = app.listen(env.PORT, () => {
      logger.info(
        `UniMitra API Gateway is listening on port ${env.PORT} in [${env.NODE_ENV}] mode.`
      );
      logger.info(`Health check endpoint: http://localhost:${env.PORT}/health`);
      logger.info(`Auth API endpoints: http://localhost:${env.PORT}/api/v1/auth`);
    });

  } catch (error) {
    logger.fatal({ err: error }, 'Failed to start server');
    process.exit(1);
  }
}

// Graceful shutdown handling
const gracefulShutdown = async (signal) => {
  logger.info(`${signal} signal received. Initiating graceful shutdown...`);

  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed.');
      try {
        await prisma.$disconnect();
        logger.info('Prisma client disconnected.');
      } catch (err) {
        logger.error({ err }, 'Error during Prisma disconnect.');
      }
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

bootstrap();
