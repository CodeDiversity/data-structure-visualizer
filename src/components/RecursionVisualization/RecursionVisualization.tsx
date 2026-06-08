import { CSSProperties } from 'react';
import { RecursionData } from '../../types';

interface RecursionVisualizationProps {
  data: RecursionData;
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

export default function RecursionVisualization({ data }: RecursionVisualizationProps) {
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
        <span>Recursion Call Stack</span>
        <span>{exampleLabel}({data.input}) = {data.result ?? 'pending'}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {frames.length === 0 ? (
          <div style={{ color: '#64748b', fontSize: '14px' }}>
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
                  border: `3px solid ${isResolved ? '#16a34a' : isActive ? '#2563eb' : '#cbd5e1'}`,
                  background: isResolved ? '#dcfce7' : isActive ? '#dbeafe' : '#ffffff',
                  color: '#0f172a',
                  padding: '14px 18px',
                  marginLeft: `${frame.depth * 28}px`,
                  boxShadow: '0 10px 20px rgba(15, 23, 42, 0.08)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                  <span style={{ fontWeight: 700 }}>{frame.label}</span>
                  <span style={{ fontSize: '12px', color: '#475569', textTransform: 'uppercase' }}>
                    {frame.status}
                  </span>
                </div>
                <div style={{ marginTop: '6px', fontSize: '13px', color: '#475569' }}>
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
