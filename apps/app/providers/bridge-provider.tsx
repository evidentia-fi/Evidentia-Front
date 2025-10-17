'use client';

import { PropsWithChildren, useEffect } from 'react';

import { useTronWeb } from '@/providers/tron-provider';
import { Options } from '@layerzerolabs/lz-v2-utilities';
import { readContract, waitForTransactionReceipt } from '@wagmi/core';
import { Address, Chain, pad, parseUnits } from 'viem';
import { base, baseSepolia, mainnet, sepolia } from 'viem/chains';
import { useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

import { updateEvents } from '@workspace/ui/hooks';
import { useAccount } from '@workspace/ui/providers/account-provider';
import { useBridge } from '@workspace/ui/stores/use-bridge';
import { EStatus, Emodal, useModalState } from '@workspace/ui/stores/use-modal-state';

import { abi } from '@workspace/utils/abis';
import { env, isTestnet, wagmiConfig } from '@workspace/utils/config';

export const chains: Record<string, Chain & { eid: number }> = isTestnet
  ? {
      Ethereum: { ...sepolia, eid: 40161 },
      Base: { ...baseSepolia, eid: 40245 },
    }
  : {
      Ethereum: { ...mainnet, eid: 30101 },
      Base: { ...base, eid: 30184 },
    };

const stable: Record<string, { decimals: number; address: Address; spender: Address }> = {
  Ethereum: {
    decimals: 6,
    address: env.STABLES_ADDRESS,
    spender: env.OFT_ADAPTER,
  },
  Base: {
    decimals: 6,
    address: env.BASE_ADDRESS,
    spender: env.BASE_ADDRESS,
  },
};

export const BridgeProvider = ({ children }: PropsWithChildren) => {
  const tronWeb = useTronWeb();
  const { address, chainId } = useAccount();
  const { switchChain, chains: cg } = useSwitchChain();
  const setBridge = useBridge(state => state.set);
  const { openModal } = useModalState(s => ({ openModal: s.openModal }));
  const { mutateAsync: updateEventsAsync } = updateEvents();

  const {
    writeContractAsync: writeContract,
    data: writeContractSuccess,
    isPending: isLoadingWriteContract,
    isError: isErrorWriteContract,
  } = useWriteContract();

  const approve = async ({ amount, chain }: { amount: bigint; chain: string }) => {
    const uah = stable[chain];
    if (!uah) return;
    const res = await writeContract({
      abi: abi.stableAddressAbi,
      functionName: 'approve',
      args: [uah.spender, amount],
      address: uah.address,
      chainId: chains[chain]?.id,
    });

    await waitForTransactionReceipt(wagmiConfig, {
      hash: res,
    });

    return res;
  };

  const {
    isSuccess: isSuccessForStake,
    isFetching: isFetchingForStake,
    isError: isErrorWaitForStake,
  } = useWaitForTransactionReceipt({
    hash: writeContractSuccess,
  });

  const bridge = async ({
    toAddress,
    amount,
    fromChain,
    toChain,
  }: {
    toAddress: string;
    amount: bigint;
    fromChain: string;
    toChain: string;
  }) => {
    const minAmountLD = (amount * 75n) / 100n; // 25% slippage

    let toBytes32Address;
    let dstChainConfig;

    if (toChain === 'Tron') {
      const tronHexAddress = ('0x' + tronWeb.address.toHex(toAddress).substring(2)) as Address;
      toBytes32Address = pad(tronHexAddress, { size: 32 });

      dstChainConfig = {
        eid: isTestnet ? 40420 : 30420,
      };
    } else {
      toBytes32Address = pad(toAddress as Address, { size: 32 });
      dstChainConfig = {
        eid: chains[toChain]?.eid as number,
      };
    }

    const payInLzToken = false;

    const _gas = 71000;
    const extraOptions = Options.newOptions()
      .addExecutorLzReceiveOption(_gas, 0)
      .toHex() as Address;

    const sendParam = {
      dstEid: dstChainConfig.eid,
      to: toBytes32Address,
      amountLD: amount,
      minAmountLD,
      extraOptions,
      composeMsg: '0x' as Address,
      oftCmd: '0x' as Address,
    };

    if (fromChain === 'Base') {
      const uah = stable[fromChain]!;

      const fee = await readContract(wagmiConfig, {
        abi: abi.stableBondCoinsOftAbi,
        address: uah.address,
        functionName: 'quoteSend',
        args: [sendParam, payInLzToken],
        chainId: chains[fromChain]?.id,
      });

      await writeContract({
        abi: abi.stableBondCoinsOftAbi,
        address: uah.address,
        functionName: 'send',
        args: [sendParam, fee, address as Address],
        value: fee.nativeFee,

        chainId: chains[fromChain]?.id,
      });
      return;
    }

    const fee = await readContract(wagmiConfig, {
      abi: abi.oftAdapterAbi,
      address: env.OFT_ADAPTER,
      functionName: 'quoteSend',
      args: [sendParam, payInLzToken],
      chainId: chains[fromChain]?.id,
    });

    await writeContract({
      abi: abi.oftAdapterAbi,
      address: env.OFT_ADAPTER,
      functionName: 'send',
      args: [sendParam, fee, address as Address],
      value: fee.nativeFee,
      gas: BigInt(400000),
      chainId: chains[fromChain]?.id,
    });
  };

  const handleBridgeFromEvm = async ({
    toAddress,
    amount,
    fromChain,
    toChain,
  }: {
    toAddress: string;
    amount: string;
    fromChain: string;
    toChain: string;
  }) => {
    const uah = stable[fromChain];
    if (!address || !uah) return;
    const amountRaw = parseUnits(amount, uah.decimals);

    switchChain({ chainId: Number(chains[fromChain]?.id) });

    const allowanceRaw = await readContract(wagmiConfig, {
      address: uah.address,
      abi: abi.stableAddressAbi,
      functionName: 'allowance',
      args: [address as Address, uah.spender],
      chainId: chains[fromChain]?.id,
    });

    if (allowanceRaw < amountRaw) {
      await approve({ amount: amountRaw, chain: fromChain });
    }

    await bridge({ toAddress, amount: amountRaw, fromChain, toChain });
  };

  const refetch = async () => {
    await updateEventsAsync();
  };

  const options = [
    {
      name: 'Ethereum',
      symbol: 'eth',
    },
    {
      name: 'Tron',
      symbol: 'trx',
    },
    {
      name: 'Base',
      symbol: 'base',
    },
  ];

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
    if (isFetchingForStake) {
      openModal(Emodal.Status, { status: EStatus.Pending });
    }
  }, [isFetchingForStake]);

  useEffect(() => {
    if (isLoadingWriteContract) {
      openModal(Emodal.Status, { status: EStatus.Confirm });
    }
  }, [isLoadingWriteContract]);

  useEffect(() => {
    setBridge({
      handleBridgeFromEvm,
      options,
    });
  }, [setBridge, handleBridgeFromEvm]);

  return children;
};
