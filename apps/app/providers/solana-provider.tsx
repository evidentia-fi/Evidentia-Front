'use client';

import React, { PropsWithChildren } from 'react';

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';

import { env, solanaWallets } from '@workspace/utils/config';

export const SolanaProvider = ({ children }: PropsWithChildren) => (
  <ConnectionProvider endpoint={env.SOLANA_RPC_URL}>
    <WalletProvider wallets={solanaWallets} autoConnect={false}>
      {children}
    </WalletProvider>
  </ConnectionProvider>
);
