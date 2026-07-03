import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
});

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        {/*
          Static export (`output: 'export'`) has no server to answer
          per-query search requests, so the search dialog below is configured
          with `type: 'static'`: it uses Fumadocs' static Orama client, which
          fetches the pre-built index from /api/search (exported as a static
          JSON file at build time, see app/api/search/route.ts) and searches
          in-browser instead of hitting a dynamic API route.
        */}
        <RootProvider search={{ options: { type: 'static' } }}>{children}</RootProvider>
      </body>
    </html>
  );
}
