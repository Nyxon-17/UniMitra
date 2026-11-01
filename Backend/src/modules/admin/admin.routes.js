import { Router } from 'express';
import * as adminController from './admin.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { requireAdmin } from '../../middleware/rbac.js';

const router = Router();

// Protect all admin endpoints
router.use(authenticate, requireAdmin);

router.get('/analytics', adminController.getAnalytics);
router.get('/audit-logs', adminController.getAuditLogs);

router.get('/unanswered', adminController.getUnanswered);
router.patch('/unanswered/:id', adminController.resolveUnanswered);

router.get('/feedback', adminController.getFeedback);
router.patch('/feedback/:id', adminController.updateFeedbackStatus);

router.get('/users', adminController.getUsers);
router.patch('/users/:id/role', adminController.updateUserRole);
router.patch('/users/:id/status', adminController.toggleUserStatus);

router.get('/settings', adminController.getSettings);
router.post('/settings', adminController.updateSetting);

export default router;

