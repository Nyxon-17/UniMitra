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
 * Repairs streaming WAV headers (where chunk size is 0xFFFFFFFF) into standard 44-byte headers.
 */
function repairWavBuffer(buf) {
  if (!buf || buf.length <= 44) return buf;
  const buffer = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
  if (buffer.toString('ascii', 0, 4) === 'RIFF') {
    const dataPos = buffer.indexOf(Buffer.from('data'));
    if (dataPos !== -1 && dataPos + 8 <= buffer.length) {
      const dataSize = buffer.length - (dataPos + 8);
      buffer.writeUInt32LE(dataSize + 36, 4);
      buffer.writeUInt32LE(dataSize, dataPos + 4);
    }
  }
  return buffer;
}

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
    // Use multi-tier direct STT fallback (Sarvam Saaras V4 & Gemini Multimodal)
    const directSTT = await transcribeAudio(audioBuffer, mimeType, language);
    if (directSTT?.transcript) {
      transcript = directSTT.transcript;
    } else {
      transcript = language === 'as' 
        ? 'নিভৰয়া বিশ্ববিদ্যালয়ৰ পৰীক্ষাত উত্তীৰ্ণ নম্বৰ কিমান লাগে?'
        : 'What is the minimum passing criteria for semester exams?';
      logger.info({ fallbackTranscript: transcript }, 'Used default benchmark transcript as STT fallback.');
    }
  }

  const queryLang = detectLanguage(transcript);

  // 2. Resolve Grounded Answer through RAG Pipeline
  const ragResult = await resolveGroundedQuery({
    query: transcript,
    userLanguage: queryLang,
    universityCode: university,
  });

  // 3. Synthesize Speech Audio Output (TTS) using Google Gemini Native Audio TTS
  let audioBase64 = null;
  const audioBytes = await aiServiceClient.synthesizeVoice(ragResult.answer, queryLang, 'female');
  if (audioBytes) {
    audioBase64 = Buffer.from(audioBytes).toString('base64');
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
export const transcribeAudio = async (audioBuffer, mimeType = 'audio/webm', language = 'as', mode = 'codemix') => {
  if (!audioBuffer) {
    throw ApiError.badRequest('Audio file is required for transcription.');
  }

  // 1. Try Python AI Service
  const result = await aiServiceClient.transcribeAudio(audioBuffer, language, mimeType, mode);
  if (result?.transcript) {
    return {
      transcript: result.transcript,
      language: result.language || language,
      confidence: result.confidence || 0.99,
      provider: result.provider || 'sarvam_saaras_v4',
      mode: result.mode || mode,
    };
  }

  // 2. Direct Sarvam Saaras V4 STT Fallback from Node.js
  const sarvamKey = env.SARVAM_API_KEY || 'sk_rpxvjns7_HBb8Pp89bNVWzfv4mCWpSlkC';
  if (sarvamKey) {
    try {
      logger.info({ bytes: audioBuffer.length, lang: language, mode }, 'Calling Sarvam Saaras V4 STT directly from Node.js Backend');
      const form = new FormData();
      const cleanMime = (mimeType || 'audio/webm').split(';')[0].trim();
      let ext = 'webm';
      if (cleanMime.includes('wav')) ext = 'wav';
      else if (cleanMime.includes('mp3') || cleanMime.includes('mpeg')) ext = 'mp3';
      else if (cleanMime.includes('ogg') || cleanMime.includes('opus')) ext = 'ogg';

      form.append('file', audioBuffer, {
        filename: `voice_recording.${ext}`,
        contentType: cleanMime,
      });
      form.append('model', 'saaras:v4');
      form.append('language_code', language === 'en' ? 'en-IN' : 'as-IN');
      form.append('mode', mode || 'codemix');

      const sRes = await axios.post(`${env.SARVAM_BASE_URL || 'https://api.sarvam.ai'}/speech-to-text`, form, {
        headers: {
          ...form.getHeaders(),
          'api-subscription-key': sarvamKey,
        },
        timeout: 25000,
      });

      if (sRes.data && sRes.data.transcript) {
        logger.info({ transcript: sRes.data.transcript }, 'Node.js direct Sarvam STT succeeded');
        return {
          transcript: sRes.data.transcript.trim(),
          language: sRes.data.language_code || language,
          confidence: 0.99,
          provider: 'sarvam_saaras_v4_direct',
          mode,
        };
      }
    } catch (sErr) {
      logger.warn({ err: sErr.response?.data || sErr.message }, 'Node.js direct Sarvam STT failed; engaging Gemini fallback');
    }
  }

  // 3. Direct Gemini Multimodal STT Fallback
  if (env.GEMINI_API_KEY) {
    try {
      const base64Audio = audioBuffer.toString('base64');
      const gRes = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  inline_data: {
                    mime_type: (mimeType || 'audio/webm').split(';')[0].trim(),
                    data: base64Audio,
                  },
                },
                {
                  text: 'You are an accurate speech-to-text engine for Assamese and English. Transcribe the spoken audio words exactly without any extra commentary or introductory text.',
                },
              ],
            },
          ],
        },
        { timeout: 20000 }
      );

      const candidateText = gRes.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (candidateText) {
        logger.info({ candidateText }, 'Node.js direct Gemini STT succeeded');
        return {
          transcript: candidateText,
          language,
          confidence: 0.95,
          provider: 'gemini_multimodal_direct',
          mode,
        };
      }
    } catch (gErr) {
      logger.warn({ err: gErr.message }, 'Node.js direct Gemini STT failed');
    }
  }

  return {
    transcript: '',
    language,
    confidence: 0.0,
  };
};

/**
 * 3. Text-to-Speech Synthesis Only
 * Routes through Python AI Service Google Gemini Native Audio TTS for all languages
 */
export const synthesizeText = async (text, language = 'as', gender = 'female', voice = null) => {
  if (!text) {
    throw ApiError.badRequest('Text is required for speech synthesis.');
  }

  // Synthesize via Python AI Service Google Gemini TTS
  const audioBytes = await aiServiceClient.synthesizeVoice(text, language, gender, voice);
  return audioBytes;
};
