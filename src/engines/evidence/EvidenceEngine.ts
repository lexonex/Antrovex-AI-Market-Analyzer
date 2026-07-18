/**
 * Evidence Intelligence Engine
 */

import { AnalysisState } from '../../core/state/AnalysisState.js';
import { EvidenceFactor } from './types.js';
import { logger } from '../../core/utils/logger.js';

export class EvidenceEngine {
  public static async execute(state: AnalysisState): Promise<void> {
    const startTime = Date.now();

    logger.info('EvidenceEngine: Weighting market evidence');

    try {
      const supporting: EvidenceFactor[] = [];
      const contradicting: EvidenceFactor[] = [];
      
      let bullish = 0;
      let bearish = 0;

      // 1. Market Structure (25%)
      const structure = state.market.structure;
      if (structure) {
        if (structure.type === 'BULLISH') {
          const val = (structure.strength || 0) * 0.25;
          bullish += val;
          supporting.push({ name: 'Bullish Structure', value: val, type: 'BULLISH', category: 'Structure', quality: 90 });
        } else if (structure.type === 'BEARISH') {
          const val = (structure.strength || 0) * 0.25;
          bearish += val;
          supporting.push({ name: 'Bearish Structure', value: val, type: 'BEARISH', category: 'Structure', quality: 90 });
        }
      }

      // 2. Momentum (15%)
      const momentum = state.market.momentum;
      if (momentum) {
        if (momentum.direction === 'UP') {
          const val = (momentum.strength || 0) * 0.15;
          bullish += val;
          supporting.push({ name: 'Upward Momentum', value: val, type: 'BULLISH', category: 'Momentum', quality: 80 });
        } else if (momentum.direction === 'DOWN') {
          const val = (momentum.strength || 0) * 0.15;
          bearish += val;
          supporting.push({ name: 'Downward Momentum', value: val, type: 'BEARISH', category: 'Momentum', quality: 80 });
        }
      }

      // 3. Institutional Bias (30%)
      if (state.market.institutionalBias === 'BULLISH') {
        bullish += 30;
      } else if (state.market.institutionalBias === 'BEARISH') {
        bearish += 30;
      }

      // 4. Knowledge Match influence
      if (state.knowledge.knowledgeInfluence > 0) {
        bullish += state.knowledge.knowledgeInfluence;
      } else if (state.knowledge.knowledgeInfluence < 0) {
        bearish += Math.abs(state.knowledge.knowledgeInfluence);
      }

      state.evidence = {
        ...state.evidence,
        bullishEvidence: bullish,
        bearishEvidence: bearish,
        supportingEvidence: supporting,
        contradictingEvidence: contradicting,
        evidenceStrength: Math.max(bullish, bearish),
        confluenceScore: (bullish > 0 && bearish > 0) ? (Math.min(bullish, bearish) / Math.max(bullish, bearish)) * 100 : 0
      };

      logger.info(`EvidenceEngine: Bullish=${bullish.toFixed(1)}, Bearish=${bearish.toFixed(1)}`);
    } catch (error: any) {
      logger.error('EvidenceEngine: Failed to weigh evidence', error);
    }

    state.telemetry.engineDurations['evidence'] = Date.now() - startTime;
  }
}
