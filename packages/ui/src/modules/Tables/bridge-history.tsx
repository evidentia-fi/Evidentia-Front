'use client';

import React from 'react';

import { EOftStatus, IContractEvent } from '@workspace/types';
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
import { cn } from '@workspace/ui/lib/utils';
import { ITableProps } from '@workspace/ui/modules/Tables/type';
import { useAccount } from '@workspace/ui/providers/account-provider';
import { useStable } from '@workspace/ui/providers/stable-provider';

import {
  destinationNetworkName,
  formatDateWithTimeStr,
  getContractEventTypeText,
  numberFormat,
} from '@workspace/utils/constants';

const BridgeHistoryTable = ({
  page,
  totalPages,
  handlePage,
  data,
}: ITableProps<IContractEvent>) => {
  const { t } = useTranslation();
  const { symbol } = useStable();
  const { explorerUrl } = useAccount();

  return (
    <Table withPagination page={page} totalPages={totalPages} handlePage={handlePage}>
      <TableHeader>
        <TableRow>
          <TableHead className='w-1/5'>{t('TABLE.HEAD.TX_HASH')}</TableHead>
          <TableHead>{t('TABLE.HEAD.DATE')}</TableHead>
          <TableHead>{t('TABLE.HEAD.DESTINATION_NETWORK')}</TableHead>
          <TableHead>{t('TABLE.HEAD.AMOUNT')}</TableHead>
          <TableHead>{t('TABLE.HEAD.TYPE')}</TableHead>
          <TableHead>{t('TABLE.HEAD.STATUS')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((item, index) => {
          const shortTxHash = item?.tx_hash
            ? `${item.tx_hash.slice(0, 6)}...${item.tx_hash.slice(-4)}`
            : '-';

          const destinationNetwork = item?.dstEid ?? item?.srcEid;

          return (
            <TableRow key={index}>
              <TableCell className='truncate'>
                <a
                  href={`${explorerUrl}/tx/${item?.tx_hash}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={cn(buttonVariants({ variant: 'link' }), 'text-sm!')}
                >
                  {shortTxHash}
                </a>
              </TableCell>
              <TableCell>{format(item.created_at, formatDateWithTimeStr)}</TableCell>
              <TableCell>
                {destinationNetwork ? destinationNetworkName[destinationNetwork] : '-'}
              </TableCell>
              <TableCell>
                {numberFormat(item.amount, 'auto')} {symbol}
              </TableCell>
              <TableCell>{getContractEventTypeText(item.type)}</TableCell>
              <TableCell>
                <Badge
                  variant='custom_colors'
                  size='large'
                  className={cn('uppercase', {
                    'text-success-700 bg-success-50 border-success-200':
                      item?.oft_status === EOftStatus.DELIVERED,
                    'border-gray-200 bg-gray-50 text-gray-700':
                      item?.oft_status === EOftStatus.BLOCKED,
                    'text-error-700 bg-error-50 border-error-200':
                      item?.oft_status === EOftStatus.FAILED,
                    'border-violet-200 bg-violet-50 text-violet-700':
                      item?.oft_status === EOftStatus.INFLIGHT,
                    'border-yellow-200 bg-yellow-50 text-yellow-700':
                      item?.oft_status === EOftStatus.PAYLOAD_STORED,
                  })}
                >
                  {item?.oft_status ?? '-'}
                </Badge>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default BridgeHistoryTable;
