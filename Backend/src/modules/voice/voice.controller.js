import * as voiceService from './voice.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

/**
 * Handle Full Voice Query (Audio -> Transcript -> Answer -> Audio)
 * POST /api/v1/voice/query
 */
export const handleVoiceQuery = async (req, res, next) => {
  try {
    const file = req.file;
    const language = req.body.language || 'as';
    const university = req.body.university || null;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_AUDIO', message: 'Audio recording file is required.' },
      });
    }

    const result = await voiceService.processVoiceQuery(
      file.buffer,
      file.mimetype,
      language,
      university
    );

    return ApiResponse.success(res, result, 'Voice query resolved successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * Transcribe Audio Only (Speech-to-Text)
 * POST /api/v1/voice/transcribe
 */
export const transcribe = async (req, res, next) => {
  try {
    const file = req.file;
    const language = req.body.language || 'as';

    if (!file) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_AUDIO', message: 'Audio file is required.' },
      });
    }

    const result = await voiceService.transcribeAudio(file.buffer, file.mimetype, language);
    return ApiResponse.success(res, result, 'Audio transcribed successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * Synthesize Text to Speech
 * POST /api/v1/voice/synthesize
 * gender: 'male' for chat bot text listen feature, 'female' for voice assistant
 */
export const synthesize = async (req, res, next) => {
  try {
    const { text, language = 'as', gender = 'female', voice = 'i43sm02kv3' } = req.body;
    if (!text) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_TEXT', message: 'Text is required for synthesis.' },
      });
    }

    const audioBytes = await voiceService.synthesizeText(text, language, gender, voice);
    if (!audioBytes) {
      return res.status(503).json({
        success: false,
        error: { code: 'TTS_UNAVAILABLE', message: 'TTS provider currently unavailable.' },
      });
    }

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBytes.length,
    });
    return res.send(Buffer.from(audioBytes));
  } catch (err) {
    next(err);
  }
};
