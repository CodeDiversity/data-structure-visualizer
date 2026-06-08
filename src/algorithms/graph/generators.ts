import { GraphData, GraphNode, Step } from '../../types';
import { addEdge, addNode, findNodeByValue, getNeighbors } from './graph';

export const GRAPH_LINE_NUMBERS = {
  ADD_NODE: {
    DUPLICATE_CHECK: 2,
    PUSH_NODE: 6,
    RETURN_GRAPH: 7,
  },
  ADD_EDGE: {
    FIND_NODES: 2,
    VALIDATE: 5,
    DUPLICATE_CHECK: 9,
    PUSH_EDGE: 13,
    RETURN_GRAPH: 14,
  },
  SEARCH: {
    INIT_QUEUE: 2,
    LOOP_START: 5,
    FOUND: 7,
    EXPLORE_NEIGHBOR: 11,
    ENQUEUE: 13,
    NOT_FOUND: 19,
  },
  BFS: {
    INIT_QUEUE: 3,
    LOOP_START: 6,
    VISIT: 8,
    EXPLORE_NEIGHBOR: 11,
    ENQUEUE: 13,
    RETURN_ORDER: 19,
  },
  DFS: {
    VISIT: 2,
    EXPLORE_NEIGHBOR: 5,
    RECURSE: 7,
    RETURN_ORDER: 11,
  },
};

function resolveStartNode(graph: GraphData, startValue?: number): GraphNode | undefined {
  return (typeof startValue === 'number' ? findNodeByValue(graph, startValue) : undefined) ?? graph.nodes[0];
}

export function* graphAddNodeGenerator(
  graph: GraphData,
  value: number
): Generator<Step, GraphData, undefined> {
  const existingNode = findNodeByValue(graph, value);

  if (existingNode) {
    yield {
      type: 'compare',
      nodeId: existingNode.id,
      line: GRAPH_LINE_NUMBERS.ADD_NODE.DUPLICATE_CHECK,
      description: `Node ${value} already exists, skipping insert`,
    };
    return graph;
  }

  const nextGraph = addNode(graph, value);
  const newNode = findNodeByValue(nextGraph, value)!;

  yield {
    type: 'insert',
    nodeId: newNode.id,
    line: GRAPH_LINE_NUMBERS.ADD_NODE.PUSH_NODE,
    description: `Adding node ${value} to the graph`,
  };

  yield {
    type: 'move',
    nodeId: newNode.id,
    line: GRAPH_LINE_NUMBERS.ADD_NODE.RETURN_GRAPH,
    description: 'Returning updated graph',
  };

  return nextGraph;
}

export function* graphAddEdgeGenerator(
  graph: GraphData,
  sourceValue: number,
  targetValue: number
): Generator<Step, GraphData, undefined> {
  const sourceNode = findNodeByValue(graph, sourceValue);
  const targetNode = findNodeByValue(graph, targetValue);

  yield {
    type: 'visit',
    nodeId: sourceNode?.id ?? targetNode?.id ?? null,
    line: GRAPH_LINE_NUMBERS.ADD_EDGE.FIND_NODES,
    description: `Finding nodes ${sourceValue} and ${targetValue}`,
  };

  if (!sourceNode || !targetNode || sourceNode.id === targetNode.id) {
    yield {
      type: 'not-found',
      nodeId: sourceNode?.id ?? targetNode?.id ?? null,
      line: GRAPH_LINE_NUMBERS.ADD_EDGE.VALIDATE,
      description: 'Both different endpoint nodes must exist before an edge can be created',
    };
    return graph;
  }

  const duplicateEdge = graph.edges.some(
    (edge) =>
      (edge.source === sourceNode.id && edge.target === targetNode.id) ||
      (edge.source === targetNode.id && edge.target === sourceNode.id)
  );

  if (duplicateEdge) {
    yield {
      type: 'compare',
      nodeId: sourceNode.id,
      line: GRAPH_LINE_NUMBERS.ADD_EDGE.DUPLICATE_CHECK,
      description: `Edge ${sourceValue}-${targetValue} already exists`,
    };
    return graph;
  }

  const nextGraph = addEdge(graph, sourceValue, targetValue);

  yield {
    type: 'insert',
    nodeId: sourceNode.id,
    line: GRAPH_LINE_NUMBERS.ADD_EDGE.PUSH_EDGE,
    description: `Connecting ${sourceValue} to ${targetValue}`,
  };

  yield {
    type: 'move',
    nodeId: targetNode.id,
    line: GRAPH_LINE_NUMBERS.ADD_EDGE.RETURN_GRAPH,
    description: 'Returning updated graph',
  };

  return nextGraph;
}

export function* graphSearchGenerator(
  graph: GraphData,
  targetValue: number,
  startValue?: number
): Generator<Step, boolean, undefined> {
  const startNode = resolveStartNode(graph, startValue);

  if (!startNode) {
    yield {
      type: 'not-found',
      nodeId: null,
      line: GRAPH_LINE_NUMBERS.SEARCH.NOT_FOUND,
      description: 'Graph is empty',
    };
    return false;
  }

  const queue: GraphNode[] = [startNode];
  const visited = new Set<string>([startNode.id]);

  yield {
    type: 'visit',
    nodeId: startNode.id,
    line: GRAPH_LINE_NUMBERS.SEARCH.INIT_QUEUE,
    description: `Starting search at node ${startNode.value}`,
  };

  while (queue.length > 0) {
    const current = queue.shift()!;

    yield {
      type: 'compare',
      nodeId: current.id,
      line: GRAPH_LINE_NUMBERS.SEARCH.LOOP_START,
      description: `Checking node ${current.value}`,
    };

    if (current.value === targetValue) {
      yield {
        type: 'found',
        nodeId: current.id,
        line: GRAPH_LINE_NUMBERS.SEARCH.FOUND,
        description: `Found target node ${targetValue}`,
      };
      return true;
    }

    for (const neighbor of getNeighbors(graph, current.id)) {
      yield {
        type: 'move',
        nodeId: neighbor.id,
        line: GRAPH_LINE_NUMBERS.SEARCH.EXPLORE_NEIGHBOR,
        description: `Exploring neighbor ${neighbor.value}`,
      };

      if (!visited.has(neighbor.id)) {
        visited.add(neighbor.id);
        queue.push(neighbor);
        yield {
          type: 'visit',
          nodeId: neighbor.id,
          line: GRAPH_LINE_NUMBERS.SEARCH.ENQUEUE,
          description: `Queueing node ${neighbor.value}`,
        };
      }
    }
  }

  yield {
    type: 'not-found',
    nodeId: null,
    line: GRAPH_LINE_NUMBERS.SEARCH.NOT_FOUND,
    description: `${targetValue} was not found in the connected component`,
  };

  return false;
}

export function* graphBfsGenerator(
  graph: GraphData,
  startValue?: number
): Generator<Step, number[], undefined> {
  const startNode = resolveStartNode(graph, startValue);

  if (!startNode) {
    yield {
      type: 'not-found',
      nodeId: null,
      line: GRAPH_LINE_NUMBERS.BFS.RETURN_ORDER,
      description: 'Graph is empty',
    };
    return [];
  }

  const order: number[] = [];
  const queue: GraphNode[] = [startNode];
  const visited = new Set<string>([startNode.id]);

  yield {
    type: 'visit',
    nodeId: startNode.id,
    line: GRAPH_LINE_NUMBERS.BFS.INIT_QUEUE,
    description: `Starting BFS at node ${startNode.value}`,
  };

  while (queue.length > 0) {
    const current = queue.shift()!;
    order.push(current.value);

    yield {
      type: 'traverse',
      nodeId: current.id,
      line: GRAPH_LINE_NUMBERS.BFS.VISIT,
      description: `Visiting node ${current.value}`,
    };

    for (const neighbor of getNeighbors(graph, current.id)) {
      yield {
        type: 'move',
        nodeId: neighbor.id,
        line: GRAPH_LINE_NUMBERS.BFS.EXPLORE_NEIGHBOR,
        description: `Inspecting neighbor ${neighbor.value}`,
      };

      if (!visited.has(neighbor.id)) {
        visited.add(neighbor.id);
        queue.push(neighbor);
        yield {
          type: 'visit',
          nodeId: neighbor.id,
          line: GRAPH_LINE_NUMBERS.BFS.ENQUEUE,
          description: `Queueing node ${neighbor.value}`,
        };
      }
    }
  }

  yield {
    type: 'traverse',
    nodeId: startNode.id,
    line: GRAPH_LINE_NUMBERS.BFS.RETURN_ORDER,
    description: `BFS order: [${order.join(', ')}]`,
  };

  return order;
}

export function* graphDfsGenerator(
  graph: GraphData,
  startValue?: number
): Generator<Step, number[], undefined> {
  const startNode = resolveStartNode(graph, startValue);

  if (!startNode) {
    yield {
      type: 'not-found',
      nodeId: null,
      line: GRAPH_LINE_NUMBERS.DFS.RETURN_ORDER,
      description: 'Graph is empty',
    };
    return [];
  }

  const order: number[] = [];
  const visited = new Set<string>();

  function* walk(node: GraphNode): Generator<Step, void, undefined> {
    visited.add(node.id);
    order.push(node.value);

    yield {
      type: 'traverse',
      nodeId: node.id,
      line: GRAPH_LINE_NUMBERS.DFS.VISIT,
      description: `Visiting node ${node.value}`,
    };

    for (const neighbor of getNeighbors(graph, node.id)) {
      yield {
        type: 'move',
        nodeId: neighbor.id,
        line: GRAPH_LINE_NUMBERS.DFS.EXPLORE_NEIGHBOR,
        description: `Inspecting neighbor ${neighbor.value}`,
      };

      if (!visited.has(neighbor.id)) {
        yield {
          type: 'visit',
          nodeId: neighbor.id,
          line: GRAPH_LINE_NUMBERS.DFS.RECURSE,
          description: `Recursing into node ${neighbor.value}`,
        };
        yield* walk(neighbor);
      }
    }
  }

  yield* walk(startNode);

  yield {
    type: 'traverse',
    nodeId: startNode.id,
    line: GRAPH_LINE_NUMBERS.DFS.RETURN_ORDER,
    description: `DFS order: [${order.join(', ')}]`,
  };

  return order;
}
