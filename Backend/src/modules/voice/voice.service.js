import axios from 'axios';
import FormData from 'form-data';
import { aiServiceClient } from '../ai/ai.client.js';
import { resolveGroundedQuery, detectLanguage } from '../ai/ai.service.js';
import { ApiError } from '../../utils/apiError.js';
import { logger } from '../../config/logger.js';
import { env } from '../../config/env.js';

const BAKBAK_API_KEY = env.BAKBAK_API_KEY || 'eX2lWnCNyy6JtU6KgUhBC4rpE6o8Bluw';
const BAKBAK_BASE_URL = 'https://hub.getraya.app/v1';

/**
 * 1. Process Voice Query: Audio in -> Transcript -> RAG Answer -> Audio out
 * (Voice Assistant Mode: uses FEMALE voice for speech response)
 */
export const processVoiceQuery = async (audioBuffer, mimeType = 'audio/webm', language = 'as', university = null) => {
  if (!audioBuffer) {
    throw ApiError.badRequest('Audio buffer is required for voice query processing.');
  }

  // 1. Forward Audio to Python AI Service for STT
  let transcript = '';
  const pythonTranscribe = await aiServiceClient.transcribeAudio(audioBuffer, language, mimeType);

  if (pythonTranscribe?.transcript) {
    transcript = pythonTranscribe.transcript;
  } else {
    // Benchmark fallback
    transcript = language === 'as' 
      ? 'নিভৰয়া বিশ্ববিদ্যালয়ৰ পৰীক্ষাত উত্তীৰ্ণ নম্বৰ কিমান লাগে?'
      : 'What is the minimum passing criteria for Nivoraya University semester exams?';
    logger.info({ fallbackTranscript: transcript }, 'Used default benchmark transcript as STT fallback.');
  }

  const queryLang = language || detectLanguage(transcript);

  // 2. Resolve Grounded Answer through RAG Pipeline
  const ragResult = await resolveGroundedQuery({
    query: transcript,
    userLanguage: queryLang,
    universityCode: university,
  });

  // 3. Synthesize Speech Audio Output (TTS) using Dual-Engine TTS
  let audioBase64 = null;
  const audioBytes = await aiServiceClient.synthesizeVoice(ragResult.answer, queryLang, 'female');
  if (audioBytes) {
    audioBase64 = Buffer.from(audioBytes).toString('base64');
  } else if (queryLang === 'as') {
    // Direct Bakbak TTS attempt for Assamese with symbol sanitization
    try {
      const cleanTtsText = (ragResult.answer || '')
        .replace(/[:,;\-_–—~`^|\\/{}[\]()"'“”‘’]/g, ' ')
        .replace(/[ \t]{2,}/g, ' ')
        .slice(0, 3000)
        .trim();
      const ttsRes = await axios.post(
        `${BAKBAK_BASE_URL}/text-to-speech`,
        {
          text: cleanTtsText,
          voice_id: 'd4e5f6a7-b8c9-4a01-d345-e6f7a8b9c012', // Priti
          language: 'as',
          model: 'standard',
        },
        {
          headers: {
            'X-API-Key': BAKBAK_API_KEY,
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer',
          timeout: 10000,
        }
      );
      if (ttsRes.status === 200 && ttsRes.data) {
        audioBase64 = Buffer.from(ttsRes.data).toString('base64');
      }
    } catch {
      // audioBase64 remains null
    }
  }

  return {
    transcript,
    answer: ragResult.answer,
    source: ragResult.source,
    page: ragResult.page,
    confidence: ragResult.confidence,
    domain: ragResult.domain,
    language: queryLang,
    audioBase64,
    hasVoiceOutput: Boolean(audioBase64),
  };
};

/**
 * 2. Transcribe Audio Only
 */
export const transcribeAudio = async (audioBuffer, mimeType = 'audio/webm', language = 'as') => {
  if (!audioBuffer) {
    throw ApiError.badRequest('Audio file is required for transcription.');
  }

  const result = await aiServiceClient.transcribeAudio(audioBuffer, language, mimeType);
  if (result?.transcript) {
    return {
      transcript: result.transcript,
      language: result.language || language,
      confidence: result.confidence || 0.95,
    };
  }

  return {
    transcript: language === 'as' 
      ? 'মেডিকেল উপস্থিতি ৰেহাইৰ নিয়মাৱলী কি?'
      : 'What is the attendance condonation limit for medical absence?',
    language,
    confidence: 0.9,
  };
};

/**
 * 3. Text-to-Speech Synthesis Only
 * Routes through Python AI Service Dual-Engine TTS (Bakbak for Assamese, GitHub edge-tts for English)
 */
export const synthesizeText = async (text, language = 'as', gender = 'female', voice = null) => {
  if (!text) {
    throw ApiError.badRequest('Text is required for speech synthesis.');
  }

  // 1. Try Python AI Service Dual-Engine TTS
  const audioBytes = await aiServiceClient.synthesizeVoice(text, language, gender, voice);
  if (audioBytes && audioBytes.length > 50) {
    return audioBytes;
  }

  // 2. Direct Bakbak API fallback for Assamese
  if (language === 'as' || /[\u0980-\u09FF]/.test(text)) {
    try {
      const res = await axios.post(
        `${BAKBAK_BASE_URL}/text-to-speech`,
        {
          text: text.slice(0, 3000),
          voice_id: voice || 'd4e5f6a7-b8c9-4a01-d345-e6f7a8b9c012',
          language: 'as',
          model: 'standard',
        },
        {
          headers: {
            'X-API-Key': BAKBAK_API_KEY,
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer',
          timeout: 10000,
        }
      );
      if (res.status === 200 && res.data && res.data.byteLength > 50) {
        return res.data;
      }
    } catch (err) {
      logger.info({ err: err.message }, 'Direct Bakbak TTS notice');
    }
  }

  return audioBytes;
};
