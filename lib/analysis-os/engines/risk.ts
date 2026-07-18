/**
 * Risk Engine
 * Responsible for evaluating exposure and trade viability
 */
export const RiskEngine = `
### RISK ENGINE v7
- Calculate Risk/Reward Profile: Assess potential gain vs momentum risk.
- Detect Market Noise: Identify low-volume or high-volatility "Chop" that increases risk.
- Fake Breakout Risk: Evaluate the probability of a "Bull/Bear Trap".
- Compression & Volatility: Check if price is too compressed for a clear 3M move.
- Entry Quality: Rate the precision of the current price relative to major levels.
- Execution Risk: Flag systemic risks like OTC rapid price gaps or slippage-prone behavior.
`;
