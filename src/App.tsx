import { CSSProperties, useMemo, useState } from 'react';
import { ExecutionProvider, useExecutionContext } from './state/ExecutionContext';
import TreeVisualization from './components/TreeVisualization/TreeVisualization';
import ArrayVisualization from './components/ArrayVisualization/ArrayVisualization';
import StackVisualization from './components/StackVisualization/StackVisualization';
import QueueVisualization from './components/QueueVisualization/QueueVisualization';
import HeapVisualization from './components/HeapVisualization/HeapVisualization';
import HashTableVisualization from './components/HashTableVisualization/HashTableVisualization';
import LinkedListVisualization from './components/LinkedListVisualization/LinkedListVisualization';
import DoublyLinkedListVisualization from './components/DoublyLinkedListVisualization/DoublyLinkedListVisualization';
import GraphVisualization from './components/GraphVisualization/GraphVisualization';
import TwoPointerVisualization from './components/TwoPointerVisualization/TwoPointerVisualization';
import SlidingWindowVisualization from './components/SlidingWindowVisualization/SlidingWindowVisualization';
import BinarySearchVisualization from './components/BinarySearchVisualization/BinarySearchVisualization';
import MergeSortVisualization from './components/MergeSortVisualization/MergeSortVisualization';
import PrefixSumVisualization from './components/PrefixSumVisualization/PrefixSumVisualization';
import KadaneVisualization from './components/KadaneVisualization/KadaneVisualization';
import RecursionVisualization from './components/RecursionVisualization/RecursionVisualization';
import CodePanel from './components/CodePanel/CodePanel';
import Controls from './components/Controls/Controls';
import OperationInput from './components/Input/OperationInput';
import {
  BFS_CODE,
  DELETE_CODE,
  INORDER_CODE,
  INSERT_CODE,
  SEARCH_CODE,
} from './algorithms/bst/code-strings';
import {
  APPEND_CODE,
  LINKED_LIST_DELETE_CODE,
  LINKED_LIST_SEARCH_CODE,
  LINKED_LIST_TRAVERSE_CODE,
} from './algorithms/linked-list/code-strings';
import {
  DOUBLY_APPEND_CODE,
  DOUBLY_DELETE_CODE,
  DOUBLY_SEARCH_CODE,
  DOUBLY_TRAVERSE_CODE,
} from './algorithms/doubly-linked-list/code-strings';
import {
  GRAPH_ADD_EDGE_CODE,
  GRAPH_ADD_NODE_CODE,
  GRAPH_BFS_CODE,
  GRAPH_DFS_CODE,
  GRAPH_SEARCH_CODE,
} from './algorithms/graph/code-strings';
import { TWO_POINTER_CODE } from './algorithms/two-pointer/code-strings';
import { SLIDING_WINDOW_CODE } from './algorithms/sliding-window/code-strings';
import { BINARY_SEARCH_CODE } from './algorithms/binary-search/code-strings';
import { MERGE_SORT_CODE } from './algorithms/merge-sort/code-strings';
import {
  PREFIX_SUM_BUILD_CODE,
  PREFIX_SUM_QUERY_CODE,
} from './algorithms/prefix-sum/code-strings';
import { KADANE_CODE } from './algorithms/kadane/code-strings';
import {
  FACTORIAL_RECURSION_CODE,
  FIBONACCI_RECURSION_CODE,
  SUM_TO_N_RECURSION_CODE,
} from './algorithms/recursion/code-strings';
import {
  ARRAY_APPEND_CODE,
  ARRAY_DELETE_CODE,
  ARRAY_SEARCH_CODE,
  ARRAY_TRAVERSE_CODE,
} from './algorithms/array/code-strings';
import {
  STACK_POP_CODE,
  STACK_PUSH_CODE,
  STACK_SEARCH_CODE,
  STACK_TRAVERSE_CODE,
} from './algorithms/stack/code-strings';
import {
  QUEUE_DEQUEUE_CODE,
  QUEUE_ENQUEUE_CODE,
  QUEUE_SEARCH_CODE,
  QUEUE_TRAVERSE_CODE,
} from './algorithms/queue/code-strings';
import {
  HEAP_DELETE_CODE,
  HEAP_INSERT_CODE,
  HEAP_SEARCH_CODE,
  HEAP_TRAVERSE_CODE,
} from './algorithms/heap/code-strings';
import {
  HASH_TABLE_DELETE_CODE,
  HASH_TABLE_INSERT_CODE,
  HASH_TABLE_SEARCH_CODE,
  HASH_TABLE_TRAVERSE_CODE,
} from './algorithms/hash-table/code-strings';
import { Step, StructureKind } from './types';

const appContainerStyle: CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#1a1a2e',
  color: '#eee',
};

const appHeaderStyle: CSSProperties = {
  padding: '16px 24px',
  backgroundColor: '#16213e',
  borderBottom: '1px solid #0f3460',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const appMainStyle: CSSProperties = {
  flex: 1,
  display: 'grid',
  gridTemplateColumns: '60% 40%',
  minWidth: '1024px',
};

const panelStyle: CSSProperties = {
  padding: '20px',
  overflow: 'auto',
};

/**
 * Inner app component that uses the execution context
 */
function AppContent() {
  const {
    currentStep,
    currentOperation,
    arrayData,
    stackData,
    queueData,
    heapData,
    hashTableData,
    bstRoot,
    linkedListHead,
    doublyLinkedListHead,
    graphData,
    twoPointerData,
    slidingWindowData,
    binarySearchData,
    mergeSortData,
    prefixSumData,
    kadaneData,
    recursionData,
    reset,
  } = useExecutionContext();
  const [activeStructure, setActiveStructure] = useState<StructureKind>('bst');

  const currentCode = useMemo(() => {
    if (activeStructure === 'array') {
      switch (currentOperation) {
        case 'delete':
          return ARRAY_DELETE_CODE;
        case 'search':
          return ARRAY_SEARCH_CODE;
        case 'traverse':
          return ARRAY_TRAVERSE_CODE;
        case 'append':
        case 'insert':
        default:
          return ARRAY_APPEND_CODE;
      }
    }

    if (activeStructure === 'stack') {
      switch (currentOperation) {
        case 'delete':
          return STACK_POP_CODE;
        case 'search':
          return STACK_SEARCH_CODE;
        case 'traverse':
          return STACK_TRAVERSE_CODE;
        case 'append':
        case 'insert':
        default:
          return STACK_PUSH_CODE;
      }
    }

    if (activeStructure === 'queue') {
      switch (currentOperation) {
        case 'delete':
          return QUEUE_DEQUEUE_CODE;
        case 'search':
          return QUEUE_SEARCH_CODE;
        case 'traverse':
          return QUEUE_TRAVERSE_CODE;
        case 'append':
        case 'insert':
        default:
          return QUEUE_ENQUEUE_CODE;
      }
    }

    if (activeStructure === 'heap') {
      switch (currentOperation) {
        case 'delete':
          return HEAP_DELETE_CODE;
        case 'search':
          return HEAP_SEARCH_CODE;
        case 'traverse':
          return HEAP_TRAVERSE_CODE;
        case 'append':
        case 'insert':
        default:
          return HEAP_INSERT_CODE;
      }
    }

    if (activeStructure === 'hash-table') {
      switch (currentOperation) {
        case 'delete':
          return HASH_TABLE_DELETE_CODE;
        case 'search':
          return HASH_TABLE_SEARCH_CODE;
        case 'traverse':
          return HASH_TABLE_TRAVERSE_CODE;
        case 'append':
        case 'insert':
        default:
          return HASH_TABLE_INSERT_CODE;
      }
    }

    if (activeStructure === 'graph') {
      switch (currentOperation) {
        case 'add-edge':
          return GRAPH_ADD_EDGE_CODE;
        case 'search':
          return GRAPH_SEARCH_CODE;
        case 'bfs':
          return GRAPH_BFS_CODE;
        case 'traverse':
          return GRAPH_DFS_CODE;
        case 'insert':
        default:
          return GRAPH_ADD_NODE_CODE;
      }
    }

    if (activeStructure === 'linked-list') {
      switch (currentOperation) {
        case 'delete':
          return LINKED_LIST_DELETE_CODE;
        case 'search':
          return LINKED_LIST_SEARCH_CODE;
        case 'traverse':
          return LINKED_LIST_TRAVERSE_CODE;
        case 'append':
        case 'insert':
        default:
          return APPEND_CODE;
      }
    }

    if (activeStructure === 'doubly-linked-list') {
      switch (currentOperation) {
        case 'delete':
          return DOUBLY_DELETE_CODE;
        case 'search':
          return DOUBLY_SEARCH_CODE;
        case 'traverse':
          return DOUBLY_TRAVERSE_CODE;
        case 'append':
        case 'insert':
        default:
          return DOUBLY_APPEND_CODE;
      }
    }

    if (activeStructure === 'two-pointer') {
      return TWO_POINTER_CODE;
    }

    if (activeStructure === 'sliding-window') {
      return SLIDING_WINDOW_CODE;
    }

    if (activeStructure === 'binary-search') {
      return BINARY_SEARCH_CODE;
    }

    if (activeStructure === 'merge-sort') {
      return MERGE_SORT_CODE;
    }

    if (activeStructure === 'prefix-sum') {
      return currentOperation === 'search' ? PREFIX_SUM_QUERY_CODE : PREFIX_SUM_BUILD_CODE;
    }

    if (activeStructure === 'kadane') {
      return KADANE_CODE;
    }

    if (activeStructure === 'recursion') {
      if (recursionData.example === 'fibonacci') {
        return FIBONACCI_RECURSION_CODE;
      }

      if (recursionData.example === 'sum-to-n') {
        return SUM_TO_N_RECURSION_CODE;
      }

      return FACTORIAL_RECURSION_CODE;
    }

    switch (currentOperation) {
      case 'insert':
        return INSERT_CODE;
      case 'delete':
        return DELETE_CODE;
      case 'traverse':
        return INORDER_CODE;
      case 'bfs':
        return BFS_CODE;
      case 'search':
        return SEARCH_CODE;
      default:
        return INSERT_CODE;
    }
  }, [activeStructure, currentOperation]);

  const currentLine = currentStep?.line ?? null;
  const highlightedNodeId = currentStep?.nodeId ?? null;
  const currentVariableValues = useMemo(
    () =>
      buildVariableValues(activeStructure, currentOperation, currentStep, {
        bstRoot,
        linkedListHead,
        doublyLinkedListHead,
        graphData,
        arrayData,
        stackData,
        queueData,
        heapData,
        hashTableData,
        twoPointerData,
        slidingWindowData,
        binarySearchData,
        mergeSortData,
        prefixSumData,
        kadaneData,
        recursionData,
      }),
    [
      activeStructure,
      currentStep,
      bstRoot,
      linkedListHead,
      doublyLinkedListHead,
      graphData,
      arrayData,
      stackData,
      queueData,
      heapData,
      hashTableData,
      twoPointerData,
      slidingWindowData,
      binarySearchData,
      mergeSortData,
      prefixSumData,
      kadaneData,
      recursionData,
    ]
  );

  const handleStructureChange = (nextStructure: StructureKind) => {
    if (nextStructure === activeStructure) {
      return;
    }

    reset();
    setActiveStructure(nextStructure);
  };

  return (
    <div style={appContainerStyle}>
      <header style={appHeaderStyle}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#e94560', margin: 0 }}>
          Data Structure Visualizer
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              display: 'flex',
              gap: '8px',
              padding: '6px',
              borderRadius: '10px',
              backgroundColor: '#0f3460',
            }}
          >
            {[
              { id: 'array' as const, label: 'Array' },
              { id: 'stack' as const, label: 'Stack' },
              { id: 'queue' as const, label: 'Queue' },
              { id: 'heap' as const, label: 'Heap' },
              { id: 'hash-table' as const, label: 'Hash Table' },
              { id: 'bst' as const, label: 'Binary Search Tree' },
              { id: 'linked-list' as const, label: 'Linked List' },
              { id: 'doubly-linked-list' as const, label: 'Doubly Linked List' },
              { id: 'graph' as const, label: 'Graph' },
              { id: 'two-pointer' as const, label: 'Two Pointer' },
              { id: 'sliding-window' as const, label: 'Sliding Window' },
              { id: 'binary-search' as const, label: 'Binary Search' },
              { id: 'merge-sort' as const, label: 'Merge Sort' },
              { id: 'prefix-sum' as const, label: 'Prefix Sum' },
              { id: 'kadane' as const, label: 'Kadane' },
              { id: 'recursion' as const, label: 'Recursion' },
            ].map((option) => {
              const isActive = activeStructure === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => handleStructureChange(option.id)}
                  style={{
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: isActive ? '#e94560' : 'transparent',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          {currentStep?.description && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: '#0f3460',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            >
              <span style={{ color: '#888', fontWeight: 500 }}>Current:</span>
              <span style={{ color: '#fff', fontFamily: 'Consolas, Monaco, Courier New, monospace' }}>
                {currentStep.description}
              </span>
            </div>
          )}
        </div>
      </header>

      <main style={appMainStyle}>
        <section
          style={{
            ...panelStyle,
            backgroundColor: '#fafafa',
            borderRight: '1px solid #ddd',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h2
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#333',
              margin: '0 0 16px 0',
              textTransform: 'uppercase',
            }}
          >
            {activeStructure === 'array'
              ? 'Array Visualization'
              : activeStructure === 'stack'
                ? 'Stack Visualization'
              : activeStructure === 'queue'
                ? 'Queue Visualization'
              : activeStructure === 'heap'
                ? 'Heap Visualization'
              : activeStructure === 'hash-table'
                ? 'Hash Table Visualization'
              : activeStructure === 'bst'
                ? 'Tree Visualization'
              : activeStructure === 'linked-list'
                ? 'Linked List Visualization'
                : activeStructure === 'doubly-linked-list'
                  ? 'Doubly Linked List Visualization'
                : activeStructure === 'graph'
                  ? 'Graph Visualization'
                  : activeStructure === 'two-pointer'
                    ? 'Two Pointer Visualization'
                    : activeStructure === 'sliding-window'
                      ? 'Sliding Window Visualization'
                      : activeStructure === 'binary-search'
                        ? 'Binary Search Visualization'
                        : activeStructure === 'merge-sort'
                          ? 'Merge Sort Visualization'
                          : activeStructure === 'prefix-sum'
                            ? 'Prefix Sum Visualization'
                            : activeStructure === 'kadane'
                              ? "Kadane's Visualization"
                              : 'Recursion Visualization'}
          </h2>
          {activeStructure === 'array' ? (
            <ArrayVisualization data={arrayData} />
          ) : activeStructure === 'stack' ? (
            <StackVisualization data={stackData} />
          ) : activeStructure === 'queue' ? (
            <QueueVisualization data={queueData} />
          ) : activeStructure === 'heap' ? (
            <HeapVisualization data={heapData} />
          ) : activeStructure === 'hash-table' ? (
            <HashTableVisualization data={hashTableData} />
          ) : activeStructure === 'bst' ? (
            <TreeVisualization root={bstRoot} highlightedNodeId={highlightedNodeId} />
          ) : activeStructure === 'linked-list' ? (
            <LinkedListVisualization head={linkedListHead} highlightedNodeId={highlightedNodeId} />
          ) : activeStructure === 'doubly-linked-list' ? (
            <DoublyLinkedListVisualization
              head={doublyLinkedListHead}
              highlightedNodeId={highlightedNodeId}
            />
          ) : activeStructure === 'graph' ? (
            <GraphVisualization graph={graphData} highlightedNodeId={highlightedNodeId} />
          ) : activeStructure === 'two-pointer' ? (
            <TwoPointerVisualization data={twoPointerData} />
          ) : activeStructure === 'sliding-window' ? (
            <SlidingWindowVisualization data={slidingWindowData} />
          ) : activeStructure === 'binary-search' ? (
            <BinarySearchVisualization data={binarySearchData} />
          ) : activeStructure === 'merge-sort' ? (
            <MergeSortVisualization data={mergeSortData} />
          ) : activeStructure === 'prefix-sum' ? (
            <PrefixSumVisualization data={prefixSumData} />
          ) : activeStructure === 'kadane' ? (
            <KadaneVisualization data={kadaneData} />
          ) : (
            <RecursionVisualization data={recursionData} />
          )}
        </section>

        <section
          style={{
            ...panelStyle,
            backgroundColor: '#1a1a2e',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            overflowY: 'auto',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#aaa',
                margin: '0 0 16px 0',
                textTransform: 'uppercase',
              }}
            >
              Code
            </h2>
            <CodePanel
              code={currentCode}
              currentLine={currentLine}
              language="javascript"
              variableValues={currentVariableValues}
            />
          </div>

          <div>
            <Controls />
          </div>

          <div>
            <OperationInput structure={activeStructure} />
          </div>
        </section>
      </main>
    </div>
  );
}

function App() {
  return (
    <ExecutionProvider>
      <AppContent />
    </ExecutionProvider>
  );
}

export default App;

function buildVariableValues(
  structure: StructureKind,
  operation: AppContentData['currentOperation'],
  step: Step | null,
  data: {
    bstRoot: AppContentData['bstRoot'];
    linkedListHead: AppContentData['linkedListHead'];
    doublyLinkedListHead: AppContentData['doublyLinkedListHead'];
    graphData: AppContentData['graphData'];
    arrayData: AppContentData['arrayData'];
    stackData: AppContentData['stackData'];
    queueData: AppContentData['queueData'];
    heapData: AppContentData['heapData'];
    hashTableData: AppContentData['hashTableData'];
    twoPointerData: AppContentData['twoPointerData'];
    slidingWindowData: AppContentData['slidingWindowData'];
    binarySearchData: AppContentData['binarySearchData'];
    mergeSortData: AppContentData['mergeSortData'];
    prefixSumData: AppContentData['prefixSumData'];
    kadaneData: AppContentData['kadaneData'];
    recursionData: AppContentData['recursionData'];
  }
) {
  const variables: Record<string, string> = {};

  if (structure === 'array') {
    const values = step?.valuesSnapshot ?? data.arrayData.values;
    const activeIndex = firstNumber(step?.activeIndices);
    assignVariables(variables, {
      values,
      nextValues: values,
      value: valueAtIndex(values, activeIndex),
      target: valueAtFoundIndex(values, step?.foundIndex),
      index: activeIndex,
      indexToDelete: activeIndex,
    });
  }

  if (structure === 'stack') {
    const values = step?.valuesSnapshot ?? data.stackData.values;
    const activeIndex = firstNumber(step?.activeIndices);
    assignVariables(variables, {
      values,
      stack: values,
      nextStack: values,
      value: valueAtIndex(values, activeIndex),
      target: valueAtFoundIndex(values, step?.foundIndex),
      index: activeIndex,
      topIndex: data.stackData.topIndex,
    });
  }

  if (structure === 'queue') {
    const values = step?.valuesSnapshot ?? data.queueData.values;
    const activeIndex = firstNumber(step?.activeIndices);
    assignVariables(variables, {
      values,
      queue: values,
      nextQueue: values,
      value: valueAtIndex(values, activeIndex),
      target: valueAtFoundIndex(values, step?.foundIndex),
      index: activeIndex,
      frontIndex: data.queueData.frontIndex,
      rearIndex: data.queueData.rearIndex,
    });
  }

  if (structure === 'heap') {
    const values = step?.valuesSnapshot ?? data.heapData.values;
    const activeIndex = firstNumber(step?.activeIndices);
    const parentIndex =
      typeof activeIndex === 'number' && activeIndex > 0 ? Math.floor((activeIndex - 1) / 2) : null;
    assignVariables(variables, {
      values,
      heap: values,
      nextHeap: values,
      value: valueAtIndex(values, activeIndex),
      target: valueAtFoundIndex(values, step?.foundIndex),
      index: activeIndex,
      parent: parentIndex,
      left: typeof activeIndex === 'number' ? activeIndex * 2 + 1 : null,
      right: typeof activeIndex === 'number' ? activeIndex * 2 + 2 : null,
      largest: activeIndex,
    });
  }

  if (structure === 'hash-table') {
    const buckets = step?.bucketSnapshot ?? data.hashTableData.buckets;
    assignVariables(variables, {
      buckets,
      table: buckets,
      bucket: activeBucket(step?.bucketSnapshot ?? data.hashTableData.buckets, step),
      value: activeBucketValue(buckets, step),
      bucketIndex: step?.activeBucketIndex,
      entryIndex: step?.activeEntryIndex,
      target: activeBucketValue(buckets, step),
    });
  }

  if (structure === 'two-pointer') {
    assignVariables(variables, {
      values: data.twoPointerData.values,
      target: data.twoPointerData.target,
      left: step?.leftIndex,
      right: step?.rightIndex,
      leftIndex: step?.leftIndex,
      rightIndex: step?.rightIndex,
      sum: currentPairSum(data.twoPointerData.values, step?.leftIndex, step?.rightIndex),
    });
  }

  if (structure === 'sliding-window') {
    assignVariables(variables, {
      values: data.slidingWindowData.values,
      windowSize: data.slidingWindowData.windowSize,
      k: data.slidingWindowData.windowSize,
      windowStart: step?.windowStart,
      windowEnd: step?.windowEnd,
      bestStart: step?.bestStart,
      bestEnd: step?.bestEnd,
      currentSum: step?.currentSum,
      bestSum: step?.bestSum,
      windowSum: step?.debugVariables?.windowSum ?? step?.currentSum,
      right: step?.debugVariables?.right,
      index: step?.debugVariables?.index,
    });

    assignDebugVariable(
      variables,
      'windowSum',
      step?.debugVariables?.windowSum ?? step?.currentSum,
      'not set yet'
    );
    assignDebugVariable(variables, 'bestSum', step?.bestSum, 'not set yet');
  }

  if (structure === 'binary-search') {
    assignVariables(variables, {
      values: data.binarySearchData.values,
      target: data.binarySearchData.target,
      low: step?.lowIndex,
      high: step?.highIndex,
      mid: step?.midIndex,
      lowIndex: step?.lowIndex,
      highIndex: step?.highIndex,
      midIndex: step?.midIndex,
    });

    assignDebugVariable(variables, 'low', step?.lowIndex, 'not set yet');
    assignDebugVariable(variables, 'high', step?.highIndex, 'not set yet');
    assignDebugVariable(variables, 'mid', step?.midIndex, 'not set yet');
  }

  if (structure === 'merge-sort') {
    assignVariables(variables, {
      values: step?.valuesSnapshot ?? data.mergeSortData.values,
      start: step?.mergeStart,
      end: step?.mergeEnd,
      writeIndex: firstNumber(step?.activeIndices),
      nextValues: step?.valuesSnapshot ?? data.mergeSortData.values,
      mid: step?.debugVariables?.mid,
      leftIndex: step?.debugVariables?.leftIndex,
      rightIndex: step?.debugVariables?.rightIndex,
      left: step?.debugVariables?.left,
      right: step?.debugVariables?.right,
    });

    assignDebugVariable(variables, 'start', step?.mergeStart, 'not set yet');
    assignDebugVariable(variables, 'end', step?.mergeEnd, 'not set yet');
    assignDebugVariable(
      variables,
      'mid',
      typeof step?.debugVariables?.mid === 'number' ? step.debugVariables.mid : null,
      'not set yet'
    );
    assignDebugVariable(
      variables,
      'leftIndex',
      typeof step?.debugVariables?.leftIndex === 'number' ? step.debugVariables.leftIndex : null,
      'not set yet'
    );
    assignDebugVariable(
      variables,
      'rightIndex',
      typeof step?.debugVariables?.rightIndex === 'number' ? step.debugVariables.rightIndex : null,
      'not set yet'
    );
    assignDebugVariable(
      variables,
      'writeIndex',
      typeof step?.debugVariables?.writeIndex === 'number'
        ? step.debugVariables.writeIndex
        : firstNumber(step?.activeIndices),
      'not set yet'
    );
    assignDebugVariable(variables, 'left', step?.debugVariables?.left, 'not set yet');
    assignDebugVariable(variables, 'right', step?.debugVariables?.right, 'not set yet');
  }

  if (structure === 'prefix-sum') {
    assignVariables(variables, {
      values: step?.valuesSnapshot ?? data.prefixSumData.values,
      prefix: step?.prefixValuesSnapshot ?? data.prefixSumData.prefixValues,
      left: step?.queryLeft,
      right: step?.queryRight,
      rangeSum: step?.rangeSum ?? data.prefixSumData.rangeSum,
      runningSum: step?.debugVariables?.runningSum ?? step?.rangeSum,
      index: firstNumber(step?.activeIndices),
    });
  }

  if (structure === 'kadane') {
    assignVariables(variables, {
      values: step?.valuesSnapshot ?? data.kadaneData.values,
      currentSum: step?.currentSum,
      bestSum: step?.bestSum,
      currentStart: step?.currentStart,
      bestStart: step?.bestStart,
      bestEnd: step?.bestEnd,
      index: step?.currentEnd,
    });
  }

  if (structure === 'recursion') {
    assignVariables(variables, {
      n: data.recursionData.input,
      result: step?.recursionResult ?? data.recursionData.result,
    });
  }

  if (structure === 'bst') {
    assignVariables(variables, {
      root: summarizeTreeNode(data.bstRoot),
      value: treeNodeValue(data.bstRoot, step?.nodeId ?? null),
      current: treeNodeValue(data.bstRoot, step?.nodeId ?? null),
      node: treeNodeValue(data.bstRoot, step?.nodeId ?? null),
      queue: operation === 'bfs' ? 'see traversal state' : null,
      result: operation === 'traverse' || operation === 'bfs' ? 'see visualization state' : null,
    });
  }

  if (structure === 'linked-list') {
    assignVariables(variables, {
      head: summarizeLinkedList(data.linkedListHead),
      current: linkedListValue(data.linkedListHead, step?.nodeId ?? null),
      value: linkedListValue(data.linkedListHead, step?.nodeId ?? null),
      values: linkedListValues(data.linkedListHead),
    });
  }

  if (structure === 'doubly-linked-list') {
    assignVariables(variables, {
      head: summarizeDoublyLinkedList(data.doublyLinkedListHead),
      current: doublyLinkedListValue(data.doublyLinkedListHead, step?.nodeId ?? null),
      value: doublyLinkedListValue(data.doublyLinkedListHead, step?.nodeId ?? null),
      values: doublyLinkedListValues(data.doublyLinkedListHead),
    });
  }

  if (structure === 'graph') {
    assignVariables(variables, {
      graph: data.graphData,
      value: graphNodeValue(data.graphData, step?.nodeId ?? null),
      node: graphNodeValue(data.graphData, step?.nodeId ?? null),
      current: graphNodeValue(data.graphData, step?.nodeId ?? null),
      queue: operation === 'bfs' || operation === 'search' ? 'see traversal state' : null,
      visited: operation === 'bfs' || operation === 'search' || operation === 'traverse' ? 'see traversal state' : null,
      order: operation === 'bfs' || operation === 'traverse' ? 'see traversal state' : null,
    });
  }

  if (step?.debugVariables) {
    assignVariables(variables, step.debugVariables);
  }

  return variables;
}

function assignVariables(target: Record<string, string>, values: Record<string, unknown>) {
  for (const [name, value] of Object.entries(values)) {
    if (value === null || value === undefined) {
      continue;
    }

    target[name] = formatVariableValue(value);
  }
}

function assignDebugVariable(
  target: Record<string, string>,
  name: string,
  value: unknown,
  fallback: string
) {
  target[name] = value === null || value === undefined ? fallback : formatVariableValue(value);
}

function formatVariableValue(value: unknown) {
  if (typeof value === 'string') {
    return value;
  }

  return JSON.stringify(value);
}

function firstNumber(values?: number[] | null) {
  return values && values.length > 0 ? values[0] : null;
}

function valueAtFoundIndex(values: number[], index: number | null | undefined) {
  return index !== null && index !== undefined && index >= 0 && index < values.length
    ? values[index]
    : null;
}

function activeBucketValue(buckets: number[][], step: Step | null) {
  if (
    step?.activeBucketIndex === null ||
    step?.activeBucketIndex === undefined ||
    step?.activeEntryIndex === null ||
    step?.activeEntryIndex === undefined
  ) {
    return null;
  }

  return buckets[step.activeBucketIndex]?.[step.activeEntryIndex] ?? null;
}

function activeBucket(buckets: number[][], step: Step | null) {
  if (step?.activeBucketIndex === null || step?.activeBucketIndex === undefined) {
    return null;
  }

  return buckets[step.activeBucketIndex] ?? null;
}

function valueAtIndex(values: number[], index: number | null | undefined) {
  return index !== null && index !== undefined && index >= 0 && index < values.length
    ? values[index]
    : null;
}

function currentPairSum(values: number[], left: number | null | undefined, right: number | null | undefined) {
  if (
    left === null ||
    left === undefined ||
    right === null ||
    right === undefined ||
    left < 0 ||
    right < 0 ||
    left >= values.length ||
    right >= values.length
  ) {
    return null;
  }

  return values[left] + values[right];
}

function summarizeTreeNode(root: AppContentData['bstRoot']) {
  return root ? `{ value: ${root.value} }` : null;
}

function treeNodeValue(root: AppContentData['bstRoot'], nodeId: string | null) {
  if (!root || !nodeId) {
    return null;
  }

  const stack = [root];
  while (stack.length > 0) {
    const current = stack.pop()!;
    if (current.id === nodeId) {
      return current.value;
    }
    if (current.right) stack.push(current.right);
    if (current.left) stack.push(current.left);
  }

  return null;
}

function summarizeLinkedList(head: AppContentData['linkedListHead']) {
  return head ? linkedListValues(head) : null;
}

function linkedListValues(head: AppContentData['linkedListHead']) {
  const values: number[] = [];
  let current = head;
  while (current) {
    values.push(current.value);
    current = current.next;
  }
  return values;
}

function linkedListValue(head: AppContentData['linkedListHead'], nodeId: string | null) {
  let current = head;
  while (current) {
    if (current.id === nodeId) {
      return current.value;
    }
    current = current.next;
  }
  return null;
}

function summarizeDoublyLinkedList(head: AppContentData['doublyLinkedListHead']) {
  return head ? doublyLinkedListValues(head) : null;
}

function doublyLinkedListValues(head: AppContentData['doublyLinkedListHead']) {
  const values: number[] = [];
  let current = head;
  while (current) {
    values.push(current.value);
    current = current.next;
  }
  return values;
}

function doublyLinkedListValue(head: AppContentData['doublyLinkedListHead'], nodeId: string | null) {
  let current = head;
  while (current) {
    if (current.id === nodeId) {
      return current.value;
    }
    current = current.next;
  }
  return null;
}

function graphNodeValue(graph: AppContentData['graphData'], nodeId: string | null) {
  if (!nodeId) {
    return null;
  }

  return graph.nodes.find((node) => node.id === nodeId)?.value ?? null;
}

type AppContentData = ReturnType<typeof useExecutionContext>;
