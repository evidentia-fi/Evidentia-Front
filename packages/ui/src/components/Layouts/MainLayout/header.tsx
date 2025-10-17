'use client';

import React from 'react';

import { usePathname } from 'next/navigation';

import { Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { badgeVariants } from '@workspace/ui/components/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { cn } from '@workspace/ui/lib/utils';
import { useAccount } from '@workspace/ui/providers/account-provider';
import { Emodal, useModalState } from '@workspace/ui/stores/use-modal-state';

import { getLinks } from '@workspace/utils/constants';

import { useLanguage } from '../../../providers/language-provider';

const Header = () => {
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();
  const { isConnected, isConnectedTron } = useAccount();
  const links = getLinks(t);
  const pathname = usePathname();

  const { openModal } = useModalState(s => ({
    openModal: s.openModal,
  }));

  const title = links.find(link => link.href === pathname)?.title;

  return (
    <div className='top-14 z-10 flex h-[52px] w-full items-center justify-between border-b bg-white px-4 lg:sticky lg:top-0 lg:ml-[280px] lg:mr-[280px] lg:h-[72px] lg:w-[calc(100%-280px)] lg:px-6'>
      <h1 className='text:lg font-semibold text-gray-900 lg:text-2xl'>{title}</h1>
      <Select onValueChange={changeLanguage} value={language}>
        <SelectTrigger
          className='gap-0.5 rounded-full bg-gray-50 px-3 py-1 font-medium max-lg:hidden'
          size='sm'
        >
          <SelectValue placeholder='' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='en'>ENG</SelectItem>
          <SelectItem value='uk'>UKR</SelectItem>
        </SelectContent>
      </Select>

      <button
        onClick={() => openModal(Emodal.MobileWalletInfo)}
        className={cn(
          badgeVariants({
            variant: isConnected || isConnectedTron ? 'default' : 'gray',
            className: 'cursor-pointer select-none focus:ring-offset-1 lg:hidden',
          }),
          'size-8 rounded-full',
        )}
      >
        <Wallet className='size-3.5' />
      </button>
    </div>
  );
};

export default Header;
