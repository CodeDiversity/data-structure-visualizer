import { CSSProperties } from 'react';
import { QueueData, Step } from '../../types';

interface QueueVisualizationProps {
  data: QueueData;
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

export default function QueueVisualization({ data, step }: QueueVisualizationProps) {
  if (data.values.length === 0) {
    return (
      <div style={emptyStyle}>
        <p>Enqueue values into the queue to begin</p>
      </div>
    );
  }

  return (
    <div
      className={`spring-transition ${getPhaseClass(step?.phase)}`}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '24px' }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          color: 'var(--text-primary)',
          fontSize: '15px',
          fontWeight: 600,
        }}
      >
        <span>Front follows FIFO order</span>
        <span>Rear receives new values</span>
      </div>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        {data.values.map((value, index) => {
          const isActive = data.activeIndices.includes(index);
          const isFound = data.foundIndex === index;
          const isFront = data.frontIndex === index;
          const isRear = data.rearIndex === index;

          return (
            <div key={`${value}-${index}`} style={{ position: 'relative', width: '86px', paddingTop: '56px' }}>
              {isFront && (
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
                  FRONT
                </div>
              )}
              {isRear && (
                <div
                  style={{
                    position: 'absolute',
                    top: isFront ? 24 : 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '4px 8px',
                    borderRadius: '999px',
                    background: 'var(--highlight-orange)',
                    color: 'var(--bg-panel)',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  REAR
                </div>
              )}
              <div
                style={{
                  height: '76px',
                  borderRadius: '14px',
                  border: `3px solid ${isFound ? 'var(--highlight-green)' : isActive ? 'var(--highlight-yellow)' : 'var(--border)'}`,
                  background: isFound ? 'var(--bg-panel)' : isActive ? 'var(--bg-panel)' : 'var(--bg-panel)',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: 'var(--shadow)',
                }}
              >
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{index}</div>
                <div style={{ fontSize: '26px', fontWeight: 700 }}>{value}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}