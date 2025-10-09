import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';

import { keepPreviousData } from '@tanstack/react-query';
import { Address } from 'viem';
import {
  useReadContract,
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';

import { updateEvents, useMintAllowance } from '@workspace/ui/hooks';
import { useAccount } from '@workspace/ui/providers/account-provider';
import { useMintNft } from '@workspace/ui/stores/use-mint-nft';
import { EStatus, Emodal, useModalState } from '@workspace/ui/stores/use-modal-state';

import { abi } from '@workspace/utils/abis';
import { env } from '@workspace/utils/config';

const MintNftProvider = ({ children }: PropsWithChildren) => {
  const { address } = useAccount();

  const { set } = useMintNft(state => ({
    set: state.set,
  }));

  const { mutateAsync: updateEventsAsync } = updateEvents();
  const { openModal } = useModalState(s => ({
    openModal: s.openModal,
  }));

  const {
    writeContractAsync: writeContract,
    data: writeContractSuccess,
    isPending: isLoadingWriteContract,
    isError: isErrorWriteContract,
  } = useWriteContract();

  const {
    isSuccess: isSuccessForContract,
    isError: isErrorWaitForContract,
    isFetching: isWaitingForContractSuccess,
  } = useWaitForTransactionReceipt({ hash: writeContractSuccess });

  const [page, setPage] = useState(1);
  const perPage = 6;

  const { data: mintAllowance, isLoading: isLoadingMintAllowance } = useMintAllowance({
    page,
    perPage,
  });

  const nfts =
    mintAllowance?.data.map(mint => ({
      nft_id: mint.nft_id,
      isin: mint.isin,
      user_wallet: mint.user_wallet,
    })) ?? [];

  const allContracts = useMemo(() => {
    const nftContracts = nfts.flatMap(nft => [
      {
        abi: abi.nftAbi,
        address: env.NFT_ADDRESS,
        functionName: 'remainingMints',
        args: [nft.user_wallet, nft.nft_id],
      },
      {
        abi: abi.nftAbi,
        address: env.NFT_ADDRESS,
        functionName: 'allowedMints',
        args: [nft.user_wallet, nft.nft_id],
      },
    ]);
    return [...nftContracts];
  }, [nfts, address]);

  const { data: owner } = useReadContract({
    abi: abi.nftAbi,
    address: env.NFT_ADDRESS,
    functionName: 'owner',
  });

  const {
    data: allContractsData,
    isLoading: isLoadingReadContracts,
    refetch: refetchContract,
  } = useReadContracts({
    contracts: allContracts,
    query: {
      enabled: !!address && allContracts.length > 0,
      placeholderData: keepPreviousData,
    },
  });

  const isLoading = isLoadingMintAllowance || isLoadingReadContracts;

  const { formattedData } = useMemo(() => {
    if (!allContractsData || allContractsData.length !== allContracts.length) {
      return { formattedData: [], formattedBondsData: [] };
    }

    const nftsDataSlice = allContractsData.slice(0, nfts.length * 2);

    const formattedData = nfts.map((nft, index) => {
      const remainingMints = nftsDataSlice[index * 2]?.result ?? 0n;
      const allowedMints = nftsDataSlice[index * 2 + 1]?.result ?? 0n;

      return {
        id: nft.nft_id,
        isin: nft.isin,
        balance: Number(nftsDataSlice[index * 2]?.result ?? 0n),
        issuer: nft.user_wallet ?? '',
        alreadyMinted: Number(allowedMints) - Number(remainingMints),

        allowedMints: Number(nftsDataSlice[index * 2 + 1]?.result ?? 0n),
      };
    });

    return { formattedData };
  }, [allContractsData, nfts, allContracts.length]);

  const createBondAsync = useCallback(
    async (
      id: bigint,
      data: {
        value: bigint;
        couponValue: bigint;
        issueTimestamp: bigint;
        expirationTimestamp: bigint;
        ISIN: string;
      },
    ) => {
      await writeContract({
        abi: abi.nftAbi,
        address: env.NFT_ADDRESS,
        functionName: 'setMetaData',
        args: [id, data],
      });
    },
    [writeContract],
  );

  const setAllowance = useCallback(
    async (user: string, id: bigint, allowedMints: bigint) => {
      await writeContract({
        abi: abi.nftAbi,
        address: env.NFT_ADDRESS,
        functionName: 'setAllowedMints',
        args: [user as Address, id, allowedMints],
      });
    },
    [writeContract],
  );

  const mint = useCallback(
    async (id: bigint, amount: bigint) => {
      await writeContract({
        abi: abi.nftAbi,
        address: env.NFT_ADDRESS,
        functionName: 'mint',
        args: [id, amount, '0x0'],
      });
    },
    [writeContract],
  );

  const redeem = useCallback(
    async (id: bigint, amount: bigint) => {
      await writeContract({
        abi: abi.nftAbi,
        address: env.NFT_ADDRESS,
        functionName: 'burn',
        args: [id, amount],
      });
    },
    [writeContract],
  );

  const refetch = useCallback(async () => {
    await updateEventsAsync();
    await refetchContract();
  }, [updateEventsAsync, address]);

  const error = isErrorWriteContract || isErrorWaitForContract;

  if (error) {
    console.error('Error occurred while writing contract:', error);
  }

  useEffect(() => {
    if (isLoadingWriteContract) {
      openModal(Emodal.Status, { status: EStatus.Confirm });
    }
  }, [isLoadingWriteContract]);

  useEffect(() => {
    if (isWaitingForContractSuccess) {
      openModal(Emodal.Status, { status: EStatus.Pending });
    }
  }, [isWaitingForContractSuccess]);

  useEffect(() => {
    if (isSuccessForContract) {
      openModal(Emodal.Status, { status: EStatus.Success });
      void refetch();
    }
  }, [isSuccessForContract, refetch]);

  useEffect(() => {
    if (isErrorWriteContract || isErrorWaitForContract) {
      openModal(Emodal.Status, { status: EStatus.Failed });
    }
  }, [isErrorWriteContract, isErrorWaitForContract]);

  useEffect(() => {
    set({
      data: formattedData,
      owner,
      isAdmin: owner?.toLowerCase() === address?.toLowerCase(),
      page,
      createBondAsync,
      setAllowance,
      mint,
      redeem,
      totalPages: mintAllowance?.num_pages ?? 1,
      isLoading: isLoading || isLoadingMintAllowance,
      setPage,
    });
  }, [formattedData, isLoading, createBondAsync, owner, address]);

  return children;
};

export default MintNftProvider;
