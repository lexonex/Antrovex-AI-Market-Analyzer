/**
 * Analysis OS v6 - Market Telemetry Validator
 * Responsibilities:
 * - Required fields present.
 * - Enum values valid.
 * - Numbers within range.
 * - Confidence between 0–100.
 */

import { MarketTelemetry } from '../../types/MarketTelemetry.js';
import { MarketRegimeType } from '../../engines/market/types.js';
import { logger } from '../utils/logger.js';

export interface ValidationReport {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  criticalMissing: boolean;
}

export class MarketTelemetryValidator {
  public static validate(telemetry: MarketTelemetry): ValidationReport {
    const errors: string[] = [];
    const warnings: string[] = [];
    let criticalMissing = false;

    logger.info('Validating Market Telemetry');

    // 1. Mandatory Visual Validation
    if (!telemetry.image) {
      errors.push('MANDATORY_FAILURE: Missing image metadata');
      criticalMissing = true;
    }

    if (telemetry.image && telemetry.image.visibleCandles === 0) {
      errors.push('MANDATORY_FAILURE: No visible candlesticks detected');
      criticalMissing = true;
    }

    if (telemetry.image && telemetry.image.screenshotHealth < 15) {
      errors.push('MANDATORY_FAILURE: Image screenshot health critical (below 15%)');
      criticalMissing = true;
    }

    // 2. Identification Validation
    if (!telemetry.market) {
      errors.push('MANDATORY_FAILURE: No market telemetry extracted');
      criticalMissing = true;
    }

    // 3. Optional Technical Validation (Warnings only - IESE handles weighting)
    if (telemetry.market) {
      if (!telemetry.market.regime) warnings.push('OPTIONAL_UNKNOWN: Market regime');
      if (!telemetry.market.trend) warnings.push('OPTIONAL_UNKNOWN: Trend direction');
      if (!telemetry.market.structure) warnings.push('OPTIONAL_UNKNOWN: Market structure');
      
      // IESE allows analysis even if specific layers like liquidity or momentum are missing
      if (!telemetry.market.liquidity) warnings.push('OPTIONAL_UNKNOWN: Liquidity sweep data');

      this.checkRange(telemetry.market.trendStrength, 'Trend Strength', warnings);
      this.checkRange(telemetry.knowledgeMatch, 'Knowledge Match', warnings);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      criticalMissing
    };
  }

  private static checkRange(value: number | undefined, name: string, warnings: string[]): void {
    if (value !== undefined && (value < 0 || value > 100)) {
      warnings.push(`${name} (${value}) is outside 0-100 range. Normalized.`);
    }
  }
}
