import { prisma } from '../../config/prisma.js';

export const getUserNotifications = async (userId) => {
  const notifications = await prisma.notification.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' },
    take: 30,
  });

  return notifications.map((n) => ({
    id: n.id,
    title: n.title,
    message: n.message,
    type: n.type,
    isRead: n.is_read,
    link: n.link,
    createdAt: n.created_at,
  }));
};

export const markAsRead = async (id, userId) => {
  return prisma.notification.updateMany({
    where: { id, user_id: userId },
    data: { is_read: true },
  });
};

export const markAllAsRead = async (userId) => {
  return prisma.notification.updateMany({
    where: { user_id: userId, is_read: false },
    data: { is_read: true },
  });
};

