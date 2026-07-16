/**
 * Analysis types for trading chart analysis
 */

export interface AnalysisResult {
  validChart: boolean;
  prediction: 'UP' | 'DOWN' | 'NEUTRAL';
  confidence: number;
  primaryScenario: string;
  alternativeScenario: string;
  risk: 'Low' | 'Medium' | 'High';
  reason: string;
  analysis: {
    trend: string[];
    marketStructure: string[];
    support: string[];
    resistance: string[];
    liquidity: string[];
    orderBlocks: string[];
    fvg: string[];
    patterns: string[];
    momentum: string[];
    volume: string[];
  };
}
