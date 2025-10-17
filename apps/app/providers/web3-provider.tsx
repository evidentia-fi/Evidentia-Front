'use client';

import React, { PropsWithChildren, useMemo } from 'react';

import { useTronWeb } from '@/providers/tron-provider';
import { QueryClientProvider } from '@tanstack/react-query';
import { WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks';
import { TronLinkAdapter, WalletConnectAdapter } from '@tronweb3/tronwallet-adapters';
import { WagmiProvider, cookieToInitialState } from 'wagmi';

import { env, isTestnet, metadata, queryClient, wagmiConfig } from '@workspace/utils/config';

const Web3Provider = ({ children }: PropsWithChildren) => {
  const initialState = cookieToInitialState(wagmiConfig, 'cookies');
  const tronWeb = useTronWeb();

  const adapters = useMemo(
    () => [
      new TronLinkAdapter(),
      new WalletConnectAdapter({
        network: isTestnet ? 'Shasta' : 'Mainnet',
        options: {
          relayUrl: 'wss://relay.walletconnect.com',
          projectId: env.REOWN_PROJECT_ID,
          metadata,
        },
      }),
    ],
    [],
  );

  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <WalletProvider
          adapters={adapters}
          disableAutoConnectOnLoad={true}
          autoConnect={false}
          onConnect={address => tronWeb.setAddress(address)}
        >
          {children}
        </WalletProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Web3Provider;
