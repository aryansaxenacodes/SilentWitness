interface GameOverModalProps {
  gameState: 'won' | 'lost';
  onRestart: () => void;
}

export function GameOverModal({ gameState, onRestart }: GameOverModalProps) {
  return (
    <div className="modal-overlay game-over">
      <div className="modal-content game-over-content">
        {gameState === 'won' ? (
          <>
            <div className="game-over-icon success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2 className="game-over-title">THE MEMORY IS CLEAR</h2>
            <p className="game-over-message">
              Through patience and understanding, you've helped Elara break through her trauma.
              The killer's face emerges from the shadows, no longer hidden.
              Justice can finally be served.
            </p>
            <div className="killer-reveal">
              <div className="killer-portrait"></div>
              <p className="killer-text">The jealous rival painter has been identified.</p>
            </div>
          </>
        ) : (
          <>
            <div className="game-over-icon failure">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>
            <h2 className="game-over-title">THE MEMORY IS LOST</h2>
            <p className="game-over-message">
              The trauma was too much. Your questions pushed too hard, or missed the truth entirely.
              Elara has retreated deep into herself, where the shadows reign.
            </p>
            <p className="game-over-subtitle">THE KILLER REMAINS A GHOST.</p>
          </>
        )}
        <button className="restart-btn" onClick={onRestart}>
          {gameState === 'won' ? 'Play Again' : 'Try Again'}
        </button>
      </div>
    </div>
  );
}
