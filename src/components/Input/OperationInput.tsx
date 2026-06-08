import { ChangeEvent, CSSProperties, useState } from 'react';
import { buildTree, insert } from '../../algorithms/bst/bst';
import {
  bstBfsGenerator,
  LINE_NUMBERS,
  bstDeleteGenerator,
  bstInorderGenerator,
  bstInsertGenerator,
  bstSearchGenerator,
} from '../../algorithms/bst/generators';
import { buildLinkedList } from '../../algorithms/linked-list/linked-list';
import {
  linkedListAppendGenerator,
  linkedListDeleteGenerator,
  linkedListSearchGenerator,
  linkedListTraverseGenerator,
} from '../../algorithms/linked-list/generators';
import { buildDoublyLinkedList } from '../../algorithms/doubly-linked-list/doubly-linked-list';
import {
  doublyAppendGenerator,
  doublyDeleteGenerator,
  doublySearchGenerator,
  doublyTraverseGenerator,
} from '../../algorithms/doubly-linked-list/generators';
import { buildRandomGraph, cloneGraph } from '../../algorithms/graph/graph';
import {
  GRAPH_LINE_NUMBERS,
  graphAddEdgeGenerator,
  graphAddNodeGenerator,
  graphBfsGenerator,
  graphDfsGenerator,
  graphSearchGenerator,
} from '../../algorithms/graph/generators';
import { twoPointerGenerator } from '../../algorithms/two-pointer/generators';
import { slidingWindowGenerator } from '../../algorithms/sliding-window/generators';
import { binarySearchGenerator } from '../../algorithms/binary-search/generators';
import { mergeSortGenerator } from '../../algorithms/merge-sort/generators';
import {
  buildPrefixSumGenerator,
  prefixSumRangeQueryGenerator,
} from '../../algorithms/prefix-sum/generators';
import { kadaneGenerator } from '../../algorithms/kadane/generators';
import {
  factorialGenerator,
  fibonacciGenerator,
  sumToNGenerator,
} from '../../algorithms/recursion/generators';
import {
  arrayAppendGenerator,
  arrayDeleteGenerator,
  arraySearchGenerator,
  arrayTraverseGenerator,
} from '../../algorithms/array/generators';
import {
  stackPopGenerator,
  stackPushGenerator,
  stackSearchGenerator,
  stackTraverseGenerator,
} from '../../algorithms/stack/generators';
import {
  queueDequeueGenerator,
  queueEnqueueGenerator,
  queueSearchGenerator,
  queueTraverseGenerator,
} from '../../algorithms/queue/generators';
import {
  heapExtractMaxGenerator,
  heapInsertGenerator,
  heapSearchGenerator,
  heapTraverseGenerator,
} from '../../algorithms/heap/generators';
import {
  buildHashTable,
  hashTableDeleteGenerator,
  hashTableInsertGenerator,
  hashTableSearchGenerator,
  hashTableTraverseGenerator,
} from '../../algorithms/hash-table/generators';
import { useExecutionContext } from '../../state/ExecutionContext';
import {
  DoublyLinkedListNode,
  GraphData,
  LinkedListNode,
  RecursionExample,
  Step,
  StructureKind,
  TreeNode,
} from '../../types';

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '16px',
  background: '#2a2a2a',
  borderRadius: '8px',
};

const baseButtonStyle: CSSProperties = {
  flex: 1,
  minWidth: '80px',
  padding: '8px 16px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 500,
  color: '#fff',
};

function cloneTree(node: TreeNode | null): TreeNode | null {
  if (node === null) {
    return null;
  }

  return {
    ...node,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
  };
}

function cloneLinkedList(node: LinkedListNode | null): LinkedListNode | null {
  if (node === null) {
    return null;
  }

  return {
    ...node,
    next: cloneLinkedList(node.next),
  };
}

function cloneDoublyLinkedList(node: DoublyLinkedListNode | null): DoublyLinkedListNode | null {
  if (node === null) {
    return null;
  }

  const clonedHead: DoublyLinkedListNode = {
    id: node.id,
    value: node.value,
    prev: null,
    next: null,
  };

  let sourceCurrent = node.next;
  let targetCurrent = clonedHead;

  while (sourceCurrent !== null) {
    const nextNode: DoublyLinkedListNode = {
      id: sourceCurrent.id,
      value: sourceCurrent.value,
      prev: targetCurrent,
      next: null,
    };
    targetCurrent.next = nextNode;
    targetCurrent = nextNode;
    sourceCurrent = sourceCurrent.next;
  }

  return clonedHead;
}

function buildMaxHeap(values: number[]): number[] {
  const heap: number[] = [];

  for (const value of values) {
    heap.push(value);

    let currentIndex = heap.length - 1;
    while (currentIndex > 0) {
      const parentIndex = Math.floor((currentIndex - 1) / 2);
      if (heap[parentIndex] >= heap[currentIndex]) {
        break;
      }

      const temp = heap[parentIndex];
      heap[parentIndex] = heap[currentIndex];
      heap[currentIndex] = temp;
      currentIndex = parentIndex;
    }
  }

  return heap;
}

interface OperationInputProps {
  structure: StructureKind;
}

export default function OperationInput({ structure }: OperationInputProps) {
  const {
    state,
    execute,
    reset,
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
  } = useExecutionContext();
  const [inputValue, setInputValue] = useState<string>('');
  const [secondaryInputValue, setSecondaryInputValue] = useState<string>('');
  const [validationMessage, setValidationMessage] = useState<string>('');

  const isBusy = state !== 'idle';

  const parseInteger = (value: string): number | null => {
    if (value.trim() === '') {
      return null;
    }

    const num = Number(value);
    if (Number.isNaN(num)) {
      return null;
    }

    if (!Number.isInteger(num)) {
      return null;
    }

    return num;
  };

  const validateInput = (value: string): boolean => {
    const parsed = parseInteger(value);

    if (parsed === null) {
      if (value.trim() === '') {
        setValidationMessage('Please enter a number');
      } else if (Number.isNaN(Number(value))) {
        setValidationMessage('Please enter a valid number');
      } else {
        setValidationMessage('Please enter an integer');
      }
      return false;
    }

    setValidationMessage('');
    return true;
  };

  const validateGraphEdgeInputs = (): { source: number; target: number } | null => {
    const source = parseInteger(inputValue);
    const target = parseInteger(secondaryInputValue);

    if (source === null || target === null) {
      setValidationMessage('Please enter two integers to create an edge');
      return null;
    }

    setValidationMessage('');
    return { source, target };
  };

  const parseArrayInput = (value: string): number[] | null => {
    const parts = value
      .split(',')
      .map((part) => part.trim())
      .filter((part) => part.length > 0);

    if (parts.length < 2) {
      return null;
    }

    const numbers = parts.map((part) => Number(part));
    if (numbers.some((num) => Number.isNaN(num) || !Number.isInteger(num))) {
      return null;
    }

    return numbers;
  };

  const parseArrayInputAllowSingle = (value: string): number[] | null => {
    const parts = value
      .split(',')
      .map((part) => part.trim())
      .filter((part) => part.length > 0);

    if (parts.length < 1) {
      return null;
    }

    const numbers = parts.map((part) => Number(part));
    if (numbers.some((num) => Number.isNaN(num) || !Number.isInteger(num))) {
      return null;
    }

    return numbers;
  };

  const parseSortedArrayInput = (value: string): number[] | null => {
    const numbers = parseArrayInput(value);

    if (numbers === null) {
      return null;
    }

    return [...numbers].sort((a, b) => a - b);
  };

  const parseRangeInput = (value: string): { left: number; right: number } | null => {
    const parts = value
      .split(',')
      .map((part) => part.trim())
      .filter((part) => part.length > 0);

    if (parts.length !== 2) {
      return null;
    }

    const left = Number(parts[0]);
    const right = Number(parts[1]);

    if (
      Number.isNaN(left) ||
      Number.isNaN(right) ||
      !Number.isInteger(left) ||
      !Number.isInteger(right)
    ) {
      return null;
    }

    return { left, right };
  };

  const handleLoadTwoPointerArray = () => {
    const values = parseArrayInput(inputValue);
    const target = parseInteger(secondaryInputValue);

    if (values === null) {
      setValidationMessage('Enter at least two comma-separated integers for the array');
      return;
    }

    if (target === null) {
      setValidationMessage('Enter an integer target value');
      return;
    }

    setTwoPointerData({
      values,
      target,
      leftIndex: null,
      rightIndex: null,
      matchedIndices: [],
    });
    setValidationMessage('');
  };

  const handleLoadSlidingWindowData = () => {
    const values = parseArrayInput(inputValue);
    const windowSize = parseInteger(secondaryInputValue);

    if (values === null) {
      setValidationMessage('Enter at least two comma-separated integers for the array');
      return;
    }

    if (windowSize === null || windowSize < 1 || windowSize > values.length) {
      setValidationMessage('Enter a window size between 1 and the array length');
      return;
    }

    setSlidingWindowData({
      values,
      windowSize,
      windowStart: null,
      windowEnd: null,
      bestStart: null,
      bestEnd: null,
      currentSum: null,
      bestSum: null,
    });
    setValidationMessage('');
  };

  const handleLoadBinarySearchData = () => {
    const values = parseSortedArrayInput(inputValue);
    const target = parseInteger(secondaryInputValue);

    if (values === null) {
      setValidationMessage('Enter at least two comma-separated integers for the array');
      return;
    }

    if (target === null) {
      setValidationMessage('Enter an integer target value');
      return;
    }

    setBinarySearchData({
      values,
      target,
      lowIndex: null,
      midIndex: null,
      highIndex: null,
      foundIndex: null,
    });
    setValidationMessage('');
  };

  const handleLoadMergeSortData = () => {
    const values = parseArrayInput(inputValue);

    if (values === null) {
      setValidationMessage('Enter at least two comma-separated integers for the array');
      return;
    }

    reset();
    setMergeSortData({
      values,
      activeIndices: [],
      sortedIndices: [],
      mergeStart: null,
      mergeEnd: null,
    });
    setValidationMessage('');
  };

  const handleLoadPrefixSumData = () => {
    const values = parseArrayInput(inputValue);

    if (values === null) {
      setValidationMessage('Enter at least two comma-separated integers for the array');
      return;
    }

    reset();
    setPrefixSumData({
      values,
      prefixValues: [],
      activeIndices: [],
      prefixActiveIndices: [],
      queryLeft: null,
      queryRight: null,
      rangeSum: null,
    });
    setValidationMessage('');
  };

  const handleLoadKadaneData = () => {
    const values = parseArrayInput(inputValue);

    if (values === null) {
      setValidationMessage('Enter at least two comma-separated integers for the array');
      return;
    }

    reset();
    setKadaneData({
      values,
      currentStart: null,
      currentEnd: null,
      bestStart: null,
      bestEnd: null,
      currentSum: null,
      bestSum: null,
    });
    setValidationMessage('');
  };

  const handleLoadRecursionData = () => {
    const value = parseInteger(inputValue);

    if (value === null) {
      setValidationMessage('Enter an integer for the recursion input');
      return;
    }

    const maxValue =
      recursionData.example === 'fibonacci'
        ? 8
        : recursionData.example === 'sum-to-n'
          ? 20
          : 10;

    if (value < 0 || value > maxValue) {
      setValidationMessage(`Enter an integer between 0 and ${maxValue} for this recursion example`);
      return;
    }

    reset();
    setRecursionData({
      ...recursionData,
      input: value,
      frames: [],
      result: null,
      activeFrameId: null,
    });
    setValidationMessage('');
  };

  const handleRecursionExampleChange = (example: RecursionExample) => {
    reset();
    setRecursionData({
      example,
      input: null,
      frames: [],
      result: null,
      activeFrameId: null,
    });
    setInputValue('');
    setSecondaryInputValue('');
    setValidationMessage('');
  };

  const handleLoadArrayData = () => {
    const values = parseArrayInputAllowSingle(inputValue);

    if (values === null) {
      setValidationMessage('Enter one or more comma-separated integers for the array');
      return;
    }

    reset();
    setArrayData({
      values,
      activeIndices: [],
      foundIndex: null,
    });
    setValidationMessage('');
  };

  const handleLoadStackData = () => {
    const values = parseArrayInputAllowSingle(inputValue);

    if (values === null) {
      setValidationMessage('Enter one or more comma-separated integers for the stack');
      return;
    }

    reset();
    setStackData({
      values,
      activeIndices: [],
      topIndex: values.length - 1,
      foundIndex: null,
    });
    setValidationMessage('');
  };

  const handleLoadQueueData = () => {
    const values = parseArrayInputAllowSingle(inputValue);

    if (values === null) {
      setValidationMessage('Enter one or more comma-separated integers for the queue');
      return;
    }

    reset();
    setQueueData({
      values,
      activeIndices: [],
      frontIndex: values.length > 0 ? 0 : null,
      rearIndex: values.length > 0 ? values.length - 1 : null,
      foundIndex: null,
    });
    setValidationMessage('');
  };

  const handleLoadHeapData = () => {
    const values = parseArrayInputAllowSingle(inputValue);

    if (values === null) {
      setValidationMessage('Enter one or more comma-separated integers for the heap');
      return;
    }

    reset();
    setHeapData({
      values: buildMaxHeap(values),
      activeIndices: [],
      foundIndex: null,
    });
    setValidationMessage('');
  };

  const handleLoadHashTableData = () => {
    const values = parseArrayInputAllowSingle(inputValue);

    if (values === null) {
      setValidationMessage('Enter one or more comma-separated integers for the hash table');
      return;
    }

    reset();
    setHashTableData({
      buckets: buildHashTable(values),
      activeBucketIndex: null,
      activeEntryIndex: null,
      foundBucketIndex: null,
      foundEntryIndex: null,
    });
    setValidationMessage('');
  };

  const handleInsert = () => {
    if (structure === 'array') {
      if (inputValue.includes(',')) {
        handleLoadArrayData();
        return;
      }

      if (!validateInput(inputValue)) return;

      const value = Number(inputValue);

      execute(arrayAppendGenerator(arrayData.values, value), (result) => {
        setArrayData({
          values: result as number[],
          activeIndices: [],
          foundIndex: null,
        });
      }, {
        startPaused: true,
        operation: 'append',
        onStep: (step: Step) => {
          setArrayData({
            values: step.valuesSnapshot ?? arrayData.values,
            activeIndices: step.activeIndices ?? [],
            foundIndex: null,
          });
        },
      });
      setInputValue('');
      setValidationMessage('');
      return;
    }

    if (structure === 'stack') {
      if (inputValue.includes(',')) {
        handleLoadStackData();
        return;
      }

      if (!validateInput(inputValue)) return;

      const value = Number(inputValue);

      execute(stackPushGenerator(stackData.values, value), (result) => {
        const values = result as number[];
        setStackData({
          values,
          activeIndices: [],
          topIndex: values.length > 0 ? values.length - 1 : null,
          foundIndex: null,
        });
      }, {
        startPaused: true,
        operation: 'append',
        onStep: (step: Step) => {
          const values = step.valuesSnapshot ?? stackData.values;
          setStackData({
            values,
            activeIndices: step.activeIndices ?? [],
            topIndex: values.length > 0 ? values.length - 1 : null,
            foundIndex: null,
          });
        },
      });
      setInputValue('');
      setValidationMessage('');
      return;
    }

    if (structure === 'queue') {
      if (inputValue.includes(',')) {
        handleLoadQueueData();
        return;
      }

      if (!validateInput(inputValue)) return;

      const value = Number(inputValue);

      execute(queueEnqueueGenerator(queueData.values, value), (result) => {
        const values = result as number[];
        setQueueData({
          values,
          activeIndices: [],
          frontIndex: values.length > 0 ? 0 : null,
          rearIndex: values.length > 0 ? values.length - 1 : null,
          foundIndex: null,
        });
      }, {
        startPaused: true,
        operation: 'append',
        onStep: (step: Step) => {
          const values = step.valuesSnapshot ?? queueData.values;
          setQueueData({
            values,
            activeIndices: step.activeIndices ?? [],
            frontIndex: values.length > 0 ? 0 : null,
            rearIndex: values.length > 0 ? values.length - 1 : null,
            foundIndex: null,
          });
        },
      });
      setInputValue('');
      setValidationMessage('');
      return;
    }

    if (structure === 'heap') {
      if (inputValue.includes(',')) {
        handleLoadHeapData();
        return;
      }

      if (!validateInput(inputValue)) return;

      const value = Number(inputValue);

      execute(heapInsertGenerator(heapData.values, value), (result) => {
        setHeapData({
          values: result as number[],
          activeIndices: [],
          foundIndex: null,
        });
      }, {
        startPaused: true,
        operation: 'insert',
        onStep: (step: Step) => {
          setHeapData({
            values: step.valuesSnapshot ?? heapData.values,
            activeIndices: step.activeIndices ?? [],
            foundIndex: null,
          });
        },
      });
      setInputValue('');
      setValidationMessage('');
      return;
    }

    if (structure === 'hash-table') {
      if (inputValue.includes(',')) {
        handleLoadHashTableData();
        return;
      }

      if (!validateInput(inputValue)) return;

      const value = Number(inputValue);

      execute(hashTableInsertGenerator(hashTableData.buckets, value), (result) => {
        setHashTableData({
          buckets: result as number[][],
          activeBucketIndex: null,
          activeEntryIndex: null,
          foundBucketIndex: null,
          foundEntryIndex: null,
        });
      }, {
        startPaused: true,
        operation: 'insert',
        onStep: (step: Step) => {
          setHashTableData({
            buckets: step.bucketSnapshot ?? hashTableData.buckets,
            activeBucketIndex: step.activeBucketIndex ?? null,
            activeEntryIndex: step.activeEntryIndex ?? null,
            foundBucketIndex: null,
            foundEntryIndex: null,
          });
        },
      });
      setInputValue('');
      setValidationMessage('');
      return;
    }

    if (structure === 'two-pointer') {
      handleLoadTwoPointerArray();
      return;
    }

    if (structure === 'sliding-window') {
      handleLoadSlidingWindowData();
      return;
    }

    if (structure === 'binary-search') {
      handleLoadBinarySearchData();
      return;
    }

    if (structure === 'merge-sort') {
      handleLoadMergeSortData();
      return;
    }

    if (structure === 'prefix-sum') {
      handleLoadPrefixSumData();
      return;
    }

    if (structure === 'kadane') {
      handleLoadKadaneData();
      return;
    }

    if (structure === 'recursion') {
      handleLoadRecursionData();
      return;
    }

    if (!validateInput(inputValue)) return;

    if (structure === 'graph') {
      const value = Number(inputValue);

      execute(graphAddNodeGenerator(cloneGraph(graphData), value), (resultGraph) => {
        setGraphData(resultGraph as GraphData);
      }, {
        startPaused: true,
        operation: 'insert',
      });
      setInputValue('');
      return;
    }

    if (structure === 'linked-list') {
      const value = Number(inputValue);

      execute(linkedListAppendGenerator(cloneLinkedList(linkedListHead), value), (newHead) => {
        setLinkedListHead(newHead as LinkedListNode | null);
      }, {
        startPaused: true,
        operation: 'append',
      });
      setInputValue('');
      return;
    }

    if (structure === 'doubly-linked-list') {
      const value = Number(inputValue);

      execute(doublyAppendGenerator(cloneDoublyLinkedList(doublyLinkedListHead), value), (newHead) => {
        setDoublyLinkedListHead(newHead as DoublyLinkedListNode | null);
      }, {
        startPaused: true,
        operation: 'append',
      });
      setInputValue('');
      return;
    }

    const value = Number(inputValue);
    const insertedRoot = insert(cloneTree(bstRoot), value);

    console.debug('[BST] Insert requested', {
      value,
      currentRootValue: bstRoot?.value ?? null,
    });
    let committedInsert = false;

    execute(bstInsertGenerator(bstRoot, value), (newRoot) => {
      const nextRoot = newRoot as TreeNode | null;

      console.debug('[BST] Insert completed', {
        value,
        nextRootValue: nextRoot?.value ?? null,
      });

      setBstRoot(nextRoot);
    }, {
      startPaused: true,
      operation: 'insert',
      onStep: (step: Step) => {
        if (
          !committedInsert &&
          step.type === 'insert' &&
          step.line === LINE_NUMBERS.INSERT.BASE_CASE
        ) {
          committedInsert = true;
          setBstRoot(insertedRoot);
        }
      },
    });
    setInputValue('');
  };

  const handleAddEdge = () => {
    const values = validateGraphEdgeInputs();
    if (!values) return;
    const nextGraph = cloneGraph(graphData);
    const sourceNode = nextGraph.nodes.find((node) => node.value === values.source);
    const targetNode = nextGraph.nodes.find((node) => node.value === values.target);
    const canCreateEdge =
      Boolean(sourceNode) &&
      Boolean(targetNode) &&
      sourceNode!.id !== targetNode!.id &&
      !nextGraph.edges.some(
        (edge) =>
          (edge.source === sourceNode!.id && edge.target === targetNode!.id) ||
          (edge.source === targetNode!.id && edge.target === sourceNode!.id)
      );

    if (canCreateEdge) {
      nextGraph.edges.push({
        id: `edge_${sourceNode!.id}_${targetNode!.id}`,
        source: sourceNode!.id,
        target: targetNode!.id,
      });
    }
    let committedEdge = false;

    execute(graphAddEdgeGenerator(cloneGraph(graphData), values.source, values.target), (resultGraph) => {
      setGraphData(resultGraph as GraphData);
    }, {
      startPaused: true,
      operation: 'add-edge',
      onStep: (step: Step) => {
        if (
          !committedEdge &&
          canCreateEdge &&
          step.type === 'insert' &&
          step.line === GRAPH_LINE_NUMBERS.ADD_EDGE.PUSH_EDGE
        ) {
          committedEdge = true;
          setGraphData(nextGraph);
        }
      },
    });

    setInputValue('');
    setSecondaryInputValue('');
  };

  const handleDelete = () => {
    if (structure === 'array') {
      const deleteIndex = parseInteger(secondaryInputValue || inputValue);

      if (deleteIndex === null) {
        setValidationMessage('Enter an integer index to delete');
        return;
      }

      if (deleteIndex < 0 || deleteIndex >= arrayData.values.length) {
        setValidationMessage(`Enter an index between 0 and ${Math.max(0, arrayData.values.length - 1)}`);
        return;
      }

      execute(arrayDeleteGenerator(arrayData.values, deleteIndex), (result) => {
        setArrayData({
          values: result as number[],
          activeIndices: [],
          foundIndex: null,
        });
      }, {
        startPaused: true,
        operation: 'delete',
        onStep: (step: Step) => {
          setArrayData({
            values: step.valuesSnapshot ?? arrayData.values,
            activeIndices: step.activeIndices ?? [],
            foundIndex: null,
          });
        },
      });

      setSecondaryInputValue('');
      setValidationMessage('');
      return;
    }

    if (structure === 'stack') {
      if (stackData.values.length === 0) {
        setValidationMessage('Load or push values before popping the stack');
        return;
      }

      execute(stackPopGenerator(stackData.values), (result) => {
        const values = result as number[];
        setStackData({
          values,
          activeIndices: [],
          topIndex: values.length > 0 ? values.length - 1 : null,
          foundIndex: null,
        });
      }, {
        startPaused: true,
        operation: 'delete',
        onStep: (step: Step) => {
          const values = step.valuesSnapshot ?? stackData.values;
          setStackData({
            values,
            activeIndices: step.activeIndices ?? [],
            topIndex: values.length > 0 ? values.length - 1 : null,
            foundIndex: null,
          });
        },
      });
      setValidationMessage('');
      return;
    }

    if (structure === 'queue') {
      if (queueData.values.length === 0) {
        setValidationMessage('Load or enqueue values before dequeuing');
        return;
      }

      execute(queueDequeueGenerator(queueData.values), (result) => {
        const values = result as number[];
        setQueueData({
          values,
          activeIndices: [],
          frontIndex: values.length > 0 ? 0 : null,
          rearIndex: values.length > 0 ? values.length - 1 : null,
          foundIndex: null,
        });
      }, {
        startPaused: true,
        operation: 'delete',
        onStep: (step: Step) => {
          const values = step.valuesSnapshot ?? queueData.values;
          setQueueData({
            values,
            activeIndices: step.activeIndices ?? [],
            frontIndex: values.length > 0 ? 0 : null,
            rearIndex: values.length > 0 ? values.length - 1 : null,
            foundIndex: null,
          });
        },
      });
      setValidationMessage('');
      return;
    }

    if (structure === 'heap') {
      if (heapData.values.length === 0) {
        setValidationMessage('Load or insert values before extracting from the heap');
        return;
      }

      execute(heapExtractMaxGenerator(heapData.values), (result) => {
        setHeapData({
          values: result as number[],
          activeIndices: [],
          foundIndex: null,
        });
      }, {
        startPaused: true,
        operation: 'delete',
        onStep: (step: Step) => {
          setHeapData({
            values: step.valuesSnapshot ?? heapData.values,
            activeIndices: step.activeIndices ?? [],
            foundIndex: null,
          });
        },
      });
      setValidationMessage('');
      return;
    }

    if (structure === 'hash-table') {
      if (!validateInput(inputValue)) return;

      const value = Number(inputValue);

      execute(hashTableDeleteGenerator(hashTableData.buckets, value), (result) => {
        setHashTableData({
          buckets: result as number[][],
          activeBucketIndex: null,
          activeEntryIndex: null,
          foundBucketIndex: null,
          foundEntryIndex: null,
        });
      }, {
        startPaused: true,
        operation: 'delete',
        onStep: (step: Step) => {
          setHashTableData({
            buckets: step.bucketSnapshot ?? hashTableData.buckets,
            activeBucketIndex: step.activeBucketIndex ?? null,
            activeEntryIndex: step.activeEntryIndex ?? null,
            foundBucketIndex: null,
            foundEntryIndex: null,
          });
        },
      });
      setValidationMessage('');
      return;
    }

    if (!validateInput(inputValue)) return;

    const value = Number(inputValue);

    if (structure === 'linked-list') {
      execute(linkedListDeleteGenerator(cloneLinkedList(linkedListHead), value), (newHead) => {
        setLinkedListHead(newHead as LinkedListNode | null);
      }, {
        startPaused: true,
        operation: 'delete',
      });
    } else if (structure === 'doubly-linked-list') {
      execute(doublyDeleteGenerator(cloneDoublyLinkedList(doublyLinkedListHead), value), (newHead) => {
        setDoublyLinkedListHead(newHead as DoublyLinkedListNode | null);
      }, {
        startPaused: true,
        operation: 'delete',
      });
    } else {
      execute(bstDeleteGenerator(bstRoot, value), (newRoot) => {
        setBstRoot(newRoot as TreeNode | null);
      }, {
        startPaused: true,
        operation: 'delete',
      });
    }

    setInputValue('');
  };

  const handleSearch = () => {
    if (structure === 'array') {
      if (!validateInput(inputValue)) return;

      const target = Number(inputValue);

      execute(arraySearchGenerator(arrayData.values, target), (result) => {
        const typedResult = result as { foundIndex: number };
        setArrayData({
          values: arrayData.values,
          activeIndices: [],
          foundIndex: typedResult.foundIndex >= 0 ? typedResult.foundIndex : null,
        });
      }, {
        startPaused: true,
        operation: 'search',
        onStep: (step: Step) => {
          setArrayData({
            values: step.valuesSnapshot ?? arrayData.values,
            activeIndices: step.activeIndices ?? [],
            foundIndex: step.foundIndex ?? null,
          });
        },
      });
      setValidationMessage('');
      return;
    }

    if (structure === 'stack') {
      if (!validateInput(inputValue)) return;

      const target = Number(inputValue);

      execute(stackSearchGenerator(stackData.values, target), (result) => {
        const typedResult = result as { foundIndex: number };
        setStackData({
          values: stackData.values,
          activeIndices: [],
          topIndex: stackData.values.length > 0 ? stackData.values.length - 1 : null,
          foundIndex: typedResult.foundIndex >= 0 ? typedResult.foundIndex : null,
        });
      }, {
        startPaused: true,
        operation: 'search',
        onStep: (step: Step) => {
          const values = step.valuesSnapshot ?? stackData.values;
          setStackData({
            values,
            activeIndices: step.activeIndices ?? [],
            topIndex: values.length > 0 ? values.length - 1 : null,
            foundIndex: step.foundIndex ?? null,
          });
        },
      });
      setValidationMessage('');
      return;
    }

    if (structure === 'queue') {
      if (!validateInput(inputValue)) return;

      const target = Number(inputValue);

      execute(queueSearchGenerator(queueData.values, target), (result) => {
        const typedResult = result as { foundIndex: number };
        setQueueData({
          values: queueData.values,
          activeIndices: [],
          frontIndex: queueData.values.length > 0 ? 0 : null,
          rearIndex: queueData.values.length > 0 ? queueData.values.length - 1 : null,
          foundIndex: typedResult.foundIndex >= 0 ? typedResult.foundIndex : null,
        });
      }, {
        startPaused: true,
        operation: 'search',
        onStep: (step: Step) => {
          const values = step.valuesSnapshot ?? queueData.values;
          setQueueData({
            values,
            activeIndices: step.activeIndices ?? [],
            frontIndex: values.length > 0 ? 0 : null,
            rearIndex: values.length > 0 ? values.length - 1 : null,
            foundIndex: step.foundIndex ?? null,
          });
        },
      });
      setValidationMessage('');
      return;
    }

    if (structure === 'heap') {
      if (!validateInput(inputValue)) return;

      const target = Number(inputValue);

      execute(heapSearchGenerator(heapData.values, target), (result) => {
        const typedResult = result as { foundIndex: number };
        setHeapData({
          values: heapData.values,
          activeIndices: [],
          foundIndex: typedResult.foundIndex >= 0 ? typedResult.foundIndex : null,
        });
      }, {
        startPaused: true,
        operation: 'search',
        onStep: (step: Step) => {
          setHeapData({
            values: step.valuesSnapshot ?? heapData.values,
            activeIndices: step.activeIndices ?? [],
            foundIndex: step.foundIndex ?? null,
          });
        },
      });
      setValidationMessage('');
      return;
    }

    if (structure === 'hash-table') {
      if (!validateInput(inputValue)) return;

      const value = Number(inputValue);

      execute(hashTableSearchGenerator(hashTableData.buckets, value), undefined, {
        startPaused: true,
        operation: 'search',
        onStep: (step: Step) => {
          setHashTableData({
            buckets: step.bucketSnapshot ?? hashTableData.buckets,
            activeBucketIndex: step.activeBucketIndex ?? null,
            activeEntryIndex: step.activeEntryIndex ?? null,
            foundBucketIndex: step.foundBucketIndex ?? null,
            foundEntryIndex: step.foundEntryIndex ?? null,
          });
        },
      });
      setValidationMessage('');
      return;
    }

    if (structure === 'two-pointer') {
      const target = parseInteger(secondaryInputValue) ?? twoPointerData.target;

      if (twoPointerData.values.length < 2 || target === null) {
        setValidationMessage('Load a sorted array and target before running the algorithm');
        return;
      }

      execute(twoPointerGenerator(twoPointerData.values, target), (result) => {
        const match = (result as { match: [number, number] | null }).match;
        setTwoPointerData({
          ...twoPointerData,
          target,
          matchedIndices: match ?? [],
        });
      }, {
        startPaused: true,
        operation: 'search',
        onStep: (step: Step) => {
          setTwoPointerData({
            ...twoPointerData,
            target,
            leftIndex: step.leftIndex ?? null,
            rightIndex: step.rightIndex ?? null,
            matchedIndices: step.matchedIndices ?? [],
          });
        },
      });
      setValidationMessage('');
      return;
    }

    if (structure === 'sliding-window') {
      const windowSize = parseInteger(secondaryInputValue) ?? slidingWindowData.windowSize;

      if (slidingWindowData.values.length < 1 || windowSize === null) {
        setValidationMessage('Load an array and valid window size before running the algorithm');
        return;
      }

      execute(slidingWindowGenerator(slidingWindowData.values, windowSize), (result) => {
        const typedResult = result as { bestSum: number; bestStart: number };
        setSlidingWindowData({
          ...slidingWindowData,
          windowSize,
          bestStart: typedResult.bestStart,
          bestEnd: typedResult.bestStart + windowSize - 1,
          bestSum: typedResult.bestSum,
          currentSum: typedResult.bestSum,
        });
      }, {
        startPaused: true,
        operation: 'search',
        onStep: (step: Step) => {
          setSlidingWindowData({
            ...slidingWindowData,
            windowSize,
            windowStart: step.windowStart ?? null,
            windowEnd: step.windowEnd ?? null,
            bestStart: step.bestStart ?? null,
            bestEnd: step.bestEnd ?? null,
            currentSum: step.currentSum ?? null,
            bestSum: step.bestSum ?? null,
          });
        },
      });
      setValidationMessage('');
      return;
    }

    if (structure === 'binary-search') {
      const target = parseInteger(secondaryInputValue) ?? binarySearchData.target;

      if (binarySearchData.values.length < 2 || target === null) {
        setValidationMessage('Load a sorted array and target before running the algorithm');
        return;
      }

      execute(binarySearchGenerator(binarySearchData.values, target), (result) => {
        const typedResult = result as { foundIndex: number };
        setBinarySearchData({
          ...binarySearchData,
          target,
          foundIndex: typedResult.foundIndex >= 0 ? typedResult.foundIndex : null,
        });
      }, {
        startPaused: true,
        operation: 'search',
        onStep: (step: Step) => {
          setBinarySearchData({
            ...binarySearchData,
            target,
            lowIndex: step.lowIndex ?? null,
            midIndex: step.midIndex ?? null,
            highIndex: step.highIndex ?? null,
            foundIndex: step.foundIndex ?? null,
          });
        },
      });
      setValidationMessage('');
      return;
    }

    if (structure === 'merge-sort') {
      if (mergeSortData.values.length < 2) {
        setValidationMessage('Load an array with at least two values before sorting');
        return;
      }

      execute(mergeSortGenerator(mergeSortData.values), (result) => {
        const values = result as number[];
        setMergeSortData({
          values,
          activeIndices: [],
          sortedIndices: values.map((_, index) => index),
          mergeStart: 0,
          mergeEnd: values.length - 1,
        });
      }, {
        startPaused: true,
        operation: 'sort',
        onStep: (step: Step) => {
          setMergeSortData({
            values: step.valuesSnapshot ?? mergeSortData.values,
            activeIndices: step.activeIndices ?? [],
            sortedIndices: step.sortedIndices ?? [],
            mergeStart: step.mergeStart ?? null,
            mergeEnd: step.mergeEnd ?? null,
          });
        },
      });
      setValidationMessage('');
      return;
    }

    if (structure === 'prefix-sum') {
      const range = parseRangeInput(secondaryInputValue);

      if (prefixSumData.values.length < 2) {
        setValidationMessage('Load an array with at least two values before querying');
        return;
      }

      if (prefixSumData.prefixValues.length !== prefixSumData.values.length) {
        setValidationMessage('Build the prefix array before running a range query');
        return;
      }

      if (range === null) {
        setValidationMessage('Enter a range like `2,5` in the second input');
        return;
      }

      if (
        range.left < 0 ||
        range.right < range.left ||
        range.right >= prefixSumData.values.length
      ) {
        setValidationMessage(
          `Enter a valid range between 0 and ${prefixSumData.values.length - 1}`
        );
        return;
      }

      execute(
        prefixSumRangeQueryGenerator(
          prefixSumData.values,
          prefixSumData.prefixValues,
          range.left,
          range.right
        ),
        (result) => {
          const typedResult = result as { rangeSum: number };
          setPrefixSumData({
            ...prefixSumData,
            activeIndices: [],
            prefixActiveIndices: [],
            queryLeft: range.left,
            queryRight: range.right,
            rangeSum: typedResult.rangeSum,
          });
        },
        {
          startPaused: true,
          operation: 'search',
          onStep: (step: Step) => {
            setPrefixSumData({
              values: step.valuesSnapshot ?? prefixSumData.values,
              prefixValues: step.prefixValuesSnapshot ?? prefixSumData.prefixValues,
              activeIndices: step.activeIndices ?? [],
              prefixActiveIndices: step.prefixActiveIndices ?? [],
              queryLeft: step.queryLeft ?? null,
              queryRight: step.queryRight ?? null,
              rangeSum: step.rangeSum ?? null,
            });
          },
        }
      );
      setValidationMessage('');
      return;
    }

    if (structure === 'kadane') {
      if (kadaneData.values.length < 2) {
        setValidationMessage('Load an array with at least two values before running Kadane');
        return;
      }

      execute(kadaneGenerator(kadaneData.values), (result) => {
        const typedResult = result as { bestSum: number; bestStart: number; bestEnd: number };
        setKadaneData({
          ...kadaneData,
          currentStart: typedResult.bestStart,
          currentEnd: typedResult.bestEnd,
          bestStart: typedResult.bestStart,
          bestEnd: typedResult.bestEnd,
          currentSum: typedResult.bestSum,
          bestSum: typedResult.bestSum,
        });
      }, {
        startPaused: true,
        operation: 'search',
        onStep: (step: Step) => {
          setKadaneData({
            values: step.valuesSnapshot ?? kadaneData.values,
            currentStart: step.currentStart ?? null,
            currentEnd: step.currentEnd ?? null,
            bestStart: step.bestStart ?? null,
            bestEnd: step.bestEnd ?? null,
            currentSum: step.currentSum ?? null,
            bestSum: step.bestSum ?? null,
          });
        },
      });
      setValidationMessage('');
      return;
    }

    if (structure === 'recursion') {
      if (recursionData.input === null) {
        setValidationMessage('Set an integer input before running the selected recursion example');
        return;
      }

      const generator =
        recursionData.example === 'fibonacci'
          ? fibonacciGenerator(recursionData.input)
          : recursionData.example === 'sum-to-n'
            ? sumToNGenerator(recursionData.input)
            : factorialGenerator(recursionData.input);

      execute(generator, (result) => {
        const typedResult = result as { result: number };
        setRecursionData({
          ...recursionData,
          input: recursionData.input,
          frames: [],
          result: typedResult.result,
          activeFrameId: null,
        });
      }, {
        startPaused: true,
        operation: 'search',
        onStep: (step: Step) => {
          const frames = step.recursionFramesSnapshot ?? recursionData.frames;
          const activeFrameId = frames.length > 0 ? frames[frames.length - 1].id : null;

          setRecursionData({
            example: step.recursionExample ?? recursionData.example,
            input: step.recursionInput ?? recursionData.input,
            frames,
            result: step.recursionResult ?? null,
            activeFrameId,
          });
        },
      });
      setValidationMessage('');
      return;
    }

    if (!validateInput(inputValue)) return;

    if (structure === 'graph') {
      const targetValue = Number(inputValue);
      const startValue = graphData.nodes[0]?.value;

      execute(graphSearchGenerator(graphData, targetValue, startValue), undefined, {
        startPaused: true,
        operation: 'search',
      });
    } else if (structure === 'linked-list') {
      execute(linkedListSearchGenerator(linkedListHead, Number(inputValue)), undefined, {
        startPaused: true,
        operation: 'search',
      });
    } else if (structure === 'doubly-linked-list') {
      execute(doublySearchGenerator(doublyLinkedListHead, Number(inputValue)), undefined, {
        startPaused: true,
        operation: 'search',
      });
    } else {
      execute(bstSearchGenerator(bstRoot, Number(inputValue)), undefined, {
        startPaused: true,
        operation: 'search',
      });
    }
  };

  const handleTraverse = () => {
    if (structure === 'array') {
      execute(arrayTraverseGenerator(arrayData.values), undefined, {
        startPaused: true,
        operation: 'traverse',
        onStep: (step: Step) => {
          setArrayData({
            values: step.valuesSnapshot ?? arrayData.values,
            activeIndices: step.activeIndices ?? [],
            foundIndex: null,
          });
        },
      });
      return;
    }

    if (structure === 'stack') {
      execute(stackTraverseGenerator(stackData.values), undefined, {
        startPaused: true,
        operation: 'traverse',
        onStep: (step: Step) => {
          const values = step.valuesSnapshot ?? stackData.values;
          setStackData({
            values,
            activeIndices: step.activeIndices ?? [],
            topIndex: values.length > 0 ? values.length - 1 : null,
            foundIndex: null,
          });
        },
      });
      return;
    }

    if (structure === 'queue') {
      execute(queueTraverseGenerator(queueData.values), undefined, {
        startPaused: true,
        operation: 'traverse',
        onStep: (step: Step) => {
          const values = step.valuesSnapshot ?? queueData.values;
          setQueueData({
            values,
            activeIndices: step.activeIndices ?? [],
            frontIndex: values.length > 0 ? 0 : null,
            rearIndex: values.length > 0 ? values.length - 1 : null,
            foundIndex: null,
          });
        },
      });
      return;
    }

    if (structure === 'heap') {
      execute(heapTraverseGenerator(heapData.values), undefined, {
        startPaused: true,
        operation: 'traverse',
        onStep: (step: Step) => {
          setHeapData({
            values: step.valuesSnapshot ?? heapData.values,
            activeIndices: step.activeIndices ?? [],
            foundIndex: null,
          });
        },
      });
      return;
    }

    if (structure === 'hash-table') {
      execute(hashTableTraverseGenerator(hashTableData.buckets), undefined, {
        startPaused: true,
        operation: 'traverse',
        onStep: (step: Step) => {
          setHashTableData({
            buckets: step.bucketSnapshot ?? hashTableData.buckets,
            activeBucketIndex: step.activeBucketIndex ?? null,
            activeEntryIndex: step.activeEntryIndex ?? null,
            foundBucketIndex: null,
            foundEntryIndex: null,
          });
        },
      });
      return;
    }

    if (structure === 'prefix-sum') {
      if (prefixSumData.values.length < 2) {
        setValidationMessage('Load an array with at least two values before building prefix sums');
        return;
      }

      execute(buildPrefixSumGenerator(prefixSumData.values), (result) => {
        setPrefixSumData({
          ...prefixSumData,
          prefixValues: result as number[],
          activeIndices: [],
          prefixActiveIndices: [],
          queryLeft: null,
          queryRight: null,
          rangeSum: null,
        });
      }, {
        startPaused: true,
        operation: 'traverse',
        onStep: (step: Step) => {
          setPrefixSumData({
            values: step.valuesSnapshot ?? prefixSumData.values,
            prefixValues: step.prefixValuesSnapshot ?? prefixSumData.prefixValues,
            activeIndices: step.activeIndices ?? [],
            prefixActiveIndices: step.prefixActiveIndices ?? [],
            queryLeft: null,
            queryRight: null,
            rangeSum: step.rangeSum ?? null,
          });
        },
      });
      setValidationMessage('');
      return;
    }

    if (structure === 'graph') {
      const startValue = parseInteger(inputValue) ?? graphData.nodes[0]?.value;

      execute(graphDfsGenerator(graphData, startValue), undefined, {
        startPaused: true,
        operation: 'traverse',
      });
    } else if (structure === 'linked-list') {
      execute(linkedListTraverseGenerator(linkedListHead), undefined, {
        startPaused: true,
        operation: 'traverse',
      });
    } else if (structure === 'doubly-linked-list') {
      execute(doublyTraverseGenerator(doublyLinkedListHead), undefined, {
        startPaused: true,
        operation: 'traverse',
      });
    } else {
      execute(bstInorderGenerator(bstRoot), undefined, {
        startPaused: true,
        operation: 'traverse',
      });
    }
  };

  const handleBfs = () => {
    if (structure === 'graph') {
      const startValue = parseInteger(inputValue) ?? graphData.nodes[0]?.value;

      execute(graphBfsGenerator(graphData, startValue), undefined, {
        startPaused: true,
        operation: 'bfs',
      });
      return;
    }

    execute(bstBfsGenerator(bstRoot), undefined, {
      startPaused: true,
      operation: 'bfs',
    });
  };

  const handleRandomTree = () => {
    const values = new Set<number>();

    while (values.size < 7) {
      values.add(Math.floor(Math.random() * 90) + 10);
    }

    reset();
    setBstRoot(buildTree(Array.from(values)));
    setValidationMessage('');
    console.debug('[BST] Random tree created', {
      values: Array.from(values),
    });
  };

  const handleRandomList = () => {
    const values = Array.from({ length: 6 }, () => Math.floor(Math.random() * 90) + 10);

    reset();
    setLinkedListHead(buildLinkedList(values));
    setValidationMessage('');
    console.debug('[LinkedList] Random list created', {
      values,
    });
  };

  const handleRandomDoublyList = () => {
    const values = Array.from({ length: 6 }, () => Math.floor(Math.random() * 90) + 10);

    reset();
    setDoublyLinkedListHead(buildDoublyLinkedList(values));
    setValidationMessage('');
    console.debug('[DoublyLinkedList] Random list created', {
      values,
    });
  };

  const handleRandomGraph = () => {
    reset();
    setGraphData(buildRandomGraph());
    setValidationMessage('');
    console.debug('[Graph] Random graph created');
  };

  const handleRandomTwoPointer = () => {
    const values = Array.from({ length: 8 }, () => Math.floor(Math.random() * 40) + 1).sort((a, b) => a - b);
    const leftIndex = Math.floor(Math.random() * (values.length - 1));
    const rightIndex = Math.floor(Math.random() * (values.length - leftIndex - 1)) + leftIndex + 1;
    const target = values[leftIndex] + values[rightIndex];

    reset();
    setTwoPointerData({
      values,
      target,
      leftIndex: null,
      rightIndex: null,
      matchedIndices: [],
    });
    setInputValue(values.join(', '));
    setSecondaryInputValue(target.toString());
    setValidationMessage('');
  };

  const handleRandomSlidingWindow = () => {
    const values = Array.from({ length: 8 }, () => Math.floor(Math.random() * 25) + 1);
    const windowSize = Math.floor(Math.random() * 3) + 3;

    reset();
    setSlidingWindowData({
      values,
      windowSize,
      windowStart: null,
      windowEnd: null,
      bestStart: null,
      bestEnd: null,
      currentSum: null,
      bestSum: null,
    });
    setInputValue(values.join(', '));
    setSecondaryInputValue(windowSize.toString());
    setValidationMessage('');
  };

  const handleRandomBinarySearch = () => {
    const values = Array.from({ length: 8 }, () => Math.floor(Math.random() * 50) + 1).sort((a, b) => a - b);
    const targetIndex = Math.floor(Math.random() * values.length);
    const target = values[targetIndex];

    reset();
    setBinarySearchData({
      values,
      target,
      lowIndex: null,
      midIndex: null,
      highIndex: null,
      foundIndex: null,
    });
    setInputValue(values.join(', '));
    setSecondaryInputValue(target.toString());
    setValidationMessage('');
  };

  const handleRandomMergeSort = () => {
    const values = Array.from({ length: 8 }, () => Math.floor(Math.random() * 50) + 1);

    reset();
    setMergeSortData({
      values,
      activeIndices: [],
      sortedIndices: [],
      mergeStart: null,
      mergeEnd: null,
    });
    setInputValue(values.join(', '));
    setSecondaryInputValue('');
    setValidationMessage('');
  };

  const handleRandomPrefixSum = () => {
    const values = Array.from({ length: 8 }, () => Math.floor(Math.random() * 25) + 1);
    const left = Math.floor(Math.random() * (values.length - 1));
    const right = Math.floor(Math.random() * (values.length - left)) + left;

    reset();
    setPrefixSumData({
      values,
      prefixValues: [],
      activeIndices: [],
      prefixActiveIndices: [],
      queryLeft: null,
      queryRight: null,
      rangeSum: null,
    });
    setInputValue(values.join(', '));
    setSecondaryInputValue(`${left}, ${right}`);
    setValidationMessage('');
  };

  const handleRandomKadane = () => {
    const values = Array.from({ length: 8 }, () => Math.floor(Math.random() * 31) - 10);

    reset();
    setKadaneData({
      values,
      currentStart: null,
      currentEnd: null,
      bestStart: null,
      bestEnd: null,
      currentSum: null,
      bestSum: null,
    });
    setInputValue(values.join(', '));
    setSecondaryInputValue('');
    setValidationMessage('');
  };

  const handleRandomRecursion = () => {
    const value =
      recursionData.example === 'fibonacci'
        ? Math.floor(Math.random() * 5) + 4
        : recursionData.example === 'sum-to-n'
          ? Math.floor(Math.random() * 8) + 5
          : Math.floor(Math.random() * 5) + 3;

    reset();
    setRecursionData({
      ...recursionData,
      input: value,
      frames: [],
      result: null,
      activeFrameId: null,
    });
    setInputValue(value.toString());
    setSecondaryInputValue('');
    setValidationMessage('');
  };

  const handleRandomArray = () => {
    const values = Array.from({ length: 7 }, () => Math.floor(Math.random() * 40) + 1);

    reset();
    setArrayData({
      values,
      activeIndices: [],
      foundIndex: null,
    });
    setInputValue(values.join(', '));
    setSecondaryInputValue('');
    setValidationMessage('');
  };

  const handleRandomStack = () => {
    const values = Array.from({ length: 6 }, () => Math.floor(Math.random() * 40) + 1);

    reset();
    setStackData({
      values,
      activeIndices: [],
      topIndex: values.length - 1,
      foundIndex: null,
    });
    setInputValue(values.join(', '));
    setSecondaryInputValue('');
    setValidationMessage('');
  };

  const handleRandomQueue = () => {
    const values = Array.from({ length: 6 }, () => Math.floor(Math.random() * 40) + 1);

    reset();
    setQueueData({
      values,
      activeIndices: [],
      frontIndex: 0,
      rearIndex: values.length - 1,
      foundIndex: null,
    });
    setInputValue(values.join(', '));
    setSecondaryInputValue('');
    setValidationMessage('');
  };

  const handleRandomHeap = () => {
    const values = Array.from({ length: 7 }, () => Math.floor(Math.random() * 50) + 1);

    reset();
    setHeapData({
      values: buildMaxHeap(values),
      activeIndices: [],
      foundIndex: null,
    });
    setInputValue(values.join(', '));
    setSecondaryInputValue('');
    setValidationMessage('');
  };

  const handleRandomHashTable = () => {
    const values = Array.from({ length: 7 }, () => Math.floor(Math.random() * 40) + 1);

    reset();
    setHashTableData({
      buckets: buildHashTable(values),
      activeBucketIndex: null,
      activeEntryIndex: null,
      foundBucketIndex: null,
      foundEntryIndex: null,
    });
    setInputValue(values.join(', '));
    setSecondaryInputValue('');
    setValidationMessage('');
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setValidationMessage('');
  };

  const handleSecondaryInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSecondaryInputValue(event.target.value);
    setValidationMessage('');
  };

  const inputPlaceholder =
    structure === 'graph'
      ? 'Node value'
      : structure === 'recursion'
        ? recursionData.example === 'fibonacci'
          ? '6'
          : recursionData.example === 'sum-to-n'
            ? '8'
            : '5'
      : structure === 'array' || structure === 'stack' || structure === 'queue' || structure === 'heap' || structure === 'hash-table' || structure === 'two-pointer' || structure === 'sliding-window' || structure === 'binary-search' || structure === 'merge-sort' || structure === 'prefix-sum' || structure === 'kadane'
        ? '1, 3, 4, 7, 9, 12'
        : 'Enter value';

  const insertLabel =
    structure === 'array'
      ? 'Load / Append'
      : structure === 'stack'
        ? 'Load / Push'
      : structure === 'queue'
        ? 'Load / Enqueue'
      : structure === 'heap'
        ? 'Load / Insert'
      : structure === 'hash-table'
        ? 'Load / Insert'
      : structure === 'merge-sort'
        ? 'Load Array'
      : structure === 'prefix-sum'
        ? 'Load Array'
      : structure === 'kadane'
        ? 'Load Array'
      : structure === 'recursion'
        ? 'Set n'
      : structure === 'bst'
      ? 'Insert'
      : structure === 'graph'
        ? 'Add Node'
        : structure === 'two-pointer' || structure === 'sliding-window' || structure === 'binary-search'
          ? 'Load Array'
        : 'Append';
  const searchLabel =
    structure === 'merge-sort'
      ? 'Sort'
      : structure === 'prefix-sum'
        ? 'Query Sum'
        : structure === 'kadane'
          ? 'Max Sum'
        : structure === 'recursion'
          ? recursionData.example === 'fibonacci'
            ? 'Fibonacci'
            : recursionData.example === 'sum-to-n'
              ? 'Sum To N'
              : 'Factorial'
        : 'Search';
  const traverseLabel =
    structure === 'graph'
      ? 'DFS'
      : structure === 'prefix-sum'
        ? 'Build Prefix'
        : 'Traverse';
  const randomLabel =
    structure === 'bst'
      ? 'Random Tree'
      : structure === 'array'
        ? 'Random Array'
      : structure === 'stack'
        ? 'Random Stack'
      : structure === 'queue'
        ? 'Random Queue'
      : structure === 'heap'
        ? 'Random Heap'
      : structure === 'hash-table'
        ? 'Random Hash Table'
      : structure === 'graph'
        ? 'Random Graph'
        : structure === 'two-pointer'
          ? 'Random Two Pointer'
        : structure === 'sliding-window'
          ? 'Random Sliding Window'
        : structure === 'binary-search'
          ? 'Random Binary Search'
        : structure === 'merge-sort'
          ? 'Random Merge Sort'
        : structure === 'prefix-sum'
          ? 'Random Prefix Sum'
        : structure === 'kadane'
          ? 'Random Kadane'
        : structure === 'recursion'
          ? 'Random Recursion'
        : structure === 'doubly-linked-list'
          ? 'Random Doubly List'
          : 'Random List';

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type={
            structure === 'array' || structure === 'stack' || structure === 'queue' || structure === 'heap' || structure === 'hash-table' || structure === 'two-pointer' || structure === 'sliding-window' || structure === 'binary-search' || structure === 'merge-sort' || structure === 'prefix-sum' || structure === 'kadane'
              ? 'text'
              : 'number'
          }
          value={inputValue}
          onChange={handleInputChange}
          placeholder={inputPlaceholder}
          disabled={isBusy}
          style={{
            flex: 1,
            padding: '8px 12px',
            border: '1px solid #555',
            borderRadius: '4px',
            background: '#1e1e1e',
            color: '#fff',
            fontSize: '14px',
            opacity: isBusy ? 0.5 : 1,
          }}
        />
        {(structure === 'array' || structure === 'graph' || structure === 'two-pointer' || structure === 'sliding-window' || structure === 'binary-search' || structure === 'prefix-sum') && (
          <input
            type={structure === 'graph' ? 'number' : 'text'}
            value={secondaryInputValue}
            onChange={handleSecondaryInputChange}
            placeholder={
              structure === 'array'
                ? 'Index (delete)'
              : structure === 'graph'
                ? 'Connect to'
              : structure === 'two-pointer'
                ? 'Target'
              : structure === 'sliding-window'
                ? 'Window size'
                : structure === 'prefix-sum'
                  ? 'Range: left,right'
                  : 'Target'
            }
            disabled={isBusy}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid #555',
              borderRadius: '4px',
              background: '#1e1e1e',
              color: '#fff',
              fontSize: '14px',
              opacity: isBusy ? 0.5 : 1,
            }}
          />
        )}
      </div>

        {validationMessage && (
        <div style={{ fontSize: '12px', color: '#f44336' }}>{validationMessage}</div>
      )}

      {structure === 'recursion' && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'factorial' as const, label: 'Factorial' },
            { id: 'fibonacci' as const, label: 'Fibonacci' },
            { id: 'sum-to-n' as const, label: 'Sum To N' },
          ].map((option) => {
            const isActive = recursionData.example === option.id;

            return (
              <button
                key={option.id}
                onClick={() => handleRecursionExampleChange(option.id)}
                disabled={isBusy}
                style={{
                  ...baseButtonStyle,
                  flex: 'unset',
                  minWidth: 'unset',
                  background: isActive ? '#7c3aed' : '#374151',
                  opacity: isBusy ? 0.5 : 1,
                  cursor: isBusy ? 'not-allowed' : 'pointer',
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          onClick={handleInsert}
          disabled={isBusy}
          style={{
            ...baseButtonStyle,
            background: '#4caf50',
            opacity: isBusy ? 0.5 : 1,
            cursor: isBusy ? 'not-allowed' : 'pointer',
          }}
        >
          {insertLabel}
        </button>

        {structure === 'graph' && (
          <button
            onClick={handleAddEdge}
            disabled={isBusy}
            style={{
              ...baseButtonStyle,
              background: '#14b8a6',
              opacity: isBusy ? 0.5 : 1,
              cursor: isBusy ? 'not-allowed' : 'pointer',
            }}
          >
            Add Edge
          </button>
        )}

        {structure !== 'graph' && structure !== 'two-pointer' && structure !== 'sliding-window' && structure !== 'binary-search' && structure !== 'merge-sort' && structure !== 'prefix-sum' && structure !== 'kadane' && structure !== 'recursion' && (
          <button
            onClick={handleDelete}
            disabled={isBusy}
            style={{
              ...baseButtonStyle,
              background: '#ff9800',
              opacity: isBusy ? 0.5 : 1,
              cursor: isBusy ? 'not-allowed' : 'pointer',
            }}
          >
            {structure === 'array'
              ? 'Delete Index'
              : structure === 'stack'
                ? 'Pop'
                : structure === 'queue'
                  ? 'Dequeue'
                  : structure === 'heap'
                    ? 'Extract Max'
                    : 'Delete'}
          </button>
        )}

        <button
          onClick={handleSearch}
          disabled={isBusy}
          style={{
            ...baseButtonStyle,
            background: '#2196f3',
            opacity: isBusy ? 0.5 : 1,
            cursor: isBusy ? 'not-allowed' : 'pointer',
          }}
        >
          {searchLabel}
        </button>

        {structure !== 'two-pointer' && structure !== 'sliding-window' && structure !== 'binary-search' && structure !== 'merge-sort' && structure !== 'kadane' && structure !== 'recursion' && (
          <button
            onClick={handleTraverse}
            disabled={isBusy}
            style={{
              ...baseButtonStyle,
              background: '#9c27b0',
              opacity: isBusy ? 0.5 : 1,
              cursor: isBusy ? 'not-allowed' : 'pointer',
            }}
          >
            {traverseLabel}
          </button>
        )}

        {(structure === 'bst' || structure === 'graph') && (
          <button
            onClick={handleBfs}
            disabled={isBusy}
            style={{
              ...baseButtonStyle,
              background: '#7950f2',
              opacity: isBusy ? 0.5 : 1,
              cursor: isBusy ? 'not-allowed' : 'pointer',
            }}
          >
            BFS
          </button>
        )}

        <button
          onClick={
            structure === 'bst'
              ? handleRandomTree
              : structure === 'array'
                ? handleRandomArray
              : structure === 'stack'
                ? handleRandomStack
              : structure === 'queue'
                ? handleRandomQueue
              : structure === 'heap'
                ? handleRandomHeap
              : structure === 'hash-table'
                ? handleRandomHashTable
              : structure === 'graph'
                ? handleRandomGraph
                : structure === 'two-pointer'
                  ? handleRandomTwoPointer
                : structure === 'sliding-window'
                  ? handleRandomSlidingWindow
                : structure === 'binary-search'
                  ? handleRandomBinarySearch
                : structure === 'merge-sort'
                  ? handleRandomMergeSort
                : structure === 'prefix-sum'
                  ? handleRandomPrefixSum
                : structure === 'kadane'
                  ? handleRandomKadane
                : structure === 'recursion'
                  ? handleRandomRecursion
                : structure === 'doubly-linked-list'
                  ? handleRandomDoublyList
                  : handleRandomList
          }
          disabled={isBusy}
          style={{
            ...baseButtonStyle,
            background: '#0ca678',
            opacity: isBusy ? 0.5 : 1,
            cursor: isBusy ? 'not-allowed' : 'pointer',
          }}
        >
          {randomLabel}
        </button>
      </div>

      {structure === 'linked-list' && (
        <div style={{ fontSize: '12px', color: '#9ca3af' }}>
          Linked list insertions append to the tail so the node order is easy to follow.
        </div>
      )}

      {structure === 'array' && (
        <div style={{ fontSize: '12px', color: '#9ca3af' }}>
          Use comma-separated values to load an array. After that, enter one integer to append, use the second input for `Delete Index`, and use `Search` or `Traverse` to step through the array.
        </div>
      )}

      {structure === 'stack' && (
        <div style={{ fontSize: '12px', color: '#9ca3af' }}>
          Use comma-separated values to load a stack, or one integer to push. `Pop` removes the top value, and traversal visits from top to bottom.
        </div>
      )}

      {structure === 'queue' && (
        <div style={{ fontSize: '12px', color: '#9ca3af' }}>
          Use comma-separated values to load a queue, or one integer to enqueue. `Dequeue` removes the front value, and traversal visits in FIFO order.
        </div>
      )}

      {structure === 'heap' && (
        <div style={{ fontSize: '12px', color: '#9ca3af' }}>
          Use comma-separated values to load a max-heap, or one integer to insert. `Extract Max` removes the root and re-heapifies the tree.
        </div>
      )}

      {structure === 'hash-table' && (
        <div style={{ fontSize: '12px', color: '#9ca3af' }}>
          Use comma-separated values to load a hash table, or one integer to insert. Values hash into 5 buckets using modulo and collisions chain within the same bucket.
        </div>
      )}

      {structure === 'doubly-linked-list' && (
        <div style={{ fontSize: '12px', color: '#9ca3af' }}>
          Doubly linked lists show both `next` and `prev` pointers so you can see backward links update during insert and delete.
        </div>
      )}

      {structure === 'graph' && (
        <div style={{ fontSize: '12px', color: '#9ca3af' }}>
          Graph nodes use unique values. Use both inputs for `Add Edge`; BFS and DFS start from the first input when provided.
        </div>
      )}

      {structure === 'two-pointer' && (
        <div style={{ fontSize: '12px', color: '#9ca3af' }}>
          Load a sorted array and target, then run `Search` to watch left and right pointers converge on a pair sum.
        </div>
      )}

      {structure === 'sliding-window' && (
        <div style={{ fontSize: '12px', color: '#9ca3af' }}>
          Load an array and window size, then run `Search` to slide the window and track the maximum sum seen so far.
        </div>
      )}

      {structure === 'binary-search' && (
        <div style={{ fontSize: '12px', color: '#9ca3af' }}>
          Load a sorted array and target, then run `Search` to watch `low`, `mid`, and `high` squeeze down on the answer.
        </div>
      )}

      {structure === 'merge-sort' && (
        <div style={{ fontSize: '12px', color: '#9ca3af' }}>
          Load an array, then run `Sort` to watch merge sort split the data into halves and merge it back together in order.
        </div>
      )}

      {structure === 'prefix-sum' && (
        <div style={{ fontSize: '12px', color: '#9ca3af' }}>
          Load an array, use `Build Prefix` to precompute cumulative sums, then enter a range like `2,5` in the second input and run `Query Sum`.
        </div>
      )}

      {structure === 'kadane' && (
        <div style={{ fontSize: '12px', color: '#9ca3af' }}>
          Load an array, then run `Max Sum` to find the highest-sum contiguous subarray, even when the input includes negative numbers.
        </div>
      )}

      {structure === 'recursion' && (
        <div style={{ fontSize: '12px', color: '#9ca3af' }}>
          Switch between factorial, fibonacci, and sum-to-n. Set an integer `n`, then run the selected example to watch recursive calls stack up and unwind.
        </div>
      )}
    </div>
  );
}
