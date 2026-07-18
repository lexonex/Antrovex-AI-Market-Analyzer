/**
 * Risk Intelligence Engine
 */

import { AnalysisState } from '../../core/state/AnalysisState.js';
import { MarketRegimeType } from '../market/types.js';
import { logger } from '../../core/utils/logger.js';

export class RiskEngine {
  public static async execute(state: AnalysisState): Promise<void> {
    const startTime = Date.now();

    logger.info('RiskEngine: Assessing execution risks');

    try {
      let penalty = 0;
      const factors = [];

      // 1. Regime Risk
      const regimeType = state.market.regime?.type;
      if (regimeType === MarketRegimeType.SIDEWAYS_RANGE) {
        penalty += 15;
        factors.push({ name: 'Choppy Market', penalty: 15 });
      } else if (regimeType === MarketRegimeType.CONSOLIDATION) {
        penalty += 10;
        factors.push({ name: 'Consolidation', penalty: 10 });
      }

      // 2. Momentum Risk
      const momentumStrength = state.market.momentum?.strength || 0;
      if (momentumStrength < 40) {
        penalty += 10;
        factors.push({ name: 'Weak Momentum', penalty: 10 });
      }

      // 3. Image Risk
      const imageQuality = state.image?.quality || 0;
      if (imageQuality < 80) {
        const p = Math.max(0, (100 - imageQuality) * 0.5);
        penalty += p;
        factors.push({ name: 'Low Image Quality', penalty: p });
      }

      // 4. Structural Risk
      const structureStrength = state.market.structure?.strength || 0;
      if (structureStrength < 50) {
        penalty += 10;
        factors.push({ name: 'Weak Structure', penalty: 10 });
      }

      state.risk = {
        ...state.risk,
        riskPenalty: penalty,
        overallRisk: penalty,
        factors
      };

      logger.info(`RiskEngine: Total risk penalty = ${penalty.toFixed(1)}`);
    } catch (error: any) {
      logger.error('RiskEngine: Risk assessment failed', error);
    }

    state.telemetry.engineDurations['risk'] = Date.now() - startTime;
  }
}
