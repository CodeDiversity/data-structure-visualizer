import { Step } from '../../types';

export const MERGE_SORT_LINE_NUMBERS = {
  BASE_CASE: 2,
  CALCULATE_MID: 6,
  SORT_LEFT: 7,
  SORT_RIGHT: 8,
  MERGE_CALL: 9,
  COPY_LEFT: 13,
  COPY_RIGHT: 14,
  COMPARE: 19,
  WRITE_LEFT: 20,
  WRITE_RIGHT: 23,
  FLUSH_LEFT: 29,
  FLUSH_RIGHT: 35,
};

export function* mergeSortGenerator(
  values: number[]
): Generator<Step, number[], undefined> {
  const nextValues = [...values];
  const sortedIndices = new Set<number>();

  function* mergeSortRange(start: number, end: number): Generator<Step, void, undefined> {
    yield {
      type: 'visit',
      nodeId: start.toString(),
      line: MERGE_SORT_LINE_NUMBERS.BASE_CASE,
      description:
        start >= end
          ? `Range [${start}, ${end}] has one element, so it is already sorted`
          : `Check whether range [${start}, ${end}] needs to be split`,
      valuesSnapshot: [...nextValues],
      activeIndices: buildRange(start, end),
      sortedIndices: Array.from(sortedIndices).sort((a, b) => a - b),
      mergeStart: start,
      mergeEnd: end,
      debugVariables: {
        values: nextValues,
        start,
        end,
      },
    };

    if (start >= end) {
      sortedIndices.add(start);
      return;
    }

    const mid = Math.floor((start + end) / 2);

    yield {
      type: 'compare',
      nodeId: mid.toString(),
      line: MERGE_SORT_LINE_NUMBERS.CALCULATE_MID,
      description: `Split range [${start}, ${end}] at midpoint ${mid}`,
      valuesSnapshot: [...nextValues],
      activeIndices: buildRange(start, end),
      sortedIndices: Array.from(sortedIndices).sort((a, b) => a - b),
      mergeStart: start,
      mergeEnd: end,
      debugVariables: {
        values: nextValues,
        start,
        end,
        mid,
      },
    };

    yield {
      type: 'visit',
      nodeId: start.toString(),
      line: MERGE_SORT_LINE_NUMBERS.SORT_LEFT,
      description: `Recursively sort left half [${start}, ${mid}]`,
      valuesSnapshot: [...nextValues],
      activeIndices: buildRange(start, mid),
      sortedIndices: Array.from(sortedIndices).sort((a, b) => a - b),
      mergeStart: start,
      mergeEnd: mid,
      debugVariables: {
        values: nextValues,
        start,
        end,
        mid,
      },
    };
    yield* mergeSortRange(start, mid);

    yield {
      type: 'visit',
      nodeId: (mid + 1).toString(),
      line: MERGE_SORT_LINE_NUMBERS.SORT_RIGHT,
      description: `Recursively sort right half [${mid + 1}, ${end}]`,
      valuesSnapshot: [...nextValues],
      activeIndices: buildRange(mid + 1, end),
      sortedIndices: Array.from(sortedIndices).sort((a, b) => a - b),
      mergeStart: mid + 1,
      mergeEnd: end,
      debugVariables: {
        values: nextValues,
        start,
        end,
        mid,
      },
    };
    yield* mergeSortRange(mid + 1, end);

    yield {
      type: 'move',
      nodeId: start.toString(),
      line: MERGE_SORT_LINE_NUMBERS.MERGE_CALL,
      description: `Merge sorted halves [${start}, ${mid}] and [${mid + 1}, ${end}]`,
      valuesSnapshot: [...nextValues],
      activeIndices: buildRange(start, end),
      sortedIndices: Array.from(sortedIndices).sort((a, b) => a - b),
      mergeStart: start,
      mergeEnd: end,
      debugVariables: {
        values: nextValues,
        start,
        end,
        mid,
      },
    };
    yield* mergeRange(start, mid, end);
  }

  function* mergeRange(start: number, mid: number, end: number): Generator<Step, void, undefined> {
    const left = nextValues.slice(start, mid + 1);
    const right = nextValues.slice(mid + 1, end + 1);

    yield {
      type: 'visit',
      nodeId: start.toString(),
      line: MERGE_SORT_LINE_NUMBERS.COPY_LEFT,
      description: `Copy left half ${left.join(', ')}`,
      valuesSnapshot: [...nextValues],
      activeIndices: buildRange(start, mid),
      sortedIndices: Array.from(sortedIndices).sort((a, b) => a - b),
      mergeStart: start,
      mergeEnd: end,
      debugVariables: {
        values: nextValues,
        start,
        mid,
        end,
        left,
      },
    };

    yield {
      type: 'visit',
      nodeId: (mid + 1).toString(),
      line: MERGE_SORT_LINE_NUMBERS.COPY_RIGHT,
      description: `Copy right half ${right.join(', ')}`,
      valuesSnapshot: [...nextValues],
      activeIndices: buildRange(mid + 1, end),
      sortedIndices: Array.from(sortedIndices).sort((a, b) => a - b),
      mergeStart: start,
      mergeEnd: end,
      debugVariables: {
        values: nextValues,
        start,
        mid,
        end,
        left,
        right,
      },
    };

    let leftIndex = 0;
    let rightIndex = 0;
    let writeIndex = start;

    while (leftIndex < left.length && rightIndex < right.length) {
      yield {
        type: 'compare',
        nodeId: writeIndex.toString(),
        line: MERGE_SORT_LINE_NUMBERS.COMPARE,
        description: `Compare ${left[leftIndex]} and ${right[rightIndex]}`,
        valuesSnapshot: [...nextValues],
        activeIndices: [start + leftIndex, mid + 1 + rightIndex, writeIndex],
        sortedIndices: Array.from(sortedIndices).sort((a, b) => a - b),
        mergeStart: start,
        mergeEnd: end,
        debugVariables: {
          values: nextValues,
          start,
          mid,
          end,
          left,
          right,
          leftIndex,
          rightIndex,
          writeIndex,
        },
      };

      if (left[leftIndex] <= right[rightIndex]) {
        nextValues[writeIndex] = left[leftIndex];

        yield {
          type: 'move',
          nodeId: writeIndex.toString(),
          line: MERGE_SORT_LINE_NUMBERS.WRITE_LEFT,
          description: `Write ${left[leftIndex]} into index ${writeIndex}`,
          valuesSnapshot: [...nextValues],
          activeIndices: [writeIndex],
          sortedIndices: Array.from(sortedIndices).sort((a, b) => a - b),
          mergeStart: start,
          mergeEnd: end,
          debugVariables: {
            values: nextValues,
            start,
            mid,
            end,
            left,
            right,
            leftIndex,
            rightIndex,
            writeIndex,
          },
        };

        leftIndex += 1;
      } else {
        nextValues[writeIndex] = right[rightIndex];

        yield {
          type: 'move',
          nodeId: writeIndex.toString(),
          line: MERGE_SORT_LINE_NUMBERS.WRITE_RIGHT,
          description: `Write ${right[rightIndex]} into index ${writeIndex}`,
          valuesSnapshot: [...nextValues],
          activeIndices: [writeIndex],
          sortedIndices: Array.from(sortedIndices).sort((a, b) => a - b),
          mergeStart: start,
          mergeEnd: end,
          debugVariables: {
            values: nextValues,
            start,
            mid,
            end,
            left,
            right,
            leftIndex,
            rightIndex,
            writeIndex,
          },
        };

        rightIndex += 1;
      }

      writeIndex += 1;
    }

    while (leftIndex < left.length) {
      nextValues[writeIndex] = left[leftIndex];

      yield {
        type: 'move',
        nodeId: writeIndex.toString(),
        line: MERGE_SORT_LINE_NUMBERS.FLUSH_LEFT,
        description: `Copy remaining left value ${left[leftIndex]} into index ${writeIndex}`,
        valuesSnapshot: [...nextValues],
        activeIndices: [writeIndex],
        sortedIndices: Array.from(sortedIndices).sort((a, b) => a - b),
        mergeStart: start,
        mergeEnd: end,
        debugVariables: {
          values: nextValues,
          start,
          mid,
          end,
          left,
          right,
          leftIndex,
          rightIndex,
          writeIndex,
        },
      };

      leftIndex += 1;
      writeIndex += 1;
    }

    while (rightIndex < right.length) {
      nextValues[writeIndex] = right[rightIndex];

      yield {
        type: 'move',
        nodeId: writeIndex.toString(),
        line: MERGE_SORT_LINE_NUMBERS.FLUSH_RIGHT,
        description: `Copy remaining right value ${right[rightIndex]} into index ${writeIndex}`,
        valuesSnapshot: [...nextValues],
        activeIndices: [writeIndex],
        sortedIndices: Array.from(sortedIndices).sort((a, b) => a - b),
        mergeStart: start,
        mergeEnd: end,
        debugVariables: {
          values: nextValues,
          start,
          mid,
          end,
          left,
          right,
          leftIndex,
          rightIndex,
          writeIndex,
        },
      };

      rightIndex += 1;
      writeIndex += 1;
    }

    for (let index = start; index <= end; index += 1) {
      sortedIndices.add(index);
    }
  }

  if (nextValues.length === 0) {
    return nextValues;
  }

  yield* mergeSortRange(0, nextValues.length - 1);

  yield {
    type: 'found',
    nodeId: null,
    line: MERGE_SORT_LINE_NUMBERS.MERGE_CALL,
    description: 'Merge sort complete',
    valuesSnapshot: [...nextValues],
    activeIndices: [],
    sortedIndices: nextValues.map((_, index) => index),
    mergeStart: 0,
    mergeEnd: nextValues.length - 1,
    debugVariables: {
      values: nextValues,
      start: 0,
      end: nextValues.length - 1,
    },
  };

  return nextValues;
}

function buildRange(start: number, end: number): number[] {
  if (end < start) {
    return [];
  }

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}
