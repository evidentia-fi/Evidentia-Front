'use client';

import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import StatusModal from '@workspace/ui/components/Modals/status';
import { Button } from '@workspace/ui/components/button';
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@workspace/ui/components/dialog';
import NumberInput from '@workspace/ui/components/number-input';
import { useAccount } from '@workspace/ui/providers/account-provider';
import { useMintContext } from '@workspace/ui/providers/mint-provider';
import { useModalState } from '@workspace/ui/stores/use-modal-state';

import { numberFormat } from '@workspace/utils/constants';

const WithdrawModal = () => {
  const { t } = useTranslation();
  const { closeModal, args } = useModalState(s => ({ closeModal: s.closeModal, args: s.args }));
  const [availableToUnstake, setSvailableToUnstake] = useState(0);
  const { address } = useAccount();
  const { withdrawNFT, availableToUnstakeAsync } = useMintContext();
  const { isin, nftId, status } = args;
  const [state, setState] = React.useState<number>();

  const insufficientFunds = state ? state > availableToUnstake : false;

  const isDisabled = insufficientFunds || state === undefined || state === 0;

  useEffect(() => {
    (async () => {
      if (!address || !nftId) return 0 as number;

      const result = await availableToUnstakeAsync(nftId);
      setSvailableToUnstake(result);
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
            {t('MODAL.WITHDRAW.TITLE')}
          </DialogTitle>
          <p className='text-sm text-gray-600'>ISIN: {isin}</p>
          <div className='space-y-0.5'>
            <NumberInput
              value={state}
              autoFocus={false}
              onValueChange={v => {
                setState(v.floatValue);
              }}
              handleIncrement={() => setState(ps => (ps ? ps + 1 : 1))}
              handleDecrement={() => setState(ps => (ps ? ps - 1 : 0))}
              classNameWrapper='max-w-[212px] mt-4'
            />
            <p className='text-sm text-gray-600'>
              {t('AVAILABLE')}: {numberFormat(availableToUnstake, 0)}
            </p>
          </div>
        </div>
        <DialogFooter className={'grid grid-cols-2'}>
          <Button variant='secondary' size='md' onClick={closeModal}>
            {t('BUTTON.CANCEL')}
          </Button>
          <Button
            onClick={() =>
              withdrawNFT({
                tokenId: BigInt(nftId!),
                amount: BigInt(state || 0),
              })
            }
            size='md'
            disabled={isDisabled}
          >
            {t('BUTTON.WITHDRAW')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawModal;
