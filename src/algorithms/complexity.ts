import type { StructureKind } from '../types';

export interface ComplexityEntry {
  time: string;
  space: string;
}

export const COMPLEXITY: Record<StructureKind, ComplexityEntry> = {
  array: { time: 'O(n)', space: 'O(1)' },
  stack: { time: 'O(1)', space: 'O(n)' },
  queue: { time: 'O(1)', space: 'O(n)' },
  heap: { time: 'O(log n)', space: 'O(1)' },
  'hash-table': { time: 'O(1)', space: 'O(n)' },
  bst: { time: 'O(log n)', space: 'O(n)' },
  'linked-list': { time: 'O(n)', space: 'O(1)' },
  'doubly-linked-list': { time: 'O(n)', space: 'O(1)' },
  graph: { time: 'O(V + E)', space: 'O(V)' },
  'two-pointer': { time: 'O(n)', space: 'O(1)' },
  'sliding-window': { time: 'O(n)', space: 'O(1)' },
  'binary-search': { time: 'O(log n)', space: 'O(1)' },
  'merge-sort': { time: 'O(n log n)', space: 'O(n)' },
  'quick-sort': { time: 'O(n log n)', space: 'O(log n)' },
  'prefix-sum': { time: 'O(n)', space: 'O(n)' },
  kadane: { time: 'O(n)', space: 'O(1)' },
  recursion: { time: 'O(n)', space: 'O(n)' },
};
