import Link from 'next/link';
import { Aurora } from '@/components/brand/aurora';

// NOTE: this landing page is still the Task-1 placeholder. <NavPill/> and
// <Footer/> are intentionally not assembled here yet — a later task owns
// the full landing composition. <Aurora/> is mounted as a smoke test that
// the brand backdrop compiles and renders behind the placeholder content.
export default function HomePage() {
  return (
    <div className="relative flex flex-col justify-center text-center flex-1">
      <Aurora />
      <div className="relative">
        <h1 className="text-2xl font-bold mb-4">Hello World</h1>
        <p>
          You can open{' '}
          <Link href="/docs" className="font-medium underline">
            /docs
          </Link>{' '}
          and see the documentation.
        </p>
      </div>
    </div>
  );
}
