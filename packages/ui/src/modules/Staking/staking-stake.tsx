'use client';

import React, { useState } from 'react';

import { BigNumber } from 'bignumber.js';
import { HandCoinsIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { parseUnits } from 'viem';

import AmountInput from '@workspace/ui/components/amount-input';
import { Button } from '@workspace/ui/components/button';
import { Card, CardTitle } from '@workspace/ui/components/card';
import CustomTab from '@workspace/ui/components/custom-tab';
import { FormItem } from '@workspace/ui/components/form';
import { Label } from '@workspace/ui/components/label';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { useGetApy } from '@workspace/ui/hooks';
import { useAccount } from '@workspace/ui/providers/account-provider';
import { useStake } from '@workspace/ui/providers/stake-provider';

import { numberFormat } from '@workspace/utils/constants';
import { useTabs } from '@workspace/utils/hooks';

const StakingStake = () => {
  const { t } = useTranslation();
  const { isConnected } = useAccount();
  const { decimals, stakedAmount, balance, symbol, allowance, handleStake, unstake, isLoading } =
    useStake();
  const [amount, setAmount] = useState('');
  const { data, isLoading: isLoadingApy } = useGetApy();

  const isAllowance = BigNumber(amount).lte(allowance);

  const tabs = [
    {
      label: t('STAKING.TAB.STAKE', { symbol }),
      id: 'stake',
    },
    {
      label: t('STAKING.TAB.UNSTAKE', { symbol }),
      id: 'unstake',
    },
  ];

  const { activeTabId, changeTab } = useTabs(tabs, {
    syncWithUrl: true,
    urlKey: 'tab',
  });

  const handleClick = () => {
    if (activeTabId === 'stake') {
      void handleStake({ amount: parseUnits(amount, decimals) });
    }
    if (activeTabId === 'unstake') {
      void unstake({ amount: parseUnits(amount, decimals) });
    }
  };

  const handleMaxClick = () => {
    if (activeTabId === 'stake') {
      setAmount(balance);
    }
    if (activeTabId === 'unstake') {
      setAmount(stakedAmount);
    }
  };

  const validateAmount = () => {
    if (!amount || BigNumber(0).gte(amount)) {
      return true;
    }

    if (activeTabId === 'stake') {
      return parseFloat(amount) > parseFloat(balance);
    }

    return parseFloat(amount) > parseFloat(stakedAmount);
  };

  return (
    <div className='grid gap-4 md:grid-cols-4'>
      <Card className='md:col-span-3'>
        {isConnected ? (
          <>
            <CustomTab
              tabs={tabs}
              className='mb-3'
              activeTabId={activeTabId}
              onTabChangeAction={changeTab}
            />
            <div className='mx-auto w-full max-w-[375px] space-y-4 md:space-y-12'>
              <FormItem>
                <Label htmlFor='stake-amount'>{t('LABEL.AMOUNT', { symbol })}</Label>
                <AmountInput
                  id='stake-amount'
                  value={amount}
                  onValueChange={values => setAmount(values.value)}
                  onMaxClick={handleMaxClick}
                  decimalScale={decimals}
                />
              </FormItem>
              <Button
                className={'w-full'}
                onClick={handleClick}
                isLoading={isLoading}
                disabled={validateAmount()}
              >
                {activeTabId === 'stake' ? (
                  <>{isAllowance ? t('BUTTON.STAKE') : t('BUTTON.APPROVE')}</>
                ) : (
                  t('BUTTON.UNSTAKE')
                )}
              </Button>
            </div>
          </>
        ) : (
          <div className='flex h-full w-full items-center justify-center p-4'>
            <div className='flex flex-col items-center gap-3'>
              <div className='bg-gray-25 flex size-[48px] items-center justify-center rounded-full border'>
                <HandCoinsIcon size={24} className='stroke-brand-600' />
              </div>
              <p className='max-w-[190px] text-center text-sm text-gray-500'>
                {t('STAKING.STAKE.CONNECT_WALLET')}
              </p>
            </div>
          </div>
        )}
      </Card>
      <Card>
        <CardTitle>{t('STAKING.STAKE.STAKING_APY')}</CardTitle>
        <div className='bg-gray-25 flex flex-col gap-y-2 rounded-md border p-4 md:gap-y-3'>
          <h5 className='text-sm font-medium text-gray-600'>{t('STAKING.STAKE.CURRENT_APY')}</h5>
          {isLoadingApy ? (
            <Skeleton className='h-6 w-20' />
          ) : (
            <p className='md:text-md text-sm font-semibold text-gray-900'>
              {numberFormat(data?.apy)}%
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default StakingStake;
