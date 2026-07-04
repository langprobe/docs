const SECTIONS = ['schemas','responses','parameters','requestBodies','headers','securitySchemes'];
const METHODS = ['get','put','post','delete','patch','options','head','trace'];

function mergePathItems(basePaths = {}, addPaths = {}) {
  const out = { ...basePaths };
  for (const [path, addItem] of Object.entries(addPaths)) {
    const baseItem = out[path];
    if (!baseItem) {
      out[path] = addItem;
      continue;
    }
    // Merge method-by-method; the base doc wins when the same method is
    // defined in both (e.g. POST /v1/runs from ingest vs GET /v1/runs from api).
    const merged = { ...addItem, ...baseItem };
    for (const method of METHODS) {
      if (baseItem[method]) merged[method] = baseItem[method];
      else if (addItem[method]) merged[method] = addItem[method];
    }
    out[path] = merged;
  }
  return out;
}

export function mergeOpenAPI(base, add, { title } = {}) {
  const out = structuredClone(base);
  out.info = { ...out.info, ...(title ? { title } : {}) };
  out.paths = mergePathItems(base.paths, add.paths);
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
  const resources = new Set();
  for (const [path, item] of Object.entries(out.paths || {})) {
    const m = path.match(/^\/v1\/([^/{]+)/);
    const resource = m ? m[1] : 'other';
    for (const method of METHODS) {
      if (item[method]) {
        item[method].tags = [resource];
        resources.add(resource);
      }
    }
  }
  // Re-tagging operations above only rewrites `operation.tags`; without a
  // matching document-level `tags[]` entry per resource, tools that group
  // by tag (e.g. fumadocs-openapi's `groupBy: 'tag'`) can't resolve the
  // tag name and silently drop every operation. Keep any pre-existing tag
  // metadata (e.g. descriptions) and add entries for new resources.
  const existing = new Map((out.tags || []).map((t) => [t.name, t]));
  out.tags = [...resources].sort().map((name) => existing.get(name) || { name });
  return out;
}
