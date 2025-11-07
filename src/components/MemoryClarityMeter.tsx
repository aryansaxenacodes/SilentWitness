interface MemoryClarityMeterProps {
  clarity: number;
  levelTitle: string;
}

export function MemoryClarityMeter({ clarity, levelTitle }: MemoryClarityMeterProps) {
  return (
    <div className="clarity-meter">
      <div className="meter-header">
        <div className="level-info">
          <h2 className="level-title">{levelTitle}</h2>
        </div>
        <div className="clarity-label">
          <span className="label-text">MEMORY CLARITY</span>
          <span className="clarity-value">{clarity}%</span>
        </div>
      </div>
      <div className="meter-bar-container">
        <div
          className="meter-bar-fill"
          style={{
            width: `${clarity}%`,
            transition: 'width 1s ease-out'
          }}
        >
          <div className="meter-shine"></div>
        </div>
      </div>
    </div>
  );
}
