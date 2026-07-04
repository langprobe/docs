# langprobe-docs

Documentation site for [langprobe](https://github.com/langprobe/langprobe) — the
real debugger for agents. Built with [Fumadocs](https://fumadocs.dev) on Next.js,
themed to the langprobe brand, with a curl-first interactive playground and an
API reference generated from the platform's OpenAPI schema.

## Develop

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## Build & static export

The site is configured for **static export** (`output: 'export'`) — no server
runtime required. The playground (host + API-key variable injection) and search
are entirely client-side.

```bash
pnpm build        # runs prebuild (gen:api) then next build → static site in ./out
```

## Deploy

- **Vercel** (primary): zero-config Next.js. Point `docs.langprobe.com` at it.
- **Self-host** (parity with `langprobe/website`): a `Dockerfile` + `nginx.conf`
  serve `./out`:
  ```bash
  docker build -t langprobe-docs .
  docker run -p 8080:80 langprobe-docs
  ```

## The API reference

The reference under `/docs/api` is generated from `openapi/openapi.json`, a
merged snapshot of the two FastAPI services (`ingest-api` + `api`).

```bash
# 1. (when the API changes) regenerate the merged schema from the running platform:
#    services up locally, then from the langprobe platform repo:
#      node <this-repo>/scripts/gen-openapi.mjs
#    (defaults read openapi/sources/{ingest,api}.json; set INGEST_OPENAPI / API_OPENAPI
#     to fetch live /openapi.json URLs instead)
pnpm gen:openapi

# 2. regenerate the reference MDX pages (also runs automatically in prebuild):
pnpm gen:api
```

The merge (`scripts/lib/merge-openapi.mjs`) deep-merges the two schemas
method-by-method (so `/v1/runs` keeps both the ingest `POST` and the api `GET`),
tags operations by resource, and injects the `bearer` / `X-Api-Key` security
schemes and the `https://app.langprobe.com` default server.

## Checks

```bash
pnpm build && pnpm check:links   # static build + internal link checker
pnpm test                        # vitest (variable-injection unit tests)
node --test scripts/lib/merge-openapi.test.mjs   # OpenAPI merge tests
pnpm lint
```

## Layout

| Path | What it is |
| ---- | ---------- |
| `content/docs/` | MDX content (getting-started, guides, sdk-python) |
| `content/docs/api/` | Generated API reference (`gen:api`) + hand-written `index.mdx`/`errors.mdx` |
| `openapi/openapi.json` | Committed merged OpenAPI schema; sources in `openapi/sources/` |
| `components/curl.tsx`, `lib/playground-*` | The curl-first playground + variable injection |
| `components/brand/` | Nav pill, aurora, footer, kind badges |
| `app/global.css` | DESIGN.md tokens + Fumadocs theme overrides (Tailwind v4) |
| `scripts/` | OpenAPI generator/merge, link checker |

## Toolchain (pinned)

| Package | Version |
| ------- | ------- |
| next | 16.2.9 |
| react | 19.2.7 |
| fumadocs-ui / fumadocs-core | 16.10.7 |
| fumadocs-mdx | 15.0.13 |
| fumadocs-openapi | 11.0.6 |
| tailwindcss | 4.3.x |

Tailwind CSS v4 (CSS-based `@theme`, no `tailwind.config.ts`). Package manager:
`pnpm`. Apache-2.0.
