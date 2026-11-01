import { Router } from 'express';
import * as notificationController from './notifications.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

router.get('/', authenticate, notificationController.getNotifications);
router.patch('/read-all', authenticate, notificationController.markAllRead);
router.patch('/:id/read', authenticate, notificationController.markRead);

export default router;

