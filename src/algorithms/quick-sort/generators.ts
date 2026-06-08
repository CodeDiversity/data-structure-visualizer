import { Step } from '../../types';

export const QUICK_SORT_LINE_NUMBERS = {
  BASE_CASE: 2,
  PARTITION_CALL: 3,
  PIVOT: 6,
  I_INIT: 7,
  J_LOOP: 8,
  COMPARE: 11,
  SWAP: 12,
  FINAL_SWAP: 16,
  RETURN: 17,
  SORT_LEFT: 4,
  SORT_RIGHT: 5,
};

export function* quickSortGenerator(
  values: number[]
): Generator<Step, number[], undefined> {
  const nextValues = [...values];

  if (nextValues.length === 0) {
    return nextValues;
  }

  function* quickSortRange(low: number, high: number): Generator<Step, void, undefined> {
    yield {
      type: 'visit',
      nodeId: low.toString(),
      line: QUICK_SORT_LINE_NUMBERS.BASE_CASE,
      description:
        low >= high
          ? `Range [${low}, ${high}] has one element, skip`
          : `Partition range [${low}, ${high}]`,
      valuesSnapshot: [...nextValues],
      activeIndices: buildRange(low, high),
      sortedIndices: [],
      debugVariables: { values: nextValues, low, high },
    };

    if (low >= high) {
      return;
    }

    yield {
      type: 'visit',
      nodeId: high.toString(),
      line: QUICK_SORT_LINE_NUMBERS.PARTITION_CALL,
      description: `Partition [${low}, ${high}] with pivot ${nextValues[high]}`,
      valuesSnapshot: [...nextValues],
      activeIndices: buildRange(low, high),
      sortedIndices: [],
      debugVariables: { values: nextValues, low, high, pivot: nextValues[high] },
    };

    const pivotIndex = yield* partitionRange(low, high);

    yield {
      type: 'found',
      nodeId: pivotIndex.toString(),
      line: QUICK_SORT_LINE_NUMBERS.RETURN,
      description: `Pivot ${nextValues[pivotIndex]} is in final position at index ${pivotIndex}`,
      valuesSnapshot: [...nextValues],
      activeIndices: [pivotIndex],
      sortedIndices: [pivotIndex],
      debugVariables: { values: nextValues, low, high, pivotIndex },
    };

    yield {
      type: 'visit',
      nodeId: low.toString(),
      line: QUICK_SORT_LINE_NUMBERS.SORT_LEFT,
      description: `Recursively sort left subarray [${low}, ${pivotIndex - 1}]`,
      valuesSnapshot: [...nextValues],
      activeIndices: pivotIndex - 1 >= low ? buildRange(low, pivotIndex - 1) : [],
      sortedIndices: [pivotIndex],
      debugVariables: { values: nextValues, low, high, pivotIndex },
    };
    yield* quickSortRange(low, pivotIndex - 1);

    yield {
      type: 'visit',
      nodeId: (pivotIndex + 1).toString(),
      line: QUICK_SORT_LINE_NUMBERS.SORT_RIGHT,
      description: `Recursively sort right subarray [${pivotIndex + 1}, ${high}]`,
      valuesSnapshot: [...nextValues],
      activeIndices: pivotIndex + 1 <= high ? buildRange(pivotIndex + 1, high) : [],
      sortedIndices: [pivotIndex],
      debugVariables: { values: nextValues, low, high, pivotIndex },
    };
    yield* quickSortRange(pivotIndex + 1, high);
  }

  function* partitionRange(
    low: number,
    high: number
  ): Generator<Step, number, undefined> {
    const pivot = nextValues[high];

    yield {
      type: 'visit',
      nodeId: high.toString(),
      line: QUICK_SORT_LINE_NUMBERS.PIVOT,
      description: `Pivot selected: ${pivot} at index ${high}`,
      valuesSnapshot: [...nextValues],
      activeIndices: [high],
      sortedIndices: [],
      debugVariables: { values: nextValues, low, high, pivot },
    };

    let i = low - 1;

    for (let j = low; j < high; j++) {
      yield {
        type: 'compare',
        nodeId: j.toString(),
        line: QUICK_SORT_LINE_NUMBERS.COMPARE,
        description: `Compare ${nextValues[j]} ≤ ${pivot}?`,
        valuesSnapshot: [...nextValues],
        activeIndices: [j, high],
        sortedIndices: [],
        debugVariables: { values: nextValues, low, high, pivot, i, j },
      };

      if (nextValues[j] <= pivot) {
        i += 1;

        if (i !== j) {
          yield {
            type: 'move',
            nodeId: i.toString(),
            line: QUICK_SORT_LINE_NUMBERS.SWAP,
            description: `Swap ${nextValues[i]} and ${nextValues[j]}`,
            valuesSnapshot: [...nextValues],
            activeIndices: [i, j],
            sortedIndices: [],
            debugVariables: { values: nextValues, low, high, pivot, i, j },
          };

          [nextValues[i], nextValues[j]] = [nextValues[j], nextValues[i]];
        }
      }
    }

    yield {
      type: 'move',
      nodeId: (i + 1).toString(),
      line: QUICK_SORT_LINE_NUMBERS.FINAL_SWAP,
      description: `Place pivot: swap ${nextValues[i + 1]} and ${nextValues[high]}`,
      valuesSnapshot: [...nextValues],
      activeIndices: [i + 1, high],
      sortedIndices: [],
      debugVariables: { values: nextValues, low, high, pivot, i },
    };

    [nextValues[i + 1], nextValues[high]] = [nextValues[high], nextValues[i + 1]];

    const newPivotIndex = i + 1;

    yield {
      type: 'move',
      nodeId: newPivotIndex.toString(),
      line: QUICK_SORT_LINE_NUMBERS.RETURN,
      description: `Pivot ${nextValues[newPivotIndex]} placed at index ${newPivotIndex}`,
      valuesSnapshot: [...nextValues],
      activeIndices: [newPivotIndex],
      sortedIndices: [newPivotIndex],
      debugVariables: { values: nextValues, low, high, pivotIndex: newPivotIndex },
    };

    return newPivotIndex;
  }

  yield* quickSortRange(0, nextValues.length - 1);

  yield {
    type: 'found',
    nodeId: null,
    line: QUICK_SORT_LINE_NUMBERS.BASE_CASE,
    description: 'Quick sort complete',
    valuesSnapshot: [...nextValues],
    activeIndices: [],
    sortedIndices: nextValues.map((_, index) => index),
    debugVariables: { values: nextValues },
  };

  return nextValues;
}

function buildRange(start: number, end: number): number[] {
  if (end < start) {
    return [];
  }
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}