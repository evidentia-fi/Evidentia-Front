'use client';

import React from 'react';

import { useTranslation } from 'react-i18next';

import { Card, CardTitle } from '@workspace/ui/components/card';
import LiquidityPoolsEUAH from '@workspace/ui/modules/Tables/liquidity-pools-euah';
import { useStable } from '@workspace/ui/providers/stable-provider';

const DashboardLiquidityPools = () => {
  const { t } = useTranslation();
  const { symbol } = useStable();

  return (
    <Card>
      <CardTitle>{t('DASHBOARD.LIQUIDITY_POOLS.TITLE', { symbol })}</CardTitle>
      <LiquidityPoolsEUAH />
    </Card>
  );
};

export default DashboardLiquidityPools;
