import { Step } from '../../types';

export const QUEUE_LINE_NUMBERS = {
  ENQUEUE: {
    COPY: 2,
    PUSH: 3,
    RETURN: 5,
  },
  DEQUEUE: {
    CHECK: 2,
    SHIFT: 4,
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

export function* queueEnqueueGenerator(
  values: number[],
  value: number
): Generator<Step, number[], undefined> {
  const nextValues = [...values];

  yield {
    type: 'visit',
    nodeId: nextValues.length.toString(),
    line: QUEUE_LINE_NUMBERS.ENQUEUE.COPY,
    description: 'Copy the current queue',
    activeIndices: [],
    valuesSnapshot: [...nextValues],
  };

  nextValues.push(value);

  yield {
    type: 'insert',
    nodeId: (nextValues.length - 1).toString(),
    line: QUEUE_LINE_NUMBERS.ENQUEUE.PUSH,
    description: `Enqueue ${value} at the rear`,
    activeIndices: [nextValues.length - 1],
    valuesSnapshot: [...nextValues],
  };

  yield {
    type: 'visit',
    nodeId: (nextValues.length - 1).toString(),
    line: QUEUE_LINE_NUMBERS.ENQUEUE.RETURN,
    description: 'Return the updated queue',
    activeIndices: [nextValues.length - 1],
    valuesSnapshot: [...nextValues],
  };

  return nextValues;
}

export function* queueDequeueGenerator(values: number[]): Generator<Step, number[], undefined> {
  const nextValues = [...values];

  yield {
    type: 'compare',
    nodeId: nextValues.length > 0 ? '0' : null,
    line: QUEUE_LINE_NUMBERS.DEQUEUE.CHECK,
    description: 'Inspect the front of the queue',
    activeIndices: nextValues.length > 0 ? [0] : [],
    valuesSnapshot: [...nextValues],
  };

  nextValues.shift();

  yield {
    type: 'delete',
    nodeId: '0',
    line: QUEUE_LINE_NUMBERS.DEQUEUE.SHIFT,
    description: 'Dequeue the front value',
    activeIndices: nextValues.length > 0 ? [0] : [],
    valuesSnapshot: [...nextValues],
  };

  yield {
    type: 'visit',
    nodeId: null,
    line: QUEUE_LINE_NUMBERS.DEQUEUE.RETURN,
    description: 'Return the updated queue',
    activeIndices: [],
    valuesSnapshot: [...nextValues],
  };

  return nextValues;
}

export function* queueSearchGenerator(
  values: number[],
  target: number
): Generator<Step, { foundIndex: number }, undefined> {
  for (let index = 0; index < values.length; index += 1) {
    yield {
      type: 'visit',
      nodeId: index.toString(),
      line: QUEUE_LINE_NUMBERS.SEARCH.LOOP,
      description: `Inspect queue position ${index}`,
      activeIndices: [index],
      valuesSnapshot: [...values],
      foundIndex: null,
    };

    yield {
      type: 'compare',
      nodeId: index.toString(),
      line: QUEUE_LINE_NUMBERS.SEARCH.COMPARE,
      description: `Compare ${values[index]} with target ${target}`,
      activeIndices: [index],
      valuesSnapshot: [...values],
      foundIndex: null,
    };

    if (values[index] === target) {
      yield {
        type: 'found',
        nodeId: index.toString(),
        line: QUEUE_LINE_NUMBERS.SEARCH.FOUND,
        description: `Found ${target} in the queue`,
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
    line: QUEUE_LINE_NUMBERS.SEARCH.NOT_FOUND,
    description: `${target} is not in the queue`,
    activeIndices: [],
    valuesSnapshot: [...values],
    foundIndex: null,
  };

  return { foundIndex: -1 };
}

export function* queueTraverseGenerator(values: number[]): Generator<Step, number[], undefined> {
  const visited: number[] = [];

  for (let index = 0; index < values.length; index += 1) {
    yield {
      type: 'visit',
      nodeId: index.toString(),
      line: QUEUE_LINE_NUMBERS.TRAVERSE.LOOP,
      description: `Move to queue position ${index}`,
      activeIndices: [index],
      valuesSnapshot: [...values],
    };

    visited.push(values[index]);

    yield {
      type: 'traverse',
      nodeId: index.toString(),
      line: QUEUE_LINE_NUMBERS.TRAVERSE.VISIT,
      description: `Visit ${values[index]}`,
      activeIndices: [index],
      valuesSnapshot: [...values],
    };
  }

  yield {
    type: 'visit',
    nodeId: null,
    line: QUEUE_LINE_NUMBERS.TRAVERSE.RETURN,
    description: 'Queue traversal complete',
    activeIndices: [],
    valuesSnapshot: [...values],
  };

  return visited;
}
