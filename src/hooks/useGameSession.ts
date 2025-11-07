import { useState, useEffect } from 'react';
import { supabase, type GameSession, type LevelData } from '../lib/supabase';

export function useGameSession() {
  const [session, setSession] = useState<GameSession | null>(null);
  const [levelData, setLevelData] = useState<LevelData | null>(null);
  const [loading, setLoading] = useState(true);

  const createNewSession = async () => {
    const { data, error } = await supabase
      .from('game_sessions')
      .insert({})
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error creating session:', error);
      return null;
    }

    setSession(data);
    await loadLevelData(1);
    return data;
  };

  const loadLevelData = async (levelNumber: number) => {
    const { data, error } = await supabase
      .from('level_data')
      .select('*')
      .eq('level_number', levelNumber)
      .maybeSingle();

    if (error) {
      console.error('Error loading level:', error);
      return;
    }

    setLevelData(data);
  };

  const updateSession = async (updates: Partial<GameSession>) => {
    if (!session) return;

    const { data, error } = await supabase
      .from('game_sessions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', session.id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating session:', error);
      return;
    }

    setSession(data);
  };

  const addQuestion = (question: string, imagePrompt: string) => {
    if (!session) return;

    const newQuestions = [
      ...session.questions_asked,
      { question, imagePrompt, timestamp: new Date().toISOString() }
    ];

    updateSession({ questions_asked: newQuestions });
  };

  const recordInterpretation = async (isCorrect: boolean, clarityGain: number) => {
    if (!session) return;

    const newClarity = Math.min(100, session.memory_clarity + (isCorrect ? clarityGain : 0));
    const updates: Partial<GameSession> = {
      memory_clarity: newClarity,
      correct_interpretations: isCorrect ? session.correct_interpretations + 1 : session.correct_interpretations,
      incorrect_interpretations: !isCorrect ? session.incorrect_interpretations + 1 : session.incorrect_interpretations,
    };

    if (newClarity >= 100 && session.current_level === 2) {
      updates.game_state = 'won';
    } else if (!isCorrect && session.incorrect_interpretations >= 3) {
      updates.game_state = 'lost';
    }

    await updateSession(updates);
  };

  const advanceLevel = async () => {
    if (!session || !levelData) return;

    const nextLevel = session.current_level + 1;
    await updateSession({ current_level: nextLevel });
    await loadLevelData(nextLevel);
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await createNewSession();
      setLoading(false);
    };

    init();
  }, []);

  return {
    session,
    levelData,
    loading,
    addQuestion,
    recordInterpretation,
    advanceLevel,
    createNewSession,
  };
}
