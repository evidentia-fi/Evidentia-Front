'use client';

import React from 'react';

import { useTranslation } from 'react-i18next';

import { Button } from '@workspace/ui/components/button';
import { Card, CardTitle } from '@workspace/ui/components/card';
import { useStake } from '@workspace/ui/providers/stake-provider';

import { numberFormat } from '@workspace/utils/constants';

const StakingStats = () => {
  const { t } = useTranslation();
  const { totalStaked, stakedAmount, reward, symbol, claimReward } = useStake();

  const stats = [
    {
      label: t('STAKING.STATS.TOTAL_STAKED'),
      value: `${numberFormat(totalStaked)} ${symbol}`,
    },
    {
      label: t('STAKING.STATS.YOUR_STAKED'),
      value: `${numberFormat(stakedAmount)} ${symbol}`,
    },
    { label: t('STAKING.STATS.REWARDS'), value: `${numberFormat(reward)} ${symbol}` },
  ];

  return (
    <Card>
      <div className='flex items-center justify-between'>
        <CardTitle>{t('STAKING.STATS.TITLE')}</CardTitle>
        <Button
          size='md'
          variant='secondaryColor'
          disabled={Number(reward) <= 0}
          onClick={claimReward}
        >
          {t('BUTTON.CLAIM_REWARDS')}
        </Button>
      </div>
      <div className='bg-gray-25 shadow-xs grid grid-cols-2 justify-between gap-4 rounded-md border p-4 md:grid-cols-3 md:gap-8'>
        {stats.map(stat => (
          <div className='flex flex-col gap-1' key={stat.label}>
            {<h4 className='text-sm font-medium text-gray-600'>{stat.label}</h4>}
            {<p className='md:text-md text-sm font-semibold text-gray-900'>{stat.value}</p>}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default StakingStats;
