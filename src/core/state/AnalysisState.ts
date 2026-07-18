/**
 * Analysis OS v6 - Global Analysis State
 */

import { ImageState } from '../../engines/vision/types.js';
import { MarketIntelligenceState } from '../../engines/market/types.js';
import { KnowledgeState } from '../../engines/knowledge/types.js';
import { EvidenceState } from '../../engines/evidence/types.js';
import { RiskState } from '../../engines/risk/types.js';
import { ProbabilityState } from '../../engines/probability/types.js';
import { DecisionState } from '../../engines/decision/types.js';
import { ValidationState } from '../../engines/validation/types.js';
import { OutputState } from '../../engines/output/types.js';
import { TelemetryState } from '../telemetry/types.js';

export interface SessionState {
  sessionId: string;
  timestamp: number;
  broker: string;
  timeframe: string;
}

export interface AnalysisState {
  session: SessionState;
  image: ImageState;
  market: MarketIntelligenceState;
  knowledge: KnowledgeState;
  evidence: EvidenceState;
  risk: RiskState;
  probability: ProbabilityState;
  decision: DecisionState;
  validation: ValidationState;
  output: OutputState;
  telemetry: TelemetryState;
}
