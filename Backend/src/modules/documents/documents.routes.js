import { Router } from 'express';
import * as documentController from './documents.controller.js';
import { authenticate, optionalAuthenticate } from '../../middleware/auth.js';
import { requireAdmin, requireFaculty } from '../../middleware/rbac.js';
import { documentUpload } from '../../middleware/upload.js';
import { uploadLimiter } from '../../middleware/rateLimiter.js';
import { validate } from '../../middleware/validate.js';
import {
  uploadDocumentSchema,
  updateApprovalSchema,
  documentFilterSchema,
  createCategorySchema,
} from './documents.validation.js';

const router = Router();

// Category routes
router.get('/categories', documentController.getCategories);
router.post('/categories', authenticate, requireAdmin, validate(createCategorySchema), documentController.createCategory);
router.delete('/categories/:id', authenticate, requireAdmin, documentController.deleteCategory);

// Documents list & single lookup
router.get('/', optionalAuthenticate, validate(documentFilterSchema), documentController.getDocuments);
router.get('/:id', optionalAuthenticate, documentController.getDocumentById);

// Upload document (Faculty or Admin)
router.post(
  '/upload',
  authenticate,
  requireFaculty,
  uploadLimiter,
  documentUpload.single('file'),
  validate(uploadDocumentSchema),
  documentController.uploadDocument
);

// Admin workflow actions
router.patch('/:id/approval', authenticate, requireAdmin, validate(updateApprovalSchema), documentController.updateApproval);
router.patch('/:id/archive', authenticate, requireAdmin, documentController.archiveDocument);
router.delete('/:id', authenticate, requireFaculty, documentController.deleteDocument);
router.post('/:id/retry', authenticate, requireFaculty, documentController.retryDocument);

export default router;

