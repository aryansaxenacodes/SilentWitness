import { useState, useEffect } from 'react';

interface CanvasProps {
  imagePrompt: string | null;
  isRevealing: boolean;
}

export function Canvas({ imagePrompt, isRevealing }: CanvasProps) {
  const [opacity, setOpacity] = useState(0);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isRevealing && imagePrompt) {
      setOpacity(0);
      setGeneratedImage(null);
      setIsGenerating(true);

      const generateImage = async () => {
        try {
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
          const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

          const response = await fetch(
            `${supabaseUrl}/functions/v1/generate-image`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${anonKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ prompt: imagePrompt }),
            }
          );

          if (!response.ok) {
            console.error('Failed to generate image');
            setIsGenerating(false);
            return;
          }

          const data = await response.json();
          setGeneratedImage(data.image);
        } catch (error) {
          console.error('Error generating image:', error);
        } finally {
          setIsGenerating(false);
        }
      };

      const timer = setTimeout(() => {
        generateImage();
        setOpacity(1);
      }, 500);

      return () => clearTimeout(timer);
    } else if (!imagePrompt) {
      setOpacity(0);
      setGeneratedImage(null);
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
            {isGenerating && (
              <div className="generating-indicator">
                <div className="generate-spinner"></div>
                <p>Elara is remembering...</p>
              </div>
            )}
            {generatedImage && !isGenerating && (
              <div className="image-display">
                <img src={generatedImage} alt="Elara's memory" className="generated-image" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
