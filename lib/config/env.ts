/**
 * Environment variable configuration
 */
import { AI_CONFIG } from './ai.js';

export const config = {
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: AI_CONFIG.MODEL,
  },
  app: {
    url: process.env.APP_URL || 'http://localhost:3000',
    env: process.env.NODE_ENV || 'development',
  }
};

export const validateEnv = () => {
  if (!config.gemini.apiKey) {
    console.error('CRITICAL: GEMINI_API_KEY is missing');
    return false;
  }
  return true;
};
