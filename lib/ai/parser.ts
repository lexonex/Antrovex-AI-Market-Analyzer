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
      return { validChart: false, success: true };
    }

    return {
      ...parsed,
      success: parsed.success ?? true,
      validChart: parsed.validChart ?? true
    };
  } catch (error) {
    logger.error("Failed to parse AI response", error, { rawResponse: jsonString });
    throw new Error("Invalid response format from AI analyzer");
  }
};
