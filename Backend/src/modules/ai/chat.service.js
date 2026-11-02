import { prisma } from '../../config/prisma.js';
import { resolveGroundedQuery, detectLanguage } from './ai.service.js';
import { ApiError } from '../../utils/apiError.js';
import { logger } from '../../config/logger.js';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidUuid(id) {
  return typeof id === 'string' && UUID_REGEX.test(id);
}

/**
 * Handle AI Query execution
 */
export const handleQuery = async (user, { query, sessionId = null, language = null, university = null, category = null }) => {
  const queryLang = detectLanguage(query, language);

  let session = null;
  if (user?.id) {
    if (sessionId && isValidUuid(sessionId)) {
      session = await prisma.chatSession.findFirst({
        where: { id: sessionId, userId: user.id },
      });
    }

    if (!session) {
      const title = query.slice(0, 45) + (query.length > 45 ? '...' : '');
      session = await prisma.chatSession.create({
        data: {
          ...(sessionId && isValidUuid(sessionId) ? { id: sessionId } : {}),
          userId: user.id,
          title,
          language: queryLang || 'en',
        },
      });
    }
  }

  // Retrieve prior messages from session for context if available
  let history = [];
  if (session) {
    const prevMessages = await prisma.chatMessage.findMany({
      where: { sessionId: session.id },
      take: 10,
      orderBy: { createdAt: 'asc' },
    });
    history = prevMessages.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    }));
  }

  // Execute RAG Grounding Engine
  const ragResult = await resolveGroundedQuery({
    query,
    userLanguage: queryLang,
    universityCode: university,
    categoryCode: category,
    history,
  });

  // If user is authenticated, persist messages to database
  if (session && user?.id) {
    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        sender: 'user',
        text: query,
      },
    });

    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        sender: 'ai',
        text: ragResult.answer,
        sourceName: ragResult.source || null,
        pageReference: ragResult.page || null,
        confidence: ragResult.confidence || null,
        domain: ragResult.domain || null,
        isUnverified: Boolean(ragResult.isUnverified),
      },
    });

    // Touch session updatedAt
    await prisma.chatSession.update({
      where: { id: session.id },
      data: { updatedAt: new Date() },
    }).catch(() => {});
  }

  // If unverified, record in UnansweredQuery for administrator review
  if (ragResult.isUnverified) {
    await prisma.unansweredQuery.create({
      data: {
        query: query,
        language: queryLang || 'en',
        userId: user?.id && isValidUuid(user.id) ? user.id : null,
        userName: user?.fullName || user?.name || null,
        status: 'pending',
      },
    }).catch((e) => logger.warn({ err: e.message }, 'Failed to record unanswered query'));
  }

  return {
    id: Date.now() + 1,
    sender: 'ai',
    text: ragResult.answer,
    source: ragResult.source,
    page: ragResult.page,
    confidence: ragResult.confidence,
    domain: ragResult.domain,
    isUnverified: ragResult.isUnverified,
    language: ragResult.language,
    sessionId: session?.id || null,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
};

/**
 * Get User Chat Sessions
 */
export const getSessions = async (userId) => {
  if (!isValidUuid(userId)) return [];
  return prisma.chatSession.findMany({
    where: { userId },
    include: {
      _count: {
        select: { messages: true },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });
};

/**
 * Create New Chat Session
 */
export const createSession = async (userId, title = 'New University Consultation') => {
  if (!isValidUuid(userId)) {
    throw ApiError.badRequest('Invalid user identifier.');
  }
  return prisma.chatSession.create({
    data: {
      userId,
      title,
    },
  });
};

/**
 * Get Session Messages
 */
export const getSessionMessages = async (sessionId, userId) => {
  if (!isValidUuid(sessionId) || !isValidUuid(userId)) {
    return [];
  }
  const session = await prisma.chatSession.findFirst({
    where: { id: sessionId, userId },
  });

  if (!session) {
    throw ApiError.notFound('Chat session not found.');
  }

  const messages = await prisma.chatMessage.findMany({
    where: { sessionId },
    orderBy: { createdAt: 'asc' },
  });

  return messages.map((m) => ({
    id: m.id,
    sender: m.sender,
    text: m.text,
    source: m.sourceName,
    page: m.pageReference,
    confidence: m.confidence,
    isUnverified: m.isUnverified,
    time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }));
};

/**
 * Delete Chat Session
 */
export const deleteSession = async (sessionId, userId) => {
  if (!isValidUuid(sessionId) || !isValidUuid(userId)) {
    return { id: sessionId, deleted: true };
  }
  const session = await prisma.chatSession.findFirst({
    where: { id: sessionId, userId },
  });

  if (!session) {
    throw ApiError.notFound('Chat session not found.');
  }

  await prisma.chatMessage.deleteMany({
    where: { sessionId },
  });

  await prisma.chatSession.delete({
    where: { id: sessionId },
  });

  return { id: sessionId, deleted: true };
};

/**
 * Bookmark / Save Answer
 */
export const saveAnswer = async (userId, { query, answer, source, page, category }) => {
  if (!isValidUuid(userId)) {
    throw ApiError.badRequest('Invalid user identifier.');
  }
  const saved = await prisma.savedAnswer.create({
    data: {
      userId,
      query,
      answer,
      source: source || 'Institutional Gazette',
      page: page || 'Statutory Clause',
      category: category || 'Academic Regulation',
    },
  });

  return {
    id: saved.id,
    query: saved.query,
    answer: saved.answer,
    source: saved.source,
    page: saved.page,
    category: saved.category,
    savedAt: new Date(saved.createdAt).toLocaleDateString(),
  };
};

/**
 * Get Bookmarked Answers
 */
export const getSavedAnswers = async (userId) => {
  if (!isValidUuid(userId)) return [];
  const list = await prisma.savedAnswer.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return list.map((item) => ({
    id: item.id,
    query: item.query,
    answer: item.answer,
    source: item.source,
    page: item.page,
    category: item.category,
    savedAt: new Date(item.createdAt).toLocaleDateString(),
  }));
};

/**
 * Delete Saved Answer
 */
export const deleteSavedAnswer = async (userId, answerId) => {
  if (!isValidUuid(userId) || !isValidUuid(answerId)) {
    return { id: answerId, deleted: true };
  }
  const record = await prisma.savedAnswer.findFirst({
    where: { id: answerId, userId },
  });

  if (!record) {
    throw ApiError.notFound('Saved answer not found.');
  }

  await prisma.savedAnswer.delete({
    where: { id: answerId },
  });

  return { id: answerId, deleted: true };
};

/**
 * Submit Answer Feedback / Accuracy Report
 */
export const submitFeedback = async (user, feedbackData) => {
  const feedback = await prisma.feedbackSubmission.create({
    data: {
      userId: user?.id && isValidUuid(user.id) ? user.id : null,
      userName: user?.fullName || user?.name || null,
      userRole: user?.role || 'student',
      type: feedbackData.type || 'Accurate Citation',
      rating: feedbackData.rating ? Number(feedbackData.rating) : 5,
      comments: feedbackData.comments || '',
      answerSnippet: feedbackData.answerSnippet || '',
      universityName: feedbackData.university || 'General University',
      status: 'Pending Admin Review',
    },
  });

  return {
    id: feedback.id,
    type: feedback.type,
    status: feedback.status,
    message: 'Feedback received and queued for administrative review.',
  };
};
