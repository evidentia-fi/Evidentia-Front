import React, { PropsWithChildren, useMemo } from 'react';

import { useAppKit, useAppKitAccount, useAppKitNetwork, useDisconnect } from '@reown/appkit/react';

import { AccountContext } from '@workspace/ui/providers/account-provider';

export const AccountProvider = ({ children }: PropsWithChildren) => {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  const { disconnect } = useDisconnect();
  const { chainId, caipNetwork } = useAppKitNetwork();

  return (
    <AccountContext.Provider
      value={useMemo(
        () => ({
          address,
          symbol: caipNetwork?.nativeCurrency?.symbol,
          networkName: caipNetwork?.name,
          explorerUrl: caipNetwork?.blockExplorers?.default?.url,
          chainId: Number(chainId),
          isConnected,
          loading: false,
          disconnect: async () => {
            disconnect();
          },
          connect: () => {
            open();
          },
          // Tron-related properties (not used in Solana app)
          addressTron: null,
          isConnectedTron: false,
          disconnectTron: async () => {},
          addAsset: async () => {},
          addAssetToTonLink: async () => {},
        }),
        [address, chainId, isConnected, disconnect],
      )}
    >
      {children}
    </AccountContext.Provider>
  );
};
