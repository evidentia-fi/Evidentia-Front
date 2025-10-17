'use client';

import React from 'react';

import { useTranslation } from 'react-i18next';

import CustomTab from '@workspace/ui/components/custom-tab';
import DashboardAllowance from '@workspace/ui/modules/MintNft/Admin/dashboard-allowance';
import DashboardNftSeriesCreation from '@workspace/ui/modules/MintNft/Admin/dashboard-nft-series-creation';
import DashboardStatusAndLogs from '@workspace/ui/modules/MintNft/Admin/dashboard-status-and-logs';

import { useTabs } from '@workspace/utils/hooks';

const DashboardAdminContent = () => {
  const { t } = useTranslation();

  const tabs = [
    {
      label: t('DASHBOARD.TAB.NFT_SERIES_CREATION'),
      id: 'nft_series_creation',
      content: <DashboardNftSeriesCreation />,
    },
    {
      label: t('DASHBOARD.TAB.ALLOWANCE'),
      id: 'allowance',
      content: <DashboardAllowance />,
    },
    {
      label: t('DASHBOARD.TAB.STATUS_AND_LOGS'),
      id: 'status_and_logs',
      content: <DashboardStatusAndLogs />,
    },
  ];

  const { activeTabId, changeTab } = useTabs(tabs, {
    syncWithUrl: true,
    urlKey: 'tab',
  });

  return <CustomTab tabs={tabs} activeTabId={activeTabId} onTabChangeAction={changeTab} />;
};

export default DashboardAdminContent;
