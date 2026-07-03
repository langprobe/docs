import Link from 'next/link';
import { gitConfig } from '@/lib/shared';
import { GithubIcon } from './github-icon';

/**
 * NavPill — sticky, rounded "pill" nav for the marketing landing page.
 *
 * Ported from the philadelphia landing mock (missoula/index.html, lines
 * ~47-67): sticky rounded-999px pill, translucent white + backdrop blur,
 * 1px hairline border, 22px accent logo square w/ 8px white inner dot, nav
 * links, a github pill button with a star count, and a primary CTA.
 *
 * Standalone component for the landing only — it does not replace the
 * Fumadocs docs nav/sidebar, which stays wired through lib/layout.shared.tsx
 * + DocsLayout.
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
        padding: '0 24px',
      }}
    >
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: '100%',
          maxWidth: 880,
          background: 'rgba(255,255,255,0.78)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(10,10,10,0.08)',
          borderRadius: 999,
          padding: '8px 8px 8px 18px',
          boxShadow: '0 12px 40px -12px rgba(10,10,10,0.16)',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
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
              borderRadius: 7,
              background: 'var(--accent)',
              boxShadow: '0 4px 12px rgba(4,133,247,0.4)',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 3,
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
            gap: 2,
            flex: 1,
          }}
        >
          <NavPillLink href="/docs">Docs</NavPillLink>
          <NavPillLink href="/docs/api">API</NavPillLink>
        </div>

        <a
          href={githubUrl}
          target="_blank"
          rel="noreferrer noopener"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--text)',
            textDecoration: 'none',
            padding: '8px 15px',
            borderRadius: 999,
            border: '1px solid var(--border)',
            background: 'var(--surface)',
          }}
        >
          <GithubIcon size={14} />
          <span>GitHub</span>
        </a>

        <Link
          href="/docs"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            fontWeight: 700,
            color: '#fff',
            textDecoration: 'none',
            padding: '9px 17px',
            borderRadius: 999,
            background: 'var(--accent)',
            boxShadow: '0 4px 14px rgba(4,133,247,0.38)',
            whiteSpace: 'nowrap',
          }}
        >
          Get started
        </Link>
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
        fontFamily: 'var(--font-sans)',
        fontSize: 13.5,
        fontWeight: 600,
        color: 'var(--text-2)',
        textDecoration: 'none',
        padding: '7px 13px',
        borderRadius: 999,
      }}
    >
      {children}
    </Link>
  );
}
