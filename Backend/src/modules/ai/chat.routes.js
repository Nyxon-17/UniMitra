import { Router } from 'express';
import * as chatController from './chat.controller.js';
import { authenticate, optionalAuthenticate } from '../../middleware/auth.js';
import { aiLimiter } from '../../middleware/rateLimiter.js';
import { validate } from '../../middleware/validate.js';
import { querySchema, saveAnswerSchema, feedbackSchema } from './chat.validation.js';

const router = Router();

// Public & Authenticated Chat Query
router.post('/query', optionalAuthenticate, aiLimiter, validate(querySchema), chatController.query);

// Chat Sessions & History (Authenticated)
router.get('/sessions', authenticate, chatController.getSessions);
router.post('/sessions', authenticate, chatController.createSession);
router.get('/sessions/:id/messages', authenticate, chatController.getSessionMessages);
router.delete('/sessions/:id', authenticate, chatController.deleteSession);

// Bookmarking & Saved Answers
router.post('/save-answer', authenticate, validate(saveAnswerSchema), chatController.saveAnswer);
router.get('/saved-answers', authenticate, chatController.getSavedAnswers);
router.delete('/saved-answers/:id', authenticate, chatController.deleteSavedAnswer);

// AI Answer Feedback & Inaccuracy Reporting
router.post('/feedback', optionalAuthenticate, validate(feedbackSchema), chatController.submitFeedback);

export default router;

