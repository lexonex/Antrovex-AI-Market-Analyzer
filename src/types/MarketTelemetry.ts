/**
 * Analysis OS v6 - Market Telemetry
 * This interface represents the complete set of data extracted from the market chart.
 */

import { MarketRegimeType, TechnicalContextLevel } from '../engines/market/types.js';

export interface MarketTelemetry {
  image: {
    quality: number;
    isBlurred: boolean;
    hasAxis: boolean;
    platformVerified: boolean;
    timeframeVerified: boolean;
    visibleCandles: number;
    currentPriceRegion: { x: number; y: number };
    executionZone: { x: number; y: number; width: number; height: number };
    chartBounds: { x: number; y: number; width: number; height: number };
    screenshotHealth: number;
    visualContext: {
      trendAppearance: string;
      volatilityAppearance: string;
      swingDensity: string;
    };
  };
  market: {
    context?: TechnicalContextLevel;
    regime: MarketRegimeType;
    trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    trendStrength: number;
    structure: {
      type: 'BULLISH' | 'BEARISH' | 'RANGING';
      bos: boolean;
      choch: boolean;
      strength: number;
    };
    liquidity: {
      sweeps: boolean;
      traps: boolean;
      imbalances: boolean;
      targetZones: string[];
      quality: number;
      status?: string;
      direction?: 'UP' | 'DOWN' | 'NEUTRAL';
    };
    momentum: {
      strength: number;
      direction: 'UP' | 'DOWN' | 'NEUTRAL';
    };
    candlestick: {
      pattern: string;
      patternStrength: number;
      buyerPressure: number;
      sellerPressure: number;
      rejectionStrength: number;
    };
    supportResistance: {
      nearestSupport: number;
      nearestResistance: number;
      zoneStrength: number;
    };
    priceAction: {
      currentBehaviour: string;
      continuationProbability: number;
      reversalProbability: number;
    };
    microPriceAction: {
      last5Candles: string;
      currentCandleBehaviour: string;
      wickRejection: number;
      bodyExpansion: number;
    };
    volatility?: number;
    compression?: boolean;
    expansion?: boolean;
  };
  knowledgeMatch: number;
}
