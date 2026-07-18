
import { DECISION_THRESHOLDS } from './scoring.rules.js';

export const SIGNAL_RULES = {
  MINIMUM_CONFIDENCE: DECISION_THRESHOLDS.MINIMUM,
  MINIMUM_SPREAD: 0.15, // Bullish vs Bearish probability difference
  REJECTION_REASONS: {
    LOW_CONFIDENCE: 'Insufficient technical evidence to support a high-probability execution.',
    HIGH_RISK: 'Elevated market risk or contradiction level detected.',
    AMBIGUOUS_FLOW: 'Market flow is currently balanced with no clear directional bias.'
  }
};
