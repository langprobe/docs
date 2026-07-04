import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';

// The landing page (app/(home)/page.tsx) renders its own <NavPill/> — a
// bespoke sticky pill nav ported from the marketing design reference. To
// avoid stacking two navs on one page, the Fumadocs-provided HomeLayout nav
// is switched off here (`nav.enabled: false`) for every route under this
// layout group. baseOptions() (links/githubUrl/title) still feeds
// DocsLayout elsewhere, so the docs shell nav is unaffected.
export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <HomeLayout {...baseOptions()} nav={{ enabled: false }}>
      {children}
    </HomeLayout>
  );
}
