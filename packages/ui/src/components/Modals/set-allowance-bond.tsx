'use client';

import React from 'react';

import { useTranslation } from 'react-i18next';
import { Address } from 'viem';

import StatusModal from '@workspace/ui/components/Modals/status';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Dialog, DialogContent, DialogTitle } from '@workspace/ui/components/dialog';
import NumberInput from '@workspace/ui/components/number-input';
import { cn } from '@workspace/ui/lib/utils';
import { useAccount } from '@workspace/ui/providers/account-provider';
import { useMintNft } from '@workspace/ui/stores/use-mint-nft';
import { Emodal, useModalState } from '@workspace/ui/stores/use-modal-state';

import { shortAddress } from '@workspace/utils/constants';

const SetAllowanceModal = () => {
  const { t } = useTranslation();
  const { isConnected } = useAccount();
  const [state, setState] = React.useState<number | undefined>(undefined);
  const { openModal, closeModal, args } = useModalState(s => ({
    openModal: s.openModal,
    closeModal: s.closeModal,
    args: s.args,
  }));

  const { setAllowance } = useMintNft(store => ({
    setAllowance: store.setAllowance,
  }));

  const { status, issuer, nftId, isin, currentAllowance, totalAllowance } = args;

  if (status) {
    return <StatusModal />;
  }

  const handleSetAllowance = async () => {
    if (state === undefined || !nftId) return;

    try {
      await setAllowance(issuer as Address, BigInt(nftId), BigInt(state));
    } catch (error) {
      console.error('Error setting allowance:', error);
    }
  };

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className='w-full lg:max-w-[400px]'>
        <div className='flex flex-col items-center justify-center space-y-1'>
          <DialogTitle className='text-center text-lg font-semibold text-gray-900'>
            {t('MODAL.SET_ALLOWANCE.TITLE')}
          </DialogTitle>

          {[
            {
              label: t('FORM.ALLOWANCE_MANAGEMENT.ISSUER_ADDRESS'),
              value: issuer ? shortAddress(issuer) : '',
              id: 1,
            },
            {
              label: 'eBond ID',
              value: nftId ? shortAddress(nftId) : '',
              id: 2,
            },
            {
              label: 'ISIN',
              value: isin ?? '',
              id: 3,
            },
          ].map(({ label, value, id }) => (
            <div key={id} className='flex items-center gap-1'>
              <h4 className='block text-sm font-semibold'>{label}:</h4>
              <p className='text-sm text-gray-700'>{value}</p>
            </div>
          ))}
        </div>
        <div className='space-y-4'>
          <div className='space-y-1.5'>
            <p className='text-sm font-medium text-gray-700'>
              {t('MODAL.SET_ALLOWANCE.CURRENT_ALLOWANCE')}
            </p>
            <Badge size='large' className='rounded-full'>
              {currentAllowance}/{totalAllowance}
            </Badge>
          </div>
          <div className='space-y-1.5'>
            <p className='text-sm font-medium text-gray-700'>
              {t('MODAL.SET_ALLOWANCE.NEW_ALLOWANCE')}
            </p>
            <NumberInput
              value={state}
              autoFocus={false}
              onValueChange={v => {
                setState(v.floatValue);
              }}
              handleIncrement={() => setState(ps => (ps ? ps + 1 : 1))}
              handleDecrement={() => setState(ps => (ps ? ps - 1 : 0))}
            />
            <p className='text-sm text-gray-600'> {t('MODAL.SET_ALLOWANCE.NEW_ALLOWANCE_DESC')}</p>
          </div>
        </div>
        <div className={cn('grid w-full gap-3', [isConnected ? 'grid-cols-2' : 'grid-cols-1'])}>
          {isConnected ? (
            <>
              <Button
                type='reset'
                size='lg'
                className='w-full'
                variant='secondary'
                onClick={closeModal}
              >
                {t('BUTTON.CANCEL')}
              </Button>
              <Button
                type='submit'
                size='lg'
                className='w-full'
                disabled={state === undefined}
                onClick={handleSetAllowance}
              >
                {t('BUTTON.CONFIRM')}
              </Button>
            </>
          ) : (
            <Button type='button' size='lg' onClick={() => openModal(Emodal.WalletConnect)}>
              {t('BUTTON.CONNECT_WALLET')}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SetAllowanceModal;
