'use client';

import React from 'react';

import { useTranslation } from 'react-i18next';

import CustomTab from '@workspace/ui/components/custom-tab';
import DashboardIssuer from '@workspace/ui/modules/MintNft/User/dashboard-issuer';
import DashboardTransactionHistory from '@workspace/ui/modules/MintNft/User/dashboard-transaction-history';

import { useTabs } from '@workspace/utils/hooks';

const DashboardUserContent = () => {
  const { t } = useTranslation();

  const tabs = [
    {
      label: t('DASHBOARD.TAB.ISSUER_DASHBOARD'),
      id: 'issuer',
      content: <DashboardIssuer />,
    },
    {
      label: t('DASHBOARD.TAB.TRANSACTION_HISTORY'),
      id: 'transaction_history',
      content: <DashboardTransactionHistory />,
    },
  ];

  const { activeTabId, changeTab } = useTabs(tabs, {
    syncWithUrl: true,
    urlKey: 'dashboard',
  });

  return <CustomTab tabs={tabs} activeTabId={activeTabId} onTabChangeAction={changeTab} />;
};

export default DashboardUserContent;
