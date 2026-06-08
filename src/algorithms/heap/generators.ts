import { Step } from '../../types';

export const HEAP_LINE_NUMBERS = {
  INSERT: {
    COPY: 2,
    PUSH: 3,
    BUBBLE: 6,
    SWAP: 8,
    RETURN: 12,
  },
  EXTRACT: {
    CHECK: 2,
    MOVE_LAST: 5,
    SINK: 9,
    SWAP: 13,
    RETURN: 18,
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

function swap(values: number[], first: number, second: number) {
  const temp = values[first];
  values[first] = values[second];
  values[second] = temp;
}

export function* heapInsertGenerator(
  values: number[],
  value: number
): Generator<Step, number[], undefined> {
  const nextValues = [...values];

  yield {
    type: 'visit',
    nodeId: nextValues.length.toString(),
    line: HEAP_LINE_NUMBERS.INSERT.COPY,
    description: 'Copy the current heap array',
    activeIndices: [],
    valuesSnapshot: [...nextValues],
  };

  nextValues.push(value);
  let currentIndex = nextValues.length - 1;

  yield {
    type: 'insert',
    nodeId: currentIndex.toString(),
    line: HEAP_LINE_NUMBERS.INSERT.PUSH,
    description: `Insert ${value} at the end of the heap`,
    activeIndices: [currentIndex],
    valuesSnapshot: [...nextValues],
  };

  while (currentIndex > 0) {
    const parentIndex = Math.floor((currentIndex - 1) / 2);

    yield {
      type: 'compare',
      nodeId: currentIndex.toString(),
      line: HEAP_LINE_NUMBERS.INSERT.BUBBLE,
      description: `Compare child ${nextValues[currentIndex]} with parent ${nextValues[parentIndex]}`,
      activeIndices: [parentIndex, currentIndex],
      valuesSnapshot: [...nextValues],
    };

    if (nextValues[parentIndex] >= nextValues[currentIndex]) {
      break;
    }

    swap(nextValues, parentIndex, currentIndex);

    yield {
      type: 'move',
      nodeId: parentIndex.toString(),
      line: HEAP_LINE_NUMBERS.INSERT.SWAP,
      description: `Swap to restore max-heap order`,
      activeIndices: [parentIndex, currentIndex],
      valuesSnapshot: [...nextValues],
    };

    currentIndex = parentIndex;
  }

  yield {
    type: 'visit',
    nodeId: currentIndex.toString(),
    line: HEAP_LINE_NUMBERS.INSERT.RETURN,
    description: 'Return the updated heap',
    activeIndices: [currentIndex],
    valuesSnapshot: [...nextValues],
  };

  return nextValues;
}

export function* heapExtractMaxGenerator(values: number[]): Generator<Step, number[], undefined> {
  const nextValues = [...values];

  yield {
    type: 'compare',
    nodeId: nextValues.length > 0 ? '0' : null,
    line: HEAP_LINE_NUMBERS.EXTRACT.CHECK,
    description: 'Inspect the heap root',
    activeIndices: nextValues.length > 0 ? [0] : [],
    valuesSnapshot: [...nextValues],
  };

  if (nextValues.length <= 1) {
    nextValues.pop();

    yield {
      type: 'delete',
      nodeId: '0',
      line: HEAP_LINE_NUMBERS.EXTRACT.RETURN,
      description: 'Heap is now empty after removing the root',
      activeIndices: [],
      valuesSnapshot: [...nextValues],
    };

    return nextValues;
  }

  nextValues[0] = nextValues[nextValues.length - 1];
  nextValues.pop();

  yield {
    type: 'move',
    nodeId: '0',
    line: HEAP_LINE_NUMBERS.EXTRACT.MOVE_LAST,
    description: 'Move the last value to the root',
    activeIndices: [0],
    valuesSnapshot: [...nextValues],
  };

  let currentIndex = 0;

  while (true) {
    const left = currentIndex * 2 + 1;
    const right = currentIndex * 2 + 2;
    let largest = currentIndex;

    yield {
      type: 'compare',
      nodeId: currentIndex.toString(),
      line: HEAP_LINE_NUMBERS.EXTRACT.SINK,
      description: `Compare root candidate with its children`,
      activeIndices: [currentIndex, left, right].filter((index) => index < nextValues.length),
      valuesSnapshot: [...nextValues],
    };

    if (left < nextValues.length && nextValues[left] > nextValues[largest]) {
      largest = left;
    }

    if (right < nextValues.length && nextValues[right] > nextValues[largest]) {
      largest = right;
    }

    if (largest === currentIndex) {
      break;
    }

    swap(nextValues, currentIndex, largest);

    yield {
      type: 'move',
      nodeId: largest.toString(),
      line: HEAP_LINE_NUMBERS.EXTRACT.SWAP,
      description: 'Swap downward to restore max-heap order',
      activeIndices: [currentIndex, largest],
      valuesSnapshot: [...nextValues],
    };

    currentIndex = largest;
  }

  yield {
    type: 'visit',
    nodeId: currentIndex.toString(),
    line: HEAP_LINE_NUMBERS.EXTRACT.RETURN,
    description: 'Return the updated heap',
    activeIndices: [currentIndex],
    valuesSnapshot: [...nextValues],
  };

  return nextValues;
}

export function* heapSearchGenerator(
  values: number[],
  target: number
): Generator<Step, { foundIndex: number }, undefined> {
  for (let index = 0; index < values.length; index += 1) {
    yield {
      type: 'visit',
      nodeId: index.toString(),
      line: HEAP_LINE_NUMBERS.SEARCH.LOOP,
      description: `Inspect heap node at index ${index}`,
      activeIndices: [index],
      valuesSnapshot: [...values],
      foundIndex: null,
    };

    yield {
      type: 'compare',
      nodeId: index.toString(),
      line: HEAP_LINE_NUMBERS.SEARCH.COMPARE,
      description: `Compare ${values[index]} with target ${target}`,
      activeIndices: [index],
      valuesSnapshot: [...values],
      foundIndex: null,
    };

    if (values[index] === target) {
      yield {
        type: 'found',
        nodeId: index.toString(),
        line: HEAP_LINE_NUMBERS.SEARCH.FOUND,
        description: `Found ${target} in the heap`,
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
    line: HEAP_LINE_NUMBERS.SEARCH.NOT_FOUND,
    description: `${target} is not in the heap`,
    activeIndices: [],
    valuesSnapshot: [...values],
    foundIndex: null,
  };

  return { foundIndex: -1 };
}

export function* heapTraverseGenerator(values: number[]): Generator<Step, number[], undefined> {
  const visited: number[] = [];

  for (let index = 0; index < values.length; index += 1) {
    yield {
      type: 'visit',
      nodeId: index.toString(),
      line: HEAP_LINE_NUMBERS.TRAVERSE.LOOP,
      description: `Move to heap index ${index}`,
      activeIndices: [index],
      valuesSnapshot: [...values],
    };

    visited.push(values[index]);

    yield {
      type: 'traverse',
      nodeId: index.toString(),
      line: HEAP_LINE_NUMBERS.TRAVERSE.VISIT,
      description: `Visit ${values[index]}`,
      activeIndices: [index],
      valuesSnapshot: [...values],
    };
  }

  yield {
    type: 'visit',
    nodeId: null,
    line: HEAP_LINE_NUMBERS.TRAVERSE.RETURN,
    description: 'Heap traversal complete',
    activeIndices: [],
    valuesSnapshot: [...values],
  };

  return visited;
}
