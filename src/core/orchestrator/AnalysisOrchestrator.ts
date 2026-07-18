import { AnalysisState } from '../state/AnalysisState.js';
import { StateManager } from '../state/StateManager.js';
import { logger } from '../utils/logger.js';
import { AIService } from '../../services/ai/AIService.js';
import { EXTRACTION_PROMPT } from '../../prompts/ExtractionPrompt.js';
import { getReasoningPrompt } from '../../prompts/ReasoningPrompt.js';
import { VisionResponseMapper } from '../../mappers/VisionResponseMapper.js';
import { MarketTelemetryMapper } from '../../mappers/MarketTelemetryMapper.js';

// Engines
import { MarketEngine } from '../../engines/market/MarketEngine.js';
import { EvidenceScoringEngine } from '../../engines/scoring/EvidenceScoringEngine.js';
import { ProbabilityEngine } from '../../engines/probability/ProbabilityEngine.js';
import { RiskEngine } from '../../engines/risk/RiskEngine.js';
import { DynamicExpiryEngine } from '../../engines/expiry/DynamicExpiryEngine.js';
import { ConfidenceEngine } from '../../engines/confidence/ConfidenceEngine.js';
import { DecisionEngine } from '../../engines/decision/DecisionEngine.js';
import { ValidationEngine } from '../../engines/validation/ValidationEngine.js';

export class AnalysisOrchestrator {
  public static async analyze(imageBuffer: Buffer, sessionId: string): Promise<AnalysisState> {
    const startTime = Date.now();
    logger.info(`AnalysisOrchestrator: Initializing pipeline for session ${sessionId}`);

    try {
      const ai = AIService.getInstance();
      const state = StateManager.createInitialState(sessionId);

      // 1. Vision Intelligence Extraction (Gemini)
      const imageBase64 = imageBuffer.toString('base64');
      const visionOutput = await ai.generateJson(imageBase64, EXTRACTION_PROMPT);
      (state.telemetry as any).rawVisionOutput = visionOutput;

      // 2. Deterministic Mapping
      const telemetry = VisionResponseMapper.map(visionOutput);
      MarketTelemetryMapper.map(telemetry, state);

      // 3. Analysis Engines Pipeline (Deterministic OS)
      await MarketEngine.execute(state);
      await EvidenceScoringEngine.execute(state);
      await RiskEngine.execute(state);
      await ConfidenceEngine.execute(state);
      await ProbabilityEngine.execute(state);
      await DynamicExpiryEngine.execute(state);
      await DecisionEngine.execute(state);
      await ValidationEngine.execute(state);

      // 4. AI Reasoning (Post-Decision Insight)
      if (state.decision.finalSignal !== 'NO_TRADE') {
        const reasoningPrompt = getReasoningPrompt(state);
        const reasoningOutput = await ai.generateJson(imageBase64, reasoningPrompt);
        state.decision.decisionSummary = reasoningOutput.analysis || reasoningOutput.reason;
      } else {
        state.decision.decisionSummary = state.decision.decisionReason;
      }

      logger.info(`AnalysisOrchestrator: Analysis complete in ${Date.now() - startTime}ms`);
      return state;
    } catch (error: any) {
      logger.error('AnalysisOrchestrator: Pipeline execution failed', error);
      throw error;
    }
  }
}
