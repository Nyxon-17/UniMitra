import * as adminService from './admin.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export const getAnalytics = async (req, res, next) => {
  try {
    const data = await adminService.getSystemAnalytics();
    return ApiResponse.success(res, data, 'Analytics data retrieved.');
  } catch (err) {
    next(err);
  }
};

export const getUnanswered = async (req, res, next) => {
  try {
    const data = await adminService.getUnansweredQueries();
    return ApiResponse.success(res, data, 'Unanswered queries retrieved.');
  } catch (err) {
    next(err);
  }
};

export const resolveUnanswered = async (req, res, next) => {
  try {
    const result = await adminService.resolveUnansweredQuery(req.params.id, req.body.status);
    return ApiResponse.success(res, result, 'Query marked as resolved.');
  } catch (err) {
    next(err);
  }
};

export const getFeedback = async (req, res, next) => {
  try {
    const data = await adminService.getFeedbackList();
    return ApiResponse.success(res, data, 'Feedback list retrieved.');
  } catch (err) {
    next(err);
  }
};

export const updateFeedbackStatus = async (req, res, next) => {
  try {
    const result = await adminService.updateFeedbackStatus(req.params.id, req.body.status);
    return ApiResponse.success(res, result, 'Feedback updated.');
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const result = await adminService.getUsers(req.query);
    return ApiResponse.paginated(
      res,
      result.items,
      result.total,
      result.page,
      result.limit,
      'Users retrieved.'
    );
  } catch (err) {
    next(err);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const user = await adminService.updateUserRole(req.params.id, req.body.role);
    return ApiResponse.success(res, user, 'User role updated.');
  } catch (err) {
    next(err);
  }
};

export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await adminService.toggleUserStatus(req.params.id);
    return ApiResponse.success(res, user, 'User status toggled.');
  } catch (err) {
    next(err);
  }
};

export const getSettings = async (req, res, next) => {
  try {
    const settings = await adminService.getSystemSettings();
    return ApiResponse.success(res, settings, 'System settings retrieved.');
  } catch (err) {
    next(err);
  }
};

export const updateSetting = async (req, res, next) => {
  try {
    const { key, value } = req.body;
    const setting = await adminService.updateSystemSetting(key, value);
    return ApiResponse.success(res, setting, 'System setting updated.');
  } catch (err) {
    next(err);
  }
};

export const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await adminService.getAuditLogs(Number(req.query.limit) || 50);
    return ApiResponse.success(res, logs, 'Audit logs retrieved.');
  } catch (err) {
    next(err);
  }
};

