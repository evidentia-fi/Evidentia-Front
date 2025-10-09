'use client';

import React from 'react';

import { EContractEventType, IContractEvent } from '@workspace/types';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';
import { ITableProps } from '@workspace/ui/modules/Tables/type';
import { useStable } from '@workspace/ui/providers/stable-provider';

import {
  formatDateWithTimeStr,
  getContractEventTypeText,
  numberFormat,
} from '@workspace/utils/constants';

const MintHistoryTable = ({ page, totalPages, handlePage, data }: ITableProps<IContractEvent>) => {
  const { t } = useTranslation();
  const { symbol } = useStable();

  return (
    <Table withPagination page={page} totalPages={totalPages} handlePage={handlePage}>
      <TableHeader>
        <TableRow>
          <TableHead>{t('TABLE.HEAD.DATE')}</TableHead>
          <TableHead>{t('TABLE.HEAD.TYPE')}</TableHead>
          <TableHead>{t('TABLE.HEAD.AMOUNT')}</TableHead>
          <TableHead>ISIN</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((item, index) => (
          <TableRow key={index}>
            <TableCell>{format(item.created_at, formatDateWithTimeStr)}</TableCell>
            <TableCell>{getContractEventTypeText(item.type)}</TableCell>
            <TableCell>
              {numberFormat(item.amount, 'auto')}{' '}
              {item.type === EContractEventType.NFT_STAKE ||
              item.type === EContractEventType.NFT_TRANSFER ||
              item.type === EContractEventType.NFT_UNSTAKE
                ? t('PC')
                : symbol}
            </TableCell>
            <TableCell>{item?.isin ?? '-'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MintHistoryTable;
