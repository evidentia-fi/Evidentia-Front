'use client';

import React from 'react';

import Link from 'next/link';

import { useTranslation } from 'react-i18next';

import { Button } from '@workspace/ui/components/button';
import StakingApyChart from '@workspace/ui/modules/Charts/staking-apy-chart';
import SupplyChart from '@workspace/ui/modules/Charts/supply-chart';
import DashboardBondsList from '@workspace/ui/modules/Dashboard/dashboard-bonds-list';
import DashboardMainCards from '@workspace/ui/modules/Dashboard/dashboard-main-cards';

import { Routes } from '@workspace/utils/constants';

const DashboardMain = () => {
  const { t } = useTranslation();
  return (
    <div className='flex flex-col gap-y-4'>
      <Link href={Routes.STAKING}>
        <Button>{t('BUTTON.STAKE_NOW')}</Button>
      </Link>
      <DashboardMainCards />
      <SupplyChart />
      <StakingApyChart />
      <DashboardBondsList />
    </div>
  );
};

export default DashboardMain;
