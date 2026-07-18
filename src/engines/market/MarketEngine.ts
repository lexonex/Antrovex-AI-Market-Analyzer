/**
 * Institutional Market Intelligence Engine
 */

import { AnalysisState } from '../../core/state/AnalysisState.js';
import { logger } from '../../core/utils/logger.js';

export class MarketEngine {
  public static async execute(state: AnalysisState): Promise<void> {
    const startTime = Date.now();

    logger.info('MarketEngine: Refining institutional intelligence');

    try {
      // 1. Validate required inputs for refinement
      if (!state.market.trend || !state.market.structure || !state.market.regime) {
        logger.warn('MarketEngine: Incomplete market state detected. Using defaults.');
      }

      // 2. Refine Institutional Bias
      const trendDir = state.market.trend.direction || 'NEUTRAL';
      const structureType = state.market.structure.type || 'RANGING';
      const trendStrength = state.market.trend.strength || 0;
      
      if (trendDir === 'BULLISH' && structureType === 'BULLISH') {
        state.market.institutionalBias = 'BULLISH';
      } else if (trendDir === 'BEARISH' && structureType === 'BEARISH') {
        state.market.institutionalBias = 'BEARISH';
      } else {
        state.market.institutionalBias = 'NEUTRAL';
      }

      // 3. Refine Execution Context
      const regime = state.market.regime.type || 'TRANSITION';
      state.market.executionContext = `Market in ${regime} regime. ${trendDir} trend (${trendStrength}%). Structure: ${structureType}. Institutional Bias: ${state.market.institutionalBias}.`;

      logger.info(`MarketEngine: Bias set to ${state.market.institutionalBias}`);
    } catch (error: any) {
      logger.error('MarketEngine: Refinement failed', error);
      // Graceful degradation: context is already initialized in StateManager
    }

    state.telemetry.engineDurations['market'] = Date.now() - startTime;
  }
}
