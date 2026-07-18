/**
 * Decision Intelligence Engine
 */

import { AnalysisState } from '../../core/state/AnalysisState.js';
import { Signal } from './types.js';
import { logger } from '../../core/utils/logger.js';
import { DECISION_THRESHOLDS } from '../../rules/scoring.rules.js';
import { SIGNAL_RULES } from '../../rules/decision.rules.js';

export class DecisionEngine {
  public static async execute(state: AnalysisState): Promise<void> {
    const startTime = Date.now();
    logger.info('DecisionEngine: Executing deterministic decision logic');

    try {
      const { probability } = state;
      const { bullishProbability, bearishProbability, confidenceScore } = probability;
      
      let signal = Signal.NO_TRADE;
      
      // 1. Determine Bias and Spread
      const bias = bullishProbability > bearishProbability ? Signal.UP : Signal.DOWN;
      const spread = Math.abs(bullishProbability - bearishProbability);
      
      // 2. Threshold Validation
      const isConfidenceHighEnough = confidenceScore >= SIGNAL_RULES.MINIMUM_CONFIDENCE;
      const isSpreadWideEnough = spread >= SIGNAL_RULES.MINIMUM_SPREAD;

      // 3. Decision Logic
      if (isConfidenceHighEnough && isSpreadWideEnough) {
        signal = bias;
      }

      // 4. Finalize Decision State
      state.decision = {
        ...state.decision,
        finalSignal: signal,
        decisionConfidence: confidenceScore,
        decisionReason: this.generateReason(state, signal, confidenceScore, spread),
        executionApproval: signal !== Signal.NO_TRADE,
        auditTrail: [...(state.decision.auditTrail || []), `Decision: ${signal} @ ${confidenceScore.toFixed(1)}% (Spread: ${spread.toFixed(2)})`]
      };

      logger.info(`DecisionEngine: Signal=${signal}, Confidence=${confidenceScore.toFixed(1)}%, Spread=${spread.toFixed(2)}`);
    } catch (error: any) {
      logger.error('DecisionEngine: Decision logic failed', error);
      state.decision.finalSignal = Signal.NO_TRADE;
    }

    state.telemetry.engineDurations['decision'] = Date.now() - startTime;
  }

  private static generateReason(state: AnalysisState, signal: Signal, confidence: number, spread: number): string {
    if (signal === Signal.NO_TRADE) {
      if (confidence < SIGNAL_RULES.MINIMUM_CONFIDENCE) {
        return `${SIGNAL_RULES.REJECTION_REASONS.LOW_CONFIDENCE} (Req: ${SIGNAL_RULES.MINIMUM_CONFIDENCE}%, Got: ${confidence.toFixed(1)}%)`;
      }
      if (spread < SIGNAL_RULES.MINIMUM_SPREAD) {
        return `${SIGNAL_RULES.REJECTION_REASONS.AMBIGUOUS_FLOW} (Req Spread: ${SIGNAL_RULES.MINIMUM_SPREAD}, Got: ${spread.toFixed(2)})`;
      }
      return SIGNAL_RULES.REJECTION_REASONS.HIGH_RISK;
    }
    
    let label = "STANDARD";
    if (confidence >= DECISION_THRESHOLDS.EXCEPTIONAL) label = "EXCEPTIONAL";
    else if (confidence >= DECISION_THRESHOLDS.HIGH) label = "HIGH_PROBABILITY";
    else if (confidence < DECISION_THRESHOLDS.MODERATE) label = "WEAK_OPPORTUNITY";

    return `${label} ${signal} execution identified. Expiry: ${state.decision.recommendedExpiry}. Reason: ${state.decision.expiryReason}`;
  }
}
