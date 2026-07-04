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
