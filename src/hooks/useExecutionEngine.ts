import { useState, useRef, useCallback } from 'react';
import { Step } from '../types';

export type ExecutionState = 'idle' | 'playing' | 'paused';

interface UseExecutionEngineReturn {
  state: ExecutionState;
  currentStep: Step | null;
  speed: number;
  execute: (generator: Generator<Step, unknown, undefined>) => void;
  pause: () => void;
  resume: () => void;
  step: () => void;
  reset: () => void;
  setSpeed: (ms: number) => void;
}

/**
 * Hook that manages the execution state machine for BST visualization
 * Handles play, pause, step, and reset functionality with timing control
 */
export function useExecutionEngine(): UseExecutionEngineReturn {
  const [state, setState] = useState<ExecutionState>('idle');
  const [currentStep, setCurrentStep] = useState<Step | null>(null);
  const [speed, setSpeedState] = useState<number>(500); // Default medium speed

  // Use refs to store mutable values needed in closures
  const generatorRef = useRef<Generator<Step, unknown, undefined> | null>(null);
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRunningRef = useRef<boolean>(false);

  /**
   * Internal function to advance to the next step
   */
  const nextStep = useCallback(() => {
    if (!generatorRef.current || !isRunningRef.current) {
      return;
    }

    const result = generatorRef.current.next();

    if (result.done) {
      // Generator exhausted, return to idle
      setState('idle');
      setCurrentStep(null);
      isRunningRef.current = false;
      generatorRef.current = null;
      return;
    }

    // Update current step
    setCurrentStep(result.value);

    // If still playing, schedule next step
    if (isRunningRef.current) {
      timeoutIdRef.current = setTimeout(nextStep, speed);
    }
  }, [speed]);

  /**
   * Start execution with a generator
   */
  const execute = useCallback((generator: Generator<Step, unknown, undefined>) => {
    // Clean up any existing execution
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }

    // Store generator and start execution
    generatorRef.current = generator;
    isRunningRef.current = true;
    setState('playing');

    // Get first step
    const result = generator.next();

    if (result.done) {
      setState('idle');
      setCurrentStep(null);
      isRunningRef.current = false;
      generatorRef.current = null;
      return;
    }

    setCurrentStep(result.value);

    // Schedule next step
    timeoutIdRef.current = setTimeout(nextStep, speed);
  }, [speed, nextStep]);

  /**
   * Pause execution
   */
  const pause = useCallback(() => {
    if (state !== 'playing') return;

    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }

    isRunningRef.current = false;
    setState('paused');
  }, [state]);

  /**
   * Resume execution
   */
  const resume = useCallback(() => {
    if (state !== 'paused' || !generatorRef.current) return;

    isRunningRef.current = true;
    setState('playing');
    timeoutIdRef.current = setTimeout(nextStep, speed);
  }, [state, speed, nextStep]);

  /**
   * Advance one step without timing delay
   */
  const step = useCallback(() => {
    // Cannot step while playing
    if (state === 'playing') return;

    // If idle and no generator, nothing to step
    if (state === 'idle' && !generatorRef.current) return;

    // If paused, advance one step
    if (state === 'paused' && generatorRef.current) {
      const result = generatorRef.current.next();

      if (result.done) {
        setState('idle');
        setCurrentStep(null);
        isRunningRef.current = false;
        generatorRef.current = null;
        return;
      }

      setCurrentStep(result.value);
    }
  }, [state]);

  /**
   * Reset execution state
   */
  const reset = useCallback(() => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }

    generatorRef.current = null;
    isRunningRef.current = false;
    setState('idle');
    setCurrentStep(null);
  }, []);

  /**
   * Update speed for subsequent steps
   */
  const setSpeed = useCallback((ms: number) => {
    setSpeedState(ms);
  }, []);

  return {
    state,
    currentStep,
    speed,
    execute,
    pause,
    resume,
    step,
    reset,
    setSpeed,
  };
}