import { CSSProperties } from 'react';
import { GraphData } from '../../types';

interface GraphVisualizationProps {
  graph: GraphData;
  highlightedNodeId: string | null;
}

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

const width = 680;
const height = 420;
const centerX = width / 2;
const centerY = height / 2;
const radius = 130;

export default function GraphVisualization({ graph, highlightedNodeId }: GraphVisualizationProps) {
  if (graph.nodes.length === 0) {
    return (
      <div style={emptyStyle}>
        <p>Add a node to start building a graph</p>
      </div>
    );
  }

  const positionedNodes = graph.nodes.map((node, index) => {
    const angle = (index / graph.nodes.length) * Math.PI * 2 - Math.PI / 2;

    return {
      ...node,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  const nodeMap = new Map(positionedNodes.map((node) => [node.id, node]));

  return (
    <div style={containerStyle}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{
          width: '100%',
          height: 'auto',
          maxHeight: '420px',
        }}
      >
        {graph.edges.map((edge) => {
          const source = nodeMap.get(edge.source);
          const target = nodeMap.get(edge.target);

          if (!source || !target) {
            return null;
          }

          return (
            <line
              key={edge.id}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke="#94a3b8"
              strokeWidth="4"
              opacity="0.9"
            />
          );
        })}

        {positionedNodes.map((node) => {
          const isHighlighted = node.id === highlightedNodeId;

          return (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r="28"
                fill={isHighlighted ? '#f59e0b' : '#0ea5e9'}
                stroke={isHighlighted ? '#b45309' : '#0369a1'}
                strokeWidth="4"
              />
              <text
                x={node.x}
                y={node.y + 6}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="16"
                fontWeight="700"
              >
                {node.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
