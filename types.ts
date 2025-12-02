export interface HistoryPoint {
  date: string;
  rate: number;
}

export interface ExchangeData {
  currentRate: number;
  lastUpdated: string;
  history: HistoryPoint[];
  analysis: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface ApiResponse {
  data: ExchangeData | null;
  sources: GroundingSource[];
  error?: string;
}
