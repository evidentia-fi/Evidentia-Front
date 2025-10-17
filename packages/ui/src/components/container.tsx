import React, { PropsWithChildren } from 'react';

import { cn } from '@workspace/ui/lib/utils';

interface IContainerProps extends PropsWithChildren {
  className?: string;
  classNameWrapper?: string;
}

const Container = ({ children, className, classNameWrapper }: IContainerProps) => {
  return (
    <div className={cn('px-4 lg:px-6', classNameWrapper)}>
      <div className={cn('mx-auto max-w-screen-xl', className)}>{children}</div>
    </div>
  );
};

export default Container;
