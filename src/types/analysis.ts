/**
 * Analysis types for trading chart analysis
 */

export interface AnalysisResult {
  validChart: boolean;
  signal: 'UP' | 'DOWN' | 'NO_TRADE';
  confidence: number;
  bullishProbability: number;
  bearishProbability: number;
  neutralProbability: number;
  expiry: string;
  expiryReason: string;
  marketRegime: string;
  trendStrength: string;
  structure: string;
  momentumState: string;
  priceActionState: string;
  candlestickPattern: string;
  confluenceScore: number;
  knowledgeMatchScore: number;
  imageQualityScore: number;
  reason: string;
  analysis: string;
  institutionalBias: string;
  
  // Debug Info
  confidenceBreakdown: Array<{
    name: string;
    score: number;
    weight: number;
    contribution: number;
    status: string;
  }>;
  evidence: {
    bullish: number;
    bearish: number;
    confluence: number;
    votes: Array<{
      engine: string;
      vote: string;
      score: number;
    }>;
  };
  validation: {
    passed: boolean;
    mandatory: string[];
    optional: string[];
  };
  risk: {
    riskPenalty: number;
    overallRisk: number;
    factors: Array<{
      name: string;
      penalty: number;
    }>;
  };
  telemetry: {
    engineDurations: Record<string, number>;
  };
  audit: string[];
}

export type TradeOutcome = 'PROFIT' | 'LOSS' | 'SKIPPED';

export interface HistoryItem {
  id: string;
  timestamp: number;
  result: AnalysisResult;
  preview: string;
  outcome: TradeOutcome;
}
