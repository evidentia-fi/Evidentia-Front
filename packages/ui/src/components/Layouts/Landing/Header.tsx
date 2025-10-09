import React from 'react';

import Link from 'next/link';

import { MoveUpRight } from 'lucide-react';

import MobileMenu from '@workspace/ui/components/Layouts/Landing/MobileMenu';
import { menuItems } from '@workspace/ui/components/Layouts/Landing/data';
import { Button } from '@workspace/ui/components/button';
import Logo from '@workspace/ui/components/logo';
import { useModalState } from '@workspace/ui/stores/use-modal-state';

const Header = () => {
  const { openComingSoon } = useModalState(s => ({ openComingSoon: s.openComingSoon }));
  return (
    <header className='absolute left-0 top-0 z-10 w-full'>
      <nav className='lg:px-4.5 px-5 py-4'>
        <div className='mx-auto flex max-w-screen-xl flex-wrap items-center justify-between'>
          <Logo className='w-[126px] lg:w-[162px]' />
          <div className='flex items-center lg:order-2'>
            <Link href='https://ua.evidentia.fi/'>
              <Button className='hidden text-white lg:flex' variant='secondary' size='xl'>
                Dashboard
                <MoveUpRight className='size-5' />
              </Button>
            </Link>
            <div className='flex items-center lg:order-2'>
              <MobileMenu />
            </div>
          </div>
          <div
            className='hidden w-full items-center justify-between lg:order-1 lg:flex lg:w-auto'
            id='mobile-menu-2'
          >
            <ul className='flex flex-row space-x-8 text-xl'>
              {menuItems.map(menuItem => (
                <li key={menuItem.title} className='text-white transition-all'>
                  {menuItem.link ? (
                    <a href={menuItem.link} target='_blank' className={'hover:opacity-75'}>
                      {menuItem.title}
                    </a>
                  ) : (
                    <span onClick={openComingSoon}>{menuItem.title}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
