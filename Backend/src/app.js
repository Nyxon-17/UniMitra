import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './modules/auth/auth.routes.js';
import documentRoutes from './modules/documents/documents.routes.js';
import universityRoutes from './modules/universities/universities.routes.js';
import chatRoutes from './modules/ai/chat.routes.js';
import voiceRoutes from './modules/voice/voice.routes.js';
import noticeRoutes from './modules/notices/notices.routes.js';
import notificationRoutes from './modules/notifications/notifications.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';

const app = express();

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration
const allowedOrigins = env.CORS_ORIGIN.split(',').map((origin) => origin.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);

// Request body parsers
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cookieParser());

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.path !== '/health') {
      logger.info(
        {
          method: req.method,
          path: req.path,
          status: res.statusCode,
          duration: `${duration}ms`,
          ip: req.ip,
        },
        'Incoming HTTP Request'
      );
    }
  });
  next();
});

// Root / Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    name: 'UniMitra Backend Gateway',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    environment: env.NODE_ENV,
  });
});

// Apply rate limiting to all standard API routes
app.use('/api', generalLimiter);

// Mount API v1 Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/documents', documentRoutes);
app.use('/api/v1/universities', universityRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/voice', voiceRoutes);
app.use('/api/v1/notices', noticeRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/admin', adminRoutes);

// 404 Route Handler
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

export default app;
