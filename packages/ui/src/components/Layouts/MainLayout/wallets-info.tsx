'use client';

import React from 'react';

import { Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import WalletInfo from '@workspace/ui/components/Layouts/MainLayout/wallet';
import { Button } from '@workspace/ui/components/button';
import { useAccount } from '@workspace/ui/providers/account-provider';
import { useStake } from '@workspace/ui/providers/stake-provider';
import { useTronToken } from '@workspace/ui/stores/use-tron';

import { numberFormat } from '@workspace/utils/constants';

interface WalletsInfoProps {
  variant: 'desktop' | 'mobile';
}

const WalletsInfo = ({ variant }: WalletsInfoProps) => {
  const { t } = useTranslation();
  const {
    address,
    addressTron,
    isConnected,
    connect,
    networkName,
    symbol: networkSymbol,
    isConnectedTron,
    addAsset,
    addAssetToTonLink,
  } = useAccount();

  const { tronTokenBalance } = useTronToken(s => ({ tronTokenBalance: s.tokenBalance }));
  const { stakedAmount, balance, symbol, decimals } = useStake();

  const content = (
    <>
      {isConnected && (
        <WalletInfo
          address={address!}
          networkName={networkName!}
          networkSymbol={networkSymbol!}
          symbol={symbol}
          decimals={decimals}
          addAsset={addAsset}
          balances={[
            { label: t('WALLET_INFO.BALANCE'), value: `${numberFormat(balance)} ${symbol}`, id: 1 },
            {
              label: t('WALLET_INFO.STAKED_BALANCE'),
              value: `${numberFormat(stakedAmount)} ${symbol}`,
              id: 2,
            },
          ]}
        />
      )}
      {isConnectedTron && (
        <WalletInfo
          address={addressTron!}
          networkName='Tron'
          networkSymbol='TRX'
          symbol='TRX'
          decimals={6}
          addAsset={addAssetToTonLink}
          balances={[
            {
              label: t('WALLET_INFO.BALANCE'),
              value: `${numberFormat(tronTokenBalance)} TRX`,
              id: 1,
            },
          ]}
        />
      )}
      {!isConnected && !isConnectedTron && (
        <div
          className={
            variant === 'mobile'
              ? 'flex h-full flex-col items-center justify-center gap-4 pt-10 text-center'
              : 'mt-14 flex flex-col items-center gap-3'
          }
        >
          <div
            className={`flex size-12 items-center justify-center rounded-full border ${variant === 'mobile' ? 'bg-gray-50' : 'border-gray-200'}`}
          >
            <Wallet className='stroke-brand-600' size={24} />
          </div>
          <p className='max-w-[160px] text-center text-sm text-gray-500'>
            {t('WALLET_INFO.NO_ACCOUNT.DESCRIPTION')}
          </p>
        </div>
      )}
    </>
  );

  if (variant === 'desktop') {
    return (
      <div className='bg-gray-25 fixed right-0 top-[72px] hidden h-[calc(100%-72px)] w-[280px] border-l p-4 lg:block'>
        <div className='flex items-center justify-between'>
          <h3 className='text-xl font-medium'> {t('WALLET_INFO.TITLE')}</h3>
          <Button variant='secondary' size='sm' onClick={connect}>
            {t('ACCOUNT.WALLETS')}
          </Button>
        </div>
        <div className='mt-5 space-y-5'>{content}</div>
      </div>
    );
  }

  return <div className='space-y-5'>{content}</div>;
};

export default WalletsInfo;
