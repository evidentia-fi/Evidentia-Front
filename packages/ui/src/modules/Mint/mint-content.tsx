'use client';

import React from 'react';

import Link from 'next/link';

import { HandCoins } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@workspace/ui/components/button';
import { Card } from '@workspace/ui/components/card';
import { useGetBonds } from '@workspace/ui/hooks';
import MintAction from '@workspace/ui/modules/Mint/mint-action';
import MintBonds from '@workspace/ui/modules/Mint/mint-bonds';
import MintHistory from '@workspace/ui/modules/Mint/mint-history';
import { useAccount } from '@workspace/ui/providers/account-provider';

const MintContent = () => {
  const { address, isConnected } = useAccount();
  const { t } = useTranslation();
  const { data: bondsData } = useGetBonds({
    page: 1,
    perPage: 1,
    wallet: address,
  });

  const hasBonds = bondsData ? bondsData?.data?.length : false;

  if (!hasBonds || !isConnected) {
    return (
      <Card className='items-center justify-center py-10'>
        <div className='bg-gray-25 flex size-[48px] items-center justify-center rounded-full border'>
          <HandCoins size={24} className='stroke-brand-600' />
        </div>
        <p className='text-md text-center text-gray-500'>{t('MINT.CONNECT_WALLET.TITLE')}</p>
        <p className='text-md text-center text-gray-500'>
          {t('MINT.CONNECT_WALLET.CHECK_WITH')}{' '}
          <Link href=''>
            <Button variant='link' className=''>
              {t('BUTTON.COLLATERAL_HOLDER')}
            </Button>
          </Link>{' '}
          {t('OR')}{' '}
          <Link href=''>
            <Button variant='link' className=''>
              {t('BUTTON.READ_MORE_HERE')}{' '}
            </Button>
          </Link>
        </p>
      </Card>
    );
  }

  return (
    <div className='flex flex-col gap-y-4'>
      <MintAction />
      <MintBonds />
      <MintHistory />
    </div>
  );
};

export default MintContent;
