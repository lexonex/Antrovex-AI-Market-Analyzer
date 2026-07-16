/**
 * Image validation utility
 */

import { AI_CONFIG } from '../config/ai';
import { AppError, ErrorCode } from '../utils/errors';

export const validateBase64Image = (base64String: string) => {
  if (!base64String) {
    throw new AppError(ErrorCode.INVALID_REQUEST, 'Image data is missing');
  }

  // Remove data URL prefix if present
  const base64Data = base64String.split(';base64,').pop() || '';
  
  // Calculate size
  const buffer = Buffer.from(base64Data, 'base64');
  if (buffer.length > AI_CONFIG.MAX_IMAGE_SIZE_BYTES) {
    throw new AppError(ErrorCode.IMAGE_TOO_LARGE, `Image exceeds maximum size of ${AI_CONFIG.MAX_IMAGE_SIZE_MB}MB`);
  }

  if (buffer.length === 0) {
    throw new AppError(ErrorCode.INVALID_REQUEST, 'Image data is empty or corrupted');
  }

  // Basic mime type check from base64 header if possible, 
  // or we'll trust the AI for now and do strict check in prompt
  return base64Data;
};
