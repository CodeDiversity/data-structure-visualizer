/**
 * Binary Search Tree implementation
 * Provides core operations: insert, delete, search, inorder traversal
 */

import { TreeNode } from '../../types';

/**
 * Generates a unique ID for tree nodes
 */
let nodeIdCounter = 0;
export function generateNodeId(): string {
  return `node_${++nodeIdCounter}`;
}

/**
 * Resets the node ID counter (useful for testing)
 */
export function resetNodeIdCounter(): void {
  nodeIdCounter = 0;
}

/**
 * Creates a new tree node with the given value
 */
function createNode(value: number): TreeNode {
  return {
    id: generateNodeId(),
    value,
    left: null,
    right: null,
  };
}

/**
 * Inserts a value into the BST
 * @param root - The root of the tree (can be null for empty tree)
 * @param value - The value to insert
 * @returns The updated root of the tree
 */
export function insert(root: TreeNode | null, value: number): TreeNode {
  if (root === null) {
    return createNode(value);
  }

  if (value < root.value) {
    root.left = insert(root.left, value);
  } else if (value > root.value) {
    root.right = insert(root.right, value);
  }
  // If value === root.value, we don't insert (no duplicates)

  return root;
}

/**
 * Finds the minimum value node in a subtree
 * @param node - The root of the subtree
 * @returns The node with the minimum value
 */
function findMin(node: TreeNode): TreeNode {
  while (node.left !== null) {
    node = node.left;
  }
  return node;
}

/**
 * Deletes a value from the BST
 * @param root - The root of the tree
 * @param value - The value to delete
 * @returns The updated root of the tree
 */
export function deleteNode(root: TreeNode | null, value: number): TreeNode | null {
  if (root === null) {
    return null;
  }

  if (value < root.value) {
    root.left = deleteNode(root.left, value);
  } else if (value > root.value) {
    root.right = deleteNode(root.right, value);
  } else {
    // Found the node to delete

    // Case 1: No children (leaf node)
    if (root.left === null && root.right === null) {
      return null;
    }

    // Case 2: One child
    if (root.left === null) {
      return root.right;
    }
    if (root.right === null) {
      return root.left;
    }

    // Case 3: Two children
    // Find the in-order successor (smallest in right subtree)
    const successor = findMin(root.right);
    root.value = successor.value;
    root.right = deleteNode(root.right, successor.value);
  }

  return root;
}

/**
 * Searches for a value in the BST
 * @param root - The root of the tree
 * @param value - The value to search for
 * @returns True if the value exists, false otherwise
 */
export function search(root: TreeNode | null, value: number): boolean {
  if (root === null) {
    return false;
  }

  if (value === root.value) {
    return true;
  }

  if (value < root.value) {
    return search(root.left, value);
  }

  return search(root.right, value);
}

/**
 * Performs in-order traversal of the BST
 * @param root - The root of the tree
 * @returns Array of values in sorted order
 */
export function inorder(root: TreeNode | null): number[] {
  const result: number[] = [];

  function traverse(node: TreeNode | null): void {
    if (node === null) {
      return;
    }

    traverse(node.left);
    result.push(node.value);
    traverse(node.right);
  }

  traverse(root);
  return result;
}