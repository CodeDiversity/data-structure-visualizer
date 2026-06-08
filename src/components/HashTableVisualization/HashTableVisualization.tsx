import { CSSProperties } from 'react';
import { HashTableData } from '../../types';

interface HashTableVisualizationProps {
  data: HashTableData;
}

const emptyStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '300px',
  color: '#888',
  fontSize: '16px',
};

export default function HashTableVisualization({ data }: HashTableVisualizationProps) {
  const hasValues = data.buckets.some((bucket) => bucket.length > 0);

  if (!hasValues) {
    return (
      <div style={emptyStyle}>
        <p>Insert values into the hash table to begin</p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '18px', justifyContent: 'center' }}>
      {data.buckets.map((bucket, bucketIndex) => {
        const isActiveBucket = data.activeBucketIndex === bucketIndex;

        return (
          <div key={`bucket-${bucketIndex}`} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                minWidth: '90px',
                padding: '14px 16px',
                borderRadius: '12px',
                background: isActiveBucket ? '#dbeafe' : '#e2e8f0',
                color: '#0f172a',
                fontWeight: 700,
                textAlign: 'center',
              }}
            >
              {bucketIndex}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {bucket.length === 0 ? (
                <div style={{ color: '#94a3b8', fontStyle: 'italic' }}>empty</div>
              ) : (
                bucket.map((value, entryIndex) => {
                  const isActive =
                    data.activeBucketIndex === bucketIndex && data.activeEntryIndex === entryIndex;
                  const isFound =
                    data.foundBucketIndex === bucketIndex && data.foundEntryIndex === entryIndex;

                  return (
                    <div
                      key={`${bucketIndex}-${entryIndex}-${value}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <div
                        style={{
                          width: '72px',
                          height: '72px',
                          borderRadius: '14px',
                          border: `3px solid ${isFound ? '#16a34a' : isActive ? '#f59e0b' : '#cbd5e1'}`,
                          background: isFound ? '#dcfce7' : isActive ? '#fff7ed' : '#ffffff',
                          color: '#0f172a',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 10px 20px rgba(15, 23, 42, 0.08)',
                        }}
                      >
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{entryIndex}</div>
                        <div style={{ fontSize: '24px', fontWeight: 700 }}>{value}</div>
                      </div>
                      {entryIndex < bucket.length - 1 && <div style={{ color: '#64748b', fontWeight: 700 }}>→</div>}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
