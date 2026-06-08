import { Step } from '../../types';

export const HASH_TABLE_BUCKET_COUNT = 5;

export const HASH_TABLE_LINE_NUMBERS = {
  INSERT: {
    HASH: 2,
    CHECK: 4,
    APPEND: 7,
    RETURN: 9,
  },
  DELETE: {
    HASH: 2,
    SCAN: 4,
    REMOVE: 7,
    RETURN: 10,
  },
  SEARCH: {
    HASH: 2,
    SCAN: 4,
    FOUND: 6,
    NOT_FOUND: 10,
  },
  TRAVERSE: {
    BUCKET: 2,
    ENTRY: 4,
    RETURN: 8,
  },
};

function cloneBuckets(buckets: number[][]): number[][] {
  return buckets.map((bucket) => [...bucket]);
}

export function getBucketIndex(value: number, bucketCount = HASH_TABLE_BUCKET_COUNT) {
  return ((value % bucketCount) + bucketCount) % bucketCount;
}

export function createEmptyHashTable(bucketCount = HASH_TABLE_BUCKET_COUNT): number[][] {
  return Array.from({ length: bucketCount }, () => []);
}

export function buildHashTable(values: number[], bucketCount = HASH_TABLE_BUCKET_COUNT): number[][] {
  const buckets = createEmptyHashTable(bucketCount);

  for (const value of values) {
    const bucketIndex = getBucketIndex(value, bucketCount);
    if (!buckets[bucketIndex].includes(value)) {
      buckets[bucketIndex].push(value);
    }
  }

  return buckets;
}

export function* hashTableInsertGenerator(
  buckets: number[][],
  value: number
): Generator<Step, number[][], undefined> {
  const nextBuckets = cloneBuckets(buckets);
  const bucketIndex = getBucketIndex(value, nextBuckets.length);

  yield {
    type: 'compare',
    nodeId: bucketIndex.toString(),
    line: HASH_TABLE_LINE_NUMBERS.INSERT.HASH,
    description: `Hash ${value} into bucket ${bucketIndex}`,
    bucketSnapshot: cloneBuckets(nextBuckets),
    activeBucketIndex: bucketIndex,
    activeEntryIndex: null,
  };

  const existingIndex = nextBuckets[bucketIndex].indexOf(value);
  yield {
    type: 'compare',
    nodeId: existingIndex >= 0 ? `${bucketIndex}-${existingIndex}` : bucketIndex.toString(),
    line: HASH_TABLE_LINE_NUMBERS.INSERT.CHECK,
    description:
      existingIndex >= 0
        ? `${value} is already in bucket ${bucketIndex}`
        : `Scan bucket ${bucketIndex} for duplicates`,
    bucketSnapshot: cloneBuckets(nextBuckets),
    activeBucketIndex: bucketIndex,
    activeEntryIndex: existingIndex >= 0 ? existingIndex : null,
  };

  if (existingIndex < 0) {
    nextBuckets[bucketIndex].push(value);

    yield {
      type: 'insert',
      nodeId: `${bucketIndex}-${nextBuckets[bucketIndex].length - 1}`,
      line: HASH_TABLE_LINE_NUMBERS.INSERT.APPEND,
      description: `Insert ${value} into bucket ${bucketIndex}`,
      bucketSnapshot: cloneBuckets(nextBuckets),
      activeBucketIndex: bucketIndex,
      activeEntryIndex: nextBuckets[bucketIndex].length - 1,
    };
  }

  yield {
    type: 'visit',
    nodeId: bucketIndex.toString(),
    line: HASH_TABLE_LINE_NUMBERS.INSERT.RETURN,
    description: 'Return the updated hash table',
    bucketSnapshot: cloneBuckets(nextBuckets),
    activeBucketIndex: bucketIndex,
    activeEntryIndex: existingIndex >= 0 ? existingIndex : nextBuckets[bucketIndex].length - 1,
  };

  return nextBuckets;
}

export function* hashTableDeleteGenerator(
  buckets: number[][],
  value: number
): Generator<Step, number[][], undefined> {
  const nextBuckets = cloneBuckets(buckets);
  const bucketIndex = getBucketIndex(value, nextBuckets.length);

  yield {
    type: 'compare',
    nodeId: bucketIndex.toString(),
    line: HASH_TABLE_LINE_NUMBERS.DELETE.HASH,
    description: `Hash ${value} into bucket ${bucketIndex}`,
    bucketSnapshot: cloneBuckets(nextBuckets),
    activeBucketIndex: bucketIndex,
    activeEntryIndex: null,
  };

  const entryIndex = nextBuckets[bucketIndex].indexOf(value);

  yield {
    type: 'compare',
    nodeId: entryIndex >= 0 ? `${bucketIndex}-${entryIndex}` : bucketIndex.toString(),
    line: HASH_TABLE_LINE_NUMBERS.DELETE.SCAN,
    description:
      entryIndex >= 0
        ? `Found ${value} inside bucket ${bucketIndex}`
        : `${value} is not stored in bucket ${bucketIndex}`,
    bucketSnapshot: cloneBuckets(nextBuckets),
    activeBucketIndex: bucketIndex,
    activeEntryIndex: entryIndex >= 0 ? entryIndex : null,
  };

  if (entryIndex >= 0) {
    nextBuckets[bucketIndex].splice(entryIndex, 1);

    yield {
      type: 'delete',
      nodeId: `${bucketIndex}-${entryIndex}`,
      line: HASH_TABLE_LINE_NUMBERS.DELETE.REMOVE,
      description: `Remove ${value} from bucket ${bucketIndex}`,
      bucketSnapshot: cloneBuckets(nextBuckets),
      activeBucketIndex: bucketIndex,
      activeEntryIndex: null,
    };
  }

  yield {
    type: 'visit',
    nodeId: bucketIndex.toString(),
    line: HASH_TABLE_LINE_NUMBERS.DELETE.RETURN,
    description: 'Return the updated hash table',
    bucketSnapshot: cloneBuckets(nextBuckets),
    activeBucketIndex: bucketIndex,
    activeEntryIndex: null,
  };

  return nextBuckets;
}

export function* hashTableSearchGenerator(
  buckets: number[][],
  value: number
): Generator<Step, { found: boolean }, undefined> {
  const bucketIndex = getBucketIndex(value, buckets.length);

  yield {
    type: 'compare',
    nodeId: bucketIndex.toString(),
    line: HASH_TABLE_LINE_NUMBERS.SEARCH.HASH,
    description: `Hash ${value} into bucket ${bucketIndex}`,
    bucketSnapshot: cloneBuckets(buckets),
    activeBucketIndex: bucketIndex,
    activeEntryIndex: null,
    foundBucketIndex: null,
    foundEntryIndex: null,
  };

  for (let entryIndex = 0; entryIndex < buckets[bucketIndex].length; entryIndex += 1) {
    yield {
      type: 'compare',
      nodeId: `${bucketIndex}-${entryIndex}`,
      line: HASH_TABLE_LINE_NUMBERS.SEARCH.SCAN,
      description: `Compare ${buckets[bucketIndex][entryIndex]} with target ${value}`,
      bucketSnapshot: cloneBuckets(buckets),
      activeBucketIndex: bucketIndex,
      activeEntryIndex: entryIndex,
      foundBucketIndex: null,
      foundEntryIndex: null,
    };

    if (buckets[bucketIndex][entryIndex] === value) {
      yield {
        type: 'found',
        nodeId: `${bucketIndex}-${entryIndex}`,
        line: HASH_TABLE_LINE_NUMBERS.SEARCH.FOUND,
        description: `Found ${value} in bucket ${bucketIndex}`,
        bucketSnapshot: cloneBuckets(buckets),
        activeBucketIndex: bucketIndex,
        activeEntryIndex: entryIndex,
        foundBucketIndex: bucketIndex,
        foundEntryIndex: entryIndex,
      };

      return { found: true };
    }
  }

  yield {
    type: 'not-found',
    nodeId: bucketIndex.toString(),
    line: HASH_TABLE_LINE_NUMBERS.SEARCH.NOT_FOUND,
    description: `${value} is not in the hash table`,
    bucketSnapshot: cloneBuckets(buckets),
    activeBucketIndex: bucketIndex,
    activeEntryIndex: null,
    foundBucketIndex: null,
    foundEntryIndex: null,
  };

  return { found: false };
}

export function* hashTableTraverseGenerator(
  buckets: number[][]
): Generator<Step, number[], undefined> {
  const visited: number[] = [];

  for (let bucketIndex = 0; bucketIndex < buckets.length; bucketIndex += 1) {
    yield {
      type: 'visit',
      nodeId: bucketIndex.toString(),
      line: HASH_TABLE_LINE_NUMBERS.TRAVERSE.BUCKET,
      description: `Visit bucket ${bucketIndex}`,
      bucketSnapshot: cloneBuckets(buckets),
      activeBucketIndex: bucketIndex,
      activeEntryIndex: null,
    };

    for (let entryIndex = 0; entryIndex < buckets[bucketIndex].length; entryIndex += 1) {
      visited.push(buckets[bucketIndex][entryIndex]);

      yield {
        type: 'traverse',
        nodeId: `${bucketIndex}-${entryIndex}`,
        line: HASH_TABLE_LINE_NUMBERS.TRAVERSE.ENTRY,
        description: `Visit ${buckets[bucketIndex][entryIndex]} in bucket ${bucketIndex}`,
        bucketSnapshot: cloneBuckets(buckets),
        activeBucketIndex: bucketIndex,
        activeEntryIndex: entryIndex,
      };
    }
  }

  yield {
    type: 'visit',
    nodeId: null,
    line: HASH_TABLE_LINE_NUMBERS.TRAVERSE.RETURN,
    description: 'Hash table traversal complete',
    bucketSnapshot: cloneBuckets(buckets),
    activeBucketIndex: null,
    activeEntryIndex: null,
  };

  return visited;
}
