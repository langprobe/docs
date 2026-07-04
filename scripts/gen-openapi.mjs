// scripts/gen-openapi.mjs
//
// Generates openapi/openapi.json by merging the ingest and api OpenAPI
// schemas into a single document for the docs site's API reference.
//
// By default this reads the committed source files in openapi/sources/
// (real schemas captured from the running FastAPI services), so the
// build is reproducible without the platform running. Set INGEST_OPENAPI
// / API_OPENAPI to http(s) URLs to fetch live schemas instead (e.g. from
// a running local stack) for a future live regen.
import { readFileSync, writeFileSync } from 'node:fs';
import { mergeOpenAPI, tagByResource } from './lib/merge-openapi.mjs';

const INGEST_SOURCE = new URL('../openapi/sources/ingest.json', import.meta.url);
const API_SOURCE = new URL('../openapi/sources/api.json', import.meta.url);
const OUT = new URL('../openapi/openapi.json', import.meta.url);

async function loadSchema(envUrl, fallbackFileUrl) {
  if (envUrl) {
    const res = await fetch(envUrl);
    if (!res.ok) throw new Error(`failed to fetch ${envUrl}: ${res.status}`);
    return res.json();
  }
  return JSON.parse(readFileSync(fallbackFileUrl, 'utf8'));
}

const [ingest, api] = await Promise.all([
  loadSchema(process.env.INGEST_OPENAPI, INGEST_SOURCE),
  loadSchema(process.env.API_OPENAPI, API_SOURCE),
]);

// ingest as base so its POST /v1/runs (send-a-trace) wins over api's
// GET /v1/runs (query), while both are preserved via the deep path merge.
const merged = tagByResource(mergeOpenAPI(ingest, api, { title: 'langprobe API' }));

// Enrich: the real captured schemas declare no auth at all. Merge in
// security schemes rather than clobbering any existing components.
merged.components = merged.components || {};
merged.components.securitySchemes = {
  ...(merged.components.securitySchemes || {}),
  bearerAuth: { type: 'http', scheme: 'bearer' },
  apiKeyAuth: { type: 'apiKey', in: 'header', name: 'X-Api-Key' },
};
merged.security = [{ bearerAuth: [] }, { apiKeyAuth: [] }];

merged.servers = [
  { url: 'https://app.langprobe.com', description: 'Default host (override in the playground settings)' },
];

merged.info = {
  ...merged.info,
  title: 'langprobe API',
  version: api.info?.version || '0.0.0',
};

writeFileSync(OUT, JSON.stringify(merged, null, 2) + '\n');
console.log(`wrote ${Object.keys(merged.paths).length} paths to openapi/openapi.json`);
