/**
 * Validation & Self-Verification Engine
 */

import { AnalysisState } from '../../core/state/AnalysisState.js';
import { logger } from '../../core/utils/logger.js';

export class ValidationEngine {
  public static async execute(state: AnalysisState): Promise<void> {
    const startTime = Date.now();
    logger.info('ValidationEngine: Performing Mandatory vs Optional audit');

    const mandatoryFailures: string[] = [];
    const optionalFailures: string[] = [];

    // 1. Mandatory Validation (Blocking)
    if (!state.image.chartDetected) mandatoryFailures.push('CHART_NOT_DETECTED');
    if (state.image.visibleCandles < 10) mandatoryFailures.push('INSUFFICIENT_CANDLES');
    if (!state.image.timeframeVerified) mandatoryFailures.push('TIMEFRAME_UNVERIFIED');
    if (!state.image.currentPriceRegion) mandatoryFailures.push('PRICE_REGION_MISSING');

    // 2. Optional Validation (Reduces Confidence)
    if (!state.market.structure.bos && !state.market.structure.choch) optionalFailures.push('NO_STRUCTURE_BREAK');
    if (state.market.supportResistance.zoneStrength < 30) optionalFailures.push('WEAK_SR_ZONES');
    if (!state.market.candlestick.pattern || state.market.candlestick.pattern === 'None') optionalFailures.push('NO_CANDLE_PATTERN');

    // 3. Execution Logic
    const passed = mandatoryFailures.length === 0;
    
    // Apply penalty for optional failures if they exist
    const optionalPenalty = optionalFailures.length * 5; 
    if (passed && optionalPenalty > 0) {
      state.decision.decisionConfidence = Math.max(0, state.decision.decisionConfidence - optionalPenalty);
      logger.info(`ValidationEngine: Optional failures reduced confidence by ${optionalPenalty}%`);
    }

    state.validation = {
      ...state.validation,
      validationPassed: passed,
      missingData: mandatoryFailures,
      invalidData: optionalFailures,
      selfVerification: passed,
      diagnosticSummary: passed 
        ? `Passed: All mandatory checks ok.`
        : `Failed: ${mandatoryFailures.join(', ')}`
    };

    if (!passed) {
      logger.error(`ValidationEngine: Mandatory failure - ${mandatoryFailures.join('|')}`);
      state.decision.finalSignal = 'NO_TRADE' as any;
      state.decision.decisionReason = `MANDATORY_VALIDATION_FAILURE: ${mandatoryFailures.join(', ')}`;
    }

    state.telemetry.engineDurations['validation'] = Date.now() - startTime;
  }
}
