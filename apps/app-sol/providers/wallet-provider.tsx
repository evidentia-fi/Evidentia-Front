import React, { PropsWithChildren } from 'react';

import { SolanaAdapter } from '@reown/appkit-adapter-solana';
import { solanaDevnet } from '@reown/appkit/networks';
import { createAppKit } from '@reown/appkit/react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { QueryClientProvider } from '@tanstack/react-query';

import { metadata, projectId, queryClient } from '@workspace/utils/config';

const solanaWeb3JsAdapter = new SolanaAdapter({
  wallets: [new PhantomWalletAdapter()],
});

createAppKit({
  allWallets: 'HIDE',
  adapters: [solanaWeb3JsAdapter],
  includeWalletIds: ['a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393'],
  networks: [solanaDevnet],
  enableWalletGuide: false,
  allowUnsupportedChain: false,
  enableEmbedded: false,
  metadata,
  projectId,
  themeMode: 'light',
  features: {
    email: false,
    socials: false,
    swaps: false,
    onramp: false,
    send: false,
  },
  // wallets
  enableInjected: false,
  enableWalletConnect: false,
  enableCoinbase: false,
});

const WalletProvider = ({ children }: PropsWithChildren) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default WalletProvider;
