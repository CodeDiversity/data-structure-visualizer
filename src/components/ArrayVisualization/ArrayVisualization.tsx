import { CSSProperties } from 'react';
import { ArrayData, Step } from '../../types';

interface ArrayVisualizationProps {
  data: ArrayData;
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

export default function ArrayVisualization({ data, step }: ArrayVisualizationProps) {
  if (data.values.length === 0) {
    return (
      <div style={emptyStyle}>
        <p>Load an array to begin</p>
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
        <span>Length: {data.values.length}</span>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {data.values.map((value, index) => {
          const isActive = data.activeIndices.includes(index);
          const isFound = data.foundIndex === index;

          return (
            <div
              key={`${value}-${index}`}
              style={{
                width: '72px',
                borderRadius: '14px',
                border: `3px solid ${isFound ? 'var(--highlight-green)' : isActive ? 'var(--highlight-yellow)' : 'var(--border)'}`,
                background: isFound ? 'var(--bg-panel)' : isActive ? 'var(--bg-panel)' : 'var(--bg-panel)',
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
          );
        })}
      </div>
    </div>
  );
}