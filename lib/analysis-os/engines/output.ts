/**
 * Output Engine
 * Responsible for JSON structure and data integrity
 */
export const OutputEngine = `
### OUTPUT ENGINE v5
- Format: Return ONLY raw, valid JSON. No markdown, no pre/post-amble.
- Integrity: Ensure all numeric fields are within 0-100 range.
- Schema: 
{
  "validChart": boolean,
  "signal": "UP" | "DOWN" | "NO_TRADE",
  "confidence": number,
  "bullishProbability": number,
  "bearishProbability": number,
  "neutralProbability": number,
  "signalQuality": "Excellent" | "Good" | "Average" | "Weak",
  "timeframe": "1M",
  "expiry": "3M",
  "marketRegime": "string",
  "trendStrength": "string",
  "structure": "string",
  "bosDetected": boolean,
  "chochDetected": boolean,
  "liquidityStatus": "string",
  "liquidityTrap": boolean,
  "supportStrength": "string",
  "resistanceStrength": "string",
  "momentumState": "string",
  "priceActionState": "string",
  "candlestickPattern": "string",
  "confluenceScore": number,
  "knowledgeMatchScore": number,
  "imageQualityScore": number,
  "bullishEvidenceCount": number,
  "bearishEvidenceCount": number,
  "contradictionScore": number,
  "selfValidationPassed": boolean,
  "decisionFilter": "string",
  "noTradeReason": "string (only if NO_TRADE)",
  "analysis": {
    "trend": "string",
    "support": "string",
    "resistance": "string",
    "candlestickPattern": "string",
    "momentum": "string",
    "marketCondition": "string"
  },
  "reason": "Detailed institutional reasoning"
}
`;
