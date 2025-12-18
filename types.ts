
export interface Caption {
  style: 'Short' | 'Witty' | 'Professional' | 'Aesthetic';
  text: string;
}

export interface VibeResult {
  captions: Caption[];
  hashtags: string[];
  vibe: string;
}

export interface AppState {
  image: string | null;
  loading: boolean;
  result: VibeResult | null;
  error: string | null;
}
