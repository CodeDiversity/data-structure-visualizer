import { useExecutionContext } from '../../state/ExecutionContext';

/**
 * Narration panel — renders the current step's plain-language description
 * as prose under the code panel. Returns nothing when no description is
 * available so it never occludes the visualization or leaves an empty box.
 */
export default function Narration() {
  const { currentStep } = useExecutionContext();
  const description = currentStep?.description?.trim();

  if (!description) {
    return null;
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-code)',
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid var(--border)',
      }}
    >
      <h2
        style={{
          fontSize: '16px',
          fontWeight: 600,
          color: 'var(--text-secondary)',
          margin: '0 0 12px 0',
          textTransform: 'uppercase',
        }}
      >
        Narration
      </h2>
      <p
        style={{
          margin: 0,
          color: 'var(--text-primary)',
          fontSize: '14px',
          lineHeight: 1.5,
          fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        }}
      >
        {description}
      </p>
    </div>
  );
}
