/**
 * Generator functions for BST visualization
 * Each function yields Step objects for step-by-step visualization
 */

import { TreeNode, Step } from '../../types';

/**
 * Line numbers reference for code highlighting
 * These correspond to the line numbers in code-strings.ts
 */
export const LINE_NUMBERS = {
  INSERT: {
    FUNCTION_START: 1,
    BASE_CASE: 2,
    RECURSIVE_INSERT: 3,
    RETURN_ROOT: 4,
  },
  DELETE: {
    FUNCTION_START: 1,
    BASE_CASE: 2,
    RECURSIVE_DELETE: 3,
    FOUND_NODE: 4,
    CASE_1: 5,
    CASE_2: 6,
    CASE_3: 7,
    RETURN_ROOT: 8,
  },
  SEARCH: {
    FUNCTION_START: 1,
    BASE_CASE: 2,
    COMPARE: 3,
    RECURSIVE_SEARCH: 4,
    RETURN_RESULT: 5,
  },
  INORDER: {
    FUNCTION_START: 1,
    TRAVERSE_LEFT: 2,
    VISIT_NODE: 3,
    TRAVERSE_RIGHT: 4,
    RETURN_RESULT: 5,
  },
};

/**
 * Generator for BST insert operation with step-by-step visualization
 */
export function* bstInsertGenerator(root: TreeNode | null, value: number): Generator<Step, TreeNode, undefined> {
  // Line 1: function insert(root, value)
  // Line 2: if (root === null)
  if (root === null) {
    yield {
      type: 'insert',
      nodeId: null,
      line: LINE_NUMBERS.INSERT.BASE_CASE,
      description: `Creating new node with value ${value}`,
    };
    const newNode: TreeNode = {
      id: `node_temp_${Date.now()}`,
      value,
      left: null,
      right: null,
    };
    return newNode;
  }

  yield {
    type: 'visit',
    nodeId: root.id,
    line: LINE_NUMBERS.INSERT.FUNCTION_START,
    description: `Visiting node with value ${root.value}`,
  };

  // Line 3: if (value < root.value)
  if (value < root.value) {
    yield {
      type: 'compare',
      nodeId: root.id,
      line: LINE_NUMBERS.INSERT.RECURSIVE_INSERT,
      description: `${value} < ${root.value}, going left`,
    };

    const updatedLeft = yield* bstInsertGenerator(root.left, value);
    root.left = updatedLeft;
  } else if (value > root.value) {
    yield {
      type: 'compare',
      nodeId: root.id,
      line: LINE_NUMBERS.INSERT.RECURSIVE_INSERT,
      description: `${value} > ${root.value}, going right`,
    };

    const updatedRight = yield* bstInsertGenerator(root.right, value);
    root.right = updatedRight;
  } else {
    yield {
      type: 'compare',
      nodeId: root.id,
      line: LINE_NUMBERS.INSERT.RECURSIVE_INSERT,
      description: `${value} === ${root.value}, duplicate, not inserting`,
    };
  }

  // Line 4: return root
  yield {
    type: 'move',
    nodeId: root.id,
    line: LINE_NUMBERS.INSERT.RETURN_ROOT,
    description: `Returning node ${root.value}`,
  };

  return root;
}

/**
 * Generator for BST delete operation with step-by-step visualization
 */
export function* bstDeleteGenerator(root: TreeNode | null, value: number): Generator<Step, TreeNode | null, undefined> {
  // Line 1: function deleteNode(root, value)
  if (root === null) {
    yield {
      type: 'not-found',
      nodeId: null,
      line: LINE_NUMBERS.DELETE.BASE_CASE,
      description: `Value ${value} not found in tree`,
    };
    return null;
  }

  yield {
    type: 'visit',
    nodeId: root.id,
    line: LINE_NUMBERS.DELETE.FUNCTION_START,
    description: `Visiting node with value ${root.value}`,
  };

  // Line 3: if (value < root.value)
  if (value < root.value) {
    yield {
      type: 'compare',
      nodeId: root.id,
      line: LINE_NUMBERS.DELETE.RECURSIVE_DELETE,
      description: `${value} < ${root.value}, searching left subtree`,
    };

    const updatedLeft = yield* bstDeleteGenerator(root.left, value);
    root.left = updatedLeft;
  } else if (value > root.value) {
    yield {
      type: 'compare',
      nodeId: root.id,
      line: LINE_NUMBERS.DELETE.RECURSIVE_DELETE,
      description: `${value} > ${root.value}, searching right subtree`,
    };

    const updatedRight = yield* bstDeleteGenerator(root.right, value);
    root.right = updatedRight;
  } else {
    // Line 4: Found the node to delete
    yield {
      type: 'delete',
      nodeId: root.id,
      line: LINE_NUMBERS.DELETE.FOUND_NODE,
      description: `Found node to delete with value ${value}`,
    };

    // Case 1: No children (leaf node)
    if (root.left === null && root.right === null) {
      yield {
        type: 'delete',
        nodeId: root.id,
        line: LINE_NUMBERS.DELETE.CASE_1,
        description: `Node ${value} is a leaf, removing it`,
      };
      return null;
    }

    // Case 2: One child
    if (root.left === null) {
      yield {
        type: 'delete',
        nodeId: root.id,
        line: LINE_NUMBERS.DELETE.CASE_2,
        description: `Node ${value} has only right child, replacing with right child`,
      };
      return root.right;
    }
    if (root.right === null) {
      yield {
        type: 'delete',
        nodeId: root.id,
        line: LINE_NUMBERS.DELETE.CASE_2,
        description: `Node ${value} has only left child, replacing with left child`,
      };
      return root.left;
    }

    // Case 3: Two children
    yield {
      type: 'delete',
      nodeId: root.id,
      line: LINE_NUMBERS.DELETE.CASE_3,
      description: `Node ${value} has two children, finding in-order successor`,
    };
  }

  // Line 8: return root
  yield {
    type: 'move',
    nodeId: root.id,
    line: LINE_NUMBERS.DELETE.RETURN_ROOT,
    description: `Returning node ${root.value}`,
  };

  return root;
}

/**
 * Generator for BST search operation with step-by-step visualization
 */
export function* bstSearchGenerator(root: TreeNode | null, value: number): Generator<Step, boolean, undefined> {
  // Line 1: function search(root, value)
  if (root === null) {
    yield {
      type: 'not-found',
      nodeId: null,
      line: LINE_NUMBERS.SEARCH.BASE_CASE,
      description: `Reached null node, ${value} not found`,
    };
    return false;
  }

  yield {
    type: 'visit',
    nodeId: root.id,
    line: LINE_NUMBERS.SEARCH.FUNCTION_START,
    description: `Visiting node with value ${root.value}`,
  };

  // Line 3: if (value === root.value)
  if (value === root.value) {
    yield {
      type: 'found',
      nodeId: root.id,
      line: LINE_NUMBERS.SEARCH.COMPARE,
      description: `Found ${value} at node ${root.id}`,
    };
    return true;
  }

  // Line 4: if (value < root.value)
  if (value < root.value) {
    yield {
      type: 'compare',
      nodeId: root.id,
      line: LINE_NUMBERS.SEARCH.RECURSIVE_SEARCH,
      description: `${value} < ${root.value}, searching left subtree`,
    };

    return yield* bstSearchGenerator(root.left, value);
  } else {
    yield {
      type: 'compare',
      nodeId: root.id,
      line: LINE_NUMBERS.SEARCH.RECURSIVE_SEARCH,
      description: `${value} > ${root.value}, searching right subtree`,
    };

    return yield* bstSearchGenerator(root.right, value);
  }
}

/**
 * Generator for BST inorder traversal with step-by-step visualization
 */
export function* bstInorderGenerator(root: TreeNode | null): Generator<Step, number[], undefined> {
  const result: number[] = [];

  function* traverse(node: TreeNode | null): Generator<Step, void, undefined> {
    // Line 1: if (node === null)
    if (node === null) {
      return;
    }

    // Line 2: traverse(node.left)
    yield {
      type: 'traverse',
      nodeId: node.id,
      line: LINE_NUMBERS.INORDER.TRAVERSE_LEFT,
      description: `Going to left child of ${node.value}`,
    };

    yield* traverse(node.left);

    // Line 3: result.push(node.value)
    yield {
      type: 'visit',
      nodeId: node.id,
      line: LINE_NUMBERS.INORDER.VISIT_NODE,
      description: `Visiting node ${node.value}`,
    };
    result.push(node.value);

    // Line 4: traverse(node.right)
    yield {
      type: 'traverse',
      nodeId: node.id,
      line: LINE_NUMBERS.INORDER.TRAVERSE_RIGHT,
      description: `Going to right child of ${node.value}`,
    };

    yield* traverse(node.right);
  }

  yield* traverse(root);

  // Line 5: return result
  yield {
    type: 'traverse',
    nodeId: null,
    line: LINE_NUMBERS.INORDER.RETURN_RESULT,
    description: `Inorder traversal complete: [${result.join(', ')}]`,
  };

  return result;
}