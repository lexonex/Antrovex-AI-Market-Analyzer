/**
 * AI Response Parser
 */

import { AnalysisResult } from "../../src/types/analysis.js";
import { logger } from "../logger/logger.js";

export const parseAnalysisResponse = (jsonString: string): AnalysisResult => {
  try {
    // Basic cleanup in case model returns markdown blocks despite instructions
    const cleaned = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    
    // Ensure essential fields exist
    if (parsed.validChart === false) {
      return { 
        validChart: false,
        signal: 'UP',
        confidence: 0,
        timeframe: '1M',
        expiry: '3M',
        analysis: {
          trend: 'N/A',
          support: 'N/A',
          resistance: 'N/A',
          candlestickPattern: 'N/A',
          momentum: 'N/A',
          marketCondition: 'N/A'
        },
        reason: 'The provided image is not recognized as a trading chart.'
      };
    }

    // Map and sanitize fields
    return {
      validChart: parsed.validChart ?? true,
      signal: parsed.signal || 'UP',
      confidence: parsed.confidence || 0,
      timeframe: parsed.timeframe || '1M',
      expiry: parsed.expiry || '3M',
      analysis: {
        trend: parsed.analysis?.trend || 'N/A',
        support: parsed.analysis?.support || 'N/A',
        resistance: parsed.analysis?.resistance || 'N/A',
        candlestickPattern: parsed.analysis?.candlestickPattern || 'N/A',
        momentum: parsed.analysis?.momentum || 'N/A',
        marketCondition: parsed.analysis?.marketCondition || 'N/A'
      },
      reason: parsed.reason || 'No reasoning provided.'
    };
  } catch (error) {
    logger.error("Failed to parse AI response", error, { rawResponse: jsonString });
    throw new Error("Invalid response format from AI analyzer");
  }
};
