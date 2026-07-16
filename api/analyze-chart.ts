import { VercelRequest, VercelResponse } from '@vercel/node';
import { geminiClient } from '../lib/ai/gemini.js';
import { ANALYSIS_PROMPT } from '../lib/ai/prompt.js';
import { parseAnalysisResponse } from '../lib/ai/parser.js';
import { validateBase64Image } from '../lib/validation/image.js';
import { logger } from '../lib/logger/logger.js';
import { ErrorCode, AppError } from '../lib/utils/errors.js';
import { sendError, sendJson } from '../lib/utils/response.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const requestId = Math.random().toString(36).substring(7);
  const startTime = Date.now();

  // Basic CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return sendError(res, 405, ErrorCode.INVALID_REQUEST, 'Method Not Allowed');
  }

  try {
    const { image } = req.body;

    if (!image) {
      throw new AppError(ErrorCode.INVALID_REQUEST, 'Image field is required');
    }

    logger.info('Processing chart analysis request', { 
      requestId, 
      imageSize: image.length,
      endpoint: '/api/analyze-chart'
    });

    // 1. Validate image
    const base64Data = validateBase64Image(image);

    // 2. Call Gemini
    const aiResponse = await geminiClient.analyzeChart(base64Data, ANALYSIS_PROMPT);

    // 3. Parse response
    const analysis = parseAnalysisResponse(aiResponse);

    const processingTime = Date.now() - startTime;
    logger.info('Analysis completed successfully', { 
      requestId, 
      processingTime,
      validChart: analysis.validChart
    });

    return sendJson(res, 200, analysis);

  } catch (error: any) {
    const status = error instanceof AppError ? error.status : 500;
    const code = error instanceof AppError ? error.code : ErrorCode.INTERNAL_ERROR;
    
    logger.error('Analysis request failed', error, { requestId });
    
    return sendError(res, status, code, error.message || 'Internal Server Error');
  }
}
