import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { MoveUpRight } from 'lucide-react';

import { useModalState } from '@workspace/ui/stores/use-modal-state';

import { Button } from './button';
import Container from './container';

interface IBannerProps {
  title?: string;
  description?: string;
  quote?: string;
}

const Banner = ({ title, description, quote }: IBannerProps) => {
  const { openComingSoon } = useModalState(s => ({ openComingSoon: s.openComingSoon }));

  return (
    <div className='relative pb-[48px] pt-[108px] md:pb-[160px] md:pt-[200px]'>
      <Image src='/bg-home.webp' fill alt='bg' />
      <Container className='z-1 relative text-white'>
        {title && (
          <h1 className='max-w-[237px] text-3xl font-bold md:max-w-[626px] md:text-6xl'>{title}</h1>
        )}
        {description && <h5 className='mt-3 text-base md:mt-6 md:text-xl'>{description}</h5>}
        {quote && (
          <blockquote className='mt-1 text-base font-semibold md:text-xl'>{quote}</blockquote>
        )}
        <div className='mt-8 flex flex-col gap-5 md:mt-10 md:flex-row md:gap-8'>
          <Link href='https://ua.evidentia.fi/staking'>
            <Button className='w-full md:w-[196px]' size='2xl'>
              Open App <MoveUpRight />
            </Button>
          </Link>
          <Link href='/contact-us'>
            <Button variant='secondary' className='w-full md:w-[196px]' size='2xl'>
              Contact us
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default Banner;
