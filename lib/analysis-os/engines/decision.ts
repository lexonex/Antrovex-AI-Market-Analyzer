/**
 * Decision Engine
 * Responsible for final signal determination and confluence weighting
 */
export const DecisionEngine = `
### DECISION ENGINE v7
- Objective: Generate final signal (UP, DOWN, NO_TRADE) for a 3-candle (3M) window.
- Confluence Weighting:
  * Price Action: 30%
  * Market Structure: 25%
  * Liquidity: 15%
  * Momentum: 10%
  * Risk/Reward: 10%
  * Support/Resistance: 5%
  * Knowledge Match: 5%
- Signal Rules:
  * UP: Bullish Probability > 65% and Contradiction Score < 35%.
  * DOWN: Bearish Probability > 65% and Contradiction Score < 35%.
  * NO_TRADE: If Bullish/Bearish deltas are < 20%, confidence < 60%, or Risk Engine flags 'High Execution Risk'.
- Execution Quality: 
  * Excellent: Confidence > 85%
  * Good: Confidence 75-85%
  * Average: Confidence 60-75%
  * Weak: Confidence < 60%
`;
