import { useExecutionContext } from '../../state/ExecutionContext';

/**
 * Controls component for execution control
 * Provides play, pause, step, reset buttons and speed control
 */
export default function Controls() {
  const {
    state,
    pause,
    resume,
    step,
    reset,
    setSpeed,
  } = useExecutionContext();

  const isPlaying = state === 'playing';
  const isPaused = state === 'paused';
  const isIdle = state === 'idle';

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else if (isPaused) {
      resume();
    }
  };

  const handleSpeedChange = (ms: number) => {
    setSpeed(ms);
  };

  return (
    <div className="controls">
      <div className="controls-state">
        <span className="state-label">
          {isIdle && 'Idle'}
          {isPlaying && 'Playing...'}
          {isPaused && 'Paused'}
        </span>
      </div>

      <div className="controls-buttons">
        <button
          className="control-btn play-pause-btn"
          onClick={handlePlayPause}
          disabled={isIdle}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        <button
          className="control-btn step-btn"
          onClick={step}
          disabled={isPlaying}
          title="Step"
        >
          Step
        </button>

        <button
          className="control-btn reset-btn"
          onClick={reset}
          title="Reset"
        >
          Reset
        </button>
      </div>

      <div className="controls-speed">
        <span className="speed-label">Speed:</span>
        <button
          className="speed-btn"
          onClick={() => handleSpeedChange(1000)}
          title="Slow (1000ms)"
        >
          Slow
        </button>
        <button
          className="speed-btn"
          onClick={() => handleSpeedChange(500)}
          title="Medium (500ms)"
        >
          Medium
        </button>
        <button
          className="speed-btn"
          onClick={() => handleSpeedChange(200)}
          title="Fast (200ms)"
        >
          Fast
        </button>
      </div>

      <style>{`
        .controls {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px;
          background: #2a2a2a;
          border-radius: 8px;
        }

        .controls-state {
          text-align: center;
        }

        .state-label {
          font-size: 14px;
          color: #888;
        }

        .controls-buttons {
          display: flex;
          gap: 8px;
          justify-content: center;
        }

        .control-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: background-color 0.2s, opacity 0.2s;
        }

        .control-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .play-pause-btn {
          background: #4caf50;
          color: white;
        }

        .play-pause-btn:hover:not(:disabled) {
          background: #45a049;
        }

        .step-btn {
          background: #2196f3;
          color: white;
        }

        .step-btn:hover:not(:disabled) {
          background: #1976d2;
        }

        .reset-btn {
          background: #f44336;
          color: white;
        }

        .reset-btn:hover:not(:disabled) {
          background: #d32f2f;
        }

        .controls-speed {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .speed-label {
          font-size: 12px;
          color: #888;
        }

        .speed-btn {
          padding: 4px 12px;
          border: 1px solid #555;
          border-radius: 4px;
          background: #333;
          color: #ccc;
          cursor: pointer;
          font-size: 12px;
          transition: background-color 0.2s;
        }

        .speed-btn:hover {
          background: #444;
        }
      `}</style>
    </div>
  );
}