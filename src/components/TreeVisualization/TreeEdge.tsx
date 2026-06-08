interface TreeEdgeProps {
  link: {
    source: { x: number; y: number };
    target: { x: number; y: number };
  };
}

/**
 * Renders a single edge/line connecting two tree nodes
 * Uses SVG line element with coordinates from d3 tree layout
 */
export default function TreeEdge({ link }: TreeEdgeProps) {
  const { source, target } = link;
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const distance = Math.hypot(dx, dy);
  const nodeRadius = 24;

  if (distance === 0) {
    return null;
  }

  const offsetX = (dx / distance) * nodeRadius;
  const offsetY = (dy / distance) * nodeRadius;

  return (
    <line
      x1={source.x + offsetX}
      y1={source.y + offsetY}
      x2={target.x - offsetX}
      y2={target.y - offsetY}
      stroke="#888888"
      strokeWidth={2}
      strokeLinecap="round"
    />
  );
}
