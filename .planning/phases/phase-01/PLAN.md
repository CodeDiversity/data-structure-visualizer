# Phase 1 Plan: BST Visualizer MVP

**Phase Goal:** Working Binary Search Tree visualizer with step-by-step code execution and line highlighting.

**As a** self-learning developer, **I want to** see how BST operations work step-by-step with synchronized code highlighting, **so that** I can understand algorithms by watching them think.

---

## Wave Structure

| Wave | Plans | Description | Dependencies |
|------|-------|-------------|--------------|
| 0 | 1.1 | Project setup (Vite + dependencies) | None |
| 1 | 1.2 | BST implementation with generators | 1.1 |
| 2 | 1.3, 1.4 | Tree visualization + Code panel | 1.2 |
| 3 | 1.5, 1.6 | Controls + UI layout and polish | 1.3, 1.4 |

**Parallelization:** Wave 2 plans (1.3, 1.4) have no file overlap and can execute in parallel. Wave 3 plans (1.5, 1.6) can also run in parallel but 1.6 depends on components from both 1.3 and 1.4.

---

## Plan 1.1: Project Setup

**Plan:** 01
**Wave:** 0
**Type:** execute
**Depends On:** []
**Autonomous:** true

```yaml
requirements:
  - UI-04 # Desktop layout foundation via Vite config
files_modified:
  - package.json
  - vite.config.ts
  - index.html
  - src/main.tsx
  - src/App.tsx
  - src/App.css
  - src/index.css
  - tsconfig.json
  - tsconfig.node.json
  - .gitignore
  - src/vite-env.d.ts
```

### Objective

Initialize React project with Vite, install required dependencies (d3-hierarchy, react-syntax-highlighter, framer-motion), and create the folder structure for the visualizer.

### Tasks

<task type="auto">
  <name>Task 1: Initialize Vite React TypeScript project</name>
  <files>package.json, vite.config.ts, index.html, tsconfig.json, tsconfig.node.json, .gitignore, src/vite-env.d.ts</files>
  <action>
    Create Vite React TypeScript project structure. Initialize package.json with:
    - react ^18.x
    - vite ^5.x
    - @types/react, @types/react-dom, @types/node (dev)
    - typescript
    - vitest and @testing-library/react (dev for testing)

    Create vite.config.ts with test configuration for Vitest.

    Create index.html with title "Data Structure Visualizer" and root div.

    Create tsconfig.json with strict mode, JSX support, and path aliases for src/.

    Create .gitignore for node_modules, dist, .env, etc.
  </action>
  <verify>
    <automated>npm install --dry-run 2>&1 | head -20</automated>
  </verify>
  <done>package.json exists with all dependencies, vite config valid, TypeScript compiles without errors</done>
</task>

<task type="auto">
  <name>Task 2: Install project dependencies</name>
  <files>package.json, package-lock.json</files>
  <action>
    Install all required packages:
    - d3-hierarchy@3.1.2
    - react-syntax-highlighter@16.1.1
    - framer-motion@12.40.0

    Dev dependencies already in package.json from Task 1.
  </action>
  <verify>
    <automated>npm ls d3-hierarchy react-syntax-highlighter framer-motion 2>&1 | grep -E "d3-hierarchy|react-syntax-highlighter|framer-motion"</automated>
  </verify>
  <done>All three packages installed and listed in package-lock.json</done>
</task>

<task type="auto">
  <name>Task 3: Create folder structure</name>
  <files>src/components/TreeVisualization/.gitkeep, src/components/CodePanel/.gitkeep, src/components/Controls/.gitkeep, src/components/Input/.gitkeep, src/algorithms/bst/.gitkeep, src/hooks/.gitkeep, src/state/.gitkeep, src/types/.gitkeep</files>
  <action>
    Create the following directory structure under src/:
    - components/TreeVisualization/
    - components/CodePanel/
    - components/Controls/
    - components/Input/
    - algorithms/bst/
    - hooks/
    - state/
    - types/

    Place .gitkeep files in each directory to preserve structure.
  </action>
  <verify>
    <automated>find src -type d | sort</automated>
  </verify>
  <done>All directories created with .gitkeep files</done>
</task>

<task type="auto">
  <name>Task 4: Create base App component and CSS</name>
  <files>src/main.tsx, src/App.tsx, src/App.css, src/index.css</files>
  <action>
    Create src/main.tsx with React 18 createRoot rendering App.

    Create src/App.tsx as a simple functional component that renders a placeholder heading "Data Structure Visualizer".

    Create src/index.css with basic CSS reset (box-sizing, margin 0, padding 0).

    Create src/App.css empty for now (styles will be added in plan 1.6).
  </action>
  <verify>
    <automated>npx tsc --noEmit 2>&1</automated>
  </verify>
  <done>App renders without errors, TypeScript compiles</done>
</task>

### Must-Haves

**Truths:**
- Project builds and runs with `npm run dev`
- All dependencies installed without conflicts
- TypeScript compilation succeeds with strict mode

**Artifacts:**
- path: "package.json" — provides dependency declarations
- path: "vite.config.ts" — provides build configuration
- path: "src/" — provides project structure

---

## Plan 1.2: BST Implementation

**Plan:** 02
**Wave:** 1
**Type:** execute
**Depends On:** [01]
**Autonomous:** true

```yaml
requirements:
  - BST-01  # Insert operation
  - BST-02  # Delete operation
  - BST-03  # Search operation
  - BST-04  # In-order traversal
files_modified:
  - src/types/index.ts
  - src/algorithms/bst/bst.ts
  - src/algorithms/bst/generators.ts
  - src/algorithms/bst/code-strings.ts
```

### Objective

Implement the BST data structure with insert, delete, search, and in-order traversal operations. Each operation uses generator functions that yield step objects for visualization.

### Tasks

<task type="auto">
  <name>Task 1: Define TypeScript types for BST</name>
  <files>src/types/index.ts</files>
  <action>
    Define TypeScript interfaces in src/types/index.ts:

    interface TreeNode {
      id: string;
      value: number;
      left: TreeNode | null;
      right: TreeNode | null;
    }

    interface Step {
      type: 'visit' | 'compare' | 'move' | 'found' | 'not-found' | 'delete' | 'insert' | 'traverse';
      nodeId: string | null;
      line: number;
      description?: string;
    }

    interface BSTOperations {
      insert: (root: TreeNode | null, value: number) => TreeNode;
      delete: (root: TreeNode | null, value: number) => TreeNode;
      search: (root: TreeNode | null, value: number) => boolean;
      inorder: (root: TreeNode | null) => number[];
    }

    Export all types.
  </action>
  <verify>
    <automated>npx tsc --noEmit2>&1</automated>
  </verify>
  <done>Types defined and exported, TypeScript compiles without errors</done>
</task>

<task type="auto">
  <name>Task 2: Implement BST core operations</name>
  <files>src/algorithms/bst/bst.ts</files>
  <action>
    Implement BST data structure in src/algorithms/bst/bst.ts:

    - insert(root, value): Recursively inserts a new node, returns updated root
    - delete(root, value): Removes node, handles 0/1/2 child cases, returns updated root
    - search(root, value): Returns true if value exists
    - inorder(root): Returns sorted array of values

    Use class-based or functional approach with clear node manipulation.
    Each function should be well-documented with JSDoc comments.
  </action>
  <verify>
    <automated>npx tsc --noEmit 2>&1</automated>
  </verify>
  <done>BST operations implemented, TypeScript compiles</done>
</task>

<task type="auto">
  <name>Task 3: Create generator functions for step-through execution</name>
  <files>src/algorithms/bst/generators.ts</files>
  <action>
    Create generator functions in src/algorithms/bst/generators.ts that yield Step objects:

    - function* bstInsert(root: TreeNode | null, value: number): yields at each comparison and insertion point
    - function* bstDelete(root: TreeNode | null, value: number): yields at each visit, comparison, and deletion
    - function* bstSearch(root: TreeNode | null, value: number): yields at each node visit and comparison
    - function* bstInorder(root: TreeNode | null): yields at each node visit during traversal

    Each yield must include:
    - type: describes the action (visit, compare, move, found, etc.)
    - nodeId: the current node's id (or null for not-found)
    - line: source line number for code highlighting
    - description: human-readable description of the step

    Reference code-strings.ts for line numbers (to be created in next task).
  </action>
  <verify>
    <automated>npx tsc --noEmit 2>&1</automated>
  </verify>
  <done>Generator functions yield proper Step objects with line numbers</done>
</task>

<task type="auto">
  <name>Task 4: Create code strings for display panel</name>
  <files>src/algorithms/bst/code-strings.ts</files>
  <action>
    Create src/algorithms/bst/code-strings.ts with the actual source code strings for each BST operation. These strings will be displayed in the CodePanel.

    Export:
    - INSERT_CODE: string containing the insert algorithm source
    - DELETE_CODE: string containing the delete algorithm source
    - SEARCH_CODE: string containing the search algorithm source
    - INORDER_CODE: string containing the inorder traversal source

    Use actual TypeScript/JavaScript code that matches the implementation.
    Include line numbers in comments for reference (e.g., "// Line 1: function insert...").

    Important: Keep these strings in sync with the actual implementation.
  </action>
  <verify>
    <automated>npx tsc --noEmit 2>&1</automated>
  </verify>
  <done>Code strings exported and match implementation</done>
</task>

### Must-Haves

**Truths:**
- User can insert a value and see it appear in the tree
- User can delete a value and see the tree restructure
- User can search and see the search path highlighted
- User can traverse and see nodes visited in order

**Artifacts:**
- path: "src/types/index.ts" — provides TreeNode, Step, BSTOperations types
- path: "src/algorithms/bst/bst.ts" — provides insert, delete, search, inorder implementations
- path: "src/algorithms/bst/generators.ts" — provides generator functions yielding steps
- path: "src/algorithms/bst/code-strings.ts" — provides source code strings for display

**Key Links:**
- from: "generators.ts" to: "code-strings.ts" — line numbers reference the code strings
- from: "generators.ts" to: "bst.ts" — generators call the BST operations

---

## Plan 1.3: Tree Visualization

**Plan:** 03
**Wave:** 2
**Type:** execute
**Depends On:** [02]
**Autonomous:** true

```yaml
requirements:
  - VIZ-01  # Tree rendered as graph with nodes and edges
  - VIZ-02  # Tree updates in real-time as operations execute
  - VIZ-03  # Current node highlighted during execution
  - VIZ-04  # Empty tree state shows placeholder
files_modified:
  - src/hooks/useTreeLayout.ts
  - src/components/TreeVisualization/TreeVisualization.tsx
  - src/components/TreeVisualization/TreeNode.tsx
  - src/components/TreeVisualization/TreeEdge.tsx
```

### Objective

Build the SVG-based tree visualization component using d3-hierarchy for layout. The component renders nodes and edges, highlights the current node during execution, and shows an empty state when no nodes exist.

### Tasks

<task type="auto">
  <name>Task 1: Create useTreeLayout hook</name>
  <files>src/hooks/useTreeLayout.ts</files>
  <action>
    Create src/hooks/useTreeLayout.ts with a hook that uses d3-hierarchy to compute tree layout:

    - Import hierarchy and tree from d3-hierarchy
    - Accept root: TreeNode | null and dimensions: {width, height}
    - Use useMemo to memoize the layout computation
    - Return { nodes, links } where nodes includes x, y coordinates from d3

    Memoize based on root (the actual tree structure, not just a reference).
    Only recalculate when tree structure changes, not when highlights change.
  </action>
  <verify>
    <automated>npx tsc --noEmit 2>&1</automated>
  </verify>
  <done>useTreeLayout hook computes layout correctly with d3-hierarchy</done>
</task>

<task type="auto">
  <name>Task 2: Create TreeNode component</name>
  <files>src/components/TreeVisualization/TreeNode.tsx</files>
  <action>
    Create src/components/TreeVisualization/TreeNode.tsx:

    - Props: node (with x, y, data), isHighlighted (boolean)
    - Render as SVG circle (r=20) with value text inside
    - When isHighlighted is true, apply different fill color (e.g., #ff6b6b vs #4dabf7)
    - Add transition animation using framer-motion for smooth highlight changes
    - Position using cx and cy from node data

    Export as default.
  </action>
  <verify>
    <automated>npx tsc --noEmit 2>&1</automated>
  </verify>
  <done>TreeNode renders correctly with highlight animation</done>
</task>

<task type="auto">
  <name>Task 3: Create TreeEdge component</name>
  <files>src/components/TreeVisualization/TreeEdge.tsx</files>
  <action>
    Create src/components/TreeVisualization/TreeEdge.tsx:

    - Props: link (from d3 tree layout with source and target nodes)
    - Render as SVG line connecting source and target nodes
    - Use stroke: #888, strokeWidth: 2
    - Use coordinates from link.source.x/y and link.target.x/y

    Export as default.
  </action>
  <verify>
    <automated>npx tsc --noEmit 2>&1</automated>
  </verify>
  <done>TreeEdge renders as line between nodes</done>
</task>

<task type="auto">
  <name>Task 4: Create TreeVisualization main component</name>
  <files>src/components/TreeVisualization/TreeVisualization.tsx</files>
  <action>
    Create src/components/TreeVisualization/TreeVisualization.tsx:

    - Props: root (TreeNode | null), highlightedNodeId (string | null)
    - Use useTreeLayout hook to get nodes and links
    - Render SVG with viewBox based on dimensions
    - Map over links to render TreeEdge components
    - Map over nodes to render TreeNode components
    - Pass isHighlighted={node.data.id === highlightedNodeId} to each TreeNode
    - When root is null, render empty state div with text "Add your first node to begin"

    Use memo/useMemo to prevent unnecessary re-renders.
    Apply CSS class for styling.
  </action>
  <verify>
    <automated>npx tsc --noEmit 2>&1</automated>
  </verify>
  <done>TreeVisualization renders tree with highlights and empty state</done>
</task>

### Must-Haves

**Truths:**
- Tree renders as SVG with nodes (circles) and edges (lines)
- Tree updates when nodes are added/removed
- Current node is highlighted during execution
- Empty tree shows placeholder text

**Artifacts:**
- path: "src/hooks/useTreeLayout.ts" — provides d3-hierarchy layout computation
- path: "src/components/TreeVisualization/TreeVisualization.tsx" — main visualization component
- path: "src/components/TreeVisualization/TreeNode.tsx" — individual node rendering
- path: "src/components/TreeVisualization/TreeEdge.tsx" — edge rendering

**Key Links:**
- from: "TreeVisualization.tsx" to: "useTreeLayout.ts" — uses hook for layout
- from: "TreeVisualization.tsx" to: "TreeNode.tsx" — renders nodes
- from: "TreeVisualization.tsx" to: "TreeEdge.tsx" — renders edges

---

## Plan 1.4: Code Panel

**Plan:** 04
**Wave:** 2
**Type:** execute
**Depends On:** [02]
**Autonomous:** true

```yaml
requirements:
  - CODE-01  # Code panel with syntax highlighting
  - CODE-02  # Current executing line highlighted
files_modified:
  - src/components/CodePanel/CodePanel.tsx
```

### Objective

Build the code panel component that displays BST algorithm source code with syntax highlighting. The panel highlights the currently executing line based on the current step from the execution engine.

### Tasks

<task type="auto">
  <name>Task 1: Create CodePanel component</name>
  <files>src/components/CodePanel/CodePanel.tsx</files>
  <action>
    Create src/components/CodePanel/CodePanel.tsx:

    - Props: code (string), currentLine (number | null), language ('javascript' | 'typescript')
    - Use Prism from react-syntax-highlighter for syntax highlighting
    - Import a dark theme style (vscDarkPlus or similar)
    - Pass highlightLines prop to SyntaxHighlighter:
      highlightLines={currentLine ? { [currentLine]: { backgroundColor: '#444', borderLeft: '3px solid #fff' } } : {}}
    - Show line numbers with showLineNumbers prop
    - Apply custom styling for the code panel container (dark background, padding, font)

    Export as default.
  </action>
  <verify>
    <automated>npx tsc --noEmit 2>&1</automated>
  </verify>
  <done>CodePanel renders with syntax highlighting and line highlighting</done>
</task>

### Must-Haves

**Truths:**
- Code panel displays algorithm source with syntax highlighting
- Current executing line is highlighted distinctly
- Line numbers are visible

**Artifacts:**
- path: "src/components/CodePanel/CodePanel.tsx" — provides code display with line highlighting

**Key Links:**
- from: "CodePanel.tsx" to: "code-strings.ts" — receives code string to display
- from: "CodePanel.tsx" to: "execution engine" — receives currentLine from execution state

---

## Plan 1.5: Play/Pause/Step Controls

**Plan:** 05
**Wave:** 3
**Type:** execute
**Depends On:** [03, 04]
**Autonomous:** true

```yaml
requirements:
  - CODE-03  # Play, pause, step forward, reset execution
  - CODE-04  # Execution speed controllable
  - UI-02    # Operation buttons clearly accessible
  - UI-03    # Current operation state displayed
files_modified:
  - src/hooks/useExecutionEngine.ts
  - src/state/ExecutionContext.tsx
  - src/components/Controls/Controls.tsx
  - src/components/Input/OperationInput.tsx
```

### Objective

Build the execution controller hook and controls component. The execution engine manages the state machine (idle/playing/paused) and controls iteration through generator steps. Controls component provides play, pause, step, and reset buttons plus speed control.

### Tasks

<task type="auto">
  <name>Task 1: Create useExecutionEngine hook</name>
  <files>src/hooks/useExecutionEngine.ts</files>
  <action>
    Create src/hooks/useExecutionEngine.ts:

    - State: executionState ('idle' | 'playing' | 'paused'), currentStep (Step | null), speed (number in ms)
    - Use useRef to store generator reference and timeout ID
    - execute(generator): starts iteration, sets state to 'playing'
    - pause(): sets state to 'paused', clears timeout
    - resume(): sets state to 'playing', continues iteration
    - step(): advances one step without timing delay
    - reset(): clears everything, returns to idle state
    - setSpeed(ms): updates speed for subsequent steps

    Use setTimeout wrapped in Promises for timing delays.
    Handle cleanup properly to avoid memory leaks.
  </action>
  <verify>
    <automated>npx tsc --noEmit 2>&1</automated>
  </verify>
  <done>useExecutionEngine manages state machine correctly</done>
</task>

<task type="auto">
  <name>Task 2: Create ExecutionContext</name>
  <files>src/state/ExecutionContext.tsx</files>
  <action>
    Create src/state/ExecutionContext.tsx:

    - Create React Context with useExecutionEngine hook
    - Export context and provider component
    - Context value includes: state, currentStep, execute, pause, resume, step, reset, setSpeed
    - Also include: bstRoot (TreeNode | null), setBstRoot for tree state
    - Provide default values for when context is not yet used

    Wrap App with ExecutionContext.Provider in a dedicated file.
  </action>
  <verify>
    <automated>npx tsc --noEmit 2>&1</automated>
  </verify>
  <done>ExecutionContext provides execution state to all components</done>
</task>

<task type="auto">
  <name>Task 3: Create Controls component</name>
  <files>src/components/Controls/Controls.tsx</files>
  <action>
    Create src/components/Controls/Controls.tsx:

    - Props: none (uses ExecutionContext)
    - Render play/pause button (toggles based on state)
    - Render step button (disabled when playing)
    - Render reset button
    - Render speed control as three buttons: Slow (1000ms), Medium (500ms), Fast (200ms)
    - Display current state text: "Idle", "Playing...", "Paused"
    - Apply CSS classes for button styling

    Export as default.
  </action>
  <verify>
    <automated>npx tsc --noEmit 2>&1</automated>
  </verify>
  <done>Controls component renders play/pause/step/speed buttons</done>
</task>

<task type="auto">
  <name>Task 4: Create OperationInput component</name>
  <files>src/components/Input/OperationInput.tsx</files>
  <action>
    Create src/components/Input/OperationInput.tsx:

    - Props: none (uses ExecutionContext)
    - Render text input field for value (type="number")
    - Render four operation buttons: Insert, Delete, Search, Traverse
    - On Insert: create generator via bstInsert, call execute
    - On Delete: create generator via bstDelete, call execute
    - On Search: create generator via bstSearch, call execute
    - On Traverse: create generator via bstInorder, call execute
    - Validate input: only allow numbers, show validation message for invalid input
    - Disable operation buttons while playing (or queue the operation)

    Export as default.
  </action>
  <verify>
    <automated>npx tsc --noEmit 2>&1</automated>
  </verify>
  <done>OperationInput renders input field and operation buttons</done>
</task>

### Must-Haves

**Truths:**
- User can play, pause, step through, and reset execution
- User can control execution speed (slow/medium/fast)
- User can input values and trigger operations
- Current operation state is displayed

**Artifacts:**
- path: "src/hooks/useExecutionEngine.ts" — provides execution state machine
- path: "src/state/ExecutionContext.tsx" — provides context for execution state
- path: "src/components/Controls/Controls.tsx" — provides control buttons
- path: "src/components/Input/OperationInput.tsx" — provides input and operation buttons

**Key Links:**
- from: "Controls.tsx" to: "ExecutionContext.tsx" — consumes execution state
- from: "OperationInput.tsx" to: "ExecutionContext.tsx" — triggers operations
- from: "OperationInput.tsx" to: "generators.ts" — calls generator functions

---

## Plan 1.6: UI Layout and Polish

**Plan:** 06
**Wave:** 3
**Type:** execute
**Depends On:** [03, 04, 05]
**Autonomous:** true

```yaml
requirements:
  - UI-01  # User can input values via text field + button
  - UI-04  # Layout works on desktop (min-width: 1024px)
files_modified:
  - src/App.tsx
  - src/App.css
```

### Objective

Wire all components together in the App component with proper layout. Implement the two-panel layout (tree visualization + code panel on left, controls + input on right) and polish the visual presentation.

### Tasks

<task type="auto">
  <name>Task 1: Update App.tsx with layout</name>
  <files>src/App.tsx</files>
  <action>
    Update src/App.tsx:

    - Import and use ExecutionContext.Provider
    - Create two-column layout:
      - Left panel (60%): TreeVisualization component
      - Right panel (40%): CodePanel + Controls + OperationInput stacked vertically
    - Pass props to components:
      - TreeVisualization: root from context, highlightedNodeId from currentStep.nodeId
      - CodePanel: code based on current operation, currentLine from currentStep.line
    - Add operation status display showing current step description

    Use React fragments to avoid unnecessary DOM nodes.
  </action>
  <verify>
    <automated>npx tsc --noEmit 2>&1</automated>
  </verify>
  <done>App.tsx renders with proper two-panel layout</done>
</task>

<task type="auto">
  <name>Task 2: Style App.css for desktop layout</name>
  <files>src/App.css</files>
  <action>
    Update src/App.css:

    - Main container: CSS Grid with two columns (60% / 40%)
    - Min-width: 1024px for desktop layout
    - Panel styling: background colors, padding, border-radius
    - Tree visualization panel: light background, centered SVG
    - Right panel: darker background, stacked components
    - Controls styling: button group with consistent spacing
    - Operation input styling: input field and button group
    - Code panel styling: dark theme background, monospace font
    - Operation status: prominent display of current step description

    Add responsive considerations but focus on desktop first.
  </action>
  <verify>
    <automated>npx tsc --noEmit 2>&1</automated>
  </verify>
  <done>App.css provides desktop-optimized two-panel layout</done>
</task>

<task type="auto">
  <name>Task 3: Final integration and verification</name>
  <files>src/App.tsx, src/App.css, src/index.css</files>
  <action>
    Final integration steps:

    - Ensure all imports are correct and components are properly connected
    - Update src/index.css with any global styles needed (font imports, etc.)
    - Verify the app builds: npm run build
    - Verify no TypeScript errors: npx tsc --noEmit
    - Test that the app runs: npm run dev (manual verification)

    Check that all requirements are addressed:
    - BST-01 to BST-04: BST operations work
    - VIZ-01 to VIZ-04: Tree visualization works
    - CODE-01 to CODE-04: Code panel with highlighting works
    - UI-01 to UI-04: UI layout and input works
  </action>
  <verify>
    <automated>npm run build 2>&1 | tail -20</automated>
  </verify>
  <done>App builds successfully, all components integrated</done>
</task>

### Must-Haves

**Truths:**
- Two-panel layout displays tree and code side by side
- Layout works on desktop browsers (min-width: 1024px)
- All components are wired together and functional

**Artifacts:**
- path: "src/App.tsx" — main app with layout and component wiring
- path: "src/App.css" — desktop-optimized styling

**Key Links:**
- from: "App.tsx" to: "TreeVisualization.tsx" — passes root and highlightedNodeId
- from: "App.tsx" to: "CodePanel.tsx" — passes code and currentLine
- from: "App.tsx" to: "Controls.tsx" — uses context
- from: "App.tsx" to: "OperationInput.tsx" — uses context

---

## Success Criteria Summary

When all plans are executed:

1. **BST Operations (BST-01 to BST-04):**
   - User can insert a value into the BST
   - User can delete a value from the BST
   - User can search for a value in the BST
   - User can trigger in-order traversal and see sorted output

2. **Visualization (VIZ-01 to VIZ-04):**
   - Tree renders as SVG with nodes and edges
   - Tree updates in real-time as operations execute
   - Current node is highlighted during execution
   - Empty tree shows placeholder prompting user to add first node

3. **Code Execution (CODE-01 to CODE-04):**
   - Code panel displays algorithm with syntax highlighting
   - Current executing line is highlighted
   - Play/pause/step/reset controls work
   - Speed control (slow/medium/fast) adjusts timing

4. **UI/UX (UI-01 to UI-04):**
   - User can input values via text field and button
   - Operation buttons (Insert, Delete, Search, Traverse) are accessible
   - Current operation state is displayed
   - Layout works on desktop browsers (min-width: 1024px)

5. **Technical Quality:**
   - No TypeScript compilation errors
   - Production build succeeds
   - No console errors in browser

---

## Threat Model

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-01 | Denial | User inputs extremely large tree | accept | d3-hierarchy handles 50+ nodes; performance is browser-dependent |
| T-02 | Tampering | Non-numeric input in value field | mitigate | Input type="number" + validation in OperationInput rejects non-numeric |
| T-03 | Denial | Infinite loop in generator | mitigate | All generators have clear base cases; reset button available to break stuck execution |

---

## Output

Create `.planning/phases/phase-01/01-01-PLAN.md` through `01-06-PLAN.md` when done.

Execute: `/gsd:execute-phase 01`
