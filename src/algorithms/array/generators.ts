import { Step } from '../../types';

export const ARRAY_LINE_NUMBERS = {
  APPEND: {
    COPY: 2,
    PUSH: 3,
    RETURN: 5,
  },
  DELETE: {
    CHECK_INDEX: 2,
    SHIFT: 6,
    POP: 9,
    RETURN: 11,
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

export function* arrayAppendGenerator(
  values: number[],
  value: number
): Generator<Step, number[], undefined> {
  const nextValues = [...values];

  yield {
    type: 'visit',
    nodeId: nextValues.length.toString(),
    line: ARRAY_LINE_NUMBERS.APPEND.COPY,
    description: 'Create a writable copy of the array',
    activeIndices: [],
    valuesSnapshot: [...nextValues],
  };

  nextValues.push(value);

  yield {
    type: 'insert',
    nodeId: (nextValues.length - 1).toString(),
    line: ARRAY_LINE_NUMBERS.APPEND.PUSH,
    description: `Append ${value} at index ${nextValues.length - 1}`,
    activeIndices: [nextValues.length - 1],
    valuesSnapshot: [...nextValues],
  };

  yield {
    type: 'visit',
    nodeId: (nextValues.length - 1).toString(),
    line: ARRAY_LINE_NUMBERS.APPEND.RETURN,
    description: 'Return the updated array',
    activeIndices: [nextValues.length - 1],
    valuesSnapshot: [...nextValues],
  };

  return nextValues;
}

export function* arrayDeleteGenerator(
  values: number[],
  indexToDelete: number
): Generator<Step, number[], undefined> {
  const nextValues = [...values];

  yield {
    type: 'compare',
    nodeId: indexToDelete.toString(),
    line: ARRAY_LINE_NUMBERS.DELETE.CHECK_INDEX,
    description: `Validate delete index ${indexToDelete}`,
    activeIndices: [indexToDelete],
    valuesSnapshot: [...nextValues],
  };

  for (let index = indexToDelete; index < nextValues.length - 1; index += 1) {
    nextValues[index] = nextValues[index + 1];

    yield {
      type: 'move',
      nodeId: index.toString(),
      line: ARRAY_LINE_NUMBERS.DELETE.SHIFT,
      description: `Shift value from index ${index + 1} into index ${index}`,
      activeIndices: [index, index + 1],
      valuesSnapshot: [...nextValues],
    };
  }

  nextValues.pop();

  yield {
    type: 'delete',
    nodeId: Math.max(0, nextValues.length).toString(),
    line: ARRAY_LINE_NUMBERS.DELETE.POP,
    description: 'Remove the duplicate last element after shifting',
    activeIndices: [Math.max(0, nextValues.length - 1)],
    valuesSnapshot: [...nextValues],
  };

  yield {
    type: 'visit',
    nodeId: null,
    line: ARRAY_LINE_NUMBERS.DELETE.RETURN,
    description: 'Return the compacted array',
    activeIndices: [],
    valuesSnapshot: [...nextValues],
  };

  return nextValues;
}

export function* arraySearchGenerator(
  values: number[],
  target: number
): Generator<Step, { foundIndex: number }, undefined> {
  for (let index = 0; index < values.length; index += 1) {
    yield {
      type: 'visit',
      nodeId: index.toString(),
      line: ARRAY_LINE_NUMBERS.SEARCH.LOOP,
      description: `Visit index ${index}`,
      activeIndices: [index],
      valuesSnapshot: [...values],
      foundIndex: null,
    };

    yield {
      type: 'compare',
      nodeId: index.toString(),
      line: ARRAY_LINE_NUMBERS.SEARCH.COMPARE,
      description: `Compare ${values[index]} with target ${target}`,
      activeIndices: [index],
      valuesSnapshot: [...values],
      foundIndex: null,
    };

    if (values[index] === target) {
      yield {
        type: 'found',
        nodeId: index.toString(),
        line: ARRAY_LINE_NUMBERS.SEARCH.FOUND,
        description: `Found ${target} at index ${index}`,
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
    line: ARRAY_LINE_NUMBERS.SEARCH.NOT_FOUND,
    description: `${target} is not present in the array`,
    activeIndices: [],
    valuesSnapshot: [...values],
    foundIndex: null,
  };

  return { foundIndex: -1 };
}

export function* arrayTraverseGenerator(
  values: number[]
): Generator<Step, number[], undefined> {
  const visited: number[] = [];

  for (let index = 0; index < values.length; index += 1) {
    yield {
      type: 'visit',
      nodeId: index.toString(),
      line: ARRAY_LINE_NUMBERS.TRAVERSE.LOOP,
      description: `Move to index ${index}`,
      activeIndices: [index],
      valuesSnapshot: [...values],
    };

    visited.push(values[index]);

    yield {
      type: 'traverse',
      nodeId: index.toString(),
      line: ARRAY_LINE_NUMBERS.TRAVERSE.VISIT,
      description: `Visit value ${values[index]}`,
      activeIndices: [index],
      valuesSnapshot: [...values],
    };
  }

  yield {
    type: 'visit',
    nodeId: null,
    line: ARRAY_LINE_NUMBERS.TRAVERSE.RETURN,
    description: 'Traversal complete',
    activeIndices: [],
    valuesSnapshot: [...values],
  };

  return visited;
}
