import { describe, it, expect } from 'vitest';
import { injectVars, DEFAULT_HOST, API_KEY_PLACEHOLDER } from './playground-vars';

describe('injectVars', () => {
  it('replaces host and apiKey when both provided', () => {
    expect(injectVars('curl {{host}}/v1/runs -H "Authorization: Bearer {{apiKey}}"',
      { host: 'http://localhost:7080', apiKey: 'lt_a.b' }))
      .toBe('curl http://localhost:7080/v1/runs -H "Authorization: Bearer lt_a.b"');
  });
  it('falls back to DEFAULT_HOST when host is empty', () => {
    expect(injectVars('{{host}}/v1/traces', { host: '', apiKey: 'lt_a.b' }))
      .toBe(`${DEFAULT_HOST}/v1/traces`);
  });
  it('falls back to API_KEY_PLACEHOLDER when key unset', () => {
    expect(injectVars('Bearer {{apiKey}}', {})).toBe(`Bearer ${API_KEY_PLACEHOLDER}`);
  });
  it('strips trailing slashes from host', () => {
    expect(injectVars('{{host}}/v1/runs', { host: 'https://x.dev//' })).toBe('https://x.dev/v1/runs');
  });
  it('leaves templates without tokens unchanged', () => {
    expect(injectVars('docker compose up -d', {})).toBe('docker compose up -d');
  });
});
