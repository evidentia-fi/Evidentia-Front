import React, { PropsWithChildren, useCallback, useEffect } from 'react';

import { readContract } from '@wagmi/core';
import { formatEther, formatUnits, parseUnits } from 'viem';
import { useReadContracts, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

import { updateEvents, useUpdateBonds } from '@workspace/ui/hooks/use-contract';
import { useAccount } from '@workspace/ui/providers/account-provider';
import { MintContext } from '@workspace/ui/providers/mint-provider';
import { useStable } from '@workspace/ui/providers/stable-provider';
import { EStatus, Emodal, useModalState } from '@workspace/ui/stores/use-modal-state';

import { abi } from '@workspace/utils/abis';
import { env, ethNetwork, wagmiConfig } from '@workspace/utils/config';
import { getResultReadContracts, refetchInterval } from '@workspace/utils/constants';

export const MintProvider = ({ children }: PropsWithChildren) => {
  const { address } = useAccount();
  const { mutateAsync: updateEventsAsync } = updateEvents();
  const { mutateAsync: updateBondsAsync } = useUpdateBonds();
  const { decimals, balance, symbol } = useStable();
  const { setArgs, openModal } = useModalState(s => ({
    setArgs: s.setArgs,
    openModal: s.openModal,
  }));

  const nftStakingContract = {
    abi: abi.nftStakingAbi,
    address: env.NFT_STAKING_ADDRESS,
  } as const;

  const {
    writeContractAsync: approveContract,
    isPending: isLoadingApprove,
    isError: approveError,
  } = useWriteContract();

  const {
    writeContractAsync: writeContract,
    data: writeContractSuccess,
    isPending: isLoadingWriteContract,
    isError: isErrorWriteContract,
  } = useWriteContract();

  const {
    writeContractAsync: writeContractWithStatus,
    data: writeContractSuccessWithStatus,
    isPending: isLoadingWriteContractWithStatus,
    isError: isErrorWriteContractWithStatus,
  } = useWriteContract();

  const availableToUnstakeAsync = async (nftId: string) => {
    if (!address || !nftId) return 0 as number;

    const result = await readContract(wagmiConfig, {
      abi: abi.nftStakingAbi,
      address: env.NFT_STAKING_ADDRESS,
      functionName: 'userAvailableToUnstake',
      args: [address as `0x${string}`, env.NFT_ADDRESS, BigInt(nftId)],
    });

    return Number(result ?? 0);
  };

  const availableToStakeAsync = async (nftId: string) => {
    if (!address || !nftId) return 0 as number;

    const result = await readContract(wagmiConfig, {
      abi: abi.nftAbi,
      address: env.NFT_ADDRESS,
      functionName: 'balanceOf',
      args: [address as `0x${string}`, BigInt(nftId!)],
      chainId: ethNetwork.id,
    });

    return Number(result ?? 0);
  };

  const { data, refetch: refetchNftStaking } = useReadContracts({
    contracts: [
      {
        ...nftStakingContract,
        functionName: 'getUserStats',
        args: [address as `0x${string}`],
      },
      {
        ...nftStakingContract,
        functionName: 'getProtocolRate',
      },
      {
        ...nftStakingContract,
        functionName: 'userAvailableToBorrow',
        args: [address as `0x${string}`],
      },
      {
        abi: abi.nftAbi,
        address: env.NFT_ADDRESS,
        functionName: 'isApprovedForAll',
        args: [address as `0x${string}`, env.NFT_STAKING_ADDRESS],
      },
    ],
    query: {
      refetchInterval,
    },
  });

  const withdrawNFT = useCallback(
    async ({ tokenId, amount }: { tokenId: bigint; amount: bigint }) => {
      return await writeContract({
        abi: abi.nftStakingAbi,
        address: env.NFT_STAKING_ADDRESS,
        functionName: 'unstakeNFT',
        args: [env.NFT_ADDRESS, tokenId, amount],
      });
    },
    [writeContract],
  );

  const supplyNFT = useCallback(
    async ({ tokenId, amount }: { tokenId: bigint; amount: bigint }) => {
      return await writeContract({
        abi: abi.nftStakingAbi,
        address: env.NFT_STAKING_ADDRESS,
        functionName: 'stakeNFT',
        args: [env.NFT_ADDRESS, tokenId, amount],
      });
    },
    [writeContract],
  );

  const approve = useCallback(async () => {
    return await writeContract({
      abi: abi.nftAbi,
      address: env.NFT_ADDRESS,
      functionName: 'setApprovalForAll',
      args: [env.NFT_STAKING_ADDRESS, true],
    });
  }, [approveContract]);

  const approveStable = useCallback(
    async ({ amount }: { amount: bigint }) => {
      const nAmount = amount === 0n ? parseUnits(balance, decimals) : amount;
      return await approveContract({
        abi: abi.stableAddressAbi,
        functionName: 'approve',
        args: [env.NFT_STAKING_ADDRESS, nAmount],
        address: env.STABLES_ADDRESS,
      });
    },
    [approveContract, balance, decimals],
  );

  const borrow = useCallback(
    async ({ amount }: { amount: bigint }) => {
      return await writeContractWithStatus({
        abi: abi.nftStakingAbi,
        address: env.NFT_STAKING_ADDRESS,
        functionName: 'borrow',
        args: [amount],
      });
    },
    [writeContractWithStatus],
  );

  const repay = useCallback(
    async ({ amount }: { amount: bigint }) => {
      return await writeContract({
        abi: abi.nftStakingAbi,
        address: env.NFT_STAKING_ADDRESS,
        functionName: 'repay',
        args: [amount],
      });
    },
    [writeContract],
  );

  const {
    isSuccess: isSuccessForContract,
    isError: isErrorWaitForContract,
    isFetching: isWaitingForContractSuccess,
  } = useWaitForTransactionReceipt({ hash: writeContractSuccess });

  const {
    isSuccess: isSuccessForStakeWithStatus,
    isError: isErrorWaitForStakeWithStatus,
    isFetching: isWaitingForContractSuccessWithStatus,
  } = useWaitForTransactionReceipt({ hash: writeContractSuccessWithStatus });

  const userStats = getResultReadContracts(data?.[0]);
  const protocolYield = getResultReadContracts(data?.[1]);
  const availableBorrowRaw = getResultReadContracts(data?.[2]);
  const isApprovedForAll = getResultReadContracts(data?.[3]) ?? false;

  const totalBorrowed = formatUnits(userStats?.borrowed ?? 0n, decimals);
  const availableBorrow = formatUnits(availableBorrowRaw ?? 0n, decimals);
  const totalStaked = formatUnits(userStats?.staked ?? 0n, decimals);
  const totalDebt = formatUnits(userStats?.debt ?? 0n, decimals);
  const interrest = formatUnits((userStats?.debt ?? 0n) - (userStats?.borrowed ?? 0n), decimals);
  const interestRate = Number(formatEther(protocolYield ?? 0n)) * 100;

  const refetch = useCallback(async () => {
    await refetchNftStaking();
    await updateEventsAsync();
    await updateBondsAsync(`user_wallet=${address}`);
  }, [refetchNftStaking, updateEventsAsync, address]);

  const handleSupplyNFT = useCallback(
    async ({ tokenId, amount }: { tokenId: bigint; amount: bigint }) => {
      if (!isApprovedForAll) {
        await approve();
      }
      await supplyNFT({ tokenId, amount });
    },
    [approve, supplyNFT],
  );

  const handleRepay = useCallback(
    async ({ amount }: { amount: bigint }) => {
      await approveStable({ amount });
      await repay({ amount });
    },
    [approveStable, repay],
  );

  useEffect(() => {
    if (isLoadingWriteContractWithStatus) {
      openModal(Emodal.Status, { status: EStatus.Confirm });
    }

    if (isLoadingWriteContract || isLoadingApprove) {
      setArgs({ status: EStatus.Confirm });
    }
  }, [isLoadingWriteContract, isLoadingApprove, isLoadingWriteContractWithStatus]);

  useEffect(() => {
    if (isWaitingForContractSuccessWithStatus) {
      openModal(Emodal.Status, { status: EStatus.Pending });
    }

    if (isWaitingForContractSuccess) {
      setArgs({ status: EStatus.Pending });
    }
  }, [isWaitingForContractSuccess, isWaitingForContractSuccessWithStatus]);

  useEffect(() => {
    if (isSuccessForStakeWithStatus) {
      openModal(Emodal.Status, { status: EStatus.Success });
      void refetch();
    }
    if (isSuccessForContract) {
      setArgs({ status: EStatus.Success });
      void refetch();
    }
  }, [isSuccessForContract, isSuccessForStakeWithStatus, refetch]);

  useEffect(() => {
    if (isErrorWriteContractWithStatus || isErrorWaitForStakeWithStatus) {
      openModal(Emodal.Status, { status: EStatus.Failed });
    }
    if (isErrorWriteContract || isErrorWaitForContract || approveError) {
      setArgs({ status: EStatus.Failed });
    }
  }, [
    isErrorWriteContract,
    isErrorWaitForContract,
    approveError,
    isErrorWriteContractWithStatus,
    isErrorWaitForStakeWithStatus,
  ]);

  const isLoadingTransaction =
    isLoadingApprove ||
    isLoadingWriteContract ||
    isLoadingWriteContractWithStatus ||
    isWaitingForContractSuccess ||
    isWaitingForContractSuccessWithStatus;

  return (
    <MintContext.Provider
      value={{
        balance,
        totalBorrowed,
        totalStaked,
        totalDebt,
        availableBorrow,
        interrest,
        interestRate,
        decimals,
        symbol,
        isLoadingTransaction,
        borrow,
        handleRepay,
        handleSupplyNFT,
        withdrawNFT,
        isApprovedForAll,
        availableToUnstakeAsync,
        availableToStakeAsync,
      }}
    >
      {children}
    </MintContext.Provider>
  );
};
