import { useState } from 'react';

interface QuestionInputProps {
  onAskQuestion: (question: string) => void;
  disabled: boolean;
  availableQuestions: string[];
}

export function QuestionInput({ onAskQuestion, disabled, availableQuestions }: QuestionInputProps) {
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [customQuestion, setCustomQuestion] = useState('');
  const [mode, setMode] = useState<'preset' | 'custom'>('preset');

  const handleSubmit = () => {
    const question = mode === 'preset' ? selectedQuestion : customQuestion;
    if (question.trim()) {
      onAskQuestion(question);
      setCustomQuestion('');
      setSelectedQuestion('');
    }
  };

  return (
    <div className="question-input">
      <div className="input-mode-toggle">
        <button
          className={`toggle-btn ${mode === 'preset' ? 'active' : ''}`}
          onClick={() => setMode('preset')}
        >
          Suggested Questions
        </button>
        <button
          className={`toggle-btn ${mode === 'custom' ? 'active' : ''}`}
          onClick={() => setMode('custom')}
        >
          Ask Your Own
        </button>
      </div>

      {mode === 'preset' ? (
        <div className="preset-questions">
          {availableQuestions.map((question, index) => (
            <button
              key={index}
              className={`question-btn ${selectedQuestion === question ? 'selected' : ''}`}
              onClick={() => setSelectedQuestion(question)}
              disabled={disabled}
            >
              {question}
            </button>
          ))}
        </div>
      ) : (
        <textarea
          className="custom-input"
          value={customQuestion}
          onChange={(e) => setCustomQuestion(e.target.value)}
          placeholder="Type your question to Elara..."
          disabled={disabled}
          rows={3}
        />
      )}

      <button
        className="ask-btn"
        onClick={handleSubmit}
        disabled={disabled || (mode === 'preset' ? !selectedQuestion : !customQuestion.trim())}
      >
        Ask Elara
      </button>
    </div>
  );
}
