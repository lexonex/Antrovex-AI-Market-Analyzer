/**
 * Validation Engine
 * Responsible for image quality, contradictions, and self-verification
 */
export const ValidationEngine = `
### VALIDATION ENGINE v5
- Image Quality Check: Score 0-100 based on resolution, blur, and axis visibility. Reject if < 70.
- Contradiction Detection: Cross-reference engine outputs. Flag conflicts (e.g., Bullish Structure + Bearish Momentum).
- Self-Verification: Run a second internal review of the final signal. Disagreeing results trigger NO_TRADE.
- Decision Integrity: Ensure the reasoning (reason) logically supports the signal and confidence level.
`;
