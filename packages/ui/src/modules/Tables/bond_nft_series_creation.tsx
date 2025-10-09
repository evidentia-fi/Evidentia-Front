import React, { useState } from 'react';

import { format } from 'date-fns';
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
import { useGetBondsMetadata } from '@workspace/ui/hooks';

import { formatDateStr, numberFormat, shortAddress } from '@workspace/utils/constants';

const BondNftSeriesCreationTable = ({ search }: { search: string }) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const { data } = useGetBondsMetadata({
    page,
    perPage: 6,
    url: `issue_timestamp_=desc${search ? `&isin=${search}` : ''}`,
  });

  return (
    <Table withPagination page={page} totalPages={data?.num_pages ?? 0} handlePage={setPage}>
      <TableHeader>
        <TableRow>
          <TableHead className='w-1/5'>ID</TableHead>
          <TableHead>ISIN</TableHead>
          <TableHead>{t('TABLE.HEAD.PRINCIPAL')}</TableHead>
          <TableHead>{t('TABLE.HEAD.COUPON')}</TableHead>
          <TableHead>{t('TABLE.HEAD.ISSUE_DATE')}</TableHead>
          <TableHead>{t('TABLE.HEAD.MATURITY_DATE')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.data.map(bond => (
          <TableRow key={bond.id}>
            <TableCell>
              <div className='flex items-center gap-2'>
                <span className='font-semibold'>{shortAddress(bond.nft_id)}</span>{' '}
                <CopyToClipboard textToCopy={bond.nft_id} />
              </div>
            </TableCell>
            <TableCell>{bond.isin}</TableCell>
            <TableCell>
              {numberFormat(bond.principal)} {bond.currency}
            </TableCell>
            <TableCell>{numberFormat(bond.coupon_value, 'auto')}</TableCell>
            <TableCell>{format(bond.issue_timestamp, formatDateStr)}</TableCell>
            <TableCell>{format(bond.maturity, formatDateStr)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BondNftSeriesCreationTable;
