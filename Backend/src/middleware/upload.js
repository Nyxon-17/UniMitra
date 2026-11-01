import multer from 'multer';

// Use memory storage for seamless stream to Supabase Storage and Python AI service
const storage = multer.memoryStorage();

// Allowed MIME types for University documents
const ALLOWED_DOCUMENT_MIMES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
  'application/msword', // doc
  'text/plain',
  'application/json',
];

// Allowed MIME types for Voice audio input
const ALLOWED_AUDIO_MIMES = [
  'audio/webm',
  'audio/wav',
  'audio/x-wav',
  'audio/mp3',
  'audio/mpeg',
  'audio/ogg',
  'audio/mp4',
  'audio/x-m4a',
  'audio/aac',
];

/**
 * Filter for documents (PDF, DOCX, TXT)
 */
const documentFileFilter = (req, file, cb) => {
  if (ALLOWED_DOCUMENT_MIMES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const err = new Error('Invalid document file type. Only PDF, DOCX, and TXT files are accepted.');
    err.code = 'INVALID_FILE_TYPE';
    cb(err, false);
  }
};

/**
 * Filter for audio recordings (WebM, WAV, MP3, etc.)
 */
const audioFileFilter = (req, file, cb) => {
  if (ALLOWED_AUDIO_MIMES.includes(file.mimetype) || file.mimetype.startsWith('audio/')) {
    cb(null, true);
  } else {
    const err = new Error('Invalid audio file type. Only standard audio files (WebM, WAV, MP3) are accepted.');
    err.code = 'INVALID_AUDIO_TYPE';
    cb(err, false);
  }
};

/**
 * Multer instances
 */
export const documentUpload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 5,
  },
  fileFilter: documentFileFilter,
});

export const audioUpload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB
    files: 1,
  },
  fileFilter: audioFileFilter,
});

