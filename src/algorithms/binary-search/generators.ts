import { Step } from '../../types';

export const BINARY_SEARCH_LINE_NUMBERS = {
  INIT_LOW: 2,
  INIT_HIGH: 3,
  LOOP_START: 5,
  CALC_MID: 6,
  FOUND: 8,
  MOVE_LOW: 12,
  MOVE_HIGH: 14,
  NOT_FOUND: 18,
};

export function* binarySearchGenerator(
  values: number[],
  target: number
): Generator<Step, { foundIndex: number }, undefined> {
  let low = 0;
  let high = values.length - 1;

  yield {
    type: 'visit',
    nodeId: low.toString(),
    line: BINARY_SEARCH_LINE_NUMBERS.INIT_LOW,
    description: `Initializing low at index ${low}`,
    lowIndex: low,
    highIndex: high,
    midIndex: null,
    foundIndex: null,
    debugVariables: {
      values,
      target,
      low,
      high,
    },
  };

  yield {
    type: 'visit',
    nodeId: high.toString(),
    line: BINARY_SEARCH_LINE_NUMBERS.INIT_HIGH,
    description: `Initializing high at index ${high}`,
    lowIndex: low,
    highIndex: high,
    midIndex: null,
    foundIndex: null,
    debugVariables: {
      values,
      target,
      low,
      high,
    },
  };

  while (low <= high) {
    yield {
      type: 'compare',
      nodeId: low.toString(),
      line: BINARY_SEARCH_LINE_NUMBERS.LOOP_START,
      description: `Searching between indices ${low} and ${high}`,
      lowIndex: low,
      highIndex: high,
      midIndex: null,
      foundIndex: null,
      debugVariables: {
        values,
        target,
        low,
        high,
      },
    };

    const mid = Math.floor((low + high) / 2);
    yield {
      type: 'compare',
      nodeId: mid.toString(),
      line: BINARY_SEARCH_LINE_NUMBERS.CALC_MID,
      description: `Midpoint index ${mid} holds value ${values[mid]}`,
      lowIndex: low,
      highIndex: high,
      midIndex: mid,
      foundIndex: null,
      debugVariables: {
        values,
        target,
        low,
        high,
        mid,
      },
    };

    if (values[mid] === target) {
      yield {
        type: 'found',
        nodeId: mid.toString(),
        line: BINARY_SEARCH_LINE_NUMBERS.FOUND,
        description: `Found target ${target} at index ${mid}`,
        lowIndex: low,
        highIndex: high,
        midIndex: mid,
        foundIndex: mid,
        debugVariables: {
          values,
          target,
          low,
          high,
          mid,
        },
      };
      return { foundIndex: mid };
    }

    if (values[mid] < target) {
      low = mid + 1;
      yield {
        type: 'move',
        nodeId: low.toString(),
        line: BINARY_SEARCH_LINE_NUMBERS.MOVE_LOW,
        description: `${values[mid]} < ${target}, moving low to index ${low}`,
        lowIndex: low,
        highIndex: high,
        midIndex: mid,
        foundIndex: null,
        debugVariables: {
          values,
          target,
          low,
          high,
          mid,
        },
      };
    } else {
      high = mid - 1;
      yield {
        type: 'move',
        nodeId: high.toString(),
        line: BINARY_SEARCH_LINE_NUMBERS.MOVE_HIGH,
        description: `${values[mid]} > ${target}, moving high to index ${high}`,
        lowIndex: low,
        highIndex: high,
        midIndex: mid,
        foundIndex: null,
        debugVariables: {
          values,
          target,
          low,
          high,
          mid,
        },
      };
    }
  }

  yield {
    type: 'not-found',
    nodeId: null,
    line: BINARY_SEARCH_LINE_NUMBERS.NOT_FOUND,
    description: `Target ${target} is not in the array`,
    lowIndex: low,
    highIndex: high,
    midIndex: null,
    foundIndex: null,
    debugVariables: {
      values,
      target,
      low,
      high,
    },
  };

  return { foundIndex: -1 };
}
