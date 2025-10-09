'use client';

import Link from 'next/link';

import { Button } from '@workspace/ui/components/button';

import { Routes } from '@workspace/utils/constants';

export default function NotFoundContent() {
  return (
    <div className='flex flex-1 flex-col items-center justify-center space-y-1'>
      <h2 className='text-9xl text-gray-600'>404</h2>
      <p className='text-xl text-gray-700'>Could not find requested resource</p>
      <Link href={Routes.DASHBOARD}>
        <Button>Go to Dashboard</Button>
      </Link>
    </div>
  );
}
