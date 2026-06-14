import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import ComplexityDisplay from './ComplexityDisplay';

describe('ComplexityDisplay', () => {
  it('renders nothing when complexity is undefined', () => {
    const { container } = render(<ComplexityDisplay />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the time field', () => {
    render(<ComplexityDisplay complexity={{ time: 'O(n log n)', space: 'O(n)' }} />);
    expect(screen.getByText(/Time: O\(n log n\)/)).toBeInTheDocument();
  });

  it('renders the space field', () => {
    render(<ComplexityDisplay complexity={{ time: 'O(n)', space: 'O(n)' }} />);
    expect(screen.getByText(/Space: O\(n\)/)).toBeInTheDocument();
  });

  it('renders both fields with the separator', () => {
    render(<ComplexityDisplay complexity={{ time: 'O(log n)', space: 'O(1)' }} />);
    expect(screen.getByText('Time: O(log n) | Space: O(1)')).toBeInTheDocument();
  });
});
