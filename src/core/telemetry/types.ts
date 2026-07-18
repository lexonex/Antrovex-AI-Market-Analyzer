/**
 * Telemetry Types
 */

export interface TelemetryState {
  executionTime: number;
  engineDurations: Record<string, number>;
  aiLatency: number;
  tokenUsage: number;
  timestamp: number;
}
