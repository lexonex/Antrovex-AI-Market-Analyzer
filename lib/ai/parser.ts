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
        signal: 'NO_TRADE',
        confidence: 0,
        bullishProbability: 0,
        bearishProbability: 0,
        neutralProbability: 0,
        signalQuality: 'Weak',
        timeframe: '1M',
        expiry: '3M',
        marketRegime: 'Unknown',
        trendStrength: 'None',
        structure: 'None',
        bosDetected: false,
        chochDetected: false,
        liquidityStatus: 'Unknown',
        liquidityTrap: false,
        supportStrength: 'None',
        resistanceStrength: 'None',
        momentumState: 'None',
        priceActionState: 'None',
        candlestickPattern: 'None',
        confluenceScore: 0,
        knowledgeMatchScore: 0,
        imageQualityScore: 0,
        bullishEvidenceCount: 0,
        bearishEvidenceCount: 0,
        contradictionScore: 0,
        selfValidationPassed: false,
        decisionFilter: 'Rejected',
        noTradeReason: 'Invalid Chart',
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
      signal: parsed.signal || 'NO_TRADE',
      confidence: parsed.confidence || 0,
      bullishProbability: parsed.bullishProbability || 0,
      bearishProbability: parsed.bearishProbability || 0,
      neutralProbability: parsed.neutralProbability || 0,
      signalQuality: parsed.signalQuality || 'Average',
      timeframe: parsed.timeframe || '1M',
      expiry: parsed.expiry || '3M',
      marketRegime: parsed.marketRegime || 'N/A',
      trendStrength: parsed.trendStrength || 'N/A',
      structure: parsed.structure || 'N/A',
      bosDetected: !!parsed.bosDetected,
      chochDetected: !!parsed.chochDetected,
      liquidityStatus: parsed.liquidityStatus || 'N/A',
      liquidityTrap: !!parsed.liquidityTrap,
      supportStrength: parsed.supportStrength || 'N/A',
      resistanceStrength: parsed.resistanceStrength || 'N/A',
      momentumState: parsed.momentumState || 'N/A',
      priceActionState: parsed.priceActionState || 'N/A',
      candlestickPattern: parsed.candlestickPattern || 'N/A',
      confluenceScore: parsed.confluenceScore || 0,
      knowledgeMatchScore: parsed.knowledgeMatchScore || 0,
      imageQualityScore: parsed.imageQualityScore || 0,
      bullishEvidenceCount: parsed.bullishEvidenceCount || 0,
      bearishEvidenceCount: parsed.bearishEvidenceCount || 0,
      contradictionScore: parsed.contradictionScore || 0,
      selfValidationPassed: !!parsed.selfValidationPassed,
      decisionFilter: parsed.decisionFilter || 'N/A',
      noTradeReason: parsed.noTradeReason || '',
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
