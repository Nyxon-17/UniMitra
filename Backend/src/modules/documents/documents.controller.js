import * as documentService from './documents.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export const getDocuments = async (req, res, next) => {
  try {
    const userRole = req.user?.role || 'student';
    const result = await documentService.getDocuments({
      userRole,
      ...req.query,
    });
    return ApiResponse.paginated(
      res,
      result.items,
      result.total,
      result.page,
      result.limit,
      'Documents retrieved successfully.'
    );
  } catch (err) {
    next(err);
  }
};

export const getDocumentById = async (req, res, next) => {
  try {
    const doc = await documentService.getDocumentById(req.params.id);
    return ApiResponse.success(res, doc, 'Document details retrieved.');
  } catch (err) {
    next(err);
  }
};

export const uploadDocument = async (req, res, next) => {
  try {
    const doc = await documentService.uploadDocument(req.user, req.file, req.body);
    const message = doc.approvalStatus === 'approved'
      ? 'Document uploaded and indexed successfully into AI knowledge base.'
      : 'Document submitted successfully. Awaiting Administrator verification.';
    return ApiResponse.created(res, doc, message);
  } catch (err) {
    next(err);
  }
};

export const updateApproval = async (req, res, next) => {
  try {
    const doc = await documentService.updateApprovalStatus(req.params.id, req.body);
    return ApiResponse.success(res, doc, `Document ${doc.approvalStatus} successfully.`);
  } catch (err) {
    next(err);
  }
};

export const archiveDocument = async (req, res, next) => {
  try {
    const doc = await documentService.toggleArchive(req.params.id);
    return ApiResponse.success(res, doc, `Document status changed to ${doc.status}.`);
  } catch (err) {
    next(err);
  }
};

export const deleteDocument = async (req, res, next) => {
  try {
    const result = await documentService.deleteDocument(req.params.id);
    return ApiResponse.success(res, result, 'Document deleted permanently.');
  } catch (err) {
    next(err);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await documentService.getCategories();
    return ApiResponse.success(res, categories, 'Categories retrieved successfully.');
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const category = await documentService.createCategory(req.body);
    return ApiResponse.created(res, category, 'Document category created.');
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const result = await documentService.deleteCategory(req.params.id);
    return ApiResponse.success(res, result, 'Category deleted successfully.');
  } catch (err) {
    next(err);
  }
};

