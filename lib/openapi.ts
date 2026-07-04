import { createOpenAPI } from 'fumadocs-openapi/server';

// Single OpenAPI schema, keyed by id "openapi" (matches the `schemaId`
// baked into generated MDX frontmatter's `_openapi.preload`, see
// scripts/generate-api-docs.mjs).
//
// No `proxyUrl` here on purpose: a proxy needs a server route, which is
// incompatible with `output: 'export'`. The interactive request panel
// does a direct browser `fetch()` against the schema's `servers[0].url`
// (https://app.langprobe.com), same default host as the <Curl> blocks.
// This is CORS-permitting-only for the MVP; documented as a known
// limitation in the task report.
export const openapi = createOpenAPI({
  input: {
    openapi: './openapi/openapi.json',
  },
});
