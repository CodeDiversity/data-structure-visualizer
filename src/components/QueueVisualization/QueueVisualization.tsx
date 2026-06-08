import { CSSProperties } from 'react';
import { QueueData } from '../../types';

interface QueueVisualizationProps {
  data: QueueData;
}

const emptyStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '300px',
  color: '#888',
  fontSize: '16px',
};

export default function QueueVisualization({ data }: QueueVisualizationProps) {
  if (data.values.length === 0) {
    return (
      <div style={emptyStyle}>
        <p>Enqueue values into the queue to begin</p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '24px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          color: '#334155',
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
                    background: '#0ea5e9',
                    color: '#fff',
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
                    background: '#f97316',
                    color: '#fff',
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
                  border: `3px solid ${isFound ? '#16a34a' : isActive ? '#f59e0b' : '#cbd5e1'}`,
                  background: isFound ? '#dcfce7' : isActive ? '#fff7ed' : '#ffffff',
                  color: '#0f172a',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: '0 10px 20px rgba(15, 23, 42, 0.08)',
                }}
              >
                <div style={{ fontSize: '12px', color: '#64748b' }}>{index}</div>
                <div style={{ fontSize: '26px', fontWeight: 700 }}>{value}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
