import { VercelRequest, VercelResponse } from '@vercel/node';
import { AI_CONFIG } from '../lib/config/ai';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  res.status(200).json({
    status: "ok",
    model: AI_CONFIG.MODEL,
    timestamp: new Date().toISOString()
  });
}
