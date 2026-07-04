'use client';
// lib/playground-context.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { DEFAULT_HOST, type PlaygroundVars } from './playground-vars';

const KEY = 'langprobe-docs:vars';
const Ctx = createContext<{ vars: PlaygroundVars; setVars: (v: Partial<PlaygroundVars>) => void } | null>(null);

export function PlaygroundVarsProvider({ children }: { children: React.ReactNode }) {
  const [vars, setState] = useState<PlaygroundVars>({ host: DEFAULT_HOST, apiKey: '' });
  useEffect(() => {
    // One-time hydration from localStorage on mount (SSR has no localStorage,
    // so this can only run client-side after the initial render).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    try { const raw = localStorage.getItem(KEY); if (raw) setState({ host: DEFAULT_HOST, apiKey: '', ...JSON.parse(raw) }); } catch {}
  }, []);
  const setVars = (v: Partial<PlaygroundVars>) => setState(prev => {
    const next = { ...prev, ...v };
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
    return next;
  });
  return <Ctx.Provider value={{ vars, setVars }}>{children}</Ctx.Provider>;
}
export function usePlaygroundVars() {
  const c = useContext(Ctx);
  if (!c) throw new Error('usePlaygroundVars must be used within PlaygroundVarsProvider');
  return c;
}
