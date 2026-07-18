
import { AnalysisState } from '../../core/state/AnalysisState.js';
import { SCORING_WEIGHTS } from '../../rules/scoring.rules.js';
import { logger } from '../../core/utils/logger.js';
import { EvidenceFactor } from '../evidence/types.js';

export class EvidenceScoringEngine {
  public static async execute(state: AnalysisState): Promise<void> {
    const startTime = Date.now();
    logger.info('EvidenceScoringEngine: Aggregating deterministic evidence scores');

    try {
      const { market } = state;
      const supporting: EvidenceFactor[] = [];
      const engineVotes: any[] = [];
      
      let bullish = 0;
      let bearish = 0;

      for (const weight of SCORING_WEIGHTS) {
        let score = 0;
        let vote: 'BULLISH' | 'BEARISH' | 'NEUTRAL' = 'NEUTRAL';

        switch (weight.category) {
          case 'Price Action':
            score = (market.microPriceAction.bodyExpansion + market.microPriceAction.wickRejection) / 2;
            vote = this.getDirectionalVote(market.trend.direction, score);
            break;
          case 'Structure':
            score = market.structure.strength;
            vote = market.structure.type as any;
            break;
          case 'Momentum':
            score = market.momentum.strength;
            vote = market.momentum.direction === 'UP' ? 'BULLISH' : market.momentum.direction === 'DOWN' ? 'BEARISH' : 'NEUTRAL';
            break;
          case 'Liquidity':
            score = market.liquidity.quality;
            vote = market.liquidity.direction === 'UP' ? 'BULLISH' : market.liquidity.direction === 'DOWN' ? 'BEARISH' : 'NEUTRAL';
            break;
          case 'Volatility':
            score = 100 - Math.abs(50 - market.volatility) * 2;
            vote = 'NEUTRAL';
            break;
          case 'Institutional':
            score = 80;
            vote = market.institutionalBias === 'BULLISH' ? 'BULLISH' : market.institutionalBias === 'BEARISH' ? 'BEARISH' : 'NEUTRAL';
            break;
          case 'S/R':
            score = market.supportResistance.zoneStrength;
            vote = 'NEUTRAL';
            break;
          case 'Pattern':
            score = market.candlestick.patternStrength;
            vote = market.candlestick.buyerPressure > market.candlestick.sellerPressure ? 'BULLISH' : 'BEARISH';
            break;
        }

        const contribution = (score / 100) * weight.weight;
        engineVotes.push({ engine: weight.category, vote, score });

        if (vote === 'BULLISH') bullish += contribution;
        else if (vote === 'BEARISH') bearish += contribution;

        if (vote !== 'NEUTRAL') {
          supporting.push({
            name: weight.category,
            value: score,
            contribution,
            type: vote as any,
            category: weight.category as any,
            quality: score
          });
        }
      }

      state.evidence = {
        ...state.evidence,
        bullishEvidence: bullish,
        bearishEvidence: bearish,
        evidenceStrength: Math.max(bullish, bearish),
        confluenceScore: Math.abs(bullish - bearish),
        supportingEvidence: supporting,
        engineVotes
      };

      logger.info(`EvidenceScoringEngine: Bullish=${bullish.toFixed(1)}, Bearish=${bearish.toFixed(1)}`);
    } catch (error: any) {
      logger.error('EvidenceScoringEngine: Scoring failed', error);
    }

    state.telemetry.engineDurations['scoring'] = Date.now() - startTime;
  }

  private static getDirectionalVote(trend: string, score: number): 'BULLISH' | 'BEARISH' | 'NEUTRAL' {
    if (score < 30) return 'NEUTRAL';
    return trend === 'BULLISH' ? 'BULLISH' : trend === 'BEARISH' ? 'BEARISH' : 'NEUTRAL';
  }
}
