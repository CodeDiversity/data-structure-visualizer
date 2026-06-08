/**
 * Generator functions for BST visualization
 * Each function yields Step objects for step-by-step visualization
 */

import { TreeNode, Step } from '../../types';
import { generateNodeId } from './bst';

/**
 * Line numbers reference for code highlighting
 * These correspond to the line numbers in code-strings.ts
 */
export const LINE_NUMBERS = {
  INSERT: {
    FUNCTION_START: 1,
    BASE_CASE: 2,
    GO_LEFT: 6,
    GO_RIGHT: 8,
    RETURN_ROOT: 12,
  },
  DELETE: {
    FUNCTION_START: 1,
    BASE_CASE: 2,
    GO_LEFT: 6,
    GO_RIGHT: 8,
    FOUND_NODE: 10,
    CASE_1: 11,
    CASE_2: 14,
    CASE_3: 16,
    RETURN_ROOT: 21,
  },
  SEARCH: {
    FUNCTION_START: 1,
    BASE_CASE: 2,
    FOUND: 6,
    GO_LEFT: 10,
    GO_RIGHT: 12,
  },
  INORDER: {
    FUNCTION_START: 1,
    TRAVERSE_LEFT: 6,
    VISIT_NODE: 8,
    TRAVERSE_RIGHT: 10,
  },
  BFS: {
    BASE_CASE: 2,
    INIT_QUEUE: 6,
    LOOP_START: 9,
    VISIT_NODE: 11,
    ENQUEUE_LEFT: 13,
    ENQUEUE_RIGHT: 17,
    RETURN_RESULT: 22,
  },
};

function findMin(node: TreeNode): TreeNode {
  let current = node;

  while (current.left !== null) {
    current = current.left;
  }

  return current;
}

function buildBstDebug(root: TreeNode | null, extra: Record<string, unknown> = {}) {
  return {
    root: root ? root.value : null,
    ...extra,
  };
}

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
      debugVariables: buildBstDebug(root, { value }),
    };
    const newNode: TreeNode = {
      id: generateNodeId(),
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
    debugVariables: buildBstDebug(root, { value, current: root.value }),
  };

  // Line 3: if (value < root.value)
  if (value < root.value) {
    yield {
      type: 'compare',
      nodeId: root.id,
      line: LINE_NUMBERS.INSERT.GO_LEFT,
      description: `${value} < ${root.value}, going left`,
      debugVariables: buildBstDebug(root, { value, current: root.value }),
    };

    const updatedLeft = yield* bstInsertGenerator(root.left, value);

    // Return a new branch so React sees the BST structure update.
    const updatedRoot: TreeNode = {
      ...root,
      left: updatedLeft,
    };

    yield {
      type: 'move',
      nodeId: updatedRoot.id,
      line: LINE_NUMBERS.INSERT.RETURN_ROOT,
      description: `Returning node ${updatedRoot.value}`,
      debugVariables: buildBstDebug(updatedRoot, { value, current: updatedRoot.value }),
    };

    return updatedRoot;
  } else if (value > root.value) {
    yield {
      type: 'compare',
      nodeId: root.id,
      line: LINE_NUMBERS.INSERT.GO_RIGHT,
      description: `${value} > ${root.value}, going right`,
      debugVariables: buildBstDebug(root, { value, current: root.value }),
    };

    const updatedRight = yield* bstInsertGenerator(root.right, value);

    const updatedRoot: TreeNode = {
      ...root,
      right: updatedRight,
    };

    yield {
      type: 'move',
      nodeId: updatedRoot.id,
      line: LINE_NUMBERS.INSERT.RETURN_ROOT,
      description: `Returning node ${updatedRoot.value}`,
      debugVariables: buildBstDebug(updatedRoot, { value, current: updatedRoot.value }),
    };

    return updatedRoot;
  } else {
    yield {
      type: 'compare',
      nodeId: root.id,
      line: LINE_NUMBERS.INSERT.GO_RIGHT,
      description: `${value} === ${root.value}, duplicate, not inserting`,
      debugVariables: buildBstDebug(root, { value, current: root.value }),
    };
  }

  // Line 4: return root
  yield {
    type: 'move',
    nodeId: root.id,
    line: LINE_NUMBERS.INSERT.RETURN_ROOT,
    description: `Returning node ${root.value}`,
    debugVariables: buildBstDebug(root, { value, current: root.value }),
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
      debugVariables: buildBstDebug(root, { value }),
    };
    return null;
  }

  yield {
    type: 'visit',
    nodeId: root.id,
    line: LINE_NUMBERS.DELETE.FUNCTION_START,
    description: `Visiting node with value ${root.value}`,
    debugVariables: buildBstDebug(root, { value, current: root.value }),
  };

  // Line 3: if (value < root.value)
  if (value < root.value) {
    yield {
      type: 'compare',
      nodeId: root.id,
      line: LINE_NUMBERS.DELETE.GO_LEFT,
      description: `${value} < ${root.value}, searching left subtree`,
      debugVariables: buildBstDebug(root, { value, current: root.value }),
    };

    const updatedLeft = yield* bstDeleteGenerator(root.left, value);

    const updatedRoot: TreeNode = {
      ...root,
      left: updatedLeft,
    };

    yield {
      type: 'move',
      nodeId: updatedRoot.id,
      line: LINE_NUMBERS.DELETE.RETURN_ROOT,
      description: `Returning node ${updatedRoot.value}`,
      debugVariables: buildBstDebug(updatedRoot, { value, current: updatedRoot.value }),
    };

    return updatedRoot;
  } else if (value > root.value) {
    yield {
      type: 'compare',
      nodeId: root.id,
      line: LINE_NUMBERS.DELETE.GO_RIGHT,
      description: `${value} > ${root.value}, searching right subtree`,
      debugVariables: buildBstDebug(root, { value, current: root.value }),
    };

    const updatedRight = yield* bstDeleteGenerator(root.right, value);

    const updatedRoot: TreeNode = {
      ...root,
      right: updatedRight,
    };

    yield {
      type: 'move',
      nodeId: updatedRoot.id,
      line: LINE_NUMBERS.DELETE.RETURN_ROOT,
      description: `Returning node ${updatedRoot.value}`,
      debugVariables: buildBstDebug(updatedRoot, { value, current: updatedRoot.value }),
    };

    return updatedRoot;
  } else {
    // Line 4: Found the node to delete
    yield {
      type: 'delete',
      nodeId: root.id,
      line: LINE_NUMBERS.DELETE.FOUND_NODE,
      description: `Found node to delete with value ${value}`,
      debugVariables: buildBstDebug(root, { value, current: root.value }),
    };

    // Case 1: No children (leaf node)
    if (root.left === null && root.right === null) {
      yield {
        type: 'delete',
        nodeId: root.id,
        line: LINE_NUMBERS.DELETE.CASE_1,
        description: `Node ${value} is a leaf, removing it`,
        debugVariables: buildBstDebug(root, { value, current: root.value }),
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
        debugVariables: buildBstDebug(root, {
          value,
          current: root.value,
          child: root.right?.value ?? null,
        }),
      };
      return root.right;
    }
    if (root.right === null) {
      yield {
        type: 'delete',
        nodeId: root.id,
        line: LINE_NUMBERS.DELETE.CASE_2,
        description: `Node ${value} has only left child, replacing with left child`,
        debugVariables: buildBstDebug(root, {
          value,
          current: root.value,
          child: root.left?.value ?? null,
        }),
      };
      return root.left;
    }

    // Case 3: Two children
    yield {
      type: 'delete',
      nodeId: root.id,
      line: LINE_NUMBERS.DELETE.CASE_3,
      description: `Node ${value} has two children, finding in-order successor`,
      debugVariables: buildBstDebug(root, { value, current: root.value }),
    };

    const successor = findMin(root.right);
    const updatedRight = yield* bstDeleteGenerator(root.right, successor.value);
    const updatedRoot: TreeNode = {
      ...root,
      value: successor.value,
      right: updatedRight,
    };

    yield {
      type: 'move',
      nodeId: updatedRoot.id,
      line: LINE_NUMBERS.DELETE.RETURN_ROOT,
      description: `Replacing ${value} with successor ${successor.value}`,
      debugVariables: buildBstDebug(updatedRoot, {
        value,
        current: updatedRoot.value,
        successor: successor.value,
      }),
    };

    return updatedRoot;
  }

  // Line 8: return root
  yield {
    type: 'move',
    nodeId: root!.id,
    line: LINE_NUMBERS.DELETE.RETURN_ROOT,
    description: `Returning node ${root!.value}`,
    debugVariables: buildBstDebug(root, { value, current: root!.value }),
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
      debugVariables: buildBstDebug(root, { value }),
    };
    return false;
  }

  yield {
    type: 'visit',
    nodeId: root.id,
    line: LINE_NUMBERS.SEARCH.FUNCTION_START,
    description: `Visiting node with value ${root.value}`,
    debugVariables: buildBstDebug(root, { value, current: root.value }),
  };

  // Line 3: if (value === root.value)
  if (value === root.value) {
    yield {
      type: 'found',
      nodeId: root.id,
      line: LINE_NUMBERS.SEARCH.FOUND,
      description: `Found ${value} at node ${root.id}`,
      debugVariables: buildBstDebug(root, { value, current: root.value }),
    };
    return true;
  }

  // Line 4: if (value < root.value)
  if (value < root.value) {
    yield {
      type: 'compare',
      nodeId: root.id,
      line: LINE_NUMBERS.SEARCH.GO_LEFT,
      description: `${value} < ${root.value}, searching left subtree`,
      debugVariables: buildBstDebug(root, { value, current: root.value }),
    };

    return yield* bstSearchGenerator(root.left, value);
  } else {
    yield {
      type: 'compare',
      nodeId: root.id,
      line: LINE_NUMBERS.SEARCH.GO_RIGHT,
      description: `${value} > ${root.value}, searching right subtree`,
      debugVariables: buildBstDebug(root, { value, current: root.value }),
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
      debugVariables: buildBstDebug(root, {
        node: node.value,
        current: node.value,
        result,
      }),
    };

    yield* traverse(node.left);

    // Line 3: result.push(node.value)
    yield {
      type: 'visit',
      nodeId: node.id,
      line: LINE_NUMBERS.INORDER.VISIT_NODE,
      description: `Visiting node ${node.value}`,
      debugVariables: buildBstDebug(root, {
        node: node.value,
        current: node.value,
        result,
      }),
    };
    result.push(node.value);

    // Line 4: traverse(node.right)
    yield {
      type: 'traverse',
      nodeId: node.id,
      line: LINE_NUMBERS.INORDER.TRAVERSE_RIGHT,
      description: `Going to right child of ${node.value}`,
      debugVariables: buildBstDebug(root, {
        node: node.value,
        current: node.value,
        result,
      }),
    };

    yield* traverse(node.right);
  }

  yield* traverse(root);

  // Line 5: return result
  return result;
}

/**
 * Generator for BST breadth-first traversal with step-by-step visualization
 */
export function* bstBfsGenerator(root: TreeNode | null): Generator<Step, number[], undefined> {
  if (root === null) {
    yield {
      type: 'not-found',
      nodeId: null,
      line: LINE_NUMBERS.BFS.BASE_CASE,
      description: 'Tree is empty, BFS traversal returns []',
      debugVariables: buildBstDebug(root, { queue: [], result: [] }),
    };
    return [];
  }

  const queue: TreeNode[] = [root];
  const result: number[] = [];

  yield {
    type: 'traverse',
    nodeId: root.id,
    line: LINE_NUMBERS.BFS.INIT_QUEUE,
    description: `Starting BFS with root ${root.value}`,
    debugVariables: buildBstDebug(root, {
      queue: queue.map((node) => node.value),
      result,
      current: root.value,
    }),
  };

  while (queue.length > 0) {
    const current = queue.shift()!;

    yield {
      type: 'traverse',
      nodeId: current.id,
      line: LINE_NUMBERS.BFS.LOOP_START,
      description: `Dequeued ${current.value}`,
      debugVariables: buildBstDebug(root, {
        queue: queue.map((node) => node.value),
        result,
        current: current.value,
      }),
    };

    yield {
      type: 'visit',
      nodeId: current.id,
      line: LINE_NUMBERS.BFS.VISIT_NODE,
      description: `Visiting ${current.value}`,
      debugVariables: buildBstDebug(root, {
        queue: queue.map((node) => node.value),
        result,
        current: current.value,
      }),
    };
    result.push(current.value);

    if (current.left !== null) {
      yield {
        type: 'move',
        nodeId: current.left.id,
        line: LINE_NUMBERS.BFS.ENQUEUE_LEFT,
        description: `Enqueue left child ${current.left.value}`,
        debugVariables: buildBstDebug(root, {
          queue: queue.map((node) => node.value),
          result,
          current: current.value,
          child: current.left.value,
        }),
      };
      queue.push(current.left);
    }

    if (current.right !== null) {
      yield {
        type: 'move',
        nodeId: current.right.id,
        line: LINE_NUMBERS.BFS.ENQUEUE_RIGHT,
        description: `Enqueue right child ${current.right.value}`,
        debugVariables: buildBstDebug(root, {
          queue: queue.map((node) => node.value),
          result,
          current: current.value,
          child: current.right.value,
        }),
      };
      queue.push(current.right);
    }
  }

  yield {
    type: 'traverse',
    nodeId: null,
    line: LINE_NUMBERS.BFS.RETURN_RESULT,
    description: `BFS traversal complete: [${result.join(', ')}]`,
    debugVariables: buildBstDebug(root, {
      queue: queue.map((node) => node.value),
      result,
    }),
  };

  return result;
}
