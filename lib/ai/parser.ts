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
      // Return a default structure for invalid chart to satisfy TS, though UI handles it
      return { 
        validChart: false,
        prediction: 'NEUTRAL',
        confidence: 0,
        primaryScenario: 'N/A',
        alternativeScenario: 'N/A',
        risk: 'Low',
        reason: 'The provided image is not recognized as a trading chart.',
        analysis: {
          trend: [],
          marketStructure: [],
          support: [],
          resistance: [],
          liquidity: [],
          orderBlocks: [],
          fvg: [],
          patterns: [],
          momentum: [],
          volume: []
        }
      };
    }

    // Map and sanitize fields
    return {
      validChart: parsed.validChart ?? true,
      prediction: parsed.prediction || 'NEUTRAL',
      confidence: parsed.confidence || 0,
      primaryScenario: parsed.primaryScenario || 'N/A',
      alternativeScenario: parsed.alternativeScenario || 'N/A',
      risk: parsed.risk || 'Medium',
      reason: parsed.reason || 'No reasoning provided.',
      analysis: {
        trend: parsed.analysis?.trend || [],
        marketStructure: parsed.analysis?.marketStructure || [],
        support: parsed.analysis?.support || [],
        resistance: parsed.analysis?.resistance || [],
        liquidity: parsed.analysis?.liquidity || [],
        orderBlocks: parsed.analysis?.orderBlocks || [],
        fvg: parsed.analysis?.fvg || [],
        patterns: parsed.analysis?.patterns || [],
        momentum: parsed.analysis?.momentum || [],
        volume: parsed.analysis?.volume || []
      }
    };
  } catch (error) {
    logger.error("Failed to parse AI response", error, { rawResponse: jsonString });
    throw new Error("Invalid response format from AI analyzer");
  }
};
