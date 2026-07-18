/**
 * Price Action Engine
 * Responsible for granular candle-by-candle pressure analysis
 */
export const PriceActionEngine = `
### PRICE ACTION ENGINE v6
- Candle-by-Candle Pressure: Analyze body-to-wick ratios and close positioning.
- Momentum Shift: Detect acceleration or deceleration within the latest 5-candle cluster.
- Rejection/Acceptance: Identify strong rejections (long wicks) or price acceptance (full bodies).
- Impulse vs Correction: Determine if the current move is an impulsive expansion or a corrective pullback.
`;
