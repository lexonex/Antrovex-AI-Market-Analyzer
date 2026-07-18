/**
 * Liquidity Engine
 * Responsible for detecting institutional liquidity behavior
 */
export const LiquidityEngine = `
### LIQUIDITY ENGINE v6
- Detect Liquidity Pools: Identify areas where stop-loss orders are likely clustered.
- Map Sweeps/Grabs: Detect price spikes that "clean" liquidity before reversing.
- Identify Liquidity Traps: Flag "False Breakouts" and "Fake-outs" designed to trap retail traders.
- Liquidity Imbalance: Detect price gaps or rapid movements leaving unfilled orders.
`;
