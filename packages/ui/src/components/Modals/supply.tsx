'use client';

import React, { useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import StatusModal from '@workspace/ui/components/Modals/status';
import { Button } from '@workspace/ui/components/button';
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@workspace/ui/components/dialog';
import NumberInput from '@workspace/ui/components/number-input';
import { useAccount } from '@workspace/ui/providers/account-provider';
import { useMintContext } from '@workspace/ui/providers/mint-provider';
import { useModalState } from '@workspace/ui/stores/use-modal-state';

import { numberFormat } from '@workspace/utils/constants';

const SupplyModal = () => {
  const [state, setState] = React.useState<number>();
  const [availableToStake, setSvailableToStake] = React.useState(0);
  const { handleSupplyNFT, isLoadingTransaction, availableToStakeAsync, isApprovedForAll } =
    useMintContext();
  const { address } = useAccount();

  const { t } = useTranslation();
  const { closeModal, args } = useModalState(s => s);
  const { isin, nftId, status } = args;

  const handleStateChange = (d: 'inc' | 'dec') => {
    if (d === 'inc') {
      setState(ps => (ps ? ps + 1 : 1));
    } else {
      setState(ps => (ps ? ps - 1 : 0));
    }
  };

  const isDisabled = state === undefined || state === 0 || state > availableToStake;

  useEffect(() => {
    (async () => {
      if (!address || !nftId) return;

      const result = await availableToStakeAsync(nftId);
      setSvailableToStake(result);
    })();
  }, []);

  if (status) {
    return <StatusModal />;
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className='w-full lg:max-w-[400px]'>
        <div className='flex flex-col items-center gap-1'>
          <DialogTitle className='text-lg font-semibold text-gray-900'>
            {t('MODAL.SUPPLY.TITLE')}
          </DialogTitle>
          <p className='text-sm text-gray-600'>ISIN: {isin}</p>
          <div className='space-y-0.5'>
            <NumberInput
              value={state}
              autoFocus={false}
              onValueChange={v => {
                setState(v.floatValue);
              }}
              handleIncrement={() => handleStateChange('inc')}
              handleDecrement={() => handleStateChange('dec')}
              classNameWrapper='max-w-[212px] mt-4'
            />
            <p className='text-sm text-gray-600'>
              {t('AVAILABLE')}: {numberFormat(availableToStake, 0)}
            </p>
          </div>
        </div>
        <DialogFooter className={'grid grid-cols-2'}>
          <Button variant='secondary' size='md' onClick={closeModal}>
            {t('BUTTON.CANCEL')}
          </Button>
          <Button
            onClick={() =>
              handleSupplyNFT({
                tokenId: BigInt(nftId!),
                amount: BigInt(state || 0),
              })
            }
            size='md'
            disabled={isDisabled}
            isLoading={isLoadingTransaction}
          >
            {isApprovedForAll ? t('BUTTON.SUPPLY') : t('BUTTON.APPROVE')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SupplyModal;
