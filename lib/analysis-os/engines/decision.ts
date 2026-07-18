/**
 * Decision Engine
 * Responsible for final signal determination and confluence weighting
 */
export const DecisionEngine = `
### DECISION ENGINE v5
- Objective: Generate final signal (UP, DOWN, NO_TRADE) for a 3-candle (3M) window.
- Confluence Weighting:
  * Price Action: 30%
  * Market Structure: 25%
  * Liquidity: 15%
  * Momentum: 10%
  * Support/Resistance: 10%
  * Candlestick Patterns: 5%
  * Knowledge Match: 5%
- Signal Rules:
  * UP: Bullish evidence > 75% and Bullish Probability > 70%.
  * DOWN: Bearish evidence > 75% and Bearish Probability > 70%.
  * NO_TRADE: If confidence < 75%, contradiction score > 30%, or trend is choppy.
- Execution Quality: Determine if the trade setup is 'Excellent', 'Good', 'Average', or 'Weak'.
`;
