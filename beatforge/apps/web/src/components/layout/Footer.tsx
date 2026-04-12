/**
 * @file src/components/layout/Footer.tsx
 * @description Footer with links and copyright.
 */

import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="container-max px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="text-lg font-bold text-primary mb-4">🎵 BeatForge</div>
            <p className="text-sm text-muted-foreground">
              The next-generation beat marketplace. Buy, sell, and discover beats with fair economics.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/beats" className="hover:text-primary transition-colors">Browse Beats</Link></li>
              <li><Link href="/producers" className="hover:text-primary transition-colors">Top Producers</Link></li>
              <li><Link href="/trending" className="hover:text-primary transition-colors">Trending</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <Separator className="mb-8" />

        <div className="text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} BeatForge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
