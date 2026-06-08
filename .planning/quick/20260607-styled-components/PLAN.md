# Plan: Convert all styling to Styled Components

## Task
Convert all inline `<style>` JSX blocks and plain CSS in components to Styled Components.

## Scope
- Identify all components with inline `<style>` tags
- Convert each to styled-components syntax
- Remove the inline `<style>` blocks

## Files to modify
- src/components/Input/OperationInput.tsx
- src/components/Controls/Controls.tsx
- Any other component files with inline styles

## Acceptance Criteria
- [ ] All components use styled-components for styling
- [ ] No inline `<style>` blocks remain
- [ ] App renders identically to before
