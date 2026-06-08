import { CSSProperties } from 'react';
import { useExecutionContext } from '../../state/ExecutionContext';
import { useTheme } from '../../state/ThemeContext';

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

const speedButtonStyle = (isDark: boolean): CSSProperties => ({
  padding: '4px 12px',
  border: `1px solid ${isDark ? '#555' : 'var(--border)'}`,
  borderRadius: '4px',
  background: isDark ? '#333' : 'var(--bg-panel)',
  color: isDark ? '#ccc' : 'var(--text-secondary)',
  cursor: 'pointer',
  fontSize: '12px',
});

export default function Controls() {
  const { state, pause, resume, step, reset, setSpeed } = useExecutionContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const isPlaying = state === 'playing';
  const isPaused = state === 'paused';
  const isIdle = state === 'idle';
  const stepLabel = isPaused ? 'Next' : 'Step';

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '16px',
    background: isDark ? '#2a2a2a' : 'var(--bg-panel)',
    borderRadius: '8px',
    border: `1px solid ${isDark ? 'var(--border)' : 'var(--border)'}`,
  };

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
        <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
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
            background: 'var(--highlight-green)',
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
            background: 'var(--accent)',
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
            background: 'var(--highlight-orange)',
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
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Speed:</span>
        <button onClick={() => setSpeed(1000)} title="Slow (1000ms)" style={speedButtonStyle(isDark)}>
          Slow
        </button>
        <button onClick={() => setSpeed(500)} title="Medium (500ms)" style={speedButtonStyle(isDark)}>
          Medium
        </button>
        <button onClick={() => setSpeed(200)} title="Fast (200ms)" style={speedButtonStyle(isDark)}>
          Fast
        </button>
      </div>
    </div>
  );
}
