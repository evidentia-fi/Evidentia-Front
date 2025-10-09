import React from 'react';

import MarqueeComponent from 'react-fast-marquee';
import { MarqueeProps } from 'react-fast-marquee/dist/components/Marquee';

import { cn } from '@workspace/ui/lib/utils';

const Marquee = ({ children, className }: MarqueeProps) => {
  return (
    <MarqueeComponent
      className={cn('h-18 border-input border-b border-t text-white', className)}
      gradient
      gradientColor='#000'
      gradientWidth={64}
    >
      {children}
    </MarqueeComponent>
  );
};

export default Marquee;
