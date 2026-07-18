/**
 * Risk Intelligence Engine
 */

import { AnalysisState } from '../../core/state/AnalysisState.js';
import { MarketRegimeType } from '../market/types.js';
import { logger } from '../../core/utils/logger.js';
import { RISK_RULES } from '../../rules/risk.rules.js';

export class RiskEngine {
  public static async execute(state: AnalysisState): Promise<void> {
    const startTime = Date.now();
    logger.info('RiskEngine: Assessing execution risks');

    try {
      let penalty = 0;
      const factors = [];
      const { market, image } = state;

      // 1. Regime Risk
      if (market.regime?.type === MarketRegimeType.SIDEWAYS_RANGE) {
        penalty += 10;
        factors.push({ name: 'Sideways Market', penalty: 10 });
      }

      // 2. Volatility Risk
      if (market.volatility > 80 || market.volatility < 20) {
        penalty += RISK_RULES.FACTORS.VOLATILITY_SPIKE;
        factors.push({ name: 'Abnormal Volatility', penalty: RISK_RULES.FACTORS.VOLATILITY_SPIKE });
      }

      // 3. Image Risk
      if (image.quality < 70) {
        const p = Math.round((70 - image.quality) * 0.5);
        penalty += p;
        factors.push({ name: 'Low Image Quality', penalty: p });
      }

      state.risk = {
        ...state.risk,
        riskPenalty: Math.min(penalty, RISK_RULES.MAX_PENALTY),
        overallRisk: penalty,
        factors
      };

      logger.info(`RiskEngine: Total penalty = ${state.risk.riskPenalty.toFixed(1)}`);
    } catch (error: any) {
      logger.error('RiskEngine: Assessment failed', error);
    }

    state.telemetry.engineDurations['risk'] = Date.now() - startTime;
  }
}
