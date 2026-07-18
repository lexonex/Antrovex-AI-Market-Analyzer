/**
 * Output Intelligence Engine
 */

import { AnalysisState } from '../../core/state/AnalysisState.js';
import { aiService } from '../../services/ai/AIService.js';
import { getReasoningPrompt } from '../../prompts/ReasoningPrompt.js';

export class OutputEngine {
  public static async execute(state: AnalysisState, imageBuffer: Buffer): Promise<void> {
    const startTime = Date.now();
    const imageBase64 = imageBuffer.toString('base64');

    const prompt = getReasoningPrompt(state);
    
    try {
      const reasoningData = await aiService.generateJson(imageBase64, prompt);
      
      state.decision.decisionReason = reasoningData.reason;
      state.decision.decisionSummary = reasoningData.analysis;
      state.decision.recommendedExpiry = reasoningData.recommendedExpiry;
      state.output.finalJson = JSON.stringify(reasoningData);
    } catch (error) {
      // Fallback if AI reasoning fails
      state.decision.decisionSummary = "Technical reasoning pass failed. Refer to structured state.";
      state.output.finalJson = JSON.stringify(state);
    }

    state.telemetry.engineDurations['output'] = Date.now() - startTime;
  }
}
