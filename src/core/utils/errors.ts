/**
 * Error classes and codes
 */

export enum ErrorCode {
  INVALID_REQUEST = 'INVALID_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  AI_SERVICE_ERROR = 'AI_SERVICE_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public status: number = 400
  ) {
    super(message);
    this.name = 'AppError';
  }
}
