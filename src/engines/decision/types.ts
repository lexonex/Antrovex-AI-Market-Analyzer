/**
 * Decision Intelligence Engine Types
 */

export enum Signal {
  UP = 'UP',
  DOWN = 'DOWN',
  NO_TRADE = 'NO_TRADE'
}

export interface ConfidenceComponent {
  name: string;
  score: number;
  weight: number;
  contribution: number;
  status: 'PRESENT' | 'UNKNOWN';
}

export interface DecisionState {
  finalSignal: Signal;
  decisionConfidence: number;
  confidenceBreakdown: ConfidenceComponent[];
  decisionReason: string;
  decisionType: string;
  recommendedExpiry?: string; // e.g. "1M", "3M", "5M"
  expiryReason?: string;
  executionApproval: boolean;
  rejectionReason: string;
  decisionSummary: string;
  auditTrail: string[];
}
