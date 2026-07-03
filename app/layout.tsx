import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Plus_Jakarta_Sans, Geist_Mono } from 'next/font/google';

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
});

const mono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600'],
});

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen">
        {/*
          Static export (`output: 'export'`) has no server to answer
          per-query search requests, so the search dialog below is configured
          with `type: 'static'`: it uses Fumadocs' static Orama client, which
          fetches the pre-built index from /api/search (exported as a static
          JSON file at build time, see app/api/search/route.ts) and searches
          in-browser instead of hitting a dynamic API route.

          `theme` forces light mode only (per DESIGN.md): the app has no
          dark theme authored yet, so we must not let next-themes flip to
          the OS preference.
        */}
        <RootProvider
          search={{ options: { type: 'static' } }}
          theme={{ forcedTheme: 'light', enableSystem: false }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
