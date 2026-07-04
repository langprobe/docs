import Link from 'next/link';
import { Aurora } from '@/components/brand/aurora';
import { NavPill } from '@/components/brand/nav-pill';
import { Footer } from '@/components/brand/footer';

/**
 * Docs landing page — hero ported from the marketing design reference
 * (.superpowers/sdd/design-reference.html, the "philadelphia"/"missoula"
 * hero, lines ~179-220) but scoped to a focused docs landing rather than
 * the full marketing page: nav + aurora backdrop + hero + a compact
 * "what's inside" row + footer. Primary CTA points into the docs instead
 * of a generic marketing CTA.
 *
 * Nav: this page renders <NavPill/> directly, and app/(home)/layout.tsx
 * disables the Fumadocs HomeLayout's own nav (`nav.enabled: false`) so the
 * two don't stack — see the comment there for why.
 */
export default function HomePage() {
  return (
    <div className="relative flex flex-col flex-1">
      <Aurora />
      <NavPill />

      <main className="relative flex-1">
        {/* ============ HERO ============ */}
        <div style={{ padding: '100px 24px 0', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 9,
              border: '1px solid rgba(4,133,247,0.25)',
              background: 'rgba(4,133,247,0.06)',
              borderRadius: 999,
              padding: '6px 16px 6px 8px',
            }}
          >
            <span
              aria-hidden
              style={{
                width: 7,
                height: 7,
                borderRadius: 999,
                background: 'var(--accent)',
                boxShadow: '0 0 8px rgba(4,133,247,0.8)',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--link)',
              }}
            >
              span-level replay is live &middot; apache-2.0 &middot; open source
            </span>
          </div>

          <h1
            style={{
              margin: '34px auto 0',
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(44px, 8vw, 94px)',
              lineHeight: 0.99,
              fontWeight: 800,
              letterSpacing: '-0.045em',
              maxWidth: 940,
              textWrap: 'balance',
            }}
          >
            the real debugger
            <br />
            <span
              style={{
                color: 'transparent',
                backgroundImage:
                  'linear-gradient(100deg, #0A66C2 0%, #0485F7 50%, #55A9F9 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
              }}
            >
              for agents
            </span>
          </h1>

          <p
            style={{
              margin: '28px auto 0',
              fontFamily: 'var(--font-sans)',
              fontSize: 19,
              lineHeight: 1.6,
              color: 'var(--text-2)',
              maxWidth: 560,
              textWrap: 'pretty',
            }}
          >
            trace, replay, eval &mdash; every signal in one place.
            <br />
            open a broken run, edit it, re-run it, and diff what changed.
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 14,
              marginTop: 40,
            }}
          >
            <Link
              href="/docs/getting-started/quickstart"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                fontFamily: 'var(--font-sans)',
                fontSize: 15,
                fontWeight: 700,
                color: '#fff',
                textDecoration: 'none',
                padding: '14px 30px',
                borderRadius: 999,
                background: 'var(--accent)',
                boxShadow: '0 10px 28px -6px rgba(4,133,247,0.5)',
              }}
            >
              get started
            </Link>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: 'var(--font-mono)',
                fontSize: 13.5,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                borderRadius: 999,
                padding: '13px 22px',
                boxShadow: '0 4px 14px -4px rgba(10,10,10,0.1)',
              }}
            >
              <span style={{ color: 'var(--text-4)' }}>$</span>
              <span>docker compose up -d</span>
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <Link
              href="/docs"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 13.5,
                fontWeight: 600,
                color: 'var(--link)',
                textDecoration: 'none',
              }}
            >
              or browse the docs &rarr;
            </Link>
          </div>
        </div>

        {/* ============ WHAT'S INSIDE ============ */}
        <div
          style={{
            maxWidth: 1160,
            margin: '130px auto 0',
            padding: '0 24px',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-3)',
              textAlign: 'center',
              marginBottom: 24,
            }}
          >
            what&rsquo;s inside
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-4)',
              background: 'var(--surface)',
              overflow: 'hidden',
            }}
          >
            <WhatsInsideItem
              label="replay"
              body="edit a prompt, model, or tool config; re-run against a real model; diff span by span with a determinism verdict."
            />
            <WhatsInsideItem
              label="agent-first / mcp"
              body="token-budgeted, LLM-legible run views over REST and MCP, so an agent can debug an agent."
            />
            <WhatsInsideItem
              label="eval-rigor"
              body="schema adherence, test-retest stability, inter-judge agreement — before you trust a score."
            />
            <WhatsInsideItem
              label="self-host"
              body="postgres + clickhouse + redis, one compose file. your vpc, your data, apache-2.0."
              last
            />
          </div>
        </div>

        {/* ============ NO PROPRIETARY SDK ============ */}
        <div
          style={{
            maxWidth: 760,
            margin: '96px auto 0',
            padding: '0 24px',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 14,
              color: 'var(--text-3)',
              lineHeight: 1.6,
            }}
          >
            no proprietary sdk &mdash; plain{' '}
            <code
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                background: 'var(--surface-3)',
                borderRadius: 'var(--r-1)',
                padding: '1px 6px',
              }}
            >
              otlp/http
            </code>{' '}
            at{' '}
            <code
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                background: 'var(--surface-3)',
                borderRadius: 'var(--r-1)',
                padding: '1px 6px',
              }}
            >
              /v1/traces
            </code>{' '}
            from the frameworks you already use.
          </p>
        </div>

        <div style={{ marginTop: 130 }} />
      </main>

      <Footer />
    </div>
  );
}

function WhatsInsideItem({
  label,
  body,
  last,
}: {
  label: string;
  body: string;
  last?: boolean;
}) {
  return (
    <div
      style={{
        padding: '24px 22px',
        borderRight: last ? 'none' : '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 13,
          fontWeight: 700,
          color: 'var(--link)',
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <p
        style={{
          margin: 0,
          fontFamily: 'var(--font-sans)',
          fontSize: 13.5,
          lineHeight: 1.55,
          color: 'var(--text-2)',
        }}
      >
        {body}
      </p>
    </div>
  );
}
