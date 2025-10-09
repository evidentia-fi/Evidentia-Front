'use client';

import * as React from 'react';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

import LandingLayout from '@workspace/ui/components/Layouts/Landing';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute='class'
      defaultTheme='light'
      disableTransitionOnChange
      enableColorScheme
    >
      <LandingLayout>{children}</LandingLayout>
    </NextThemesProvider>
  );
}
