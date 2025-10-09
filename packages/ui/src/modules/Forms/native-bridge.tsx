'use client';

import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { TokenIcon, NetworkIcon } from '@web3icons/react';
import { BigNumber } from 'bignumber.js';
import { ArrowDown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

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

import { TNativeBridgeSchema, useSchemes } from '@workspace/utils/hooks';

export function NativeBridgeForm() {
  const { decimals, balance } = useStable();
  const { handleBridgeToEvm, allowanceTron, balanceTron } = useTronToken(s => ({
    handleBridgeToEvm: s.handleBridgeToEvm,
    allowanceTron: s.allowance,
    balanceTron: s.tokenBalance,
  }));

  const { openModal } = useModalState(s => ({ openModal: s.openModal }));
  const { isConnected: isConnectedEvm, isConnectedTron } = useAccount();

  const {
    handleBridgeToTron,
    handleBridgeToBase,
    handleBridgeToEthereum,
    allowance: allowanceEvm,
    options,
  } = useBridge(s => ({
    handleBridgeToTron: s.handleBridgeToTron,
    handleBridgeToBase: s.handleBridgeToBase,
    handleBridgeToEthereum: s.handleBridgeToEthereum,
    allowance: s.allowance,
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

  const { amount, to, from } = form.watch();
  const isToTron = to === 'Tron';
  const isToBase = to === 'Base';
  const isToEthereum = to === 'Ethereum';
  const isFromTron = from === 'Tron';
  const isFromEthereum = from === 'Ethereum';
  const isFromBase = from === 'Base';

  // Determine which balance and allowance to use based on source network
  const allowance = isFromTron ? allowanceTron : allowanceEvm;
  const maxBalance = isFromTron ? balanceTron : balance;

  async function onSubmit(values: TNativeBridgeSchema) {
    if (BigNumber(values.amount).gt(maxBalance)) {
      form.setError('amount', {
        type: 'manual',
        message: t('ERRORS.MAX_BALANCE_ERROR', { symbol }),
      });
      return;
    }

    // Check if address is required and provided
    if (!shouldAutoPopulateAddress && !values.address) {
      form.setError('address', {
        type: 'manual',
        message: t('FORM.NATIVE_BRIDGE.ADDRESS_REQUIRED_ERROR'),
      });
      return;
    }

    // Validate destination address based on target network
    if (isToTron && values.address && !values.address.startsWith('T')) {
      form.setError('address', {
        type: 'manual',
        message: t('FORM.NATIVE_BRIDGE.NOT_TRON_ADDRESS_ERROR'),
      });
      return;
    }

    if ((isToEthereum || isToBase) && values.address && !values.address.startsWith('0x')) {
      form.setError('address', {
        type: 'manual',
        message: t('FORM.NATIVE_BRIDGE.NOT_EVM_ADDRESS_ERROR'),
      });
      return;
    }

    // Handle different bridge scenarios
    if (isFromEthereum && isToTron) {
      await handleBridgeToTron({
        toAddress: values.address,
        amount: values.amount,
      });
    } else if (isFromEthereum && isToBase) {
      await handleBridgeToBase({
        toAddress: values.address,
        amount: values.amount,
      });
    } else if (isFromBase && isToEthereum) {
      await handleBridgeToEthereum({
        toAddress: values.address,
        amount: values.amount,
      });
    } else if (isFromTron && isToEthereum) {
      await handleBridgeToEvm({
        toAddress: values.address,
        amount: values.amount,
        destinationNetwork: 'Ethereum',
      });
    } else if (isFromTron && isToBase) {
      await handleBridgeToEvm({
        toAddress: values.address,
        amount: values.amount,
        destinationNetwork: 'Base',
      });
    } else if (isFromBase && isToTron) {
      await handleBridgeToTron({
        toAddress: values.address,
        amount: values.amount,
      });
    }
  }

  const isAllowance = BigNumber(amount).lte(allowance);
  const isEnteredAmount = BigNumber(amount).gt(0);
  
  // Determine which wallet needs to be connected based on source network
  const isConnected = isFromTron ? isConnectedTron : isConnectedEvm;
  
  // Auto-populate destination address for EVM to EVM bridges
  const shouldAutoPopulateAddress = (isFromEthereum && isToBase) || (isFromBase && isToEthereum);
  
  // Get the current user's address for auto-population
  const { address: userAddress } = useAccount();
  
  // Auto-populate address when networks change
  React.useEffect(() => {
    if (shouldAutoPopulateAddress && userAddress && !form.getValues('address')) {
      form.setValue('address', userAddress);
    }
  }, [shouldAutoPopulateAddress, userAddress, form]);

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
                          name="base"
                          variant='branded'
                          className='size-6'
                          fallback={
                            <img
                              src="/icons/base.svg"
                              alt="Base"
                              className="size-6"
                            />
                          }
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
                          name="base"
                          variant='branded'
                          size='24'
                          fallback={
                            <img
                              src="/icons/base.svg"
                              alt="Base"
                              className="size-6"
                            />
                          }
                        />
                      ) : (
                        <TokenIcon 
                          symbol={el.symbol} 
                          variant='branded' 
                          size='24'
                        />
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
                          name="base"
                          variant='branded'
                          className='size-6'
                          fallback={
                            <img
                              src="/icons/base.svg"
                              alt="Base"
                              className="size-6"
                            />
                          }
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
                          name="base"
                          variant='branded'
                          size='24'
                          fallback={
                            <img
                              src="/icons/base.svg"
                              alt="Base"
                              className="size-6"
                            />
                          }
                        />
                      ) : (
                        <TokenIcon 
                          symbol={el.symbol} 
                          variant='branded' 
                          size='24'
                        />
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
        <hr className='my-8' />
        <FormField
          control={form.control}
          name='address'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('FORM.NATIVE_BRIDGE.ADDRESS_TITLE')}
                {!shouldAutoPopulateAddress && <span className="text-red-500 ml-1">*</span>}
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder={
                    shouldAutoPopulateAddress 
                      ? t('FORM.NATIVE_BRIDGE.ADDRESS_PLACEHOLDER_AUTO')
                      : t('FORM.NATIVE_BRIDGE.ADDRESS_PLACEHOLDER')
                  } 
                  {...field} 
                />
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
          <Button 
            type='submit' 
            size='lg' 
            className='w-full'
            disabled={!isEnteredAmount || (!shouldAutoPopulateAddress && !form.getValues('address'))}
          >
            {isAllowance || !isEnteredAmount ? t('BUTTON.BRIDGE') : t('BUTTON.APPROVE')}
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
