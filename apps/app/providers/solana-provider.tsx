'use client';

import React, { PropsWithChildren, useMemo } from 'react';

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';

import { solanaWallets } from '@workspace/utils/config';

const SOLANA_RPC_PATH = '/api/rpc/solana';

export const SolanaProvider = ({ children }: PropsWithChildren) => {
  // `@solana/web3.js` rejects relative endpoints, so the same-origin proxy has to be
  // resolved against `window.location`. During SSR there is no origin; the placeholder
  // is never requested (every Solana read happens in an effect or a callback) and the
  // endpoint is context-only, so it cannot cause a hydration mismatch.
  const endpoint = useMemo(
    () =>
      typeof window === 'undefined'
        ? `http://localhost${SOLANA_RPC_PATH}`
        : `${window.location.origin}${SOLANA_RPC_PATH}`,
    [],
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={solanaWallets} autoConnect={false}>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
};
