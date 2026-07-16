/**
 * Response utility
 */

import { VercelResponse } from '@vercel/node';
import { ErrorCode } from './errors';

export const sendJson = (res: VercelResponse, status: number, data: any) => {
  res.status(status).json(data);
};

export const sendError = (res: VercelResponse, status: number, code: ErrorCode, message: string) => {
  res.status(status).json({
    success: false,
    error: {
      code,
      message
    }
  });
};
