import { Step } from '../../types';

export const STACK_LINE_NUMBERS = {
  PUSH: {
    COPY: 2,
    PUSH: 3,
    RETURN: 5,
  },
  POP: {
    CHECK: 2,
    POP: 4,
    RETURN: 6,
  },
  SEARCH: {
    LOOP: 2,
    COMPARE: 3,
    FOUND: 5,
    NOT_FOUND: 9,
  },
  TRAVERSE: {
    LOOP: 2,
    VISIT: 3,
    RETURN: 6,
  },
};

export function* stackPushGenerator(
  values: number[],
  value: number
): Generator<Step, number[], undefined> {
  const nextValues = [...values];

  yield {
    type: 'visit',
    nodeId: nextValues.length.toString(),
    line: STACK_LINE_NUMBERS.PUSH.COPY,
    description: 'Copy the current stack',
    activeIndices: [],
    valuesSnapshot: [...nextValues],
  };

  nextValues.push(value);

  yield {
    type: 'insert',
    nodeId: (nextValues.length - 1).toString(),
    line: STACK_LINE_NUMBERS.PUSH.PUSH,
    description: `Push ${value} onto the top of the stack`,
    activeIndices: [nextValues.length - 1],
    valuesSnapshot: [...nextValues],
  };

  yield {
    type: 'visit',
    nodeId: (nextValues.length - 1).toString(),
    line: STACK_LINE_NUMBERS.PUSH.RETURN,
    description: 'Return the updated stack',
    activeIndices: [nextValues.length - 1],
    valuesSnapshot: [...nextValues],
  };

  return nextValues;
}

export function* stackPopGenerator(values: number[]): Generator<Step, number[], undefined> {
  const nextValues = [...values];
  const topIndex = nextValues.length - 1;

  yield {
    type: 'compare',
    nodeId: topIndex >= 0 ? topIndex.toString() : null,
    line: STACK_LINE_NUMBERS.POP.CHECK,
    description: 'Check the top of the stack',
    activeIndices: topIndex >= 0 ? [topIndex] : [],
    valuesSnapshot: [...nextValues],
  };

  nextValues.pop();

  yield {
    type: 'delete',
    nodeId: topIndex >= 0 ? topIndex.toString() : null,
    line: STACK_LINE_NUMBERS.POP.POP,
    description: 'Pop the top value off the stack',
    activeIndices: [],
    valuesSnapshot: [...nextValues],
  };

  yield {
    type: 'visit',
    nodeId: null,
    line: STACK_LINE_NUMBERS.POP.RETURN,
    description: 'Return the updated stack',
    activeIndices: [],
    valuesSnapshot: [...nextValues],
  };

  return nextValues;
}

export function* stackSearchGenerator(
  values: number[],
  target: number
): Generator<Step, { foundIndex: number }, undefined> {
  for (let index = values.length - 1; index >= 0; index -= 1) {
    yield {
      type: 'visit',
      nodeId: index.toString(),
      line: STACK_LINE_NUMBERS.SEARCH.LOOP,
      description: `Inspect stack entry at index ${index}`,
      activeIndices: [index],
      valuesSnapshot: [...values],
      foundIndex: null,
    };

    yield {
      type: 'compare',
      nodeId: index.toString(),
      line: STACK_LINE_NUMBERS.SEARCH.COMPARE,
      description: `Compare ${values[index]} with target ${target}`,
      activeIndices: [index],
      valuesSnapshot: [...values],
      foundIndex: null,
    };

    if (values[index] === target) {
      yield {
        type: 'found',
        nodeId: index.toString(),
        line: STACK_LINE_NUMBERS.SEARCH.FOUND,
        description: `Found ${target} in the stack`,
        activeIndices: [index],
        valuesSnapshot: [...values],
        foundIndex: index,
      };

      return { foundIndex: index };
    }
  }

  yield {
    type: 'not-found',
    nodeId: null,
    line: STACK_LINE_NUMBERS.SEARCH.NOT_FOUND,
    description: `${target} is not in the stack`,
    activeIndices: [],
    valuesSnapshot: [...values],
    foundIndex: null,
  };

  return { foundIndex: -1 };
}

export function* stackTraverseGenerator(values: number[]): Generator<Step, number[], undefined> {
  const visited: number[] = [];

  for (let index = values.length - 1; index >= 0; index -= 1) {
    yield {
      type: 'visit',
      nodeId: index.toString(),
      line: STACK_LINE_NUMBERS.TRAVERSE.LOOP,
      description: `Move to stack level ${index}`,
      activeIndices: [index],
      valuesSnapshot: [...values],
    };

    visited.push(values[index]);

    yield {
      type: 'traverse',
      nodeId: index.toString(),
      line: STACK_LINE_NUMBERS.TRAVERSE.VISIT,
      description: `Visit ${values[index]}`,
      activeIndices: [index],
      valuesSnapshot: [...values],
    };
  }

  yield {
    type: 'visit',
    nodeId: null,
    line: STACK_LINE_NUMBERS.TRAVERSE.RETURN,
    description: 'Stack traversal complete',
    activeIndices: [],
    valuesSnapshot: [...values],
  };

  return visited;
}
