import { useState, useEffect } from 'react';

interface CanvasProps {
  imagePrompt: string | null;
  isRevealing: boolean;
}

export function Canvas({ imagePrompt, isRevealing }: CanvasProps) {
  const [opacity, setOpacity] = useState(0);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isRevealing && imagePrompt) {
      setOpacity(0);
      setGeneratedImage(null);
      setIsGenerating(true);
      setError(null);

      const generateImage = async () => {
        try {
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
          const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

          console.log('Calling generate-image function with prompt:', imagePrompt);

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

          console.log('Response status:', response.status);

          if (!response.ok) {
            const errorData = await response.json();
            console.error('API error:', errorData);
            setError(`Error: ${errorData.error || 'Failed to generate image'}`);
            setIsGenerating(false);
            return;
          }

          const data = await response.json();
          console.log('Received image data:', !!data.image);

          if (data.image) {
            setGeneratedImage(data.image);
          } else {
            setError('No image in response');
          }
        } catch (error) {
          console.error('Error generating image:', error);
          setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
          setIsGenerating(false);
        }
      };

      const timer = setTimeout(() => {
        generateImage();
        setOpacity(1);
      }, 300);

      return () => clearTimeout(timer);
    } else if (!imagePrompt) {
      setOpacity(0);
      setGeneratedImage(null);
      setError(null);
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
            {error && (
              <div className="error-display">
                <p className="error-text">Error: {error}</p>
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
