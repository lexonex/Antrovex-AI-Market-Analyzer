/**
 * Evidence Intelligence Engine Types
 */

export interface EvidenceFactor {
  name: string;
  value: number; // 0-100 normalized internal score
  contribution: number; // Final weighted points added to confidence
  type: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  category: 'Price Action' | 'Structure' | 'Momentum' | 'Liquidity' | 'Volatility' | 'Institutional' | 'S/R' | 'Pattern';
  quality: number;
}

export interface EvidenceState {
  bullishEvidence: number;
  bearishEvidence: number;
  evidenceStrength: number;
  confluenceScore: number;
  supportingEvidence: EvidenceFactor[];
  contradictingEvidence: EvidenceFactor[];
  engineVotes: {
    engine: string;
    vote: 'BULLISH' | 'BEARISH' | 'NEUTRAL' | 'UNKNOWN';
    score: number;
  }[];
}
