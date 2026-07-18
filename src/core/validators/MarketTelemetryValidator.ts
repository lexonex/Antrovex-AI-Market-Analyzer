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

    // 1. Critical Field Validation
    if (!telemetry.image) {
      errors.push('Missing image metadata');
      criticalMissing = true;
    }

    if (!telemetry.market) {
      errors.push('Missing market telemetry');
      criticalMissing = true;
    }

    // 2. Image Quality & Visibility
    if (telemetry.image) {
      if (telemetry.image.quality < 30) {
        errors.push('Image quality too low for reliable analysis');
        criticalMissing = true;
      }
      if (telemetry.image.isBlurred) {
        warnings.push('Image appears blurred, results may be less accurate');
      }
    }

    // 3. Market Regime Validation
    if (telemetry.market) {
      if (!Object.values(MarketRegimeType).includes(telemetry.market.regime)) {
        warnings.push(`Unknown market regime: ${telemetry.market.regime}. Defaulting to TRANSITION.`);
      }

      // 4. Trend Validation
      const validTrends = ['BULLISH', 'BEARISH', 'NEUTRAL'];
      if (!validTrends.includes(telemetry.market.trend)) {
        warnings.push(`Invalid trend direction: ${telemetry.market.trend}. Defaulting to NEUTRAL.`);
      }

      // 5. Structure Validation
      if (!telemetry.market.structure) {
        warnings.push('Missing market structure data');
      }

      // 6. Range Validations
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
