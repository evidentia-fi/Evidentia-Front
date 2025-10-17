'use client';

import React, { useState } from 'react';

import Link from 'next/link';

import { ExchangeIcon } from '@web3icons/react';
import { LinkIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { badgeVariants } from '@workspace/ui/components/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';
import { cn } from '@workspace/ui/lib/utils';
import { useLiquidity } from '@workspace/ui/providers/liquidity-provider';

const CentralisedExchangesTable = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const { exchanges } = useLiquidity();
  return (
    <Table withPagination page={page} totalPages={0} handlePage={setPage}>
      <TableHeader>
        <TableRow>
          <TableHead>{t('TABLE.HEAD.EXCHANGE')}</TableHead>
          <TableHead>{t('TABLE.HEAD.TYPE')}</TableHead>
          <TableHead>{t('TABLE.HEAD.PAIRS')}</TableHead>
          <TableHead className='w-[30px]'>{t('TABLE.HEAD.LINK')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody noDataText={t('COMING_SOON')}>
        {exchanges?.map(exchange => (
          <TableRow key={exchange.exchange}>
            <TableCell>
              <div className='flex items-center space-x-1'>
                <ExchangeIcon
                  id={exchange.exchange.toLowerCase()}
                  className='rounded-full'
                  variant='background'
                  size='18'
                />
                <p>{exchange.exchange}</p>
              </div>
            </TableCell>
            <TableCell>{exchange.type}</TableCell>
            <TableCell>{exchange.pairs}</TableCell>
            <TableCell>
              <Link href={''} className={cn(badgeVariants())}>
                <LinkIcon size={12} />
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CentralisedExchangesTable;
