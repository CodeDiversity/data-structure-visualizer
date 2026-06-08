import { CSSProperties } from 'react';
import { StackData, Step } from '../../types';

interface StackVisualizationProps {
  data: StackData;
  step?: Step | null;
}

function getPhaseClass(phase?: string) {
  if (!phase) return '';
  return `phase-${phase}`;
}

const emptyStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '300px',
  color: 'var(--text-secondary)',
  fontSize: '16px',
};

export default function StackVisualization({ data, step }: StackVisualizationProps) {
  if (data.values.length === 0) {
    return (
      <div style={emptyStyle}>
        <p>Push values onto the stack to begin</p>
      </div>
    );
  }

  return (
    <div
      className={`spring-transition ${getPhaseClass(step?.phase)}`}
      style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '28px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '10px' }}>
        {data.values.map((value, index) => {
          const isActive = data.activeIndices.includes(index);
          const isFound = data.foundIndex === index;
          const isTop = data.topIndex === index;

          return (
            <div
              key={`${value}-${index}`}
              style={{
                width: '160px',
                padding: '16px 20px',
                borderRadius: '14px',
                border: `3px solid ${isFound ? 'var(--highlight-green)' : isActive ? 'var(--highlight-yellow)' : 'var(--border)'}`,
                background: isFound ? 'var(--bg-panel)' : isActive ? 'var(--bg-panel)' : 'var(--bg-panel)',
                color: 'var(--text-primary)',
                boxShadow: 'var(--shadow)',
                position: 'relative',
              }}
            >
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>index {index}</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{value}</div>
              {isTop && (
                <div
                  style={{
                    position: 'absolute',
                    right: '-72px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    padding: '6px 10px',
                    borderRadius: '999px',
                    background: 'var(--accent)',
                    color: 'var(--bg-panel)',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  TOP
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}