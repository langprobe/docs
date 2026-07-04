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

test('tagByResource tags operations by the segment after /v1/', () => {
  const doc = { paths:{ '/v1/runs/{id}/spans':{ get:{}, post:{} }, '/v1/traces':{ post:{} } } };
  const out = tagByResource(doc);
  assert.deepEqual(out.paths['/v1/runs/{id}/spans'].get.tags, ['runs']);
  assert.deepEqual(out.paths['/v1/traces'].post.tags, ['traces']);
});
