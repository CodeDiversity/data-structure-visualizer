import { CSSProperties } from 'react';
import { ArrayData } from '../../types';

interface ArrayVisualizationProps {
  data: ArrayData;
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

export default function ArrayVisualization({ data }: ArrayVisualizationProps) {
  if (data.values.length === 0) {
    return (
      <div style={emptyStyle}>
        <p>Load an array to begin</p>
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
