import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { useEffect } from 'react';
import { act, render, screen } from '@testing-library/react';
import Narration from './Narration';
import { ExecutionProvider, useExecutionContext } from '../../state/ExecutionContext';
import type { Step } from '../../types';

/**
 * Test harness that drives the execution engine with a stub generator.
 * Renders Narration inside the real ExecutionProvider and lets the test
 * specify which step (if any) the engine should yield.
 */
function Harness({ steps }: { steps: Step[] }) {
  const { execute } = useExecutionContext();
  useEffect(() => {
    if (steps.length > 0) {
      // Use startPaused so the engine yields the first step and stops
      // there, instead of advancing to the next tick and exhausting the
      // stub generator.
      execute(
        (function* () {
          for (const step of steps) {
            yield step;
          }
        })(),
        undefined,
        { startPaused: true }
      );
    }
    // We intentionally only run this once on mount to set up the test state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <Narration />;
}

function renderNarration(steps: Step[]) {
  return render(
    <ExecutionProvider>
      <Harness steps={steps} />
    </ExecutionProvider>
  );
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Narration', () => {
  it('renders nothing when no step has executed', () => {
    const { container } = renderNarration([]);
    act(() => {
      vi.runOnlyPendingTimers();
    });
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when the current step has no description', () => {
    const stepWithoutDescription: Step = {
      type: 'visit',
      nodeId: 'n1',
      line: 1,
    };
    const { container } = renderNarration([stepWithoutDescription]);
    act(() => {
      vi.runOnlyPendingTimers();
    });
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when the description is an empty string', () => {
    const stepWithEmptyDescription: Step = {
      type: 'visit',
      nodeId: 'n1',
      line: 1,
      description: '',
    };
    const { container } = renderNarration([stepWithEmptyDescription]);
    act(() => {
      vi.runOnlyPendingTimers();
    });
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the description text and a "Narration" label when present', () => {
    const stepWithDescription: Step = {
      type: 'visit',
      nodeId: 'n1',
      line: 1,
      description: 'Visiting node with value 50',
    };
    renderNarration([stepWithDescription]);
    act(() => {
      vi.runOnlyPendingTimers();
    });
    expect(screen.getByText('Narration')).toBeInTheDocument();
    expect(screen.getByText('Visiting node with value 50')).toBeInTheDocument();
  });
});

