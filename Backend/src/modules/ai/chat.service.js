import { prisma } from '../../config/prisma.js';
import { resolveGroundedQuery, detectLanguage } from './ai.service.js';
import { ApiError } from '../../utils/apiError.js';
import { logger } from '../../config/logger.js';

/**
 * Handle AI Query execution
 */
export const handleQuery = async (user, { query, sessionId = null, language = null, university = null, category = null }) => {
  const queryLang = language || detectLanguage(query);

  let session = null;
  if (user?.id) {
    if (sessionId) {
      session = await prisma.chatSession.findFirst({
        where: { id: sessionId, user_id: user.id },
      });
    }

    if (!session) {
      const title = query.slice(0, 45) + (query.length > 45 ? '...' : '');
      session = await prisma.chatSession.create({
        data: {
          user_id: user.id,
          title,
          language: queryLang,
        },
      });
    }
  }

  // Retrieve prior messages from session for context if available
  let history = [];
  if (session) {
    const prevMessages = await prisma.chatMessage.findMany({
      where: { session_id: session.id },
      take: 6,
      orderBy: { created_at: 'asc' },
    });
    history = prevMessages.map((m) => ({ role: m.role, content: m.content }));
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
        session_id: session.id,
        role: 'user',
        content: query,
        language: queryLang,
      },
    });

    await prisma.chatMessage.create({
      data: {
        session_id: session.id,
        role: 'assistant',
        content: ragResult.answer,
        language: queryLang,
        source: ragResult.source,
        page: ragResult.page,
        confidence: ragResult.confidence,
        metadata: {
          domain: ragResult.domain,
          isUnverified: ragResult.isUnverified,
        },
      },
    });
  }

  // If unverified, record in UnansweredQuery for administrator review
  if (ragResult.isUnverified) {
    await prisma.unansweredQuery.create({
      data: {
        query_text: query,
        language: queryLang,
        user_id: user?.id || null,
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
  return prisma.chatSession.findMany({
    where: { user_id: userId },
    include: {
      _count: {
        select: { messages: true },
      },
    },
    orderBy: { updated_at: 'desc' },
  });
};

/**
 * Create New Chat Session
 */
export const createSession = async (userId, title = 'New University Consultation') => {
  return prisma.chatSession.create({
    data: {
      user_id: userId,
      title,
    },
  });
};

/**
 * Get Session Messages
 */
export const getSessionMessages = async (sessionId, userId) => {
  const session = await prisma.chatSession.findFirst({
    where: { id: sessionId, user_id: userId },
  });

  if (!session) {
    throw ApiError.notFound('Chat session not found.');
  }

  const messages = await prisma.chatMessage.findMany({
    where: { session_id: sessionId },
    orderBy: { created_at: 'asc' },
  });

  return messages.map((m) => ({
    id: m.id,
    sender: m.role === 'user' ? 'user' : 'ai',
    text: m.content,
    source: m.source,
    page: m.page,
    confidence: m.confidence,
    time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }));
};

/**
 * Delete Chat Session
 */
export const deleteSession = async (sessionId, userId) => {
  const session = await prisma.chatSession.findFirst({
    where: { id: sessionId, user_id: userId },
  });

  if (!session) {
    throw ApiError.notFound('Chat session not found.');
  }

  await prisma.chatMessage.deleteMany({
    where: { session_id: sessionId },
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
  const saved = await prisma.savedAnswer.create({
    data: {
      user_id: userId,
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
    savedAt: new Date(saved.created_at).toLocaleDateString(),
  };
};

/**
 * Get Bookmarked Answers
 */
export const getSavedAnswers = async (userId) => {
  const list = await prisma.savedAnswer.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' },
  });

  return list.map((item) => ({
    id: item.id,
    query: item.query,
    answer: item.answer,
    source: item.source,
    page: item.page,
    category: item.category,
    savedAt: new Date(item.created_at).toLocaleDateString(),
  }));
};

/**
 * Delete Saved Answer
 */
export const deleteSavedAnswer = async (userId, answerId) => {
  const record = await prisma.savedAnswer.findFirst({
    where: { id: answerId, user_id: userId },
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
      user_id: user?.id || null,
      query_text: feedbackData.queryText || 'Query',
      answer_snippet: feedbackData.answerSnippet || '',
      rating: feedbackData.rating || 5,
      feedback_type: feedbackData.type || 'Accurate Citation',
      comments: feedbackData.comments || '',
      university: feedbackData.university || 'General University',
      status: 'pending',
    },
  });

  return {
    id: feedback.id,
    type: feedback.feedback_type,
    status: feedback.status,
    message: 'Feedback received and queued for administrative review.',
  };
};

