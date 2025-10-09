'use client';

import { PropsWithChildren, useEffect } from 'react';

import { useTronWeb } from '@/providers/tron-provider';
import { Options } from '@layerzerolabs/lz-v2-utilities';
import { readContract } from '@wagmi/core';
import { Address, formatUnits, pad, parseUnits } from 'viem';
import { useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

import { updateEvents } from '@workspace/ui/hooks';
import { useAccount } from '@workspace/ui/providers/account-provider';
import { useStable } from '@workspace/ui/providers/stable-provider';
import { useBridge } from '@workspace/ui/stores/use-bridge';
import { EStatus, Emodal, useModalState } from '@workspace/ui/stores/use-modal-state';

import { abi } from '@workspace/utils/abis';
import { env, isTestnet, wagmiConfig } from '@workspace/utils/config';

export const BridgeProvider = ({ children }: PropsWithChildren) => {
  const tronWeb = useTronWeb();
  const { address } = useAccount();
  const setBridge = useBridge(state => state.set);
  const { decimals } = useStable();
  const { openModal } = useModalState(s => ({ openModal: s.openModal }));
  const { mutateAsync: updateEventsAsync } = updateEvents();

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

  const { data: allowanceRaw = 0n, refetch: refetchAllowance } = useReadContract({
    ...stableContract,
    functionName: 'allowance',
    args: [address as Address, env.OFT_ADAPTER],
    query: {
      enabled: !!address,
    },
  });

  const approve = async ({ amount }: { amount: bigint }) => {
    return await writeContract({
      abi: abi.stableAddressAbi,
      functionName: 'approve',
      args: [env.OFT_ADAPTER, amount],
      address: env.STABLES_ADDRESS,
    });
  };

  const {
    isSuccess: isSuccessForStake,
    isFetching: isFetchingForStake,
    isError: isErrorWaitForStake,
  } = useWaitForTransactionReceipt({
    hash: writeContractSuccess,
  });

  const bridge = async ({ toAddress, amount, destinationNetwork }: { toAddress: string; amount: bigint; destinationNetwork: string }) => {
    const minAmountLD = (amount * 75n) / 100n; // 25% slippage
    
    let toBytes32Address: Address;
    let dstChainConfig: { eid: number };

    if (destinationNetwork === 'Tron') {
      const tronHexAddress = ('0x' + tronWeb.address.toHex(toAddress).substring(2)) as Address;
      toBytes32Address = pad(tronHexAddress, { size: 32 });
      dstChainConfig = {
        eid: isTestnet ? 40420 : 30420,
      };
    } else if (destinationNetwork === 'Base') {
      toBytes32Address = pad(toAddress as Address, { size: 32 });
      dstChainConfig = {
        eid: isTestnet ? 40184 : 30184,
      };
    } else {
      // Ethereum
      toBytes32Address = pad(toAddress as Address, { size: 32 });
      dstChainConfig = {
        eid: isTestnet ? 40161 : 30101,
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

    const fee = await readContract(wagmiConfig, {
      abi: abi.oftAdapterAbi,
      address: env.OFT_ADAPTER,
      functionName: 'quoteSend',
      args: [sendParam, payInLzToken],
    });

    await writeContract({
      abi: abi.oftAdapterAbi,
      address: env.OFT_ADAPTER,
      functionName: 'send',
      args: [sendParam, fee, address as Address],
      value: fee.nativeFee,
      gas: BigInt(400000),
    });
  };

  const handleBridgeToTron = async ({
    toAddress,
    amount,
  }: {
    toAddress: string;
    amount: string;
  }) => {
    if (!address) return;
    const amountRaw = parseUnits(amount, decimals);

    if (allowanceRaw < amountRaw) {
      await approve({ amount: amountRaw });
      return;
    }

    await bridge({ toAddress, amount: amountRaw, destinationNetwork: 'Tron' });
  };

  const handleBridgeToBase = async ({
    toAddress,
    amount,
  }: {
    toAddress: string;
    amount: string;
  }) => {
    if (!address) return;
    const amountRaw = parseUnits(amount, decimals);

    if (allowanceRaw < amountRaw) {
      await approve({ amount: amountRaw });
      return;
    }

    await bridge({ toAddress, amount: amountRaw, destinationNetwork: 'Base' });
  };

  const handleBridgeToEthereum = async ({
    toAddress,
    amount,
  }: {
    toAddress: string;
    amount: string;
  }) => {
    if (!address) return;
    const amountRaw = parseUnits(amount, decimals);

    if (allowanceRaw < amountRaw) {
      await approve({ amount: amountRaw });
      return;
    }

    await bridge({ toAddress, amount: amountRaw, destinationNetwork: 'Ethereum' });
  };

  const refetch = async () => {
    await refetchAllowance();
    await updateEventsAsync();
  };

  const allowance = formatUnits(allowanceRaw, decimals);

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
      handleBridgeToTron,
      handleBridgeToBase,
      handleBridgeToEthereum,
      allowance,
      options,
    });
  }, [setBridge, handleBridgeToTron, handleBridgeToBase, handleBridgeToEthereum, allowance]);

  return children;
};
