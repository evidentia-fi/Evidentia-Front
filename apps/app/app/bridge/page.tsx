import type { Metadata } from 'next';

import BridgeContent from '@/components/Bridge/bridge-content';

export const metadata: Metadata = {
  title: 'Evidentia | Bridge',
};

const Page = () => {
  return <BridgeContent />;
};

export default Page;
