/**
 * Decision Intelligence Engine
 */

import { AnalysisState } from '../../core/state/AnalysisState.js';
import { Signal } from './types.js';
import { logger } from '../../core/utils/logger.js';

export class DecisionEngine {
  public static async execute(state: AnalysisState): Promise<void> {
    const startTime = Date.now();

    logger.info('DecisionEngine: Generating final execution signal');

    try {
      const { bullishProbability, bearishProbability, confidenceScore } = state.probability;
      
      let signal = Signal.NO_TRADE;
      const CONFIDENCE_THRESHOLD = 70;
      const PROBABILITY_THRESHOLD = 0.6;
      
      if (confidenceScore >= CONFIDENCE_THRESHOLD) {
        if (bullishProbability > bearishProbability && bullishProbability > PROBABILITY_THRESHOLD) {
          signal = Signal.UP;
        } else if (bearishProbability > bullishProbability && bearishProbability > PROBABILITY_THRESHOLD) {
          signal = Signal.DOWN;
        }
      }

      state.decision = {
        ...state.decision,
        finalSignal: signal,
        decisionConfidence: confidenceScore,
        decisionReason: this.generateReason(state, signal, confidenceScore, CONFIDENCE_THRESHOLD),
        executionApproval: signal !== Signal.NO_TRADE,
        auditTrail: [...(state.decision.auditTrail || []), `Decision finalized: ${signal}`]
      };

      logger.info(`DecisionEngine: Signal = ${signal}, Confidence = ${confidenceScore.toFixed(1)}%`);
    } catch (error: any) {
      logger.error('DecisionEngine: Decision generation failed', error);
      state.decision.finalSignal = Signal.NO_TRADE;
      state.decision.rejectionReason = `INTERNAL_ERROR: ${error.message}`;
    }

    state.telemetry.engineDurations['decision'] = Date.now() - startTime;
  }

  private static generateReason(state: AnalysisState, signal: Signal, confidence: number, threshold: number): string {
    if (signal === Signal.NO_TRADE) {
      if (confidence < threshold) return `LOW_CONFIDENCE: Score ${confidence.toFixed(1)}% below threshold of ${threshold}%.`;
      return "INDECISION: Insufficient directional probability spread.";
    }
    return `INSTITUTIONAL_${signal}: Setup detected with ${confidence.toFixed(1)}% confidence.`;
  }
}
