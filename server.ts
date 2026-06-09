/**
 * CarbonWise - Express & Vite Custom Server
 * Implements final audit hardening with rate limits, security headers, and modular AI fallbacks.
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { FootprintSchema } from './src/lib/validation.js';
import { calculateFootprint } from './src/lib/carbon-engine.js';
import { getAiInsight } from './src/lib/ai.js';
import { FootprintInput } from './src/types.js';
import { rateLimiter, SECURITY_HEADERS } from './src/lib/security.js';
import { sanitizeString } from './src/lib/sanitize.js';

const resolvedFilename = typeof import.meta !== 'undefined' && import.meta && import.meta.url
  ? fileURLToPath(import.meta.url)
  : (typeof __filename !== 'undefined' ? __filename : '');
const __dirname = path.dirname(resolvedFilename);

const PORT = 3000;

async function startServer() {
  const app = express();
  
  // 1. Parse JSON safely with 10kb body size limit
  app.use(express.json({ limit: '10kb' }));

  // 2. Security Headers
  app.use((req, res, next) => {
    // Apply common hardened security headers from safety module
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('X-Frame-Options', 'DENY');
    } else {
      res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    }
    
    next();
  });

  // 3. API Route POST with custom rate limiter and schema validation
  app.post('/api/generate-insight', rateLimiter, async (req, res) => {
    try {
      const payload = req.body;
      
      // Zod schema validation
      const parseResult = FootprintSchema.safeParse(payload);
      if (!parseResult.success) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid footprint input telemetry schema.',
          errors: parseResult.error.flatten(),
        });
      }

      const input = parseResult.data as FootprintInput;
      
      // Sanitize optional user input note
      if (input.optionalNote) {
        input.optionalNote = sanitizeString(input.optionalNote, 200);
      }

      // Calculate deterministic carbon results
      const result = calculateFootprint(input);
      
      // Request AI insights with clean silent fallback in src/lib/ai
      const apiKey = process.env.GEMINI_API_KEY;
      const aiResponse = await getAiInsight(input, result, apiKey);
      
      return res.json(aiResponse);
    } catch (err) {
      // Safe generic fallback error to completely prevent leaking system stack traces
      return res.status(500).json({
        status: 'error',
        message: 'Internal processing failure.',
      });
    }
  });

  // 4. Vite Dev Middleware / Static Build Router
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // 5. Port Binding and Launch
  app.listen(PORT, '0.0.0.0', () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`CarbonWise server booted on http://0.0.0.0:${PORT}`);
    }
  });
}

startServer();
