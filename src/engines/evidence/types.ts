/**
 * Evidence Intelligence Engine Types
 */

export interface EvidenceFactor {
  name: string;
  value: number;
  type: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  category: string;
  quality: number;
}

export interface EvidenceState {
  bullishEvidence: number;
  bearishEvidence: number;
  neutralEvidence: number;
  supportingEvidence: EvidenceFactor[];
  contradictingEvidence: EvidenceFactor[];
  missingEvidence: string[];
  evidenceStrength: number;
  evidenceQuality: number;
  evidenceDensity: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  confluenceScore: number;
  evidenceSummary: string;
}
