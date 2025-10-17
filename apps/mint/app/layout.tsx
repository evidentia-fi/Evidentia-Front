import { ReactNode } from 'react';

import type { Metadata } from 'next';

import Providers from '@/providers';

export const metadata: Metadata = {
  title: 'Evidentia',
  description: 'Evidentia: Bridging TradFi and DeFi Through Bond Tokenization',
};

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <Providers>{children}</Providers>;
}
