'use client';

import React, { PropsWithChildren, useMemo } from 'react';

import { useTronWeb } from '@/providers/tron-provider';
import { SolanaProvider } from '@/providers/solana-provider';
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
          // Without a prefix this SignClient shares one global Core and one set of
          // keychain/pairing/session keys with the Solana provider, so the two clobber
          // each other's sessions. The EVM connector already uses the `wagmi` prefix.
          customStoragePrefix: 'tron',
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
          // The adapter is rebuilt on every page load with an empty state and exposes no
          // separate restore call, so `connect()` is the only rehydration path it has:
          // `WalletConnectWallet.connect()` reuses an acknowledged session straight from
          // storage and only falls back to pairing when there is none. `WalletProvider`
          // makes that call on load only when auto-connect is on and not deferred, which
          // is why the previous flags left every reload disconnected.
          autoConnect={true}
          disableAutoConnectOnLoad={false}
          onConnect={address => tronWeb.setAddress(address)}
        >
          <SolanaProvider>{children}</SolanaProvider>
        </WalletProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Web3Provider;
