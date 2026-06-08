import { Step } from '../../types';

export const SLIDING_WINDOW_LINE_NUMBERS = {
  INIT_SUM: 2,
  BUILD_INITIAL: 4,
  SET_BEST: 8,
  LOOP_START: 11,
  ADD_RIGHT: 12,
  REMOVE_LEFT: 13,
  UPDATE_BEST: 15,
  RETURN_RESULT: 20,
};

export function* slidingWindowGenerator(
  values: number[],
  windowSize: number
): Generator<Step, { bestSum: number; bestStart: number }, undefined> {
  let windowSum = 0;

  yield {
    type: 'visit',
    nodeId: '0',
    line: SLIDING_WINDOW_LINE_NUMBERS.INIT_SUM,
    description: 'Preparing the first window sum',
    windowStart: 0,
    windowEnd: windowSize - 1,
    currentSum: 0,
    bestSum: null,
    debugVariables: {
      values,
      k: windowSize,
      windowSum,
    },
  };

  for (let index = 0; index < windowSize; index += 1) {
    windowSum += values[index];
    yield {
      type: 'compare',
      nodeId: index.toString(),
      line: SLIDING_WINDOW_LINE_NUMBERS.BUILD_INITIAL,
      description: `Adding ${values[index]} to the initial window`,
      windowStart: 0,
      windowEnd: windowSize - 1,
      currentSum: windowSum,
      bestSum: null,
      debugVariables: {
        values,
        k: windowSize,
        index,
        windowSum,
      },
    };
  }

  let bestSum = windowSum;
  let bestStart = 0;

  yield {
    type: 'found',
    nodeId: '0',
    line: SLIDING_WINDOW_LINE_NUMBERS.SET_BEST,
    description: `Initial best window sum is ${bestSum}`,
    windowStart: 0,
    windowEnd: windowSize - 1,
    bestStart: 0,
    bestEnd: windowSize - 1,
    currentSum: windowSum,
    bestSum,
    debugVariables: {
      values,
      k: windowSize,
      windowSum,
      bestSum,
      bestStart,
    },
  };

  for (let right = windowSize; right < values.length; right += 1) {
    const leftToRemove = right - windowSize;
    const nextStart = leftToRemove + 1;

    yield {
      type: 'compare',
      nodeId: right.toString(),
      line: SLIDING_WINDOW_LINE_NUMBERS.LOOP_START,
      description: `Sliding window to include index ${right}`,
      windowStart: nextStart,
      windowEnd: right,
      bestStart,
      bestEnd: bestStart + windowSize - 1,
      currentSum: windowSum,
      bestSum,
      debugVariables: {
        values,
        k: windowSize,
        right,
        windowSum,
        bestSum,
        bestStart,
      },
    };

    windowSum += values[right];
    yield {
      type: 'move',
      nodeId: right.toString(),
      line: SLIDING_WINDOW_LINE_NUMBERS.ADD_RIGHT,
      description: `Adding ${values[right]} on the right`,
      windowStart: leftToRemove,
      windowEnd: right,
      bestStart,
      bestEnd: bestStart + windowSize - 1,
      currentSum: windowSum,
      bestSum,
      debugVariables: {
        values,
        k: windowSize,
        right,
        leftToRemove,
        windowSum,
        bestSum,
        bestStart,
      },
    };

    windowSum -= values[leftToRemove];
    yield {
      type: 'move',
      nodeId: leftToRemove.toString(),
      line: SLIDING_WINDOW_LINE_NUMBERS.REMOVE_LEFT,
      description: `Removing ${values[leftToRemove]} from the left`,
      windowStart: nextStart,
      windowEnd: right,
      bestStart,
      bestEnd: bestStart + windowSize - 1,
      currentSum: windowSum,
      bestSum,
      debugVariables: {
        values,
        k: windowSize,
        right,
        leftToRemove,
        windowSum,
        bestSum,
        bestStart,
      },
    };

    if (windowSum > bestSum) {
      bestSum = windowSum;
      bestStart = nextStart;
      yield {
        type: 'found',
        nodeId: bestStart.toString(),
        line: SLIDING_WINDOW_LINE_NUMBERS.UPDATE_BEST,
        description: `New best window sum ${bestSum} from index ${bestStart} to ${right}`,
        windowStart: nextStart,
        windowEnd: right,
        bestStart,
        bestEnd: right,
        currentSum: windowSum,
        bestSum,
        debugVariables: {
          values,
          k: windowSize,
          right,
          windowSum,
          bestSum,
          bestStart,
        },
      };
    }
  }

  yield {
    type: 'traverse',
    nodeId: bestStart.toString(),
    line: SLIDING_WINDOW_LINE_NUMBERS.RETURN_RESULT,
    description: `Best window sum is ${bestSum}`,
    windowStart: bestStart,
    windowEnd: bestStart + windowSize - 1,
    bestStart,
    bestEnd: bestStart + windowSize - 1,
    currentSum: bestSum,
    bestSum,
    debugVariables: {
      values,
      k: windowSize,
      windowSum: bestSum,
      bestSum,
      bestStart,
    },
  };

  return { bestSum, bestStart };
}
