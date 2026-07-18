/**
 * Probability Intelligence Engine
 */

import { AnalysisState } from '../../core/state/AnalysisState.js';
import { logger } from '../../core/utils/logger.js';

export class ProbabilityEngine {
  public static async execute(state: AnalysisState): Promise<void> {
    const startTime = Date.now();

    logger.info('ProbabilityEngine: Calculating statistical distribution');

    try {
      const bullish = state.evidence.bullishEvidence || 0;
      const bearish = state.evidence.bearishEvidence || 0;
      const neutral = 10; // Base neutral floor

      const total = bullish + bearish + neutral;
      
      const upProb = bullish / total;
      const downProb = bearish / total;
      const neutralProb = neutral / total;

      state.probability = {
        ...state.probability,
        bullishProbability: upProb,
        bearishProbability: downProb,
        neutralProbability: neutralProb,
        probabilityDistribution: {
          up: upProb,
          down: downProb,
          noTrade: neutralProb
        },
        confidenceScore: Math.max(0, Math.min(100, (state.evidence.evidenceStrength || 0) - (state.risk.riskPenalty || 0)))
      };

      logger.info(`ProbabilityEngine: Confidence Score = ${state.probability.confidenceScore.toFixed(1)}%`);
    } catch (error: any) {
      logger.error('ProbabilityEngine: Calculation failed', error);
    }

    state.telemetry.engineDurations['probability'] = Date.now() - startTime;
  }
}
