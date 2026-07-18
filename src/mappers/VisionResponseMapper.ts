import { MarketTelemetry } from '../types/MarketTelemetry.js';
import { logger } from '../core/utils/logger.js';

export class VisionResponseMapper {
  public static map(rawResponse: any): MarketTelemetry {
    logger.info('VisionResponseMapper: Mapping AI response to deterministic telemetry');

    // Ensure all mandatory structures exist
    const telemetry: MarketTelemetry = {
      image: {
        quality: rawResponse.image?.quality || 0,
        isBlurred: rawResponse.image?.isBlurred || false,
        hasAxis: rawResponse.image?.hasAxis || false,
        platformVerified: rawResponse.image?.platformVerified || false,
        timeframeVerified: rawResponse.image?.timeframeVerified || false,
        visibleCandles: rawResponse.image?.visibleCandles || 0,
        currentPriceRegion: rawResponse.image?.currentPriceRegion || { x: 0, y: 0 },
        executionZone: rawResponse.image?.executionZone || { top: 0, bottom: 0, left: 0, right: 0 },
        chartBounds: rawResponse.image?.chartBounds || { xmin: 0, xmax: 0, ymin: 0, ymax: 0 },
        screenshotHealth: rawResponse.image?.screenshotHealth || 0,
        visualContext: rawResponse.image?.visualContext || {}
      },
      market: {
        context: rawResponse.market?.context,
        regime: rawResponse.market?.regime,
        trend: rawResponse.market?.trend,
        trendStrength: rawResponse.market?.trendStrength || 0,
        structure: rawResponse.market?.structure || { type: 'RANGING', bos: false, choch: false, strength: 0 },
        supportResistance: rawResponse.market?.supportResistance || { nearestSupport: 0, nearestResistance: 0, zoneStrength: 0, executionDistance: 0 },
        candlestick: rawResponse.market?.candlestick || { pattern: 'None', patternStrength: 0, buyerPressure: 0, sellerPressure: 0, rejectionStrength: 0 },
        priceAction: rawResponse.market?.priceAction || { currentBehaviour: 'Unknown', continuationProbability: 0, reversalProbability: 0 },
        microPriceAction: rawResponse.market?.microPriceAction || { last5Candles: 'Unknown', currentCandleBehaviour: 'Unknown', wickRejection: 0, bodyExpansion: 0 },
        momentum: rawResponse.market?.momentum || { direction: 'NEUTRAL', strength: 0, quality: 0, confidence: 0 },
        liquidity: rawResponse.market?.liquidity || { sweep: false, direction: 'NEUTRAL', quality: 0, zone: 'None' },
        volatility: rawResponse.market?.volatility || 0,
        compression: rawResponse.market?.compression || false,
        expansion: rawResponse.market?.expansion || false
      },
      knowledgeMatch: rawResponse.knowledgeMatch || 0
    };

    return telemetry;
  }
}
