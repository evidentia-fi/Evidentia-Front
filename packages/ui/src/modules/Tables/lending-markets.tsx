'use client';

import React, { useState } from 'react';

import Link from 'next/link';

import { TokenIcon } from '@web3icons/react';
import { Globe, LinkIcon } from 'lucide-react';
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
import { useAccount } from '@workspace/ui/providers/account-provider';
import { useLiquidity } from '@workspace/ui/providers/liquidity-provider';

const LendingMarketsTable = () => {
  const { t } = useTranslation();
  const { explorerUrl = ' ' } = useAccount();
  const [page, setPage] = useState(1);
  const { markets } = useLiquidity();

  return (
    <Table withPagination page={page} totalPages={0} handlePage={setPage}>
      <TableHeader>
        <TableRow>
          <TableHead>{t('TABLE.HEAD.PROTOCOL')}</TableHead>
          <TableHead>{t('TABLE.HEAD.NETWORK')}</TableHead>
          <TableHead>{t('TABLE.HEAD.SUPPLY_APR')}</TableHead>
          <TableHead>{t('TABLE.HEAD.BORROW_APR')}</TableHead>
          <TableHead>{t('TABLE.HEAD.AVAILABLE_LIQUIDITY')}</TableHead>
          <TableHead>{t('TABLE.HEAD.UTILISATION')}</TableHead>
          <TableHead className='w-[120px]'>{t('TABLE.HEAD.LINK')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody noDataText={t('COMING_SOON')}>
        {markets?.map((market, idx) => (
          <TableRow key={idx}>
            <TableCell>
              <div className='flex items-center space-x-1'>
                <TokenIcon
                  symbol={market.protocolSymbol}
                  variant='background'
                  size='18'
                  className='rounded-full'
                  fallback={
                    <img
                      src={`/icons/${market.protocolSymbol}.svg`}
                      alt={market.protocolSymbol}
                      className='size-[18px] overflow-hidden rounded-full'
                    />
                  }
                />
                <p>{market.protocol}</p>
              </div>
            </TableCell>
            <TableCell>
              <div className='flex items-center space-x-1'>
                <TokenIcon
                  symbol={market.networkSymbol}
                  variant='background'
                  size='15'
                  className='rounded-full'
                />
                <p>{market.network}</p>
              </div>
            </TableCell>
            <TableCell>{market.supplyApy}</TableCell>
            <TableCell>{market.borrowApy}</TableCell>
            <TableCell>{market.availableLiquidity}</TableCell>
            <TableCell>{market.utilization}</TableCell>
            <TableCell>
              <div className='flex items-center space-x-1'>
                <Link href={explorerUrl} className={badgeVariants({ variant: 'secondary' })}>
                  Explorer <Globe size={12} />
                </Link>
                <Link href={''} className={cn(badgeVariants())}>
                  <LinkIcon size={12} />
                </Link>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LendingMarketsTable;
