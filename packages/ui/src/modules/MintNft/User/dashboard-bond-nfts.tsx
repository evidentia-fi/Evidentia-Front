import React from 'react';

import { useTranslation } from 'react-i18next';

import { Card, CardTitle } from '@workspace/ui/components/card';
import CustomTab from '@workspace/ui/components/custom-tab';
import UserBondNfts from '@workspace/ui/modules/Tables/user-bond-nfts';

import { useTabs } from '@workspace/utils/hooks';

const DashboardBondNfts = () => {
  const { t } = useTranslation();

  const tabs = [
    {
      label: t('DASHBOARD.TAB.BOND_ACTIVE'),
      id: 'active',
      content: <UserBondNfts type='active' />,
    },
    {
      label: t('DASHBOARD.TAB.BOND_REDEEMED'),
      id: 'redeemed',
      content: <UserBondNfts type='redeemed' />,
    },
  ];

  const { activeTabId, changeTab } = useTabs(tabs, {
    syncWithUrl: true,
    urlKey: 'bond_nfts',
  });

  return (
    <Card>
      <CardTitle>eBond</CardTitle>
      <CustomTab tabs={tabs} activeTabId={activeTabId} onTabChangeAction={changeTab} />
    </Card>
  );
};

export default DashboardBondNfts;
