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
import { useLiquidity } from '@workspace/ui/providers/liquidity-provider';

const LiquidityPoolsEUAH = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const { pools } = useLiquidity();

  return (
    <Table withPagination page={page} totalPages={0} handlePage={setPage}>
      <TableHeader>
        <TableRow>
          <TableHead>{t('TABLE.HEAD.POOL')}</TableHead>
          <TableHead>TVL</TableHead>
          <TableHead>APY</TableHead>
          <TableHead>{t('TABLE.HEAD.PROTOCOL')}</TableHead>
          <TableHead>{t('TABLE.HEAD.NETWORK')}</TableHead>
          <TableHead className='w-[120px]'>{t('TABLE.HEAD.LINK')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody noDataText={t('COMING_SOON')}>
        {pools?.map((pool, idx) => (
          <TableRow key={idx}>
            <TableCell>{pool.pool}</TableCell>
            <TableCell>{pool.tvl}</TableCell>
            <TableCell>{pool.apy}%</TableCell>
            <TableCell>
              <div className='flex items-center space-x-1'>
                <TokenIcon
                  symbol={pool.protocolSymbol}
                  variant='background'
                  size='15'
                  className='overflow-hidden rounded-full'
                  fallback={
                    <img
                      src={`/icons/${pool.protocolSymbol}.svg`}
                      alt={pool.protocolSymbol}
                      className='size-[15px] overflow-hidden rounded-full'
                    />
                  }
                />
                <p>{pool.protocol}</p>
              </div>
            </TableCell>
            <TableCell>
              <div className='flex items-center space-x-1'>
                <TokenIcon symbol={pool.networkSymbol} variant='branded' size='18' />
                <p>{pool.network}</p>
              </div>
            </TableCell>
            <TableCell>
              <div className='flex items-center space-x-1'>
                {pool.explorerUrl && (
                  <Link href={pool.explorerUrl} className={badgeVariants({ variant: 'secondary' })}>
                    Explorer <Globe size={12} />
                  </Link>
                )}
                {pool.linkUrl && (
                  <Link href={pool.linkUrl} className={cn(badgeVariants())} target='_blank'>
                    <LinkIcon size={12} />
                  </Link>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LiquidityPoolsEUAH;
