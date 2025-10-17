import React from 'react';

import { useTranslation } from 'react-i18next';

import { Card, CardTitle } from '@workspace/ui/components/card';
import TransactionHistoryTable from '@workspace/ui/modules/Tables/transaction-history';

const DashboardTransactionHistory = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardTitle>{t('DASHBOARD.CARDS.TRANSACTION_HISTORY')}</CardTitle>
      <TransactionHistoryTable />
    </Card>
  );
};

export default DashboardTransactionHistory;
