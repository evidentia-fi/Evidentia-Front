'use client';

import React, { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { NetworkIcon, TokenIcon } from '@web3icons/react';
import { BigNumber } from 'bignumber.js';
import { ArrowDown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Address, Chain, formatUnits } from 'viem';
import { base, baseSepolia, mainnet, sepolia } from 'viem/chains';
import { useReadContract } from 'wagmi';

import AmountInput from '@workspace/ui/components/amount-input';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { useAccount } from '@workspace/ui/providers/account-provider';
import { useStable } from '@workspace/ui/providers/stable-provider';
import { useBridge } from '@workspace/ui/stores/use-bridge';
import { Emodal, useModalState } from '@workspace/ui/stores/use-modal-state';
import { useTronToken } from '@workspace/ui/stores/use-tron';

import { abi } from '@workspace/utils/abis';
import { env, isTestnet } from '@workspace/utils/config';
import { TNativeBridgeSchema, useSchemes } from '@workspace/utils/hooks';

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

console.log({ isTestnet });

export const chains: Record<string, Chain & { eid: number }> = isTestnet
  ? {
      Ethereum: { ...sepolia, eid: 40161 },
      Base: { ...baseSepolia, eid: 40245 },
    }
  : {
      Ethereum: { ...mainnet, eid: 30101 },
      Base: { ...base, eid: 30184 },
    };

export function NativeBridgeForm() {
  const { handleBridgeToEvm, balanceTron } = useTronToken(s => ({
    handleBridgeToEvm: s.handleBridgeToEvm,
    allowanceTron: s.allowance,
    balanceTron: s.tokenBalance,
  }));

  const { openModal } = useModalState(s => ({ openModal: s.openModal }));
  const { isConnected: isConnectedEvm, isConnectedTron, address } = useAccount();

  const { handleBridgeFromEvm, options } = useBridge(s => ({
    handleBridgeFromEvm: s.handleBridgeFromEvm,
    options: s.options,
  }));

  const { t } = useTranslation();
  const { nativeBridgeScheme } = useSchemes(t);
  const { symbol } = useStable();
  const form = useForm<TNativeBridgeSchema>({
    resolver: zodResolver(nativeBridgeScheme),
    defaultValues: {
      from: '',
      to: '',
      address: '',
      amount: '',
    },
  });

  const { to, from } = form.watch();

  const { data: balanceRaw } = useReadContract({
    abi: abi.stableAddressAbi,
    address: stable[from]?.address,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    query: {
      enabled: Boolean(from),
    },
    chainId: chains[from]?.id,
  });

  const decimals = stable[from]?.decimals;

  const balance = balanceRaw && decimals ? formatUnits(balanceRaw, decimals) : '0';

  useEffect(() => {
    if (!address) return;

    if ((from === 'Base' && to === 'Ethereum') || (from === 'Ethereum' && to === 'Base')) {
      form.setValue('address', address);
    }
  }, [from, to, address]);

  const isToTron = to === 'Tron';

  const maxBalance = from !== 'Tron' ? balance : balanceTron;

  async function onSubmit(values: TNativeBridgeSchema) {
    if (BigNumber(values.amount).gt(maxBalance)) {
      form.setError('amount', {
        type: 'manual',
        message: t('ERRORS.MAX_BALANCE_ERROR', { symbol }),
      });
      return;
    }

    if (isToTron && !values.address.startsWith('T')) {
      form.setError('address', {
        type: 'manual',
        message: t('FORM.NATIVE_BRIDGE.NOT_TRON_ADDRESS_ERROR'),
      });
      return;
    }

    if (values.from === 'Ethereum' || values.from === 'Base') {
      await handleBridgeFromEvm({
        toAddress: values.address,
        amount: values.amount,
        fromChain: values.from,
        toChain: values.to,
      });
      return;
    }

    if (!isToTron && !values.address.startsWith('0x')) {
      form.setError('address', {
        type: 'manual',
        message: t('FORM.NATIVE_BRIDGE.NOT_EVM_ADDRESS_ERROR'),
      });

      return;
    }
    await handleBridgeToEvm({
      toAddress: values.address,
      amount: values.amount,
      toChain: values.to,
    });
  }

  const isConnected = from === 'Tron' ? isConnectedTron : isConnectedEvm;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='bg-gray-25 mx-auto w-full max-w-[407px] space-y-4 rounded-md border p-4 shadow-sm'
      >
        <FormField
          control={form.control}
          name='from'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('FORM.NATIVE_BRIDGE.FROM_TITLE')}</FormLabel>
              <Select
                onValueChange={value => {
                  field.onChange(value);
                  const to = form.getValues('to');
                  if (value === to) {
                    const newTo = options.find(opt => opt.name !== value)?.name;
                    if (newTo) {
                      form.setValue('to', newTo);
                    }
                  }
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder={t('FORM.NATIVE_BRIDGE.FROM_PLACEHOLDER')}>
                      {options.find(el => el.name === field.value)?.symbol === 'base' ? (
                        <NetworkIcon
                          name='base'
                          variant='branded'
                          className='size-6'
                          fallback={<img src='/icons/base.svg' alt='Base' className='size-6' />}
                        />
                      ) : (
                        <TokenIcon
                          symbol={options.find(el => el.name === field.value)?.symbol ?? ''}
                          variant='branded'
                          className='size-6'
                        />
                      )}
                      {field.value}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {options.map(el => (
                    <SelectItem value={el.name} key={el.symbol}>
                      {el.symbol === 'base' ? (
                        <NetworkIcon
                          name='base'
                          variant='branded'
                          size='24'
                          fallback={<img src='/icons/base.svg' alt='Base' className='size-6' />}
                        />
                      ) : (
                        <TokenIcon symbol={el.symbol} variant='branded' size='24' />
                      )}
                      {el.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-center'>
          <Badge size='md'>
            <ArrowDown size={20} />
          </Badge>
        </div>
        <FormField
          control={form.control}
          name='to'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('FORM.NATIVE_BRIDGE.TO_TITLE')}</FormLabel>
              <Select
                onValueChange={value => {
                  field.onChange(value);
                  const from = form.getValues('from');
                  if (value === from) {
                    const newTo = options.find(opt => opt.name !== value)?.name;
                    if (newTo) {
                      form.setValue('from', newTo);
                    }
                  }
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder={t('FORM.NATIVE_BRIDGE.TO_PLACEHOLDER')}>
                      {options.find(el => el.name === field.value)?.symbol === 'base' ? (
                        <NetworkIcon
                          name='base'
                          variant='branded'
                          className='size-6'
                          fallback={<img src='/icons/base.svg' alt='Base' className='size-6' />}
                        />
                      ) : (
                        <TokenIcon
                          symbol={options.find(el => el.name === field.value)?.symbol ?? ''}
                          variant='branded'
                          className='size-6'
                        />
                      )}
                      {field.value}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectContent>
                    {options.map(el => (
                      <SelectItem value={el.name} key={el.symbol}>
                        {el.symbol === 'base' ? (
                          <NetworkIcon
                            name='base'
                            variant='branded'
                            size='24'
                            fallback={<img src='/icons/base.svg' alt='Base' className='size-6' />}
                          />
                        ) : (
                          <TokenIcon symbol={el.symbol} variant='branded' size='24' />
                        )}
                        {el.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <hr className='my-8' />
        <FormField
          control={form.control}
          name='address'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('FORM.NATIVE_BRIDGE.ADDRESS_TITLE')}</FormLabel>
              <FormControl>
                <Input placeholder={t('FORM.NATIVE_BRIDGE.ADDRESS_PLACEHOLDER')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='amount'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('FORM.NATIVE_BRIDGE.AMOUNT_TITLE', { symbol })}</FormLabel>
              <FormControl>
                <AmountInput
                  decimalScale={decimals}
                  onValueChange={values => field.onChange(values.value)}
                  onMaxClick={() => {
                    field.onChange(maxBalance);
                  }}
                  {...field}
                  onChange={undefined}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isConnected ? (
          <Button type='submit' size='lg' className='w-full'>
            {t('BUTTON.BRIDGE')}
          </Button>
        ) : (
          <Button
            type='button'
            size='lg'
            className='w-full'
            onClick={() => openModal(Emodal.WalletConnect)}
          >
            {t('BUTTON.CONNECT_WALLET')}
          </Button>
        )}
      </form>
    </Form>
  );
}
