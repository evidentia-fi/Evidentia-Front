'use client';

import { useState } from 'react';

import { EContractEventType } from '@workspace/types';
import { useTranslation } from 'react-i18next';

import { Card, CardTitle } from '@workspace/ui/components/card';
import { useGetEvents } from '@workspace/ui/hooks';
import MintHistoryTable from '@workspace/ui/modules/Tables/mint-history';
import { useAccount } from '@workspace/ui/providers/account-provider';

const MintHistory = () => {
  const { t } = useTranslation();
  const { address } = useAccount();

  const [page, setPage] = useState(1);

  const { data } = useGetEvents({
    page,
    perPage: 6,
    types: [
      EContractEventType.NFT_STAKE,
      EContractEventType.NFT_UNSTAKE,
      EContractEventType.BORROW,
      EContractEventType.REPAY,
    ],
    wallet: address,
  });

  return (
    <Card>
      <CardTitle>{t('MINT.HISTORY.TITLE')}</CardTitle>

      <MintHistoryTable
        page={page}
        totalPages={data?.num_pages ?? 1}
        handlePage={setPage}
        data={data?.data ?? []}
      />
    </Card>
  );
};

export default MintHistory;
