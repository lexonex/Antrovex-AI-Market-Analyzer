/**
 * Response helpers
 */

import { VercelResponse } from '@vercel/node';

export function sendJson(res: VercelResponse, status: number, data: any) {
  return res.status(status).json({
    success: true,
    data
  });
}

export function sendError(res: VercelResponse, status: number, code: string, message: string) {
  return res.status(status).json({
    success: false,
    error: {
      code,
      message
    }
  });
}
