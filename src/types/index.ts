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

export interface LinkedListNode {
  id: string;
  value: number;
  next: LinkedListNode | null;
}

export interface DoublyLinkedListNode {
  id: string;
  value: number;
  prev: DoublyLinkedListNode | null;
  next: DoublyLinkedListNode | null;
}

export interface GraphNode {
  id: string;
  value: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface TwoPointerData {
  values: number[];
  target: number | null;
  leftIndex: number | null;
  rightIndex: number | null;
  matchedIndices: number[];
}

export interface SlidingWindowData {
  values: number[];
  windowSize: number | null;
  windowStart: number | null;
  windowEnd: number | null;
  bestStart: number | null;
  bestEnd: number | null;
  currentSum: number | null;
  bestSum: number | null;
}

export interface BinarySearchData {
  values: number[];
  target: number | null;
  lowIndex: number | null;
  midIndex: number | null;
  highIndex: number | null;
  foundIndex: number | null;
}

export interface MergeSortData {
  values: number[];
  activeIndices: number[];
  sortedIndices: number[];
  mergeStart: number | null;
  mergeEnd: number | null;
}

export interface PrefixSumData {
  values: number[];
  prefixValues: number[];
  activeIndices: number[];
  prefixActiveIndices: number[];
  queryLeft: number | null;
  queryRight: number | null;
  rangeSum: number | null;
}

export interface KadaneData {
  values: number[];
  currentStart: number | null;
  currentEnd: number | null;
  bestStart: number | null;
  bestEnd: number | null;
  currentSum: number | null;
  bestSum: number | null;
}

export interface RecursionFrame {
  id: string;
  label: string;
  depth: number;
  status: 'calling' | 'base' | 'returning';
  result: number | null;
}

export type RecursionExample = 'factorial' | 'fibonacci' | 'sum-to-n';

export interface RecursionData {
  example: RecursionExample;
  input: number | null;
  frames: RecursionFrame[];
  result: number | null;
  activeFrameId: string | null;
}

export interface ArrayData {
  values: number[];
  activeIndices: number[];
  foundIndex: number | null;
}

export interface StackData {
  values: number[];
  activeIndices: number[];
  topIndex: number | null;
  foundIndex: number | null;
}

export interface QueueData {
  values: number[];
  activeIndices: number[];
  frontIndex: number | null;
  rearIndex: number | null;
  foundIndex: number | null;
}

export interface HeapData {
  values: number[];
  activeIndices: number[];
  foundIndex: number | null;
}

export interface HashTableData {
  buckets: number[][];
  activeBucketIndex: number | null;
  activeEntryIndex: number | null;
  foundBucketIndex: number | null;
  foundEntryIndex: number | null;
}

/**
 * Represents a single step in the BST algorithm visualization
 */
export interface Step {
  type:
    | 'visit'
    | 'compare'
    | 'move'
    | 'found'
    | 'not-found'
    | 'delete'
    | 'insert'
    | 'traverse';
  nodeId: string | null;
  line: number;
  description?: string;
  leftIndex?: number | null;
  rightIndex?: number | null;
  matchedIndices?: number[];
  windowStart?: number | null;
  windowEnd?: number | null;
  bestStart?: number | null;
  bestEnd?: number | null;
  currentSum?: number | null;
  bestSum?: number | null;
  lowIndex?: number | null;
  midIndex?: number | null;
  highIndex?: number | null;
  foundIndex?: number | null;
  mergeStart?: number | null;
  mergeEnd?: number | null;
  queryLeft?: number | null;
  queryRight?: number | null;
  rangeSum?: number | null;
  currentStart?: number | null;
  currentEnd?: number | null;
  recursionExample?: RecursionExample;
  recursionInput?: number | null;
  recursionResult?: number | null;
  activeIndices?: number[];
  sortedIndices?: number[];
  prefixActiveIndices?: number[];
  valuesSnapshot?: number[];
  prefixValuesSnapshot?: number[];
  recursionFramesSnapshot?: RecursionFrame[];
  debugVariables?: Record<string, unknown>;
  bucketSnapshot?: number[][];
  activeBucketIndex?: number | null;
  activeEntryIndex?: number | null;
  foundBucketIndex?: number | null;
  foundEntryIndex?: number | null;
}

export type StructureKind =
  | 'array'
  | 'stack'
  | 'queue'
  | 'heap'
  | 'hash-table'
  | 'bst'
  | 'linked-list'
  | 'doubly-linked-list'
  | 'graph'
  | 'two-pointer'
  | 'sliding-window'
  | 'binary-search'
  | 'merge-sort'
  | 'prefix-sum'
  | 'kadane'
  | 'recursion';

export type OperationKind =
  | 'insert'
  | 'delete'
  | 'search'
  | 'sort'
  | 'traverse'
  | 'bfs'
  | 'append'
  | 'add-edge'
  | 'load';

/**
 * Interface defining the BST operations
 */
export interface BSTOperations {
  insert: (root: TreeNode | null, value: number) => TreeNode;
  delete: (root: TreeNode | null, value: number) => TreeNode;
  search: (root: TreeNode | null, value: number) => boolean;
  inorder: (root: TreeNode | null) => number[];
}
