export const DEFAULT_HOST = 'https://app.langprobe.com';
export const API_KEY_PLACEHOLDER = 'lt_YOUR_PUBLIC_ID.YOUR_SECRET';

export interface PlaygroundVars {
  host: string;
  apiKey: string;
}

export function injectVars(template: string, vars: Partial<PlaygroundVars>): string {
  const host = ((vars.host ?? '').trim() || DEFAULT_HOST).replace(/\/+$/, '');
  const apiKey = (vars.apiKey ?? '').trim() || API_KEY_PLACEHOLDER;
  return template.replaceAll('{{host}}', host).replaceAll('{{apiKey}}', apiKey);
}
