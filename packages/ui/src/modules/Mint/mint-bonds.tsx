'use client';

import React from 'react';

import { useTranslation } from 'react-i18next';

import { Card, CardTitle } from '@workspace/ui/components/card';
import CustomTab from '@workspace/ui/components/custom-tab';
import MintOwnedAndCollateralized from '@workspace/ui/modules/Mint/mint-owned-and-collateralized';
import BoundsListTable from '@workspace/ui/modules/Tables/bounds-list';

import { useTabs } from '@workspace/utils/hooks';

const MintBonds = () => {
  const { t } = useTranslation();

  const tabs = [
    {
      label: t('MINT.TAB.OWNED_AND_COLLATERALIZED'),
      id: 'owned_and_collateralized',
      content: <MintOwnedAndCollateralized />,
    },
    {
      label: t('MINT.TAB.BONDS_LIST'),
      id: 'bonds_list',
      content: <BoundsListTable />,
    },
  ];

  const { activeTabId, changeTab } = useTabs(tabs, {
    syncWithUrl: true,
    urlKey: 'bonds',
  });

  return (
    <Card>
      <CardTitle>{t('MINT.BONDS.TITLE')}</CardTitle>
      <CustomTab
        tabs={tabs}
        activeTabId={activeTabId}
        onTabChangeAction={changeTab}
        className='mb-3'
      />
    </Card>
  );
};

export default MintBonds;
