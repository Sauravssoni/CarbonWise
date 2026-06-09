import type { VercelRequest, VercelResponse } from '@vercel/node';
import { calculateFootprint } from '../src/lib/carbon-engine';

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    return res.status(200).json({ ok: true, msg: "imported fine" });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
