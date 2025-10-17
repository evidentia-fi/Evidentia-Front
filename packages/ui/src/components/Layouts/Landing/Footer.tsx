import React from 'react';

import Container from '@workspace/ui/components/container';
import Logo from '@workspace/ui/components/logo';

const Footer = () => {
  return (
    <Container
      className='flex flex-col justify-between gap-4 py-6 text-white md:flex-row lg:items-center lg:py-8'
      classNameWrapper={'border-t'}
    >
      <Logo size={132} />
      <p className='text-base md:text-lg'>
        <span className='font-medium'>Our email:</span>{' '}
        <a href='mailto:hello@evidentia.fi'>hello@evidentia.fi</a>
      </p>
    </Container>
  );
};

export default Footer;
