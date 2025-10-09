import React from 'react';

import type { Metadata } from 'next';

import CollateralHoldersContent from '@workspace/ui/modules/CollateralHolders/collateral-holders-content';

export const metadata: Metadata = {
  title: 'Evidentia | Collateral Manager',
};

const Page = () => {
  return <CollateralHoldersContent />;
};

export default Page;
