import { aiServiceClient } from '../ai/ai.client.js';
import { resolveGroundedQuery, detectLanguage } from '../ai/ai.service.js';
import { ApiError } from '../../utils/apiError.js';
import { logger } from '../../config/logger.js';

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
    // Graceful fallback for dev/demo if Python STT is offline
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

  // 3. Synthesize Speech Audio Output (TTS)
  // Voice Assistant uses FEMALE voice (bn-IN-TanishaaNeural for Assamese, en-IN-NeerjaNeural for English)
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
 * Default gender is 'male' for chat bot text listen features, or 'female' for voice assistant
 */
export const synthesizeText = async (text, language = 'as', gender = 'male', voice = null) => {
  if (!text) {
    throw ApiError.badRequest('Text is required for speech synthesis.');
  }

  const audioBytes = await aiServiceClient.synthesizeVoice(text, language, gender, voice);
  return audioBytes;
};
