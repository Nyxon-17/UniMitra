import { Router } from 'express';
import * as voiceController from './voice.controller.js';
import { optionalAuthenticate } from '../../middleware/auth.js';
import { audioUpload } from '../../middleware/upload.js';
import { aiLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

// Full Voice Query
router.post(
  '/query',
  optionalAuthenticate,
  aiLimiter,
  audioUpload.single('audio'),
  voiceController.handleVoiceQuery
);

// Transcribe Only (STT)
router.post(
  '/transcribe',
  optionalAuthenticate,
  aiLimiter,
  audioUpload.single('audio'),
  voiceController.transcribe
);

// Synthesize Only (TTS)
router.post(
  '/synthesize',
  optionalAuthenticate,
  aiLimiter,
  voiceController.synthesize
);

export default router;

