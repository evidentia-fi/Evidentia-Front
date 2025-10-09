'use client';

import React from 'react';

import Link from 'next/link';

import { useTranslation } from 'react-i18next';

import { Button } from '@workspace/ui/components/button';
import { Card } from '@workspace/ui/components/card';

const data = [
  {
    id: 0,
    name: 'EVIDENTIA TECHNOLOGIES SAGL',
    desc: 'Collateral manager entity established under Swiss DLT act to tokenise Government Bonds on multiple markets.',
    link: 'https://evidentia.tech/',
  },
];

const CollateralHoldersContent = () => {
  const { t } = useTranslation();
  return (
    <div>
      <div className='grid md:grid-cols-[repeat(auto-fill,_minmax(350px,_1fr))]'>
        {data.map(item => (
          <Card key={item.id} className={'gap-5'}>
            <div className='space-y-1.5'>
              <h3 className='text-sm font-medium text-gray-700'>
                {t('COLLATERAL_HOLDERS.CARD.TITLE')}
              </h3>
              <p className='text-md rounded-md border bg-gray-50 px-3.5 py-2.5 text-gray-500'>
                {item.name}
              </p>
            </div>
            <div className='space-y-1.5'>
              <h3 className='text-sm font-medium text-gray-700'>
                {t('COLLATERAL_HOLDERS.CARD.DESC')}
              </h3>
              <p className='rounded-md border bg-gray-50 px-3.5 py-2.5 text-sm text-gray-500'>
                {item.desc}
              </p>
            </div>

            <Link href={item.link} target='_blank' rel='noopener noreferrer'>
              <Button size='md' className='w-full'>
                {t('BUTTON.CONTACT')}
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CollateralHoldersContent;
