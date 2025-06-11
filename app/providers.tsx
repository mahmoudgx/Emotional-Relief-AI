'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { ThemeProvider } from './components/theme-provider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
