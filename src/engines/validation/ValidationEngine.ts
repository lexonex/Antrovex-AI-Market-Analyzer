/**
 * Validation & Self-Verification Engine
 */

import { AnalysisState } from '../../core/state/AnalysisState.js';
import { logger } from '../../core/utils/logger.js';

export class ValidationEngine {
  public static async execute(state: AnalysisState): Promise<void> {
    const startTime = Date.now();

    const missingData = [];
    const invalidData = [];
    const contradictions = [];

    // 1. Critical Validation
    if (!state.image.chartDetected) {
      missingData.push('INVALID_CHART: No valid candlesticks detected.');
    }
    
    if (state.image.quality < 40) {
      invalidData.push('INCOMPLETE_TELEMETRY: Image quality too low for reliable institutional mapping.');
    }

    // 2. Structural Consistency
    if (state.market.trend.direction === 'BULLISH' && state.market.momentum.direction === 'DOWN' && state.market.momentum.strength > 70) {
      contradictions.push('MAPPING_INCONSISTENCY: Strong bearish momentum detected in bullish trend.');
    }

    // 3. Data Completeness
    if (state.market.regime.type === 'TRANSITION' && state.market.trend.direction === 'NEUTRAL') {
      logger.warn('ValidationEngine: Market in transition with neutral trend - higher uncertainty.');
    }

    const passed = missingData.length === 0 && invalidData.length === 0;

    state.validation = {
      ...state.validation,
      validationPassed: passed,
      validationScore: passed ? 100 : 30,
      missingData,
      invalidData,
      contradictions,
      selfVerification: passed,
      diagnosticSummary: passed 
        ? 'Validation Passed: Data consistency verified.' 
        : `Validation Failed: ${[...missingData, ...invalidData].join('; ')}`
    };

    if (!passed) {
      logger.error('ValidationEngine: State validation failed', state.validation.diagnosticSummary);
    }

    state.telemetry.engineDurations['validation'] = Date.now() - startTime;
  }
}
