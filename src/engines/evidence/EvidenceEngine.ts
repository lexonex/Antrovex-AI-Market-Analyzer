/**
 * Evidence Intelligence Engine
 */

import { AnalysisState } from '../../core/state/AnalysisState.js';
import { EvidenceFactor } from './types.js';
import { logger } from '../../core/utils/logger.js';

export class EvidenceEngine {
  public static async execute(state: AnalysisState): Promise<void> {
    const startTime = Date.now();
    logger.info('EvidenceEngine: Executing Weighted Institutional Scoring (IESE)');

    try {
      const { market, knowledge } = state;
      const supporting: EvidenceFactor[] = [];
      const contradicting: EvidenceFactor[] = [];
      const engineVotes: any[] = [];
      
      let bullish = 0;
      let bearish = 0;

      // 1. Price Action (30%) - Prioritizing Micro PA for OTC
      const paWeight = 30;
      const microPA = market.microPriceAction;
      const macroPA = market.priceAction;
      
      // Calculate PA score (weighted towards micro for OTC)
      const microScore = (microPA.bodyExpansion + microPA.wickRejection) / 2;
      const macroScore = (macroPA.continuationProbability + macroPA.reversalProbability) / 2;
      const combinedPAScore = (microScore * 0.7) + (macroScore * 0.3);
      
      const paVote = this.getDirectionalVote(market.trend.direction, combinedPAScore);
      this.applyEvidence(bullish, bearish, paVote, combinedPAScore, paWeight, 'Price Action', 'Price Action', supporting, engineVotes);
      if (paVote === 'BULLISH') bullish += (combinedPAScore / 100) * paWeight;
      else if (paVote === 'BEARISH') bearish += (combinedPAScore / 100) * paWeight;

      // 2. Market Structure (25%)
      const structWeight = 25;
      const structScore = market.structure.strength;
      const structVote = market.structure.type as any;
      this.applyEvidence(bullish, bearish, structVote, structScore, structWeight, 'Market Structure', 'Structure', supporting, engineVotes);
      if (structVote === 'BULLISH') bullish += (structScore / 100) * structWeight;
      else if (structVote === 'BEARISH') bearish += (structScore / 100) * structWeight;

      // 3. Momentum (15%)
      const momWeight = 15;
      const momScore = market.momentum.strength;
      const momVote = market.momentum.direction === 'UP' ? 'BULLISH' : market.momentum.direction === 'DOWN' ? 'BEARISH' : 'NEUTRAL';
      this.applyEvidence(bullish, bearish, momVote, momScore, momWeight, 'Market Momentum', 'Momentum', supporting, engineVotes);
      if (momVote === 'BULLISH') bullish += (momScore / 100) * momWeight;
      else if (momVote === 'BEARISH') bearish += (momScore / 100) * momWeight;

      // 4. Liquidity (10%)
      const liqWeight = 10;
      const liqScore = market.liquidity.quality;
      const liqVote = market.liquidity.direction === 'UP' ? 'BULLISH' : market.liquidity.direction === 'DOWN' ? 'BEARISH' : 'NEUTRAL';
      this.applyEvidence(bullish, bearish, liqVote, liqScore, liqWeight, 'Liquidity Flow', 'Liquidity', supporting, engineVotes);
      if (liqVote === 'BULLISH') bullish += (liqScore / 100) * liqWeight;
      else if (liqVote === 'BEARISH') bearish += (liqScore / 100) * liqWeight;

      // 5. Volatility (5%)
      const volWeight = 5;
      const volScore = 100 - Math.abs(50 - market.volatility) * 2; // Optimal volatility around 50%
      engineVotes.push({ engine: 'Volatility', vote: 'NEUTRAL', score: volScore });

      // 6. Institutional Context (5%)
      const instWeight = 5;
      const instScore = 80; // High confidence if identified
      const instVote = market.institutionalBias === 'BULLISH' ? 'BULLISH' : market.institutionalBias === 'BEARISH' ? 'BEARISH' : 'NEUTRAL';
      this.applyEvidence(bullish, bearish, instVote, instScore, instWeight, 'Institutional Bias', 'Institutional', supporting, engineVotes);
      if (instVote === 'BULLISH') bullish += (instScore / 100) * instWeight;
      else if (instVote === 'BEARISH') bearish += (instScore / 100) * instWeight;

      // 7. Support / Resistance (5%)
      const srWeight = 5;
      const srScore = market.supportResistance.zoneStrength;
      // S/R is usually neutral unless rejected
      engineVotes.push({ engine: 'S/R', vote: 'NEUTRAL', score: srScore });

      // 8. Pattern Confirmation (5%)
      const patWeight = 5;
      const patScore = market.candlestick.patternStrength;
      const patVote = market.candlestick.buyerPressure > market.candlestick.sellerPressure ? 'BULLISH' : 'BEARISH';
      this.applyEvidence(bullish, bearish, patVote, patScore, patWeight, 'Pattern Confirmation', 'Pattern', supporting, engineVotes);
      if (patVote === 'BULLISH') bullish += (patScore / 100) * patWeight;
      else if (patVote === 'BEARISH') bearish += (patScore / 100) * patWeight;

      state.evidence = {
        ...state.evidence,
        bullishEvidence: bullish,
        bearishEvidence: bearish,
        evidenceStrength: Math.max(bullish, bearish),
        confluenceScore: (bullish > 0 && bearish > 0) ? (Math.abs(bullish - bearish) / 100) * 100 : Math.max(bullish, bearish),
        supportingEvidence: supporting,
        contradictingEvidence: contradicting,
        engineVotes
      };

      logger.info(`EvidenceEngine: Bullish=${bullish.toFixed(1)}, Bearish=${bearish.toFixed(1)}`);
    } catch (error: any) {
      logger.error('EvidenceEngine: Scoring failed', error);
    }

    state.telemetry.engineDurations['evidence'] = Date.now() - startTime;
  }

  private static getDirectionalVote(trend: string, score: number): 'BULLISH' | 'BEARISH' | 'NEUTRAL' {
    if (score < 30) return 'NEUTRAL';
    return trend === 'BULLISH' ? 'BULLISH' : trend === 'BEARISH' ? 'BEARISH' : 'NEUTRAL';
  }

  private static applyEvidence(
    bullish: number, 
    bearish: number, 
    vote: 'BULLISH' | 'BEARISH' | 'NEUTRAL' | 'UNKNOWN', 
    score: number, 
    weight: number, 
    name: string, 
    category: any,
    supporting: EvidenceFactor[],
    engineVotes: any[]
  ) {
    const contribution = (score / 100) * weight;
    engineVotes.push({ engine: name, vote, score });
    
    if (vote !== 'NEUTRAL' && vote !== 'UNKNOWN') {
      supporting.push({
        name,
        value: score,
        contribution,
        type: vote as any,
        category,
        quality: score
      });
    }
  }
}
