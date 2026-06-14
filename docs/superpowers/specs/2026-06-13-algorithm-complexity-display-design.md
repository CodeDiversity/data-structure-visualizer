# Algorithm Complexity Display — Design Spec

**Date:** 2026-06-13
**Status:** Approved

---

## Overview

Add a small complexity line ("Time: O(n log n) | Space: O(n)") that appears under the "CODE" heading inside the right column. One complexity entry per `StructureKind` (18 entries), each showing the typical/average time and space Big-O. Pure UI refactor — no engine, generator, or state changes.

---

## Background

The Data Structure Visualizer currently shows the algorithm's source code, the highlighted current line, and per-step narration (added 2026-06-13). The user picks a structure and an operation; the engine streams steps. What the app doesn't surface is the *cost* of the operation: how does BST-insert compare to array-search in asymptotic terms? Adding a small, always-visible complexity line makes the educational point of the visualizer explicit without adding UI chrome.

This is intentionally a *display-only* feature. The data already exists in algorithm textbooks; we just want it visible while the user is watching the algorithm run.

---

## Architecture

Three new things, one changed file.

### 1. `src/algorithms/complexity.ts` (new)

A single `Record<StructureKind, ComplexityEntry>` covering all 18 entries. Each entry is `{ time: string; space: string }` with the Big-O string (e.g. `"O(n log n)"`).

```ts
import type { StructureKind } from '../types';

export interface ComplexityEntry {
  time: string;
  space: string;
}

export const COMPLEXITY: Record<StructureKind, ComplexityEntry> = {
  array:              { time: 'O(n)',       space: 'O(1)' },
  stack:              { time: 'O(1)',       space: 'O(n)' },
  queue:              { time: 'O(1)',       space: 'O(n)' },
  heap:               { time: 'O(log n)',   space: 'O(1)' },
  'hash-table':       { time: 'O(1)',       space: 'O(n)' },
  bst:                { time: 'O(log n)',   space: 'O(n)' },
  'linked-list':      { time: 'O(n)',       space: 'O(1)' },
  'doubly-linked-list': { time: 'O(n)',     space: 'O(1)' },
  graph:              { time: 'O(V + E)',   space: 'O(V)' },
  'two-pointer':      { time: 'O(n)',       space: 'O(1)' },
  'sliding-window':   { time: 'O(n)',       space: 'O(1)' },
  'binary-search':    { time: 'O(log n)',   space: 'O(1)' },
  'merge-sort':       { time: 'O(n log n)', space: 'O(n)' },
  'quick-sort':       { time: 'O(n log n)', space: 'O(log n)' },
  'prefix-sum':       { time: 'O(n)',       space: 'O(n)' },
  kadane:             { time: 'O(n)',       space: 'O(1)' },
  recursion:          { time: 'O(n)',       space: 'O(n)' },
};
```

**Why this file exists:** the complexity for a given `StructureKind` is a fact about the algorithm, not about any specific run. Keeping it in a single map makes it auditable and prevents drift across components. It also makes future reuse trivial (a tooltip, a search index, a printable cheat sheet — all read from the same source).

**TypeScript enforcement of completeness:** because the type is `Record<StructureKind, ComplexityEntry>` and `StructureKind` is a union, adding a 19th variant to the union will fail the build until the map is updated. This is the same completeness guarantee that the algorithm registry relies on.

### 2. `src/components/ComplexityDisplay/ComplexityDisplay.tsx` (new)

A pure presentational component. One prop, optional. No state, no effects, no context.

```ts
interface ComplexityEntry {
  time: string;
  space: string;
}

interface ComplexityDisplayProps {
  complexity?: ComplexityEntry;
}

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

Notes on the design:
- Returns `null` when `complexity` is `undefined`. Mirrors the `Narration` component's "render nothing when there's nothing to show" pattern. Avoids an empty strip with no information.
- Local `ComplexityEntry` interface (not imported from the constants file) keeps the component self-contained and lets the test pass a plain object literal.
- Uses `var(--text-secondary)` to match the existing secondary text style and respect the theme system.
- The 16px bottom margin matches the existing "Code" heading style and keeps total vertical spacing between "CODE" and the code panel consistent with what it was before the change.

### 3. `src/components/ComplexityDisplay/ComplexityDisplay.test.tsx` (new)

Four cases (matches the test pattern from `Narration.test.tsx`):
1. Renders nothing when `complexity` is `undefined` → container is empty
2. Renders the time field → finds text `"Time: O(n log n)"`
3. Renders the space field → finds text `"Space: O(n)"`
4. Renders both with the separator → finds both labels in the document

No mocks, no providers, no router — the component is fully pure.

### 4. `src/App.tsx` (changed)

Two edits:
- Add `import { COMPLEXITY } from './algorithms/complexity';` alongside the other algorithm imports.
- Add `import ComplexityDisplay from './components/ComplexityDisplay/ComplexityDisplay';` alongside the other component imports.
- Inside the right column, above the existing `<CodePanel />` JSX, add:
  ```tsx
  <ComplexityDisplay complexity={COMPLEXITY[currentStructure]} />
  ```

The lookup is `O(1)`. `currentStructure` is already in scope as the currently-selected `StructureKind` (verify by reading `src/App.tsx` — it drives the structure selector and is the canonical state). If the state variable has a different name (e.g. `structure`, `selectedStructure`), use that name instead.

---

## Authoring model

- **Granularity:** one entry per `StructureKind` (18 total). We deliberately do *not* split by operation, even though BST-insert and BST-search could in principle differ. The user approved this simplification for the first version.
- **Typical vs. worst case:** we show the typical/average case for each. BST shows `O(log n)` (not `O(n)` worst case), quick-sort shows `O(n log n)` (not `O(n²)` worst case). This is the case students learn first; future iterations could expose both via tooltip.
- **String format:** plain Big-O strings in monospace-feeling layout (`"O(log n)"`, `"O(V + E)"`, `"O(n log n)"`). The display is a label, not parsed code, so we use the conventions that match textbooks.

---

## UI placement

```
┌─────────────────────────────┐
│ CODE                        │  ← existing heading (no change)
│ Time: O(n log n)  |  Space: O(n)   ← NEW
│ ┌─────────────────────────┐ │
│ │ function mergeSort(arr) │ │
│ │   ...                   │ │
│ └─────────────────────────┘ │
│                             │
│ NARRATION                   │  ← existing
│ ...                         │
└─────────────────────────────┘
```

- Sits in the right column, inside the same wrapper that already holds the "Code" heading and `CodePanel`.
- 16px below, no extra margin above (sits directly under the "CODE" heading's 16px bottom margin). No border, no background — it's a label, not a panel.
- Theme-aware via `var(--text-secondary)`. Light/dark both get the dim secondary text.

---

## Error handling

- **Missing `StructureKind` key in `COMPLEXITY` map:** impossible by construction. TypeScript's `Record<StructureKind, ...>` fails the build if any union member is unaccounted for. If the build passes, the lookup always succeeds.
- **`complexity` prop is `undefined` at runtime:** `ComplexityDisplay` returns `null`. No crash, no empty box.
- **Theme/CSS variable missing:** falls back to inherited color. The variable is defined in `src/index.css` for both light and dark themes (see `2026-06-08-visual-polish-design.md`).

---

## Testing

- Component test (4 cases) — see Section 3 of the design walkthrough above.
- No engine/generator/state tests needed — nothing changed there.
- No `App.tsx` integration test — the change is one import + one JSX line; visual verification in the running app is sufficient.
- TypeScript build must pass (`npm run build`) — this is the primary correctness check for the constants map.

End-to-end manual check:
1. `npm run build` — must compile clean
2. `npm test` — all 4 ComplexityDisplay tests pass (plus the 4 existing Narration tests, total 8)
3. `npm run dev` — open the app
4. For each of the 18 structures, confirm the complexity line appears under the "Code" heading with the correct values from the table above
5. Toggle the theme — the line should follow `var(--text-secondary)` in both modes

---

## Out of scope

- Best/avg/worst case splits (e.g. "BST: O(log n) avg, O(n) worst")
- Per-operation complexity (e.g. BST-insert vs BST-search)
- Tooltips with longer explanations
- Complexity comparison view (side-by-side)
- Animation speed slider, step scrubber, or any other feature

---

## Files to add / modify

- **Add** `src/algorithms/complexity.ts` — the constants map
- **Add** `src/components/ComplexityDisplay/ComplexityDisplay.tsx` — the presentational component
- **Add** `src/components/ComplexityDisplay/ComplexityDisplay.test.tsx` — the 4 unit tests
- **Modify** `src/App.tsx` — one import, one import, one JSX line in the right column

No other files change.
