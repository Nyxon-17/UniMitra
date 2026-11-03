import axios from 'axios';
import FormData from 'form-data';
import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';

/**
 * Reusable HTTP client communicating with Python FastAPI AiService
 */
class AiServiceClient {
  constructor() {
    this.baseUrl = env.AI_SERVICE_URL || 'http://localhost:8000';
    this.secret = env.AI_SERVICE_SECRET || 'unimitra_internal_service_secret_key_2024';
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'X-Internal-Secret': this.secret,
      },
    });
  }

  /**
   * Health check for Python AI service
   */
  async isAlive() {
    try {
      const res = await this.client.get('/health', { timeout: 3000 });
      return res.status === 200;
    } catch {
      return false;
    }
  }

  /**
   * Send question to Python RAG pipeline
   */
  async queryRAG({ query, language = 'en', universityCode = null, categoryCode = null, history = [] }) {
    try {
      const res = await this.client.post('/api/ai/query', {
        query,
        language,
        university_code: universityCode,
        category_code: categoryCode,
        conversation_history: history,
      });
      return res.data;
    } catch (err) {
      logger.warn({ err: err.message }, 'Python AI Service unavailable or error on query; falling back to internal grounding engine.');
      return null;
    }
  }

  /**
   * Send document to Python service for PDF parsing, chunking, and embedding
   */
  async processDocument(documentId, fileBuffer, fileName, metadata = {}) {
    try {
      const form = new FormData();
      form.append('document_id', documentId);
      form.append('metadata', JSON.stringify(metadata));
      form.append('file', fileBuffer, { filename: fileName });

      const res = await this.client.post('/api/ai/documents/ingest', form, {
        headers: {
          ...form.getHeaders(),
          'X-Internal-Secret': this.secret,
        },
        maxContentLength: 100 * 1024 * 1024,
      });
      return res.data;
    } catch (err) {
      logger.warn({ err: err.message, documentId }, 'Python AI Service document ingestion notification');
      return null;
    }
  }

  /**
   * Send audio to Python STT (Speech-to-Text)
   */
  async transcribeAudio(audioBuffer, language = 'as', mimeType = 'audio/webm', mode = 'codemix') {
    try {
      const form = new FormData();
      form.append('language', language);
      form.append('mode', mode);
      form.append('audio', audioBuffer, {
        filename: 'voice_input.webm',
        contentType: mimeType,
      });

      const res = await this.client.post('/api/voice/transcribe', form, {
        headers: {
          ...form.getHeaders(),
          'X-Internal-Secret': this.secret,
        },
      });
      return res.data;
    } catch (err) {
      logger.warn({ err: err.message }, 'Python AI Voice transcription fallback activated.');
      return null;
    }
  }

  /**
   * Send text to Python TTS (Text-to-Speech)
   */
  async synthesizeVoice(text, language = 'as', gender = 'male', voice = null) {
    try {
      const res = await this.client.post('/api/ai/voice/synthesize', {
        text,
        language,
        gender,
        voice,
      }, {
        responseType: 'arraybuffer',
      });
      return res.data;
    } catch (err) {
      logger.warn({ err: err.message }, 'Python AI Voice synthesis fallback activated.');
      return null;
    }
  }
}

export const aiServiceClient = new AiServiceClient();

