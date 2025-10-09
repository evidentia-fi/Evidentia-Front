'use client';

import React from 'react';

import { useTranslation } from 'react-i18next';

import { Card, CardTitle } from '@workspace/ui/components/card';
import LendingMarketsTable from '@workspace/ui/modules/Tables/lending-markets';
import { useStable } from '@workspace/ui/providers/stable-provider';

const DashboardLendingMarkets = () => {
  const { t } = useTranslation();
  const { symbol } = useStable();

  return (
    <Card>
      <CardTitle>{t('DASHBOARD.LENDING_MARKETS.TITLE', { symbol })}</CardTitle>
      <LendingMarketsTable />
    </Card>
  );
};

export default DashboardLendingMarkets;
