/**
 * Institutional Market Intelligence Engine Types
 */

export enum MarketRegimeType {
  STRONG_BULLISH = 'STRONG_BULLISH',
  WEAK_BULLISH = 'WEAK_BULLISH',
  STRONG_BEARISH = 'STRONG_BEARISH',
  WEAK_BEARISH = 'WEAK_BEARISH',
  SIDEWAYS_RANGE = 'SIDEWAYS_RANGE',
  CONSOLIDATION = 'CONSOLIDATION',
  COMPRESSION = 'COMPRESSION',
  EXPANSION = 'EXPANSION',
  TRANSITION = 'TRANSITION'
}

export enum TechnicalContextLevel {
  TRENDING = 'TRENDING',
  PULLBACK = 'PULLBACK',
  CONTINUATION = 'CONTINUATION',
  REVERSAL = 'REVERSAL',
  COMPRESSION = 'COMPRESSION',
  CONSOLIDATION = 'CONSOLIDATION',
  HIGH_VOLATILITY = 'HIGH_VOLATILITY',
  LOW_VOLATILITY = 'LOW_VOLATILITY'
}

export interface MarketIntelligenceState {
  context: TechnicalContextLevel;
  regime: {
    type: MarketRegimeType;
    confidence: number;
    stability: number;
  };
  trend: {
    direction: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    strength: number;
    health: number;
    confidence: number;
  };
  structure: {
    type: 'BULLISH' | 'BEARISH' | 'RANGING';
    bos: boolean;
    choch: boolean;
    strength: number;
    institutionalBias: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  };
  liquidity: {
    status: string;
    direction: 'UP' | 'DOWN' | 'NEUTRAL';
    quality: number;
    confidence: number;
    traps: boolean;
  };
  supportResistance: {
    nearestSupport: number;
    nearestResistance: number;
    zoneStrength: number;
    executionDistance: number;
  };
  candlestick: {
    pattern: string;
    patternStrength: number;
    buyerPressure: number;
    sellerPressure: number;
    rejectionStrength: number;
  };
  priceAction: {
    currentBehaviour: string;
    continuationProbability: number;
    reversalProbability: number;
    executionContext: string;
  };
  microPriceAction: {
    last5Candles: string;
    currentCandleBehaviour: string;
    wickRejection: number;
    bodyExpansion: number;
  };
  momentum: {
    direction: 'UP' | 'DOWN' | 'NEUTRAL';
    strength: number;
    quality: number;
    confidence: number;
  };
  volatility: number;
  compression: boolean;
  expansion: boolean;
  executionContext: string;
  institutionalBias: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
}
