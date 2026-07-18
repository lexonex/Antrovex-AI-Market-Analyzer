
export interface ScoringWeight {
  category: string;
  weight: number;
}

export const SCORING_WEIGHTS: ScoringWeight[] = [
  { category: 'Price Action', weight: 30 },
  { category: 'Structure', weight: 25 },
  { category: 'Momentum', weight: 15 },
  { category: 'Liquidity', weight: 10 },
  { category: 'Volatility', weight: 5 },
  { category: 'Institutional', weight: 5 },
  { category: 'S/R', weight: 5 },
  { category: 'Pattern', weight: 5 }
];

export const CONTRADICTION_PENALTIES = {
  MINOR: 5,
  MODERATE: 15,
  MAJOR: 25,
  CRITICAL: 50
};

export const DECISION_THRESHOLDS = {
  EXCEPTIONAL: 95,
  HIGH: 85,
  GOOD: 75,
  MODERATE: 65,
  WEAK: 55,
  MINIMUM: 50
};
