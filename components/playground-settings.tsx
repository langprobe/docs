'use client';

import { usePlaygroundVars } from '@/lib/playground-context';
import { API_KEY_PLACEHOLDER, DEFAULT_HOST } from '@/lib/playground-vars';

export function PlaygroundSettings() {
  const { vars, setVars } = usePlaygroundVars();

  return (
    <div
      className="flex flex-col gap-3 p-4"
      style={{
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-2)',
      }}
    >
      <div className="flex flex-col gap-1">
        <label
          htmlFor="playground-host"
          className="text-xs font-medium"
          style={{ color: 'var(--text-3)' }}
        >
          Host
        </label>
        <input
          id="playground-host"
          type="text"
          value={vars.host}
          onChange={(e) => setVars({ host: e.target.value })}
          placeholder={DEFAULT_HOST}
          className="px-2 py-1.5 text-sm outline-none"
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-2)',
          }}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="playground-api-key"
          className="text-xs font-medium"
          style={{ color: 'var(--text-3)' }}
        >
          API key
        </label>
        <input
          id="playground-api-key"
          type="password"
          value={vars.apiKey}
          onChange={(e) => setVars({ apiKey: e.target.value })}
          placeholder={API_KEY_PLACEHOLDER}
          className="px-2 py-1.5 text-sm outline-none"
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-2)',
          }}
        />
      </div>

      <p className="text-xs" style={{ color: 'var(--text-3)' }}>
        Stored only in your browser (localStorage).
      </p>
    </div>
  );
}
