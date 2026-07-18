/**
 * Analysis OS v6 - Reasoning Prompt
 */

import { AnalysisState } from '../core/state/AnalysisState.js';

export const getReasoningPrompt = (state: AnalysisState) => `
You are the Antrovex AI Analysis OS Reasoning Layer.
Analyze the following structured market state and provide a final institutional-grade analysis.

### STRUCTURED STATE
${JSON.stringify(state, null, 2)}

### DIRECTIVE
- Review the weighted evidence and probabilities.
- Provide a deep technical analysis (3-4 paragraphs).
- Validate the final decision (UP, DOWN, NO_TRADE).
- Return ONLY raw JSON in the following format:

{
  "signal": "${state.decision.finalSignal}",
  "confidence": ${state.decision.decisionConfidence},
  "marketContext": "${state.market.context}",
  "recommendedExpiry": "${state.decision.recommendedExpiry}",
  "expiryJustification": "${state.decision.expiryReason}",
  "confidenceBreakdown": ${JSON.stringify(state.decision.confidenceBreakdown)},
  "reason": "Short summary of why this decision was made",
  "analysis": "Detailed technical reasoning paragraphs. You MUST explicitly mention the recommended expiry of ${state.decision.recommendedExpiry} and explain WHY it was chosen based on the provided technical context (${state.market.context}) and momentum (${state.market.momentum.strength}%).",
  "institutionalBias": "${state.market.institutionalBias}"
}
`;
