export interface UtmParams {
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
}

export interface VideoLinkData {
  id: string;
  videoTitle: string;
  originalUrl: string;
  generatedUrl: string;
  params: UtmParams;
  createdAt: number; // Timestamp
  clicks?: number; // Mock metric for dashboard visualization
}

export type ViewState = 'dashboard' | 'create' | 'library';

export interface AiSuggestion {
  source: string;
  medium: string;
  campaign: string;
  reasoning?: string;
}
