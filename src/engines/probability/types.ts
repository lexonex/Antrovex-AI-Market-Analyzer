/**
 * Probability Intelligence Engine Types
 */

export interface ProbabilityState {
  bullishProbability: number;
  bearishProbability: number;
  neutralProbability: number;
  probabilityDistribution: {
    up: number;
    down: number;
    noTrade: number;
  };
  confidenceScore: number;
  statisticalStrength: 'STRONG' | 'MODERATE' | 'WEAK' | 'VERY_WEAK';
  marketClarity: 'CLEAR' | 'MOSTLY_CLEAR' | 'MIXED' | 'UNCERTAIN' | 'HIGHLY_UNCERTAIN';
  decisionReadiness: 'READY' | 'BORDERLINE' | 'WAIT';
  probabilityReasoning: string;
}
