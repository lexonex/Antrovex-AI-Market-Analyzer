/**
 * Analysis types for trading chart analysis
 */

export interface AnalysisResult {
  validChart: boolean;
  signal: 'UP' | 'DOWN';
  confidence: number;
  timeframe: string;
  expiry: string;
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
