import { CSSProperties, useMemo } from 'react';
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

const containerStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const emptyStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '300px',
  color: '#888',
  fontSize: '16px',
};

export default function TreeVisualization({
  root,
  highlightedNodeId,
}: TreeVisualizationProps) {
  const dimensions = useMemo(
    () => ({ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT }),
    []
  );

  const { nodes, links } = useTreeLayout(root, dimensions);

  if (root === null) {
    return (
      <div style={emptyStyle}>
        <p>Add your first node to begin</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <svg
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        style={{
          width: '100%',
          height: 'auto',
          maxHeight: '400px',
        }}
      >
        <g className="tree-edges">
          {links.map((link, index) => (
            <TreeEdge key={`edge-${index}`} link={link} />
          ))}
        </g>

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
