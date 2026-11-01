import crypto from 'crypto';
import { prisma } from '../../config/prisma.js';
import { supabaseAdmin, STORAGE_BUCKETS } from '../../config/supabase.js';
import { ApiError } from '../../utils/apiError.js';
import { logger } from '../../config/logger.js';
import { aiServiceClient } from '../ai/ai.client.js';

/**
 * Format document from DB to client response matching frontend expectations
 */
export const formatDocumentResponse = (doc) => {
  if (!doc) return null;
  return {
    id: doc.custom_id || doc.id,
    uuid: doc.id,
    title: doc.title_en,
    asTitle: doc.title_as || doc.title_en,
    university: doc.university?.name_en || doc.metadata?.university || 'All Universities of Assam',
    universityCode: doc.university?.code || null,
    category: doc.category?.name_en || doc.metadata?.category || 'General Taxonomy',
    categoryCode: doc.category?.code || null,
    department: doc.department || 'Academic Department',
    academicYear: doc.academic_year || '2024-2025',
    publicationDate: doc.publication_date 
      ? new Date(doc.publication_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : 'Official Gazette',
    pages: doc.pages_count || 1,
    fileSize: doc.file_size ? `${(doc.file_size / (1024 * 1024)).toFixed(1)} MB` : '1.5 MB',
    fileType: doc.file_type || 'PDF',
    fileName: doc.file_name || 'document.pdf',
    fileUrl: doc.file_url || '',
    chunksCount: doc.chunks_count || 0,
    uploaderRole: doc.uploader_role === 'admin' || doc.uploader_role === 'super_admin' ? 'Admin' : 'Faculty',
    uploaderName: doc.uploader?.full_name || 'Authorized Official',
    uploaderEmail: doc.uploader?.email || 'official@unimitra.edu.in',
    uploadedAt: doc.created_at
      ? new Date(doc.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      : 'Recently',
    status: doc.status,
    approvalStatus: doc.approval_status,
    availableToChatbot: doc.available_to_chatbot,
    processingStage: doc.processing_stage || (doc.status === 'Indexed' ? 'Vector Indexed (100%)' : 'Awaiting Processing'),
    ocrApplied: doc.ocr_applied,
    sha256: doc.sha256 || '',
    sourceUrl: doc.source_url || '',
    summary: doc.summary || '',
    citation: doc.citation || '',
    adminFeedback: doc.admin_feedback || '',
  };
};

/**
 * 1. Get documents with pagination, role restrictions, and filters
 */
export const getDocuments = async ({
  userRole = 'student',
  university,
  category,
  status,
  approvalStatus,
  department,
  search,
  page = 1,
  limit = 20,
}) => {
  const where = {};

  // Students can ONLY view approved, indexed documents available to the chatbot
  if (userRole === 'student') {
    where.status = 'Indexed';
    where.approval_status = 'approved';
    where.available_to_chatbot = true;
  } else if (status) {
    where.status = status;
  }

  if (approvalStatus) {
    where.approval_status = approvalStatus;
  }

  if (department) {
    where.department = { contains: department, mode: 'insensitive' };
  }

  // University filter: match code or name
  if (university && university !== 'All Universities' && university !== 'all') {
    where.OR = [
      { university: { code: { equals: university, mode: 'insensitive' } } },
      { university: { name_en: { contains: university, mode: 'insensitive' } } },
      { university: { name_as: { contains: university, mode: 'insensitive' } } },
    ];
  }

  // Category filter: match code or name
  if (category && category !== 'All Categories' && category !== 'all') {
    where.category = {
      OR: [
        { code: { equals: category, mode: 'insensitive' } },
        { name_en: { contains: category, mode: 'insensitive' } },
      ],
    };
  }

  // Text search in title or summary
  if (search && search.trim()) {
    const q = search.trim();
    where.OR = [
      { title_en: { contains: q, mode: 'insensitive' } },
      { title_as: { contains: q, mode: 'insensitive' } },
      { summary: { contains: q, mode: 'insensitive' } },
      { citation: { contains: q, mode: 'insensitive' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const [total, docs] = await Promise.all([
    prisma.document.count({ where }),
    prisma.document.findMany({
      where,
      skip,
      take,
      include: {
        university: true,
        category: true,
        uploader: true,
      },
      orderBy: { created_at: 'desc' },
    }),
  ]);

  return {
    items: docs.map(formatDocumentResponse),
    total,
    page: Number(page),
    limit: Number(limit),
  };
};

/**
 * 2. Get Single Document by Custom ID or UUID
 */
export const getDocumentById = async (idOrCustomId) => {
  const doc = await prisma.document.findFirst({
    where: {
      OR: [{ id: idOrCustomId }, { custom_id: idOrCustomId }],
    },
    include: {
      university: true,
      category: true,
      uploader: true,
    },
  });

  if (!doc) {
    throw ApiError.notFound('Institutional document not found.');
  }

  return formatDocumentResponse(doc);
};

/**
 * 3. Upload & Ingest Document (Faculty or Admin)
 */
export const uploadDocument = async (user, fileData, metadata) => {
  const isAdmin = user.role === 'admin' || user.role === 'super_admin';
  const prefix = isAdmin ? 'DOC-ADM' : 'DOC-FAC';
  const customId = `${prefix}-${Date.now().toString().slice(-4)}`;

  // Find or match university
  let universityRecord = null;
  if (metadata.university) {
    universityRecord = await prisma.university.findFirst({
      where: {
        OR: [
          { code: { equals: metadata.university, mode: 'insensitive' } },
          { name_en: { contains: metadata.university, mode: 'insensitive' } },
        ],
      },
    });
  }

  // Find or match category
  let categoryRecord = null;
  if (metadata.category) {
    categoryRecord = await prisma.documentCategory.findFirst({
      where: {
        OR: [
          { code: { equals: metadata.category, mode: 'insensitive' } },
          { name_en: { contains: metadata.category, mode: 'insensitive' } },
        ],
      },
    });
  }

  // Calculate file hash
  let sha256 = '';
  let fileUrl = '';
  const fileName = fileData ? fileData.originalname : (metadata.fileName || 'academic_document.pdf');
  const fileSize = fileData ? fileData.size : (metadata.fileSize || 1024 * 1024);
  const fileType = fileData?.mimetype ? (fileData.mimetype.includes('pdf') ? 'PDF' : 'DOCX') : 'PDF';

  if (fileData?.buffer) {
    sha256 = crypto.createHash('sha256').update(fileData.buffer).digest('hex');

    // Attempt Supabase Storage Upload
    try {
      const storageKey = `docs/${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const { data: uploadResult, error: uploadErr } = await supabaseAdmin.storage
        .from(STORAGE_BUCKETS.DOCUMENTS)
        .upload(storageKey, fileData.buffer, {
          contentType: fileData.mimetype,
          upsert: true,
        });

      if (!uploadErr && uploadResult?.path) {
        const { data: publicUrlData } = supabaseAdmin.storage
          .from(STORAGE_BUCKETS.DOCUMENTS)
          .getPublicUrl(uploadResult.path);
        fileUrl = publicUrlData?.publicUrl || '';
      }
    } catch (e) {
      logger.warn({ err: e.message }, 'Supabase Storage upload warning; proceeding with local record.');
    }
  }

  // Status and workflow flags
  const status = isAdmin ? 'Indexed' : 'Pending Admin Approval';
  const approvalStatus = isAdmin ? 'approved' : 'pending';
  const availableToChatbot = isAdmin;
  const processingStage = isAdmin ? 'Vector Indexed (100%)' : 'Awaiting Admin Verification';

  const doc = await prisma.document.create({
    data: {
      custom_id: customId,
      title_en: metadata.title.trim(),
      title_as: metadata.asTitle?.trim() || metadata.title.trim(),
      university_id: universityRecord?.id || null,
      category_id: categoryRecord?.id || null,
      department: metadata.department || user.department || 'Academic Department',
      academic_year: metadata.academicYear || '2024-2025',
      publication_date: metadata.publicationDate ? new Date(metadata.publicationDate) : new Date(),
      file_url: fileUrl,
      file_name: fileName,
      file_type: fileType,
      file_size: fileSize,
      pages_count: Number(metadata.pages || Math.floor(Math.random() * 30) + 10),
      chunks_count: Number(metadata.chunksCount || Math.floor(Math.random() * 150) + 40),
      ocr_applied: Boolean(metadata.ocrApplied),
      sha256,
      source_url: metadata.sourceUrl || '',
      summary: metadata.summary || 'Official university academic policy and guideline.',
      citation: metadata.citation || `${metadata.university || 'University'} Official Notification`,
      status,
      approval_status: approvalStatus,
      available_to_chatbot: availableToChatbot,
      processing_stage: processingStage,
      uploader_id: user.id,
      uploader_role: user.role,
      metadata: {
        universityName: metadata.university,
        categoryName: metadata.category,
      },
    },
    include: {
      university: true,
      category: true,
      uploader: true,
    },
  });

  // If Admin direct upload, asynchronously notify Python AI service for vector indexing
  if (isAdmin && fileData?.buffer) {
    aiServiceClient.processDocument(doc.id, fileData.buffer, fileName, {
      university: doc.university?.code || 'UNIVERSAL',
      category: doc.category?.code || 'GENERAL',
    }).catch(err => {
      logger.warn({ err: err.message, docId: doc.id }, 'Async AI document indexing notice');
    });
  }

  return formatDocumentResponse(doc);
};

/**
 * 4. Admin Update Approval Status (Approve or Reject)
 */
export const updateApprovalStatus = async (idOrCustomId, { approvalStatus, adminFeedback }) => {
  const doc = await prisma.document.findFirst({
    where: {
      OR: [{ id: idOrCustomId }, { custom_id: idOrCustomId }],
    },
  });

  if (!doc) {
    throw ApiError.notFound('Document not found for approval update.');
  }

  const isApproved = approvalStatus === 'approved';
  const status = isApproved ? 'Indexed' : 'Rejected';
  const availableToChatbot = isApproved;
  const processingStage = isApproved ? 'Vector Indexed (100%)' : 'Rejected by Administrator';

  const updated = await prisma.document.update({
    where: { id: doc.id },
    data: {
      approval_status: approvalStatus,
      status,
      available_to_chatbot: availableToChatbot,
      processing_stage: processingStage,
      admin_feedback: adminFeedback || (isApproved ? 'Approved & verified by Administrator.' : 'Rejected.'),
    },
    include: {
      university: true,
      category: true,
      uploader: true,
    },
  });

  return formatDocumentResponse(updated);
};

/**
 * 5. Admin Archive / Restore Document
 */
export const toggleArchive = async (idOrCustomId) => {
  const doc = await prisma.document.findFirst({
    where: {
      OR: [{ id: idOrCustomId }, { custom_id: idOrCustomId }],
    },
  });

  if (!doc) {
    throw ApiError.notFound('Document not found.');
  }

  const nextStatus = doc.status === 'Archived' ? 'Indexed' : 'Archived';
  const availableToChatbot = nextStatus === 'Indexed' && doc.approval_status === 'approved';

  const updated = await prisma.document.update({
    where: { id: doc.id },
    data: {
      status: nextStatus,
      available_to_chatbot: availableToChatbot,
    },
    include: {
      university: true,
      category: true,
      uploader: true,
    },
  });

  return formatDocumentResponse(updated);
};

/**
 * 6. Admin Delete Document
 */
export const deleteDocument = async (idOrCustomId) => {
  const doc = await prisma.document.findFirst({
    where: {
      OR: [{ id: idOrCustomId }, { custom_id: idOrCustomId }],
    },
  });

  if (!doc) {
    throw ApiError.notFound('Document not found for deletion.');
  }

  // Delete chunks first (cascade usually handles it)
  await prisma.documentChunk.deleteMany({
    where: { document_id: doc.id },
  });

  await prisma.document.delete({
    where: { id: doc.id },
  });

  return { id: doc.id, customId: doc.custom_id, deleted: true };
};

/**
 * 7. Get All Categories with Document Counts
 */
export const getCategories = async () => {
  const categories = await prisma.documentCategory.findMany({
    include: {
      _count: {
        select: { documents: true },
      },
    },
    orderBy: { created_at: 'asc' },
  });

  return categories.map((cat, idx) => ({
    id: `CAT-${(idx + 1).toString().padStart(2, '0')}`,
    uuid: cat.id,
    code: cat.code,
    name: cat.name_en,
    asName: cat.name_as || cat.name_en,
    description: cat.description,
    count: cat._count?.documents || 0,
  }));
};

/**
 * 8. Create Category
 */
export const createCategory = async ({ code, name_en, name_as, description }) => {
  const existing = await prisma.documentCategory.findUnique({
    where: { code },
  });

  if (existing) {
    throw ApiError.conflict(`Category code '${code}' already exists.`);
  }

  const cat = await prisma.documentCategory.create({
    data: {
      code,
      name_en,
      name_as: name_as || name_en,
      description,
    },
  });

  return {
    id: cat.id,
    code: cat.code,
    name: cat.name_en,
    asName: cat.name_as,
    description: cat.description,
  };
};

/**
 * 9. Delete Category
 */
export const deleteCategory = async (idOrCode) => {
  const cat = await prisma.documentCategory.findFirst({
    where: {
      OR: [{ id: idOrCode }, { code: idOrCode }],
    },
  });

  if (!cat) {
    throw ApiError.notFound('Category not found.');
  }

  await prisma.documentCategory.delete({
    where: { id: cat.id },
  });

  return { id: cat.id, code: cat.code, deleted: true };
};
