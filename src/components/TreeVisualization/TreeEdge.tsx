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

  return (
    <line
      x1={source.x}
      y1={source.y}
      x2={target.x}
      y2={target.y}
      stroke="#888888"
      strokeWidth={2}
      strokeLinecap="round"
    />
  );
}