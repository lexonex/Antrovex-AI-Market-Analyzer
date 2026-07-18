import { AnalysisState } from '../core/state/AnalysisState.js';
import { MarketTelemetry } from '../types/MarketTelemetry.js';
import { MarketRegimeType, TechnicalContextLevel } from '../engines/market/types.js';
import { logger } from '../core/utils/logger.js';

export class MarketTelemetryMapper {
  public static map(telemetry: MarketTelemetry, state: AnalysisState): void {
    logger.info('MarketTelemetryMapper: Synchronizing visual data to state');

    try {
      // 1. Image Data Sync
      state.image = {
        ...state.image,
        quality: telemetry.image.quality,
        chartDetected: telemetry.image.visibleCandles > 0,
        platformVerified: telemetry.image.platformVerified,
        timeframeVerified: telemetry.image.timeframeVerified,
        visibleCandles: telemetry.image.visibleCandles,
        currentPriceRegion: telemetry.image.currentPriceRegion,
        executionZone: telemetry.image.executionZone,
        chartBounds: telemetry.image.chartBounds,
        screenshotHealth: telemetry.image.screenshotHealth,
        visualContext: telemetry.image.visualContext
      };

      // 2. Market Data Sync
      state.market = {
        ...state.market,
        context: (telemetry.market.context as any) || 'RANGING',
        regime: {
          type: (telemetry.market.regime as any) || 'SIDEWAYS',
          confidence: 75,
          stability: 75
        },
        trend: {
          direction: (telemetry.market.trend as any) || 'NEUTRAL',
          strength: telemetry.market.trendStrength,
          health: 75,
          confidence: 75
        },
        structure: {
          type: (telemetry.market.structure.type as any) || 'RANGING',
          bos: telemetry.market.structure.bos,
          choch: telemetry.market.structure.choch,
          strength: telemetry.market.structure.strength,
          institutionalBias: (telemetry.market as any).institutionalBias || 'NEUTRAL'
        },
        momentum: {
          direction: (telemetry.market.momentum.direction as any) || 'NEUTRAL',
          strength: telemetry.market.momentum.strength,
          quality: (telemetry.market.momentum as any).quality || 75,
          confidence: 75
        },
        volatility: telemetry.market.volatility || 0,
        compression: telemetry.market.compression || false,
        expansion: telemetry.market.expansion || false,
        candlestick: {
          pattern: telemetry.market.candlestick.pattern,
          patternStrength: telemetry.market.candlestick.patternStrength,
          buyerPressure: telemetry.market.candlestick.buyerPressure,
          sellerPressure: telemetry.market.candlestick.sellerPressure,
          rejectionStrength: telemetry.market.candlestick.rejectionStrength
        },
        microPriceAction: {
          last5Candles: telemetry.market.microPriceAction.last5Candles,
          currentCandleBehaviour: telemetry.market.microPriceAction.currentCandleBehaviour,
          wickRejection: telemetry.market.microPriceAction.wickRejection,
          bodyExpansion: telemetry.market.microPriceAction.bodyExpansion
        },
        supportResistance: {
          nearestSupport: telemetry.market.supportResistance.nearestSupport,
          nearestResistance: telemetry.market.supportResistance.nearestResistance,
          zoneStrength: telemetry.market.supportResistance.zoneStrength,
          executionDistance: 0
        },
        liquidity: {
          status: (telemetry.market.liquidity as any).zone || 'Detected',
          direction: (telemetry.market.liquidity.direction as any) || 'NEUTRAL',
          quality: telemetry.market.liquidity.quality,
          confidence: 75,
          traps: (telemetry.market.liquidity as any).sweep || false
        },
        institutionalBias: (telemetry.market as any).institutionalBias || 'NEUTRAL'
      };

      // 3. Knowledge Sync
      state.knowledge.knowledgeMatch = telemetry.knowledgeMatch;

    } catch (error: any) {
      logger.error('MarketTelemetryMapper: Critical sync failure', error);
      throw error;
    }
  }
}
