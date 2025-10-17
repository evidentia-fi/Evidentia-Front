'use client';

import React from 'react';

import { Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@workspace/ui/components/button';
import { Emodal, useModalState } from '@workspace/ui/stores/use-modal-state';

const NoConnect = () => {
  const { t } = useTranslation();
  const openModal = useModalState(s => s.openModal);
  return (
    <div className='flex flex-col items-center justify-center space-y-4 rounded-lg border bg-white px-4 py-16'>
      <div className='bg-brand-25 rounded-full border p-3'>
        <Wallet className='stroke-brand-600' />
      </div>
      <div className='text-center'>
        <h2 className='text-2xl text-gray-900'>{t('NO_CONNECT.TITLE')}</h2>
        <p className='text-sm text-gray-500'>{t('NO_CONNECT.DESC')}</p>
      </div>
      <Button size='lg' onClick={() => openModal(Emodal.WalletConnect)}>
        {t('BUTTON.CONNECT')}
      </Button>
    </div>
  );
};

export default NoConnect;
