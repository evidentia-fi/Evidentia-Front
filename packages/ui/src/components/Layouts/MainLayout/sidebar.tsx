'use client';

import React from 'react';

import { useTranslation } from 'react-i18next';

import Navigations from '@workspace/ui/components/Layouts/MainLayout/navigations';
import Logo from '@workspace/ui/components/logo';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';

const Sidebar = () => {
  const { t } = useTranslation();

  return (
    <div className='fixed hidden h-dvh w-[280px] space-y-6 border-r bg-white pt-8 lg:block'>
      <div className='px-6'>
        <Logo color='black' size={148} />
      </div>

      <div className='px-6'>
        <Select value='UA'>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Select a fruit'>
              <span className='font-medium text-gray-900'>{t('MARKET')}</span>
              <span>UA</span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={'UA'}>UA</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Navigations />
    </div>
  );
};

export default Sidebar;
