import { CSSProperties } from 'react';
import { BinarySearchData } from '../../types';

interface BinarySearchVisualizationProps {
  data: BinarySearchData;
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

export default function BinarySearchVisualization({ data }: BinarySearchVisualizationProps) {
  if (data.values.length === 0) {
    return (
      <div style={emptyStyle}>
        <p>Load a sorted array and target to begin</p>
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
        <span>Sorted Array</span>
        <span>Target: {data.target ?? 'unset'}</span>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {data.values.map((value, index) => {
          const isLow = data.lowIndex === index;
          const isMid = data.midIndex === index;
          const isHigh = data.highIndex === index;
          const isFound = data.foundIndex === index;
          const inRange =
            data.lowIndex !== null &&
            data.highIndex !== null &&
            index >= data.lowIndex &&
            index <= data.highIndex;

          return (
            <div
              key={`${value}-${index}`}
              style={{
                position: 'relative',
                width: '72px',
                paddingTop: '76px',
              }}
            >
              {isLow && (
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
                  LOW
                </div>
              )}

              {isMid && (
                <div
                  style={{
                    position: 'absolute',
                    top: isLow ? 24 : 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '4px 8px',
                    borderRadius: '999px',
                    background: '#8b5cf6',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  MID
                </div>
              )}

              {isHigh && (
                <div
                  style={{
                    position: 'absolute',
                    top: isLow || isMid ? 48 : 0,
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
                  HIGH
                </div>
              )}

              <div
                style={{
                  borderRadius: '14px',
                  border: `3px solid ${isFound ? '#16a34a' : isMid ? '#8b5cf6' : inRange ? '#f59e0b' : '#cbd5e1'}`,
                  background: isFound ? '#dcfce7' : '#ffffff',
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
