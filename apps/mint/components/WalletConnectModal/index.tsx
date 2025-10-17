'use client';

import React from 'react';

import WalletSelect from '@/components/WalletConnectModal/WalletSelect';
import { useTranslation } from 'react-i18next';
import { useConnect } from 'wagmi';

import { Dialog, DialogContent, DialogTitle } from '@workspace/ui/components/dialog';
import { useModalState } from '@workspace/ui/stores/use-modal-state';

import { ethNetwork } from '@workspace/utils/config';

const WalletConnectModal = () => {
  const { t } = useTranslation();
  const closeModal = useModalState(s => s.closeModal);

  const { connectors, connectAsync } = useConnect();
  return (
    <Dialog open={true} onOpenChange={closeModal}>
      <DialogContent className='w-full sm:max-w-[325px]'>
        <DialogTitle className='text-center text-xl font-semibold text-gray-900'>
          {t('MODAL.WALLET_CONNECT.TITLE')}
        </DialogTitle>
        <div className='flex flex-col gap-2'>
          {connectors.flatMap(connector => {
            return (
              <WalletSelect
                key={connector.id}
                onClick={async () => {
                  await connectAsync({ connector, chainId: ethNetwork.id });
                  closeModal();
                }}
                wallet={connector.id}
              >
                {connector.name === 'Injected' ? 'Browser Wallet' : connector.name}
              </WalletSelect>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnectModal;
