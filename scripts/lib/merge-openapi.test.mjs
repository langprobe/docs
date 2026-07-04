import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mergeOpenAPI, tagByResource } from './merge-openapi.mjs';

test('mergeOpenAPI unions paths and component schemas', () => {
  const a = { openapi:'3.1.0', info:{title:'a',version:'1'}, paths:{ '/v1/traces':{post:{}} }, components:{ schemas:{ A:{} } }, tags:[{name:'ingest'}] };
  const b = { openapi:'3.1.0', info:{title:'b',version:'1'}, paths:{ '/v1/runs':{get:{}} }, components:{ schemas:{ B:{} } }, tags:[{name:'runs'}] };
  const m = mergeOpenAPI(a, b, { title:'langprobe API' });
  assert.deepEqual(Object.keys(m.paths).sort(), ['/v1/runs','/v1/traces']);
  assert.deepEqual(Object.keys(m.components.schemas).sort(), ['A','B']);
  assert.equal(m.info.title, 'langprobe API');
  assert.deepEqual(m.tags.map(t=>t.name).sort(), ['ingest','runs']);
});

test('mergeOpenAPI unions methods on overlapping paths instead of clobbering', () => {
  const a = { openapi:'3.1.0', info:{title:'a',version:'1'}, paths:{ '/v1/runs':{ post:{ summary:'send a trace' } } }, components:{} };
  const b = { openapi:'3.1.0', info:{title:'b',version:'1'}, paths:{ '/v1/runs':{ get:{ summary:'query runs' } } }, components:{} };
  const m = mergeOpenAPI(a, b);
  assert.ok(m.paths['/v1/runs'].get, 'GET should survive the merge');
  assert.ok(m.paths['/v1/runs'].post, 'POST should survive the merge');
  assert.equal(m.paths['/v1/runs'].post.summary, 'send a trace');
  assert.equal(m.paths['/v1/runs'].get.summary, 'query runs');
});

test('tagByResource tags operations by the segment after /v1/', () => {
  const doc = { paths:{ '/v1/runs/{id}/spans':{ get:{}, post:{} }, '/v1/traces':{ post:{} } } };
  const out = tagByResource(doc);
  assert.deepEqual(out.paths['/v1/runs/{id}/spans'].get.tags, ['runs']);
  assert.deepEqual(out.paths['/v1/traces'].post.tags, ['traces']);
});

test('tagByResource populates document-level tags[] so tag-grouping tools can resolve them', () => {
  const doc = { paths:{ '/v1/runs/{id}/spans':{ get:{} }, '/v1/traces':{ post:{} }, '/healthz':{ get:{} } } };
  const out = tagByResource(doc);
  assert.deepEqual(out.tags.map((t) => t.name), ['other', 'runs', 'traces']);
});

test('tagByResource keeps existing tag metadata (e.g. description) for a resource that survives', () => {
  const doc = {
    tags: [{ name: 'runs', description: 'Run lifecycle' }],
    paths: { '/v1/runs': { get: {} } },
  };
  const out = tagByResource(doc);
  assert.deepEqual(out.tags, [{ name: 'runs', description: 'Run lifecycle' }]);
});
