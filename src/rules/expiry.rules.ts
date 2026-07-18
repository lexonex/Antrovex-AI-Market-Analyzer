
export interface ExpiryRule {
  condition: (momentum: number, trend: number, microPA: number, context: string) => boolean;
  duration: string;
  reason: string;
}

export const EXPIRY_RULES: ExpiryRule[] = [
  {
    condition: (mom, trend, micro) => mom > 90 && micro > 80,
    duration: '1M',
    reason: 'Hyper-momentum and rapid price delivery detected in micro-structure.'
  },
  {
    condition: (mom, trend) => mom > 75 && trend > 80,
    duration: '2M',
    reason: 'Strong trend/momentum alignment with sustained directional impulse.'
  },
  {
    condition: (mom, trend) => trend > 60,
    duration: '3M',
    reason: 'Standard institutional trend continuation with healthy volatility.'
  },
  {
    condition: (mom, trend, micro, context) => trend < 40 || context === 'COMPRESSION',
    duration: '5M',
    reason: 'Low velocity market or compression state requiring maximum buffer.'
  },
  {
    condition: () => true,
    duration: '4M',
    reason: 'Balanced market velocity requiring conservative stabilization time.'
  }
];
