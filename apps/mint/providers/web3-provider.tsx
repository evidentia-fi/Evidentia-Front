'use client';

import React, { PropsWithChildren } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, cookieToInitialState } from 'wagmi';

import { queryClient, wagmiConfig } from '@workspace/utils/config';

const Web3Provider = ({ children }: PropsWithChildren) => {
  const initialState = cookieToInitialState(wagmiConfig, 'cookies');

  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};

export default Web3Provider;
