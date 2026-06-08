import { Step } from '../../types';

export const KADANE_LINE_NUMBERS = {
  INIT_CURRENT: 2,
  INIT_BEST: 3,
  LOOP: 8,
  RESET_CURRENT: 10,
  EXTEND_CURRENT: 13,
  UPDATE_BEST: 17,
  RETURN: 23,
};

export function* kadaneGenerator(
  values: number[]
): Generator<Step, { bestSum: number; bestStart: number; bestEnd: number }, undefined> {
  let currentSum = values[0];
  let bestSum = values[0];
  let currentStart = 0;
  let bestStart = 0;
  let bestEnd = 0;

  yield {
    type: 'visit',
    nodeId: '0',
    line: KADANE_LINE_NUMBERS.INIT_CURRENT,
    description: `Initialize current sum with first value ${values[0]}`,
    valuesSnapshot: [...values],
    currentStart,
    currentEnd: 0,
    bestStart,
    bestEnd,
    currentSum,
    bestSum,
  };

  yield {
    type: 'visit',
    nodeId: '0',
    line: KADANE_LINE_NUMBERS.INIT_BEST,
    description: `Initialize best sum with first value ${values[0]}`,
    valuesSnapshot: [...values],
    currentStart,
    currentEnd: 0,
    bestStart,
    bestEnd,
    currentSum,
    bestSum,
  };

  for (let index = 1; index < values.length; index += 1) {
    yield {
      type: 'visit',
      nodeId: index.toString(),
      line: KADANE_LINE_NUMBERS.LOOP,
      description: `Process value ${values[index]} at index ${index}`,
      valuesSnapshot: [...values],
      currentStart,
      currentEnd: index - 1,
      bestStart,
      bestEnd,
      currentSum,
      bestSum,
    };

    if (currentSum + values[index] < values[index]) {
      currentSum = values[index];
      currentStart = index;

      yield {
        type: 'move',
        nodeId: index.toString(),
        line: KADANE_LINE_NUMBERS.RESET_CURRENT,
        description: `Starting fresh at index ${index} is better than extending`,
        valuesSnapshot: [...values],
        currentStart,
        currentEnd: index,
        bestStart,
        bestEnd,
        currentSum,
        bestSum,
      };
    } else {
      currentSum += values[index];

      yield {
        type: 'move',
        nodeId: index.toString(),
        line: KADANE_LINE_NUMBERS.EXTEND_CURRENT,
        description: `Extend the current subarray through index ${index}`,
        valuesSnapshot: [...values],
        currentStart,
        currentEnd: index,
        bestStart,
        bestEnd,
        currentSum,
        bestSum,
      };
    }

    if (currentSum > bestSum) {
      bestSum = currentSum;
      bestStart = currentStart;
      bestEnd = index;

      yield {
        type: 'found',
        nodeId: index.toString(),
        line: KADANE_LINE_NUMBERS.UPDATE_BEST,
        description: `New best subarray is [${bestStart}, ${bestEnd}] with sum ${bestSum}`,
        valuesSnapshot: [...values],
        currentStart,
        currentEnd: index,
        bestStart,
        bestEnd,
        currentSum,
        bestSum,
      };
    }
  }

  yield {
    type: 'found',
    nodeId: bestEnd.toString(),
    line: KADANE_LINE_NUMBERS.RETURN,
    description: `Maximum subarray sum is ${bestSum}`,
    valuesSnapshot: [...values],
    currentStart,
    currentEnd: bestEnd,
    bestStart,
    bestEnd,
    currentSum,
    bestSum,
  };

  return { bestSum, bestStart, bestEnd };
}
