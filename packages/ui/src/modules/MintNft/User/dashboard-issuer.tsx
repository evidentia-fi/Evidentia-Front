import React from 'react';

import { useTranslation } from 'react-i18next';

import { Card, CardTitle } from '@workspace/ui/components/card';
import { useUserMint } from '@workspace/ui/hooks';
import { cn } from '@workspace/ui/lib/utils';
import DashboardBondNfts from '@workspace/ui/modules/MintNft/User/dashboard-bond-nfts';
import DashboardMintBond from '@workspace/ui/modules/MintNft/User/dashboard-mint-bond';
import { useAccount } from '@workspace/ui/providers/account-provider';

const DashboardIssuer = () => {
  const { address } = useAccount();
  const { t } = useTranslation();
  const { data, isLoading } = useUserMint({ wallet: address!, page: 1, perPage: 6 });

  const isAllowedToMint = Number(data?.total_available_mint) > 0;

  return (
    <div className='space-y-6'>
      <Card className='flex-row items-center'>
        <CardTitle>{t('STATUS')}</CardTitle>
        <p
          className={cn('text-sm font-semibold', [
            isAllowedToMint ? 'text-success-500' : 'text-error-600',
          ])}
        >
          {!isLoading &&
            t(
              isAllowedToMint ? 'DASHBOARD.STATUS.POSITIVE_DESC' : 'DASHBOARD.STATUS.NEGATIVE_DESC',
            )}
        </p>
      </Card>
      <DashboardMintBond />
      <DashboardBondNfts />
    </div>
  );
};

export default DashboardIssuer;
