import type { Metadata } from 'next';

import BridgeContent from '@workspace/ui/modules/Bridge/bridge-content';

export const metadata: Metadata = {
  title: 'Evidentia | Bridge',
};

const Page = () => {
  return <BridgeContent />;
};

export default Page;
