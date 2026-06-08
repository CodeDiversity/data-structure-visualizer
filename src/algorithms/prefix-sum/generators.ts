import { Step } from '../../types';

export const PREFIX_SUM_LINE_NUMBERS = {
  BUILD_INIT: 2,
  BUILD_LOOP: 4,
  BUILD_ADD: 5,
  BUILD_WRITE: 6,
  BUILD_RETURN: 9,
  QUERY_BASE_CASE: 2,
  QUERY_RETURN_RIGHT: 3,
  QUERY_SUBTRACT: 6,
};

export function* buildPrefixSumGenerator(
  values: number[]
): Generator<Step, number[], undefined> {
  const prefixValues: number[] = [];
  let runningSum = 0;

  yield {
    type: 'visit',
    nodeId: null,
    line: PREFIX_SUM_LINE_NUMBERS.BUILD_INIT,
    description: 'Initialize an empty prefix array and a running sum of 0',
    valuesSnapshot: [...values],
    prefixValuesSnapshot: [],
    activeIndices: [],
    prefixActiveIndices: [],
  };

  for (let index = 0; index < values.length; index += 1) {
    yield {
      type: 'visit',
      nodeId: index.toString(),
      line: PREFIX_SUM_LINE_NUMBERS.BUILD_LOOP,
      description: `Visit value ${values[index]} at index ${index}`,
      valuesSnapshot: [...values],
      prefixValuesSnapshot: [...prefixValues],
      activeIndices: [index],
      prefixActiveIndices: [],
    };

    runningSum += values[index];

    yield {
      type: 'compare',
      nodeId: index.toString(),
      line: PREFIX_SUM_LINE_NUMBERS.BUILD_ADD,
      description: `Add ${values[index]} to running sum = ${runningSum}`,
      valuesSnapshot: [...values],
      prefixValuesSnapshot: [...prefixValues],
      activeIndices: [index],
      prefixActiveIndices: [],
      rangeSum: runningSum,
    };

    prefixValues[index] = runningSum;

    yield {
      type: 'insert',
      nodeId: index.toString(),
      line: PREFIX_SUM_LINE_NUMBERS.BUILD_WRITE,
      description: `Store prefix[${index}] = ${runningSum}`,
      valuesSnapshot: [...values],
      prefixValuesSnapshot: [...prefixValues],
      activeIndices: [index],
      prefixActiveIndices: [index],
      rangeSum: runningSum,
    };
  }

  yield {
    type: 'found',
    nodeId: null,
    line: PREFIX_SUM_LINE_NUMBERS.BUILD_RETURN,
    description: 'Prefix sum array is ready for fast range queries',
    valuesSnapshot: [...values],
    prefixValuesSnapshot: [...prefixValues],
    activeIndices: [],
    prefixActiveIndices: [],
  };

  return prefixValues;
}

export function* prefixSumRangeQueryGenerator(
  values: number[],
  prefixValues: number[],
  left: number,
  right: number
): Generator<Step, { rangeSum: number }, undefined> {
  yield {
    type: 'compare',
    nodeId: right.toString(),
    line: PREFIX_SUM_LINE_NUMBERS.QUERY_BASE_CASE,
    description: `Query sum for range [${left}, ${right}]`,
    valuesSnapshot: [...values],
    prefixValuesSnapshot: [...prefixValues],
    activeIndices: buildRange(left, right),
    prefixActiveIndices: left === 0 ? [right] : [left - 1, right],
    queryLeft: left,
    queryRight: right,
  };

  if (left === 0) {
    const rangeSum = prefixValues[right];

    yield {
      type: 'found',
      nodeId: right.toString(),
      line: PREFIX_SUM_LINE_NUMBERS.QUERY_RETURN_RIGHT,
      description: `Since left is 0, answer is prefix[${right}] = ${rangeSum}`,
      valuesSnapshot: [...values],
      prefixValuesSnapshot: [...prefixValues],
      activeIndices: buildRange(left, right),
      prefixActiveIndices: [right],
      queryLeft: left,
      queryRight: right,
      rangeSum,
    };

    return { rangeSum };
  }

  const rangeSum = prefixValues[right] - prefixValues[left - 1];

  yield {
    type: 'found',
    nodeId: right.toString(),
    line: PREFIX_SUM_LINE_NUMBERS.QUERY_SUBTRACT,
    description: `Compute prefix[${right}] - prefix[${left - 1}] = ${rangeSum}`,
    valuesSnapshot: [...values],
    prefixValuesSnapshot: [...prefixValues],
    activeIndices: buildRange(left, right),
    prefixActiveIndices: [left - 1, right],
    queryLeft: left,
    queryRight: right,
    rangeSum,
  };

  return { rangeSum };
}

function buildRange(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}
