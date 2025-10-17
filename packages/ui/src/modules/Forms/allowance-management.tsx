import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Address, keccak256, toBytes } from 'viem';

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
import NumberInput from '@workspace/ui/components/number-input';
import { useAccount } from '@workspace/ui/providers/account-provider';
import { useMintNft } from '@workspace/ui/stores/use-mint-nft';
import { Emodal, useModalState } from '@workspace/ui/stores/use-modal-state';

import { ISIN_REGEX } from '@workspace/utils/constants';
import { TAllowanceManagementScheme, useSchemes } from '@workspace/utils/hooks';

const AllowanceManagementForm = () => {
  const { t } = useTranslation();
  const { openModal } = useModalState(s => ({ openModal: s.openModal }));
  const { isConnected } = useAccount();

  const { setAllowance } = useMintNft(store => ({
    setAllowance: store.setAllowance,
  }));

  const { allowanceManagementScheme } = useSchemes(t);
  const form = useForm<TAllowanceManagementScheme>({
    resolver: zodResolver(allowanceManagementScheme),
    defaultValues: {
      address: '',
      hash: '',
      quantity: 1,
    },
  });

  async function onSubmit(values: TAllowanceManagementScheme) {
    try {
      const isISIN = ISIN_REGEX.test(values.hash);
      const stringHash = keccak256(toBytes(values.hash));
      const tokenId = BigInt(stringHash);
      const id = isISIN ? tokenId : BigInt(values.hash);
      await setAllowance(values.address as Address, id, BigInt(values.quantity));
    } catch (error) {
      console.error('Error setting allowance:', error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='grid grid-cols-3 items-start gap-3'>
        <FormField
          control={form.control}
          name='address'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('FORM.ALLOWANCE_MANAGEMENT.ISSUER_ADDRESS')}</FormLabel>
              <FormControl>
                <Input placeholder={'e.g 0xIssuer1...'} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='hash'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{'eBOND ID (ISIN Hash)'}</FormLabel>
              <FormControl>
                <Input placeholder={'0x038c8cba (UA4000200000)'} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex items-end gap-3'>
          <FormField
            control={form.control}
            name='quantity'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('FORM.ALLOWANCE_MANAGEMENT.QUANTITY_TO_MINT')}</FormLabel>
                <FormControl>
                  <NumberInput
                    value={field.value}
                    autoFocus={false}
                    onValueChange={v => {
                      field.onChange(v.floatValue);
                    }}
                    handleIncrement={() => field.onChange(field.value + 1)}
                    handleDecrement={() =>
                      field.onChange(Number(field?.value) > 0 ? Number(field?.value) - 1 : 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isConnected ? (
            <Button type='submit' size='lg'>
              {t('BUTTON.SET_ALLOWANCE')}
            </Button>
          ) : (
            <Button type='button' size='lg' onClick={() => openModal(Emodal.WalletConnect)}>
              {t('BUTTON.CONNECT_WALLET')}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default AllowanceManagementForm;
