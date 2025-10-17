import React from 'react';

import { Menu, MoveUpRight, XIcon } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import Logo from '@workspace/ui/components/logo';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@workspace/ui/components/sheet';
import { useModalState } from '@workspace/ui/stores/use-modal-state';

import { menuItems } from './data';

const MobileMenu = () => {
  const { openComingSoon } = useModalState(s => ({ openComingSoon: s.openComingSoon }));
  return (
    <Sheet>
      <SheetTrigger asChild className='lg:hidden'>
        <Button size='icon' variant='secondary'>
          <Menu className='size-6 text-white' />
        </Button>
      </SheetTrigger>
      <SheetContent className='w-full gap-12 sm:w-[540px]' hideCloseButton>
        <SheetHeader className='pb-0'>
          <div className='flex items-center justify-between'>
            <SheetTitle>
              <Logo size={126} />
            </SheetTitle>
            <SheetTrigger asChild>
              <Button size='icon' variant='secondary'>
                <XIcon className='size-6' />
              </Button>
            </SheetTrigger>
          </div>
        </SheetHeader>
        <div className='px-4'>
          <ul className='flex flex-col space-y-6 text-2xl'>
            {menuItems.map(menuItem => (
              <li key={menuItem.title}>
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
        <SheetFooter>
          <Button variant={'secondary'} onClick={openComingSoon}>
            Dashboard
            <MoveUpRight className='size-5' />
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
