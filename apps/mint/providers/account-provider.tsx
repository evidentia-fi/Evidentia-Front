import React, { PropsWithChildren, useMemo } from 'react';

import { useAccount, useDisconnect, useWatchAsset } from 'wagmi';

import { AccountContext } from '@workspace/ui/providers/account-provider';
import { Emodal, useModalState } from '@workspace/ui/stores/use-modal-state';

import { env } from '@workspace/utils/config';

export const AccountProvider = ({ children }: PropsWithChildren) => {
  const { address, isConnected, chain, chainId } = useAccount();

  const { watchAsset } = useWatchAsset();

  const { openModal } = useModalState(s => ({ openModal: s.openModal }));
  const { disconnect } = useDisconnect();

  return (
    <AccountContext.Provider
      value={useMemo(
        () => ({
          address,
          addressTron: '',
          symbol: chain?.nativeCurrency?.symbol,
          networkName: chain?.name,
          explorerUrl: chain?.blockExplorers?.default?.url,
          chainId: Number(chainId),
          isConnected,
          isConnectedTron: false,
          loading: false,
          disconnect: async () => {
            disconnect();
          },
          disconnectTron: () => {},
          connect: () => openModal(Emodal.WalletConnect),
          addAsset: async ({ symbol, decimals }) => {
            if (!symbol || !decimals) return;
            watchAsset({
              type: 'ERC20',
              options: {
                address: env.STABLES_ADDRESS,
                symbol: symbol,
                decimals: decimals,
              },
            });
          },
          addAssetToTonLink: async () => {},
        }),
        [address, chainId, isConnected, disconnect, openModal, chain],
      )}
    >
      {children}
    </AccountContext.Provider>
  );
};
