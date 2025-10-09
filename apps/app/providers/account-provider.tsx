import React, { PropsWithChildren, useMemo } from 'react';

import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { useAccount, useDisconnect, useWatchAsset } from 'wagmi';

import { AccountContext } from '@workspace/ui/providers/account-provider';
import { Emodal, useModalState } from '@workspace/ui/stores/use-modal-state';

import { env } from '@workspace/utils/config';

export const AccountProvider = ({ children }: PropsWithChildren) => {
  const { address, isConnected, chain, chainId } = useAccount();

  const { watchAsset } = useWatchAsset();
  const {
    address: addressTron,
    connected: isConnectedTron,
    disconnect: disconnectTron,
  } = useWallet();

  const { openModal } = useModalState(s => ({ openModal: s.openModal }));
  const { disconnect } = useDisconnect();

  const addAssetToTonLink = async ({ symbol, decimals }: { symbol: string; decimals: number }) => {
    try {
      if (!window.tronLink || !window.tronWeb) {
        throw new Error('TronLink does not exist or TronWeb is not initialized.');
      }

      await window.tronLink.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'TRC20',
          options: {
            address: env.TRON_ADDRESS,
            symbol: symbol,
            decimals: decimals,
          },
        },
      });
    } catch (error) {
      console.error('Error adding USDT token:', error);
    }
  };

  return (
    <AccountContext.Provider
      value={useMemo(
        () => ({
          address,
          addressTron,
          symbol: chain?.nativeCurrency?.symbol,
          networkName: chain?.name,
          explorerUrl: chain?.blockExplorers?.default?.url,
          chainId: Number(chainId),
          isConnected,
          isConnectedTron: isConnectedTron,
          loading: false,
          disconnect: async () => {
            disconnect();
          },
          disconnectTron,
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
          addAssetToTonLink,
        }),
        [
          address,
          chainId,
          isConnected,
          disconnect,
          disconnectTron,
          openModal,
          chain,
          addressTron,
          isConnectedTron,
        ],
      )}
    >
      {children}
    </AccountContext.Provider>
  );
};
