import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodePanelProps {
  code: string;
  currentLine: number | null;
  language: 'javascript' | 'typescript';
}

export default function CodePanel({ code, currentLine, language }: CodePanelProps) {
  const highlightLines = currentLine
    ? { [currentLine]: { backgroundColor: '#444', borderLeft: '3px solid #fff' } }
    : {};

  return (
    <div
      style={{
        backgroundColor: '#1e1e1e',
        padding: '16px',
        borderRadius: '8px',
        fontFamily: 'Consolas, Monaco, "Courier New", monospace',
        fontSize: '14px',
        overflow: 'auto',
        maxHeight: '400px',
      }}
    >
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers
        highlightLines={highlightLines}
        customStyle={{
          backgroundColor: 'transparent',
          margin: 0,
          padding: 0,
        }}
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
