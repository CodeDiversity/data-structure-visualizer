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

    console.debug('[BST] Recomputing layout', {
      rootId: root.id,
      rootValue: root.value,
    });

    // Map BST left/right pointers into the child list d3-hierarchy expects.
    const d3Root = hierarchy<TreeNode>(root, (node) => {
      const children = [node.left, node.right].filter(
        (child): child is TreeNode => child !== null
      );
      return children.length > 0 ? children : undefined;
    });

    // Use padded bounds so sibling nodes are not pushed all the way to the edges.
    const horizontalPadding = 80;
    const topPadding = 50;
    const bottomPadding = 30;

    const treeLayout = tree<TreeNode>();
    treeLayout.size([
      dimensions.width - horizontalPadding * 2,
      dimensions.height - topPadding - bottomPadding,
    ]);

    // Compute the layout
    const layoutRoot = treeLayout(d3Root);

    // Extract nodes with x, y coordinates (d3-hierarchy always sets x, y after layout)
    // Offset y by50px padding so root isn't cut off at top
    const nodes: LayoutNode[] = layoutRoot.descendants().map((node: HierarchyNode<TreeNode>) => ({
      x: (node.x ?? 0) + horizontalPadding,
      y: (node.y ?? 0) + topPadding,
      data: node.data,
    }));

    // Extract links between nodes
    const links: LayoutLink[] = layoutRoot.links().map((link: HierarchyLink<TreeNode>) => ({
      source: {
        x: (link.source.x ?? 0) + horizontalPadding,
        y: (link.source.y ?? 0) + topPadding,
      },
      target: {
        x: (link.target.x ?? 0) + horizontalPadding,
        y: (link.target.y ?? 0) + topPadding,
      },
    }));

    console.debug('[BST] Layout computed', {
      nodeCount: nodes.length,
      linkCount: links.length,
    });

    return { nodes, links };
  }, [root, dimensions.width, dimensions.height]);
}
