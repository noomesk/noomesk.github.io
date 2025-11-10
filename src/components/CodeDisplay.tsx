// src/components/CodeDisplay.tsx

import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface CodeDisplayProps {
  code: string;
  language?: string;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ code, language = 'jsx' }) => {
  return (
    <div className="rounded-lg overflow-hidden my-4">
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: '0.5rem',
          fontSize: '14px',
          lineHeight: '1.5',
        }}
        showLineNumbers={true}
        wrapLines={true}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeDisplay;