import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { getUnixTime } from 'date-fns';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { keccak256, parseUnits, toBytes } from 'viem';

import AmountInput from '@workspace/ui/components/amount-input';
import { Button } from '@workspace/ui/components/button';
import { DatePicker } from '@workspace/ui/components/date-picker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';
import { cn } from '@workspace/ui/lib/utils';
import { useAccount } from '@workspace/ui/providers/account-provider';
import { useStable } from '@workspace/ui/providers/stable-provider';
import { useMintNft } from '@workspace/ui/stores/use-mint-nft';
import { Emodal, useModalState } from '@workspace/ui/stores/use-modal-state';

import { TCreateBondScheme, useSchemes } from '@workspace/utils/hooks';

const CreateBondForm = () => {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModalState(s => ({
    openModal: s.openModal,
    closeModal: s.closeModal,
  }));
  const { decimals } = useStable();

  const { createBondAsync, isLoading } = useMintNft(state => ({
    createBondAsync: state.createBondAsync,
    isLoading: state.isLoading,
  }));

  const { isConnected } = useAccount();

  const { createBondScheme } = useSchemes(t);

  const form = useForm<TCreateBondScheme>({
    resolver: zodResolver(createBondScheme),
    defaultValues: {
      principal: 1,
      coupon: 1,
      issue_date: undefined,
      exp_date: undefined,
      isin: '',
    },
  });

  async function onSubmit(values: TCreateBondScheme) {
    const stringHash = keccak256(toBytes(values.isin));
    const tokenId = BigInt(stringHash);

    const metadata = {
      value: parseUnits(String(values.principal), decimals),
      couponValue: parseUnits(String(values.coupon), decimals),
      issueTimestamp: BigInt(getUnixTime(values.issue_date)),
      expirationTimestamp: BigInt(getUnixTime(values.exp_date)),
      ISIN: values.isin,
    };

    await createBondAsync(tokenId, metadata);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <div className='grid grid-cols-2 items-start gap-4'>
          <FormField
            control={form.control}
            name='principal'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('FORM.CREATE_BOND.PRINCIPAL_TITLE')}</FormLabel>
                <FormControl>
                  <AmountInput
                    value={field.value}
                    autoFocus={false}
                    onValueChange={v => {
                      field.onChange(v.floatValue);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='coupon'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('FORM.CREATE_BOND.COUPON_TITLE')}</FormLabel>
                <FormControl>
                  <AmountInput
                    value={field.value}
                    autoFocus={false}
                    onValueChange={v => {
                      field.onChange(v.floatValue);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <hr />
        <FormField
          control={form.control}
          name='issue_date'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('FORM.CREATE_BOND.ISSUE_TITLE')}</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value as any}
                  setDate={date => {
                    field.onChange(date);
                  }}
                  placeholder={t('FORM.PLACEHOLDER_DATE')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='exp_date'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('FORM.CREATE_BOND.EXPIRATION_TITLE')}</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value as any}
                  setDate={date => field.onChange(date)}
                  placeholder={t('FORM.PLACEHOLDER_DATE')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <hr className='my-4' />
        <FormField
          control={form.control}
          name='isin'
          render={({ field }) => (
            <FormItem>
              <FormLabel>ISIN</FormLabel>
              <FormControl>
                <Input placeholder={'e.g UA400000000000000'} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className={cn('grid w-full gap-3', [isConnected ? 'grid-cols-2' : 'grid-cols-1'])}>
          {isConnected ? (
            <>
              <Button
                type='reset'
                size='lg'
                className='w-full'
                variant='secondary'
                onClick={closeModal}
              >
                {t('BUTTON.CANCEL')}
              </Button>
              <Button type='submit' size='lg' className='w-full' isLoading={isLoading}>
                {t('BUTTON.CREATE')}
              </Button>
            </>
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

export default CreateBondForm;
