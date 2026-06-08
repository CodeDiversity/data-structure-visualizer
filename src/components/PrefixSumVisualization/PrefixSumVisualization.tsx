import { CSSProperties } from 'react';
import { PrefixSumData } from '../../types';

interface PrefixSumVisualizationProps {
  data: PrefixSumData;
}

const containerStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '24px',
};

const emptyStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '300px',
  color: '#888',
  fontSize: '16px',
};

function renderCell(
  label: string,
  value: number | string,
  index: number,
  isActive: boolean,
  isQuery: boolean
) {
  const borderColor = isQuery ? '#16a34a' : isActive ? '#2563eb' : '#cbd5e1';
  const background = isQuery ? '#dcfce7' : isActive ? '#dbeafe' : '#ffffff';

  return (
    <div
      key={`${label}-${index}-${value}`}
      style={{
        width: '72px',
        borderRadius: '14px',
        border: `3px solid ${borderColor}`,
        background,
        color: '#0f172a',
        height: '72px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 20px rgba(15, 23, 42, 0.08)',
      }}
    >
      <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>
        {label}[{index}]
      </div>
      <div style={{ fontSize: '22px', fontWeight: 700 }}>{value}</div>
    </div>
  );
}

export default function PrefixSumVisualization({ data }: PrefixSumVisualizationProps) {
  if (data.values.length === 0) {
    return (
      <div style={emptyStyle}>
        <p>Load an array to build prefix sums and answer range queries</p>
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
        <span>Prefix Sum</span>
        <span>
          {data.queryLeft !== null && data.queryRight !== null
            ? `Range [${data.queryLeft}, ${data.queryRight}]`
            : 'Build prefix array first'}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span style={{ color: '#475569', fontSize: '13px', fontWeight: 600 }}>Original Array</span>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {data.values.map((value, index) =>
            renderCell(
              'A',
              value,
              index,
              data.activeIndices.includes(index),
              data.queryLeft !== null &&
                data.queryRight !== null &&
                index >= data.queryLeft &&
                index <= data.queryRight
            )
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span style={{ color: '#475569', fontSize: '13px', fontWeight: 600 }}>Prefix Array</span>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {data.values.map((_, index) =>
            renderCell(
              'P',
              data.prefixValues[index] ?? '-',
              index,
              data.prefixActiveIndices.includes(index),
              data.prefixActiveIndices.includes(index) && data.rangeSum !== null
            )
          )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: '13px' }}>
        <span>Blue: current build/query focus</span>
        <span>Green: indices contributing to the current answer</span>
        <span>Range Sum: {data.rangeSum ?? 'unset'}</span>
      </div>
    </div>
  );
}
