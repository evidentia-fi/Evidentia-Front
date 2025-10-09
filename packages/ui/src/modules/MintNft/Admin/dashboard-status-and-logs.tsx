import React from 'react';

import { useTranslation } from 'react-i18next';

import { Card, CardTitle } from '@workspace/ui/components/card';
import IssuerActionsHistory from '@workspace/ui/modules/Tables/issuer-actions-history';

const DashboardStatusAndLogs = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardTitle>{t('DASHBOARD.CARDS.ISSUER_ACTIONS_HISTORY')}</CardTitle>

      <IssuerActionsHistory />
    </Card>
  );
};

export default DashboardStatusAndLogs;
