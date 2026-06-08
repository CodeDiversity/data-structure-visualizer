import { CSSProperties } from 'react';
import { TwoPointerData, Step } from '../../types';

interface TwoPointerVisualizationProps {
  data: TwoPointerData;
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

export default function TwoPointerVisualization({ data, step }: TwoPointerVisualizationProps) {
  if (data.values.length === 0) {
    return (
      <div style={emptyStyle}>
        <p>Load a sorted array to begin</p>
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
        <span>Sorted Array</span>
        <span>Target: {data.target ?? 'unset'}</span>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {data.values.map((value, index) => {
          const isLeft = data.leftIndex === index;
          const isRight = data.rightIndex === index;
          const isMatched = data.matchedIndices.includes(index);

          return (
            <div
              key={`${value}-${index}`}
              style={{
                position: 'relative',
                width: '72px',
                paddingTop: '52px',
              }}
            >
              {isLeft && (
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
                  LEFT
                </div>
              )}

              {isRight && (
                <div
                  style={{
                    position: 'absolute',
                    top: isLeft ? 24 : 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '4px 8px',
                    borderRadius: '999px',
                    background: 'var(--highlight-pink)',
                    color: 'var(--bg-panel)',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  RIGHT
                </div>
              )}

              <div
                style={{
                  borderRadius: '14px',
                  border: `3px solid ${isMatched ? 'var(--highlight-green)' : isLeft || isRight ? 'var(--highlight-yellow)' : 'var(--border)'}`,
                  background: isMatched ? '#dcfce7' : 'var(--bg-panel)',
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