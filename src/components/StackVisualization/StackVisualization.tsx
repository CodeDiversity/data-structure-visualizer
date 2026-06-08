import { CSSProperties } from 'react';
import { StackData } from '../../types';

interface StackVisualizationProps {
  data: StackData;
}

const emptyStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '300px',
  color: '#888',
  fontSize: '16px',
};

export default function StackVisualization({ data }: StackVisualizationProps) {
  if (data.values.length === 0) {
    return (
      <div style={emptyStyle}>
        <p>Push values onto the stack to begin</p>
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '28px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '10px' }}>
        {data.values.map((value, index) => {
          const isActive = data.activeIndices.includes(index);
          const isFound = data.foundIndex === index;
          const isTop = data.topIndex === index;

          return (
            <div
              key={`${value}-${index}`}
              style={{
                width: '160px',
                padding: '16px 20px',
                borderRadius: '14px',
                border: `3px solid ${isFound ? '#16a34a' : isActive ? '#f59e0b' : '#cbd5e1'}`,
                background: isFound ? '#dcfce7' : isActive ? '#fff7ed' : '#ffffff',
                color: '#0f172a',
                boxShadow: '0 10px 20px rgba(15, 23, 42, 0.08)',
                position: 'relative',
              }}
            >
              <div style={{ fontSize: '13px', color: '#64748b' }}>index {index}</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{value}</div>
              {isTop && (
                <div
                  style={{
                    position: 'absolute',
                    right: '-72px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    padding: '6px 10px',
                    borderRadius: '999px',
                    background: '#2563eb',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  TOP
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
