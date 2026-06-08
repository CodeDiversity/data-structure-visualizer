import { CSSProperties, ReactNode, createElement, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodePanelProps {
  code: string;
  currentLine: number | null;
  language: 'javascript' | 'typescript';
  variableValues?: Record<string, string>;
}

const hoverStyle = {
  textDecoration: 'underline dotted rgba(255, 255, 255, 0.55)',
  textUnderlineOffset: '3px',
  cursor: 'help',
};

interface HastNode {
  type?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastChild[];
  value?: string;
}

type HastChild = HastNode | string;

export default function CodePanel({
  code,
  currentLine,
  language,
  variableValues = {},
}: CodePanelProps) {
  const variableNames = Object.keys(variableValues).sort((left, right) => right.length - left.length);

  return (
    <div
      style={{
        backgroundColor: '#1e1e1e',
        padding: '16px',
        borderRadius: '8px',
        fontFamily: 'Consolas, Monaco, "Courier New", monospace',
        fontSize: '14px',
        overflow: 'auto',
        maxHeight: '480px',
      }}
    >
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers
        wrapLines
        lineProps={(lineNumber) =>
          currentLine === lineNumber
            ? {
                style: {
                  display: 'block',
                  backgroundColor: '#444',
                  borderLeft: '3px solid #fff',
                },
              }
            : { style: { display: 'block' } }
        }
        customStyle={{
          backgroundColor: 'transparent',
          margin: 0,
          padding: 0,
        }}
        renderer={({ rows }) =>
          rows.map((row, index) => renderHastNode(row as HastNode, `${index}`, variableNames, variableValues))
        }
        lineNumberStyle={{
          minWidth: '2.5em',
          paddingRight: '1em',
          color: '#858585',
          userSelect: 'none',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

function renderHastNode(
  node: HastChild,
  key: string,
  variableNames: string[],
  variableValues: Record<string, string>
): ReactNode {
  if (typeof node === 'string') {
    return decorateText(node, variableNames, variableValues);
  }

  if (!node || typeof node !== 'object') {
    return null;
  }

  if (node.type === 'text') {
    return decorateText(node.value ?? '', variableNames, variableValues);
  }

  const tagName = node.tagName ?? 'span';
  const properties = normalizeProperties(node.properties);
  const children = (node.children ?? []).map((child, index) =>
    renderHastNode(child, `${key}-${index}`, variableNames, variableValues)
  );

  return createElement(tagName, { key, ...properties }, ...children);
}

function decorateText(
  text: string,
  variableNames: string[],
  variableValues: Record<string, string>
): ReactNode {
  if (variableNames.length === 0) {
    return text;
  }

  const parts: ReactNode[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    const match = findNextVariable(text, cursor, variableNames);

    if (!match) {
      parts.push(text.slice(cursor));
      break;
    }

    if (match.index > cursor) {
      parts.push(text.slice(cursor, match.index));
    }

    parts.push(
      <VariableToken
        key={`${match.name}-${match.index}`}
        name={match.name}
        value={variableValues[match.name]}
      />
    );

    cursor = match.index + match.name.length;
  }

  return parts;
}

function findNextVariable(text: string, start: number, variableNames: string[]) {
  let bestMatch: { index: number; name: string } | null = null;

  for (const name of variableNames) {
    const index = text.indexOf(name, start);
    if (index === -1 || !isIdentifierBoundary(text, index, name.length)) {
      continue;
    }

    if (bestMatch === null || index < bestMatch.index) {
      bestMatch = { index, name };
    }
  }

  return bestMatch;
}

function isIdentifierBoundary(text: string, index: number, length: number) {
  const before = index === 0 ? '' : text[index - 1];
  const after = index + length >= text.length ? '' : text[index + length];
  const identifierPattern = /[A-Za-z0-9_$]/;

  return !identifierPattern.test(before) && !identifierPattern.test(after);
}

function normalizeProperties(properties?: Record<string, unknown>) {
  if (!properties) {
    return undefined;
  }

  const normalized: Record<string, unknown> = { ...properties };
  if (properties.className) {
    normalized.className = Array.isArray(properties.className)
      ? properties.className.join(' ')
      : properties.className;
  }

  if (properties.style && typeof properties.style === 'object') {
    normalized.style = properties.style as CSSProperties;
  }

  return normalized;
}

interface VariableTokenProps {
  name: string;
  value?: string;
}

function VariableToken({ name, value }: VariableTokenProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      style={{
        ...hoverStyle,
        position: 'relative',
      }}
    >
      {name}
      {isOpen && (
        <span
          style={{
            position: 'absolute',
            left: 0,
            top: 'calc(100% + 8px)',
            zIndex: 20,
            padding: '6px 10px',
            borderRadius: '8px',
            background: '#0f172a',
            color: '#f8fafc',
            fontSize: '12px',
            lineHeight: 1.4,
            whiteSpace: 'nowrap',
            boxShadow: '0 12px 24px rgba(15, 23, 42, 0.35)',
            border: '1px solid rgba(148, 163, 184, 0.35)',
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              position: 'absolute',
              left: '12px',
              top: '-5px',
              width: '10px',
              height: '10px',
              background: '#0f172a',
              borderLeft: '1px solid rgba(148, 163, 184, 0.35)',
              borderTop: '1px solid rgba(148, 163, 184, 0.35)',
              transform: 'rotate(45deg)',
            }}
          />
          {name} = {value ?? 'unavailable'}
        </span>
      )}
    </span>
  );
}
