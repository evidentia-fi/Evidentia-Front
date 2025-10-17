'use client';

import React from 'react';

import { useTranslation } from 'react-i18next';

import { useGetBonds } from '@workspace/ui/hooks';
import BoundsOwnedAndCollateralizedTable from '@workspace/ui/modules/Tables/owned-and-collateralized';
import { useAccount } from '@workspace/ui/providers/account-provider';

import { numberFormat } from '@workspace/utils/constants';

const MintOwnedAndCollateralized = () => {
  const { address } = useAccount();
  const { t } = useTranslation();
  const { data } = useGetBonds({
    page: 1,
    perPage: 1,
    wallet: address,
  });

  return (
    <div className='overflow-hidden rounded-lg border'>
      <h2 className='bg-brand-25 border-b px-4 py-1 text-sm font-semibold text-gray-800 md:text-base'>
        {t('MINT.OWNED_AND_COLLATERALIZED.TOTAL_OWNED')}: {numberFormat(data?.owned)} UAH
      </h2>
      <BoundsOwnedAndCollateralizedTable variant='supply' />
      <h2 className='bg-brand-25 border-b border-t px-4 py-1 text-sm font-semibold text-gray-800 md:text-base'>
        {t('MINT.OWNED_AND_COLLATERALIZED.TOTAL_COLLATERALIZED')}: {numberFormat(data?.nft_stake)}{' '}
        UAH
      </h2>
      <BoundsOwnedAndCollateralizedTable variant='withdraw' />
    </div>
  );
};

export default MintOwnedAndCollateralized;
