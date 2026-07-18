import { VercelRequest, VercelResponse } from '@vercel/node';
import { AnalysisOrchestrator } from '../src/core/orchestrator/AnalysisOrchestrator.js';
import { validateBase64Image } from '../src/core/utils/image-validation.js';
import { logger } from '../src/core/utils/logger.js';
import { ErrorCode, AppError } from '../src/core/utils/errors.js';
import { sendError, sendJson } from '../src/core/utils/response.js';

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
    // 2. Orchestrate V6 Analysis
    const state = await AnalysisOrchestrator.analyze(imageBuffer, sessionId);

    const processingTime = Date.now() - startTime;
    logger.info('Analysis completed successfully', { 
      sessionId, 
      processingTime,
      signal: state.decision.finalSignal
    });

    // Map V6 State to old flat structure for frontend compatibility
    const legacyResponse = {
      validChart: state.validation.validationPassed,
      signal: state.decision.finalSignal,
      confidence: Math.round(state.decision.decisionConfidence),
      bullishProbability: Math.round(state.probability.bullishProbability * 100),
      bearishProbability: Math.round(state.probability.bearishProbability * 100),
      neutralProbability: Math.round(state.probability.neutralProbability * 100),
      signalQuality: state.decision.finalSignal === 'NO_TRADE' ? 'Weak' : 'Excellent',
      timeframe: state.session.timeframe,
      expiry: state.decision.recommendedExpiry || '3M',
      marketRegime: state.market.regime.type,
      trendStrength: `${state.market.trend.strength}%`,
      structure: state.market.structure.type,
      bosDetected: state.market.structure.bos,
      chochDetected: state.market.structure.choch,
      liquidityStatus: state.market.liquidity.status,
      liquidityTrap: state.market.liquidity.traps,
      supportStrength: `${state.market.supportResistance.zoneStrength}%`,
      resistanceStrength: `${state.market.supportResistance.zoneStrength}%`,
      momentumState: `${state.market.momentum.direction} (${state.market.momentum.strength}%)`,
      priceActionState: state.market.priceAction.currentBehaviour,
      candlestickPattern: state.market.candlestick.pattern,
      confluenceScore: Math.round(state.evidence.confluenceScore),
      knowledgeMatchScore: state.knowledge.knowledgeMatch,
      imageQualityScore: state.image.quality,
      bullishEvidenceCount: Math.round(state.evidence.bullishEvidence),
      bearishEvidenceCount: Math.round(state.evidence.bearishEvidence),
      contradictionScore: Math.round(state.risk.contradictionRisk),
      selfValidationPassed: state.validation.selfVerification,
      decisionFilter: state.validation.validationPassed ? 'Passed' : 'Flagged',
      noTradeReason: state.decision.finalSignal === 'NO_TRADE' ? state.decision.decisionReason : '',
      analysis: {
        trend: state.market.trend.direction,
        support: `${state.market.supportResistance.nearestSupport}`,
        resistance: `${state.market.supportResistance.nearestResistance}`,
        candlestickPattern: state.market.candlestick.pattern,
        momentum: state.market.momentum.direction,
        marketCondition: state.market.regime.type
      },
      reason: state.decision.decisionReason,
      state // Include full state for advanced debugging if needed
    };

    return sendJson(res, 200, legacyResponse);

  } catch (error: any) {
    const status = error instanceof AppError ? error.status : 500;
    const code = error instanceof AppError ? error.code : ErrorCode.INTERNAL_ERROR;
    
    logger.error('Analysis request failed', error, { sessionId });
    
    return sendError(res, status, code, error.message || 'Internal Server Error');
  }
}
