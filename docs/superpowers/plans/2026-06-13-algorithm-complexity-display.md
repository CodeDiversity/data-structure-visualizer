# Algorithm Complexity Display Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a small "Time: O(n log n) | Space: O(n)" line under the "Code" heading in the right column, with one entry per `StructureKind` (17 total).

**Architecture:** Pure UI refactor. One constants file (`src/algorithms/complexity.ts`) with a `Record<StructureKind, { time; space }>`, one presentational component (`src/components/ComplexityDisplay/ComplexityDisplay.tsx`) that takes the entry as a prop and returns `null` when missing, and a one-line wiring change in `App.tsx`. TypeScript's `Record<StructureKind, ...>` enforces completeness of the constants map at compile time.

**Tech Stack:** React 18 + TypeScript + Vite. Existing Vitest 3 + `@testing-library/react` + `jsdom` test infrastructure (added 2026-06-13 for the Narration test).

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `src/algorithms/complexity.ts` | Create | `Record<StructureKind, ComplexityEntry>` covering all 17 structures. The single source of truth. |
| `src/components/ComplexityDisplay/ComplexityDisplay.tsx` | Create | Pure presentational component. Takes `complexity?: ComplexityEntry`, renders `Time: O(...)  \|  Space: O(...)`, returns `null` when prop is `undefined`. |
| `src/components/ComplexityDisplay/ComplexityDisplay.test.tsx` | Create | 4 unit tests covering the render/nothing-render contract. |
| `src/App.tsx` | Modify | Add two imports, add one JSX line in the right column above `<CodePanel>`. |

No other files change. `CodePanel`, `ExecutionContext`, types, and all algorithm modules are untouched.

---

## Task 1: Create the constants file

**Files:**
- Create: `src/algorithms/complexity.ts`

- [ ] **Step 1: Create the file**

Write `src/algorithms/complexity.ts` with the exact contents below:

```ts
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
```

- [ ] **Step 2: Verify the build still passes (TypeScript exhaustiveness check)**

Run:
```bash
npm run build
```

Expected: build succeeds. If TypeScript reports a missing key (e.g. `Property 'X' is missing in type ... but required in type 'Record<StructureKind, ComplexityEntry>'`), double-check the keys above against `src/types/index.ts` lines 221–238 and add the missing entry. The `Record<StructureKind, ...>` type is the exhaustive check — this is the test for the constants file.

- [ ] **Step 3: Commit**

```bash
git add src/algorithms/complexity.ts
git commit -m "feat(complexity): add per-structure complexity constants"
```

---

## Task 2: Write failing tests for ComplexityDisplay

**Files:**
- Create: `src/components/ComplexityDisplay/ComplexityDisplay.test.tsx`

- [ ] **Step 1: Create the test file**

Write `src/components/ComplexityDisplay/ComplexityDisplay.test.tsx` with the exact contents below:

```tsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import ComplexityDisplay from './ComplexityDisplay';

describe('ComplexityDisplay', () => {
  it('renders nothing when complexity is undefined', () => {
    const { container } = render(<ComplexityDisplay />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the time field', () => {
    render(<ComplexityDisplay complexity={{ time: 'O(n log n)', space: 'O(n)' }} />);
    expect(screen.getByText(/Time: O\(n log n\)/)).toBeInTheDocument();
  });

  it('renders the space field', () => {
    render(<ComplexityDisplay complexity={{ time: 'O(n)', space: 'O(n)' }} />);
    expect(screen.getByText(/Space: O\(n\)/)).toBeInTheDocument();
  });

  it('renders both fields with the separator', () => {
    render(<ComplexityDisplay complexity={{ time: 'O(log n)', space: 'O(1)' }} />);
    expect(screen.getByText('Time: O(log n)  |  Space: O(1)')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
npm test -- ComplexityDisplay
```

Expected: FAIL with an import/module-not-found error (`Cannot find module './ComplexityDisplay'`). This is the expected red — the component file doesn't exist yet.

- [ ] **Step 3: Commit the failing test**

```bash
git add src/components/ComplexityDisplay/ComplexityDisplay.test.tsx
git commit -m "test(complexity): add failing tests for ComplexityDisplay"
```

---

## Task 3: Implement ComplexityDisplay to make the tests pass

**Files:**
- Create: `src/components/ComplexityDisplay/ComplexityDisplay.tsx`

- [ ] **Step 1: Create the component**

Write `src/components/ComplexityDisplay/ComplexityDisplay.tsx` with the exact contents below:

```tsx
export interface ComplexityEntry {
  time: string;
  space: string;
}

interface ComplexityDisplayProps {
  complexity?: ComplexityEntry;
}

/**
 * Small label that renders an algorithm's time and space complexity.
 * Returns null when `complexity` is undefined so it never leaves an
 * empty strip in the layout.
 */
export default function ComplexityDisplay({ complexity }: ComplexityDisplayProps) {
  if (!complexity) {
    return null;
  }

  return (
    <div
      style={{
        color: 'var(--text-secondary)',
        fontSize: '14px',
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        margin: '0 0 16px 0',
      }}
    >
      Time: {complexity.time}  |  Space: {complexity.space}
    </div>
  );
}
```

- [ ] **Step 2: Run the tests to verify they pass**

Run:
```bash
npm test -- ComplexityDisplay
```

Expected: PASS — all 4 tests pass.

- [ ] **Step 3: Run the full test suite to confirm no regressions**

Run:
```bash
npm test
```

Expected: PASS — 8 tests total (4 Narration + 4 ComplexityDisplay).

- [ ] **Step 4: Commit**

```bash
git add src/components/ComplexityDisplay/ComplexityDisplay.tsx
git commit -m "feat(complexity): add ComplexityDisplay component"
```

---

## Task 4: Wire ComplexityDisplay into App.tsx

**Files:**
- Modify: `src/App.tsx:23` (add component import after Narration import)
- Modify: `src/App.tsx:24` (add constants import after OperationInput import)
- Modify: `src/App.tsx:622-629` (add `<ComplexityDisplay>` between the "Code" heading and `<CodePanel>`)

- [ ] **Step 1: Add the component import**

In `src/App.tsx`, immediately after the existing line 23 (`import Narration from './components/Narration/Narration';`), add:

```ts
import ComplexityDisplay from './components/ComplexityDisplay/ComplexityDisplay';
```

- [ ] **Step 2: Add the constants import**

In `src/App.tsx`, immediately after the existing line 24 (`import OperationInput from './components/Input/OperationInput';`), add a new line:

```ts
import { COMPLEXITY } from './algorithms/complexity';
```

- [ ] **Step 3: Mount the component in the right column**

In `src/App.tsx`, locate the code panel block. It currently reads (lines 622–629):

```tsx
            >
              Code
            </h2>
            <CodePanel
              code={currentCode}
              currentLine={currentLine}
              language="javascript"
              variableValues={currentVariableValues}
            />
          </div>
```

Insert a new line **between** the `</h2>` and `<CodePanel ... />`:

```tsx
            <ComplexityDisplay complexity={COMPLEXITY[activeStructure]} />
```

The result should be:

```tsx
            >
              Code
            </h2>
            <ComplexityDisplay complexity={COMPLEXITY[activeStructure]} />
            <CodePanel
              code={currentCode}
              currentLine={currentLine}
              language="javascript"
              variableValues={currentVariableValues}
            />
          </div>
```

`activeStructure` is the existing `StructureKind` state variable defined on line 158 of `src/App.tsx`. Do not rename it or add a new state variable.

- [ ] **Step 4: Verify the build still passes**

Run:
```bash
npm run build
```

Expected: build succeeds. If TypeScript reports an error, the most likely cause is the new import path being wrong (should resolve to `./algorithms/complexity`, relative to `src/App.tsx`).

- [ ] **Step 5: Run the full test suite**

Run:
```bash
npm test
```

Expected: PASS — 8 tests total.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx
git commit -m "feat(app): show complexity line above code panel"
```

---

## Task 5: Manual end-to-end verification

**Files:** none

- [ ] **Step 1: Start the dev server**

Run:
```bash
npm run dev
```

Expected: Vite starts on `http://localhost:5173` (or similar). Leave the server running.

- [ ] **Step 2: Verify the complexity line renders**

Open the app in a browser. The default structure is `bst` (line 158 of `src/App.tsx`). Confirm:
- A line reading `Time: O(log n)  |  Space: O(n)` appears directly under the "CODE" heading
- The line uses the dim secondary text color (matches the "CODE" heading)
- The spacing between "CODE" and the code panel is the same as before (the complexity line replaces the empty space, total visual gap unchanged)

- [ ] **Step 3: Verify each structure**

Click through the structure selector for all 17 structures. For each one, confirm the complexity line matches the table in `src/algorithms/complexity.ts`:
- `array` → `Time: O(n)  |  Space: O(1)`
- `stack` → `Time: O(1)  |  Space: O(n)`
- `queue` → `Time: O(1)  |  Space: O(n)`
- `heap` → `Time: O(log n)  |  Space: O(1)`
- `hash-table` → `Time: O(1)  |  Space: O(n)`
- `bst` → `Time: O(log n)  |  Space: O(n)`
- `linked-list` → `Time: O(n)  |  Space: O(1)`
- `doubly-linked-list` → `Time: O(n)  |  Space: O(1)`
- `graph` → `Time: O(V + E)  |  Space: O(V)`
- `two-pointer` → `Time: O(n)  |  Space: O(1)`
- `sliding-window` → `Time: O(n)  |  Space: O(1)`
- `binary-search` → `Time: O(log n)  |  Space: O(1)`
- `merge-sort` → `Time: O(n log n)  |  Space: O(n)`
- `quick-sort` → `Time: O(n log n)  |  Space: O(log n)`
- `prefix-sum` → `Time: O(n)  |  Space: O(n)`
- `kadane` → `Time: O(n)  |  Space: O(1)`
- `recursion` → `Time: O(n)  |  Space: O(n)`

- [ ] **Step 4: Verify theme switching**

Toggle the theme (sun/moon button in the header). Confirm:
- The complexity line's text color switches between dim-grey-on-light and dim-grey-on-dark
- No layout shift between themes

- [ ] **Step 5: Stop the dev server**

Press `Ctrl+C` in the terminal where the dev server is running.

- [ ] **Step 6: No code changes — no commit needed**

If verification revealed a problem, fix it in a follow-up commit. If everything passed, the implementation is done.

---

## Self-Review

**Spec coverage:**
- Constants file with all 17 entries → Task 1 ✓
- Presentational component with optional prop and null return → Task 3 ✓
- 4 unit tests covering render/nothing-render contract → Task 2 ✓
- App.tsx wiring (imports + JSX) → Task 4 ✓
- Manual end-to-end verification for all 17 structures and both themes → Task 5 ✓
- TypeScript exhaustiveness check for the constants map → Task 1 Step 2 ✓

**Placeholder scan:** no TBDs, TODOs, or "similar to" references. Every step has the actual code or command an engineer needs.

**Type consistency:**
- `ComplexityEntry` is defined in both `src/algorithms/complexity.ts` (exported) and `src/components/ComplexityDisplay/ComplexityDisplay.tsx` (local interface). The component intentionally uses a local interface to stay decoupled from the constants file. The shape `{ time: string; space: string }` is identical in both places.
- The prop name `complexity` and the `Record<StructureKind, ComplexityEntry>` type are used consistently across Task 1 (definition), Task 3 (consumption), and Task 4 (App.tsx wiring).
- `activeStructure` matches the actual state variable name in `src/App.tsx:158`.
