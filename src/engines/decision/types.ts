/**
 * Decision Intelligence Engine Types
 */

export enum Signal {
  UP = 'UP',
  DOWN = 'DOWN',
  NO_TRADE = 'NO_TRADE'
}

export interface DecisionState {
  finalSignal: Signal;
  decisionConfidence: number;
  decisionReason: string;
  decisionType: string;
  executionApproval: boolean;
  rejectionReason: string;
  decisionSummary: string;
  auditTrail: string[];
}
