import React, { useEffect } from 'react';

import { useTranslation } from 'react-i18next';

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
import { useMintNft } from '@workspace/ui/stores/use-mint-nft';
import { Emodal, useModalState } from '@workspace/ui/stores/use-modal-state';

import { shortAddress } from '@workspace/utils/constants';

const AllowanceManagementTable = () => {
  const { t } = useTranslation();
  const { openModal } = useModalState(state => ({
    openModal: state.openModal,
  }));

  const { data, isLoading, page, totalPages, setPage } = useMintNft(state => ({
    data: state.data,
    isLoading: state.isLoading,
    totalPages: state.totalPages,
    page: state.page,
    setPage: state.setPage,
  }));

  useEffect(() => {
    return () => {
      setPage(1);
    };
  }, []);

  return (
    <Table withPagination page={page} totalPages={totalPages} handlePage={setPage}>
      <TableHeader>
        <TableRow>
          <TableHead>{t('TABLE.HEAD.ISSUER_ADDRESS')}</TableHead>
          <TableHead>eBond ID</TableHead>
          <TableHead>ISIN</TableHead>
          <TableHead>{t('TABLE.HEAD.ALLOWANCE')}</TableHead>
          <TableHead className='w-[130px]'>{t('TABLE.HEAD.ACTION')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody isLoading={isLoading}>
        {data?.map(el => (
          <TableRow key={el.id + el.issuer}>
            <TableCell>
              <div className='flex items-center gap-2'>
                <span className='font-semibold'>{shortAddress(el.issuer)}</span>
                <CopyToClipboard textToCopy={el.issuer} />
              </div>
            </TableCell>
            <TableCell>
              <div className='flex items-center gap-2'>
                {shortAddress(el.id)}
                <CopyToClipboard textToCopy={el.id} />
              </div>
            </TableCell>
            <TableCell>{el.isin}</TableCell>
            <TableCell>
              {el.alreadyMinted} / {el.allowedMints}
            </TableCell>
            <TableCell>
              <Button
                variant='secondaryColor'
                onClick={() => {
                  openModal(Emodal.SetAllowance, {
                    isin: el.isin,
                    nftId: el.id,
                    issuer: el.issuer,
                    currentAllowance: el.balance,
                    totalAllowance: el.allowedMints,
                  });
                }}
              >
                {t('BUTTON.SET')}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AllowanceManagementTable;
