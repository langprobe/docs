import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { Curl } from '@/components/curl';
import { KindBadge } from '@/components/brand/kind-badge';
import { PlaygroundSettings } from '@/components/playground-settings';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Curl,
    KindBadge,
    PlaygroundSettings,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
