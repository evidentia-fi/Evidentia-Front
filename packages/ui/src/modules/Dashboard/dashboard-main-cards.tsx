'use client';

import React from 'react';

import { useTranslation } from 'react-i18next';

import { Card, CardDescription, CardTitle } from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { useGetApy } from '@workspace/ui/hooks';
import { useStable } from '@workspace/ui/providers/stable-provider';

import { numberFormat } from '@workspace/utils/constants';

const DashboardMainCards = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useGetApy();
  const { symbol } = useStable();

  const card = [
    {
      title: t('DASHBOARD.CARDS.CIRCULATING_SUPPLY'),
      value: `${numberFormat(data?.total_borrowed)} ${symbol}`,
      id: 1,
    },
    { title: t('DASHBOARD.CARDS.STAKING_APR'), value: `${numberFormat(data?.apy)}%`, id: 2 },
    {
      title: t('DASHBOARD.CARDS.AMOUNT_STAKED'),
      value: `${numberFormat(data?.total_staked)} ${symbol}`,
      id: 3,
    },
    {
      title: t('DASHBOARD.CARDS.TOTAL_SYMBOL_HOLDERS', { symbol }),
      value: `${data?.holders} ${t('ACCOUNT.WALLETS')}`,
      id: 4,
    },
    {
      title: t('DASHBOARD.CARDS.TOTAL_ASSET_ISSUERS'),
      value: `${data?.issuers} ${t('ACCOUNT.WALLETS')}`,
      id: 5,
    },
    {
      title: t('DASHBOARD.CARDS.TOTAL_BONDS_IN_COLLATERAL'),
      value: `${numberFormat(data?.total_staked_nft)} ${t('PC')}`,
      id: 6,
    },
  ];
  return (
    <div className='grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4'>
      {card.map(card => (
        <Card className='flex flex-col justify-between' key={card.id}>
          <CardTitle className='max-md:text-sm'>{card.title}</CardTitle>
          <CardDescription>
            {isLoading ? (
              <Skeleton className='h-[20px] w-[100px]' />
            ) : (
              <>
                {card.value}{' '}
                {/*{card?.usd && <span className='text-brand-600'>{`($${card.usd} USD)`}</span>}*/}
              </>
            )}
          </CardDescription>
        </Card>
      ))}
    </div>
  );
};

export default DashboardMainCards;
