'use client';

import { useState } from 'react';
import { injectVars } from '@/lib/playground-vars';
import { usePlaygroundVars } from '@/lib/playground-context';

export function Curl({ children }: { children: string }) {
  const { vars } = usePlaygroundVars();
  const [copied, setCopied] = useState(false);
  const cmd = injectVars(String(children).trim(), vars);

  const copy = async () => {
    await navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div
      style={{
        position: 'relative',
        background: 'var(--surface-3)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-3)',
        padding: '14px 16px',
        fontFamily: 'var(--font-mono)',
        fontSize: 12.5,
        overflowX: 'auto',
      }}
    >
      <button
        onClick={copy}
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          fontFamily: 'var(--font-sans)',
          fontSize: 11,
          fontWeight: 700,
          color: 'var(--link)',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {copied ? 'copied' : 'copy'}
      </button>
      <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{cmd}</pre>
    </div>
  );
}
