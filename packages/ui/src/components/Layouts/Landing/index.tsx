import React, { PropsWithChildren } from 'react';

import Footer from '@workspace/ui/components/Layouts/Landing/Footer';
import Header from '@workspace/ui/components/Layouts/Landing/Header';
import Disclaimer from '@workspace/ui/components/Modals/disclaimer';
import ModalsProvider from '@workspace/ui/providers/modals-provider';

interface ILandingLayoutProps extends PropsWithChildren {}

const LandingLayout = ({ children }: ILandingLayoutProps) => {
  return (
    <ModalsProvider>
      <div className='flex min-h-dvh flex-col'>
        <div className='relative flex h-full flex-1 flex-col'>
          <Header />
          {children}
        </div>
        <Footer />
      </div>
      <Disclaimer />
    </ModalsProvider>
  );
};

export default LandingLayout;
