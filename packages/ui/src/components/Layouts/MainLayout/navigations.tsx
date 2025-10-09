'use client';

import React from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ArrowLeftRight, Banknote, Coins, Landmark, LayoutGrid, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { cn } from '@workspace/ui/lib/utils';

import { ILink, Routes, getLinks } from '@workspace/utils/constants';

interface INavigationsProps {
  onClick?: (link: ILink) => void;
}

const Navigations = ({ onClick }: INavigationsProps) => {
  const { t } = useTranslation();

  const links = getLinks(t);

  const icons = {
    [Routes.DASHBOARD]: <LayoutGrid />,
    [Routes.STAKING]: <Coins size={24} />,
    [Routes.BRIDGE]: <ArrowLeftRight size={24} />,
    [Routes.MINT]: <Banknote size={24} />,
    [Routes.GOVERNANCE]: <Landmark size={24} />,
    [Routes.COLLATERAL_HOLDERS]: <Users size={24} />,
  };
  const pathname = usePathname();

  const isActive = (link: string) => pathname === link;

  return (
    <nav className='flex flex-col'>
      {links.map(link => (
        <Link
          href={link.href}
          key={link.href}
          onClick={() => onClick?.(link)}
          className={cn(
            'flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2 font-semibold',
            {
              'text-brand-800 bg-gray-50': isActive(link.href),
              'text-gray-700 hover:bg-gray-50': !isActive(link.href),
            },
          )}
        >
          {icons?.[link.href as keyof typeof icons] || null}
          {link.title}
        </Link>
      ))}
    </nav>
  );
};

export default Navigations;
