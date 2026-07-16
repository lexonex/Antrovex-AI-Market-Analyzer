/**
 * Environment variable configuration
 */

export const config = {
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: 'gemini-1.5-flash', // Using 1.5-flash as the reliable base, will support 2.0/3.5 in lib/ai/gemini.ts
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
