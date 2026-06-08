/**
 * Source code strings for BST operations
 * These strings are displayed in the CodePanel component
 * Line numbers correspond to LINE_NUMBERS in generators.ts
 */

/**
 * Insert operation source code
 * Line 1: function insert(root, value)
 * Line 2: if (root === null)
 * Line 3: if (value < root.value)
 * Line 4: return root
 */
export const INSERT_CODE = `function insert(root, value) {
  if (root === null) {
    return createNode(value);
  }

  if (value < root.value) {
    root.left = insert(root.left, value);
  } else if (value > root.value) {
    root.right = insert(root.right, value);
  }

  return root;
}`;

/**
 * Delete operation source code
 * Line 1: function deleteNode(root, value)
 * Line 2: if (root === null)
 * Line 3: if (value < root.value)
 * Line 4: Found the node to delete
 * Line 5: Case 1 - leaf node
 * Line 6: Case 2 - one child
 * Line 7: Case 3 - two children
 * Line 8: return root
 */
export const DELETE_CODE = `function deleteNode(root, value) {
  if (root === null) {
    return null;
  }

  if (value < root.value) {
    root.left = deleteNode(root.left, value);
  } else if (value > root.value) {
    root.right = deleteNode(root.right, value);
  } else {
    if (root.left === null && root.right === null) {
      return null;
    }
    if (root.left === null) return root.right;
    if (root.right === null) return root.left;
    const successor = findMin(root.right);
    root.value = successor.value;
    root.right = deleteNode(root.right, successor.value);
  }

  return root;
}`;

/**
 * Search operation source code
 * Line 1: function search(root, value)
 * Line 2: if (root === null)
 * Line 3: if (value === root.value)
 * Line 4: if (value < root.value)
 * Line 5: return result
 */
export const SEARCH_CODE = `function search(root, value) {
  if (root === null) {
    return false;
  }

  if (value === root.value) {
    return true;
  }

  if (value < root.value) {
    return search(root.left, value);
  } else {
    return search(root.right, value);
  }
}`;

/**
 * Inorder traversal source code
 * Line 1: if (node === null)
 * Line 2: traverse(node.left)
 * Line 3: result.push(node.value)
 * Line 4: traverse(node.right)
 * Line 5: return result
 */
export const INORDER_CODE = `function inorder(node) {
  if (node === null) {
    return;
  }

  inorder(node.left);

  result.push(node.value);

  inorder(node.right);
}`;

export const BFS_CODE = `function bfs(root) {
  if (root === null) {
    return [];
  }

  const queue = [root];
  const result = [];

  while (queue.length > 0) {
    const current = queue.shift();
    result.push(current.value);

    if (current.left !== null) {
      queue.push(current.left);
    }

    if (current.right !== null) {
      queue.push(current.right);
    }
  }

  return result;
}`;
