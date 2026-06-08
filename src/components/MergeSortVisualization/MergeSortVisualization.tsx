import { CSSProperties } from 'react';
import { MergeSortData } from '../../types';

interface MergeSortVisualizationProps {
  data: MergeSortData;
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

export default function MergeSortVisualization({ data }: MergeSortVisualizationProps) {
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
                border: `3px solid ${isSorted ? '#16a34a' : isActive ? '#2563eb' : '#cbd5e1'}`,
                background: isSorted ? '#dcfce7' : isActive ? '#dbeafe' : '#ffffff',
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

      <div style={{ display: 'flex', gap: '16px', color: '#475569', fontSize: '13px' }}>
        <span>Blue: current split or merge focus</span>
        <span>Green: confirmed sorted segment</span>
      </div>
    </div>
  );
}
