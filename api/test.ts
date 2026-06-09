import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAiInsight } from '../src/lib/ai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    return res.status(200).json({ ok: true, msg: "ai imported fine" });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
