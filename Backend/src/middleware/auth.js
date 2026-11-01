import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import prisma from '../config/prisma.js';

export const authenticate = async (req, res, next) => {
  try {
    let token = null;

    // 1. Check Authorization Header (Bearer token)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
    // 2. Check HTTP-only cookie
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication token missing. Please sign in to access this resource.'
        }
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Session has expired or is invalid. Please sign in again.'
        }
      });
    }

    // Attempt to load live profile from PostgreSQL
    try {
      const profile = await prisma.profile.findUnique({
        where: { id: decoded.id }
      });

      if (profile) {
        if (!profile.isActive) {
          return res.status(403).json({
            success: false,
            error: {
              code: 'ACCOUNT_DISABLED',
              message: 'Your account has been deactivated. Please contact the administrator.'
            }
          });
        }
        req.user = {
          id: profile.id,
          email: profile.email,
          fullName: profile.fullName,
          role: profile.role,
          department: profile.department,
          designation: profile.designation,
          memberId: profile.memberId,
          preferredLang: profile.preferredLang
        };
        return next();
      }
    } catch {
      // If DB is offline or in mock mode, use decoded JWT payload
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      fullName: decoded.fullName || decoded.name || 'Member',
      role: decoded.role || 'student',
      department: decoded.department,
      designation: decoded.designation,
      memberId: decoded.memberId
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Your session has expired. Please sign in again.'
        }
      });
    }
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTHENTICATION_FAILED',
        message: 'Invalid authorization token.'
      }
    });
  }
};

// Optional authentication: attaches req.user if token is present, continues otherwise
export const optionalAuthenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.token;
  if (!authHeader && !cookieToken) {
    req.user = null;
    return next();
  }
  return authenticate(req, res, (err) => {
    if (err) req.user = null;
    next();
  });
};

