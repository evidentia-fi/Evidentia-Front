import React from 'react';

import { useTranslation } from 'react-i18next';

import { Card, CardTitle } from '@workspace/ui/components/card';
import AllowanceManagementForm from '@workspace/ui/modules/Forms/allowance-management';
import AllowanceManagementTable from '@workspace/ui/modules/Tables/allowance-management';

const DashboardAllowance = () => {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col gap-4'>
      <Card>
        <CardTitle className='hidden'>{t('DASHBOARD.CARDS.ALLOWANCE_MANAGEMENT')}</CardTitle>
        <AllowanceManagementForm />
      </Card>
      <Card>
        <CardTitle>{t('DASHBOARD.CARDS.ALLOWANCE_MANAGEMENT')}</CardTitle>
        <AllowanceManagementTable />
      </Card>
    </div>
  );
};

export default DashboardAllowance;
