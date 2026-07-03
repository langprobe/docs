import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

// Static export (`output: 'export'`) cannot run a per-request search API, so
// we serve the full pre-built Orama index as a static JSON file at build
// time (`staticGET`) instead of the dynamic per-query `GET` handler. The
// client (`fumadocs-ui`'s search dialog, configured with `type: 'static'` in
// lib/layout.shared.tsx) fetches this file once and searches in-browser via
// `fumadocs-core/search/client/orama-static`.
export const dynamic = 'force-static';

export const { staticGET: GET } = createFromSource(source, {
  // https://docs.orama.com/docs/orama-js/supported-languages
  language: 'english',
});
