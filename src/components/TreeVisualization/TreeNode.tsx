import { motion } from 'framer-motion';
import { TreeNode as TreeNodeType } from '../../types';

interface TreeNodeProps {
  node: {
    x: number;
    y: number;
    data: TreeNodeType;
  };
  isHighlighted: boolean;
}

/**
 * Renders a single tree node as an SVG circle with value text inside
 * Uses framer-motion for smooth highlight transitions
 */
export default function TreeNode({ node, isHighlighted }: TreeNodeProps) {
  const { x, y, data } = node;
  const label = String(data.value);
  const radius = Math.max(20, Math.min(30, 12 + label.length * 4));
  const fontSize = label.length >= 4 ? 10 : label.length === 3 ? 11 : 12;

  return (
    <motion.g
      initial={false}
      animate={{
        scale: isHighlighted ? 1.2 : 1,
      }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut',
      }}
    >
      {/* Node circle */}
      <motion.circle
        cx={x}
        cy={y}
        r={radius}
        fill={isHighlighted ? 'var(--highlight-yellow)' : 'var(--accent)'}
        stroke={isHighlighted ? 'var(--highlight-orange)' : 'var(--accent)'}
        strokeWidth={2}
        initial={false}
        animate={{
          fill: isHighlighted ? 'var(--highlight-yellow)' : 'var(--accent)',
          stroke: isHighlighted ? 'var(--highlight-orange)' : 'var(--accent)',
        }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
        }}
      />
      {/* Value text */}
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="var(--bg-panel)"
        fontSize={fontSize}
        fontWeight="bold"
        style={{
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        {label}
      </text>
    </motion.g>
  );
}