'use client';

import React from 'react';

import { Landmark } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ComingSoon = () => {
  const { t } = useTranslation();
  return (
    <div className='flex flex-col items-center justify-center rounded-lg border bg-white px-4 py-16'>
      <div className='bg-brand-25 mb-4 rounded-full border p-3'>
        <Landmark className='stroke-brand-600' />
      </div>
      <p className='text-gray-500'>{t('COMING_SOON')}</p>
    </div>
  );
};

export default ComingSoon;
