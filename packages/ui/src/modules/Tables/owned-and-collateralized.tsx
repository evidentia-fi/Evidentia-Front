'use client';

import React from 'react';

import { EBondStatus, IBond } from '@workspace/types';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { Button } from '@workspace/ui/components/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';
import { useGetBonds } from '@workspace/ui/hooks';
import { useAccount } from '@workspace/ui/providers/account-provider';
import { Emodal, useModalState } from '@workspace/ui/stores/use-modal-state';

import { formatDateStr, numberFormat } from '@workspace/utils/constants';

interface BoundsOwnedAndCollateralizedTableProps {
  variant: 'supply' | 'withdraw';
}

const BoundsOwnedAndCollateralizedTable = ({ variant }: BoundsOwnedAndCollateralizedTableProps) => {
  const { t } = useTranslation();
  const { openModal } = useModalState(s => ({ openModal: s.openModal }));
  const { address } = useAccount();
  const [page, setPage] = React.useState(1);

  const { data, isLoading } = useGetBonds({
    page,
    perPage: 10,
    wallet: address,
    status: variant === 'supply' ? EBondStatus.OWNED : EBondStatus.NFT_STAKE,
  });

  const handleAction = (bond: IBond) => {
    openModal(variant === 'supply' ? Emodal.Supply : Emodal.Withdraw, {
      isin: bond.isin,
      nftId: bond.nft_id,
      amount: bond.number,
    });
  };

  return (
    <Table
      withPagination
      page={page}
      totalPages={data?.num_pages ?? 1}
      handlePage={setPage}
      classNameWrapper='rounded-none border-0'
    >
      <TableHeader>
        <TableRow>
          {[
            'ISIN',
            t('TABLE.HEAD.COUNTRY'),
            t('TABLE.HEAD.CURRENCY'),
            t('TABLE.HEAD.PRINCIPAL'),
            t('TABLE.HEAD.MATURITY'),
            t('TABLE.HEAD.NUMBER'),
            t('TABLE.HEAD.COLLATERAL_VALUE'),
          ].map(header => (
            <TableHead key={header}>{header}</TableHead>
          ))}
          <TableHead className='w-[115px]'>{t('TABLE.HEAD.ACTION')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody isLoading={isLoading}>
        {data?.data?.map(bond => (
          <TableRow key={bond.id}>
            <TableCell>{bond.isin}</TableCell>
            <TableCell>{bond.country}</TableCell>
            <TableCell>UAH</TableCell>
            <TableCell>{numberFormat(bond.principal)} UAH</TableCell>
            <TableCell>{format(bond.maturity, formatDateStr)}</TableCell>
            <TableCell>
              {numberFormat(bond.number, 0)} {t('PC')}
            </TableCell>
            <TableCell>{numberFormat(bond.collateral_value, 0)}</TableCell>
            <TableCell>
              <Button
                className='w-[115px]'
                variant='secondaryColor'
                onClick={() => handleAction(bond)}
              >
                {variant === 'supply' ? t('BUTTON.SUPPLY') : t('BUTTON.WITHDRAW')}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BoundsOwnedAndCollateralizedTable;
