import React, { useState } from 'react';

import { EContractEventType } from '@workspace/types';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { buttonVariants } from '@workspace/ui/components/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';
import { useGetEvents } from '@workspace/ui/hooks';
import { useAccount } from '@workspace/ui/providers/account-provider';

import { env } from '@workspace/utils/config';
import {
  ZERO_ADDRESS,
  formatDateStr,
  getContractEventTypeText,
  shortAddress,
} from '@workspace/utils/constants';

const IssuerActionsHistory = () => {
  const { t } = useTranslation();
  const { explorerUrl } = useAccount();
  const [page, setPage] = useState(1);

  const { data } = useGetEvents({
    page,
    perPage: 6,
    types: [EContractEventType.MINT],
  });

  return (
    <Table withPagination page={page} totalPages={data?.num_pages ?? 0} handlePage={setPage}>
      <TableHeader>
        <TableRow>
          <TableHead>{t('TABLE.HEAD.TOKEN_ID')}</TableHead>
          <TableHead>eBond ID</TableHead>
          <TableHead>{t('TABLE.HEAD.ISSUER')}</TableHead>
          <TableHead>{t('TABLE.HEAD.ACTION')}</TableHead>
          <TableHead>{t('TABLE.HEAD.DATE')}</TableHead>
          <TableHead>{t('TABLE.HEAD.TX_HASH')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.data.map(el => (
          <TableRow key={el.id}>
            <TableCell>
              <span className='font-semibold'>{shortAddress(el.nft_id)}</span>
            </TableCell>
            <TableCell>{shortAddress(env.NFT_ADDRESS)}</TableCell>
            <TableCell>
              {el.wallet_from === ZERO_ADDRESS
                ? shortAddress(el.wallet_to)
                : shortAddress(el.wallet_from)}
            </TableCell>
            <TableCell>{getContractEventTypeText(el.type)}</TableCell>
            <TableCell>{format(el.created_at, formatDateStr)}</TableCell>
            <TableCell>
              <a
                href={`${explorerUrl}/tx/${el?.tx_hash}`}
                target='_blank'
                rel='noopener noreferrer'
                className={buttonVariants({ variant: 'link' })}
              >
                {shortAddress(el.tx_hash)}
              </a>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default IssuerActionsHistory;
