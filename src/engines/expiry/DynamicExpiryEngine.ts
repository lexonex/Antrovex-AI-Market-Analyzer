import { AnalysisState } from '../../core/state/AnalysisState.js';
import { EXPIRY_RULES } from '../../rules/expiry.rules.js';
import { logger } from '../../core/utils/logger.js';

export class DynamicExpiryEngine {
  public static async execute(state: AnalysisState): Promise<void> {
    const startTime = Date.now();
    logger.info('DynamicExpiryEngine: Calculating optimal trade duration');

    try {
      const { market } = state;
      const { momentum, microPriceAction, trend, context } = market;

      const rule = EXPIRY_RULES.find(r => 
        r.condition(momentum.strength, trend.strength, microPriceAction.bodyExpansion, context)
      );

      if (rule) {
        state.decision.recommendedExpiry = rule.duration;
        state.decision.expiryReason = rule.reason;
        logger.info(`DynamicExpiryEngine: Selected ${rule.duration} - ${rule.reason}`);
      } else {
        state.decision.recommendedExpiry = '3M';
        state.decision.expiryReason = 'Default baseline duration.';
      }
    } catch (error: any) {
      logger.error('DynamicExpiryEngine: Failed to select expiry', error);
      state.decision.recommendedExpiry = '3M';
    }

    state.telemetry.engineDurations['expiry'] = Date.now() - startTime;
  }
}
