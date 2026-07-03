import Link from 'next/link';
import { gitConfig } from '@/lib/shared';

/**
 * Footer — marketing landing footer, ported from the philadelphia mock.
 * Token-based (no raw hexes), no gradients, radius within scale.
 */
export function Footer() {
  const githubUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        background: 'var(--bg)',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '48px 24px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: 32,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 32,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 280 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
                  color: 'var(--text)',
                }}
              >
                langprobe
              </span>
            </div>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 13,
                lineHeight: 1.55,
                color: 'var(--text-3)',
                margin: 0,
              }}
            >
              The real debugger for agents. Self-hosted LLM observability,
              eval-rigor, and agent-replay.
            </p>
          </div>

          <FooterColumn
            title="Product"
            links={[
              { label: 'Docs', href: '/docs' },
              { label: 'API reference', href: '/docs/api' },
            ]}
          />
          <FooterColumn
            title="Community"
            links={[{ label: 'GitHub', href: githubUrl, external: true }]}
          />
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            paddingTop: 24,
            borderTop: '1px solid var(--border)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 12,
              color: 'var(--text-3)',
            }}
          >
            &copy; {new Date().getFullYear()} langprobe. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <span
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 12,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
          color: 'var(--text-3)',
        }}
      >
        {title}
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {links.map((link) =>
          link.external ? (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer noopener"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 13,
                color: 'var(--text-2)',
                textDecoration: 'none',
              }}
            >
              {link.label}
            </a>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 13,
                color: 'var(--text-2)',
                textDecoration: 'none',
              }}
            >
              {link.label}
            </Link>
          ),
        )}
      </div>
    </div>
  );
}
