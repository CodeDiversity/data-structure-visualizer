import { CSSProperties } from 'react';
import { QuickSortData, Step } from '../../types';

interface QuickSortVisualizationProps {
  data: QuickSortData;
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

export default function QuickSortVisualization({ data, step }: QuickSortVisualizationProps) {
  if (data.values.length === 0) {
    return (
      <div style={emptyStyle}>
        <p>Load an array to watch quick sort partition and sort it</p>
      </div>
    );
  }

  const rangeLabel =
    data.partitionStart !== null && data.partitionEnd !== null
      ? `[${data.partitionStart}, ${data.partitionEnd}]`
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
        <span>Quick Sort (Lomuto)</span>
        <span>Partition: {rangeLabel}</span>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {data.values.map((value, index) => {
          const isActive = data.activeIndices.includes(index);
          const isSorted = data.sortedIndices.includes(index);
          const isPivot = data.pivotIndex === index;

          let borderColor = 'var(--border)';
          let backgroundColor = 'var(--bg-panel)';

          if (isSorted) {
            borderColor = 'var(--highlight-green)';
            backgroundColor = 'var(--bg-panel)';
          } else if (isPivot) {
            borderColor = 'var(--highlight-orange)';
            backgroundColor = 'var(--bg-panel)';
          } else if (isActive) {
            borderColor = 'var(--accent)';
            backgroundColor = 'var(--highlight-pink)';
          }

          return (
            <div
              key={`${value}-${index}`}
              style={{
                width: '72px',
                borderRadius: '14px',
                border: `3px solid ${borderColor}`,
                background: backgroundColor,
                color: 'var(--text-primary)',
                height: '72px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow)',
              }}
            >
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                {index}
              </div>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{value}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)', fontSize: '13px' }}>
        <span>Blue: currently compared</span>
        <span>Orange: pivot</span>
        <span>Green: in final sorted position</span>
      </div>
    </div>
  );
}