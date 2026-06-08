export const GRAPH_ADD_NODE_CODE = `function addNode(graph, value) {
  if (graph.nodes.some((node) => node.value === value)) {
    return graph;
  }

  graph.nodes.push(createNode(value));
  return graph;
}`;

export const GRAPH_ADD_EDGE_CODE = `function addEdge(graph, sourceValue, targetValue) {
  const source = findNode(graph, sourceValue);
  const target = findNode(graph, targetValue);

  if (!source || !target || source.id === target.id) {
    return graph;
  }

  if (edgeExists(graph, source.id, target.id)) {
    return graph;
  }

  graph.edges.push({ source: source.id, target: target.id });
  return graph;
}`;

export const GRAPH_SEARCH_CODE = `function search(graph, startNode, targetValue) {
  const queue = [startNode];
  const visited = new Set([startNode.id]);

  while (queue.length > 0) {
    const current = queue.shift();
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
}`;

export const GRAPH_BFS_CODE = `function bfs(graph, startNode) {
  const order = [];
  const queue = [startNode];
  const visited = new Set([startNode.id]);

  while (queue.length > 0) {
    const current = queue.shift();
    order.push(current.value);

    for (const neighbor of getNeighbors(graph, current.id)) {
      if (!visited.has(neighbor.id)) {
        visited.add(neighbor.id);
        queue.push(neighbor);
      }
    }
  }

  return order;
}`;

export const GRAPH_DFS_CODE = `function dfs(graph, node, visited = new Set()) {
  visited.add(node.id);
  order.push(node.value);

  for (const neighbor of getNeighbors(graph, node.id)) {
    if (!visited.has(neighbor.id)) {
      dfs(graph, neighbor, visited);
    }
  }

  return order;
}`;
