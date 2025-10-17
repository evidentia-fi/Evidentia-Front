'use client';

import { ReactNode } from 'react';

import { Bricolage_Grotesque, Montserrat } from 'next/font/google';

import { Providers } from '@/components/providers';

import '@workspace/ui/globals.css';

const fontBricolageGrotesque = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
});

const fontMontserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${fontBricolageGrotesque.variable} ${fontMontserrat.variable} ${fontMontserrat.className} bg-black font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
