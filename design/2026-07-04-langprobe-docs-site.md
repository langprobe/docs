# langprobe/docs Documentation Site — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Supabase/Stripe-grade documentation site for langprobe in a new public repo `langprobe/docs`, themed to the philadelphia/`DESIGN.md` brand, with a curl-first interactive playground and an OpenAPI-driven API reference.

**Architecture:** Fumadocs on Next.js (App Router) + Tailwind + MDX, statically exportable. Design tokens ported from `DESIGN.md` override the Fumadocs default theme. A client-side variable-injection layer (`localStorage` host + API key) feeds a `<Curl>` MDX component and the `fumadocs-openapi` reference panel, so every curl sample is copy-ready with the reader's values. The API reference is generated from a committed `openapi/openapi.json` merged from the two FastAPI services (`ingest-api`, `api`).

**Tech Stack:** Next.js (App Router), Fumadocs (`fumadocs-ui`, `fumadocs-mdx`, `fumadocs-openapi`), Tailwind CSS, TypeScript, pnpm, Node 20+. Testing: `vitest` (component/lib units) + `node --test` (Node scripts) + a link-check step. Deploy: Vercel-primary + `Dockerfile`/`nginx.conf` for self-host.

## Global Constraints

Copied verbatim from the spec — every task's requirements implicitly include these.

- **Repo:** new public repo `langprobe/docs`, built locally first in a fresh dir **outside** the `sarajevo` worktree (e.g. `~/conductor/repos/langprobe-docs`).
- **Remote gate:** do NOT create/push the GitHub remote until a real, building MVP exists AND the user gives explicit go-ahead right before `gh repo create langprobe/docs … --push`.
- **Design tokens (canonical = `DESIGN.md`):** `--bg #FCFCFC`, `--surface #FFFFFF`, `--surface-2 #F7F7F5`, `--surface-3 #F0F0EE`, `--border #ECECEA`, `--border-strong #DDDDDB`, `--text #0A0A0A`, `--text-2 #4B4B49`, `--text-3 #6C6C69`, `--text-4 #B4B4AE` (disabled only), `--accent #0485F7`, `--accent-hover #3592F9`, `--accent-soft #E0F0FE`, `--link #0A66C2`. Radius scale stops at `--r-4 12px` (round dots/avatars excepted). Landing-only treatments (hero canvas `#FDFDFC`, nav pill, 72px grid, aurora) follow the philadelphia file.
- **Fonts:** Plus Jakarta Sans (sans: chrome, headings, KPI numbers) + Geist Mono (mono: machine values only — ids, models, durations, costs, config, code). Load via `next/font/google`. No Inter, system-ui, Geist Sans, Space Grotesk, Fraunces, Berkeley Mono.
- **Color discipline:** no purple/green/amber in chrome; no gradients on the brand (philadelphia hero wordmark gradient is the single sanctioned exception, used sparingly). `--kind-*` categorical palette (llm amber, tool cyan, retr green, chain indigo) used ONLY in trace/span-kind badges.
- **No** skeleton shimmer (flat `--surface-3` rects), no glassmorphism except the existing philadelphia nav pill / floating cards, no `data-theme="dark"` default (light-mode only).
- **Playground:** curl-first, **no live execution** in MVP. Default host `https://app.langprobe.com` (reader-overridable). Host + API key stored in `localStorage`; injected into every curl block site-wide. Built so per-endpoint live "Run" can be added later without re-architecting.
- **Static export:** must build with `output: export` and emit static files cleanly.
- **Content sources (no invented API behavior):** platform repo `langprobe/langprobe` (`README.md`, `docs/getting-started.md`, `PRODUCT.md`, `RESEARCH.md`, `llms.txt`, `DESIGN.md`, `.claude/skills/langprobe/**`) and SDK repo `langprobe/sdk-python` (worktree `~/conductor/workspaces/sdk-python/cancun`, branch `feat/b1-init-otel`).
- **Two services / ports:** `ingest-api` `http://localhost:7080` (`POST /v1/traces`, `POST /v1/runs`), `api` `http://localhost:7081` (all `/v1` CRUD routers). API-key format `lt_<public_id>.<secret>`; auth `Authorization: Bearer <key>` or `X-Api-Key: <key>`.
- **Commits:** frequent, one per task minimum; sign off with `-s` (DCO) and end messages with `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.

---

## File Structure

```
langprobe-docs/
  package.json, pnpm-lock.yaml, tsconfig.json, next.config.mjs
  source.config.ts              # fumadocs-mdx + fumadocs-openapi source config
  tailwind.config.ts            # philadelphia/DESIGN.md tokens
  postcss.config.mjs
  vitest.config.ts
  app/
    layout.tsx                  # root: fonts, PlaygroundVarsProvider, globals
    layout.config.tsx           # Fumadocs shared layout options (nav, logo)
    global.css                  # token CSS vars + Fumadocs theme overrides
    (home)/page.tsx             # landing (philadelphia-styled intro)
    docs/
      layout.tsx                # DocsLayout (sidebar)
      [[...slug]]/page.tsx      # MDX + APIPage renderer
    api/search/route.ts         # (or static) Fumadocs search
  lib/
    source.ts                   # loader() over content/docs
    openapi.ts                  # createOpenAPI() instance
    playground-vars.ts          # PURE injectVars() + defaults  [TESTED]
    playground-context.tsx      # React context + localStorage persistence
  components/
    curl.tsx                    # <Curl> MDX block (injection + copy)
    playground-settings.tsx     # host + apiKey settings bar
    brand/
      nav-pill.tsx, aurora.tsx, kind-badge.tsx, footer.tsx
  mdx-components.tsx            # register <Curl>, <KindBadge>, APIPage
  content/docs/
    index.mdx                   # Introduction
    meta.json                   # top-level sidebar order
    getting-started/(*.mdx + meta.json)
    guides/(*.mdx + meta.json)
    sdk-python/(*.mdx + meta.json)
    api/                        # GENERATED by fumadocs-openapi + hand pages
  openapi/
    openapi.json                # committed merged schema  [SEED or GENERATED]
  scripts/
    lib/merge-openapi.mjs       # PURE mergeOpenAPI()/tagByResource()  [TESTED]
    lib/merge-openapi.test.mjs
    gen-openapi.mjs             # fetch two schemas → merge → write openapi.json
    generate-api-docs.mjs       # fumadocs-openapi generateFiles()
    check-links.mjs             # internal-link checker  [TESTED helper]
  Dockerfile, nginx.conf, .dockerignore
  README.md, .gitignore, .github/workflows/ci.yml (optional, scope-gated)
```

---

## Task 1: Scaffold the Fumadocs app + first green build

**Files:**
- Create: entire `create-fumadocs-app` scaffold in `~/conductor/repos/langprobe-docs`
- Create: `.gitignore` (node_modules, `.next`, `out`, `.source`)

**Interfaces:**
- Produces: a buildable Next.js/Fumadocs app with `pnpm dev`, `pnpm build`; the canonical Fumadocs paths (`app/`, `content/docs/`, `source.config.ts`, `lib/source.ts`, `mdx-components.tsx`). Later tasks reconcile against whatever the generator emits.

- [ ] **Step 1: Create the dir and scaffold**

```bash
mkdir -p ~/conductor/repos && cd ~/conductor/repos
pnpm create fumadocs-app langprobe-docs --template content --pm pnpm
# When prompted: TypeScript, Tailwind, MDX source. If flags differ by version,
# accept: Next.js App Router + Fumadocs MDX + Tailwind.
cd langprobe-docs
```

- [ ] **Step 2: Install and run the dev server once**

```bash
pnpm install
pnpm dev  # open http://localhost:3000, confirm the default docs render, then Ctrl-C
```

- [ ] **Step 3: Production build must pass**

Run: `pnpm build`
Expected: build completes with no errors; `.next/` produced.

- [ ] **Step 4: Init git and commit the scaffold**

```bash
git init
git add -A
git commit -s -m "chore: scaffold Fumadocs docs app

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 5: Pin versions**

Record the installed versions of `next`, `fumadocs-ui`, `fumadocs-mdx`, `fumadocs-core` in `README.md` under a "Toolchain" note so later fumadocs-openapi wiring targets the right API. Commit.

```bash
git add README.md && git commit -s -m "docs: record pinned toolchain versions

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Static export + Docker/nginx self-host parity

**Files:**
- Modify: `next.config.mjs` (add `output: 'export'`, `images.unoptimized: true`)
- Create: `Dockerfile`, `nginx.conf`, `.dockerignore`

**Interfaces:**
- Produces: `pnpm build` emits a static `out/` directory; a container image that serves `out/` on port 80.

- [ ] **Step 1: Configure static export**

In `next.config.mjs`, merge the Fumadocs config with:

```js
const config = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
};
```

Keep the existing `withMDX`/fumadocs wrapper. If Fumadocs' default search route (`app/api/search/route.ts`) blocks export, switch to Fumadocs **static search** (`createFromSource` with `static: true`) per the pinned-version docs.

- [ ] **Step 2: Build and verify static output**

Run: `pnpm build`
Expected: build succeeds and `out/index.html` exists.
Verify: `test -f out/index.html && echo OK`

- [ ] **Step 3: Add the Dockerfile**

```dockerfile
# Build the static site, serve with nginx (parity with langprobe/website).
FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/out /usr/share/nginx/html
EXPOSE 80
```

- [ ] **Step 4: Add nginx.conf**

```nginx
server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;
  location / {
    try_files $uri $uri/ $uri.html /index.html;
  }
}
```

- [ ] **Step 5: Add .dockerignore**

```
node_modules
.next
out
.git
```

- [ ] **Step 6: Commit**

```bash
git add next.config.mjs Dockerfile nginx.conf .dockerignore
git commit -s -m "build: static export + Docker/nginx self-host

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Design tokens + fonts (philadelphia/DESIGN.md theme)

**Files:**
- Modify: `app/global.css` (token CSS vars + Fumadocs theme overrides)
- Modify: `tailwind.config.ts` (map tokens to Tailwind theme)
- Modify: `app/layout.tsx` (load Plus Jakarta Sans + Geist Mono via `next/font/google`)

**Interfaces:**
- Produces: CSS custom properties `--bg, --surface, --surface-2, --surface-3, --border, --border-strong, --text, --text-2, --text-3, --text-4, --accent, --accent-hover, --accent-soft, --link` and Tailwind color aliases `bg, surface, accent, link, …`; font CSS vars `--font-sans`, `--font-mono`.

- [ ] **Step 1: Load fonts in the root layout**

In `app/layout.tsx`:

```tsx
import { Plus_Jakarta_Sans, Geist_Mono } from 'next/font/google';

const sans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-sans', weight: ['400','500','600','700','800'] });
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['400','500','600'] });

// on <html>: className={`${sans.variable} ${mono.variable}`}
```

- [ ] **Step 2: Map Fumadocs theme vars to our tokens in `app/global.css`**

Fumadocs exposes theme CSS vars (HSL). Override them plus add our raw tokens:

```css
:root {
  --bg:#FCFCFC; --surface:#FFFFFF; --surface-2:#F7F7F5; --surface-3:#F0F0EE;
  --border:#ECECEA; --border-strong:#DDDDDB;
  --text:#0A0A0A; --text-2:#4B4B49; --text-3:#6C6C69; --text-4:#B4B4AE;
  --accent:#0485F7; --accent-hover:#3592F9; --accent-soft:#E0F0FE; --link:#0A66C2;
  --radius: 8px; /* --r-3 default; never exceed 12px */
}
/* Fumadocs UI variable bridge (names per pinned fumadocs-ui version): */
:root {
  --color-fd-background: var(--bg);
  --color-fd-foreground: var(--text);
  --color-fd-muted: var(--surface-2);
  --color-fd-muted-foreground: var(--text-3);
  --color-fd-border: var(--border);
  --color-fd-primary: var(--accent);
  --color-fd-card: var(--surface);
}
body { font-family: var(--font-sans); background: var(--bg); color: var(--text); letter-spacing:-0.005em; }
code, kbd, pre, .font-mono { font-family: var(--font-mono); }
a { color: var(--link); }
::selection { background:#D5EAFD; }
```

Reconcile the exact `--color-fd-*` names with the installed fumadocs-ui theme CSS (grep `node_modules/fumadocs-ui` for `--color-fd-`).

- [ ] **Step 3: Extend Tailwind theme**

In `tailwind.config.ts`, add `theme.extend.colors` aliases (`bg`, `surface`, `surface2`, `surface3`, `border`, `text`, `text2`, `text3`, `accent`, `link`) referencing the CSS vars, `fontFamily.sans = ['var(--font-sans)']`, `fontFamily.mono = ['var(--font-mono)']`, and `borderRadius` capped at `12px`.

- [ ] **Step 4: Visual check + build**

```bash
pnpm dev  # confirm bg is warm-white, links are #0A66C2, headings are Plus Jakarta Sans, code is Geist Mono
pnpm build && test -f out/index.html && echo OK
```

- [ ] **Step 5: Commit**

```bash
git add app/global.css tailwind.config.ts app/layout.tsx
git commit -s -m "style: port DESIGN.md tokens + Plus Jakarta Sans/Geist Mono

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Brand chrome — nav pill, aurora, footer, kind badge

**Files:**
- Create: `components/brand/nav-pill.tsx`, `components/brand/aurora.tsx`, `components/brand/footer.tsx`, `components/brand/kind-badge.tsx`
- Modify: `app/layout.config.tsx` (logo mark + site title + nav links)

**Interfaces:**
- Produces: `<NavPill/>`, `<Aurora/>`, `<Footer/>`, and `<KindBadge kind="llm|tool|retr|chain" />`. `KindBadge` is the ONLY place `--kind-*` colors appear.

- [ ] **Step 1: KindBadge with the categorical palette**

```tsx
// components/brand/kind-badge.tsx
const KIND = {
  llm:   { fg:'#B97306', bg:'#FBF3DF' },
  tool:  { fg:'#0E7FB8', bg:'#E2F1FA' },
  retr:  { fg:'#1F8A56', bg:'#E5F4EC' },
  chain: { fg:'#7A4FD9', bg:'#EFEAFB' },
} as const;
export function KindBadge({ kind }: { kind: keyof typeof KIND }) {
  const c = KIND[kind];
  return <span style={{ color:c.fg, background:c.bg, fontFamily:'var(--font-mono)', fontSize:10, fontWeight:700, borderRadius:999, padding:'2px 8px' }}>{kind}</span>;
}
```

- [ ] **Step 2: Aurora + nav pill + footer**

Port the philadelphia backdrop (72px grid + radial aurora) into `<Aurora/>` as a fixed, pointer-events-none layer for the landing only. Port the sticky rounded nav pill and footer markup from `website/philadelphia/index.html` (lines ~47–67 nav, ~406–419 footer), converted to JSX with our tokens. Logo = 22px `#0485F7` rounded square with white inner dot.

- [ ] **Step 3: Wire logo + nav into Fumadocs layout config**

In `app/layout.config.tsx`, set `nav.title` to the langprobe logo + wordmark and `links` to `Docs`, `API`, `GitHub`.

- [ ] **Step 4: Build**

Run: `pnpm build && test -f out/index.html && echo OK`

- [ ] **Step 5: Commit**

```bash
git add components/brand app/layout.config.tsx
git commit -s -m "feat: brand chrome (nav pill, aurora, footer, kind badge)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Variable-injection core (`injectVars`) — TDD

**Files:**
- Create: `lib/playground-vars.ts`
- Create: `lib/playground-vars.test.ts`
- Create/Modify: `vitest.config.ts`, add `"test": "vitest run"` to `package.json`

**Interfaces:**
- Produces: `DEFAULT_HOST = 'https://app.langprobe.com'`, `API_KEY_PLACEHOLDER = 'lt_YOUR_PUBLIC_ID.YOUR_SECRET'`, `interface PlaygroundVars { host: string; apiKey: string }`, and `injectVars(template: string, vars: Partial<PlaygroundVars>): string`. Later tasks (Curl component) call `injectVars`.

- [ ] **Step 1: Install vitest and write the failing test**

```bash
pnpm add -D vitest
```

```ts
// lib/playground-vars.test.ts
import { describe, it, expect } from 'vitest';
import { injectVars, DEFAULT_HOST, API_KEY_PLACEHOLDER } from './playground-vars';

describe('injectVars', () => {
  it('replaces host and apiKey when both provided', () => {
    expect(injectVars('curl {{host}}/v1/runs -H "Authorization: Bearer {{apiKey}}"',
      { host: 'http://localhost:7080', apiKey: 'lt_a.b' }))
      .toBe('curl http://localhost:7080/v1/runs -H "Authorization: Bearer lt_a.b"');
  });
  it('falls back to DEFAULT_HOST when host is empty', () => {
    expect(injectVars('{{host}}/v1/traces', { host: '', apiKey: 'lt_a.b' }))
      .toBe(`${DEFAULT_HOST}/v1/traces`);
  });
  it('falls back to API_KEY_PLACEHOLDER when key unset', () => {
    expect(injectVars('Bearer {{apiKey}}', {})).toBe(`Bearer ${API_KEY_PLACEHOLDER}`);
  });
  it('strips trailing slashes from host', () => {
    expect(injectVars('{{host}}/v1/runs', { host: 'https://x.dev//' })).toBe('https://x.dev/v1/runs');
  });
  it('leaves templates without tokens unchanged', () => {
    expect(injectVars('docker compose up -d', {})).toBe('docker compose up -d');
  });
});
```

- [ ] **Step 2: Run test, expect FAIL**

Run: `pnpm vitest run lib/playground-vars.test.ts`
Expected: FAIL (module not found / injectVars undefined).

- [ ] **Step 3: Implement**

```ts
// lib/playground-vars.ts
export const DEFAULT_HOST = 'https://app.langprobe.com';
export const API_KEY_PLACEHOLDER = 'lt_YOUR_PUBLIC_ID.YOUR_SECRET';
export interface PlaygroundVars { host: string; apiKey: string }

export function injectVars(template: string, vars: Partial<PlaygroundVars>): string {
  const host = ((vars.host ?? '').trim() || DEFAULT_HOST).replace(/\/+$/, '');
  const apiKey = (vars.apiKey ?? '').trim() || API_KEY_PLACEHOLDER;
  return template.replaceAll('{{host}}', host).replaceAll('{{apiKey}}', apiKey);
}
```

- [ ] **Step 4: Run test, expect PASS**

Run: `pnpm vitest run lib/playground-vars.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/playground-vars.ts lib/playground-vars.test.ts vitest.config.ts package.json pnpm-lock.yaml
git commit -s -m "feat: variable-injection core for playground curl blocks

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Playground context + settings bar (localStorage)

**Files:**
- Create: `lib/playground-context.tsx`
- Create: `components/playground-settings.tsx`
- Modify: `app/layout.tsx` (wrap children in `<PlaygroundVarsProvider>`)

**Interfaces:**
- Consumes: `PlaygroundVars`, `DEFAULT_HOST` from Task 5.
- Produces: `PlaygroundVarsProvider` (React context) and `usePlaygroundVars(): { vars: PlaygroundVars; setVars: (v: Partial<PlaygroundVars>) => void }`, persisting to `localStorage` key `langprobe-docs:vars`. `<PlaygroundSettings/>` renders the host + apiKey inputs.

- [ ] **Step 1: Context with SSR-safe localStorage**

```tsx
'use client';
// lib/playground-context.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { DEFAULT_HOST, type PlaygroundVars } from './playground-vars';

const KEY = 'langprobe-docs:vars';
const Ctx = createContext<{ vars: PlaygroundVars; setVars: (v: Partial<PlaygroundVars>) => void } | null>(null);

export function PlaygroundVarsProvider({ children }: { children: React.ReactNode }) {
  const [vars, setState] = useState<PlaygroundVars>({ host: DEFAULT_HOST, apiKey: '' });
  useEffect(() => {
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
```

- [ ] **Step 2: Settings bar component**

`components/playground-settings.tsx` ('use client'): two labeled inputs bound to `usePlaygroundVars()` — host (placeholder `https://app.langprobe.com`) and API key (`type=password`, placeholder `lt_…`), styled with tokens (`--surface-2` bg, 1px `--border`, `--r-2`), plus the note "Stored only in your browser (localStorage)." in `--text-3`.

- [ ] **Step 3: Provider wraps the app**

In `app/layout.tsx`, wrap `{children}` with `<PlaygroundVarsProvider>`.

- [ ] **Step 4: Build**

Run: `pnpm build && test -f out/index.html && echo OK`

- [ ] **Step 5: Commit**

```bash
git add lib/playground-context.tsx components/playground-settings.tsx app/layout.tsx
git commit -s -m "feat: playground vars context + settings bar

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: `<Curl>` MDX component (injection + copy)

**Files:**
- Create: `components/curl.tsx`
- Modify: `mdx-components.tsx` (register `Curl`, `KindBadge`, `PlaygroundSettings`)

**Interfaces:**
- Consumes: `injectVars` (Task 5), `usePlaygroundVars` (Task 6).
- Produces: `<Curl>{`curl {{host}}/v1/runs -H "Authorization: Bearer {{apiKey}}"`}</Curl>` — renders the injected command in a Geist Mono code block with a copy button. Usable in any `.mdx` file.

- [ ] **Step 1: Component**

```tsx
'use client';
// components/curl.tsx
import { useState } from 'react';
import { injectVars } from '@/lib/playground-vars';
import { usePlaygroundVars } from '@/lib/playground-context';

export function Curl({ children }: { children: string }) {
  const { vars } = usePlaygroundVars();
  const [copied, setCopied] = useState(false);
  const cmd = injectVars(String(children).trim(), vars);
  const copy = async () => { await navigator.clipboard.writeText(cmd); setCopied(true); setTimeout(() => setCopied(false), 1200); };
  return (
    <div style={{ position:'relative', background:'var(--surface-3)', border:'1px solid var(--border)', borderRadius:8, padding:'14px 16px', fontFamily:'var(--font-mono)', fontSize:12.5, overflowX:'auto' }}>
      <button onClick={copy} style={{ position:'absolute', top:8, right:8, fontFamily:'var(--font-sans)', fontSize:11, fontWeight:700, color:'var(--link)', background:'transparent', border:'none', cursor:'pointer' }}>{copied ? 'copied' : 'copy'}</button>
      <pre style={{ margin:0, whiteSpace:'pre-wrap' }}>{cmd}</pre>
    </div>
  );
}
```

- [ ] **Step 2: Register in `mdx-components.tsx`**

Add `Curl`, `KindBadge`, `PlaygroundSettings` to the object returned by `getMDXComponents`/`useMDXComponents` so MDX can use them without imports.

- [ ] **Step 3: Smoke-test in a scratch MDX page**

Temporarily add `<Curl>{`curl {{host}}/v1/traces -H "Authorization: Bearer {{apiKey}}"`}</Curl>` to `content/docs/index.mdx`, run `pnpm dev`, confirm it renders with `https://app.langprobe.com` and the placeholder key, that changing the settings bar updates it live, and copy works. Remove the scratch block after.

- [ ] **Step 4: Build**

Run: `pnpm build && test -f out/index.html && echo OK`

- [ ] **Step 5: Commit**

```bash
git add components/curl.tsx mdx-components.tsx
git commit -s -m "feat: <Curl> MDX block with site-wide variable injection

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: OpenAPI merge library — TDD

**Files:**
- Create: `scripts/lib/merge-openapi.mjs`
- Create: `scripts/lib/merge-openapi.test.mjs`

**Interfaces:**
- Produces: `mergeOpenAPI(base, add, { title }) → doc` (unions `paths` + `components.*`, unions `tags`) and `tagByResource(doc) → doc` (sets each operation's `tags` to `[resource]` where `resource` is the segment after `/v1/`, e.g. `/v1/runs/{id}/spans` → `runs`). Consumed by `gen-openapi.mjs` (Task 9).

- [ ] **Step 1: Write the failing test**

```js
// scripts/lib/merge-openapi.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mergeOpenAPI, tagByResource } from './merge-openapi.mjs';

test('mergeOpenAPI unions paths and component schemas', () => {
  const a = { openapi:'3.1.0', info:{title:'a',version:'1'}, paths:{ '/v1/traces':{post:{}} }, components:{ schemas:{ A:{} } }, tags:[{name:'ingest'}] };
  const b = { openapi:'3.1.0', info:{title:'b',version:'1'}, paths:{ '/v1/runs':{get:{}} }, components:{ schemas:{ B:{} } }, tags:[{name:'runs'}] };
  const m = mergeOpenAPI(a, b, { title:'langprobe API' });
  assert.deepEqual(Object.keys(m.paths).sort(), ['/v1/runs','/v1/traces']);
  assert.deepEqual(Object.keys(m.components.schemas).sort(), ['A','B']);
  assert.equal(m.info.title, 'langprobe API');
  assert.deepEqual(m.tags.map(t=>t.name).sort(), ['ingest','runs']);
});

test('tagByResource tags operations by the segment after /v1/', () => {
  const doc = { paths:{ '/v1/runs/{id}/spans':{ get:{}, post:{} }, '/v1/traces':{ post:{} } } };
  const out = tagByResource(doc);
  assert.deepEqual(out.paths['/v1/runs/{id}/spans'].get.tags, ['runs']);
  assert.deepEqual(out.paths['/v1/traces'].post.tags, ['traces']);
});
```

- [ ] **Step 2: Run, expect FAIL**

Run: `node --test scripts/lib/merge-openapi.test.mjs`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement**

```js
// scripts/lib/merge-openapi.mjs
const SECTIONS = ['schemas','responses','parameters','requestBodies','headers','securitySchemes'];
const METHODS = ['get','put','post','delete','patch','options','head','trace'];

export function mergeOpenAPI(base, add, { title } = {}) {
  const out = structuredClone(base);
  out.info = { ...out.info, ...(title ? { title } : {}) };
  out.paths = { ...(base.paths || {}), ...(add.paths || {}) };
  out.components = { ...(base.components || {}) };
  for (const s of SECTIONS) {
    out.components[s] = { ...(base.components?.[s] || {}), ...(add.components?.[s] || {}) };
  }
  const names = new Set([...(base.tags||[]), ...(add.tags||[])].map(t => t.name));
  out.tags = [...names].map(name => ({ name }));
  return out;
}

export function tagByResource(doc) {
  const out = structuredClone(doc);
  for (const [path, item] of Object.entries(out.paths || {})) {
    const m = path.match(/^\/v1\/([^/{]+)/);
    const resource = m ? m[1] : 'other';
    for (const method of METHODS) {
      if (item[method]) item[method].tags = [resource];
    }
  }
  return out;
}
```

- [ ] **Step 4: Run, expect PASS**

Run: `node --test scripts/lib/merge-openapi.test.mjs`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/merge-openapi.mjs scripts/lib/merge-openapi.test.mjs
git commit -s -m "feat: OpenAPI merge + resource-tagging library

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: Generate/seed the merged `openapi/openapi.json`

**Files:**
- Create: `scripts/gen-openapi.mjs`
- Create: `openapi/openapi.json` (generated OR hand-authored seed)

**Interfaces:**
- Consumes: `mergeOpenAPI`, `tagByResource` (Task 8).
- Produces: committed `openapi/openapi.json` (OpenAPI 3.x) covering at minimum: `POST /v1/traces`, `POST /v1/runs`, `GET /v1/runs`, `GET /v1/runs/{run_id}`, `GET /v1/runs/{run_id}/spans`, `GET /v1/runs/{run_id}/scores`, `/v1/replays`, `/v1/eval-runs`, `/v1/prompts`, `/v1/datasets` — each with `securitySchemes` (bearer + `X-Api-Key`) and the `lt_` key example.

- [ ] **Step 1: Write the generator (fetch two live schemas, else fall back)**

```js
// scripts/gen-openapi.mjs — run when the services are up locally.
import { writeFileSync } from 'node:fs';
import { mergeOpenAPI, tagByResource } from './lib/merge-openapi.mjs';
const INGEST = process.env.INGEST_OPENAPI ?? 'http://localhost:7080/openapi.json';
const API = process.env.API_OPENAPI ?? 'http://localhost:7081/openapi.json';
const [a, b] = await Promise.all([fetch(INGEST).then(r=>r.json()), fetch(API).then(r=>r.json())]);
const merged = tagByResource(mergeOpenAPI(a, b, { title: 'langprobe API' }));
writeFileSync(new URL('../openapi/openapi.json', import.meta.url), JSON.stringify(merged, null, 2));
console.log(`wrote ${Object.keys(merged.paths).length} paths`);
```

- [ ] **Step 2: Try live generation against the running platform**

```bash
# In the platform repo: docker compose -f infra/docker-compose.yml up -d
node scripts/gen-openapi.mjs   # if it succeeds, openapi/openapi.json is real
```

If the services aren't reachable/importable in this environment, proceed to Step 3 (seed) instead — do NOT block.

- [ ] **Step 3: If live generation is unavailable, hand-author an accurate seed**

Create `openapi/openapi.json` by hand from the observed routes and the shapes in `docs/getting-started.md` / `llms.txt` / the ingest router source. Include `components.securitySchemes` = `{ bearer: { type:'http', scheme:'bearer' }, apiKey: { type:'apiKey', in:'header', name:'X-Api-Key' } }`, and the `POST /v1/runs` request body matching the getting-started example (`sdk`, `runs[]` with `run_id, name, kind, status, start_time, end_time, inputs, outputs`, `spans[]`). Run `tagByResource` mentally / via a one-off node call so every operation is tagged.

- [ ] **Step 4: Validate the JSON parses and has the core paths**

```bash
node -e "const d=require('./openapi/openapi.json'); const need=['/v1/traces','/v1/runs']; for(const p of need){ if(!d.paths[p]) throw new Error('missing '+p);} console.log('paths', Object.keys(d.paths).length)"
```
Expected: prints a path count ≥ 2, no throw.

- [ ] **Step 5: Commit**

```bash
git add scripts/gen-openapi.mjs openapi/openapi.json
git commit -s -m "feat: merged OpenAPI schema for the API reference

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 10: Wire `fumadocs-openapi` → API reference pages + playground

**Files:**
- Create: `lib/openapi.ts`
- Create: `scripts/generate-api-docs.mjs`
- Modify: `source.config.ts` (register the openapi source), `app/docs/[[...slug]]/page.tsx` (render `<APIPage>`), `content/docs/api/meta.json`

**Interfaces:**
- Consumes: `openapi/openapi.json` (Task 9).
- Produces: generated MDX under `content/docs/api/**` with an interactive request panel; the API-reference section in the sidebar.

- [ ] **Step 1: Install and configure**

```bash
pnpm add fumadocs-openapi
```

Follow the pinned fumadocs-openapi README for the exact wiring (it shifts between versions). Canonical shape:

```ts
// lib/openapi.ts
import { createOpenAPI } from 'fumadocs-openapi/server';
export const openapi = createOpenAPI({ /* proxyUrl optional; disabled for MVP */ });
```

```js
// scripts/generate-api-docs.mjs
import { generateFiles } from 'fumadocs-openapi';
void generateFiles({ input: ['./openapi/openapi.json'], output: './content/docs/api', per: 'operation', groupBy: 'tag' });
```

Add to `package.json` scripts: `"gen:api": "node scripts/generate-api-docs.mjs"`, and run it in `prebuild`.

- [ ] **Step 2: Render `<APIPage>` in the docs route**

In `app/docs/[[...slug]]/page.tsx`, when `page.data._openapi` is present, render `<APIPage {...openapi.getAPIPageProps(page.data)} />` (exact prop plumbing per pinned version). Ensure the page still renders normal MDX otherwise.

- [ ] **Step 3: Generate + build**

```bash
pnpm gen:api
pnpm build && test -f out/index.html && echo OK
```
Expected: `content/docs/api/` populated; build succeeds; an API-reference page renders with request/response schema + a "try" panel.

- [ ] **Step 4: Point the reference playground host default at app.langprobe.com**

Set the reference panel's default server/base URL to `https://app.langprobe.com` (via the schema's `servers[]` in `openapi.json`, or the `<APIPage>` config), consistent with the `<Curl>` default.

- [ ] **Step 5: Commit**

```bash
git add lib/openapi.ts scripts/generate-api-docs.mjs source.config.ts app/docs/'[[...slug]]'/page.tsx content/docs/api package.json pnpm-lock.yaml
git commit -s -m "feat: OpenAPI-driven API reference + request panel

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 11: Introduction + landing page

**Files:**
- Create/Modify: `content/docs/index.mdx`, `content/docs/meta.json`
- Modify: `app/(home)/page.tsx` (landing with aurora + nav pill)

**Source mapping:** `README.md` (wedge: replay + agent-first), `PRODUCT.md`, `llms.txt`.

- [ ] **Step 1: Write `content/docs/index.mdx`** — what langprobe is, the two-part wedge (Replay; Agent-first), the "no proprietary SDK — plain OTLP/HTTP" line, and a "Next: Getting Started / API Reference" card row. Lead paragraph mirrors README's positioning verbatim-in-spirit (no invented claims).

- [ ] **Step 2: Landing `app/(home)/page.tsx`** — hero ("the real debugger for agents"), the `docker compose up -d` command chip, `<Aurora/>` backdrop, CTA to Getting Started. Port structure from `website/philadelphia/index.html` hero (lines ~69–86) but keep it a docs landing, not the full marketing page.

- [ ] **Step 3: `content/docs/meta.json`** — set top-level page order: `["index","getting-started","guides","sdk-python","api"]`.

- [ ] **Step 4: Build**

Run: `pnpm build && test -f out/index.html && echo OK`

- [ ] **Step 5: Commit**

```bash
git add content/docs/index.mdx content/docs/meta.json "app/(home)/page.tsx"
git commit -s -m "docs: introduction + landing page

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 12: Getting Started section

**Files:**
- Create: `content/docs/getting-started/meta.json`, `quickstart.mdx`, `first-trace.mdx`, `migrate-from-langsmith.mdx`

**Source mapping:** `docs/getting-started.md` (verbatim structure), `llms.txt`, ingest router behavior.

- [ ] **Step 1: `quickstart.mdx`** — boot the stack (`cp infra/.env.example`, `SESSION_SECRET`, `docker compose … up --build`), the ports table (web 7090 / api 7081 / ingest 7080), first-run setup (`POST /v1/setup` as a `<Curl>` block), mint an API key (UI steps). Every command a `<Curl>` where it hits the API.

- [ ] **Step 2: `first-trace.mdx`** — the `POST /v1/runs` example from getting-started.md as a `<Curl>` block using `{{host}}`/`{{apiKey}}`, expected `202 Accepted`, where runs show up (`/runs`). Include the "instrument with your coding agent" pointer to the langprobe skill.

- [ ] **Step 3: `migrate-from-langsmith.mdx`** — set `LANGSMITH_ENDPOINT`/`LANGSMITH_API_KEY` to the langprobe host; the shim translates `RunCreate`/`RunUpdate`; one-env-var migration story from the philadelphia "migration" card.

- [ ] **Step 4: `meta.json`** — `["quickstart","first-trace","migrate-from-langsmith"]`.

- [ ] **Step 5: Build + commit**

```bash
pnpm build && test -f out/index.html && echo OK
git add content/docs/getting-started
git commit -s -m "docs: getting started (quickstart, first trace, migration)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 13: Guides — Core concepts, Tracing & instrumentation

**Files:**
- Create: `content/docs/guides/meta.json`, `core-concepts.mdx`, `tracing.mdx`

**Source mapping:** `README.md` (storage stack, run/span model), `.claude/skills/langprobe/references/framework-integrations.md`, `decorators-and-traces.md`, `troubleshooting.md`, SDK `README.md` + `examples/`.

- [ ] **Step 1: `core-concepts.mdx`** — runs, spans, traces, span kinds (with `<KindBadge>` for llm/tool/retr/chain), projects/workspaces/orgs, the control-plane (Postgres) vs data-plane (ClickHouse) split, ingest queue (Redis).

- [ ] **Step 2: `tracing.mdx`** — OTLP/HTTP at `/v1/traces` (protobuf + JSON, no proprietary SDK); OpenInference recipes for CrewAI, DSPy, Pydantic AI, OpenAI Agents, LlamaIndex, bare providers; the Python SDK four-line `langprobe.init(instrumentations=[…])`; custom spans (`@trace`, `with span()`); end-user identity via `enduser.id` / `identify()`. Framework snippets drawn from the SDK `examples/` and the skill references — no invented APIs.

- [ ] **Step 3: `meta.json`** — `["core-concepts","tracing","replay","evals","self-hosting"]` (later tasks add the rest).

- [ ] **Step 4: Build + commit**

```bash
pnpm build && test -f out/index.html && echo OK
git add content/docs/guides/meta.json content/docs/guides/core-concepts.mdx content/docs/guides/tracing.mdx
git commit -s -m "docs: guides — core concepts + tracing/instrumentation

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 14: Guides — Replay, Evals, Self-hosting

**Files:**
- Create: `content/docs/guides/replay.mdx`, `evals.mdx`, `self-hosting.mdx`

**Source mapping:** `README.md`, `PRODUCT.md`, `RESEARCH.md` (eval rigor), `infra/` + `deploy/` (self-host), philadelphia replay/eval sections.

- [ ] **Step 1: `replay.mdx`** — edit → re-run → diff, span-level diffs (outputs, latency, tokens, cost), determinism verdict; the agent debug loop (find → read → replay → diff). Note the client-side replay harness is roadmap (per README status).

- [ ] **Step 2: `evals.mdx`** — panel-of-judges, schema adherence, test-retest stability, inter-judge agreement (κ), why single-judge scores aren't trustworthy. Draw from `RESEARCH.md`; keep claims to what's implemented vs roadmap.

- [ ] **Step 3: `self-hosting.mdx`** — architecture (Postgres/ClickHouse/Redis/object store), `docker compose` deploy, Helm chart / operator for k8s (`deploy/`, `infra/`), key env vars (`SESSION_SECRET`, endpoints), where data lives (Redis stream `langprobe:ingest:v1`, ClickHouse tables, Postgres tables) from getting-started.md.

- [ ] **Step 4: Build + commit**

```bash
pnpm build && test -f out/index.html && echo OK
git add content/docs/guides/replay.mdx content/docs/guides/evals.mdx content/docs/guides/self-hosting.mdx
git commit -s -m "docs: guides — replay, evals, self-hosting

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 15: Guides — Prompts, Datasets & comparisons, Agent surface / MCP

**Files:**
- Create: `content/docs/guides/prompts.mdx`, `datasets.mdx`, `agent-surface.mdx`
- Modify: `content/docs/guides/meta.json` (append the three)

**Source mapping:** router names (`prompts`, `datasets`, `comparisons`, `agent_views`), README/PRODUCT (agent-first surface), philadelphia "agent-first · mcp" section.

- [ ] **Step 1: `prompts.mdx`** — prompt versioning, aliases, the prompts playground (`/v1/prompts`, versions, aliases).
- [ ] **Step 2: `datasets.mdx`** — datasets + items, comparisons, add-to-dataset / add-to-annotation-queue flows (`/v1/datasets`, `/v1/comparisons`).
- [ ] **Step 3: `agent-surface.mdx`** — token-budgeted, LLM-legible run views over REST + MCP; `GET /v1/runs/{id}/agent-view`, the failed-runs + instrument-guide agent endpoints; the "an agent can debug an agent" loop from philadelphia.
- [ ] **Step 4: Update `meta.json`** to `["core-concepts","tracing","replay","evals","prompts","datasets","agent-surface","self-hosting"]`.
- [ ] **Step 5: Build + commit**

```bash
pnpm build && test -f out/index.html && echo OK
git add content/docs/guides
git commit -s -m "docs: guides — prompts, datasets, agent surface

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 16: Python SDK section

**Files:**
- Create: `content/docs/sdk-python/meta.json`, `install.mdx`, `native.mdx`, `frameworks.mdx`, `integrations.mdx`, `reference.mdx`

**Source mapping:** `~/conductor/workspaces/sdk-python/cancun` — `README.md`, `langprobe/__init__.py` (public exports), `client.py`, `ingest.py`, `control.py`, `trace.py`, `identity.py`, `otel.py`, `examples/`.

- [ ] **Step 1: `install.mdx`** — `pip install langprobe` + extras table (`[otel]`, `[crewai]`, `[dspy]`, `[pydantic-ai]`, `[openai-agents]`, `[llama-index]`, `[openai]`, `[anthropic]`, `[litellm]`, `[langchain]`, `[langsmith]`).
- [ ] **Step 2: `native.mdx`** — `LangprobeClient(endpoint, api_key)`, `@trace`, `with span()`, `identify()`, `IngestClient` vs `ControlClient`.
- [ ] **Step 3: `frameworks.mdx`** — `langprobe.init(api_key=…, endpoint=…, instrumentations=[…])`; runnable examples for crewai / dspy / llama_index / openai_agents / pydantic_ai (copied from `examples/`).
- [ ] **Step 4: `integrations.mdx`** — `langprobe.integrations.langchain.LangprobeCallbackHandler`; `langprobe.integrations.langsmith` (`Client`, `traceable`) one-line shim; note deprecated standalone dists re-export for one cycle.
- [ ] **Step 5: `reference.mdx`** — the public exports from `__init__.py`: `LangprobeClient`, `IngestClient`, `IngestRun`/`IngestSpan`/`IngestBatch`, `trace`, `span`, `identify`, `init`, `shutdown`, `LangprobeError`/`LangprobeHTTPError`. `meta.json` = `["install","native","frameworks","integrations","reference"]`.
- [ ] **Step 6: Build + commit**

```bash
pnpm build && test -f out/index.html && echo OK
git add content/docs/sdk-python
git commit -s -m "docs: python SDK section (install, native, frameworks, integrations, reference)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 17: API reference framing pages (auth, errors, playground)

**Files:**
- Create: `content/docs/api/index.mdx` (Authentication + playground settings), `content/docs/api/errors.mdx`
- Modify: `content/docs/api/meta.json` (order: index/auth, generated resource groups, errors)

**Source mapping:** ingest/api auth code (bearer + `X-Api-Key`, `lt_` format), getting-started.md, HTTP status conventions (`202` ingest, `409` setup-locked).

- [ ] **Step 1: `api/index.mdx`** — Authentication (mint key, `Authorization: Bearer lt_…` or `X-Api-Key`), the base URL/host model, and an embedded `<PlaygroundSettings/>` so readers set host + key once for the whole reference. A `<Curl>` auth smoke-test (`GET {{host}}/v1/runs`).
- [ ] **Step 2: `api/errors.mdx`** — error envelope, common statuses (`202` accepted ingest, `401/403` auth, `409` setup-locked, `429` rate-limit), pagination + rate-limit notes (Redis token buckets, per llms.txt/ingest limits).
- [ ] **Step 3: Ensure generated resource groups slot between** in `meta.json` (use `"..."` rest glob if the pinned Fumadocs supports it, else list the generated group folders explicitly).
- [ ] **Step 4: Build + commit**

```bash
pnpm build && test -f out/index.html && echo OK
git add content/docs/api/index.mdx content/docs/api/errors.mdx content/docs/api/meta.json
git commit -s -m "docs: API reference framing — auth, errors, playground settings

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 18: Link check + full verification pass

**Files:**
- Create: `scripts/check-links.mjs`
- Modify: `package.json` (`"check:links"` script)

**Interfaces:**
- Produces: a script that fails on any internal `href`/markdown link in `out/**/*.html` pointing to a path with no corresponding emitted file.

- [ ] **Step 1: Write the link checker**

```js
// scripts/check-links.mjs — run after `pnpm build` (static export in out/).
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const ROOT = 'out';
function walk(d){ return readdirSync(d).flatMap(n=>{ const p=join(d,n); return statSync(p).isDirectory()?walk(p):[p]; }); }
const htmls = walk(ROOT).filter(f=>f.endsWith('.html'));
const bad=[];
for(const f of htmls){
  const html=readFileSync(f,'utf8');
  for(const m of html.matchAll(/href="(\/[^"#?]*)"/g)){
    const href=m[1];
    if(href.startsWith('/_next')||/\.[a-z0-9]+$/i.test(href)) continue;
    const cands=[join(ROOT,href,'index.html'), join(ROOT,`${href}.html`), join(ROOT,href)];
    if(!cands.some(existsSync)) bad.push(`${f} -> ${href}`);
  }
}
if(bad.length){ console.error('Broken internal links:\n'+bad.join('\n')); process.exit(1); }
console.log(`Link check OK (${htmls.length} pages)`);
```

- [ ] **Step 2: Full build + all checks**

```bash
pnpm vitest run
node --test scripts/lib/merge-openapi.test.mjs
pnpm gen:api && pnpm build
node scripts/check-links.mjs
pnpm next lint
```
Expected: units pass, build emits `out/`, link check prints OK, lint clean.

- [ ] **Step 3: Manual brand QA (against `DESIGN.md`)**

`pnpm dev` and confirm: warm-white `#FCFCFC` bg, `#0485F7` accent, `#0A66C2` links, Plus Jakarta Sans chrome + Geist Mono only for machine values, radius ≤12px, no shimmer, no dark default, kind badges only in trace contexts, playground settings persist + inject across pages.

- [ ] **Step 4: Commit**

```bash
git add scripts/check-links.mjs package.json
git commit -s -m "test: internal link checker + full verification

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 19: Docs-repo README + remote-creation gate (STOP for approval)

**Files:**
- Create: `README.md` (repo intro, dev/build/deploy, how to regenerate OpenAPI)
- Optional: `.github/workflows/ci.yml` (build + link check) — scope-gated

- [ ] **Step 1: Write `README.md`** — what the repo is, `pnpm dev` / `pnpm build`, static export + Docker (`docker build` / nginx), how to regenerate the API reference (`node scripts/gen-openapi.mjs` when services up → `pnpm gen:api`), and the toolchain version note from Task 1.

- [ ] **Step 2: Commit the README**

```bash
git add README.md && git commit -s -m "docs: repo README (dev, build, deploy, regen)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 3: STOP — get explicit user go-ahead before creating/pushing the remote.**

Present a summary (page count, build/link/lint status, screenshots or a local URL). Do NOT run `gh repo create` until the user says go. This is the outward-facing publish gate from the spec.

- [ ] **Step 4: On approval, create the public repo and push**

```bash
gh repo create langprobe/docs --public --source . --remote origin --description "Documentation for langprobe — the real debugger for agents" --push
```

If the push rejects `.github/workflows/ci.yml` for missing `workflow` token scope (known constraint), either drop the workflow from this push and hand it to the user, or ask them to push that file / grant scope. Do not block the docs push on CI.

- [ ] **Step 5: Report the repo URL and remaining deferred items** (live "Run", TypeScript SDK, dark mode, DNS/deploy cutover).

---

## Self-Review

**Spec coverage:**
- §3 stack / static export → Tasks 1, 2. ✓
- §4 design system → Tasks 3, 4 (tokens, fonts, chrome, kind badges). ✓
- §5 playground (curl-first, variable injection, default host) → Tasks 5, 6, 7; reference panel → Task 10 Step 4. ✓
- §6 IA: Introduction → 11; Getting Started → 12; Guides (all 8) → 13, 14, 15; API Reference → 10, 17; Python SDK → 16; TS SDK deferred → noted in Task 19 Step 5. ✓
- §7 OpenAPI pipeline (merge two services, seed fallback) → Tasks 8, 9. ✓
- §8 verification (build, export, lint, links, render, brand) → Task 18. ✓
- §9 remote gate → Task 19 (explicit STOP). ✓
- §10 deferred items → not built; TS SDK/live-run/dark-mode called out. ✓

**Placeholder scan:** No "TBD"/"handle edge cases"/"similar to Task N". Framework-version-sensitive wiring (Fumadocs/fumadocs-openapi) is flagged with the canonical shape + "reconcile with pinned version" — honest, not a placeholder, because the exact API genuinely varies by release and the implementer must check `node_modules`.

**Type consistency:** `injectVars(template, vars)`, `PlaygroundVars {host, apiKey}`, `DEFAULT_HOST`, `usePlaygroundVars()`, `mergeOpenAPI(base, add, {title})`, `tagByResource(doc)`, `<Curl>{string}</Curl>`, `<KindBadge kind>` — names are consistent across Tasks 5→7 and 8→9. ✓

**Known environment risk:** Task 9 live generation depends on the platform services being runnable here; the seed-fallback path (Step 3) keeps the build green regardless.
