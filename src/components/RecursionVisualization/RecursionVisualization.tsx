import { CSSProperties } from 'react';
import { RecursionData, Step } from '../../types';

interface RecursionVisualizationProps {
  data: RecursionData;
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

export default function RecursionVisualization({ data, step }: RecursionVisualizationProps) {
  const exampleLabel =
    data.example === 'factorial'
      ? 'Factorial'
      : data.example === 'fibonacci'
        ? 'Fibonacci'
        : 'Sum To N';

  if (data.input === null) {
    return (
      <div style={emptyStyle}>
        <p>Set a number to watch recursion build and unwind its call stack</p>
      </div>
    );
  }

  const frames = [...data.frames].reverse();

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
        <span>Recursion Call Stack</span>
        <span>{exampleLabel}({data.input}) = {data.result ?? 'pending'}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {frames.length === 0 ? (
          <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Run `{exampleLabel}` to populate stack frames.
          </div>
        ) : (
          frames.map((frame) => {
            const isActive = data.activeFrameId === frame.id;
            const isResolved = frame.result !== null;

            return (
              <div
                key={frame.id}
                style={{
                  borderRadius: '14px',
                  border: `3px solid ${isResolved ? 'var(--highlight-green)' : isActive ? 'var(--accent)' : 'var(--border)'}`,
                  background: isResolved ? '#dcfce7' : isActive ? 'var(--highlight-pink)' : 'var(--bg-panel)',
                  color: 'var(--text-primary)',
                  padding: '14px 18px',
                  marginLeft: `${frame.depth * 28}px`,
                  boxShadow: 'var(--shadow)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                  <span style={{ fontWeight: 700 }}>{frame.label}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    {frame.status}
                  </span>
                </div>
                <div style={{ marginTop: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Depth: {frame.depth} | Result: {frame.result ?? 'pending'}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}