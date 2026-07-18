/**
 * Risk Intelligence Engine Types
 */

export interface RiskFactor {
  name: string;
  penalty: number;
}

export interface RiskState {
  technicalRisk: number;
  structuralRisk: number;
  liquidityRisk: number;
  momentumRisk: number;
  executionRisk: number;
  imageRisk: number;
  psychologicalRisk: number;
  contradictionRisk: number;
  overallRisk: number;
  riskPenalty: number;
  riskSummary: string;
  factors: RiskFactor[];
}
