import type { VercelRequest, VercelResponse } from '@vercel/node';
import { FootprintSchema } from '../src/lib/validation.js';
import { calculateFootprint } from '../src/lib/carbon-engine.js';
import { getAiInsight } from '../src/lib/ai.js';
import { sanitizeString } from '../src/lib/sanitize.js';
import type { FootprintInput } from '../src/types.js';

// Best-effort in-memory rate limiter for serverless environment
const ipCache = new Map<string, { count: number; resetTime: number }>();
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 15;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = ipCache.get(ip);
  if (!record || now > record.resetTime) {
    ipCache.set(ip, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });
    return true;
  }
  record.count += 1;
  return record.count <= MAX_REQUESTS;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Set security headers
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    res.setHeader("X-Frame-Options", "DENY");

    // 1. Only allow POST
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    // 2. Extract IP and verify rate limit
    const ip = (req.headers['x-forwarded-for'] as string) || (req.socket?.remoteAddress as string) || 'unknown';
    if (!checkRateLimit(ip)) {
      return res.status(429).json({
        error: 'Too many requests. Please wait before trying again.',
      });
    }

    const payload = req.body;
    
    // Check if body exists and is object
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ error: 'Invalid body payload.' });
    }

    // 3. Schema validation using existing Zod schema
    const parseResult = FootprintSchema.safeParse(payload);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Invalid footprint input.',
        details: parseResult.error.flatten(),
      });
    }

    const input = parseResult.data as FootprintInput;

    // 4. Sanitize input note
    if (input.optionalNote) {
      input.optionalNote = sanitizeString(input.optionalNote, 200);
    }

    // 5. Run deterministic calculations
    const result = calculateFootprint(input);

    // 6. Request AI insights
    const apiKey = process.env.GEMINI_API_KEY;
    const aiResponse = await getAiInsight(input, result, apiKey);

    return res.status(200).json(aiResponse);
  } catch (error: unknown) {
    // Prevent system stack trace leakage
    return res.status(500).json({
      error: 'Internal processing failure.',
    });
  }
}
