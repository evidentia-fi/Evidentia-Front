import React, { PropsWithChildren } from 'react';

import { Toaster } from '@workspace/ui/components/sonner';

import Header from './header';
import MobileMainMenu from './mobile-menu';
import MobileWalletSheet from './mobile-wallet-sheet';
import Sidebar from './sidebar';
import WalletsInfo from './wallets-info';

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className={'flex min-h-dvh flex-col'}>
      <Toaster />
      <Sidebar />
      <MobileMainMenu />
      <Header />
      <div className='relative flex flex-1 lg:mx-[280px]'>
        <div className='flex flex-1 flex-col overflow-hidden p-4 lg:p-6'>{children}</div>
        <WalletsInfo variant='desktop' />
      </div>
      <MobileWalletSheet />
    </div>
  );
};

export default MainLayout;
