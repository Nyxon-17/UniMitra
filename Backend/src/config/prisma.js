import { PrismaClient } from '@prisma/client';
import { env } from './env.js';
import { logger } from './logger.js';

let prisma;

if (env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient({
      log: ['warn', 'error']
    });
  }
  prisma = global.__prisma;
}

export default prisma;
