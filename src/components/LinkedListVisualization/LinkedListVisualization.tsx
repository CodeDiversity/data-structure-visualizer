import { CSSProperties } from 'react';
import { LinkedListNode } from '../../types';

interface LinkedListVisualizationProps {
  head: LinkedListNode | null;
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

const NODE_WIDTH = 84;
const NODE_HEIGHT = 48;
const NODE_GAP = 48;
const START_X = 32;
const START_Y = 110;

export default function LinkedListVisualization({
  head,
  highlightedNodeId,
}: LinkedListVisualizationProps) {
  if (head === null) {
    return (
      <div style={emptyStyle}>
        <p>Append your first node to begin</p>
      </div>
    );
  }

  const nodes: LinkedListNode[] = [];
  let current: LinkedListNode | null = head;

  while (current !== null) {
    nodes.push(current);
    current = current.next;
  }

  const width = Math.max(600, START_X * 2 + nodes.length * NODE_WIDTH + (nodes.length - 1) * NODE_GAP);
  const height = 240;

  return (
    <div style={{ ...containerStyle, overflowX: 'auto', justifyContent: 'flex-start' }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{
          width: '100%',
          height: 'auto',
          minWidth: '100%',
          maxHeight: '320px',
        }}
      >
        <defs>
          <marker
            id="list-arrow"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="#6c63ff" />
          </marker>
        </defs>

        <text x={START_X} y={54} fill="#334155" fontSize="16" fontWeight="600">
          Head
        </text>
        <line
          x1={START_X + 10}
          y1={62}
          x2={START_X + 10}
          y2={START_Y - 8}
          stroke="#94a3b8"
          strokeWidth="3"
          strokeDasharray="6 6"
        />

        {nodes.map((node, index) => {
          const x = START_X + index * (NODE_WIDTH + NODE_GAP);
          const isHighlighted = node.id === highlightedNodeId;
          const nextX = x + NODE_WIDTH + NODE_GAP;

          return (
            <g key={node.id}>
              <rect
                x={x}
                y={START_Y}
                width={NODE_WIDTH}
                height={NODE_HEIGHT}
                rx="12"
                fill={isHighlighted ? '#f59e0b' : '#2563eb'}
                stroke={isHighlighted ? '#b45309' : '#1d4ed8'}
                strokeWidth="3"
              />
              <text
                x={x + NODE_WIDTH / 2}
                y={START_Y + NODE_HEIGHT / 2 + 6}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="18"
                fontWeight="700"
              >
                {node.value}
              </text>

              {node.next !== null ? (
                <>
                  <line
                    x1={x + NODE_WIDTH}
                    y1={START_Y + NODE_HEIGHT / 2}
                    x2={nextX - 10}
                    y2={START_Y + NODE_HEIGHT / 2}
                    stroke="#6c63ff"
                    strokeWidth="4"
                    markerEnd="url(#list-arrow)"
                  />
                  <text
                    x={x + NODE_WIDTH + NODE_GAP / 2}
                    y={START_Y + NODE_HEIGHT / 2 - 16}
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="12"
                    fontWeight="600"
                  >
                    next
                  </text>
                </>
              ) : (
                <text
                  x={x + NODE_WIDTH + 18}
                  y={START_Y + NODE_HEIGHT / 2 + 5}
                  fill="#64748b"
                  fontSize="14"
                  fontWeight="600"
                >
                  null
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
