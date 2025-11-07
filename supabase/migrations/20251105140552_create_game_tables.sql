/*
  # Silent Witness Game Database Schema

  1. New Tables
    - `game_sessions`
      - `id` (uuid, primary key)
      - `player_name` (text, optional)
      - `current_level` (integer, default 1)
      - `memory_clarity` (integer, default 0, 0-100)
      - `questions_asked` (jsonb, stores question history)
      - `correct_interpretations` (integer, default 0)
      - `incorrect_interpretations` (integer, default 0)
      - `game_state` (text, enum: active/won/lost)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `level_data`
      - `id` (uuid, primary key)
      - `level_number` (integer, unique)
      - `title` (text)
      - `objective` (text)
      - `required_clarity` (integer)
      - `questions` (jsonb, stores available questions and correct answers)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Public access for reading level data
    - Session management allows players to create and update their own sessions
*/

-- Create game_sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text DEFAULT '',
  current_level integer DEFAULT 1,
  memory_clarity integer DEFAULT 0,
  questions_asked jsonb DEFAULT '[]'::jsonb,
  correct_interpretations integer DEFAULT 0,
  incorrect_interpretations integer DEFAULT 0,
  game_state text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create level_data table
CREATE TABLE IF NOT EXISTS level_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level_number integer UNIQUE NOT NULL,
  title text NOT NULL,
  objective text NOT NULL,
  required_clarity integer NOT NULL,
  questions jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE level_data ENABLE ROW LEVEL SECURITY;

-- Policies for game_sessions (allow anyone to create and read their own sessions)
CREATE POLICY "Anyone can create game sessions"
  ON game_sessions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view all sessions"
  ON game_sessions
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can update sessions"
  ON game_sessions
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Policies for level_data (read-only for everyone)
CREATE POLICY "Anyone can view level data"
  ON level_data
  FOR SELECT
  TO anon
  USING (true);

-- Insert initial level data
INSERT INTO level_data (level_number, title, objective, required_clarity, questions) VALUES
(1, 'The Shadow in the Studio', 'Establish a safe space and begin exploring the basic symbols of trauma', 45, '{
  "scenarios": [
    {
      "question": "Elara, can you show me where you were?",
      "imagePrompt": "A dark, messy art studio with giant distorted paintbrushes hanging like prison bars, single overturned easel in center, foggy and abstract, muted dark colors",
      "interpretation": {
        "prompt": "What is the most important object in this room?",
        "options": ["The brushes", "The window", "The overturned easel"],
        "correct": 2,
        "clarityGain": 15
      }
    },
    {
      "question": "Who was in the room with you?",
      "imagePrompt": "Same dark studio, one figure of pure warm light on one side, tall hulking figure of jagged shadow with no face on other side, surreal dreamlike painting",
      "interpretation": {
        "prompt": "What do these two figures represent?",
        "options": ["Two killers", "The victim and the killer", "Her memories fading"],
        "correct": 1,
        "clarityGain": 30
      }
    }
  ]
}'::jsonb),
(2, 'The Stolen Color', 'Uncover key details about the killer through symbolic complexity', 100, '{
  "scenarios": [
    {
      "question": "Show me something about the shadow figure",
      "imagePrompt": "Close-up of shadow figure hand clenched around single vibrant crimson paintbrush, only spot of color in dark painting, brilliant bloody red",
      "interpretation": {
        "prompt": "This image is trying to tell you...",
        "options": ["The killer was a painter", "The killer was injured", "The killer stole something important"],
        "correct": 0,
        "clarityGain": 35
      }
    },
    {
      "question": "What did this person say?",
      "imagePrompt": "Shadow figure leaning over light figure, instead of mouth a jagged hole with swarm of green scaly serpents spilling out, haunting surreal art",
      "interpretation": {
        "prompt": "The serpents symbolize...",
        "options": ["Physical violence", "Poisonous words and lies", "A supernatural curse"],
        "correct": 1,
        "clarityGain": 20
      }
    }
  ]
}'::jsonb)
ON CONFLICT (level_number) DO NOTHING;
