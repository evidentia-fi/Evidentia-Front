'use client';

import React from 'react';

import { BigNumber } from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import { parseUnits } from 'viem';

import StatusModal from '@workspace/ui/components/Modals/status';
import AmountInput from '@workspace/ui/components/amount-input';
import { Button } from '@workspace/ui/components/button';
import { Dialog, DialogContent, DialogTitle } from '@workspace/ui/components/dialog';
import { useMintContext } from '@workspace/ui/providers/mint-provider';
import { useModalState } from '@workspace/ui/stores/use-modal-state';

const RepayModal = () => {
  const [amount, setAmount] = React.useState('');
  const { decimals, isLoadingTransaction, totalDebt, balance, symbol, handleRepay } =
    useMintContext();
  const insufficientFunds = BigNumber(amount).gt(balance);
  const isMax = BigNumber(amount).gt(totalDebt);
  const disabledAll = BigNumber(totalDebt).gt(BigNumber(balance));

  const { t } = useTranslation();
  const { closeModal, args } = useModalState(s => ({ closeModal: s.closeModal, args: s.args }));
  const { status } = args;

  if (status) {
    return <StatusModal />;
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className='w-full lg:max-w-[400px]'>
        <DialogTitle className='text-center text-lg font-semibold text-gray-900'>
          {t('MODAL.REPAY.TITLE')}
        </DialogTitle>
        <div className='bg-gray-25 flex flex-col justify-stretch gap-4 rounded-lg border p-4'>
          <div className='flex flex-col items-center justify-center p-2'>
            <h4 className='text-sm font-medium text-gray-600'> {t('MODAL.REPAY.TOTAL_DEBT')}</h4>
            <p className='text-brand-600 text-base font-semibold'>
              {totalDebt} {symbol}
            </p>
          </div>
          <AmountInput
            id='mint-amount'
            value={amount}
            decimalScale={decimals}
            onValueChange={values => setAmount(values.value)}
            onMaxClick={() => setAmount(totalDebt)}
          />
          <div className={'grid-cols12 grid gap-2.5'}>
            <Button
              variant='secondary'
              disabled={
                !amount || BigNumber(0).gte(BigNumber(amount)) || insufficientFunds || isMax
              }
              size='md'
              isLoading={isLoadingTransaction}
              className={'w-full'}
              onClick={() =>
                handleRepay({
                  amount: parseUnits(amount, decimals),
                })
              }
            >
              {t('BUTTON.REPAY')}
            </Button>

            <Button
              size='md'
              onClick={() =>
                handleRepay({
                  amount: 0n,
                })
              }
              isLoading={isLoadingTransaction}
              disabled={disabledAll}
            >
              {t('BUTTON.REPAY_ALL')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RepayModal;
