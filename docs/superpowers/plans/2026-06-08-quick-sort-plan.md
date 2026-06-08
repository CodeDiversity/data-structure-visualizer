# Quick Sort Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add quick sort (Lomuto partition) as a new sorting algorithm visualization alongside merge sort.

**Architecture:** Quick sort uses in-place partitioning with Lomuto scheme. The visualization shows pivot selection (orange), element comparisons (blue), and swaps (animated). After each partition, the pivot lands in its final sorted position (green). Recursion continues on left and right subarrays.

**Tech Stack:** React, TypeScript, generator functions for step-by-step visualization

---

## File Structure

### New Files
- `src/algorithms/quick-sort/code-strings.ts`
- `src/algorithms/quick-sort/generators.ts`
- `src/components/QuickSortVisualization/QuickSortVisualization.tsx`

### Modified Files
- `src/types/index.ts` — add `QuickSortData` interface and `'quick-sort'` to `StructureKind`
- `src/state/ExecutionContext.tsx` — add `quickSortData` state and setters
- `src/App.tsx` — wire up QuickSortVisualization, QUICK_SORT_CODE, and nav button

---

## Task 1: Add QuickSortData type and StructureKind variant

**Files:**
- Modify: `src/types/index.ts`

- [ ] **Step 1: Add QuickSortData interface** (after MergeSortData, line ~78)

```ts
export interface QuickSortData {
  values: number[];
  activeIndices: number[];
  sortedIndices: number[];
  pivotIndex: number | null;
  partitionStart: number | null;
  partitionEnd: number | null;
}
```

- [ ] **Step 2: Add 'quick-sort' to StructureKind union** (line ~219)

```ts
| 'quick-sort'
```

- [ ] **Step 3: Commit**

```bash
git add src/types/index.ts
git commit -m "$(cat <<'EOF'
feat(types): add QuickSortData interface and quick-sort StructureKind

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Add quick sort state to ExecutionContext

**Files:**
- Modify: `src/state/ExecutionContext.tsx`

- [ ] **Step 1: Import QuickSortData** (add to import from `'../types'`, line ~11)

```ts
QuickSortData,
```

- [ ] **Step 2: Add context value declarations** (in `ExecutionContextValue` interface, after `mergeSortData`, line ~58)

```ts
quickSortData: QuickSortData;
setQuickSortData: (data: QuickSortData) => void;
```

- [ ] **Step 3: Add useState for quickSortData** (after mergeSortData state, line ~123)

```ts
const [quickSortData, setQuickSortData] = useState<QuickSortData>({
  values: [],
  activeIndices: [],
  sortedIndices: [],
  pivotIndex: null,
  partitionStart: null,
  partitionEnd: null,
});
```

- [ ] **Step 4: Add to context value object** (after mergeSortData, line ~197)

```ts
quickSortData,
setQuickSortData,
```

- [ ] **Step 5: Commit**

```bash
git add src/state/ExecutionContext.tsx
git commit -m "$(cat <<'EOF'
feat(context): add quickSortData state

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Create quick sort code strings

**Files:**
- Create: `src/algorithms/quick-sort/code-strings.ts`

- [ ] **Step 1: Write the file**

```ts
export const QUICK_SORT_CODE = `function quickSort(values, low = 0, high = values.length - 1) {
  if (low < high) {
    const pivotIndex = partition(values, low, high);
    quickSort(values, low, pivotIndex - 1);
    quickSort(values, pivotIndex + 1, high);
  }
}

function partition(values, low, high) {
  const pivot = values[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (values[j] <= pivot) {
      i += 1;
      [values[i], values[j]] = [values[j], values[i]];
    }
  }

  [values[i + 1], values[high]] = [values[high], values[i + 1]];
  return i + 1;
}`;
```

- [ ] **Step 2: Commit**

```bash
git add src/algorithms/quick-sort/code-strings.ts
git commit -m "$(cat <<'EOF'
feat(quick-sort): add code strings

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Create quick sort generator

**Files:**
- Create: `src/algorithms/quick-sort/generators.ts`

- [ ] **Step 1: Write the file**

```ts
import { Step } from '../../types';

export const QUICK_SORT_LINE_NUMBERS = {
  BASE_CASE: 2,
  PARTITION_CALL: 3,
  PIVOT: 6,
  I_INIT: 7,
  J_LOOP: 8,
  COMPARE: 11,
  SWAP: 12,
  FINAL_SWAP: 16,
  RETURN: 17,
  SORT_LEFT: 4,
  SORT_RIGHT: 5,
};

export function* quickSortGenerator(
  values: number[]
): Generator<Step, number[], undefined> {
  const nextValues = [...values];

  if (nextValues.length === 0) {
    return nextValues;
  }

  function* quickSortRange(low: number, high: number): Generator<Step, void, undefined> {
    yield {
      type: 'visit',
      nodeId: low.toString(),
      line: QUICK_SORT_LINE_NUMBERS.BASE_CASE,
      description:
        low >= high
          ? `Range [${low}, ${high}] has one element, skip`
          : `Partition range [${low}, ${high}]`,
      valuesSnapshot: [...nextValues],
      activeIndices: buildRange(low, high),
      sortedIndices: [],
      pivotIndex: high,
      partitionStart: low,
      partitionEnd: high,
      debugVariables: { values: nextValues, low, high },
    };

    if (low >= high) {
      return;
    }

    yield {
      type: 'visit',
      nodeId: high.toString(),
      line: QUICK_SORT_LINE_NUMBERS.PARTITION_CALL,
      description: `Partition [${low}, ${high}] with pivot ${nextValues[high]}`,
      valuesSnapshot: [...nextValues],
      activeIndices: buildRange(low, high),
      sortedIndices: [],
      pivotIndex: high,
      partitionStart: low,
      partitionEnd: high,
      debugVariables: { values: nextValues, low, high, pivot: nextValues[high] },
    };

    const pivotIndex = yield* partitionRange(low, high);

    yield {
      type: 'found',
      nodeId: pivotIndex.toString(),
      line: QUICK_SORT_LINE_NUMBERS.RETURN,
      description: `Pivot ${nextValues[pivotIndex]} is in final position at index ${pivotIndex}`,
      valuesSnapshot: [...nextValues],
      activeIndices: [pivotIndex],
      sortedIndices: [pivotIndex],
      pivotIndex: pivotIndex,
      partitionStart: null,
      partitionEnd: null,
      debugVariables: { values: nextValues, low, high, pivotIndex },
    };

    yield {
      type: 'visit',
      nodeId: low.toString(),
      line: QUICK_SORT_LINE_NUMBERS.SORT_LEFT,
      description: `Recursively sort left subarray [${low}, ${pivotIndex - 1}]`,
      valuesSnapshot: [...nextValues],
      activeIndices: pivotIndex - 1 >= low ? buildRange(low, pivotIndex - 1) : [],
      sortedIndices: [pivotIndex],
      pivotIndex: null,
      partitionStart: low,
      partitionEnd: pivotIndex - 1,
      debugVariables: { values: nextValues, low, high, pivotIndex },
    };
    yield* quickSortRange(low, pivotIndex - 1);

    yield {
      type: 'visit',
      nodeId: (pivotIndex + 1).toString(),
      line: QUICK_SORT_LINE_NUMBERS.SORT_RIGHT,
      description: `Recursively sort right subarray [${pivotIndex + 1}, ${high}]`,
      valuesSnapshot: [...nextValues],
      activeIndices: pivotIndex + 1 <= high ? buildRange(pivotIndex + 1, high) : [],
      sortedIndices: [pivotIndex],
      pivotIndex: null,
      partitionStart: pivotIndex + 1,
      partitionEnd: high,
      debugVariables: { values: nextValues, low, high, pivotIndex },
    };
    yield* quickSortRange(pivotIndex + 1, high);
  }

  function* partitionRange(
    low: number,
    high: number
  ): Generator<Step, number, undefined> {
    const pivot = nextValues[high];

    yield {
      type: 'visit',
      nodeId: high.toString(),
      line: QUICK_SORT_LINE_NUMBERS.PIVOT,
      description: `Pivot selected: ${pivot} at index ${high}`,
      valuesSnapshot: [...nextValues],
      activeIndices: [high],
      sortedIndices: [],
      pivotIndex: high,
      partitionStart: low,
      partitionEnd: high,
      debugVariables: { values: nextValues, low, high, pivot },
    };

    let i = low - 1;

    for (let j = low; j < high; j++) {
      yield {
        type: 'compare',
        nodeId: j.toString(),
        line: QUICK_SORT_LINE_NUMBERS.COMPARE,
        description: `Compare ${nextValues[j]} ≤ ${pivot}?`,
        valuesSnapshot: [...nextValues],
        activeIndices: [j, high],
        sortedIndices: [],
        pivotIndex: high,
        partitionStart: low,
        partitionEnd: high,
        debugVariables: { values: nextValues, low, high, pivot, i, j },
      };

      if (nextValues[j] <= pivot) {
        i += 1;

        if (i !== j) {
          yield {
            type: 'move',
            nodeId: i.toString(),
            line: QUICK_SORT_LINE_NUMBERS.SWAP,
            description: `Swap ${nextValues[i]} and ${nextValues[j]}`,
            valuesSnapshot: [...nextValues],
            activeIndices: [i, j],
            sortedIndices: [],
            pivotIndex: high,
            partitionStart: low,
            partitionEnd: high,
            debugVariables: { values: nextValues, low, high, pivot, i, j },
          };

          [nextValues[i], nextValues[j]] = [nextValues[j], nextValues[i]];
        }
      }
    }

    yield {
      type: 'move',
      nodeId: (i + 1).toString(),
      line: QUICK_SORT_LINE_NUMBERS.FINAL_SWAP,
      description: `Place pivot: swap ${nextValues[i + 1]} and ${nextValues[high]}`,
      valuesSnapshot: [...nextValues],
      activeIndices: [i + 1, high],
      sortedIndices: [],
      pivotIndex: high,
      partitionStart: low,
      partitionEnd: high,
      debugVariables: { values: nextValues, low, high, pivot, i },
    };

    [nextValues[i + 1], nextValues[high]] = [nextValues[high], nextValues[i + 1]];

    const newPivotIndex = i + 1;

    yield {
      type: 'move',
      nodeId: newPivotIndex.toString(),
      line: QUICK_SORT_LINE_NUMBERS.RETURN,
      description: `Pivot ${nextValues[newPivotIndex]} placed at index ${newPivotIndex}`,
      valuesSnapshot: [...nextValues],
      activeIndices: [newPivotIndex],
      sortedIndices: [newPivotIndex],
      pivotIndex: newPivotIndex,
      partitionStart: low,
      partitionEnd: high,
      debugVariables: { values: nextValues, low, high, pivotIndex: newPivotIndex },
    };

    return newPivotIndex;
  }

  yield* quickSortRange(0, nextValues.length - 1);

  yield {
    type: 'found',
    nodeId: null,
    line: QUICK_SORT_LINE_NUMBERS.BASE_CASE,
    description: 'Quick sort complete',
    valuesSnapshot: [...nextValues],
    activeIndices: [],
    sortedIndices: nextValues.map((_, index) => index),
    pivotIndex: null,
    partitionStart: null,
    partitionEnd: null,
    debugVariables: { values: nextValues },
  };

  return nextValues;
}

function buildRange(start: number, end: number): number[] {
  if (end < start) {
    return [];
  }
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/algorithms/quick-sort/generators.ts
git commit -m "$(cat <<'EOF'
feat(quick-sort): add Lomuto partition generator

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Create QuickSortVisualization component

**Files:**
- Create: `src/components/QuickSortVisualization/QuickSortVisualization.tsx`

- [ ] **Step 1: Write the file** (modeled after MergeSortVisualization)

```tsx
import { CSSProperties } from 'react';
import { QuickSortData } from '../../types';

interface QuickSortVisualizationProps {
  data: QuickSortData;
}

const containerStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '20px',
};

const emptyStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '300px',
  color: '#888',
  fontSize: '16px',
};

export default function QuickSortVisualization({ data }: QuickSortVisualizationProps) {
  if (data.values.length === 0) {
    return (
      <div style={emptyStyle}>
        <p>Load an array to watch quick sort partition and sort it</p>
      </div>
    );
  }

  const rangeLabel =
    data.partitionStart !== null && data.partitionEnd !== null
      ? `[${data.partitionStart}, ${data.partitionEnd}]`
      : 'Not started';

  return (
    <div style={containerStyle}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#334155',
          fontSize: '15px',
          fontWeight: 600,
        }}
      >
        <span>Quick Sort (Lomuto)</span>
        <span>Partition: {rangeLabel}</span>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {data.values.map((value, index) => {
          const isActive = data.activeIndices.includes(index);
          const isSorted = data.sortedIndices.includes(index);
          const isPivot = data.pivotIndex === index;

          let borderColor = '#cbd5e1';
          let backgroundColor = '#ffffff';

          if (isSorted) {
            borderColor = '#16a34a';
            backgroundColor = '#dcfce7';
          } else if (isPivot) {
            borderColor = '#ea580c';
            backgroundColor = '#fff7ed';
          } else if (isActive) {
            borderColor = '#2563eb';
            backgroundColor = '#dbeafe';
          }

          return (
            <div
              key={`${value}-${index}`}
              style={{
                width: '72px',
                borderRadius: '14px',
                border: `3px solid ${borderColor}`,
                background: backgroundColor,
                color: '#0f172a',
                height: '72px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 20px rgba(15, 23, 42, 0.08)',
              }}
            >
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                {index}
              </div>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{value}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '16px', color: '#475569', fontSize: '13px' }}>
        <span>Blue: currently compared</span>
        <span>Orange: pivot</span>
        <span>Green: in final sorted position</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/QuickSortVisualization/QuickSortVisualization.tsx
git commit -m "$(cat <<'EOF'
feat(quick-sort): add QuickSortVisualization component

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Wire up quick sort in App.tsx

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Import QuickSortVisualization and QUICK_SORT_CODE** (add after MergeSortVisualization import, line ~15, and after MERGE_SORT_CODE import, line ~51)

```tsx
import QuickSortVisualization from './components/QuickSortVisualization/QuickSortVisualization';
```

```tsx
import { QUICK_SORT_CODE } from './algorithms/quick-sort/code-strings';
```

- [ ] **Step 2: Add quickSortData to useExecutionContext destructuring** (after mergeSortData, line ~143)

```tsx
quickSortData,
```

- [ ] **Step 3: Add quick sort to currentCode switch** (after merge-sort case, line ~286)

```tsx
if (activeStructure === 'quick-sort') {
  return QUICK_SORT_CODE;
}
```

- [ ] **Step 4: Add quick sort to nav buttons** (after merge sort button, line ~407)

```tsx
{ id: 'quick-sort' as const, label: 'Quick Sort' },
```

- [ ] **Step 5: Add quick sort to section title** (after merge-sort, line ~480)

```tsx
: activeStructure === 'quick-sort'
  ? 'Quick Sort Visualization'
```

- [ ] **Step 6: Add QuickSortVisualization to rendering** (after merge-sort, line ~536)

```tsx
) : activeStructure === 'quick-sort' ? (
  <QuickSortVisualization data={quickSortData} />
```

- [ ] **Step 7: Add quick sort to buildVariableValues** (after merge-sort block, line ~802)

```ts
if (structure === 'quick-sort') {
  assignVariables(variables, {
    values: step?.valuesSnapshot ?? data.quickSortData.values,
    low: step?.partitionStart,
    high: step?.partitionEnd,
    pivot: step?.pivotIndex !== null ? (step?.valuesSnapshot ?? data.quickSortData.values)[step.pivotIndex] : null,
    pivotIndex: step?.pivotIndex,
    i: step?.debugVariables?.i,
    j: step?.debugVariables?.j,
    nextValues: step?.valuesSnapshot ?? data.quickSortData.values,
  });

  assignDebugVariable(variables, 'low', step?.partitionStart, 'not set yet');
  assignDebugVariable(variables, 'high', step?.partitionEnd, 'not set yet');
  assignDebugVariable(variables, 'pivot', step?.pivotIndex !== null ? (step?.valuesSnapshot ?? data.quickSortData.values)[step.pivotIndex] : null, 'not set yet');
  assignDebugVariable(variables, 'i', step?.debugVariables?.i, 'not set yet');
  assignDebugVariable(variables, 'j', step?.debugVariables?.j, 'not set yet');
}
```

- [ ] **Step 8: Add quickSortData to buildVariableValues data parameter** (after mergeSortData, line ~618)

```ts
quickSortData: AppContentData['quickSortData'],
```

- [ ] **Step 9: Add to buildVariableValues dependency array** (after mergeSortData, line ~363)

```ts
quickSortData,
```

- [ ] **Step 10: Commit**

```bash
git add src/App.tsx
git commit -m "$(cat <<'EOF'
feat(app): wire up quick sort visualization

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Spec Coverage Check

- QuickSortData interface ✓ (Task 1)
- StructureKind 'quick-sort' ✓ (Task 1)
- ExecutionContext quickSortData state ✓ (Task 2)
- code-strings.ts with QUICK_SORT_CODE ✓ (Task 3)
- generators.ts with Lomuto partition ✓ (Task 4)
- QuickSortVisualization component ✓ (Task 5)
- App.tsx wiring (nav button, code panel, visualization, variable display) ✓ (Task 6)
- Color scheme (blue=active, orange=pivot, green=sorted) ✓ (Tasks 4, 5)
- Partition range display ✓ (Tasks 4, 5)

## Placeholder Scan

All steps have complete code — no TBD, TODO, or "fill in later" patterns found.

## Type Consistency

- `QuickSortData` fields used consistently across generator, visualization, and App.tsx buildVariableValues
- `partitionStart`/`partitionEnd` used instead of `mergeStart`/`mergeEnd` (distinct from merge sort)
- `pivotIndex` tracked separately from `activeIndices`