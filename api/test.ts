import type { VercelRequest, VercelResponse } from '@vercel/node';
import { FootprintSchema } from '../src/lib/validation';
import { calculateFootprint } from '../src/lib/carbon-engine';
import { getAiInsight } from '../src/lib/ai';
import { sanitizeString } from '../src/lib/sanitize';
import { FootprintInput } from '../src/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    return res.status(200).json({ ok: true, schema: !!FootprintSchema });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
