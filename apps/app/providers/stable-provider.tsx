import React, { PropsWithChildren, useMemo } from 'react';

import { IStableContext } from '@workspace/types';
import { formatUnits } from 'viem';
import { useReadContracts } from 'wagmi';

import { useAccount } from '@workspace/ui/providers/account-provider';
import { StableContext } from '@workspace/ui/providers/stable-provider';

import { abi } from '@workspace/utils/abis';
import { env } from '@workspace/utils/config';
import { getResultReadContracts, refetchInterval } from '@workspace/utils/constants';

export const StableProvider = ({ children }: PropsWithChildren) => {
  const { address } = useAccount();

  const stableAddressContract = {
    abi: abi.stableAddressAbi,
    address: env.STABLES_ADDRESS,
  } as const;

  const {
    data,
    isLoading,
    refetch: refetchStableAddress,
  } = useReadContracts({
    contracts: [
      {
        ...stableAddressContract,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
      },
      {
        ...stableAddressContract,
        functionName: 'decimals',
      },
      {
        ...stableAddressContract,
        functionName: 'symbol',
      },
    ],
    query: {
      refetchInterval,
    },
  });

  const balanceRaw = getResultReadContracts(data?.[0]);
  const decimals = getResultReadContracts(data?.[1]) ?? 0;
  const symbol = getResultReadContracts(data?.[2]) ?? '';
  const balance = balanceRaw ? formatUnits(balanceRaw, decimals) : '0';

  const refetch = async () => {
    try {
      await refetchStableAddress();
    } catch (error) {
      console.error('Error refetching stable data:', error);
    }
  };

  const value = useMemo<IStableContext>(
    () => ({
      balance,
      symbol,
      decimals,
      isLoading,
      refetch,
    }),
    [balance, symbol, decimals, isLoading],
  );

  return <StableContext.Provider value={value}>{children}</StableContext.Provider>;
};
