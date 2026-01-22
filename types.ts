
export enum Tab {
  SALES = 'SALES',
  PARAMS = 'PARAMS',
  SUMMARY = 'SUMMARY',
  HISTORY = 'HISTORY'
}

export interface Sale {
  id: string;
  date: string;
  client: string;
  model: string;
  priceWithVat: number;
  inMix: boolean;
  isFinanced: boolean;
  priceWithoutVat: number;
  baseCommissionUnit: number;
}

export interface Tier {
  id: string;
  threshold: number;
  percentage: number;
}

export interface Parameters {
  baseCommissionRate: number;
  weights: {
    volume: number;
    mix: number;
    financing: number;
    quality: number;
  };
  tiers: {
    volume: Tier[];
    mix: Tier[];
    financing: Tier[];
    quality: Tier[];
  };
}

export interface SummaryData {
  totalUnits: number;
  totalBaseCommission: number;
  volumeBonus: number;
  mixBonus: number;
  financingBonus: number;
  qualityBonus: number;
  finalCommission: number;
  stats: {
    mixPercentage: number;
    financingPercentage: number;
    qualityScore: number;
  };
}

export interface MonthData {
  status: 'open' | 'closed';
  sales: Sale[];
  parameters: Parameters;
  qualityScore: number;
  summary: SummaryData | null;
  closedAt?: string;
}

export interface AppStore {
  activeMonth: string;
  months: Record<string, MonthData>;
}
