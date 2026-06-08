import { CSSProperties } from 'react';
import { QuickSortData } from '../../types';

interface QuickSortVisualizationProps {
  data: QuickSortData;
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

export default function QuickSortVisualization({ data }: QuickSortVisualizationProps) {
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
        <span>Quick Sort (Lomuto)</span>
        <span>Partition: {rangeLabel}</span>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {data.values.map((value, index) => {
          const isActive = data.activeIndices.includes(index);
          const isSorted = data.sortedIndices.includes(index);
          const isPivot = data.pivotIndex === index;

          let borderColor = '#cbd5e1';
          let backgroundColor = '#ffffff';

          if (isSorted) {
            borderColor = '#16a34a';
            backgroundColor = '#dcfce7';
          } else if (isPivot) {
            borderColor = '#ea580c';
            backgroundColor = '#fff7ed';
          } else if (isActive) {
            borderColor = '#2563eb';
            backgroundColor = '#dbeafe';
          }

          return (
            <div
              key={`${value}-${index}`}
              style={{
                width: '72px',
                borderRadius: '14px',
                border: `3px solid ${borderColor}`,
                background: backgroundColor,
                color: '#0f172a',
                height: '72px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 20px rgba(15, 23, 42, 0.08)',
              }}
            >
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                {index}
              </div>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{value}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '16px', color: '#475569', fontSize: '13px' }}>
        <span>Blue: currently compared</span>
        <span>Orange: pivot</span>
        <span>Green: in final sorted position</span>
      </div>
    </div>
  );
}