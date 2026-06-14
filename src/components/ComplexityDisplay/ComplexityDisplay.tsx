export interface ComplexityEntry {
  time: string;
  space: string;
}

interface ComplexityDisplayProps {
  complexity?: ComplexityEntry;
}

/**
 * Small label that renders an algorithm's time and space complexity.
 * Returns null when `complexity` is undefined so it never leaves an
 * empty strip in the layout.
 */
export default function ComplexityDisplay({ complexity }: ComplexityDisplayProps) {
  if (!complexity) {
    return null;
  }

  return (
    <div
      style={{
        color: 'var(--text-secondary)',
        fontSize: '14px',
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        margin: '0 0 16px 0',
      }}
    >
      Time: {complexity.time}  |  Space: {complexity.space}
    </div>
  );
}
