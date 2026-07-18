/**
 * Vision Intelligence Engine
 */

import { AnalysisState } from '../../core/state/AnalysisState.js';
import { aiService } from '../../services/ai/AIService.js';
import { EXTRACTION_PROMPT } from '../../prompts/ExtractionPrompt.js';
import { MarketTelemetryMapper } from '../../core/mappers/MarketTelemetryMapper.js';
import { MarketTelemetryValidator } from '../../core/validators/MarketTelemetryValidator.js';
import { logger } from '../../core/utils/logger.js';

export class VisionEngine {
  public static async execute(state: AnalysisState, imageBuffer: Buffer): Promise<void> {
    const startTime = Date.now();
    const imageBase64 = imageBuffer.toString('base64');

    logger.info('VisionEngine: Starting extraction pass');
    
    try {
      const extractedData = await aiService.generateJson(imageBase64, EXTRACTION_PROMPT);
      
      logger.info('VisionEngine: AI Raw Response Received', JSON.stringify(extractedData, null, 2).substring(0, 500) + '...');

      // 1. Validate Telemetry
      const validation = MarketTelemetryValidator.validate(extractedData);
      
      logger.info('VisionEngine: Validation Result', {
        isValid: validation.isValid,
        criticalMissing: validation.criticalMissing,
        errors: validation.errors,
        warnings: validation.warnings
      });

      if (!validation.isValid && validation.criticalMissing) {
        logger.error('VisionEngine: Critical validation failure', validation.errors);
        throw new Error(`IMAGE_REJECTED: ${validation.errors.join(', ')}`);
      }

      // 2. Map Telemetry to State
      MarketTelemetryMapper.map(state, extractedData);
      
      logger.info('VisionEngine: State Mapping Complete');
      
      state.image.chartDetected = true; 
      
    } catch (error: any) {
      logger.error('VisionEngine: Execution failed', error);
      throw error;
    }

    state.telemetry.engineDurations['vision'] = Date.now() - startTime;
    state.telemetry.aiLatency += state.telemetry.engineDurations['vision'];
  }
}
