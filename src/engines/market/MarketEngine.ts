/**
 * Institutional Market Intelligence Engine
 */

import { AnalysisState } from '../../core/state/AnalysisState.js';
import { logger } from '../../core/utils/logger.js';
import { TechnicalContextLevel, MarketRegimeType } from './types.js';

export class MarketEngine {
  public static async execute(state: AnalysisState): Promise<void> {
    const startTime = Date.now();

    logger.info('MarketEngine: Refining institutional intelligence');

    try {
      const { trend, structure, regime, momentum, microPriceAction } = state.market;

      // 1. Technical Context Classification
      let context = TechnicalContextLevel.CONSOLIDATION;

      if (trend.strength > 70 && momentum.strength > 60) {
        context = TechnicalContextLevel.TRENDING;
      } else if (trend.strength > 50 && momentum.strength < 40) {
        context = TechnicalContextLevel.PULLBACK;
      } else if (regime.type === MarketRegimeType.COMPRESSION || microPriceAction.bodyExpansion < 30) {
        context = TechnicalContextLevel.COMPRESSION;
      } else if (state.market.volatility > 70) {
        context = TechnicalContextLevel.HIGH_VOLATILITY;
      }

      state.market.context = context;

      // 2. Refine Institutional Bias
      const trendDir = trend.direction || 'NEUTRAL';
      const structureType = structure.type || 'RANGING';
      
      if (trendDir === 'BULLISH' && structureType === 'BULLISH') {
        state.market.institutionalBias = 'BULLISH';
      } else if (trendDir === 'BEARISH' && structureType === 'BEARISH') {
        state.market.institutionalBias = 'BEARISH';
      } else {
        state.market.institutionalBias = 'NEUTRAL';
      }

      // 3. Refine Execution Context
      state.market.executionContext = `Context: ${context}. Regime: ${regime.type}. Trend: ${trendDir} (${trend.strength}%). Bias: ${state.market.institutionalBias}.`;

      logger.info(`MarketEngine: Context=${context}, Bias=${state.market.institutionalBias}`);
    } catch (error: any) {
      logger.error('MarketEngine: Refinement failed', error);
    }

    state.telemetry.engineDurations['market'] = Date.now() - startTime;
  }
}
