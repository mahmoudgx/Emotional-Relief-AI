'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ThemeToggle } from './ui/theme-toggle';
import { Button } from './ui/button';

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-6 md:px-8">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Emotional Relief AI</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
              About
            </Link>
            {session && (
              <Link href="/chat" className="text-sm font-medium transition-colors hover:text-primary">
                Chat
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {status === 'authenticated' ? (
            <div className="flex items-center gap-4">
              <span className="text-sm hidden md:inline-block">
                {session.user?.name || session.user?.email}
              </span>
              <Button asChild variant="outline" size="sm">
                <Link href="/api/auth/signout">Sign Out</Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
