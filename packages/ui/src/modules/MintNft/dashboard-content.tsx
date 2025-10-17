'use client';

import React from 'react';

import { useTranslation } from 'react-i18next';

import { Card, CardTitle } from '@workspace/ui/components/card';
import NoConnect from '@workspace/ui/components/no-connect';
import DashboardAdminContent from '@workspace/ui/modules/MintNft/Admin/dashboard-content';
import DashboardUserContent from '@workspace/ui/modules/MintNft/User/dashboard-content';
import { useAccount } from '@workspace/ui/providers/account-provider';
import { useMintNft } from '@workspace/ui/stores/use-mint-nft';

const DashboardMintNftContent = () => {
  const { t } = useTranslation();
  const { isAdmin, owner } = useMintNft(s => ({
    isAdmin: s.isAdmin,
    owner: s.owner,
  }));

  const { isConnected } = useAccount();

  const isUserConnected = isConnected && owner;

  return (
    <Card>
      {isUserConnected ? (
        <>
          <CardTitle className='max-md:text-sm'>{t('DASHBOARD.TITLE')}</CardTitle>
          {isAdmin ? <DashboardAdminContent /> : <DashboardUserContent />}
        </>
      ) : (
        <NoConnect />
      )}
    </Card>
  );
};

export default DashboardMintNftContent;
