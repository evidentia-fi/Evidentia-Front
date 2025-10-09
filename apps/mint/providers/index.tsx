'use client';

import React, { PropsWithChildren, Suspense } from 'react';

import WalletConnectModal from '@/components/WalletConnectModal';
import { AccountProvider } from '@/providers/account-provider';
import { ContractServiceProvider } from '@/providers/contract-service-provider';
import MintNftProvider from '@/providers/mint-nft-provider';
import { StableProvider } from '@/providers/stable-provider';
import Web3Provider from '@/providers/web3-provider';

import RootLayout from '@workspace/ui/components/Layouts/RootLayout';
import TopMenuLayout from '@workspace/ui/components/Layouts/TopMenuLayout';
import { LanguageProvider } from '@workspace/ui/providers/language-provider';
import ModalsProvider from '@workspace/ui/providers/modals-provider';
import { Emodal, useModalState } from '@workspace/ui/stores/use-modal-state';

const Compose =
  (...providers: React.ComponentType<PropsWithChildren>[]) =>
  ({ children }: PropsWithChildren) =>
    providers.reduceRight((acc, Provider) => <Provider>{acc}</Provider>, children);

const AllProviders = Compose(
  RootLayout,
  Web3Provider,
  AccountProvider,
  StableProvider,
  ContractServiceProvider,
  MintNftProvider,
  LanguageProvider,
  TopMenuLayout,
);

const Providers = ({ children }: PropsWithChildren) => {
  const open = useModalState(s => s.open);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AllProviders>
        <ModalsProvider />
        {open === Emodal.WalletConnect && <WalletConnectModal />}
        {children}
      </AllProviders>
    </Suspense>
  );
};

export default Providers;
