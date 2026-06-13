import { CSSProperties, ReactNode, createElement, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../../state/ThemeContext';

interface CodePanelProps {
  code: string;
  currentLine: number | null;
  language: 'javascript' | 'typescript';
  variableValues?: Record<string, string>;
}

const hoverStyleDark = {
  textDecoration: 'underline dotted rgba(255, 255, 255, 0.55)',
  textUnderlineOffset: '3px',
  cursor: 'help',
};

const hoverStyleLight = {
  textDecoration: 'underline dotted rgba(0, 0, 0, 0.4)',
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
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const variableNames = Object.keys(variableValues).sort((left, right) => right.length - left.length);

  return (
    <div
      style={{
        backgroundColor: isDark ? '#1e1e1e' : '#282c34',
        padding: '16px',
        borderRadius: '8px',
        fontFamily: 'Consolas, Monaco, "Courier New", monospace',
        fontSize: '14px',
        overflow: 'auto',
        maxHeight: '480px',
        border: `1px solid ${isDark ? 'var(--border)' : 'var(--border)'}`,
      }}
    >
      <SyntaxHighlighter
        language={language}
        style={isDark ? vscDarkPlus : {
  'code[class*="language-"]': { color: '#1a1a1a', background: 'none' },
  'pre[class*="language-"]': { color: '#1a1a1a', background: '#f5f5f5' },
  'comment': { color: '#708090' },
  'prolog': { color: '#708090' },
  'doctype': { color: '#708090' },
  'cdata': { color: '#708090' },
  'punctuation': { color: '#333' },
  'property': { color: '#905' },
  'tag': { color: '#905' },
  'boolean': { color: '#905' },
  'number': { color: '#07a' },
  'constant': { color: '#905' },
  'symbol': { color: '#905' },
  'deleted': { color: '#905' },
  'selector': { color: '#690' },
  'attr-name': { color: '#690' },
  'string': { color: '#07a' },
  'char': { color: '#07a' },
  'builtin': { color: '#07a' },
  'inserted': { color: '#07a' },
  'operator': { color: '#333' },
  'entity': { color: '#900' },
  'url': { color: '#07a' },
  'variable': { color: '#036' },
  'atrule': { color: '#07a' },
  'attr-value': { color: '#07a' },
  'function': { color: '#00f' },
  'keyword': { color: '#07a' },
  'regex': { color: '#e90' },
  'important': { color: '#e90', fontWeight: 'bold' },
  'bold': { fontWeight: 'bold' },
  'italic': { fontStyle: 'italic' },
}}
        showLineNumbers
        wrapLines
        lineProps={(lineNumber) =>
          currentLine === lineNumber
            ? {
                style: {
                  display: 'block',
                  backgroundColor: isDark ? '#444' : '#e8e8e8',
                  borderLeft: `3px solid ${isDark ? '#fff' : '#333'}`,
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
          rows.map((row, index) => renderHastNode(row as HastNode, `${index}`, variableNames, variableValues, isDark))
        }
        lineNumberStyle={{
          minWidth: '2.5em',
          paddingRight: '1em',
          color: isDark ? '#858585' : '#666',
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
  variableValues: Record<string, string>,
  isDark: boolean
): ReactNode {
  if (typeof node === 'string') {
    return decorateText(node, variableNames, variableValues, isDark);
  }

  if (!node || typeof node !== 'object') {
    return null;
  }

  if (node.type === 'text') {
    return decorateText(node.value ?? '', variableNames, variableValues, isDark);
  }

  const tagName = node.tagName ?? 'span';
  const properties = normalizeProperties(node.properties);
  const children = (node.children ?? []).map((child, index) =>
    renderHastNode(child, `${key}-${index}`, variableNames, variableValues, isDark)
  );

  return createElement(tagName, { key, ...properties }, ...children);
}

function decorateText(
  text: string,
  variableNames: string[],
  variableValues: Record<string, string>,
  isDark: boolean
): ReactNode {
  if (variableNames.length === 0) {
    return text;
  }

  const parts: ReactNode[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    const arrayAccessMatch = findNextArrayAccess(text, cursor, variableNames, variableValues);
    const variableMatch = findNextVariable(text, cursor, variableNames);

    const nextVariableIndex = variableMatch?.index ?? Infinity;
    const nextArrayIndex = arrayAccessMatch?.index ?? Infinity;

    if (arrayAccessMatch && nextArrayIndex < nextVariableIndex) {
      if (arrayAccessMatch.index > cursor) {
        parts.push(text.slice(cursor, arrayAccessMatch.index));
      }

      parts.push(
        <VariableToken
          key={`array-${arrayAccessMatch.index}`}
          name={arrayAccessMatch.name}
          value={variableValues[arrayAccessMatch.name]}
          isDark={isDark}
        />
      );

      cursor = arrayAccessMatch.endIndex;
      continue;
    }

    if (!variableMatch) {
      parts.push(text.slice(cursor));
      break;
    }

    if (variableMatch.index > cursor) {
      parts.push(text.slice(cursor, variableMatch.index));
    }

    parts.push(
      <VariableToken
        key={`${variableMatch.name}-${variableMatch.index}`}
        name={variableMatch.name}
        value={variableValues[variableMatch.name]}
        isDark={isDark}
      />
    );

    cursor = variableMatch.index + variableMatch.name.length;
  }

  return parts;
}

function findNextArrayAccess(
  text: string,
  start: number,
  variableNames: string[],
  variableValues: Record<string, string>
): { index: number; endIndex: number; name: string } | null {
  const arrayAccessPattern = /([A-Za-z_$][A-Za-z0-9_$]*)\[([A-Za-z_$][A-Za-z0-9_$]*)\]/g;

  let match;
  while ((match = arrayAccessPattern.exec(text)) !== null) {
    if (match.index < start) continue;

    const arrayName = match[1];
    const indexName = match[2];

    if (variableNames.includes(arrayName) && variableNames.includes(indexName)) {
      const fullName = `${arrayName}[${indexName}]`;
      if (fullName in variableValues) {
        return { index: match.index, endIndex: match.index + match[0].length, name: fullName };
      }
    }
  }

  return null;
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
  isDark: boolean;
}

function VariableToken({ name, value, isDark }: VariableTokenProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hoverStyle = isDark ? hoverStyleDark : hoverStyleLight;

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
            background: isDark ? '#0f172a' : '#fff',
            color: isDark ? '#f8fafc' : '#111',
            fontSize: '12px',
            lineHeight: 1.4,
            whiteSpace: 'nowrap',
            boxShadow: isDark ? '0 12px 24px rgba(15, 23, 42, 0.35)' : '0 12px 24px rgba(0, 0, 0, 0.15)',
            border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.35)' : '#e5e7eb'}`,
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
              background: isDark ? '#0f172a' : '#fff',
              borderLeft: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.35)' : '#e5e7eb'}`,
              borderTop: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.35)' : '#e5e7eb'}`,
              transform: 'rotate(45deg)',
            }}
          />
          {name} = {value ?? 'unavailable'}
        </span>
      )}
    </span>
  );
}
