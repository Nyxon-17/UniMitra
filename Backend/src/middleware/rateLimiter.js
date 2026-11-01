import rateLimit from 'express-rate-limit';

/**
 * Standard API error responder for rate limiter
 */
const rateLimitHandler = (message = 'Too many requests, please try again later.') => {
  return (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message,
        retryAfter: res.getHeader('Retry-After') || 60,
      },
    });
  };
};

/**
 * General API rate limiter (e.g. 200 requests / 15 min)
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler('Too many requests across the API. Please slow down and try again.'),
});

/**
 * Sensitive Auth rate limiter (e.g. 25 requests / 15 min)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler('Too many authentication attempts. Please try again in 15 minutes.'),
});

/**
 * AI Query & Voice rate limiter (e.g. 30 requests / minute)
 */
export const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler('AI query limit reached. Please wait a moment before asking another question.'),
});

/**
 * Document upload rate limiter (e.g. 15 uploads / 10 min)
 */
export const uploadLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler('Upload rate limit reached. Please try uploading again later.'),
});
