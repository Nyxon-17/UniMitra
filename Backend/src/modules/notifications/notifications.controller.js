import * as notificationService from './notifications.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export const getNotifications = async (req, res, next) => {
  try {
    const list = await notificationService.getUserNotifications(req.user.id);
    return ApiResponse.success(res, list, 'Notifications retrieved.');
  } catch (err) {
    next(err);
  }
};

export const markRead = async (req, res, next) => {
  try {
    await notificationService.markAsRead(req.params.id, req.user.id);
    return ApiResponse.success(res, null, 'Notification marked as read.');
  } catch (err) {
    next(err);
  }
};

export const markAllRead = async (req, res, next) => {
  try {
    await notificationService.markAllAsRead(req.user.id);
    return ApiResponse.success(res, null, 'All notifications marked as read.');
  } catch (err) {
    next(err);
  }
};

