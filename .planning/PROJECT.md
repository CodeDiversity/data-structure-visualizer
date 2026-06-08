# Data Structure Visualizer

## What This Is

An interactive React application for learning data structures through visualization and step-by-step code execution. Users interact with data structures (starting with Binary Search Tree) and watch the algorithm execute line-by-line with code highlighting and variable state tracking.

## Core Value

**See algorithms think.** When you trigger an operation, the code panel highlights the current line while the visualization updates — so you understand not just *what* happens, but *why* and *how* it happens step by step.

## Requirements

### Active

- [ ] BST with insert, delete, search operations
- [ ] Step-by-step code execution with line highlighting
- [ ] Tree visualization that updates as operations execute
- [ ] Play/pause/step controls for algorithm execution
- [ ] Clear, readable code display (syntax highlighted)

### Out of Scope

- [ ] Multiple data structures in v1 — focus on BST first
- [ ] User accounts / persistence — single-session learning tool
- [ ] Custom algorithm input — pre-built operations only for v1

## Context

- **Self-learning audience** — clarity over cleverness, every step should be understandable
- **Starting simple** — BST is the anchor; proves the pattern before adding more structures
- **Visual-first** — the visualization and code highlighting are the primary learning tools, not text explanations

## Constraints

- **Tech stack**: React (user-specified) — no debate needed
- **Single-page app** — no routing complexity for v1
- **No backend** — all visualization logic runs client-side

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| BST first | Simple enough to be a complete v1, complex enough to demonstrate step-by-step value | — Pending |
| Line-by-line highlighting | Most intuitive for self-learning — matches how you'd trace through code by hand | — Pending |
| Client-side only | No server needed for visualization; simplifies deployment | — Pending |

---
*Last updated: 2026-06-07 after initial questioning*
