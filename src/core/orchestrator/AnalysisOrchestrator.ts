/**
 * Analysis OS v6 - Orchestrator
 */

import { StateManager } from '../state/StateManager.js';
import { AnalysisState } from '../state/AnalysisState.js';
import { logger } from '../utils/logger.js';

// Import Engines
import { VisionEngine } from '../../engines/vision/VisionEngine.js';
import { MarketEngine } from '../../engines/market/MarketEngine.js';
import { KnowledgeEngine } from '../../engines/knowledge/KnowledgeEngine.js';
import { EvidenceEngine } from '../../engines/evidence/EvidenceEngine.js';
import { RiskEngine } from '../../engines/risk/RiskEngine.js';
import { ProbabilityEngine } from '../../engines/probability/ProbabilityEngine.js';
import { DecisionEngine } from '../../engines/decision/DecisionEngine.js';
import { ValidationEngine } from '../../engines/validation/ValidationEngine.js';
import { OutputEngine } from '../../engines/output/OutputEngine.js';

export class AnalysisOrchestrator {
  public static async analyze(imageBuffer: Buffer, sessionId: string): Promise<AnalysisState> {
    const state = StateManager.createInitialState(sessionId);
    const startTime = Date.now();

    logger.info(`Session ${sessionId}: Analysis Started`);

    try {
      // Stage 1: Vision Layer
      logger.info(`Session ${sessionId}: [Stage 1] Vision Extraction`);
      await VisionEngine.execute(state, imageBuffer);
      
      // Stage 2: Technical Intelligence Layer
      logger.info(`Session ${sessionId}: [Stage 2] Technical Intelligence`);
      await MarketEngine.execute(state);
      
      // Stage 3: Knowledge Layer
      logger.info(`Session ${sessionId}: [Stage 3] Knowledge Retrieval`);
      await KnowledgeEngine.execute(state);
      
      // Stage 4: Decision Intelligence Layer
      logger.info(`Session ${sessionId}: [Stage 4] Decision Intelligence`);
      await EvidenceEngine.execute(state);
      await RiskEngine.execute(state);
      await ProbabilityEngine.execute(state);
      
      // Stage 5: Decision Layer
      logger.info(`Session ${sessionId}: [Stage 5] Decision Generation`);
      await DecisionEngine.execute(state);
      
      // Stage 6: Validation Layer
      logger.info(`Session ${sessionId}: [Stage 6] Self-Validation`);
      await ValidationEngine.execute(state);
      
      // Stage 7: Output Layer
      logger.info(`Session ${sessionId}: [Stage 7] Output Reasoning`);
      await OutputEngine.execute(state, imageBuffer);

      state.telemetry.executionTime = Date.now() - startTime;
      logger.info(`Session ${sessionId}: Analysis Completed Successfully in ${state.telemetry.executionTime}ms`);
      return state;
    } catch (error: any) {
      logger.error(`Session ${sessionId}: Orchestration Error`, error);
      state.decision.rejectionReason = `System Failure: ${error.message}`;
      state.telemetry.executionTime = Date.now() - startTime;
      return state;
    }
  }
}
