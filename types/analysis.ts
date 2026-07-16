/**
 * Analysis types for trading chart analysis
 */

export type MarketTrend = 'Bullish' | 'Bearish' | 'Neutral' | 'Ranging';

export interface AnalysisResult {
  validChart: boolean;
  success: boolean;
  prediction?: 'UP' | 'DOWN' | 'NEUTRAL';
  confidence?: number;
  risk?: 'Low' | 'Medium' | 'High';
  primaryScenario?: string;
  alternativeScenario?: string;
  reason?: string;
  analysis?: {
    trend: string[];
    marketStructure: string[];
    support: string[];
    resistance: string[];
    liquidity: string[];
    orderBlocks: string[];
    fairValueGaps: string[];
    patterns: string[];
    momentum: string[];
    volume: string[];
  };
}
