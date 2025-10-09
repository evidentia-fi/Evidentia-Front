'use client';

import React from 'react';

import { useTranslation } from 'react-i18next';

import { Card, CardTitle } from '@workspace/ui/components/card';
import CentralisedExchangesTable from '@workspace/ui/modules/Tables/centralised-exchanges';
import { useStable } from '@workspace/ui/providers/stable-provider';

const DashboardCentralisedExchanges = () => {
  const { t } = useTranslation();
  const { symbol } = useStable();

  return (
    <Card>
      <CardTitle>{t('DASHBOARD.CENTRALISED_EXCHANGES.TITLE', { symbol })}</CardTitle>
      <CentralisedExchangesTable />
    </Card>
  );
};

export default DashboardCentralisedExchanges;
