import { CSSProperties } from 'react';
import { SlidingWindowData } from '../../types';

interface SlidingWindowVisualizationProps {
  data: SlidingWindowData;
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
  color: '#888',
  fontSize: '16px',
};

export default function SlidingWindowVisualization({ data }: SlidingWindowVisualizationProps) {
  if (data.values.length === 0) {
    return (
      <div style={emptyStyle}>
        <p>Load an array and window size to begin</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#334155',
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
          color: '#475569',
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
                    background: '#0ea5e9',
                    color: '#fff',
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
                  border: `3px solid ${inBest ? '#16a34a' : inWindow ? '#f59e0b' : '#cbd5e1'}`,
                  background: inBest ? '#dcfce7' : '#ffffff',
                  color: '#0f172a',
                  height: '72px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 20px rgba(15, 23, 42, 0.08)',
                }}
              >
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>{index}</div>
                <div style={{ fontSize: '24px', fontWeight: 700 }}>{value}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
