'use client';

import React, { useState } from 'react';

import { EContractEventType } from '@workspace/types';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { Badge } from '@workspace/ui/components/badge';
import { buttonVariants } from '@workspace/ui/components/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';
import { useGetEvents } from '@workspace/ui/hooks';
import { cn } from '@workspace/ui/lib/utils';
import { useAccount } from '@workspace/ui/providers/account-provider';

import { env } from '@workspace/utils/config';
import { ZERO_ADDRESS, formatDateStr, shortAddress } from '@workspace/utils/constants';

const TransactionHistoryTable = () => {
  const { t } = useTranslation();
  const { address, explorerUrl } = useAccount();
  const [page, setPage] = useState(1);

  const { data } = useGetEvents({
    page,
    perPage: 6,
    types: [EContractEventType.MINT],
    wallet: address,
  });

  return (
    <Table withPagination page={page} totalPages={0} handlePage={setPage}>
      <TableHeader>
        <TableRow>
          <TableHead>{t('TABLE.HEAD.DATE')}</TableHead>
          <TableHead>{t('TABLE.HEAD.ACTION')}</TableHead>
          <TableHead>eBond ID</TableHead>
          <TableHead>{t('TABLE.HEAD.TOKEN_ID')}</TableHead>
          <TableHead>{t('TABLE.HEAD.STATUS')}</TableHead>
          <TableHead>{t('TABLE.HEAD.PROOF')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.data?.map(el => (
          <TableRow key={el.id}>
            <TableCell>{format(el.created_at, formatDateStr)}</TableCell>
            <TableCell>
              {t(el.wallet_from === ZERO_ADDRESS ? 'MINT.ACTION.MINTED' : 'MINT.ACTION.BURN')}
            </TableCell>
            <TableCell>{shortAddress(env.NFT_ADDRESS)}</TableCell>
            <TableCell>{shortAddress(el.nft_id)}</TableCell>
            <TableCell>
              <Badge
                variant='custom_colors'
                size='large'
                className={cn('uppercase', {
                  'text-success-700 bg-success-50 border-success-200': el?.tx_status === 'success',
                })}
              >
                {el?.tx_status ?? '-'}
              </Badge>
            </TableCell>
            <TableCell>
              <a
                href={`${explorerUrl}/tx/${el?.tx_hash}`}
                target='_blank'
                rel='noopener noreferrer'
                className={buttonVariants({ variant: 'link' })}
              >
                {shortAddress(el.tx_hash)}
              </a>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TransactionHistoryTable;
