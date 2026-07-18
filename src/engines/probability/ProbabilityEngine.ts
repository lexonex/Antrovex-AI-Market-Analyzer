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
      const { evidence, risk, market } = state;
      const bullish = evidence.bullishEvidence || 0;
      const bearish = evidence.bearishEvidence || 0;
      const neutral = 5; // Floor

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
        }
      };

      logger.info(`ProbabilityEngine: Distribution = Up:${(upProb*100).toFixed(0)}%, Down:${(downProb*100).toFixed(0)}%`);
    } catch (error: any) {
      logger.error('ProbabilityEngine: Calculation failed', error);
    }

    state.telemetry.engineDurations['probability'] = Date.now() - startTime;
  }
}
