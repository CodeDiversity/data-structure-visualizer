import { GraphData, GraphEdge, GraphNode } from '../../types';
import { generateNodeId } from '../bst/bst';

function createGraphNode(value: number): GraphNode {
  return {
    id: generateNodeId(),
    value,
  };
}

function createGraphEdge(source: string, target: string): GraphEdge {
  return {
    id: `edge_${source}_${target}`,
    source,
    target,
  };
}

export function cloneGraph(graph: GraphData): GraphData {
  return {
    nodes: graph.nodes.map((node) => ({ ...node })),
    edges: graph.edges.map((edge) => ({ ...edge })),
  };
}

export function findNodeByValue(graph: GraphData, value: number): GraphNode | undefined {
  return graph.nodes.find((node) => node.value === value);
}

export function addNode(graph: GraphData, value: number): GraphData {
  if (findNodeByValue(graph, value)) {
    return cloneGraph(graph);
  }

  return {
    nodes: [...graph.nodes.map((node) => ({ ...node })), createGraphNode(value)],
    edges: graph.edges.map((edge) => ({ ...edge })),
  };
}

export function addEdge(graph: GraphData, sourceValue: number, targetValue: number): GraphData {
  const sourceNode = findNodeByValue(graph, sourceValue);
  const targetNode = findNodeByValue(graph, targetValue);

  if (!sourceNode || !targetNode || sourceNode.id === targetNode.id) {
    return cloneGraph(graph);
  }

  const edgeExists = graph.edges.some(
    (edge) =>
      (edge.source === sourceNode.id && edge.target === targetNode.id) ||
      (edge.source === targetNode.id && edge.target === sourceNode.id)
  );

  if (edgeExists) {
    return cloneGraph(graph);
  }

  return {
    nodes: graph.nodes.map((node) => ({ ...node })),
    edges: [
      ...graph.edges.map((edge) => ({ ...edge })),
      createGraphEdge(sourceNode.id, targetNode.id),
    ],
  };
}

export function getNeighbors(graph: GraphData, nodeId: string): GraphNode[] {
  const neighborIds = graph.edges.flatMap((edge) => {
    if (edge.source === nodeId) {
      return [edge.target];
    }
    if (edge.target === nodeId) {
      return [edge.source];
    }
    return [];
  });

  return neighborIds
    .map((neighborId) => graph.nodes.find((node) => node.id === neighborId))
    .filter((node): node is GraphNode => Boolean(node))
    .sort((a, b) => a.value - b.value);
}

export function searchGraph(graph: GraphData, targetValue: number, startValue?: number): boolean {
  const startNode =
    (typeof startValue === 'number' ? findNodeByValue(graph, startValue) : undefined) ?? graph.nodes[0];

  if (!startNode) {
    return false;
  }

  const queue: GraphNode[] = [startNode];
  const visited = new Set<string>([startNode.id]);

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.value === targetValue) {
      return true;
    }

    for (const neighbor of getNeighbors(graph, current.id)) {
      if (!visited.has(neighbor.id)) {
        visited.add(neighbor.id);
        queue.push(neighbor);
      }
    }
  }

  return false;
}

export function bfs(graph: GraphData, startValue?: number): number[] {
  const startNode =
    (typeof startValue === 'number' ? findNodeByValue(graph, startValue) : undefined) ?? graph.nodes[0];

  if (!startNode) {
    return [];
  }

  const order: number[] = [];
  const queue: GraphNode[] = [startNode];
  const visited = new Set<string>([startNode.id]);

  while (queue.length > 0) {
    const current = queue.shift()!;
    order.push(current.value);

    for (const neighbor of getNeighbors(graph, current.id)) {
      if (!visited.has(neighbor.id)) {
        visited.add(neighbor.id);
        queue.push(neighbor);
      }
    }
  }

  return order;
}

export function dfs(graph: GraphData, startValue?: number): number[] {
  const startNode =
    (typeof startValue === 'number' ? findNodeByValue(graph, startValue) : undefined) ?? graph.nodes[0];

  if (!startNode) {
    return [];
  }

  const order: number[] = [];
  const visited = new Set<string>();

  const walk = (node: GraphNode) => {
    visited.add(node.id);
    order.push(node.value);

    for (const neighbor of getNeighbors(graph, node.id)) {
      if (!visited.has(neighbor.id)) {
        walk(neighbor);
      }
    }
  };

  walk(startNode);
  return order;
}

export function buildRandomGraph(): GraphData {
  const values = Array.from({ length: 6 }, () => Math.floor(Math.random() * 90) + 10);
  const uniqueValues = Array.from(new Set(values));
  let graph: GraphData = { nodes: [], edges: [] };

  uniqueValues.forEach((value) => {
    graph = addNode(graph, value);
  });

  for (let index = 0; index < graph.nodes.length - 1; index += 1) {
    graph = addEdge(graph, graph.nodes[index].value, graph.nodes[index + 1].value);
  }

  if (graph.nodes.length >= 4) {
    graph = addEdge(graph, graph.nodes[0].value, graph.nodes[3].value);
  }

  if (graph.nodes.length >= 5) {
    graph = addEdge(graph, graph.nodes[1].value, graph.nodes[4].value);
  }

  return graph;
}
