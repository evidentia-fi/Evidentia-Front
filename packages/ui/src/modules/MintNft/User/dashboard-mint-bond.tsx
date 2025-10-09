import React, { useState } from 'react';

import { IUsersMint } from '@workspace/types';
import { useTranslation } from 'react-i18next';

import { Button } from '@workspace/ui/components/button';
import { Card, CardTitle } from '@workspace/ui/components/card';
import MintBondTable from '@workspace/ui/modules/Tables/mint-bond';
import { useMintNft } from '@workspace/ui/stores/use-mint-nft';

const DashboardMintBond = () => {
  const { t } = useTranslation();
  const [select, setSelect] = useState<IUsersMint>();

  const mint = useMintNft(s => s.mint);

  const isDisabled = !select || !select?.available_mint || Number(select?.available_mint) <= 0;

  return (
    <Card>
      <CardTitle>{t('DASHBOARD.MINT_BOND.TITLE')}</CardTitle>
      <div className='grid grid-cols-3 gap-3'>
        <div className='col-span-2'>
          <MintBondTable select={select} setSelect={setSelect} />
        </div>
        <div className='rounded-xl border bg-gray-50 px-4 py-3'>
          <p className='mb-1.5 text-sm text-gray-700'>
            {t('FORM.ALLOWANCE_MANAGEMENT.QUANTITY_TO_MINT')}
          </p>
          <div className='flex items-end gap-3'>
            <div className='border-input shadow-xs text-md flex h-11 w-full items-center rounded-md border bg-transparent px-3 py-1 text-gray-900'>
              {select?.available_mint ?? 0}
            </div>
            <Button
              disabled={isDisabled}
              size='lg'
              onClick={() => {
                void mint(BigInt(select?.nft_id ?? 0), BigInt(select?.available_mint ?? 0));
              }}
            >
              {t('BUTTON.MINT')}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DashboardMintBond;
