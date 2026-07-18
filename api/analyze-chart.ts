import { VercelRequest, VercelResponse } from '@vercel/node';
import { AnalysisOrchestrator } from '../src/core/orchestrator/AnalysisOrchestrator.js';
import { validateBase64Image } from '../src/core/utils/image-validation.js';
import { logger } from '../src/core/utils/logger.js';
import { ErrorCode, AppError } from '../src/core/utils/errors.js';
import { sendError, sendJson } from '../src/core/utils/response.js';
import { OutputEngine } from '../src/engines/output/OutputEngine.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sessionId = Math.random().toString(36).substring(7);
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
      sessionId, 
      imageSize: image.length
    });

    // 1. Validate image
    const base64Data = validateBase64Image(image);
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // 2. Orchestrate Deterministic Analysis OS Pipeline
    const state = await AnalysisOrchestrator.analyze(imageBuffer, sessionId);

    // 3. Generate Output Packet
    const response = await OutputEngine.execute(state);

    const processingTime = Date.now() - startTime;
    logger.info('Analysis OS Pipeline complete', { 
      sessionId, 
      processingTime,
      signal: response.signal
    });

    return sendJson(res, 200, response);

  } catch (error: any) {
    const status = error instanceof AppError ? error.status : 500;
    const code = error instanceof AppError ? error.code : ErrorCode.INTERNAL_ERROR;
    
    logger.error('Analysis request failed', error, { sessionId });
    
    return sendError(res, status, code, error.message || 'Internal Server Error');
  }
}
