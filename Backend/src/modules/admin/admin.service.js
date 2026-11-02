import { prisma } from '../../config/prisma.js';
import { ApiError } from '../../utils/apiError.js';
import { sanitizeProfile } from '../auth/auth.service.js';

/**
 * 1. Admin System Analytics Overview
 */
export const getSystemAnalytics = async () => {
  const [
    totalUsers,
    totalStudents,
    totalFaculty,
    totalDocuments,
    indexedDocuments,
    pendingDocuments,
    totalNotices,
    totalQueries,
    unansweredCount,
    feedbackCount,
  ] = await Promise.all([
    prisma.profile.count(),
    prisma.profile.count({ where: { role: 'student' } }),
    prisma.profile.count({ where: { role: 'faculty' } }),
    prisma.document.count(),
    prisma.document.count({ where: { status: 'Indexed' } }),
    prisma.document.count({ where: { approvalStatus: 'pending' } }),
    prisma.notice.count(),
    prisma.chatMessage.count({ where: { sender: 'user' } }),
    prisma.unansweredQuery.count({ where: { status: { in: ['Unanswered', 'pending'] } } }),
    prisma.feedbackSubmission.count(),
  ]);

  return {
    overview: {
      totalUsers,
      totalStudents,
      totalFaculty,
      totalDocuments,
      indexedDocuments,
      pendingDocuments,
      totalNotices,
      totalQueries,
      unansweredCount,
      feedbackCount,
    },
    topAskedTopics: [],
  };
};

/**
 * 2. Unanswered Queries Queue
 */
export const getUnansweredQueries = async () => {
  const list = await prisma.unansweredQuery.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return list.map((item) => ({
    id: item.id,
    query: item.query,
    language: item.language,
    status: item.status,
    attemptedAt: new Date(item.createdAt).toLocaleString(),
    reason: 'No statutory clause currently indexed for this query.',
  }));
};

/**
 * 3. Resolve Unanswered Query
 */
export const resolveUnansweredQuery = async (id, status = 'resolved') => {
  return prisma.unansweredQuery.update({
    where: { id },
    data: { status, resolvedAt: new Date() },
  });
};

/**
 * 4. User Feedback List
 */
export const getFeedbackList = async () => {
  const list = await prisma.feedbackSubmission.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return list.map((fb) => ({
    id: fb.id,
    user: fb.userName || fb.user?.fullName || 'Anonymous Student',
    role: fb.userRole || fb.user?.role || 'Student',
    query: fb.comments || fb.answerSnippet || fb.type,
    answerSnippet: fb.answerSnippet,
    rating: fb.rating,
    type: fb.type,
    comments: fb.comments,
    status: fb.status === 'resolved' || fb.status === 'Resolved' ? 'Reviewed & Resolved' : (fb.status || 'Pending Review'),
    submittedAt: new Date(fb.createdAt).toLocaleString(),
  }));
};

/**
 * 5. Update Feedback Status
 */
export const updateFeedbackStatus = async (id, status = 'resolved') => {
  return prisma.feedbackSubmission.update({
    where: { id },
    data: { status },
  });
};

/**
 * 6. User Management
 */
export const getUsers = async ({ role = null, search = null, page = 1, limit = 20 }) => {
  const where = {};
  if (role) where.role = role;
  if (search && search.trim()) {
    const q = search.trim();
    where.OR = [
      { fullName: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
      { memberId: { contains: q, mode: 'insensitive' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const [total, users] = await Promise.all([
    prisma.profile.count({ where }),
    prisma.profile.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return {
    items: users.map(sanitizeProfile),
    total,
    page: Number(page),
    limit: Number(limit),
  };
};

/**
 * 7. Update User Role & Status
 */
export const updateUserRole = async (userId, newRole) => {
  const updated = await prisma.profile.update({
    where: { id: userId },
    data: { role: newRole },
  });
  return sanitizeProfile(updated);
};

export const toggleUserStatus = async (userId) => {
  const user = await prisma.profile.findUnique({ where: { id: userId } });
  if (!user) throw ApiError.notFound('User not found.');

  const updated = await prisma.profile.update({
    where: { id: userId },
    data: { isActive: !user.isActive },
  });
  return sanitizeProfile(updated);
};

/**
 * 8. System Settings
 */
export const getSystemSettings = async () => {
  const settings = await prisma.systemSetting.findMany();
  const config = {};
  for (const s of settings) {
    config[s.key] = s.value;
  }
  return config;
};

export const updateSystemSetting = async (key, value) => {
  return prisma.systemSetting.upsert({
    where: { key },
    update: { value: String(value) },
    create: { key, value: String(value) },
  });
};

/**
 * 9. Audit Logs
 */
export const getAuditLogs = async (limit = 50) => {
  const logs = await prisma.auditLog.findMany({
    include: { actor: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return logs.map((l) => ({
    id: l.id,
    action: l.action,
    entity: l.entityType,
    entityId: l.entityId,
    user: l.actor?.fullName || 'System',
    ipAddress: l.ipAddress,
    timestamp: l.createdAt,
  }));
};
