import { Step } from '../../types';

export const TWO_POINTER_LINE_NUMBERS = {
  INIT_LEFT: 2,
  INIT_RIGHT: 3,
  LOOP_START: 5,
  COMPUTE_SUM: 6,
  FOUND: 8,
  MOVE_LEFT: 12,
  MOVE_RIGHT: 14,
  NOT_FOUND: 18,
};

export function* twoPointerGenerator(
  values: number[],
  target: number
): Generator<Step, { match: [number, number] | null }, undefined> {
  let left = 0;
  let right = values.length - 1;

  yield {
    type: 'visit',
    nodeId: left.toString(),
    line: TWO_POINTER_LINE_NUMBERS.INIT_LEFT,
    description: `Initializing left pointer at index ${left}`,
    leftIndex: left,
    rightIndex: right,
  };

  yield {
    type: 'visit',
    nodeId: right.toString(),
    line: TWO_POINTER_LINE_NUMBERS.INIT_RIGHT,
    description: `Initializing right pointer at index ${right}`,
    leftIndex: left,
    rightIndex: right,
  };

  while (left < right) {
    yield {
      type: 'compare',
      nodeId: left.toString(),
      line: TWO_POINTER_LINE_NUMBERS.LOOP_START,
      description: `Checking indices ${left} and ${right}`,
      leftIndex: left,
      rightIndex: right,
    };

    const sum = values[left] + values[right];
    yield {
      type: 'compare',
      nodeId: left.toString(),
      line: TWO_POINTER_LINE_NUMBERS.COMPUTE_SUM,
      description: `${values[left]} + ${values[right]} = ${sum}`,
      leftIndex: left,
      rightIndex: right,
    };

    if (sum === target) {
      yield {
        type: 'found',
        nodeId: left.toString(),
        line: TWO_POINTER_LINE_NUMBERS.FOUND,
        description: `Found target ${target} with values ${values[left]} and ${values[right]}`,
        leftIndex: left,
        rightIndex: right,
        matchedIndices: [left, right],
      };
      return { match: [left, right] };
    }

    if (sum < target) {
      left += 1;
      yield {
        type: 'move',
        nodeId: left.toString(),
        line: TWO_POINTER_LINE_NUMBERS.MOVE_LEFT,
        description: `Sum is too small, moving left pointer to index ${left}`,
        leftIndex: left,
        rightIndex: right,
      };
    } else {
      right -= 1;
      yield {
        type: 'move',
        nodeId: right.toString(),
        line: TWO_POINTER_LINE_NUMBERS.MOVE_RIGHT,
        description: `Sum is too large, moving right pointer to index ${right}`,
        leftIndex: left,
        rightIndex: right,
      };
    }
  }

  yield {
    type: 'not-found',
    nodeId: null,
    line: TWO_POINTER_LINE_NUMBERS.NOT_FOUND,
    description: `No pair sums to ${target}`,
    leftIndex: left,
    rightIndex: right,
    matchedIndices: [],
  };

  return { match: null };
}
