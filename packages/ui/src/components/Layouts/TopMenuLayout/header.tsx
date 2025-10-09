'use client';

import React from 'react';

import { usePathname } from 'next/navigation';

import { useTranslation } from 'react-i18next';

import ConnectButton from '@workspace/ui/components/Layouts/TopMenuLayout/connect-button';
import Logo from '@workspace/ui/components/logo';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { useAccount } from '@workspace/ui/providers/account-provider';
import { useModalState } from '@workspace/ui/stores/use-modal-state';

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
    <div className='top-14 z-10 flex h-[52px] w-full items-center justify-between border-b bg-white px-4 lg:sticky lg:top-0 lg:h-[72px] lg:px-6'>
      <Logo color='black' size={148} />
      <div className='flex items-center gap-4'>
        <Select onValueChange={changeLanguage} value={language}>
          <SelectTrigger
            className='gap-0.5 rounded-full bg-gray-50 px-3 py-1 font-medium'
            size='sm'
          >
            <SelectValue placeholder='' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='en'>ENG</SelectItem>
            <SelectItem value='uk'>UKR</SelectItem>
          </SelectContent>
        </Select>
        <ConnectButton />
      </div>
    </div>
  );
};

export default Header;
