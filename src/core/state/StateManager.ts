/**
 * Analysis OS v6 - State Manager
 */

import { AnalysisState, SessionState } from './AnalysisState.js';
import { MarketRegimeType } from '../../engines/market/types.js';
import { Signal } from '../../engines/decision/types.js';

export class StateManager {
  public static createInitialState(sessionId: string): AnalysisState {
    const session: SessionState = {
      sessionId,
      timestamp: Date.now(),
      broker: 'Quotex OTC',
      timeframe: '1M'
    };

    return {
      session,
      image: {
        quality: 0,
        chartDetected: false,
        platformVerified: false,
        timeframeVerified: false,
        visibleCandles: 0,
        currentPriceRegion: { x: 0, y: 0 },
        executionZone: { x: 0, y: 0, width: 0, height: 0 },
        chartBounds: { x: 0, y: 0, width: 0, height: 0 },
        screenshotHealth: 0,
        visualContext: {
          trendAppearance: 'Unknown',
          volatilityAppearance: 'Unknown',
          swingDensity: 'Unknown'
        },
        geometry: { width: 0, height: 0 }
      },
      market: {
        regime: { type: MarketRegimeType.TRANSITION, confidence: 0, stability: 0 },
        trend: { direction: 'NEUTRAL', strength: 0, health: 0, confidence: 0 },
        structure: { type: 'RANGING', bos: false, choch: false, strength: 0, institutionalBias: 'NEUTRAL' },
        liquidity: { status: 'Unknown', direction: 'NEUTRAL', quality: 0, confidence: 0, traps: false },
        supportResistance: { nearestSupport: 0, nearestResistance: 0, zoneStrength: 0, executionDistance: 0 },
        candlestick: { pattern: 'None', patternStrength: 0, buyerPressure: 0, sellerPressure: 0, rejectionStrength: 0 },
        priceAction: { currentBehaviour: 'Unknown', continuationProbability: 0, reversalProbability: 0, executionContext: 'Unknown' },
        momentum: { direction: 'NEUTRAL', strength: 0, quality: 0, confidence: 0 },
        volatility: 0,
        compression: false,
        expansion: false,
        executionContext: '',
        institutionalBias: 'NEUTRAL'
      },
      knowledge: {
        knowledgeMatch: 0,
        matchedPatterns: [],
        rejectedPatterns: [],
        institutionalRules: [],
        otcBehaviour: '',
        psychologyContext: '',
        recommendations: [],
        conflictingKnowledge: [],
        knowledgeInfluence: 0
      },
      evidence: {
        bullishEvidence: 0,
        bearishEvidence: 0,
        neutralEvidence: 0,
        supportingEvidence: [],
        contradictingEvidence: [],
        missingEvidence: [],
        evidenceStrength: 0,
        evidenceQuality: 0,
        evidenceDensity: 'LOW',
        confluenceScore: 0,
        evidenceSummary: ''
      },
      risk: {
        technicalRisk: 0,
        structuralRisk: 0,
        liquidityRisk: 0,
        momentumRisk: 0,
        executionRisk: 0,
        imageRisk: 0,
        psychologicalRisk: 0,
        contradictionRisk: 0,
        overallRisk: 0,
        riskPenalty: 0,
        riskSummary: '',
        factors: []
      },
      probability: {
        bullishProbability: 0,
        bearishProbability: 0,
        neutralProbability: 0,
        probabilityDistribution: { up: 0, down: 0, noTrade: 1 },
        confidenceScore: 0,
        statisticalStrength: 'VERY_WEAK',
        marketClarity: 'UNCERTAIN',
        decisionReadiness: 'WAIT',
        probabilityReasoning: ''
      },
      decision: {
        finalSignal: Signal.NO_TRADE,
        decisionConfidence: 0,
        decisionReason: 'System initialized.',
        decisionType: 'Automated',
        recommendedExpiry: 'Wait',
        executionApproval: false,
        rejectionReason: 'Initial state.',
        decisionSummary: '',
        auditTrail: ['Session created.']
      },
      validation: {
        validationPassed: false,
        validationScore: 0,
        missingData: [],
        invalidData: [],
        contradictions: [],
        ruleViolations: [],
        selfVerification: false,
        consistencyScore: 0,
        reliabilityScore: 0,
        diagnosticSummary: ''
      },
      output: {
        finalJson: '',
        dashboardData: {},
        institutionalTelemetry: {},
        developerLogs: []
      },
      telemetry: {
        executionTime: 0,
        engineDurations: {},
        aiLatency: 0,
        tokenUsage: 0,
        timestamp: Date.now()
      }
    };
  }
}
