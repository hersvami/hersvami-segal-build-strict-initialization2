export type TradeItem = {
  unitId: string;
  label: string;
  unit: string;
  rate: number;
  quantity: number;
  isPreFilled: boolean;
  reason?: string;
};

export type TradeAnalysis = {
  categoryId: string;
  label: string;
  confidence: number;
  tradeScope: string;
  items: TradeItem[];
  suggestions: TradeItem[];
  subtotal: number;
};

export type AnalysisResult = {
  trades: TradeAnalysis[];
  model?: string;
  fallback: boolean;
};