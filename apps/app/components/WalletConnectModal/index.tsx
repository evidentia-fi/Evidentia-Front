'use client';

import React, { useState } from 'react';

import NetworkSelect from '@/components/WalletConnectModal/NetworkSelect';
import WalletSelect from '@/components/WalletConnectModal/WalletSelect';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { useTranslation } from 'react-i18next';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

import { Button } from '@workspace/ui/components/button';
import { Dialog, DialogContent, DialogTitle } from '@workspace/ui/components/dialog';
import { toast } from '@workspace/ui/components/sonner';
import { useModalState } from '@workspace/ui/stores/use-modal-state';

import { ethNetwork } from '@workspace/utils/config';

const WalletConnectModal = () => {
  const { t } = useTranslation();
  const [type, setType] = useState<'evm' | 'tron' | null>(null);
  const closeModal = useModalState(s => s.closeModal);

  const {
    wallets,
    select,
    connect,
    connected: isConnectedTron,
    address: addressTron,
    disconnect: disconnectTron,
    connecting: connectingTron,
    wallet,
  } = useWallet();

  const { address: addressEvm, isConnected, connector: connectorConnectedEvm } = useAccount();
  const { disconnect: disconnectEvm } = useDisconnect();
  const { connectors, connectAsync } = useConnect();
  return (
    <Dialog open={true} onOpenChange={closeModal}>
      <DialogContent className='w-full sm:max-w-[325px]'>
        <DialogTitle className='text-center text-xl font-semibold text-gray-900'>
          {t('MODAL.WALLET_CONNECT.TITLE')}
        </DialogTitle>
        <div className='flex flex-col gap-2'>
          {type === 'evm' &&
            connectors.flatMap(connector => {
              return (
                <WalletSelect
                  key={connector.id}
                  onClick={async () => {
                    await connectAsync({ connector, chainId: ethNetwork.id });
                    if (
                      connector?.id === 'walletConnect' &&
                      wallet &&
                      wallet.state === 'Connected' &&
                      wallet.adapter.name === 'WalletConnect'
                    ) {
                      await disconnectTron();
                      toast.info(
                        t('INFO.WALLETCONNECT.DICONNECTED', {
                          network: 'TRON',
                        }),
                      );
                    }
                    closeModal();
                  }}
                  wallet={connector.id}
                >
                  {connector.name === 'Injected' ? 'Browser Wallet' : connector.name}
                </WalletSelect>
              );
            })}
          {type === 'tron' && (
            <div className='flex flex-col items-end gap-2'>
              {wallets.flatMap(wallet => (
                <WalletSelect
                  className='w-full'
                  key={wallet?.adapter?.name}
                  onClick={async () => {
                    select(wallet?.adapter?.name);
                  }}
                  wallet={wallet?.adapter?.name}
                  urlIcon={wallet?.adapter?.icon}
                >
                  {wallet?.adapter?.name}
                </WalletSelect>
              ))}
              {wallet?.adapter?.name && (
                <Button
                  variant='secondary'
                  onClick={async () => {
                    await connect();
                    if (
                      connectorConnectedEvm &&
                      wallet?.adapter?.name === 'WalletConnect' &&
                      connectorConnectedEvm.id === 'walletConnect'
                    ) {
                      disconnectEvm();
                      toast.info(
                        t('INFO.WALLETCONNECT.DICONNECTED', {
                          network: 'EVM',
                        }),
                      );
                    }
                    closeModal();
                  }}
                  className='bg-success-300 hover:bg-success-500 w-[150px]'
                  isLoading={connectingTron}
                >
                  <img src={wallet?.adapter?.icon} alt={wallet?.adapter?.name} className='size-4' />
                  {t('BUTTON.CONNECT')}
                </Button>
              )}
            </div>
          )}

          {!type &&
            [
              {
                name: 'Ethereum',
                symbol: 'eth',
                open: () => {
                  setType('evm');
                },
                isConnected: isConnected,
                address: addressEvm,
                disconnect: async () => {
                  await disconnectEvm();
                },
              },
              {
                name: 'Tron',
                symbol: 'trx',

                open: () => {
                  setType('tron');
                },
                isConnected: isConnectedTron,
                address: addressTron,
                disconnect: async () => {
                  await disconnectTron();
                },
              },
            ].map(chain => <NetworkSelect {...chain} key={chain.name} />)}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnectModal;
