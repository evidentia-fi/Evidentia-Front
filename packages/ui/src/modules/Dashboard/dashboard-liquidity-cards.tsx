'use client';

import React from 'react';

import { useTranslation } from 'react-i18next';

import { GroupAvatar } from '@workspace/ui/components/avatar';
import { Card, CardDescription, CardTitle } from '@workspace/ui/components/card';
import { useLiquidity } from '@workspace/ui/providers/liquidity-provider';

const DashboardLiquidityCards = () => {
  const { t } = useTranslation();
  const { totalLiquidity, apy, protocols } = useLiquidity();

  const card = [
    { title: t('DASHBOARD.CARDS.TOTAL_LIQUIDITY'), value: totalLiquidity, id: 1 },
    { title: t('DASHBOARD.CARDS.AVERAGE_APY'), value: apy, id: 2 },
    {
      title: t('DASHBOARD.CARDS.PROTOCOLS'),
      value: protocols?.length > 0 ? <GroupAvatar avatars={protocols} /> : '-',
      id: 3,
    },
  ];

  return (
    <div className='grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4'>
      {card.map(card => (
        <Card className='flex flex-col justify-between' key={card.id}>
          <CardTitle className='max-md:text-sm'>{card.title}</CardTitle>
          <CardDescription>{card.value}</CardDescription>
        </Card>
      ))}
    </div>
  );
};

export default DashboardLiquidityCards;
