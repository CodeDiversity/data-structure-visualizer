import { useMemo } from 'react';
import { ExecutionProvider, useExecutionContext } from './state/ExecutionContext';
import TreeVisualization from './components/TreeVisualization/TreeVisualization';
import CodePanel from './components/CodePanel/CodePanel';
import Controls from './components/Controls/Controls';
import OperationInput from './components/Input/OperationInput';
import {
  INSERT_CODE,
  DELETE_CODE,
  SEARCH_CODE,
  INORDER_CODE,
} from './algorithms/bst/code-strings';
import './App.css';

/**
 * Inner app component that uses the execution context
 */
function AppContent() {
  const { currentStep, bstRoot } = useExecutionContext();

  // Determine which code to display based on the current step type
  const currentCode = useMemo(() => {
    if (!currentStep) return INSERT_CODE;

    switch (currentStep.type) {
      case 'insert':
        return INSERT_CODE;
      case 'delete':
        return DELETE_CODE;
      case 'traverse':
        return INORDER_CODE;
      case 'compare':
      case 'move':
      case 'found':
      case 'not-found':
        // Search-related steps show the search code
        return SEARCH_CODE;
      default:
        return INSERT_CODE;
    }
  }, [currentStep]);

  // Get current line for highlighting
  const currentLine = currentStep?.line ?? null;

  // Get highlighted node ID from current step
  const highlightedNodeId = currentStep?.nodeId ?? null;

  return (
    <div className="app">
      <header className="app-header">
        <h1>Data Structure Visualizer</h1>
        {currentStep && currentStep.description && (
          <div className="operation-status">
            <span className="status-label">Current:</span>
            <span className="status-description">{currentStep.description}</span>
          </div>
        )}
      </header>

      <main className="app-main">
        {/* Left Panel: Tree Visualization (60%) */}
        <section className="panel tree-panel">
          <h2 className="panel-title">Tree Visualization</h2>
          <TreeVisualization root={bstRoot} highlightedNodeId={highlightedNodeId} />
        </section>

        {/* Right Panel: Code + Controls + Input (40%) */}
        <section className="panel right-panel">
          <div className="code-section">
            <h2 className="panel-title">Code</h2>
            <CodePanel
              code={currentCode}
              currentLine={currentLine}
              language="javascript"
            />
          </div>

          <div className="controls-section">
            <Controls />
          </div>

          <div className="input-section">
            <OperationInput />
          </div>
        </section>
      </main>
    </div>
  );
}

/**
 * Main App component with provider wrapper
 */
function App() {
  return (
    <ExecutionProvider>
      <AppContent />
    </ExecutionProvider>
  );
}

export default App;