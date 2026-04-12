/**
 * @file src/app/not-found.tsx
 * @description 404 Not Found page.
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-7xl font-display font-bold text-primary mb-4">404</div>
        <h1 className="text-2xl font-bold mb-2">Page not found</h1>
        <p className="text-muted-foreground mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link href="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    </div>
  );
}
