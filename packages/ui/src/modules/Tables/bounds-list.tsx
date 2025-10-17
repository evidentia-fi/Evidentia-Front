'use client';

import React, { useState } from 'react';

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
import { useGetBondsMetadata } from '@workspace/ui/hooks';

import { formatDateStr, numberFormat } from '@workspace/utils/constants';

const BoundsListTable = ({ perPage = 6 }) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const { data } = useGetBondsMetadata({ page, perPage, url: '' });

  return (
    <Table withPagination page={page} totalPages={data?.num_pages ?? 0} handlePage={setPage}>
      <TableHeader>
        <TableRow>
          <TableHead>ISIN</TableHead>
          <TableHead>{t('TABLE.HEAD.COUNTRY')}</TableHead>
          <TableHead>{t('TABLE.HEAD.CURRENCY')}</TableHead>
          <TableHead>{t('TABLE.HEAD.PRINCIPAL')}</TableHead>
          <TableHead>{t('TABLE.HEAD.IN_COLLATERAL')}</TableHead>
          <TableHead>{t('TABLE.HEAD.MATURITY')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.data.map(bond => (
          <TableRow key={bond.id}>
            <TableCell>{bond.isin}</TableCell>
            <TableCell>{bond.country}</TableCell>
            <TableCell>UAH</TableCell>
            <TableCell>{numberFormat(bond.principal)} UAH</TableCell>
            <TableCell>
              {numberFormat(bond.nft_count, 0)} {t('PC')}
            </TableCell>
            <TableCell>{format(bond.maturity, formatDateStr)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BoundsListTable;
