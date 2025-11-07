import { useState, useEffect } from 'react';

interface CanvasProps {
  imagePrompt: string | null;
  isRevealing: boolean;
}

export function Canvas({ imagePrompt, isRevealing }: CanvasProps) {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (isRevealing && imagePrompt) {
      setOpacity(0);
      const timer = setTimeout(() => setOpacity(1), 100);
      return () => clearTimeout(timer);
    } else if (!imagePrompt) {
      setOpacity(0);
    }
  }, [isRevealing, imagePrompt]);

  return (
    <div className="canvas-container">
      <div className="canvas">
        {!imagePrompt ? (
          <div className="canvas-empty">
            <div className="canvas-figure">
              <div className="figure-silhouette"></div>
            </div>
            <p className="canvas-text">Ask Elara a question...</p>
          </div>
        ) : (
          <div
            className="canvas-content"
            style={{
              opacity,
              transition: 'opacity 2s ease-in-out'
            }}
          >
            <div className="image-placeholder">
              <p className="image-description">{imagePrompt}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
