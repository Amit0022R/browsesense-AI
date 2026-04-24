export interface HistoryItem {
  url: string;
  visitCount?: number;
  timeSpent?: number;
}

export interface ProcessedHistoryItem {
  url: string;
  timeSpent: number; // in minutes
}

export interface AIAnalysisResponse {
  productivityScore: number;
  totalTime: number; // in minutes
  productiveTime: number; // in minutes
  distractingTime: number; // in minutes
  topDistractions: string[];
  insights: string[];
  suggestions: string[];
}
