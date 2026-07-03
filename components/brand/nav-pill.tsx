import Link from 'next/link';
import { GitBranch } from 'lucide-react';
import { gitConfig } from '@/lib/shared';

/**
 * NavPill — sticky, rounded "pill" nav for the marketing landing page.
 *
 * Ported from the philadelphia landing mock. This is a standalone component
 * for the landing only — it does not replace the Fumadocs docs nav/sidebar,
 * which stays wired through lib/layout.shared.tsx + DocsLayout.
 */
export function NavPill() {
  const githubUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

  return (
    <div
      style={{
        position: 'sticky',
        top: 16,
        zIndex: 50,
        display: 'flex',
        justifyContent: 'center',
        padding: '0 16px',
      }}
    >
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          width: '100%',
          maxWidth: 720,
          height: 52,
          padding: '0 8px 0 16px',
          borderRadius: 999,
          border: '1px solid var(--border)',
          background: 'var(--surface)',
          boxShadow:
            '0 4px 16px -2px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginRight: 8,
            color: 'var(--text)',
            textDecoration: 'none',
          }}
        >
          <span
            aria-hidden
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 22,
              height: 22,
              borderRadius: 6,
              background: 'var(--accent)',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: '#fff',
              }}
            />
          </span>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontWeight: 800,
              fontSize: 15,
              letterSpacing: '-0.01em',
            }}
          >
            langprobe
          </span>
        </Link>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            flex: 1,
          }}
        >
          <NavPillLink href="/docs">Docs</NavPillLink>
          <NavPillLink href="/docs/api">API</NavPillLink>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: 999,
              color: 'var(--text-2)',
            }}
          >
            <GitBranch size={18} strokeWidth={1.5} />
          </a>
          <Link
            href="/docs"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              height: 36,
              padding: '0 16px',
              borderRadius: 999,
              background: 'var(--accent)',
              color: '#fff',
              fontFamily: 'var(--font-sans)',
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Get started
          </Link>
        </div>
      </nav>
    </div>
  );
}

function NavPillLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 36,
        padding: '0 12px',
        borderRadius: 999,
        color: 'var(--text-2)',
        fontFamily: 'var(--font-sans)',
        fontSize: 13,
        fontWeight: 600,
        textDecoration: 'none',
      }}
    >
      {children}
    </Link>
  );
}
