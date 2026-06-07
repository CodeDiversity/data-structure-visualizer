import { useMemo } from 'react';
import { useTreeLayout } from '../../hooks/useTreeLayout';
import { TreeNode as TreeNodeType } from '../../types';
import TreeNode from './TreeNode';
import TreeEdge from './TreeEdge';

interface TreeVisualizationProps {
  root: TreeNodeType | null;
  highlightedNodeId: string | null;
}

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 400;

/**
 * Main tree visualization component
 * Renders SVG with nodes (circles) and edges (lines) using d3-hierarchy layout
 * Shows empty state when no nodes exist
 */
export default function TreeVisualization({
  root,
  highlightedNodeId,
}: TreeVisualizationProps) {
  const dimensions = useMemo(
    () => ({ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT }),
    []
  );

  const { nodes, links } = useTreeLayout(root, dimensions);

  // Empty state
  if (root === null) {
    return (
      <div className="tree-visualization-empty">
        <p>Add your first node to begin</p>
      </div>
    );
  }

  return (
    <div className="tree-visualization">
      <svg
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        style={{
          width: '100%',
          height: 'auto',
          maxHeight: '400px',
        }}
      >
        {/* Render edges first so they appear behind nodes */}
        <g className="tree-edges">
          {links.map((link, index) => (
            <TreeEdge key={`edge-${index}`} link={link} />
          ))}
        </g>

        {/* Render nodes on top */}
        <g className="tree-nodes">
          {nodes.map((node) => (
            <TreeNode
              key={node.data.id}
              node={node}
              isHighlighted={node.data.id === highlightedNodeId}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}