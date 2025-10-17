'use client';

import React from 'react';

import { useTranslation } from 'react-i18next';

import { Card, CardTitle } from '@workspace/ui/components/card';
import BoundsListTable from '@workspace/ui/modules/Tables/bounds-list';

const DashboardBondsList = () => {
  const { t } = useTranslation();
  return (
    <Card>
      <CardTitle>{t('DASHBOARD.BOUND_LIST.TITLE')}</CardTitle>
      <BoundsListTable />
    </Card>
  );
};

export default DashboardBondsList;
