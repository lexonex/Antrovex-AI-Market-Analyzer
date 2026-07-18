/**
 * AI specific configuration
 */

export const AI_CONFIG = {
  MODEL: 'gemini-3.5-flash', // High-performance pro model
  MAX_IMAGE_SIZE_MB: 4,
  MAX_IMAGE_SIZE_BYTES: 4 * 1024 * 1024,
  SUPPORTED_MIME_TYPES: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
  TIMEOUT_MS: 30000,
  RETRY_COUNT: 2,
};
