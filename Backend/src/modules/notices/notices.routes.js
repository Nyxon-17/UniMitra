import { Router } from 'express';
import * as noticeController from './notices.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { requireAdmin } from '../../middleware/rbac.js';
import { validate } from '../../middleware/validate.js';
import { createNoticeSchema, updateNoticeSchema } from './notices.validation.js';

const router = Router();

router.get('/', noticeController.getNotices);
router.get('/:id', noticeController.getNoticeById);

// Admin-only endpoints
router.post('/', authenticate, requireAdmin, validate(createNoticeSchema), noticeController.createNotice);
router.patch('/:id', authenticate, requireAdmin, validate(updateNoticeSchema), noticeController.updateNotice);
router.delete('/:id', authenticate, requireAdmin, noticeController.deleteNotice);

export default router;

