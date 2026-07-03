import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { gitConfig } from './shared';

/**
 * Shared Fumadocs layout config for both the landing (HomeLayout) and the
 * docs shell (DocsLayout). This only *brands* the standard Fumadocs chrome
 * (logo/title/links) — it does not replace Fumadocs' own nav/sidebar
 * components. The standalone <NavPill/>/<Aurora/>/<Footer/> in
 * components/brand are for the marketing landing page only.
 */
export function baseOptions(): BaseLayoutProps {
  const githubUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

  return {
    nav: {
      // JSX supported
      title: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
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
        </span>
      ),
    },
    links: [
      { text: 'Docs', url: '/docs' },
      { text: 'API', url: '/docs/api' },
      { text: 'GitHub', url: githubUrl, external: true },
    ],
    githubUrl,
  };
}
