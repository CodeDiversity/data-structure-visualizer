# Visual Polish Overhaul — Design Spec

**Date:** 2026-06-08
**Status:** Approved

---

## Overview

Add visual polish improvements to the Data Structure Visualizer: theme toggle, color-coded operation phases, spring-based animations, and keyboard navigation.

---

## 1. Theme System

### Light Theme Colors

| Variable | Value | Usage |
|----------|-------|-------|
| `--bg-primary` | `#f5f5f5` | App background |
| `--bg-panel` | `#ffffff` | Cards, panels |
| `--bg-code` | `#f8fafc` | Code panel background |
| `--accent` | `#6366f1` | Buttons, active states |
| `--accent-hover` | `#4f46e5` | Button hover |
| `--text-primary` | `#111` | Primary text |
| `--text-secondary` | `#64748b` | Labels, descriptions |
| `--border` | `#e5e7eb` | Borders, dividers |
| `--highlight-pink` | `#db2777` | Current focus ring |

### Dark Theme (existing)

| Variable | Value |
|----------|-------|
| `--bg-primary` | `#1a1a2e` |
| `--bg-panel` | `#16213e` |
| `--bg-code` | `#0f3460` |
| `--accent` | `#e94560` |
| `--text-primary` | `#eee` |
| `--text-secondary` | `#aaa` |

### Toggle Implementation

- Button in header, right side — icon switches between sun/moon
- `data-theme="light"|"dark"` attribute on `<html>` element
- CSS variables on `:root` scoped by theme attribute
- Preference persisted to `localStorage` under key `dsv-theme`

---

## 2. Color-Coded Operation Phases

Each `Step` type gets optional `phase` field:
```typescript
type OperationPhase = 'comparing' | 'swapping' | 'completing' | 'current';
```

| Phase | Color | Hex | Usage |
|-------|-------|-----|-------|
| `comparing` | Yellow | `#f59e0b` | Elements being compared in sort/search |
| `swapping` | Orange | `#ea580c` | Elements exchanging positions |
| `completing` | Green | `#16a34a` | Operation or phase finishing |
| `current` | Pink | `#db2777` | Element currently executing |

**Implementation:** Visualization components read `step.phase` and apply CSS class `.phase-comparing`, `.phase-swapping`, etc. Transitions apply the color change with 200ms ease.

---

## 3. Spring-Based Animations

**Easing:** `cubic-bezier(0.34, 1.56, 0.64, 1)` — spring-like with slight overshoot.

**CSS Variable:**
```css
:root {
  --animation-duration: 300ms;
  --animation-easing: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

**Targets:**
- Array element swaps — `transform: translateX()` slide
- Tree node insertions — `transform: scale()` from 0 to 1
- Linked list node additions — `opacity` fade + `transform: translateY()`
- Graph node highlights — `box-shadow` pulse ring animation
- Stack/queue push/pop — `transform: translateY()` drop in/out

**Implementation:** Add CSS transitions to element containers. Use `transform` and `opacity` only for GPU acceleration.

---

## 4. Keyboard Navigation

### Key Bindings

| Key | Action |
|-----|--------|
| `Space` | Play/pause toggle |
| `ArrowRight` | Step forward |
| `ArrowLeft` | Step backward |
| `R` | Reset |

### Focus Indicators

```css
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

All buttons, inputs, and interactive elements receive visible focus rings.

### Implementation

- `useEffect` hook in App.tsx registers keydown listener on `document`
- Dispatches to same handlers as play/step/reset buttons
- Prevent default for handled keys to avoid page scroll

---

## Out of Scope

- Animation speed slider
- Multiple accent color themes beyond dark/light
- Touch gesture support

---

## Files to Modify

- `src/index.css` — add CSS variables for both themes
- `src/App.tsx` — add theme toggle button + keyboard listener
- `src/types/index.ts` — add `OperationPhase` type + `phase` field to `Step`
- `src/components/*` — add phase-based CSS classes to visualization elements
- `src/state/ExecutionContext.tsx` — expose theme state + toggle function