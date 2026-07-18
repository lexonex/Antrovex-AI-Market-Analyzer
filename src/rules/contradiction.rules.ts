
export const CONTRADICTION_RULES = {
  TREND_VS_MOMENTUM: {
    penalty: 15,
    description: 'Momentum is fighting the primary trend direction.'
  },
  STRUCTURE_VS_PRICE_ACTION: {
    penalty: 20,
    description: 'Micro price action contradicts the higher timeframe structure.'
  },
  LIQUIDITY_VS_DIRECTION: {
    penalty: 10,
    description: 'Execution signal is moving away from primary liquidity clusters.'
  }
};
