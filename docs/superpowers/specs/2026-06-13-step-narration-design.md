# Step Narration Panel — Design Spec

**Date:** 2026-06-13
**Status:** Approved

---

## Overview

Move the per-step algorithm explanation from a floating badge over the visualization into a dedicated "narration" panel rendered as a footer under the code panel. Every algorithm generator already yields a plain-language `description` on each step; this change makes that description a first-class UI element paired with the code it describes, so learners can read the algorithm as prose while it runs.

---

## 1. Background

### What exists today

- `Step.description?: string` is already defined on the `Step` interface (`src/types/index.ts:177`).
- All algorithm generators under `src/algorithms/**` already yield a `description` on every step (e.g., `description: \`Visiting node with value ${root.value}\``).
- `App.tsx:559–578` renders the description as a small floating badge in the top-right corner of the visualization panel, prefixed with `"Current: "`.

### Problem with current placement

- The badge floats over the visualization, occluding tree nodes, array cells, and graph edges.
- It is small, easy to miss, and not contextually associated with the code it explains.
- The "Current: " prefix reads as developer-facing rather than learner-facing.

### Goal

A narration panel directly under the code panel that:

1. Shows the current step's description as natural prose.
2. Is visually anchored to the code panel (same width, same panel surface).
3. Is large enough to read comfortably and never occludes the visualization.
4. Adapts to the existing dark/light theme system.

---

## 2. Architecture

### New component: `Narration`

A self-contained, presentational component placed in the right column immediately below `<CodePanel />`.

**File:** `src/components/Narration/Narration.tsx`

**Props:** none (reads `currentStep` from `useExecutionContext`).

**Behavior:**

- If `currentStep` is `null` or `currentStep.description` is missing/empty → render nothing (no panel, no empty box).
- Otherwise render a single panel containing:
  - A small uppercase "Narration" label (matches the existing "Code" label style in the right column).
  - The current step's description as a single sentence of prose, rendered in `--text-primary` at the same font size as body text in the code panel.
  - A small 1-based step counter on the right (e.g., `Step 4 of 12`), shown only when both `currentStep` and the total number of steps can be derived from the engine state. The counter is optional and may be deferred if it adds coupling.

**Styling:**

- Panel background: `var(--bg-panel)` (matches `<CodePanel />` surface).
- Border, padding, and radius: match the surrounding panel rhythm.
- Color: `var(--text-primary)` for the description, `var(--text-secondary)` for the label.
- Theme-aware via existing CSS variables — no new theme tokens.

### Wiring

- `Narration` reads `currentStep` from `useExecutionContext` (same source the existing badge uses).
- The new component is mounted in `App.tsx` in the right column, inside the same wrapper that contains the "Code" heading and `<CodePanel />`, immediately after the `<CodePanel />` element.
- The existing floating badge (`App.tsx:559–578`) is removed.

### Data flow

```
Algorithm generator
  └─ yield { ..., description: "Visiting node with value 50" }
       └─ useExecutionEngine advances currentStep
            └─ Narration reads currentStep.description → renders prose
```

No changes to `Step`, `ExecutionContext`, `useExecutionEngine`, or any algorithm generator.

---

## 3. Authoring model

Each algorithm generator continues to yield a `description: string` on every step. The text is treated as authoritative prose — what the user reads to understand what is happening.

**Authoring conventions** (documented in code comments near the existing yields, not new infrastructure):

- One sentence per step.
- Plain language, present tense ("Visiting node with value 50", not "We are visiting...").
- Reference concrete values from the current step, not abstract variables.
- For compare/swap/return steps, name both operands (e.g., "Comparing 8 to 12").

This is the same convention already in use across all generators. No generator changes are required for this spec.

---

## 4. UI placement

Right column, directly below the existing code panel. The "Code" heading and `<CodePanel />` remain untouched; `<Narration />` is added as a sibling after the code panel block, separated by the same vertical gap the column already uses (`gap: '20px'` in the right column container).

The visualization panel is unchanged. The floating badge currently in the top-right of the visualization panel is removed.

---

## 5. Error handling

- `currentStep === null` → render nothing.
- `currentStep.description` is `undefined` or empty string → render nothing.
- Generators that forget to set a description on a particular step → the user sees no narration for that step rather than an empty or broken panel. This is acceptable; the prose is a best-effort signal, not a correctness requirement.
- No new error states, no fallbacks, no logging. The component is purely presentational.

---

## 6. Testing

Unit tests in `src/components/Narration/Narration.test.tsx` using Vitest + Testing Library, mirroring the style of any existing component tests.

Cases:

1. Renders nothing when `currentStep` is `null`.
2. Renders nothing when `currentStep.description` is `undefined`.
3. Renders the description when `currentStep.description` is a non-empty string.
4. Renders inside a panel with theme-aware CSS classes (assert presence of the class, not computed color, to avoid coupling to the theme system).

No integration tests, no e2e tests, no snapshot tests. Visual polish is covered manually.

---

## 7. Out of scope

- Rewriting existing generator descriptions to be more pedagogical or learner-friendly. The current descriptions are functional; polishing them is a follow-up.
- Complexity analysis, big-O annotations, or per-step cost summaries.
- Side-by-side algorithm comparison, history scrubbing, step replay, or bookmarks.
- Toggling narration on/off, font-size controls, or per-user preferences.
- Internationalization / localization of descriptions.
- AI-generated descriptions.
- Animations specific to the narration panel (e.g., typewriter reveal). It can fade in with the rest of the right column naturally.

---

## 8. Files to add / modify

**Add:**

- `src/components/Narration/Narration.tsx` — the new component.
- `src/components/Narration/Narration.test.tsx` — unit tests.
- `src/components/Narration/index.ts` — barrel export.

**Modify:**

- `src/App.tsx` — mount `<Narration />` below `<CodePanel />`; remove the floating badge (lines 559–578).

**No changes to:**

- `src/types/index.ts` — `description` field already exists.
- `src/algorithms/**` — generators already yield descriptions.
- `src/state/ExecutionContext.tsx` — no new state.
- `src/hooks/useExecutionEngine.ts` — no new engine behavior.
- `src/index.css` — no new theme tokens; existing variables are sufficient.
