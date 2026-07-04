'use client';

import { createOpenAPIPage } from 'fumadocs-openapi/ui';

// Single client-component instance shared by every generated API page (per
// fumadocs-openapi's own factory pattern -- creating it once avoids
// re-registering shiki/code-usage-generator state on every render).
//
// `showResponseSchema` defaults to true upstream; left as-is since curl-first
// users benefit from seeing the full response shape, not just an example.
export const OpenAPIPage = createOpenAPIPage();
