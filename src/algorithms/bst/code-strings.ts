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
export const INSERT_CODE = `// Line 1: function insert(root, value)
function insert(root, value) {
  // Line 2: if (root === null)
  if (root === null) {
    return createNode(value);
  }

  // Line 3: if (value < root.value)
  if (value < root.value) {
    root.left = insert(root.left, value);
  } else if (value > root.value) {
    root.right = insert(root.right, value);
  } else {
    // Duplicate - don't insert
  }

  // Line 4: return root
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
export const DELETE_CODE = `// Line 1: function deleteNode(root, value)
function deleteNode(root, value) {
  // Line 2: if (root === null)
  if (root === null) {
    return null;
  }

  // Line 3: if (value < root.value)
  if (value < root.value) {
    root.left = deleteNode(root.left, value);
  } else if (value > root.value) {
    root.right = deleteNode(root.right, value);
  } else {
    // Line 4: Found the node to delete
    // Line 5: Case 1 - leaf node
    if (root.left === null && root.right === null) {
      return null;
    }
    // Line 6: Case 2 - one child
    if (root.left === null) return root.right;
    if (root.right === null) return root.left;
    // Line 7: Case 3 - two children
    const successor = findMin(root.right);
    root.value = successor.value;
    root.right = deleteNode(root.right, successor.value);
  }

  // Line 8: return root
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
export const SEARCH_CODE = `// Line 1: function search(root, value)
function search(root, value) {
  // Line 2: if (root === null)
  if (root === null) {
    return false;
  }

  // Line 3: if (value === root.value)
  if (value === root.value) {
    return true;
  }

  // Line 4: if (value < root.value)
  if (value < root.value) {
    return search(root.left, value);
  } else {
    return search(root.right, value);
  }
  // Line 5: return result (implicit)
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
  // Line 1: if (node === null)
  if (node === null) {
    return;
  }

  // Line 2: traverse(node.left)
  inorder(node.left);

  // Line 3: result.push(node.value)
  result.push(node.value);

  // Line 4: traverse(node.right)
  inorder(node.right);

  // Line 5: return result
}`;