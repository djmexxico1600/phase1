/**
 * @file src/components/layout/Header.tsx
 * @description Main header with navigation, search, and user menu.
 */

'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Menu, Search, ShoppingCart, Bell, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Header() {
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="container-max px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-bold text-xl text-primary flex items-center gap-2">
          🎵 <span className="hidden sm:inline">BeatForge</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 flex-1 ml-8">
          <Link
            href="/beats"
            className="text-sm hover:text-primary transition-colors"
          >
            Browse Beats
          </Link>
          <Link
            href="/producers"
            className="text-sm hover:text-primary transition-colors"
          >
            Producers
          </Link>
          {isAuthenticated && user?.role === 'producer' && (
            <Link
              href="/dashboard"
              className="text-sm hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Search + Actions */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Search */}
          <div className="hidden sm:flex items-center border border-border rounded-md px-3 py-2 bg-muted w-40">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search beats..."
              className="bg-transparent ml-2 outline-none w-full text-sm"
            />
          </div>

          {/* Cart */}
          {isAuthenticated && user?.role === 'buyer' && (
            <Button variant="ghost" size="icon">
              <ShoppingCart className="w-5 h-5" />
            </Button>
          )}

          {/* Notifications */}
          {isAuthenticated && (
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
          )}

          {/* Auth Buttons */}
          {!isAuthenticated ? (
            <div className="flex gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Avatar className="w-9 h-9">
                <AvatarImage src="" />
                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/beats" className="text-sm hover:text-primary">
                  Browse Beats
                </Link>
                <Link href="/producers" className="text-sm hover:text-primary">
                  Producers
                </Link>
                {isAuthenticated && user?.role === 'producer' && (
                  <Link href="/dashboard" className="text-sm hover:text-primary">
                    Dashboard
                  </Link>
                )}
                {!isAuthenticated && (
                  <>
                    <Link href="/auth/login">
                      <Button variant="ghost" className="w-full justify-start">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button className="w-full">Get Started</Button>
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Header;
