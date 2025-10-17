import React, { useState } from 'react';

import { IUsersMint } from '@workspace/types';
import { useTranslation } from 'react-i18next';

import CopyToClipboard from '@workspace/ui/components/copy-to-clipboard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';
import { useUserMint } from '@workspace/ui/hooks';
import { cn } from '@workspace/ui/lib/utils';
import { useAccount } from '@workspace/ui/providers/account-provider';

import { shortAddress } from '@workspace/utils/constants';

interface MintBondProps {
  select?: IUsersMint;
  setSelect: (bond: IUsersMint) => void;
}

const MintBondTable = ({ select, setSelect }: MintBondProps) => {
  const { address } = useAccount();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useUserMint({ wallet: address!, page: page, perPage: 6 });

  return (
    <Table
      withPagination
      page={page}
      totalPages={data?.num_pages ?? 1}
      handlePage={setPage}
      isLoading={isLoading}
    >
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>eBond</TableHead>
          <TableHead>ISIN</TableHead>
          <TableHead>{t('TABLE.HEAD.AVAILABLE')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody isLoading={isLoading}>
        {data?.data.map(bond => (
          <TableRow key={bond.id}>
            <TableCell>
              <button
                className={cn('size-5 cursor-pointer rounded-full border', {
                  'border-brand-600 border-[6px]': select?.id === bond.id,
                })}
                onClick={() => setSelect(bond)}
              />
            </TableCell>
            <TableCell>
              <div className='flex items-center gap-2'>
                <span className='font-semibold'>{shortAddress(bond.nft_id)}</span>
                <CopyToClipboard textToCopy={bond.nft_id} />
              </div>
            </TableCell>
            <TableCell>{bond.isin}</TableCell>
            <TableCell>{bond.available_mint}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MintBondTable;
