'use client';

import React, { useState } from 'react';

import { format } from 'date-fns';
import { FileCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Badge, badgeVariants } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import CopyToClipboard from '@workspace/ui/components/copy-to-clipboard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';
import { useUsersNft } from '@workspace/ui/hooks';
import { cn } from '@workspace/ui/lib/utils';
import { useAccount } from '@workspace/ui/providers/account-provider';
import { Emodal, useModalState } from '@workspace/ui/stores/use-modal-state';

import { formatDateStr, numberFormat, shortAddress } from '@workspace/utils/constants';

interface IUserBondNftsProps {
  type: 'active' | 'redeemed';
}

const UserBondNfts = ({ type }: IUserBondNftsProps) => {
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const { address, explorerUrl } = useAccount();
  const { openModal } = useModalState(s => ({
    openModal: s.openModal,
  }));

  const { data } = useUsersNft({
    perPage: 6,
    page: page,
    wallet: address!,
    type,
  });

  return (
    <Table withPagination page={page} totalPages={data?.num_pages ?? 1} handlePage={setPage}>
      <TableHeader>
        <TableRow>
          <TableHead>{t('TABLE.HEAD.TOKEN_ID')}</TableHead>
          <TableHead>ISIN</TableHead>
          <TableHead>{t('TABLE.HEAD.PRINCIPAL')}</TableHead>
          {type === 'active' && <TableHead>{t('TABLE.HEAD.STATUS')}</TableHead>}
          <TableHead>{t('TABLE.HEAD.NUMBER')}</TableHead>
          <TableHead>{t('TABLE.HEAD.MATURITY')}</TableHead>
          <TableHead>{t('TABLE.HEAD.ACTION')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.data?.map(el => (
          <TableRow key={el.nft_id}>
            <TableCell>
              <div className='flex items-center gap-2'>
                <span>{shortAddress(el.nft_id)}</span> <CopyToClipboard textToCopy={el.nft_id} />
              </div>
            </TableCell>
            <TableCell>{el.isin}</TableCell>
            <TableCell>{numberFormat(el?.principal)}</TableCell>
            {type === 'active' && (
              <TableCell>
                <Badge
                  variant='custom_colors'
                  size='large'
                  className={cn('uppercase', {
                    'text-success-700 bg-success-50 border-success-200': el?.status === 'available',

                    'border-violet-200 bg-violet-50 text-violet-700':
                      el?.status === 'in correlator',
                  })}
                >
                  {el?.status ?? '-'}
                </Badge>
              </TableCell>
            )}
            <TableCell>{numberFormat(el?.minted)}</TableCell>
            <TableCell>{format(el.maturity, formatDateStr)}</TableCell>
            <TableCell>
              {type === 'redeemed' ? (
                <a
                  href={`${explorerUrl}/tx/${el?.tx_hash}`}
                  className={cn(
                    badgeVariants({ variant: 'secondary', size: 'large' }),
                    'rounded-full',
                  )}
                  target='_blank'
                >
                  Proof
                  <FileCheck size={12} />
                </a>
              ) : (
                <Button
                  variant='secondaryColor'
                  onClick={() => {
                    openModal(Emodal.Redeem, { nftId: el.nft_id, isin: el.isin });
                  }}
                >
                  {t('BUTTON.REDEEM')}
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserBondNfts;
