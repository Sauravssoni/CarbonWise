/**
 * CarbonWise - Security & Hardening Helpers
 */

import { Request, Response, NextFunction } from 'express';

// Simple in-memory rate limiter store
const ipCache = new Map<string, { count: number; resetTime: number }>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 15;      // Max 15 request check-ins per IP per minute

/**
 * Rate limiting middleware to prevent brute force or denial-of-service attempts.
 */
export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  
  const record = ipCache.get(ip);
  
  if (!record || now > record.resetTime) {
    ipCache.set(ip, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });
    return next();
  }
  
  record.count += 1;
  if (record.count > MAX_REQUESTS) {
    return res.status(429).json({
      status: 'error',
      message: 'Too many footprint analysis requests. Please wait a minute before trying again.',
    });
  }
  
  next();
}

/**
 * Custom CSP configuration string for Express and Client isolation
 */
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};
