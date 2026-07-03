/**
 * KindBadge — span-kind tag used in trace views (llm / tool / retr / chain).
 *
 * This is the ONLY place in the app the categorical --kind-* palette may
 * appear. Do not reuse these colors for buttons, rows, or any other chrome —
 * see DESIGN.md "Color rules" / "Anti-patterns".
 */
const KIND = {
  llm: { fg: '#B97306', bg: '#FBF3DF' },
  tool: { fg: '#0E7FB8', bg: '#E2F1FA' },
  retr: { fg: '#1F8A56', bg: '#E5F4EC' },
  chain: { fg: '#7A4FD9', bg: '#EFEAFB' },
} as const;

export type Kind = keyof typeof KIND;

export function KindBadge({ kind }: { kind: Kind }) {
  const c = KIND[kind];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        color: c.fg,
        background: c.bg,
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        fontWeight: 700,
        lineHeight: 1,
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
        borderRadius: 999,
        padding: '3px 8px',
      }}
    >
      {kind}
    </span>
  );
}
