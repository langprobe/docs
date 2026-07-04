import Link from 'next/link';
import { gitConfig } from '@/lib/shared';
import { GithubIcon } from './github-icon';

/**
 * Footer — marketing landing footer, ported from the philadelphia mock
 * (missoula/index.html, lines ~406-419): logo + "langprobe · apache-2.0 ·
 * © year" on the left, a row of foot-links on the right. Token-based (no
 * raw hexes), no gradients, radius within scale.
 */
export function Footer() {
  const githubUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

  return (
    <footer style={{ position: 'relative' }}>
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '52px 24px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span
            aria-hidden
            style={{
              display: 'inline-flex',
              width: 18,
              height: 18,
              borderRadius: 6,
              background: 'var(--accent)',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontWeight: 800,
              fontSize: 14,
              color: 'var(--text)',
            }}
          >
            langprobe
          </span>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-3)' }}>
            &middot; apache-2.0 &middot; &copy; {new Date().getFullYear()}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <FootLink href={githubUrl} external>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <GithubIcon size={13} />
              GitHub
            </span>
          </FootLink>
          <FootLink href="/docs">Docs</FootLink>
          <FootLink href={`${githubUrl}/releases`} external>
            Changelog
          </FootLink>
          <FootLink href="/docs/getting-started/migrate-from-langsmith">LangSmith migration</FootLink>
        </div>
      </div>
    </footer>
  );
}

function FootLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  const style: React.CSSProperties = {
    fontFamily: 'var(--font-sans)',
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text-2)',
    textDecoration: 'none',
  };

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" style={style}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} style={style}>
      {children}
    </Link>
  );
}
