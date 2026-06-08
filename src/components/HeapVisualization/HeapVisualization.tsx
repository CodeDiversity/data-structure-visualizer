import { CSSProperties } from 'react';
import { HeapData } from '../../types';

interface HeapVisualizationProps {
  data: HeapData;
}

const emptyStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '300px',
  color: '#888',
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

export default function HeapVisualization({ data }: HeapVisualizationProps) {
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
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center' }}>
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
              stroke="#94a3b8"
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
                fill={isFound ? '#dcfce7' : isActive ? '#fff7ed' : '#ffffff'}
                stroke={isFound ? '#16a34a' : isActive ? '#f59e0b' : '#2563eb'}
                strokeWidth="4"
              />
              <text x={x} y={y + 6} textAnchor="middle" fill="#0f172a" fontSize="20" fontWeight="700">
                {value}
              </text>
              <text x={x} y={y - 40} textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="600">
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
                border: `3px solid ${isFound ? '#16a34a' : isActive ? '#f59e0b' : '#cbd5e1'}`,
                background: isFound ? '#dcfce7' : isActive ? '#fff7ed' : '#ffffff',
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
          );
        })}
      </div>
    </div>
  );
}
