import { CSSProperties } from 'react';
import { MergeSortData, Step } from '../../types';

interface MergeSortVisualizationProps {
  data: MergeSortData;
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

export default function MergeSortVisualization({ data, step }: MergeSortVisualizationProps) {
  if (data.values.length === 0) {
    return (
      <div style={emptyStyle}>
        <p>Load an array to watch merge sort split and merge it</p>
      </div>
    );
  }

  const rangeLabel =
    data.mergeStart !== null && data.mergeEnd !== null
      ? `[${data.mergeStart}, ${data.mergeEnd}]`
      : 'Not started';

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
        <span>Merge Sort</span>
        <span>Active Range: {rangeLabel}</span>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {data.values.map((value, index) => {
          const isActive = data.activeIndices.includes(index);
          const isSorted = data.sortedIndices.includes(index);

          return (
            <div
              key={`${value}-${index}`}
              style={{
                width: '72px',
                borderRadius: '14px',
                border: `3px solid ${isSorted ? 'var(--highlight-green)' : isActive ? 'var(--accent)' : 'var(--border)'}`,
                background: isSorted ? 'var(--bg-panel)' : isActive ? 'var(--highlight-pink)' : 'var(--bg-panel)',
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

      <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)', fontSize: '13px' }}>
        <span>Blue: current split or merge focus</span>
        <span>Green: confirmed sorted segment</span>
      </div>
    </div>
  );
}