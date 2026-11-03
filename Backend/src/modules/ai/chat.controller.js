import * as chatService from './chat.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export const query = async (req, res, next) => {
  try {
    const result = await chatService.handleQuery(req.user, req.body);
    return ApiResponse.success(res, result, 'AI grounded query response generated.');
  } catch (err) {
    next(err);
  }
};

export const getSessions = async (req, res, next) => {
  try {
    const domain = req.query.domain || null;
    const sessions = await chatService.getSessions(req.user.id, domain);
    return ApiResponse.success(res, sessions, 'Chat sessions retrieved.');
  } catch (err) {
    next(err);
  }
};

export const createSession = async (req, res, next) => {
  try {
    const session = await chatService.createSession(req.user.id, req.body.title);
    return ApiResponse.created(res, session, 'Chat session initiated.');
  } catch (err) {
    next(err);
  }
};

export const getSessionMessages = async (req, res, next) => {
  try {
    const messages = await chatService.getSessionMessages(req.params.id, req.user.id);
    return ApiResponse.success(res, messages, 'Chat history retrieved.');
  } catch (err) {
    next(err);
  }
};

export const deleteSession = async (req, res, next) => {
  try {
    const result = await chatService.deleteSession(req.params.id, req.user.id);
    return ApiResponse.success(res, result, 'Chat session deleted.');
  } catch (err) {
    next(err);
  }
};

export const saveAnswer = async (req, res, next) => {
  try {
    const result = await chatService.saveAnswer(req.user.id, req.body);
    return ApiResponse.created(res, result, 'Answer bookmarked to saved repository.');
  } catch (err) {
    next(err);
  }
};

export const getSavedAnswers = async (req, res, next) => {
  try {
    const list = await chatService.getSavedAnswers(req.user.id);
    return ApiResponse.success(res, list, 'Saved answers retrieved.');
  } catch (err) {
    next(err);
  }
};

export const deleteSavedAnswer = async (req, res, next) => {
  try {
    const result = await chatService.deleteSavedAnswer(req.user.id, req.params.id);
    return ApiResponse.success(res, result, 'Saved answer removed.');
  } catch (err) {
    next(err);
  }
};

export const submitFeedback = async (req, res, next) => {
  try {
    const result = await chatService.submitFeedback(req.user, req.body);
    return ApiResponse.success(res, result, result.message);
  } catch (err) {
    next(err);
  }
};

