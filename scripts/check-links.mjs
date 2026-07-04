// Internal-link checker for the static export.
// Run after `pnpm build`: walks out/**/*.html, extracts internal href="/..."
// links, and fails if any points at a path with no emitted file. Skips
// _next assets, hashes, query strings, and external/file links.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'out';

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

if (!existsSync(ROOT)) {
  console.error(`No ${ROOT}/ directory — run \`pnpm build\` first.`);
  process.exit(1);
}

const htmls = walk(ROOT).filter((f) => f.endsWith('.html'));
const bad = [];

for (const file of htmls) {
  const html = readFileSync(file, 'utf8');
  for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    const href = m[1];
    // skip Next assets and anything that looks like a file (has an extension)
    if (href.startsWith('/_next') || /\.[a-z0-9]+$/i.test(href)) continue;
    const clean = href.replace(/\/+$/, ''); // tolerate trailing slash
    const candidates = [
      join(ROOT, clean, 'index.html'),
      join(ROOT, `${clean}.html`),
      join(ROOT, clean),
      join(ROOT, href, 'index.html'),
    ];
    if (!candidates.some(existsSync)) bad.push(`${file}  ->  ${href}`);
  }
}

if (bad.length) {
  // de-dupe for readability
  const uniq = [...new Set(bad)];
  console.error(`Broken internal links (${uniq.length}):\n` + uniq.join('\n'));
  process.exit(1);
}
console.log(`Link check OK — ${htmls.length} pages, no broken internal links.`);
