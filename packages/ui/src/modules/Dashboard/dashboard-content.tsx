'use client';

import React from 'react';

import { useTranslation } from 'react-i18next';

import { useTabs } from '@workspace/utils/hooks';

import CustomTab from '../../components/custom-tab';
import DashboardLiquidity from './dashboard-liquidity';
import DashboardMain from './dashboard-main';

const DashboardContent = () => {
  const { t } = useTranslation();
  const tabs = [
    {
      label: t('DASHBOARD.TAB.MAIN'),
      id: 'main',
      content: <DashboardMain />,
    },
    {
      label: t('DASHBOARD.TAB.LIQUIDITY'),
      id: 'liquidity',
      content: <DashboardLiquidity />,
    },
  ];

  const { activeTabId, changeTab } = useTabs(tabs, {
    syncWithUrl: true,
    urlKey: 'tab',
  });

  return <CustomTab tabs={tabs} activeTabId={activeTabId} onTabChangeAction={changeTab} />;
};

export default DashboardContent;
