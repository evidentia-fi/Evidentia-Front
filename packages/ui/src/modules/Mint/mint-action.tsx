'use client';

import React, { useRef, useState } from 'react';

import { BigNumber } from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import { parseUnits } from 'viem';

import AmountInput from '@workspace/ui/components/amount-input';
import { Button } from '@workspace/ui/components/button';
import { Card, CardTitle } from '@workspace/ui/components/card';
import { FormItem } from '@workspace/ui/components/form';
import { Label } from '@workspace/ui/components/label';
import { useMintContext } from '@workspace/ui/providers/mint-provider';
import { Emodal, useModalState } from '@workspace/ui/stores/use-modal-state';

import { numberFormat } from '@workspace/utils/constants';

const MintAction = () => {
  const { t } = useTranslation();
  const { openModal } = useModalState(s => ({ openModal: s.openModal }));
  const [isMax, setIsMax] = useState(false);
  const inputChangeByMax = useRef(false);
  const [amount, setAmount] = useState('');
  const {
    totalBorrowed,
    interrest,
    interestRate,
    availableBorrow,
    decimals,
    isLoadingTransaction,
    symbol,
    borrow,
  } = useMintContext();
  const insufficientFunds = BigNumber(amount).gt(availableBorrow);

  return (
    <div className='grid gap-4 md:grid-cols-2'>
      <Card>
        <CardTitle>{t('MINT.ACTION.TITLE')}</CardTitle>
        <div className='flex w-full flex-1 flex-col justify-between gap-4'>
          <FormItem>
            <Label htmlFor='mint-amount'>{t('LABEL.AMOUNT', { symbol })}</Label>
            <AmountInput
              id='mint-amount'
              value={amount}
              decimalScale={2}
              onValueChange={values => {
                setAmount(values.value);
                if (!inputChangeByMax.current) {
                  setIsMax(false);
                }
                inputChangeByMax.current = false;
              }}
              onMaxClick={() => {
                inputChangeByMax.current = true;
                setAmount(numberFormat(availableBorrow));
                setIsMax(true);
              }}
            />
            <p className='text-sm text-gray-600'>
              {t('AVAILABLE')}: {numberFormat(availableBorrow)}{' '}
              <span className='font-semibold'>{symbol}</span>
            </p>
          </FormItem>
          <Button
            className={'w-full'}
            disabled={!amount || BigNumber(0).gte(BigNumber(amount)) || insufficientFunds}
            onClick={() => borrow({ amount: parseUnits(isMax ? '0' : amount, decimals) })}
            isLoading={isLoadingTransaction}
          >
            {t('BUTTON.MINT')}
          </Button>
        </div>
      </Card>
      <Card>
        <div className='flex items-start justify-between'>
          <CardTitle>{t('MINT.ACTION.DEBT_TITLE')}</CardTitle>
          <Button variant='secondaryColor' size='md' onClick={() => openModal(Emodal.Repay)}>
            {t('BUTTON.REPAY')}
          </Button>
        </div>
        <div className='bg-gray-25 grid grid-cols-2 gap-4 rounded-lg border p-4'>
          {[
            {
              label: t('MINT.ACTION.TOTAL_MINTED'),
              value: `${numberFormat(totalBorrowed)} ${symbol}`,
              id: 'total-minted',
            },
            {
              label: t('MINT.ACTION.INTEREST_RATE'),
              value: `${numberFormat(interestRate)}% APR`,
              id: 'interest-rate',
            },
            {
              label: t('MINT.ACTION.ACCRUED_INTEREST'),
              value: `${numberFormat(interrest)} ${symbol}`,
              id: 'accrued-interest',
            },
          ].map(item => (
            <div key={item.id}>
              <h5 className='text-sm font-medium text-gray-600'>{item.label}</h5>
              <p className='text-sm font-semibold text-gray-900 md:text-base'>{item.value}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default MintAction;
