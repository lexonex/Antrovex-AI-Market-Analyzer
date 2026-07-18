import { AnalysisState } from '../../core/state/AnalysisState.js';
import { logger } from '../../core/utils/logger.js';
import { AnalysisResult } from '../../types/analysis.js';

export class OutputEngine {
  public static async execute(state: AnalysisState): Promise<AnalysisResult> {
    const startTime = Date.now();
    logger.info('OutputEngine: Finalizing analysis packet for API');

    const result: AnalysisResult = {
      validChart: state.image.chartDetected,
      signal: state.decision.finalSignal as any,
      confidence: Math.round(state.decision.decisionConfidence),
      bullishProbability: Math.round(state.probability.bullishProbability * 100),
      bearishProbability: Math.round(state.probability.bearishProbability * 100),
      neutralProbability: Math.round(state.probability.neutralProbability * 100),
      expiry: state.decision.recommendedExpiry || '3M',
      expiryReason: state.decision.expiryReason || 'Default duration.',
      marketRegime: state.market.regime?.type || 'UNKNOWN',
      trendStrength: `${state.market.trend.strength}%`,
      structure: state.market.structure?.type || 'UNKNOWN',
      momentumState: `${state.market.momentum.direction} (${state.market.momentum.strength}%)`,
      priceActionState: state.market.microPriceAction.currentCandleBehaviour,
      candlestickPattern: state.market.candlestick.pattern,
      confluenceScore: Math.round(state.evidence.confluenceScore),
      knowledgeMatchScore: state.knowledge.knowledgeMatch,
      imageQualityScore: state.image.quality,
      reason: state.decision.decisionReason,
      analysis: state.decision.decisionSummary,
      institutionalBias: state.market.institutionalBias,
      
      confidenceBreakdown: state.decision.confidenceBreakdown,
      evidence: {
        bullish: state.evidence.bullishEvidence,
        bearish: state.evidence.bearishEvidence,
        confluence: state.evidence.confluenceScore,
        votes: state.evidence.engineVotes
      },
      validation: {
        passed: state.validation.validationPassed,
        mandatory: state.validation.missingData,
        optional: state.validation.invalidData
      },
      risk: {
        riskPenalty: state.risk.riskPenalty,
        overallRisk: state.risk.overallRisk,
        factors: state.risk.factors
      },
      telemetry: {
        engineDurations: state.telemetry.engineDurations
      },
      audit: state.decision.auditTrail || []
    };

    state.telemetry.engineDurations['output'] = Date.now() - startTime;
    return result;
  }
}
