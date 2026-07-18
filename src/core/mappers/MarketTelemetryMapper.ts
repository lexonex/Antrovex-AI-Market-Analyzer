/**
 * Analysis OS v6 - Market Telemetry Mapper
 * Responsibilities:
 * - Convert Vision Output into Internal Market State.
 * - Normalize values.
 * - Apply default values.
 * - Validate required fields.
 * - Handle optional fields safely.
 */

import { AnalysisState } from '../state/AnalysisState.js';
import { MarketTelemetry } from '../../types/MarketTelemetry.js';
import { MarketRegimeType } from '../../engines/market/types.js';
import { logger } from '../utils/logger.js';

export class MarketTelemetryMapper {
  /**
   * Maps raw telemetry from AI vision layer to the internal state
   */
  public static map(state: AnalysisState, telemetry: MarketTelemetry): void {
    logger.info('Mapping Market Telemetry to Internal State');

    try {
      // 1. Map Image State
      state.image = {
        ...state.image,
        quality: telemetry.image.quality || 0,
        chartDetected: !telemetry.image.isBlurred && telemetry.image.hasAxis,
        platformVerified: telemetry.image.platformVerified || false,
        timeframeVerified: telemetry.image.timeframeVerified || false,
        visibleCandles: telemetry.image.visibleCandles || 0,
        currentPriceRegion: telemetry.image.currentPriceRegion || { x: 0, y: 0 },
        executionZone: telemetry.image.executionZone || { x: 0, y: 0, width: 0, height: 0 },
        chartBounds: telemetry.image.chartBounds || { x: 0, y: 0, width: 0, height: 0 },
        screenshotHealth: telemetry.image.screenshotHealth || 0,
        visualContext: {
          trendAppearance: telemetry.image.visualContext?.trendAppearance || 'Unknown',
          volatilityAppearance: telemetry.image.visualContext?.volatilityAppearance || 'Unknown',
          swingDensity: telemetry.image.visualContext?.swingDensity || 'Unknown'
        }
      };

      // 2. Map Market State
      state.market = {
        ...state.market,
        regime: {
          type: telemetry.market.regime || MarketRegimeType.TRANSITION,
          confidence: 70, // Default confidence if not provided by AI
          stability: 70
        },
        trend: {
          direction: telemetry.market.trend || 'NEUTRAL',
          strength: telemetry.market.trendStrength || 0,
          health: 70,
          confidence: 70
        },
        structure: {
          type: telemetry.market.structure?.type || 'RANGING',
          bos: telemetry.market.structure?.bos || false,
          choch: telemetry.market.structure?.choch || false,
          strength: telemetry.market.structure?.strength || 0,
          institutionalBias: 'NEUTRAL' // Will be refined by MarketEngine
        },
        liquidity: {
          status: telemetry.market.liquidity?.status || 'Searching',
          direction: telemetry.market.liquidity?.direction || 'NEUTRAL',
          quality: telemetry.market.liquidity?.quality || 0,
          confidence: 70,
          traps: telemetry.market.liquidity?.traps || false
        },
        momentum: {
          direction: telemetry.market.momentum?.direction || 'NEUTRAL',
          strength: telemetry.market.momentum?.strength || 0,
          quality: 70,
          confidence: 70
        },
        supportResistance: {
          nearestSupport: telemetry.market.supportResistance?.nearestSupport || 0,
          nearestResistance: telemetry.market.supportResistance?.nearestResistance || 0,
          zoneStrength: telemetry.market.supportResistance?.zoneStrength || 0,
          executionDistance: 0
        },
        candlestick: {
          pattern: telemetry.market.candlestick?.pattern || 'None',
          patternStrength: telemetry.market.candlestick?.patternStrength || 0,
          buyerPressure: telemetry.market.candlestick?.buyerPressure || 0,
          sellerPressure: telemetry.market.candlestick?.sellerPressure || 0,
          rejectionStrength: telemetry.market.candlestick?.rejectionStrength || 0
        },
        priceAction: {
          currentBehaviour: telemetry.market.priceAction?.currentBehaviour || 'Unknown',
          continuationProbability: telemetry.market.priceAction?.continuationProbability || 0,
          reversalProbability: telemetry.market.priceAction?.reversalProbability || 0,
          executionContext: 'Analyzing'
        },
        volatility: telemetry.market.volatility || 0,
        compression: telemetry.market.compression || false,
        expansion: telemetry.market.expansion || false
      };

      // 3. Map Knowledge State
      state.knowledge.knowledgeMatch = telemetry.knowledgeMatch || 0;

      logger.info('Market Telemetry Mapping Successful');
    } catch (error: any) {
      logger.error('Market Telemetry Mapping Failed', error);
      throw new Error(`UNABLE_TO_MAP_MARKET_TELEMETRY: ${error.message}`);
    }
  }
}
