import { prisma } from '../../config/prisma.js';
import { ApiError } from '../../utils/apiError.js';

export const getNotices = async ({ university = null, category = null, search = null, page = 1, limit = 20 }) => {
  const where = { is_active: true };

  if (category && category !== 'all') {
    where.category = { contains: category, mode: 'insensitive' };
  }

  if (university && university !== 'all') {
    where.OR = [
      { university: { code: { equals: university, mode: 'insensitive' } } },
      { university: { name_en: { contains: university, mode: 'insensitive' } } },
    ];
  }

  if (search && search.trim()) {
    const q = search.trim();
    where.OR = [
      { title_en: { contains: q, mode: 'insensitive' } },
      { title_as: { contains: q, mode: 'insensitive' } },
      { content_en: { contains: q, mode: 'insensitive' } },
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
      orderBy: [{ is_pinned: 'desc' }, { published_at: 'desc' }],
    }),
  ]);

  return {
    items: notices.map((n) => ({
      id: n.id,
      title: n.title_en,
      asTitle: n.title_as || n.title_en,
      content: n.content_en,
      asContent: n.content_as || n.content_en,
      category: n.category,
      university: n.university?.name_en || 'All Universities of Assam',
      universityCode: n.university?.code || null,
      attachmentUrl: n.attachment_url,
      isPinned: n.is_pinned,
      publishedAt: n.published_at
        ? new Date(n.published_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        : 'Official Notice',
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
    title: notice.title_en,
    asTitle: notice.title_as || notice.title_en,
    content: notice.content_en,
    asContent: notice.content_as,
    category: notice.category,
    university: notice.university?.name_en || 'University Authority',
    attachmentUrl: notice.attachment_url,
    isPinned: notice.is_pinned,
    publishedAt: notice.published_at,
  };
};

export const createNotice = async (noticeData) => {
  let universityRecord = null;
  if (noticeData.university) {
    universityRecord = await prisma.university.findFirst({
      where: {
        OR: [
          { code: { equals: noticeData.university, mode: 'insensitive' } },
          { name_en: { contains: noticeData.university, mode: 'insensitive' } },
        ],
      },
    });
  }

  const notice = await prisma.notice.create({
    data: {
      title_en: noticeData.title_en.trim(),
      title_as: noticeData.title_as?.trim() || noticeData.title_en.trim(),
      content_en: noticeData.content_en.trim(),
      content_as: noticeData.content_as?.trim() || noticeData.content_en.trim(),
      category: noticeData.category || 'General Notice',
      university_id: universityRecord?.id || null,
      attachment_url: noticeData.attachment_url || null,
      is_pinned: Boolean(noticeData.is_pinned),
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

  const updated = await prisma.notice.update({
    where: { id },
    data: updateData,
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

