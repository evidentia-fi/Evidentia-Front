import type { Metadata } from 'next';

import StakingContent from '@workspace/ui/modules/Staking/staking-content';

export const metadata: Metadata = {
  title: 'Evidentia | Staking',
};

const Page = () => {
  return <StakingContent />;
};

export default Page;
