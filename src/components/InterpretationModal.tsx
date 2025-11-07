interface InterpretationModalProps {
  prompt: string;
  options: string[];
  onSelect: (index: number) => void;
  isVisible: boolean;
}

export function InterpretationModal({ prompt, options, onSelect, isVisible }: InterpretationModalProps) {
  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Interpret the Symbol</h3>
        </div>
        <p className="modal-prompt">{prompt}</p>
        <div className="modal-options">
          {options.map((option, index) => (
            <button
              key={index}
              className="option-btn"
              onClick={() => onSelect(index)}
            >
              <span className="option-letter">{String.fromCharCode(65 + index)}</span>
              <span className="option-text">{option}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
