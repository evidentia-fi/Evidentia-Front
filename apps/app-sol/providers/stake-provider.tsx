import { PropsWithChildren } from 'react';

import { StakeContext } from '@workspace/ui/providers/stake-provider';

export const StakeProvider = ({ children }: PropsWithChildren) => {
  const mockValue = {
    balance: '1000.00',
    symbol: 'eUAH',
    decimals: 18,
    totalStaked: '500.00',
    stakedAmount: '100.00',
    reward: '12.34',
    isLoading: false,
    refetchStable: async () => console.log('refetchStable called'),
    refetch: async () => console.log('refetch called'),
    handleStake: async ({ amount }: { amount: bigint }) =>
      console.log(`handleStake called with ${amount.toString()}`),
    claimReward: async () => console.log('claimReward called'),
    unstake: async ({ amount }: { amount: bigint }) =>
      console.log(`unstake called with ${amount.toString()}`),
  };

  return <StakeContext.Provider value={mockValue}>{children}</StakeContext.Provider>;
};
