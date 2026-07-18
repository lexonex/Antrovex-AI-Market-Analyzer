/**
 * Chart Context Engine
 * Responsible for segmenting the chart into priority analysis zones
 */
export const ContextEngine = `
### CHART CONTEXT ENGINE v6
- visible candle count check (approx 80-120 candles).
- Zone Segmentation:
  * Zone 1: Last 5 candles (Highest Priority) - Immediate entry signal.
  * Zone 2: Last 10 candles (Very High Priority) - Local momentum shift.
  * Zone 3: Last 20 candles (High Priority) - Recent market structure.
  * Zone 4: Entire Chart (Contextual) - Major levels and swing points.
`;
