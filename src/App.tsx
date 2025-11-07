import { useState, useEffect } from 'react';
import { useGameSession } from './hooks/useGameSession';
import { Canvas } from './components/Canvas';
import { QuestionInput } from './components/QuestionInput';
import { InterpretationModal } from './components/InterpretationModal';
import { MemoryClarityMeter } from './components/MemoryClarityMeter';
import { GameOverModal } from './components/GameOverModal';
import { FeedbackMessage } from './components/FeedbackMessage';
import './App.css';

function App() {
  const { session, levelData, loading, addQuestion, recordInterpretation, advanceLevel, createNewSession } = useGameSession();

  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [currentImagePrompt, setCurrentImagePrompt] = useState<string | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [showInterpretation, setShowInterpretation] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const currentScenario = levelData?.questions.scenarios[currentScenarioIndex];

  useEffect(() => {
    if (session?.game_state === 'active' && session.memory_clarity >= (levelData?.required_clarity || 100)) {
      if (session.current_level < 2) {
        setTimeout(() => {
          setFeedback({ message: 'Level Complete! Advancing to next level...', type: 'success' });
          setTimeout(() => {
            advanceLevel();
            setCurrentScenarioIndex(0);
            setCurrentImagePrompt(null);
            setFeedback(null);
          }, 2000);
        }, 1000);
      }
    }
  }, [session?.memory_clarity, session?.game_state, levelData?.required_clarity, session?.current_level]);

  const handleAskQuestion = (question: string) => {
    if (!currentScenario) return;

    setInputDisabled(true);
    setIsRevealing(true);

    addQuestion(question, currentScenario.imagePrompt);

    setTimeout(() => {
      setCurrentImagePrompt(currentScenario.imagePrompt);
    }, 500);

    setTimeout(() => {
      setShowInterpretation(true);
      setIsRevealing(false);
    }, 3000);
  };

  const handleInterpretation = async (selectedIndex: number) => {
    if (!currentScenario) return;

    const isCorrect = selectedIndex === currentScenario.interpretation.correct;
    setShowInterpretation(false);

    if (isCorrect) {
      setFeedback({ message: 'A breakthrough! The memory becomes clearer...', type: 'success' });
    } else {
      setFeedback({ message: 'Something feels wrong. The shadows deepen...', type: 'error' });
    }

    await recordInterpretation(isCorrect, currentScenario.interpretation.clarityGain);

    setTimeout(() => {
      if (currentScenarioIndex < (levelData?.questions.scenarios.length || 0) - 1) {
        setCurrentScenarioIndex(currentScenarioIndex + 1);
        setCurrentImagePrompt(null);
      }
      setInputDisabled(false);
      setFeedback(null);
    }, 2000);
  };

  const handleRestart = () => {
    createNewSession();
    setCurrentScenarioIndex(0);
    setCurrentImagePrompt(null);
    setShowInterpretation(false);
    setInputDisabled(false);
    setFeedback(null);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Preparing the session...</p>
        </div>
      </div>
    );
  }

  if (!session || !levelData) {
    return (
      <div className="error-screen">
        <p>Failed to initialize game session</p>
        <button onClick={handleRestart}>Retry</button>
      </div>
    );
  }

  const availableQuestions = levelData.questions.scenarios.map(s => s.question);

  return (
    <div className="app">
      <div className="game-header">
        <h1 className="game-title">Silent Witness</h1>
        <p className="game-subtitle">Help the witness break through her trauma</p>
      </div>

      <MemoryClarityMeter
        clarity={session.memory_clarity}
        levelTitle={levelData.title}
      />

      <div className="game-objective">
        <p>{levelData.objective}</p>
      </div>

      <Canvas
        imagePrompt={currentImagePrompt}
        isRevealing={isRevealing}
      />

      <QuestionInput
        onAskQuestion={handleAskQuestion}
        disabled={inputDisabled || showInterpretation}
        availableQuestions={availableQuestions}
      />

      {currentScenario && (
        <InterpretationModal
          prompt={currentScenario.interpretation.prompt}
          options={currentScenario.interpretation.options}
          onSelect={handleInterpretation}
          isVisible={showInterpretation}
        />
      )}

      {session.game_state !== 'active' && (
        <GameOverModal
          gameState={session.game_state as 'won' | 'lost'}
          onRestart={handleRestart}
        />
      )}

      {feedback && (
        <FeedbackMessage
          message={feedback.message}
          type={feedback.type}
          onComplete={() => setFeedback(null)}
        />
      )}
    </div>
  );
}

export default App;
