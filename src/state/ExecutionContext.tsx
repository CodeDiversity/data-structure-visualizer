import { createContext, useContext, useState, ReactNode } from 'react';
import {
  ArrayData,
  BinarySearchData,
  DoublyLinkedListNode,
  GraphData,
  HashTableData,
  HeapData,
  KadaneData,
  LinkedListNode,
  MergeSortData,
  OperationKind,
  PrefixSumData,
  QueueData,
  RecursionData,
  SlidingWindowData,
  StackData,
  TreeNode,
  Step,
  TwoPointerData,
} from '../types';
import { useExecutionEngine, ExecutionState } from '../hooks/useExecutionEngine';

interface ExecutionContextValue {
  state: ExecutionState;
  currentStep: Step | null;
  currentOperation: OperationKind | null;
  speed: number;
  execute: (
    generator: Generator<Step, unknown, undefined>,
    onComplete?: (result: unknown) => void,
    options?: {
      startPaused?: boolean;
      operation?: OperationKind;
      onStep?: (step: Step) => void;
    }
  ) => void;
  pause: () => void;
  resume: () => void;
  step: () => void;
  reset: () => void;
  setSpeed: (ms: number) => void;
  bstRoot: TreeNode | null;
  setBstRoot: (root: TreeNode | null) => void;
  linkedListHead: LinkedListNode | null;
  setLinkedListHead: (head: LinkedListNode | null) => void;
  doublyLinkedListHead: DoublyLinkedListNode | null;
  setDoublyLinkedListHead: (head: DoublyLinkedListNode | null) => void;
  graphData: GraphData;
  setGraphData: (graph: GraphData) => void;
  twoPointerData: TwoPointerData;
  setTwoPointerData: (data: TwoPointerData) => void;
  slidingWindowData: SlidingWindowData;
  setSlidingWindowData: (data: SlidingWindowData) => void;
  binarySearchData: BinarySearchData;
  setBinarySearchData: (data: BinarySearchData) => void;
  mergeSortData: MergeSortData;
  setMergeSortData: (data: MergeSortData) => void;
  prefixSumData: PrefixSumData;
  setPrefixSumData: (data: PrefixSumData) => void;
  kadaneData: KadaneData;
  setKadaneData: (data: KadaneData) => void;
  recursionData: RecursionData;
  setRecursionData: (data: RecursionData) => void;
  arrayData: ArrayData;
  setArrayData: (data: ArrayData) => void;
  stackData: StackData;
  setStackData: (data: StackData) => void;
  queueData: QueueData;
  setQueueData: (data: QueueData) => void;
  heapData: HeapData;
  setHeapData: (data: HeapData) => void;
  hashTableData: HashTableData;
  setHashTableData: (data: HashTableData) => void;
}

const ExecutionContext = createContext<ExecutionContextValue | null>(null);

interface ExecutionProviderProps {
  children: ReactNode;
}

/**
 * Provider component that wraps the app and provides execution context
 */
export function ExecutionProvider({ children }: ExecutionProviderProps) {
  const execution = useExecutionEngine();
  const [bstRoot, setBstRoot] = useState<TreeNode | null>(null);
  const [linkedListHead, setLinkedListHead] = useState<LinkedListNode | null>(null);
  const [doublyLinkedListHead, setDoublyLinkedListHead] = useState<DoublyLinkedListNode | null>(null);
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] });
  const [twoPointerData, setTwoPointerData] = useState<TwoPointerData>({
    values: [],
    target: null,
    leftIndex: null,
    rightIndex: null,
    matchedIndices: [],
  });
  const [slidingWindowData, setSlidingWindowData] = useState<SlidingWindowData>({
    values: [],
    windowSize: null,
    windowStart: null,
    windowEnd: null,
    bestStart: null,
    bestEnd: null,
    currentSum: null,
    bestSum: null,
  });
  const [binarySearchData, setBinarySearchData] = useState<BinarySearchData>({
    values: [],
    target: null,
    lowIndex: null,
    midIndex: null,
    highIndex: null,
    foundIndex: null,
  });
  const [mergeSortData, setMergeSortData] = useState<MergeSortData>({
    values: [],
    activeIndices: [],
    sortedIndices: [],
    mergeStart: null,
    mergeEnd: null,
  });
  const [prefixSumData, setPrefixSumData] = useState<PrefixSumData>({
    values: [],
    prefixValues: [],
    activeIndices: [],
    prefixActiveIndices: [],
    queryLeft: null,
    queryRight: null,
    rangeSum: null,
  });
  const [kadaneData, setKadaneData] = useState<KadaneData>({
    values: [],
    currentStart: null,
    currentEnd: null,
    bestStart: null,
    bestEnd: null,
    currentSum: null,
    bestSum: null,
  });
  const [recursionData, setRecursionData] = useState<RecursionData>({
    example: 'factorial',
    input: null,
    frames: [],
    result: null,
    activeFrameId: null,
  });
  const [arrayData, setArrayData] = useState<ArrayData>({
    values: [],
    activeIndices: [],
    foundIndex: null,
  });
  const [stackData, setStackData] = useState<StackData>({
    values: [],
    activeIndices: [],
    topIndex: null,
    foundIndex: null,
  });
  const [queueData, setQueueData] = useState<QueueData>({
    values: [],
    activeIndices: [],
    frontIndex: null,
    rearIndex: null,
    foundIndex: null,
  });
  const [heapData, setHeapData] = useState<HeapData>({
    values: [],
    activeIndices: [],
    foundIndex: null,
  });
  const [hashTableData, setHashTableData] = useState<HashTableData>({
    buckets: [[], [], [], [], []],
    activeBucketIndex: null,
    activeEntryIndex: null,
    foundBucketIndex: null,
    foundEntryIndex: null,
  });

  const value: ExecutionContextValue = {
    ...execution,
    bstRoot,
    setBstRoot,
    linkedListHead,
    setLinkedListHead,
    doublyLinkedListHead,
    setDoublyLinkedListHead,
    graphData,
    setGraphData,
    twoPointerData,
    setTwoPointerData,
    slidingWindowData,
    setSlidingWindowData,
    binarySearchData,
    setBinarySearchData,
    mergeSortData,
    setMergeSortData,
    prefixSumData,
    setPrefixSumData,
    kadaneData,
    setKadaneData,
    recursionData,
    setRecursionData,
    arrayData,
    setArrayData,
    stackData,
    setStackData,
    queueData,
    setQueueData,
    heapData,
    setHeapData,
    hashTableData,
    setHashTableData,
  };

  return (
    <ExecutionContext.Provider value={value}>
      {children}
    </ExecutionContext.Provider>
  );
}

/**
 * Hook to access execution context
 */
export function useExecutionContext(): ExecutionContextValue {
  const context = useContext(ExecutionContext);
  if (!context) {
    throw new Error('useExecutionContext must be used within an ExecutionProvider');
  }
  return context;
}

// Re-export for convenience
export type { ExecutionState } from '../hooks/useExecutionEngine';
