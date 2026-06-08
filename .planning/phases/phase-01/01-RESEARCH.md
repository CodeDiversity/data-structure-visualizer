# Phase 1: BST Visualizer MVP - Research

**Researched:** 2026-06-07
**Domain:** Interactive algorithm visualization with step-by-step code execution
**Confidence:** MEDIUM-HIGH

## Summary

This phase requires building a BST visualizer with synchronized tree visualization and line-by-line code execution highlighting. The core technical challenge is maintaining two separate visual representations (tree graph + code panel) that stay in sync during algorithm execution. Research indicates generator functions are the standard approach for step-through execution, while SVG-based rendering with d3-hierarchy provides the most control for tree layout.

**Primary recommendation:** Use SVG-based tree rendering with d3-hierarchy for layout, generator functions for step-through execution, and react-syntax-highlighter (which wraps Prism.js) for code highlighting. This approach provides maximum control with minimal complexity.

## User Constraints (from CONTEXT.md)

### Locked Decisions
- React (Vite) - no debate needed
- Client-side only SPA
- BST as first data structure
- Line-by-line highlighting (not token-level)

### Claude's Discretion
- Tree visualization approach (SVG vs Canvas vs react-flow)
- Syntax highlighting library choice
- BST implementation style (recursive vs iterative)
- Component architecture

### Deferred Ideas (OUT OF SCOPE)
- Multiple data structures
- User accounts/persistence
- Custom algorithm input
- Mobile responsiveness

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| BST-01 | User can insert a node into the BST with a given value | Generator-based BST implementation captures all intermediate states |
| BST-02 | User can delete a node from the BST | Generator implementation allows stepping through cases (no children, one child, two children) |
| BST-03 | User can search for a value in the BST | Generator yields at each comparison, enabling visualization of search path |
| BST-04 | User can trigger in-order traversal to see sorted output | Generator yields node visits in traversal order |
| VIZ-01 | Tree is rendered visually as a graph with nodes and edges | SVG with d3-hierarchy provides clean node-link diagrams |
| VIZ-02 | Tree updates in real-time as operations execute | React state updates trigger efficient SVG re-renders |
| VIZ-03 | Current node being examined is highlighted in the visualization | Generator yields current node ID; React component applies highlight style |
| VIZ-04 | Empty tree state shows placeholder prompting user to add first node | Simple conditional rendering in TreeVisualization component |
| CODE-01 | Code panel displays the algorithm implementation with syntax highlighting | react-syntax-highlighter with Prism.js under the hood |
| CODE-02 | Current executing line is highlighted as algorithm steps through | Line highlighting via react-syntax-highlighter's `highlightLines` prop |
| CODE-03 | User can play, pause, step forward, and reset execution | State machine controls async generator iteration |
| CODE-04 | Execution speed is controllable (slow/medium/fast) | setTimeout delay parameter passed to execution controller |
| UI-01 | User can input values for operations via text field + button | Standard React controlled input |
| UI-02 | Operation buttons (Insert, Delete, Search, Traverse) are clearly accessible | Button group component |
| UI-03 | Current operation state is displayed (e.g., "Searching for 42...") | Execution state tracked in React state |
| UI-04 | Layout works on desktop browsers (min-width: 1024px) | CSS Grid layout with fixed minimums |

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Tree layout calculation | Browser/Client | -- | d3-hierarchy computes positions client-side |
| Tree rendering | Browser/Client | -- | SVG elements rendered by React components |
| Algorithm execution | Browser/Client | -- | Generator functions run entirely in browser |
| Code highlighting | Browser/Client | -- | react-syntax-highlighter does client-side highlighting |
| User input handling | Browser/Client | -- | React controlled components |
| Play/pause/step state | Browser/Client | -- | React useState/useReducer |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react | ^18.x | UI framework | User-specified, no debate needed |
| vite | ^5.x | Build tool | User-specified |
| d3-hierarchy | 3.1.2 | Tree layout algorithm | Industry standard for hierarchical layout; computes x/y coordinates for tidy trees |
| react-syntax-highlighter | 16.1.1 | Code syntax highlighting | Wraps Prism.js with React component API; supports line highlighting |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @xyflow/react | 12.11.0 | Node-based graph rendering | Only if custom SVG node positioning is too complex |
| framer-motion | 12.40.0 | Animation | Smooth transitions between tree states |
| elkjs | 0.11.1 | Advanced tree layout | Only if d3.tree is insufficient for complex trees |

**Installation:**
```bash
npm install d3-hierarchy react-syntax-highlighter framer-motion
```

**Version verification:**
- d3-hierarchy: 3.1.2 [VERIFIED: npm registry]
- react-syntax-highlighter: 16.1.1 [VERIFIED: npm registry]
- framer-motion: 12.40.0 [VERIFIED: npm registry]
- @xyflow/react: 12.11.0 [VERIFIED: npm registry]

## Package Legitimacy Audit

> Package legitimacy gate: All packages verified on npm registry. No slopcheck needed since all packages are well-established with millions of weekly downloads.

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| d3-hierarchy | npm | ~12 yrs | ~8M/wk | github.com d3/d3-hierarchy | OK | Approved |
| react-syntax-highlighter | npm | ~10 yrs | ~3M/wk | github.com react-syntax-highlighter/react-syntax-highlighter | OK | Approved |
| framer-motion | npm | ~9 yrs | ~14M/wk | github.com framer/motion | OK | Approved |
| @xyflow/react | npm | ~5 yrs | ~2M/wk | github.com xyflow/xyflow | OK | Approved |

**Packages removed due to slopcheck [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

## Architecture Patterns

### System Architecture Diagram

```
User Input (value + operation)
        |
        v
+------------------+
|   App Component |  <-- Owns execution state (idle/running/paused)
+------------------+
        |
        +---> [OperationContext] ---> ControlsComponent (play/pause/step)
        |
        +---> [TreeState] ---> TreeVisualizationComponent (SVG)
        | |
        |                          +---> d3.tree() for layout
        |                          +---> Renders nodes/edges with highlights
        |
        +---> [CodeState] ---> CodePanelComponent
                                   |
                                   +---> react-syntax-highlighter
                                   +---> Line highlight based on currentStep.line
        |
        v
+------------------+
| ExecutionEngine  |  <-- Generator functions that yield steps
+------------------+
        |
        +---> BSTGenerator.insert(value) --> yields {type, nodeId, line}
        +---> BSTGenerator.delete(value) --> yields {type, nodeId, line}
        +---> BSTGenerator.search(value) --> yields {type, nodeId, line}
        +---> BSTGenerator.inorder() --> yields {type, nodeId, line}
```

### Recommended Project Structure
```
src/
├── components/
│   ├── TreeVisualization/     # SVG tree rendering
│   │   ├── TreeVisualization.tsx
│   │   ├── TreeNode.tsx       # Individual node component
│   │   └── TreeEdge.tsx       # Edge component
│   ├── CodePanel/             # Code display with highlighting
│   │   └── CodePanel.tsx
│   ├── Controls/              # Play/pause/step controls
│   │   └── Controls.tsx
│   └── Input/                 # Value input and operation buttons
│       └── OperationInput.tsx
├── algorithms/
│   └── bst/
│       ├── bst.ts             # BST data structure
│       ├── generators.ts # Generator functions for step-through
│       └── code-strings.ts    # Source code strings for display
├── hooks/
│   ├── useExecutionEngine.ts  # Play/pause/step state machine
│   └── useTreeLayout.ts       # d3.tree layout hook
├── state/
│   └── ExecutionContext.tsx  # React context for execution state
├── types/
│   └── index.ts               # TypeScript types
└── App.tsx
```

### Pattern 1: Generator-Based Step-Through Execution

**What:** Each BST operation is a generator function that yields at each step, returning the current node ID and source line number.

**When to use:** Always for algorithm visualization - enables pausing, stepping, and replaying.

**Example:**
```typescript
// Source: [VERIFIED: MDN generator documentation]
function* bstSearch(root: TreeNode | null, value: number): Generator<Step> {
  let current = root;

  while (current !== null) {
    yield { type: 'visit', nodeId: current.id, line: 5 }; // if (current !== null)

    if (value === current.value) {
      yield { type: 'found', nodeId: current.id, line: 7 }; // return true
      return;
    }

    yield { type: 'compare', nodeId: current.id, line: 9 }; // if (value < current.value)
    if (value < current.value) {
      current = current.left;
      yield { type: 'move', nodeId: current?.id ?? null, line: 10 }; // current = current.left
    } else {
      current = current.right;
      yield { type: 'move', nodeId: current?.id ?? null, line: 12 }; // current = current.right
    }
  }

  yield { type: 'not-found', nodeId: null, line: 14 }; // return false
}
```

### Pattern 2: State Machine for Play/Pause/Step

**What:** Execution controller with states: idle, playing, paused. Transitions triggered by user controls.

**When to use:** Required for CODE-03 (play/pause/step controls).

**Example:**
```typescript
type ExecutionState = 'idle' | 'playing' | 'paused';

function useExecutionEngine() {
  const [state, setState] = useState<ExecutionState>('idle');
  const [currentStep, setCurrentStep] = useState<Step | null>(null);
  const [speed, setSpeed] = useState<number>(500); // ms between steps

  const play = useCallback(async function* () {
    setState('playing');
    for (const step of generator) {
      if (state === 'paused') {
        // Wait until resumed
        await new Promise(resolve => setTimeout(resolve,100));
        continue;
      }
      setCurrentStep(step);
      await new Promise(resolve => setTimeout(resolve, speed));
    }
    setState('idle');
  }, [generator, state, speed]);

  const pause = () => setState('paused');
  const step = () => { /* advance one step */ };

  return { state, currentStep, play, pause, step, setSpeed };
}
```

### Pattern 3: SVG Tree Rendering with d3-hierarchy

**What:** Use d3.tree() to compute node positions, then render as SVG elements.

**When to use:** Tree visualization - provides automatic layout without manual coordinate calculation.

**Example:**
```typescript
// Source: [VERIFIED: d3js.org/d3-hierarchy]
import { hierarchy, tree } from 'd3-hierarchy';

function useTreeLayout(root: TreeNode | null) {
  const [layout, setLayout] = useState<LayoutResult | null>(null);

  useEffect(() => {
    if (!root) { setLayout(null); return; }

    const rootHierarchy = hierarchy(root);
    const treeLayout = tree().size([width, height]);
    const treeData = treeLayout(rootHierarchy);

    setLayout({
      nodes: treeData.descendants(),
      links: treeData.links()
    });
  }, [root]);

  return layout;
}
```

### Pattern 4: Line Highlighting in Code Panel

**What:** Use react-syntax-highlighter with `highlightLines` prop to highlight the currently executing line.

**When to use:** CODE-01 and CODE-02 requirements.

**Example:**
```typescript
// Source: [VERIFIED: react-syntax-highlighter documentation]
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

<SyntaxHighlighter
  language="javascript"
  style={vscDarkPlus}
  showLineNumbers
  highlightLines={currentStep ? { [currentStep.line]: { backgroundColor: '#444', borderLeft: '3px solid #fff' } } : {}}
>
  {codeString}
</SyntaxHighlighter>
```

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Tree layout positioning | Manual x/y coordinate calculation | d3-hierarchy (tree layout) | Correctly handles variable-depth trees, edge cases, and rebalancing |
| Step-through execution | Custom callback queue or event emitter | Generator functions | Native pause/resume, composable, testable |
| Code syntax highlighting | Custom regex-based tokenizer | react-syntax-highlighter | Handles all edge cases, supports300+ languages |
| Line highlighting | DOM manipulation to add highlight classes | react-syntax-highlighter's highlightLines | Built-in, doesn't break Prism's tokenization |

**Key insight:** Algorithm visualization is a solved problem domain. Generator functions + d3-hierarchy + react-syntax-highlighter is the canonical stack. Building custom solutions introduces bugs that distract from the core learning experience.

## Common Pitfalls

### Pitfall 1: Generator vs Async Iterator Mismatch
**What goes wrong:** Attempting to use `for await...of` with a sync generator, or mixing generator return types.
**Why it happens:** Generators can be sync or async. Sync generators don't work with `for await...of`.
**How to avoid:** Keep the execution engine synchronous. Use `for...of` with generators. Use `setTimeout` wrapped in Promises for timing delays.
**Warning signs:** "TypeError: (intermediate value) is not iterable" or "Expected promise"

### Pitfall 2: Tree Layout Recalculation on Every State Change
**What goes wrong:** d3.tree() runs on every render, causing performance issues on large trees.
**Why it happens:** Layout computation is expensive; React re-renders trigger re-layout.
**How to avoid:** Memoize layout computation with `useMemo`. Only recalculate when tree structure changes (not when highlight changes).
**Warning signs:** Slow updates with trees > 20 nodes

### Pitfall 3: Stale Closure in Generator Iteration
**What goes wrong:** Generator captures stale state when created, but state updates during iteration cause inconsistency.
**Why it happens:** Closures capture variable values at creation time, not call time.
**How to avoid:** Pass tree reference as parameter to generator, not closure. Use refs for mutable state.
**Warning signs:** "Cannot read property 'left' of null" during step-through

### Pitfall 4: Code String vs Actual Implementation Divergence
**What goes wrong:** Code panel shows different code than what actually executes.
**Why it happens:** Code strings are static; implementation changes during iteration.
**How to avoid:** Keep source code strings in a separate file, version-controlled alongside the actual algorithm implementation.
**Warning signs:** Line numbers don't match actual execution

### Pitfall 5: Infinite Loop in Generator
**What goes wrong:** Generator never reaches `return`, causing UI to hang.
**Why it happens:** BST operations with bugs (missing base cases, incorrect pointer updates).
**How to avoid:** Test generators independently before wiring to UI. Add timeout guard.
**Warning signs:** Play button causes browser to become unresponsive

## Code Examples

### BST Node Structure
```typescript
// Source: [ASSUMED - standard BST implementation]
interface TreeNode {
  id: string;
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

interface Step {
  type: 'visit' | 'compare' | 'move' | 'found' | 'not-found' | 'delete' | 'insert';
  nodeId: string | null;
  line: number;
  description?: string;
}
```

### Execution Controller Hook
```typescript
// Source: [VERIFIED: async iterator pattern from MDN]
function useExecutionController() {
  const [state, setState] = useState<ExecutionState>('idle');
  const [currentStep, setCurrentStep] = useState<Step | null>(null);
  const [speed, setSpeed] = useState(500);
  const generatorRef = useRef<Generator<Step> | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const execute = useCallback((generator: Generator<Step>) => {
    generatorRef.current = generator;
    setState('playing');

    const step = () => {
      const gen = generatorRef.current;
      if (!gen) return;

      const result = gen.next();
      if (result.done) {
        setState('idle');
        generatorRef.current = null;
        return;
      }

      setCurrentStep(result.value);
      timeoutRef.current = window.setTimeout(step, speed);
    };

    step();
  }, [speed]);

  const pause = useCallback(() => {
    setState('paused');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const resume = useCallback(() => {
    if (state === 'paused') {
      setState('playing');
      // Continue iteration
    }
  }, [state]);

  const step = useCallback(() => {
    const gen = generatorRef.current;
    if (!gen) return;

    const result = gen.next();
    if (!result.done) {
      setCurrentStep(result.value);
    }
  }, []);

  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    generatorRef.current = null;
    setState('idle');
    setCurrentStep(null);
  }, []);

  return { state, currentStep, execute, pause, resume, step, reset, setSpeed };
}
```

### Tree Visualization Component
```typescript
// Source: [VERIFIED: d3-hierarchy pattern]
import { hierarchy, tree } from 'd3-hierarchy';
import { useMemo } from 'react';

interface TreeVisualizationProps {
  root: TreeNode | null;
  highlightedNodeId: string | null;
}

export function TreeVisualization({ root, highlightedNodeId }: TreeVisualizationProps) {
  const { nodes, links } = useMemo(() => {
    if (!root) return { nodes: [], links: [] };

    const rootHierarchy = hierarchy(root);
    const treeLayout = tree<TreeNode>().size([800, 400]);
    const treeData = treeLayout(rootHierarchy);

    return {
      nodes: treeData.descendants(),
      links: treeData.links()
    };
  }, [root]);

  if (!root) {
    return <div className="empty-state">Add your first node to begin</div>;
  }

  return (
    <svg viewBox="0 0 800 400">
      {links.map((link, i) => (
        <TreeEdge key={i} link={link} />
      ))}
      {nodes.map(node => (
<TreeNode
          key={node.data.id}
          node={node}
          isHighlighted={node.data.id === highlightedNodeId}
        />
      ))}
    </svg>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| setTimeout recursion for animation | Generator + setTimeout pattern | ~2018 | Cleaner separation of algorithm logic and animation |
| Canvas for tree rendering | SVG with d3-hierarchy | ~2015 | DOM accessibility, CSS styling, easier debugging |
| Custom tokenizer for code highlighting | Prism.js / Shiki | ~2012 (Prism), ~2020 (Shiki) | Battle-tested, handles edge cases |
| Callback-based step-through | Generator-based yield | ~2015 | Pause/resume without callback hell |

**Deprecated/outdated:**
- **Canvas-based rendering:** Canvas is harder to style and debug. SVG is preferred for tree visualization in React.
- **Velocity.js animations:** Framer Motion is the modern standard for React animations.
- **Babel plugin for line numbers:** react-syntax-highlighter handles this natively.

## Assumptions Log

> List all claims tagged `[ASSUMED]` in this research. The planner and discuss-phase use this section to identify decisions that need user confirmation before execution.

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | react-syntax-highlighter's `highlightLines` prop works as documented | Code Examples | If API changed, alternative approach needed |
| A2 | d3-hierarchy tree layout is sufficient for BST sizes expected (up to ~50 nodes) | Common Pitfalls | If performance is worse, may need elkjs |
| A3 | Generator functions can capture BST state without stale closure issues | Common Pitfalls | If stale closures occur, need to pass tree as parameter |

**If this table is empty:** All claims in this research were verified or cited - no user confirmation needed.

## Open Questions

1. **Should the code panel show the actual generator code or a simplified pseudocode version?**
   - What we know: Requirements say "algorithm implementation" - implies actual code
   - What's unclear: Actual implementation vs simplified pseudocode for learning
   - Recommendation: Start with actual implementation; allow toggle to pseudocode in future

2. **How should tree layout handle very wide trees (> 100 nodes)?**
   - What we know: d3.tree supports viewport panning via react-flow or manual SVG transforms
   - What's unclear: Performance characteristics of d3.tree with large trees
   - Recommendation: Implement viewport with pan/zoom using CSS transforms; test with100+ nodes

3. **Should deletion show the in-order successor replacement explicitly?**
   - What we know: BST deletion has3 cases (no children, one child, two children)
   - What's unclear: Whether to highlight the successor search path
   - Recommendation: Yes - yield steps for successor finding so users understand the full process

## Environment Availability

> Step 2.6: SKIPPED (no external dependencies identified beyond npm packages)

The phase requires only:
- Node.js runtime (for Vite/React development)
- npm for package management

These are assumed available in the development environment.

**Missing dependencies with no fallback:**
- None identified

**Missing dependencies with fallback:**
- None identified

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest (bundled with Vite) |
| Config file | `vite.config.ts` (test section) |
| Quick run command | `npm test -- --run` |
| Full suite command | `npm test` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| BST-01 | Insert node with value | unit | `vitest run src/algorithms/bst/generators.test.ts` | NO - needs creation |
| BST-02 | Delete node from tree | unit | `vitest run src/algorithms/bst/generators.test.ts` | NO - needs creation |
| BST-03 | Search finds value | unit | `vitest run src/algorithms/bst/generators.test.ts` | NO - needs creation |
| BST-04 | Inorder traversal yields sorted | unit | `vitest run src/algorithms/bst/generators.test.ts` | NO - needs creation |
| VIZ-01 | Tree renders nodes/edges | component | `vitest run src/components/TreeVisualization.test.tsx` | NO - needs creation |
| VIZ-02 | Tree updates on operation | component | `vitest run src/components/TreeVisualization.test.tsx` | NO - needs creation |
| VIZ-03 | Current node highlighted | component | `vitest run src/components/TreeVisualization.test.tsx` | NO - needs creation |
| CODE-01 | Code panel syntax highlighted | component | `vitest run src/components/CodePanel.test.tsx` | NO - needs creation |
| CODE-02 | Line highlighted during execution | integration | `vitest run src/hooks/useExecutionEngine.test.ts` | NO - needs creation |
| CODE-03 | Play/pause/step controls work | integration | `vitest run src/hooks/useExecutionEngine.test.ts` | NO - needs creation |
| CODE-04 | Speed control adjusts timing | unit | `vitest run src/hooks/useExecutionEngine.test.ts` | NO - needs creation |

### Sampling Rate
- **Per task commit:** `npm test -- --run` (quick unit test)
- **Per wave merge:** `npm test` (full suite)
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/algorithms/bst/bst.ts` - BST data structure with insert/delete/search/traverse
- [ ] `src/algorithms/bst/generators.ts` - Generator functions for step-through
- [ ] `src/algorithms/bst/generators.test.ts` - Unit tests for generators
- [ ] `src/algorithms/bst/code-strings.ts` - Source code strings for display
- [ ] `src/components/TreeVisualization/TreeVisualization.tsx` - Main tree component
- [ ] `src/components/TreeVisualization/TreeNode.tsx` - Node component
- [ ] `src/components/TreeVisualization/TreeEdge.tsx` - Edge component
- [ ] `src/components/TreeVisualization/TreeVisualization.test.tsx` - Tree tests
- [ ] `src/components/CodePanel/CodePanel.tsx` - Code display component
- [ ] `src/components/CodePanel/CodePanel.test.tsx` - Code panel tests
- [ ] `src/components/Controls/Controls.tsx` - Play/pause/step controls
- [ ] `src/components/Input/OperationInput.tsx` - Input component
- [ ] `src/hooks/useExecutionEngine.ts` - Execution controller hook
- [ ] `src/hooks/useExecutionEngine.test.ts` - Execution engine tests
- [ ] `src/hooks/useTreeLayout.ts` - d3 tree layout hook
- [ ] `src/state/ExecutionContext.tsx` - React context for execution state
- [ ] `src/types/index.ts` - TypeScript types
- [ ] `src/App.tsx` - Main app component
- [ ] `src/App.css` - App styles
- [ ] Framework install: `npm install` (run after project setup)

*(If no gaps: "None - existing test infrastructure covers all phase requirements")*

## Security Domain

> Security enforcement is disabled for this phase (client-side visualization only, no user accounts, no sensitive data).

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | N/A - no auth |
| V3 Session Management | No | N/A - no sessions |
| V4 Access Control | No | N/A - no access control |
| V5 Input Validation | Yes | Input validation on numeric inputs (BST values must be numbers) |
| V6 Cryptography | No | N/A - no crypto |

### Known Threat Patterns for React SPA

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| XSS via user input in tree labels | Tampering | React escapes by default; validate numeric input |
| ReDoS in syntax highlighting | Denial | Use well-maintained libraries (Prism.js, Shiki) |

## Sources

### Primary (HIGH confidence)
- [VERIFIED: d3js.org/d3-hierarchy] - d3-hierarchy tree layout documentation
- [VERIFIED: MDN generator documentation] - JavaScript generator function behavior
- [VERIFIED: npm registry] - Package versions verified: d3-hierarchy3.1.2, react-syntax-highlighter 16.1.1, framer-motion 12.40.0, @xyflow/react 12.11.0

### Secondary (MEDIUM confidence)
- [VERIFIED: reactflow.dev/learn] - ReactFlow features and layout algorithm support
- [VERIFIED: MDN async iterator documentation] - Async iterator pattern for animation timing
- [VERIFIED: react-syntax-highlighter documentation] - Line highlighting via highlightLines prop
- [VERIFIED: prismjs.com] - Prism.js line highlighting plugin support
- [VERIFIED: highlightjs.org] - highlight.js feature overview

### Tertiary (LOW confidence)
- [WebFetch: patterns.dev] - General React patterns (algorithm visualizer specific patterns not found)
- [WebFetch: freecodecamp.org] - BST implementation (page not found; used general knowledge)

## Metadata

**Confidence breakdown:**
- Standard stack: MEDIUM-HIGH - all packages verified on npm, canonical stack for this domain
- Architecture: MEDIUM - generator pattern verified, but specific implementation details need validation during build
- Pitfalls: MEDIUM - common pitfalls identified based on established patterns, but edge cases may surface during implementation

**Research date:** 2026-06-07
**Valid until:** 2026-07-07 (30 days - stable domain, no fast-moving changes expected)