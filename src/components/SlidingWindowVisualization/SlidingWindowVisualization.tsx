import { CSSProperties } from 'react';
import { SlidingWindowData, Step } from '../../types';

interface SlidingWindowVisualizationProps {
  data: SlidingWindowData;
  step?: Step | null;
}

function getPhaseClass(phase?: string) {
  if (!phase) return '';
  return `phase-${phase}`;
}

const containerStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '20px',
};

const emptyStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '300px',
  color: 'var(--text-secondary)',
  fontSize: '16px',
};

export default function SlidingWindowVisualization({ data, step }: SlidingWindowVisualizationProps) {
  if (data.values.length === 0) {
    return (
      <div style={emptyStyle}>
        <p>Load an array and window size to begin</p>
      </div>
    );
  }

  return (
    <div className={`spring-transition ${getPhaseClass(step?.phase)}`} style={containerStyle}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'var(--text-primary)',
          fontSize: '15px',
          fontWeight: 600,
        }}
      >
        <span>Array</span>
        <span>Window Size: {data.windowSize ?? 'unset'}</span>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          color: 'var(--text-secondary)',
          fontSize: '14px',
          fontWeight: 600,
        }}
      >
        <span>Current Sum: {data.currentSum ?? 'unset'}</span>
        <span>Best Sum: {data.bestSum ?? 'unset'}</span>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {data.values.map((value, index) => {
          const inWindow =
            data.windowStart !== null &&
            data.windowEnd !== null &&
            index >= data.windowStart &&
            index <= data.windowEnd;
          const inBest =
            data.bestStart !== null &&
            data.bestEnd !== null &&
            index >= data.bestStart &&
            index <= data.bestEnd;

          return (
            <div
              key={`${value}-${index}`}
              style={{
                position: 'relative',
                width: '72px',
                paddingTop: '52px',
              }}
            >
              {inWindow && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '4px 8px',
                    borderRadius: '999px',
                    background: 'var(--accent)',
                    color: 'var(--bg-panel)',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  WINDOW
                </div>
              )}

              <div
                style={{
                  borderRadius: '14px',
                  border: `3px solid ${inBest ? 'var(--highlight-green)' : inWindow ? 'var(--highlight-yellow)' : 'var(--border)'}`,
                  background: inBest ? '#dcfce7' : 'var(--bg-panel)',
                  color: 'var(--text-primary)',
                  height: '72px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow)',
                }}
              >
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{index}</div>
                <div style={{ fontSize: '24px', fontWeight: 700 }}>{value}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}