/**
 * Image validation
 */

import { AppError, ErrorCode } from './errors.js';

export function validateBase64Image(image: string): string {
  if (!image) {
    throw new AppError(ErrorCode.INVALID_REQUEST, 'Image is missing');
  }

  // Basic base64 validation (check if it looks like one)
  const base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
  const cleanImage = image.replace(/^data:image\/\w+;base64,/, '');
  
  if (!base64Regex.test(cleanImage)) {
    throw new AppError(ErrorCode.INVALID_REQUEST, 'Invalid base64 image format');
  }

  return cleanImage;
}
