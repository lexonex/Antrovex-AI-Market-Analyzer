/**
 * Error utility
 */

export enum ErrorCode {
  INVALID_REQUEST = 'INVALID_REQUEST',
  IMAGE_TOO_LARGE = 'IMAGE_TOO_LARGE',
  UNSUPPORTED_FORMAT = 'UNSUPPORTED_FORMAT',
  AI_SERVICE_ERROR = 'AI_SERVICE_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public message: string,
    public status: number = 400
  ) {
    super(message);
    this.name = 'AppError';
  }
}
