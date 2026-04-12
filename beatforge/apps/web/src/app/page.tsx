/**
 * @file src/app/page.tsx
 * @description BeatForge homepage / landing page.
 * Hero section, featured beats, CTA, value props.
 */

import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Music, TrendingUp, Lock, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'BeatForge – The Next-Gen Beat Marketplace',
  description:
    'Upload unlimited beats, buy from thousands of producers, fair royalties, human-made verification. The beat marketplace that fixes everything.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ============================================================
          NAVIGATION
          ============================================================ */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container-max px-4 py-3 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">🎵 BeatForge</div>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ============================================================
          HERO SECTION
          ============================================================ */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20 pointer-events-none" />

        <div className="container-max px-4 py-20 relative z-10 text-center">
          <div className="mb-8 inline-block">
            <Badge className="bg-primary/20 text-primary border-primary/30">
              🚀 The Future of Beat Commerce
            </Badge>
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-foreground">
            Buy or Sell Beats
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary">
              Without Compromise
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Unlimited free uploads. Zero bugs on mobile. Human-made verification. Fair
            economics. Real discovery. The beat marketplace that fixes everything.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/auth/register?role=producer">
              <Button size="lg" className="text-base h-12">
                Upload Beats <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/beats">
              <Button size="lg" variant="outline" className="text-base h-12">
                Browse Beats <Music className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">0%</div>
              <div className="text-sm text-muted-foreground">Upload Fees</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent">80%</div>
              <div className="text-sm text-muted-foreground">Producer Revenue</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary">100%</div>
              <div className="text-sm text-muted-foreground">Human-Made</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">∞</div>
              <div className="text-sm text-muted-foreground">No Upload Limits</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FEATURES SECTION
          ============================================================ */}
      <section className="border-t border-border bg-muted/50 py-20">
        <div className="container-max px-4">
          <h2 className="text-4xl font-display font-bold text-center mb-16">
            Why Choose BeatForge?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Music className="w-6 h-6" />,
                title: 'Unlimited Uploads',
                desc: 'No caps on beats. Upload your entire catalog free.',
              },
              {
                icon: <Lock className="w-6 h-6" />,
                title: 'Secure Licensing',
                desc: 'Flexible tiers. Exclusive, trackout, basic, and more.',
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: 'Real Discovery',
                desc: 'Advanced search, trending, and personalized feeds.',
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: 'Human Verification',
                desc: 'Community-driven quality. Verified producers stand out.',
              },
            ].map((feature, i) => (
              <div key={i} className="border border-border rounded-lg p-6 hover:border-primary transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          CTA SECTION
          ============================================================ */}
      <section className="py-20 border-t border-border">
        <div className="container-max px-4 text-center">
          <h2 className="text-4xl font-display font-bold mb-4">
            Ready to Join?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Whether you're a producer or collector, find your beats.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="text-base h-12">
              Get Started Now <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ============================================================
          FOOTER
          ============================================================ */}
      <footer className="border-t border-border bg-muted/50 py-12">
        <div className="container-max px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="text-lg font-bold text-primary mb-4">BeatForge</div>
              <p className="text-sm text-muted-foreground">
                The next-generation beat marketplace.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/beats" className="hover:text-primary">Browse Beats</Link></li>
                <li><Link href="/producers" className="hover:text-primary">Top Producers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/docs" className="hover:text-primary">Documentation</Link></li>
                <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-primary">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-primary">Terms</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} BeatForge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
