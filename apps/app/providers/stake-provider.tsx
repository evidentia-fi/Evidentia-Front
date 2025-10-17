'use client';

import React, { PropsWithChildren, useEffect } from 'react';

import { IStakeContext } from '@workspace/types';
import { formatUnits } from 'viem';
import {
  useAccount,
  useReadContract,
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';

import { updateEvents } from '@workspace/ui/hooks/use-contract';
import { useStable } from '@workspace/ui/providers/stable-provider';
import { StakeContext } from '@workspace/ui/providers/stake-provider';
import { EStatus, Emodal, useModalState } from '@workspace/ui/stores/use-modal-state';

import { abi } from '@workspace/utils/abis';
import { env } from '@workspace/utils/config';
import { getResultReadContracts, refetchInterval } from '@workspace/utils/constants';

export const StakeProvider = ({ children }: PropsWithChildren) => {
  const { address } = useAccount();
  const { mutateAsync: updateEventsAsync } = updateEvents();
  const { openModal } = useModalState(s => ({ openModal: s.openModal }));

  const {
    decimals,
    balance,
    isLoading: isLoadingStable,
    refetch: refetchStable,
    ...restStable
  } = useStable();

  const stableStakingContract = {
    abi: abi.stableStakingAbi,
    address: env.STABLES_STAKING_ADDRESS,
  } as const;

  const stableContract = {
    abi: abi.stableAddressAbi,
    address: env.STABLES_ADDRESS,
  } as const;

  const {
    writeContractAsync: writeContract,
    data: writeContractSuccess,
    isPending: isLoadingWriteContract,
    isError: isErrorWriteContract,
  } = useWriteContract();

  const {
    data,
    isLoading: isLoadingStableStaking,
    refetch: refetchStake,
  } = useReadContracts({
    contracts: [
      {
        ...stableStakingContract,
        functionName: 'stakers',
        args: [address!],
      },
      {
        ...stableStakingContract,
        functionName: 'totalStaked',
      },
      {
        ...stableStakingContract,
        functionName: 'pendingRewards',
        args: [address!],
      },
    ],
    query: {
      enabled: Boolean(address),
      refetchInterval,
    },
  });

  const { data: allowanceRaw = 0n, refetch: refetchAllowance } = useReadContract({
    ...stableContract,
    functionName: 'allowance',
    args: [address!, env.STABLES_STAKING_ADDRESS],
  });

  const {
    isFetching: isWaitingForStake,
    isSuccess: isSuccessForStake,
    isError: isErrorWaitForStake,
  } = useWaitForTransactionReceipt({
    hash: writeContractSuccess,
  });

  const userData = getResultReadContracts(data?.[0]);
  const totalStakedRaw = getResultReadContracts(data?.[1]) ?? 0n;
  const pendingRewards = getResultReadContracts(data?.[2]) ?? 0n;

  const stakedAmount = userData?.stakedAmount ? formatUnits(userData?.stakedAmount, decimals) : '0';
  const rewardsEarned = userData?.rewardsEarned ?? 0n;

  const rewardRaw = rewardsEarned + pendingRewards;
  const reward = rewardRaw ? formatUnits(rewardRaw, decimals) : '0';
  const totalStaked = formatUnits(totalStakedRaw, decimals);
  const allowance = formatUnits(allowanceRaw, decimals);

  const isLoading =
    isLoadingStable || isLoadingStableStaking || isWaitingForStake || isLoadingWriteContract;

  const approve = async ({ amount }: { amount: bigint }) => {
    return await writeContract({
      abi: abi.stableAddressAbi,
      functionName: 'approve',
      args: [env.STABLES_STAKING_ADDRESS, amount],
      address: env.STABLES_ADDRESS,
    });
  };

  const stake = async ({ amount }: { amount: bigint }) => {
    await writeContract({
      abi: abi.stableStakingAbi,
      functionName: 'stake',
      args: [amount],
      address: env.STABLES_STAKING_ADDRESS,
    });
  };

  const unstake = async ({ amount }: { amount: bigint }) => {
    await writeContract({
      abi: abi.stableStakingAbi,
      functionName: 'withdraw',
      args: [amount],
      address: env.STABLES_STAKING_ADDRESS,
    });
  };

  const claimReward = async () => {
    await writeContract({
      abi: abi.stableStakingAbi,
      functionName: 'claimRewards',
      address: env.STABLES_STAKING_ADDRESS,
    });
  };

  const refetch = async () => {
    await refetchAllowance();
    await refetchStable();
    await refetchStake();
    await updateEventsAsync();
  };

  const handleStake = async ({ amount }: { amount: bigint }) => {
    if (!address) return;
    if (allowanceRaw < amount) {
      await approve({ amount });
      return;
    }
    await stake({ amount });
  };

  useEffect(() => {
    if (isSuccessForStake) {
      openModal(Emodal.Status, { status: EStatus.Success });
      void refetch();
    }
  }, [isSuccessForStake]);

  useEffect(() => {
    if (isErrorWriteContract || isErrorWaitForStake) {
      openModal(Emodal.Status, { status: EStatus.Failed });
    }
  }, [isErrorWriteContract, isErrorWaitForStake]);

  useEffect(() => {
    if (isWaitingForStake) {
      openModal(Emodal.Status, { status: EStatus.Pending });
    }
  }, [isWaitingForStake]);

  useEffect(() => {
    if (isLoadingWriteContract) {
      openModal(Emodal.Status, { status: EStatus.Confirm });
    }
  }, [isLoadingWriteContract]);

  const value: IStakeContext = {
    balance,
    decimals,
    totalStaked,
    stakedAmount,
    reward,
    isLoading,
    allowance,
    refetchStable,
    refetch,
    handleStake,
    claimReward,
    unstake,
    ...restStable,
  };

  return <StakeContext.Provider value={value}>{children}</StakeContext.Provider>;
};
