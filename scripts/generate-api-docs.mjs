// scripts/generate-api-docs.mjs
//
// Generates one MDX page per OpenAPI operation (grouped by tag) under
// content/docs/api/, driven by the committed openapi/openapi.json.
//
// fumadocs-openapi v11's `generateFiles({ input, ... })` expects `input`
// to be the `OpenAPIServer` returned by `createOpenAPI()` (not raw file
// paths) -- it calls `input.getSchemas()` internally. We reuse the same
// `openapi` instance from lib/openapi.ts so the schema id ("openapi")
// lines up with what app/docs/[[...slug]]/page.tsx preloads at render
// time.
import { generateFiles } from 'fumadocs-openapi';
import { openapi } from '../lib/openapi.ts';

await generateFiles({
  input: openapi,
  output: './content/docs/api',
  per: 'operation',
  groupBy: 'tag',
  addGeneratedComment: true,
});

console.log('[gen:api] generated content/docs/api/**');
