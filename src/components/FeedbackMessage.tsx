import { useEffect, useState } from 'react';

interface FeedbackMessageProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onComplete: () => void;
}

export function FeedbackMessage({ message, type, onComplete }: FeedbackMessageProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`feedback-message ${type} ${visible ? 'visible' : ''}`}>
      <div className="feedback-icon">
        {type === 'success' && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        )}
        {type === 'error' && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        )}
        {type === 'info' && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        )}
      </div>
      <p className="feedback-text">{message}</p>
    </div>
  );
}
