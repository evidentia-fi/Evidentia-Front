'use client';

import { PropsWithChildren } from 'react';

import { Inter } from 'next/font/google';

import '../../../styles/globals.css';

const fontInter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${fontInter.variable} ${fontInter.className} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

export default RootLayout;
