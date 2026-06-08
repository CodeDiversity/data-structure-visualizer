import { CSSProperties } from 'react';
import { BinarySearchData, Step } from '../../types';

interface BinarySearchVisualizationProps {
  data: BinarySearchData;
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

export default function BinarySearchVisualization({ data, step }: BinarySearchVisualizationProps) {
  if (data.values.length === 0) {
    return (
      <div style={emptyStyle}>
        <p>Load a sorted array and target to begin</p>
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
                    background: 'var(--accent)',
                    color: 'var(--bg-panel)',
                    fontSize: '11px',
                    fontWeight: 700,
                    textAlign: 'center',
                    minWidth: '52px',
                  }}
                >
                  LOW: {data.values[index]}
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
                    background: 'var(--highlight-pink)',
                    color: 'var(--bg-panel)',
                    fontSize: '11px',
                    fontWeight: 700,
                    textAlign: 'center',
                    minWidth: '52px',
                  }}
                >
                  MID: {data.values[index]}
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
                    background: 'var(--highlight-orange)',
                    color: 'var(--bg-panel)',
                    fontSize: '11px',
                    fontWeight: 700,
                    textAlign: 'center',
                    minWidth: '52px',
                  }}
                >
                  HIGH: {data.values[index]}
                </div>
              )}

              <div
                style={{
                  borderRadius: '14px',
                  border: `3px solid ${isFound ? 'var(--highlight-green)' : isMid ? 'var(--highlight-pink)' : inRange ? 'var(--highlight-yellow)' : 'var(--border)'}`,
                  background: isFound ? '#dcfce7' : 'var(--bg-panel)',
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
            </div>
          );
        })}
      </div>
    </div>
  );
}