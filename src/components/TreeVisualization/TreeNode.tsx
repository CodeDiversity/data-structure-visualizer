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
  const radius = 20;

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
        fill={isHighlighted ? '#ff6b6b' : '#4dabf7'}
        stroke={isHighlighted ? '#c92a2a' : '#1c7ed6'}
        strokeWidth={2}
        initial={false}
        animate={{
          fill: isHighlighted ? '#ff6b6b' : '#4dabf7',
          stroke: isHighlighted ? '#c92a2a' : '#1c7ed6',
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
        dominantBaseline="central"
        fill="white"
        fontSize={12}
        fontWeight="bold"
        style={{
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        {data.value}
      </text>
    </motion.g>
  );
}