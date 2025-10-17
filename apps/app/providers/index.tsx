'use client';

import React, { PropsWithChildren, Suspense } from 'react';

import WalletConnectModal from '@/components/WalletConnectModal';
import { AccountProvider } from '@/providers/account-provider';
import { BridgeProvider } from '@/providers/bridge-provider';
import { ContractServiceProvider } from '@/providers/contract-service-provider';
import { LiquidityProvider } from '@/providers/liquidity-provider';
import { MintProvider } from '@/providers/mint-provider';
import { StableProvider } from '@/providers/stable-provider';
import { StakeProvider } from '@/providers/stake-provider';
import { TronWebProvider } from '@/providers/tron-provider';
import { TronTokenProvider } from '@/providers/tron-token-provider';
import Web3Provider from '@/providers/web3-provider';
import { Provider } from 'urql';

import MainLayout from '@workspace/ui/components/Layouts/MainLayout';
import RootLayout from '@workspace/ui/components/Layouts/RootLayout';
import { LanguageProvider } from '@workspace/ui/providers/language-provider';
import ModalsProvider from '@workspace/ui/providers/modals-provider';
import { Emodal, useModalState } from '@workspace/ui/stores/use-modal-state';

import { graphqlClient } from '@workspace/utils/graphql';

const Compose =
  (...providers: React.ComponentType<PropsWithChildren>[]) =>
  ({ children }: PropsWithChildren) =>
    providers.reduceRight((acc, Provider) => <Provider>{acc}</Provider>, children);

const AllProviders = Compose(
  RootLayout,
  TronWebProvider,
  Web3Provider,
  AccountProvider,
  ContractServiceProvider,
  TronTokenProvider,
  StableProvider,
  StakeProvider,
  MintProvider,
  BridgeProvider,
  LiquidityProvider,
  LanguageProvider,
  MainLayout,
);

const Providers = ({ children }: PropsWithChildren) => {
  const open = useModalState(s => s.open);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Provider value={graphqlClient}>
        <AllProviders>
          <ModalsProvider />
          {open === Emodal.WalletConnect && <WalletConnectModal />}
          {children}
        </AllProviders>
      </Provider>
    </Suspense>
  );
};

export default Providers;
