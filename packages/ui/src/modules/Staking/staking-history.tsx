'use client';

import React, { useState } from 'react';

import { EContractEventType } from '@workspace/types';
import { useTranslation } from 'react-i18next';

import { Card, CardTitle } from '@workspace/ui/components/card';
import { useGetEvents } from '@workspace/ui/hooks';
import StakingHistoryTable from '@workspace/ui/modules/Tables/stakeng-history';
import { useAccount } from '@workspace/ui/providers/account-provider';

const StakingHistory = () => {
  const { t } = useTranslation();
  const { address } = useAccount();
  const [page, setPage] = useState(1);

  const { data } = useGetEvents({
    page,
    perPage: 6,
    types: [
      EContractEventType.STABLE_STAKE,
      EContractEventType.REWARD_CLAIM,
      // EContractEventType.STABLE_WITHDRAW,
      // EContractEventType.STABLE_TRANSFER,
    ],
    wallet: address,
  });

  return (
    <Card>
      <CardTitle>{t('STAKING.HISTORY.TITLE')}</CardTitle>
      <StakingHistoryTable
        data={data?.data ?? []}
        page={page}
        totalPages={data?.num_pages ?? 1}
        handlePage={setPage}
      />
    </Card>
  );
};

export default StakingHistory;
