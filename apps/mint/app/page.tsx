import type { Metadata } from 'next';

import DashboardMintNftContent from '@workspace/ui/modules/MintNft/dashboard-content';

export const metadata: Metadata = {
  title: 'Evidentia | Dashboard',
};

const Page = () => {
  return <DashboardMintNftContent />;
};

export default Page;
