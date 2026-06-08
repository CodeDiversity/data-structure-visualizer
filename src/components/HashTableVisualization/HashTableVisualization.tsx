import { CSSProperties } from 'react';
import { HashTableData, Step } from '../../types';

interface HashTableVisualizationProps {
  data: HashTableData;
  step?: Step | null;
}

function getPhaseClass(phase?: string) {
  if (!phase) return '';
  return `phase-${phase}`;
}

const emptyStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '300px',
  color: 'var(--text-secondary)',
  fontSize: '16px',
};

export default function HashTableVisualization({ data, step }: HashTableVisualizationProps) {
  const hasValues = data.buckets.some((bucket) => bucket.length > 0);

  if (!hasValues) {
    return (
      <div style={emptyStyle}>
        <p>Insert values into the hash table to begin</p>
      </div>
    );
  }

  return (
    <div
      className={`spring-transition ${getPhaseClass(step?.phase)}`}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '18px', justifyContent: 'center' }}
    >
      {data.buckets.map((bucket, bucketIndex) => {
        const isActiveBucket = data.activeBucketIndex === bucketIndex;

        return (
          <div key={`bucket-${bucketIndex}`} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                minWidth: '90px',
                padding: '14px 16px',
                borderRadius: '12px',
                background: isActiveBucket ? 'var(--highlight-pink)' : 'var(--border)',
                color: 'var(--text-primary)',
                fontWeight: 700,
                textAlign: 'center',
              }}
            >
              {bucketIndex}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {bucket.length === 0 ? (
                <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>empty</div>
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
                          border: `3px solid ${isFound ? 'var(--highlight-green)' : isActive ? 'var(--highlight-yellow)' : 'var(--border)'}`,
                          background: isFound ? 'var(--bg-panel)' : isActive ? 'var(--bg-panel)' : 'var(--bg-panel)',
                          color: 'var(--text-primary)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: 'var(--shadow)',
                        }}
                      >
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{entryIndex}</div>
                        <div style={{ fontSize: '24px', fontWeight: 700 }}>{value}</div>
                      </div>
                      {entryIndex < bucket.length - 1 && <div style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>→</div>}
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