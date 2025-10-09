import React, { PropsWithChildren } from 'react';

import Header from '@workspace/ui/components/Layouts/TopMenuLayout/header';
import { Toaster } from '@workspace/ui/components/sonner';

const TopMenuLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className={'flex min-h-dvh flex-col'}>
      <Toaster />
      <Header />
      <div className='relative flex flex-1 p-4 lg:p-6'>
        <div className='mx-auto flex max-w-[1024px] flex-1 flex-col overflow-hidden'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default TopMenuLayout;
