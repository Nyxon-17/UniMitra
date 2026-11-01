import * as noticeService from './notices.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export const getNotices = async (req, res, next) => {
  try {
    const result = await noticeService.getNotices(req.query);
    return ApiResponse.paginated(
      res,
      result.items,
      result.total,
      result.page,
      result.limit,
      'Notices retrieved successfully.'
    );
  } catch (err) {
    next(err);
  }
};

export const getNoticeById = async (req, res, next) => {
  try {
    const notice = await noticeService.getNoticeById(req.params.id);
    return ApiResponse.success(res, notice, 'Notice retrieved.');
  } catch (err) {
    next(err);
  }
};

export const createNotice = async (req, res, next) => {
  try {
    const notice = await noticeService.createNotice(req.body);
    return ApiResponse.created(res, notice, 'Notice published successfully.');
  } catch (err) {
    next(err);
  }
};

export const updateNotice = async (req, res, next) => {
  try {
    const updated = await noticeService.updateNotice(req.params.id, req.body);
    return ApiResponse.success(res, updated, 'Notice updated successfully.');
  } catch (err) {
    next(err);
  }
};

export const deleteNotice = async (req, res, next) => {
  try {
    const result = await noticeService.deleteNotice(req.params.id);
    return ApiResponse.success(res, result, 'Notice deleted successfully.');
  } catch (err) {
    next(err);
  }
};

