/**
 * Analysis OS v6 - Extraction Prompt
 */

export const EXTRACTION_PROMPT = `
You are the Vision Layer of the Antrovex AI Analysis OS.
Extract the following technical data from the chart image.
Return ONLY raw JSON.

{
  "image": {
    "quality": 0-100,
    "isBlurred": boolean,
    "hasAxis": boolean,
    "platformVerified": boolean,
    "timeframeVerified": boolean,
    "visibleCandles": number,
    "currentPriceRegion": { "x": number, "y": number },
    "executionZone": { "x": number, "y": number, "width": number, "height": number },
    "chartBounds": { "x": number, "y": number, "width": number, "height": number },
    "screenshotHealth": 0-100,
    "visualContext": {
      "trendAppearance": "string",
      "volatilityAppearance": "string",
      "swingDensity": "string"
    }
  },
  "market": {
    "context": "TRENDING | PULLBACK | CONTINUATION | REVERSAL | COMPRESSION | CONSOLIDATION | HIGH_VOLATILITY | LOW_VOLATILITY",
    "regime": "STRONG_BULLISH | WEAK_BULLISH | STRONG_BEARISH | WEAK_BEARISH | SIDEWAYS_RANGE | CONSOLIDATION | COMPRESSION | EXPANSION | TRANSITION",
    "trend": "BULLISH | BEARISH | NEUTRAL",
    "trendStrength": 0-100,
    "structure": {
      "type": "BULLISH | BEARISH | RANGING",
      "bos": boolean,
      "choch": boolean,
      "strength": 0-100
    },
    "liquidity": {
      "status": "string",
      "direction": "UP | DOWN | NEUTRAL",
      "sweeps": boolean,
      "traps": boolean,
      "imbalances": boolean,
      "targetZones": ["string"],
      "quality": 0-100
    },
    "momentum": {
      "strength": 0-100,
      "direction": "UP | DOWN | NEUTRAL",
      "quality": 0-100
    },
    "candlestick": {
      "pattern": "string",
      "patternStrength": 0-100,
      "buyerPressure": 0-100,
      "sellerPressure": 0-100,
      "rejectionStrength": 0-100
    },
    "microPriceAction": {
      "last5Candles": "string",
      "currentCandleBehaviour": "string",
      "wickRejection": 0-100,
      "bodyExpansion": 0-100
    },
    "supportResistance": {
      "nearestSupport": number,
      "nearestResistance": number,
      "zoneStrength": 0-100
    },
    "volatility": 0-100,
    "compression": boolean,
    "expansion": boolean,
    "institutionalBias": "BULLISH | BEARISH | NEUTRAL"
  },
  "knowledgeMatch": 0-100
}
`;
