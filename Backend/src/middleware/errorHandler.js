import { ZodError } from 'zod';
import multer from 'multer';
import { ApiError } from '../utils/apiError.js';
import { logger } from '../config/logger.js';
import { env } from '../config/env.js';

/**
 * 404 Route Not Found Middleware
 */
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Cannot ${req.method} ${req.originalUrl}`,
    },
  });
};

/**
 * Global centralized error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  // If headers already sent, delegate to Express default error handler
  if (res.headersSent) {
    return next(err);
  }

  // 1. Handled ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
  }

  // 2. Zod Validation Errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
      rule: e.code,
    }));

    return res.status(422).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data provided.',
        details: formattedErrors,
      },
    });
  }

  // 3. Multer File Upload Errors
  if (err instanceof multer.MulterError) {
    let message = 'File upload error.';
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'Uploaded file exceeds the maximum size limit.';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = `Unexpected upload field: ${err.field}`;
    }

    return res.status(400).json({
      success: false,
      error: {
        code: `UPLOAD_${err.code}`,
        message,
      },
    });
  }

  // 4. Custom Multer file filter errors
  if (err.code === 'INVALID_FILE_TYPE' || err.code === 'INVALID_AUDIO_TYPE') {
    return res.status(400).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  // 5. Prisma ORM Errors
  if (err.name === 'PrismaClientKnownRequestError') {
    if (err.code === 'P2002') {
      const target = err.meta?.target || 'field';
      return res.status(409).json({
        success: false,
        error: {
          code: 'UNIQUE_CONSTRAINT_VIOLATION',
          message: `A record with this ${Array.isArray(target) ? target.join(', ') : target} already exists.`,
        },
      });
    }

    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'RECORD_NOT_FOUND',
          message: 'The requested resource was not found.',
        },
      });
    }
  }

  // 6. JSON Parse Syntax Error
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_JSON_BODY',
        message: 'Malformed JSON payload in request body.',
      },
    });
  }

  // 7. JWT Errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'The authorization token is invalid or malformed.',
      },
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'TOKEN_EXPIRED',
        message: 'Your session token has expired. Please sign in again.',
      },
    });
  }

  // 8. Unhandled / Internal Server Error
  logger.error({ err, path: req.path, method: req.method }, 'Unhandled Exception');

  const isProduction = env.NODE_ENV === 'production';
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: isProduction ? 'An unexpected server error occurred.' : err.message,
      ...(isProduction ? {} : { stack: err.stack }),
    },
  });
};

