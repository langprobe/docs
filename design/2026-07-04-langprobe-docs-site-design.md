# Design: `langprobe/docs` — the documentation site

**Date:** 2026-07-04
**Status:** Approved (brainstorming), pending implementation plan
**Author:** brainstormed with the user

## 1. Goal & context

Build a Supabase/Stripe-grade documentation website for langprobe in a **new,
separate public repo `langprobe/docs`** (sibling to `langprobe/langprobe` and
`langprobe/website`). It must:

- read as the same brand as the marketing site (`langprobe/website`'s
  `index.html`, a.k.a. the "philadelphia" design file) and `DESIGN.md`;
- structure content the way Supabase (Intro → Guides → Reference) and Stripe
  (resource-by-resource API reference with a curl rail) do;
- ship an interactive, **curl-first** playground with site-wide variable
  injection.

The docs draw on existing, authoritative sources — no invented API behavior.
Sources in the **platform repo** (`langprobe/langprobe`): `README.md`,
`docs/getting-started.md`, `PRODUCT.md`, `RESEARCH.md`, `llms.txt`, `DESIGN.md`,
and the bundled `.claude/skills/langprobe/` references (framework integrations,
decorators & traces, troubleshooting). Sources in the **SDK repo**
(`langprobe/sdk-python`, worktree `~/conductor/workspaces/sdk-python/cancun`,
branch `feat/b1-init-otel`): `README.md`, the `langprobe/` package
(`__init__.py` public exports, `client.py`, `ingest.py`, `control.py`,
`trace.py`, `identity.py`, `otel.py`, `models.py`, `errors.py`), `examples/`
(crewai / dspy / llama_index / openai_agents / pydantic_ai), and
`langprobe.integrations.{langchain,langsmith}`.

## 2. What there is to document (surface map)

Two FastAPI services expose the API:

- **`ingest-api`** (local `http://localhost:7080`): `POST /v1/traces` (OTLP/HTTP,
  protobuf + JSON), `POST /v1/runs` (native + LangSmith-shim RunCreate/RunUpdate),
  health.
- **`api`** (local `http://localhost:7081`): ~30 routers under `/v1` —
  `runs`, spans (`/v1/runs/{id}/spans`), `replays`, `eval-runs`, `prompts`,
  `datasets`, `comparisons`, `annotations`, `feedback`, `feedback-keys`,
  `alerts`, `projects`, `workspaces`, `api_keys`, `saved-views`, `metrics`,
  `poll-runs`, `luna-judges`, `llm-credentials`, `playground`, `studio`,
  `threads`, `me`, `auth` (+ `oauth`, `sso`, `scim-tokens`), `admin`, `setup`,
  and a `/scim/v2` surface. Plus an **MCP / agent surface** (agent-legible,
  token-budgeted run views over REST + MCP).

Default public host for examples: `https://app.langprobe.com` (reader-overridable
to `http://localhost:7080` etc.).

## 3. Stack & repo layout

- **Fumadocs** on **Next.js (App Router)** + **Tailwind** + **MDX**.
- Configured to **static-export cleanly** (`output: export`): the curl-first
  playground and variable injection are entirely client-side (`localStorage`),
  so no server runtime is required.
- **Deployment:** Vercel-primary at `docs.langprobe.com`; a `Dockerfile` +
  `nginx.conf` are also included so it can be self-hosted identically to
  `langprobe/website`. DNS/deploy cutover is out of scope for this build.

```
langprobe-docs/
  app/                     # Fumadocs Next.js shell (layout, [[...slug]] route)
  content/docs/            # MDX content, mirrors the IA in §6
  components/
    playground-settings.tsx  # host + API-key settings bar (localStorage)
    curl.tsx                 # <Curl> MDX block: variable injection + copy
    brand/                   # nav pill, aurora backdrop, kind badges, etc.
  openapi/
    openapi.json           # committed, merged from both FastAPI services
  scripts/
    gen-openapi.mjs        # regenerator (+ small Python helper if needed)
  lib/                     # variable-injection + storage helpers
  Dockerfile
  nginx.conf
  tailwind.config.ts       # philosophy tokens (see §4)
  source.config.ts         # Fumadocs source + fumadocs-openapi wiring
```

Local build location: a fresh directory **outside** the `sarajevo` worktree
(e.g. `~/conductor/repos/langprobe-docs`), `git init`ed there.

## 4. Design system: philadelphia → Fumadocs theme

Port the canonical token set from `DESIGN.md` / the philadelphia file into
Tailwind theme + CSS variables, and **override Fumadocs' default theme** so the
site reads as one brand rather than a themed template.

- **Canvas:** `--bg #FDFDFC`; flat surfaces; no glassmorphism except the
  philadelphia nav pill / floating cards where it already exists.
- **Color:** primary/accent `#0485F7`; link `#0A66C2`; error/success/muted per
  `DESIGN.md`. No purple/green/amber in chrome. No gradients on the brand
  (the hero wordmark gradient from philadelphia is the one sanctioned exception,
  used sparingly).
- **Type:** Plus Jakarta Sans for chrome/headings/KPI numbers; Geist Mono for
  machine values only (ids, models, durations, costs, config, code). No Inter,
  system-ui, Geist Sans, etc.
- **Shape/motion:** radius scale stops at `12px` (round dots/avatars excepted);
  subtle 72px grid + aurora backdrop on the landing/intro; card hover =
  border-color + soft shadow; **no skeleton shimmer** (flat rectangles only).
- **`--kind-*` categorical palette** (llm amber, tool cyan, retr green, chain
  indigo) is reused **only** in trace/span-kind badge contexts, never in chrome.
- **Light-mode only** (no `data-theme="dark"` default; dark mode deferred).

I will cross-check every visual choice against `DESIGN.md` as I build (per the
project's QA rules).

## 5. Playground: curl-first with variable injection

- **Settings bar** (site-wide, sticky/near the top of reference pages): two
  fields — **host** (default `https://app.langprobe.com`) and **API key**
  (`lt_<public_id>.<secret>`) — persisted to `localStorage`. A clear "these
  stay in your browser" note.
- **`<Curl>` MDX component:** authored curl samples reference `{{host}}` /
  `{{apiKey}}` placeholders; the component injects the reader's stored values
  into **every** curl block site-wide (Stripe-style), with a copy button.
  When no key is set, it shows a masked placeholder and a "set your key" hint.
- **API reference panel:** `fumadocs-openapi` renders per-endpoint reference +
  its request panel from the committed schema, wired to the same host/key.
- **No live execution** in the MVP. The component + settings layer are built so
  a per-endpoint live "Run" (browser `fetch`, CORS-permitting) can be switched
  on later without re-architecting.

## 6. Content / information architecture (approved)

- **Introduction** — what langprobe is, the wedge (replay + agent-first), where
  to go next.
- **Getting Started** — self-host quickstart (`docker compose` → first-run
  setup → mint key → send first trace), "Migrate from LangSmith."
- **Guides** (hand-polished MDX):
  - Core concepts (runs / spans / traces / projects / workspaces / orgs)
  - Tracing & instrumentation — OpenInference recipes (CrewAI, DSPy, Pydantic
    AI, OpenAI Agents, LlamaIndex, bare providers), custom spans, end-user
    identity (`enduser.id`)
  - Replay (edit → re-run → diff, determinism verdict)
  - Evals & eval-rigor (panel-of-judges, inter-judge agreement, reliability)
  - Prompts (versioning, aliases, playground)
  - Datasets & comparisons
  - Agent surface / MCP (token-budgeted, LLM-legible run views)
  - Self-hosting (architecture, storage stack, k8s/helm, config/env)
- **API Reference** (OpenAPI-driven, playground on every endpoint):
  Authentication · Ingest (`/v1/traces`, `/v1/runs`) · Runs · Spans · Replays ·
  Evals · Prompts · Datasets · **full auto-listed remainder** of the routers ·
  Errors / pagination / rate limits.
- **SDKs**
  - **Python SDK** (`langprobe/sdk-python`, package `langprobe`) — first-class,
    hand-written. Covers:
    - **Install** — `pip install langprobe` and the optional extras (`[otel]`,
      `[crewai]`, `[dspy]`, `[pydantic-ai]`, `[openai-agents]`, `[llama-index]`,
      `[openai]`, `[anthropic]`, `[litellm]`, `[langchain]`, `[langsmith]`).
    - **Native usage** — `LangprobeClient` (endpoint + `lt_` key), the `@trace`
      decorator, the `with span()` context manager, `identify()`, and the
      `IngestClient` / `ControlClient` split.
    - **Frameworks in four lines** — `langprobe.init(api_key=…, endpoint=…,
      instrumentations=[…])` with the OpenInference instrumentor extras; runnable
      `examples/` for crewai / dspy / llama_index / openai_agents / pydantic_ai.
    - **Integrations** — `langprobe.integrations.langchain.LangprobeCallbackHandler`
      (LangChain / LangGraph) and `langprobe.integrations.langsmith`
      (`Client`, `traceable`) as a one-line LangSmith-compat shim. Note the
      deprecated standalone `langprobe-langchain` / `langprobe-langsmith` dists
      re-export from `langprobe.integrations.*` for one cycle.
    - **API reference** — the public exports from `__init__.py`: `LangprobeClient`,
      `IngestClient`, `IngestRun` / `IngestSpan` / `IngestBatch`, `trace`, `span`,
      `identify`, `init`, `shutdown`, `LangprobeError` / `LangprobeHTTPError`.
    - **Caveat:** the SDK repo has two active worktrees (`cancun` =
      `feat/b1-init-otel`, fuller: docs/examples/tests; `guangzhou` =
      `sdk-langprobe-feature-parity`, leaner). Document against the released
      surface described in the SDK `README`; confirm the default branch before
      publishing version-specific claims.
  - **TypeScript SDK** — **stretch / unverified.** The platform `README`
    references `sdk-typescript`, but no such repo/dir was located. Keep a
    placeholder section; document only if/when the source is confirmed.

**MVP cut (approved option A):** full themed scaffold + playground; **all** of
Introduction + Getting Started at high polish; the core Guides (Core concepts,
Tracing, Replay, Evals, Self-hosting) hand-polished; a **full** OpenAPI-driven
API Reference (core resources hand-tightened, the rest auto-generated so nothing
is missing); and the **Python SDK** section (install + native + frameworks +
integrations + reference). TypeScript SDK stays deferred.

## 7. OpenAPI pipeline

`scripts/gen-openapi.mjs` (+ a small Python helper if needed) pulls both FastAPI
schemas (import the app objects or hit each `/openapi.json`), **merges** them
into a single document, **tags** operations by resource for grouping, and writes
`openapi/openapi.json` (committed). `fumadocs-openapi` builds the reference +
request panel from that file, keeping the docs repo self-contained and buildable
without the langprobe Python env.

- If the `uv` env cooperates in this environment, generate the **real** merged
  schema.
- If it fights, **seed an accurate hand-authored `openapi.json`** for the core
  resources (matching observed routes/shapes) and leave the generator wired so a
  full regen is one command later. Either path yields a working build.

## 8. Verification (before proposing the push)

- `pnpm build` (Next.js production build) passes; `output: export` emits static
  files cleanly.
- `next lint` clean.
- API-reference pages render from `openapi/openapi.json`; the playground
  settings bar persists and injects into curl blocks.
- Internal links resolve (no dead links).
- Boot locally and eyeball the brand match against `DESIGN.md` / philadelphia.

## 9. Remote creation (outward-facing gate)

Build entirely locally first. Only after a real, building MVP exists do I
create the public GitHub repo and push — and I will **pause for explicit
go-ahead right before** running `gh repo create langprobe/docs … --push`.

**Known constraint:** the push token may lack `workflow` scope. If CI is added
under `.github/workflows/`, the first push of that file may need the user to
push it or grant scope. Flag if it arises; do not block the MVP on CI.

## 10. Explicitly deferred (YAGNI)

Live "Run" execution / shared demo backend · full hand-curated Stripe-level
polish on non-core endpoints · **TypeScript** SDK reference (until source
confirmed) · autogenerated Python API-reference from docstrings · dark mode ·
DNS/deploy cutover · search analytics · versioned docs.
