import { CSSProperties } from 'react';
import { useExecutionContext } from '../../state/ExecutionContext';

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '16px',
  background: '#2a2a2a',
  borderRadius: '8px',
};

const buttonRowStyle: CSSProperties = {
  display: 'flex',
  gap: '8px',
  justifyContent: 'center',
};

const baseButtonStyle: CSSProperties = {
  padding: '8px 16px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 500,
  color: '#fff',
};

const speedButtonStyle: CSSProperties = {
  padding: '4px 12px',
  border: '1px solid #555',
  borderRadius: '4px',
  background: '#333',
  color: '#ccc',
  cursor: 'pointer',
  fontSize: '12px',
};

export default function Controls() {
  const { state, pause, resume, step, reset, setSpeed } = useExecutionContext();

  const isPlaying = state === 'playing';
  const isPaused = state === 'paused';
  const isIdle = state === 'idle';
  const stepLabel = isPaused ? 'Next' : 'Step';

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else if (isPaused) {
      resume();
    }
  };

  return (
    <div style={containerStyle}>
      <div style={{ textAlign: 'center' }}>
        <span style={{ fontSize: '14px', color: '#888' }}>
          {isIdle && 'Idle'}
          {isPlaying && 'Playing...'}
          {isPaused && 'Paused'}
        </span>
      </div>

      <div style={buttonRowStyle}>
        <button
          onClick={handlePlayPause}
          disabled={isIdle}
          title={isPlaying ? 'Pause' : 'Play'}
          style={{
            ...baseButtonStyle,
            background: '#4caf50',
            opacity: isIdle ? 0.5 : 1,
            cursor: isIdle ? 'not-allowed' : 'pointer',
          }}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        <button
          onClick={step}
          disabled={isPlaying}
          title={stepLabel}
          style={{
            ...baseButtonStyle,
            background: '#2196f3',
            opacity: isPlaying ? 0.5 : 1,
            cursor: isPlaying ? 'not-allowed' : 'pointer',
          }}
        >
          {stepLabel}
        </button>

        <button
          onClick={reset}
          title="Reset"
          style={{
            ...baseButtonStyle,
            background: '#f44336',
          }}
        >
          Reset
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        <span style={{ fontSize: '12px', color: '#888' }}>Speed:</span>
        <button onClick={() => setSpeed(1000)} title="Slow (1000ms)" style={speedButtonStyle}>
          Slow
        </button>
        <button onClick={() => setSpeed(500)} title="Medium (500ms)" style={speedButtonStyle}>
          Medium
        </button>
        <button onClick={() => setSpeed(200)} title="Fast (200ms)" style={speedButtonStyle}>
          Fast
        </button>
      </div>
    </div>
  );
}
