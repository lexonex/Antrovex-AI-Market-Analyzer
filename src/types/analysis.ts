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
  signalQuality: 'Excellent' | 'Good' | 'Average' | 'Weak';
  timeframe: string;
  expiry: string;
  marketRegime: string;
  trendStrength: string;
  structure: string;
  bosDetected: boolean;
  chochDetected: boolean;
  liquidityStatus: string;
  liquidityTrap: boolean;
  supportStrength: string;
  resistanceStrength: string;
  momentumState: string;
  priceActionState: string;
  candlestickPattern: string;
  confluenceScore: number;
  knowledgeMatchScore: number;
  imageQualityScore: number;
  bullishEvidenceCount: number;
  bearishEvidenceCount: number;
  contradictionScore: number;
  selfValidationPassed: boolean;
  decisionFilter: string;
  noTradeReason?: string;
  analysis: {
    trend: string;
    support: string;
    resistance: string;
    candlestickPattern: string;
    momentum: string;
    marketCondition: string;
  };
  reason: string;
}
