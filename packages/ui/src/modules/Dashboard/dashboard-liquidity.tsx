'use client';

import React from 'react';

import Link from 'next/link';

import { useTranslation } from 'react-i18next';

import { Button } from '@workspace/ui/components/button';
import DashboardCentralisedExchanges from '@workspace/ui/modules/Dashboard/dashboard-centralised-exchanges';
import DashboardLendingMarkets from '@workspace/ui/modules/Dashboard/dashboard-lending-markets';
import DashboardLiquidityCards from '@workspace/ui/modules/Dashboard/dashboard-liquidity-cards';
import DashboardLiquidityPools from '@workspace/ui/modules/Dashboard/dashboard-liquidity-pools';

import { Routes } from '@workspace/utils/constants';

const DashboardLiquidity = () => {
  const { t } = useTranslation();
  return (
    <div className='flex flex-col gap-y-4'>
      <Link href={Routes.STAKING}>
        <Button>{t('BUTTON.STAKE_NOW')}</Button>
      </Link>

      <DashboardLiquidityCards />
      <DashboardLiquidityPools />
      <DashboardLendingMarkets />
      <DashboardCentralisedExchanges />
    </div>
  );
};

export default DashboardLiquidity;
