'use client';

import React from 'react';

import { IContractEvent } from '@workspace/types';
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
import { useStake } from '@workspace/ui/providers/stake-provider';

import { formatDateStr, getContractEventTypeText, numberFormat } from '@workspace/utils/constants';

const StakingHistoryTable = ({
  data,
  page,
  totalPages,
  handlePage,
}: ITableProps<IContractEvent>) => {
  const { t } = useTranslation();
  const { symbol } = useStake();

  return (
    <Table withPagination page={page} totalPages={totalPages} handlePage={handlePage}>
      <TableHeader>
        <TableRow>
          <TableHead>{t('TABLE.HEAD.DATE')}</TableHead>
          <TableHead>{t('TABLE.HEAD.TYPE')}</TableHead>
          <TableHead>{t('TABLE.HEAD.AMOUNT')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map(el => {
          return (
            <TableRow key={el.id}>
              <TableCell> {format(el.created_at, formatDateStr)}</TableCell>
              <TableCell>{getContractEventTypeText(el.type)}</TableCell>
              <TableCell>
                {numberFormat(el.amount, 'auto')} {symbol}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default StakingHistoryTable;
