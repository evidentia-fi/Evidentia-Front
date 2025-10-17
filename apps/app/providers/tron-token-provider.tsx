'use client';

import { PropsWithChildren, useCallback, useEffect } from 'react';

import { useTronWeb } from '@/providers/tron-provider';
import { Options } from '@layerzerolabs/lz-v2-utilities';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { Address, Chain, formatUnits, pad, parseUnits } from 'viem';
import { base, baseSepolia, mainnet, sepolia } from 'viem/chains';

import { updateEvents } from '@workspace/ui/hooks';
import { useAccount } from '@workspace/ui/providers/account-provider';
import { EStatus, Emodal, useModalState } from '@workspace/ui/stores/use-modal-state';
import { useTronToken, useTronTokenStore } from '@workspace/ui/stores/use-tron';

import { abi } from '@workspace/utils/abis';
import { env, isTestnet } from '@workspace/utils/config';

const CONTRACT_ADDRESS = env.TRON_ADDRESS;

if (!CONTRACT_ADDRESS) {
  throw new Error('CRITICAL ERROR: TRON_ADDRESS environment variable is not set!');
}

export const chains: Record<string, Chain & { eid: number }> = isTestnet
  ? {
      Ethereum: { ...sepolia, eid: 40161 },
      Base: { ...baseSepolia, eid: 40245 },
    }
  : {
      Ethereum: { ...mainnet, eid: 30101 },
      Base: { ...base, eid: 30184 },
    };

export const TronTokenProvider = ({ children }: PropsWithChildren) => {
  const tronWeb = useTronWeb();
  const { openModal } = useModalState(s => ({ openModal: s.openModal }));
  const { mutateAsync: updateEventsAsync } = updateEvents();
  const { isConnected: isConnectedEvm } = useAccount();

  const { address, connected, signTransaction, wallet } = useWallet();
  const { set: setTronTokenState, reset: resetTronTokenState } = useTronToken(s => ({
    set: s.set,
    reset: s.reset,
  }));

  const refetch = useCallback(async () => {
    if (!connected || !address || !tronWeb) {
      return;
    }

    try {
      const contract = await tronWeb.contract(abi.tronAbi, CONTRACT_ADDRESS);
      const callOptions = { from: address };

      const [name, symbol, decimals, balance, allowanceRaw] = await Promise.all([
        contract.methods.name().call(callOptions),
        contract.methods.symbol().call(callOptions),
        contract.methods.decimals().call(callOptions),
        contract.methods.balanceOf(address).call(callOptions),
        contract.methods.allowance(address, CONTRACT_ADDRESS).call(callOptions),
      ]);

      const tokenDecimals = Number(decimals ?? 0);
      setTronTokenState({
        name,
        symbol,
        decimals: tokenDecimals,
        tokenBalance: balance ? formatUnits(balance, tokenDecimals) : '0',
        allowance: allowanceRaw ? formatUnits(allowanceRaw, tokenDecimals) : '0',
      });
    } catch (error) {
      resetTronTokenState();
    } finally {
    }
  }, [address, connected, tronWeb, setTronTokenState, resetTronTokenState]);

  useEffect(() => {
    if (connected && address && tronWeb) {
      void refetch();
    } else {
      resetTronTokenState();
    }
  }, [connected, address, tronWeb, refetch, resetTronTokenState]);

  useEffect(() => {
    if (!tronWeb) {
      return;
    }

    const sendTransaction = async (
      methodSignature: string,
      args: any[],
      options: {
        callValue?: string | number;
      } = {},
    ) => {
      if (!wallet || !address || !signTransaction) throw new Error('Wallet not connected');
      try {
        openModal(Emodal.Status, { status: EStatus.Pending });
        const transactionOptions = { ...options, feeLimit: 150_000_000 };

        const tx = await tronWeb.transactionBuilder.triggerSmartContract(
          env.TRON_ADDRESS,
          methodSignature,
          transactionOptions,
          args,
          address,
        );

        const signedTx = await signTransaction(tx.transaction);
        const sendRaw = await tronWeb.trx.sendRawTransaction(signedTx);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await refetch();
        if (isConnectedEvm) {
          await updateEventsAsync();
        }
        openModal(Emodal.Status, { status: EStatus.Success });
        return sendRaw;
      } catch (e) {
        openModal(Emodal.Status, { status: EStatus.Failed });
      }
    };

    const handleApprove = async (amount: bigint) => {
      return sendTransaction('approve(address,uint256)', [
        { type: 'address', value: env.TRON_ADDRESS },
        { type: 'uint256', value: amount.toString() },
      ]);
    };

    const handleBridgeToEvm = async ({
      toAddress,
      amount,
      toChain,
    }: {
      toAddress: string;
      amount: string;
      toChain: string;
    }) => {
      const currentState = useTronTokenStore.getState();
      const { decimals, allowance } = currentState;

      if (decimals === 0 && allowance === '0') {
        throw new Error('Token data has not been loaded yet. Please wait and try again.');
      }

      const amountRaw = parseUnits(amount, decimals);
      const allowanceRaw = parseUnits(allowance, decimals);

      if (allowanceRaw < amountRaw) {
        await handleApprove(amountRaw);
        return;
      }

      const contract = await tronWeb.contract(abi.tronAbi, CONTRACT_ADDRESS);
      const dstChainConfig = { eid: chains[toChain]?.eid };

      const _gas = 71000;
      const extraOptions = Options.newOptions()
        .addExecutorLzReceiveOption(_gas, 0)
        .toHex() as Address;

      const toBytes32Address = pad(toAddress as Address, { size: 32 });

      const sendParam = [
        dstChainConfig.eid,
        toBytes32Address,
        amountRaw.toString(),
        ((amountRaw * 75n) / 100n).toString(),
        extraOptions,
        '0x',
        '0x',
      ];

      const feeQuote = await contract.methods.quoteSend(sendParam, false).call({ from: address });
      const nativeFee = feeQuote[0].nativeFee;

      if (typeof nativeFee === 'undefined') {
        throw new Error('Could not retrieve nativeFee from quoteSend.');
      }

      const fee = [nativeFee.toString(), '0'];

      const sendMethodSignature =
        'send((uint32,bytes32,uint256,uint256,bytes,bytes,bytes),(uint256,uint256),address)';

      const contractArgs = [
        {
          type: '(uint32,bytes32,uint256,uint256,bytes,bytes,bytes)',
          value: sendParam,
        },
        {
          type: '(uint256,uint256)',
          value: fee,
        },
        {
          type: 'address',
          value: address,
        },
      ];

      return sendTransaction(sendMethodSignature, contractArgs, {
        callValue: nativeFee.toString(),
      });
    };

    setTronTokenState({ handleBridgeToEvm, refetch });
  }, [address, wallet, signTransaction, tronWeb, setTronTokenState, refetch]);

  return children;
};
