import { createContext, useContext, useState, ReactNode } from 'react';
import { TreeNode, Step } from '../types';
import { useExecutionEngine, ExecutionState } from '../hooks/useExecutionEngine';

interface ExecutionContextValue {
  state: ExecutionState;
  currentStep: Step | null;
  speed: number;
  execute: (generator: Generator<Step, unknown, undefined>) => void;
  pause: () => void;
  resume: () => void;
  step: () => void;
  reset: () => void;
  setSpeed: (ms: number) => void;
  bstRoot: TreeNode | null;
  setBstRoot: (root: TreeNode | null) => void;
}

const ExecutionContext = createContext<ExecutionContextValue | null>(null);

interface ExecutionProviderProps {
  children: ReactNode;
}

/**
 * Provider component that wraps the app and provides execution context
 */
export function ExecutionProvider({ children }: ExecutionProviderProps) {
  const execution = useExecutionEngine();
  const [bstRoot, setBstRoot] = useState<TreeNode | null>(null);

  const value: ExecutionContextValue = {
    ...execution,
    bstRoot,
    setBstRoot,
  };

  return (
    <ExecutionContext.Provider value={value}>
      {children}
    </ExecutionContext.Provider>
  );
}

/**
 * Hook to access execution context
 */
export function useExecutionContext(): ExecutionContextValue {
  const context = useContext(ExecutionContext);
  if (!context) {
    throw new Error('useExecutionContext must be used within an ExecutionProvider');
  }
  return context;
}

// Re-export for convenience
export type { ExecutionState } from '../hooks/useExecutionEngine';