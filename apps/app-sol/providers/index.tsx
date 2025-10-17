'use client';

import React, { PropsWithChildren, Suspense } from 'react';

import { AccountProvider } from '@/providers/account-provider';
import { ContractServiceProvider } from '@/providers/contract-service-provider';
import { LiquidityProvider } from '@/providers/liquidity-provider';
import { MintProvider } from '@/providers/mint-provider';
import { StakeProvider } from '@/providers/stake-provider';
import WalletProvider from '@/providers/wallet-provider';

import MainLayout from '@workspace/ui/components/Layouts/MainLayout';
import RootLayout from '@workspace/ui/components/Layouts/RootLayout';
import { LanguageProvider } from '@workspace/ui/providers/language-provider';
import ModalsProvider from '@workspace/ui/providers/modals-provider';

import { StableProvider } from './stable-provider';

const Compose =
  (...providers: React.ComponentType<PropsWithChildren>[]) =>
  ({ children }: PropsWithChildren) =>
    providers.reduceRight((acc, Provider) => <Provider>{acc}</Provider>, children);

const AllProviders = Compose(
  WalletProvider,
  AccountProvider,
  ContractServiceProvider,
  StableProvider,
  StakeProvider,
  MintProvider,
  LiquidityProvider,
  RootLayout,
  LanguageProvider,
  MainLayout,
);

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AllProviders>
        <ModalsProvider />
        {children}
      </AllProviders>
    </Suspense>
  );
};

export default Providers;
