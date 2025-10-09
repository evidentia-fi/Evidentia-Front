'use client';

import React, { useState } from 'react';

import { EContractEventType } from '@workspace/types';
import { useTranslation } from 'react-i18next';

import { Card, CardTitle } from '@workspace/ui/components/card';
import { useGetEvents } from '@workspace/ui/hooks';
import BridgeHistoryTable from '@workspace/ui/modules/Tables/bridge-history';
import { useAccount } from '@workspace/ui/providers/account-provider';

const BridgeHistory = () => {
  const { t } = useTranslation();
  const { address } = useAccount();

  const [page, setPage] = useState(1);

  const { data } = useGetEvents({
    page,
    perPage: 6,
    types: [EContractEventType.OFT_SEND, EContractEventType.OFT_RECEIVED],
    wallet: address,
  });

  return (
    <Card>
      <CardTitle>{t('MINT.HISTORY.TITLE')}</CardTitle>
      <BridgeHistoryTable
        page={page}
        totalPages={data?.num_pages ?? 1}
        handlePage={setPage}
        data={data?.data ?? []}
      />
    </Card>
  );
};

export default BridgeHistory;
