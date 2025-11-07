import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface GameSession {
  id: string;
  player_name: string;
  current_level: number;
  memory_clarity: number;
  questions_asked: any[];
  correct_interpretations: number;
  incorrect_interpretations: number;
  game_state: 'active' | 'won' | 'lost';
  created_at: string;
  updated_at: string;
}

export interface LevelData {
  id: string;
  level_number: number;
  title: string;
  objective: string;
  required_clarity: number;
  questions: {
    scenarios: Array<{
      question: string;
      imagePrompt: string;
      interpretation: {
        prompt: string;
        options: string[];
        correct: number;
        clarityGain: number;
      };
    }>;
  };
}
