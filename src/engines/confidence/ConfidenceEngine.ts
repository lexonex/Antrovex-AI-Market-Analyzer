import { AnalysisState } from '../../core/state/AnalysisState.js';
import { SCORING_WEIGHTS, CONTRADICTION_PENALTIES } from '../../rules/scoring.rules.js';
import { CONTRADICTION_RULES } from '../../rules/contradiction.rules.js';
import { logger } from '../../core/utils/logger.js';
import { ConfidenceComponent } from '../decision/types.js';

export class ConfidenceEngine {
  public static async execute(state: AnalysisState): Promise<void> {
    const startTime = Date.now();
    logger.info('ConfidenceEngine: Calculating weighted confidence score');

    try {
      const { market, evidence, risk } = state;
      
      // 1. Base Score from Evidence
      const breakdown: ConfidenceComponent[] = SCORING_WEIGHTS.map(sw => {
        const factor = evidence.supportingEvidence.find(e => e.category === sw.category);
        const score = factor ? factor.value : 0;
        return {
          name: sw.category,
          score,
          weight: sw.weight,
          contribution: (score / 100) * sw.weight,
          status: score > 0 ? 'PRESENT' : 'UNKNOWN'
        };
      });

      let totalContribution = breakdown.reduce((acc, curr) => acc + curr.contribution, 0);

      // 2. Apply Contradiction Penalties
      let contradictionPenalty = 0;
      
      // Trend vs Momentum
      if (market.trend.direction !== 'NEUTRAL' && market.momentum.direction !== 'NEUTRAL') {
        const trendDir = market.trend.direction === 'BULLISH' ? 'UP' : 'DOWN';
        if (trendDir !== market.momentum.direction) {
          contradictionPenalty += CONTRADICTION_RULES.TREND_VS_MOMENTUM.penalty;
          logger.warn('ConfidenceEngine: Trend/Momentum contradiction detected');
        }
      }

      // 3. Context Bonus
      let contextBonus = 0;
      if (market.context === 'TRENDING' && market.trend.strength > 80) {
        contextBonus = 5;
      }

      const finalConfidence = Math.max(0, Math.min(100, totalContribution + contextBonus - contradictionPenalty - risk.riskPenalty));

      state.probability.confidenceScore = finalConfidence;
      state.decision.decisionConfidence = finalConfidence;
      state.decision.confidenceBreakdown = breakdown;

      logger.info(`ConfidenceEngine: Final=${finalConfidence.toFixed(1)}% (Base:${totalContribution.toFixed(1)}, Penalty:${contradictionPenalty + risk.riskPenalty}, Bonus:${contextBonus})`);
    } catch (error: any) {
      logger.error('ConfidenceEngine: Calculation failed', error);
    }

    state.telemetry.engineDurations['confidence'] = Date.now() - startTime;
  }
}
