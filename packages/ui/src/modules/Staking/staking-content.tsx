'use client';

import React from 'react';

import StakingApyChart from '@workspace/ui/modules/Charts/staking-apy-chart';
import StakingHistory from '@workspace/ui/modules/Staking/staking-history';
import StakingStake from '@workspace/ui/modules/Staking/staking-stake';
import StakingStats from '@workspace/ui/modules/Staking/staking-stats';
import { useAccount } from '@workspace/ui/providers/account-provider';

const StakingContent = () => {
  const { isConnected } = useAccount();

  return (
    <div className='flex flex-col gap-y-4'>
      <StakingStake />
      {isConnected && <StakingStats />}
      <StakingApyChart />
      {isConnected && <StakingHistory />}
    </div>
  );
};

export default StakingContent;
