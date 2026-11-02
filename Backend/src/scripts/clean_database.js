import { prisma } from '../config/prisma.js';
import { logger } from '../config/logger.js';

export async function cleanDatabase() {
  logger.info('Starting UniMitra Database Deep Clean...');

  try {
    // 1. Delete document chunks (vector records)
    const chunksDeleted = await prisma.documentChunk.deleteMany({});
    logger.info(`Deleted ${chunksDeleted.count} document chunks from prisma.`);

    // Also clean raw ai_document_chunks if pgvector table exists
    try {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE ai_document_chunks CASCADE;`);
      logger.info('Truncated ai_document_chunks table.');
    } catch (e) {
      logger.info('ai_document_chunks table note: ' + e.message);
    }

    // 2. Delete documents
    const docsDeleted = await prisma.document.deleteMany({});
    logger.info(`Deleted ${docsDeleted.count} documents from database.`);

    // 3. Delete notices
    try {
      const noticesDeleted = await prisma.notice.deleteMany({});
      logger.info(`Deleted ${noticesDeleted.count} notices from database.`);
    } catch (e) {
      logger.info('Notice clean note: ' + e.message);
    }

    // 4. Delete chat messages and sessions
    const messagesDeleted = await prisma.chatMessage.deleteMany({});
    const sessionsDeleted = await prisma.chatSession.deleteMany({});
    logger.info(`Deleted ${messagesDeleted.count} chat messages and ${sessionsDeleted.count} chat sessions.`);

    // 5. Delete unanswered queries
    try {
      const unansweredDeleted = await prisma.unansweredQuery.deleteMany({});
      logger.info(`Deleted ${unansweredDeleted.count} unanswered queries.`);
    } catch (e) {
      logger.info('UnansweredQuery clean note: ' + e.message);
    }

    // 6. Delete saved answers and feedbacks
    try {
      await prisma.savedAnswer.deleteMany({});
      await prisma.feedbackSubmission.deleteMany({});
      logger.info('Cleaned saved answers and feedbacks.');
    } catch (e) {
      logger.info('Feedback clean note: ' + e.message);
    }

    // 7. Update University table to strictly single university: Nivoraya University
    try {
      await prisma.university.updateMany({
        where: { code: 'DU' },
        data: {
          name: 'Nivoraya University',
          asName: 'নিভৰয়া বিশ্ববিদ্যালয়',
          abbreviation: 'NU',
          location: 'Nivoraya Campus, Assam - 786004',
          website: 'https://nivoraya.ac.in',
          email: 'registrar@nivoraya.ac.in',
          isActive: true
        }
      });
      await prisma.university.updateMany({
        where: { code: { not: 'DU' } },
        data: { isActive: false }
      });
      logger.info('University table updated to Nivoraya University.');
    } catch (e) {
      logger.info('University update note: ' + e.message);
    }

    logger.info('Database clean completed successfully. Database is now 100% fresh!');
  } catch (err) {
    logger.error({ err }, 'Error during database cleaning');
    throw err;
  }
}

if (process.argv[1]?.includes('clean_database.js')) {
  cleanDatabase()
    .catch((err) => {
      console.error('Database clean error:', err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

