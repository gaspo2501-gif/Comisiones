
import { Parameters } from './types';

export const VAT_RATE = 1.21;

export const INITIAL_PARAMS: Parameters = {
  baseCommissionRate: 0.005, // 0.5%
  weights: {
    volume: 0.30,
    mix: 0.20,
    financing: 0.30,
    quality: 0.20
  },
  tiers: {
    volume: [
      { id: 'v1', threshold: 6, percentage: 0.50 },
      { id: 'v2', threshold: 8, percentage: 0.75 },
      { id: 'v3', threshold: 10, percentage: 1.00 }
    ],
    mix: [
      { id: 'm1', threshold: 0.30, percentage: 0.30 },
      { id: 'm2', threshold: 0.50, percentage: 0.50 },
      { id: 'm3', threshold: 0.60, percentage: 0.60 }
    ],
    financing: [
      { id: 'f1', threshold: 0.15, percentage: 0.50 },
      { id: 'f2', threshold: 0.30, percentage: 0.75 },
      { id: 'f3', threshold: 0.40, percentage: 1.00 }
    ],
    quality: [
      { id: 'q1', threshold: 4.60, percentage: 0.50 },
      { id: 'q2', threshold: 4.70, percentage: 0.75 },
      { id: 'q3', threshold: 4.78, percentage: 1.00 }
    ]
  }
};
