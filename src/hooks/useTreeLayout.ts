import { useMemo } from 'react';
import { hierarchy, tree, HierarchyNode, HierarchyLink } from 'd3-hierarchy';
import { TreeNode } from '../types';

interface LayoutNode {
  x: number;
  y: number;
  data: TreeNode;
}

interface LayoutLink {
  source: { x: number; y: number };
  target: { x: number; y: number };
}

interface TreeLayoutResult {
  nodes: LayoutNode[];
  links: LayoutLink[];
}

/**
 * Custom hook to compute tree layout using d3-hierarchy
 * Memoizes the layout computation to avoid recalculation on highlight changes
 */
export function useTreeLayout(
  root: TreeNode | null,
  dimensions: { width: number; height: number }
): TreeLayoutResult {
  return useMemo(() => {
    if (root === null) {
      return { nodes: [], links: [] };
    }

    // Create d3 hierarchy from tree structure
    const d3Root = hierarchy<TreeNode>(root);

    // Create tree layout with configurable size
    const treeLayout = tree<TreeNode>();
    treeLayout.size([dimensions.width, dimensions.height]);

    // Compute the layout
    const layoutRoot = treeLayout(d3Root);

    // Extract nodes with x, y coordinates (d3-hierarchy always sets x, y after layout)
    const nodes: LayoutNode[] = layoutRoot.descendants().map((node: HierarchyNode<TreeNode>) => ({
      x: node.x ?? 0,
      y: node.y ?? 0,
      data: node.data,
    }));

    // Extract links between nodes
    const links: LayoutLink[] = layoutRoot.links().map((link: HierarchyLink<TreeNode>) => ({
      source: { x: link.source.x ?? 0, y: link.source.y ?? 0 },
      target: { x: link.target.x ?? 0, y: link.target.y ?? 0 },
    }));

    return { nodes, links };
  }, [root, dimensions.width, dimensions.height]);
}