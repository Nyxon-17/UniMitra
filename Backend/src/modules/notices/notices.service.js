import { prisma } from '../../config/prisma.js';
import { ApiError } from '../../utils/apiError.js';

export const getNotices = async ({ university = null, category = null, search = null, page = 1, limit = 20 }) => {
  const where = { isActive: true };

  if (category && category !== 'all' && category !== 'All Categories') {
    where.category = { contains: category, mode: 'insensitive' };
  }

  if (university && university !== 'all' && university !== 'All Universities') {
    where.OR = [
      { university: { code: { equals: university, mode: 'insensitive' } } },
      { university: { name: { contains: university, mode: 'insensitive' } } },
      { universityName: { contains: university, mode: 'insensitive' } },
    ];
  }

  if (search && search.trim()) {
    const q = search.trim();
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { asTitle: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
      { asDescription: { contains: q, mode: 'insensitive' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const [total, notices] = await Promise.all([
    prisma.notice.count({ where }),
    prisma.notice.findMany({
      where,
      skip,
      take,
      include: { university: true },
      orderBy: [{ publicationDate: 'desc' }, { createdAt: 'desc' }],
    }),
  ]);

  return {
    items: notices.map((n) => ({
      id: n.id,
      title: n.title,
      asTitle: n.asTitle || n.title,
      content: n.description,
      description: n.description,
      asContent: n.asDescription || n.description,
      asDescription: n.asDescription || n.description,
      category: n.category || 'General Notice',
      importance: n.importance || 'Normal',
      university: n.university?.name || n.universityName || 'Nivoraya University',
      universityCode: n.university?.code || 'NU',
      attachmentUrl: n.attachmentUrl,
      fileName: n.fileName,
      deadline: n.deadline ? new Date(n.deadline).toISOString() : null,
      isPinned: n.importance === 'High' || n.importance === 'Urgent',
      publishedAt: n.publicationDate
        ? new Date(n.publicationDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        : 'Official Notice',
      createdAt: n.createdAt,
    })),
    total,
    page: Number(page),
    limit: Number(limit),
  };
};

export const getNoticeById = async (id) => {
  const notice = await prisma.notice.findUnique({
    where: { id },
    include: { university: true },
  });

  if (!notice) {
    throw ApiError.notFound('Notice not found.');
  }

  return {
    id: notice.id,
    title: notice.title,
    asTitle: notice.asTitle || notice.title,
    content: notice.description,
    description: notice.description,
    asContent: notice.asDescription || notice.description,
    category: notice.category,
    importance: notice.importance,
    university: notice.university?.name || notice.universityName || 'Nivoraya University',
    universityCode: notice.university?.code || 'NU',
    attachmentUrl: notice.attachmentUrl,
    fileName: notice.fileName,
    deadline: notice.deadline,
    isPinned: notice.importance === 'High' || notice.importance === 'Urgent',
    publishedAt: notice.publicationDate
      ? new Date(notice.publicationDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : 'Official Notice',
  };
};

export const createNotice = async (noticeData) => {
  let universityRecord = null;
  const univTarget = noticeData.university || noticeData.universityName || 'NU';
  if (univTarget) {
    universityRecord = await prisma.university.findFirst({
      where: {
        OR: [
          { code: { equals: univTarget, mode: 'insensitive' } },
          { name: { contains: univTarget, mode: 'insensitive' } },
        ],
      },
    });
  }

  const notice = await prisma.notice.create({
    data: {
      title: (noticeData.title || noticeData.title_en || '').trim(),
      asTitle: (noticeData.asTitle || noticeData.title_as || noticeData.title || '').trim(),
      description: (noticeData.description || noticeData.content || noticeData.content_en || '').trim(),
      asDescription: (noticeData.asDescription || noticeData.content_as || noticeData.description || '').trim(),
      category: noticeData.category || 'General Notice',
      importance: noticeData.importance || (noticeData.isPinned || noticeData.is_pinned ? 'High' : 'Normal'),
      universityId: universityRecord?.id || null,
      universityName: universityRecord?.name || noticeData.universityName || 'Nivoraya University',
      attachmentUrl: noticeData.attachmentUrl || noticeData.attachment_url || null,
      fileName: noticeData.fileName || noticeData.file_name || null,
      targetAudience: noticeData.targetAudience || ['all'],
      isActive: noticeData.isActive !== undefined ? Boolean(noticeData.isActive) : true,
      createdById: noticeData.createdById || null,
    },
    include: { university: true },
  });

  return notice;
};

export const updateNotice = async (id, updateData) => {
  const notice = await prisma.notice.findUnique({ where: { id } });
  if (!notice) {
    throw ApiError.notFound('Notice not found.');
  }

  const data = {};
  if (updateData.title !== undefined || updateData.title_en !== undefined) data.title = (updateData.title || updateData.title_en).trim();
  if (updateData.asTitle !== undefined || updateData.title_as !== undefined) data.asTitle = (updateData.asTitle || updateData.title_as).trim();
  if (updateData.description !== undefined || updateData.content !== undefined || updateData.content_en !== undefined) {
    data.description = (updateData.description || updateData.content || updateData.content_en).trim();
  }
  if (updateData.asDescription !== undefined || updateData.content_as !== undefined) {
    data.asDescription = (updateData.asDescription || updateData.content_as).trim();
  }
  if (updateData.category !== undefined) data.category = updateData.category;
  if (updateData.importance !== undefined) data.importance = updateData.importance;
  if (updateData.attachmentUrl !== undefined || updateData.attachment_url !== undefined) {
    data.attachmentUrl = updateData.attachmentUrl || updateData.attachment_url;
  }
  if (updateData.fileName !== undefined || updateData.file_name !== undefined) {
    data.fileName = updateData.fileName || updateData.file_name;
  }
  if (updateData.isActive !== undefined || updateData.is_active !== undefined) {
    data.isActive = Boolean(updateData.isActive !== undefined ? updateData.isActive : updateData.is_active);
  }

  const updated = await prisma.notice.update({
    where: { id },
    data,
    include: { university: true },
  });

  return updated;
};

export const deleteNotice = async (id) => {
  const notice = await prisma.notice.findUnique({ where: { id } });
  if (!notice) {
    throw ApiError.notFound('Notice not found.');
  }

  await prisma.notice.delete({ where: { id } });
  return { id, deleted: true };
};
