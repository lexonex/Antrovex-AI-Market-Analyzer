/**
 * Vision Intelligence Engine Types
 */

export interface ChartBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface VisualContext {
  trendAppearance: string;
  volatilityAppearance: string;
  swingDensity: string;
}

export interface ImageState {
  quality: number; // 0-100
  chartDetected: boolean;
  platformVerified: boolean;
  timeframeVerified: boolean;
  visibleCandles: number;
  currentPriceRegion: { x: number; y: number };
  executionZone: ChartBounds;
  chartBounds: ChartBounds;
  screenshotHealth: number; // 0-100
  visualContext: VisualContext;
  geometry: { width: number; height: number };
}
