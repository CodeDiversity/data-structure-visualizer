import { CSSProperties } from 'react';
import { HeapData, Step } from '../../types';

interface HeapVisualizationProps {
  data: HeapData;
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

function getNodePosition(index: number) {
  const level = Math.floor(Math.log2(index + 1));
  const levelStart = 2 ** level - 1;
  const positionInLevel = index - levelStart;
  const nodesInLevel = 2 ** level;

  return {
    x: 520 * ((positionInLevel + 1) / (nodesInLevel + 1)),
    y: 60 + level * 90,
  };
}

export default function HeapVisualization({ data, step }: HeapVisualizationProps) {
  if (data.values.length === 0) {
    return (
      <div style={emptyStyle}>
        <p>Insert values into the heap to begin</p>
      </div>
    );
  }

  const width = 520;
  const height = Math.max(220, 120 + Math.floor(Math.log2(data.values.length)) * 90);

  return (
    <div
      className={`spring-transition ${getPhaseClass(step?.phase)}`}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center' }}
    >
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', maxHeight: '360px' }}>
        {data.values.map((_, index) => {
          if (index === 0) {
            return null;
          }

          const parentIndex = Math.floor((index - 1) / 2);
          const parent = getNodePosition(parentIndex);
          const child = getNodePosition(index);

          return (
            <line
              key={`edge-${index}`}
              x1={parent.x}
              y1={parent.y}
              x2={child.x}
              y2={child.y}
              stroke="var(--border)"
              strokeWidth="3"
            />
          );
        })}

        {data.values.map((value, index) => {
          const { x, y } = getNodePosition(index);
          const isActive = data.activeIndices.includes(index);
          const isFound = data.foundIndex === index;

          return (
            <g key={`node-${index}`}>
              <circle
                cx={x}
                cy={y}
                r="28"
                fill={isFound ? '#dcfce7' : isActive ? '#fff7ed' : 'var(--bg-panel)'}
                stroke={isFound ? 'var(--highlight-green)' : isActive ? 'var(--highlight-yellow)' : 'var(--accent)'}
                strokeWidth="4"
              />
              <text x={x} y={y + 6} textAnchor="middle" fill="var(--text-primary)" fontSize="20" fontWeight="700">
                {value}
              </text>
              <text x={x} y={y - 40} textAnchor="middle" fill="var(--text-secondary)" fontSize="11" fontWeight="600">
                {index}
              </text>
            </g>
          );
        })}
      </svg>

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
                background: isFound ? '#dcfce7' : isActive ? '#fff7ed' : 'var(--bg-panel)',
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