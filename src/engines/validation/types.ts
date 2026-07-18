/**
 * Validation & Self-Verification Engine Types
 */

export interface ValidationState {
  validationPassed: boolean;
  validationScore: number;
  missingData: string[];
  invalidData: string[];
  contradictions: string[];
  ruleViolations: string[];
  selfVerification: boolean;
  consistencyScore: number;
  reliabilityScore: number;
  diagnosticSummary: string;
}
