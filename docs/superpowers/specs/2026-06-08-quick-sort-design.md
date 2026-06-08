# Quick Sort Visualization Design

## Overview
Adds quick sort (Lomuto partition scheme) as a new sorting algorithm visualization alongside merge sort.

## Visualization Approach

- **Blue border** = currently active/being compared elements
- **Orange border** = pivot element
- **Green border** = confirmed sorted (in final position after partition completes)
- Swap animations show elements physically exchanging positions

## Data Shape

```ts
interface QuickSortData {
  values: number[];
  activeIndices: number[];     // currently being compared/swapped
  sortedIndices: number[];     // confirmed in final position
  pivotIndex: number | null;   // current pivot
  partitionStart: number | null;
  partitionEnd: number | null;
}
```

## Files to Create

1. `src/algorithms/quick-sort/code-strings.ts` — the quick sort code display
2. `src/algorithms/quick-sort/generators.ts` — step generator with Lomuto partition
3. `src/components/QuickSortVisualization/QuickSortVisualization.tsx` — React component

## Files to Modify

1. `src/types/index.ts` — add `QuickSortData` interface and `'quick-sort'` to `StructureKind`
2. `src/state/ExecutionContext.tsx` — add quick sort state and context
3. `src/App.tsx` — wire up visualization, code panel, and nav button

## Algorithm: Lomuto Partition

```
function quickSort(values, low, high):
  if low < high:
    pivotIndex = partition(values, low, high)
    quickSort(values, low, pivotIndex - 1)
    quickSort(values, pivotIndex + 1, high)

function partition(values, low, high):
  pivot = values[high]  // last element is pivot
  i = low - 1
  for j = low to high - 1:
    if values[j] <= pivot:
      i += 1
      swap(values[i], values[j])
  swap(values[i + 1], values[high])
  return i + 1
```

## Step Types

- `visit` — selecting pivot, entering partition
- `compare` — comparing element to pivot
- `move` — swapping elements
- `found` — partition complete, element in final position