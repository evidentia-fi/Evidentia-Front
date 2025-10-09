import type { Metadata } from 'next';

import MintContent from '@workspace/ui/modules/Mint/mint-content';

export const metadata: Metadata = {
  title: 'Evidentia | Mint',
};

const Page = () => {
  return <MintContent />;
};

export default Page;
