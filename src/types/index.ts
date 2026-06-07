/**
 * Type definitions for Binary Search Tree data structure and visualization
 */

/**
 * Represents a node in the Binary Search Tree
 */
export interface TreeNode {
  id: string;
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

/**
 * Represents a single step in the BST algorithm visualization
 */
export interface Step {
  type: 'visit' | 'compare' | 'move' | 'found' | 'not-found' | 'delete' | 'insert' | 'traverse';
  nodeId: string | null;
  line: number;
  description?: string;
}

/**
 * Interface defining the BST operations
 */
export interface BSTOperations {
  insert: (root: TreeNode | null, value: number) => TreeNode;
  delete: (root: TreeNode | null, value: number) => TreeNode;
  search: (root: TreeNode | null, value: number) => boolean;
  inorder: (root: TreeNode | null) => number[];
}