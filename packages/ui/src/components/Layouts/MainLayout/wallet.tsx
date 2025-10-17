import React from 'react';

import { TokenIcon } from '@web3icons/react';

import CopyToClipboard from '@workspace/ui/components/copy-to-clipboard';
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/components/tooltip';
import { cn } from '@workspace/ui/lib/utils';

interface IWalletProps {
  address: string | null;
  networkName: string;
  networkSymbol: string | null;
  symbol: string;
  decimals: number;
  addAsset: (params: { symbol: string; decimals: number }) => void;
  balances: {
    label: string;
    value: string;
    id: number;
  }[];
}

// [
//   {
//     label: t('WALLET_INFO.BALANCE'),
//     value: `${numberFormat(balance)} ${symbol}`,
//     id: 1,
//   },
//   {
//     label: t('WALLET_INFO.STAKED_BALANCE'),
//     value: `${numberFormat(stakedAmount)} ${symbol}`,
//     id: 2,
//   },
// ]

const WalletInfo = ({
  networkName,
  networkSymbol,
  address,
  symbol,
  balances,
  decimals,
  addAsset,
}: IWalletProps) => {
  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  return (
    <>
      <div className='flex items-center justify-between rounded-full border bg-white px-3.5 py-2.5 shadow-sm'>
        <div className='flex items-center gap-2'>
          <TokenIcon symbol={networkSymbol!} variant='branded' size='24' />
          <div>
            <h5 className='font-medium text-gray-900'>{networkName}</h5>
            <p className='text-sm text-gray-600'>{shortAddress}</p>
          </div>
        </div>
        <CopyToClipboard textToCopy={address as string} />
      </div>
      <div className='grid grid-cols-2 gap-2'>
        {balances.map(item => (
          <div
            className='b flex flex-col items-center justify-between gap-2 rounded-md border bg-white px-2 py-4 text-center'
            key={item.id}
          >
            {item.id === 1 ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={cn('text-brand-600 cursor-pointer text-sm font-semibold underline')}
                    onClick={() =>
                      addAsset({
                        symbol,
                        decimals,
                      })
                    }
                  >
                    {item.value}
                  </button>
                </TooltipTrigger>
                <TooltipContent>Add token to wallet</TooltipContent>
              </Tooltip>
            ) : (
              <p className={cn('text-sm font-semibold text-gray-600')}>{item.value}</p>
            )}
            <h6 className='text-xs text-gray-500'>{item.label}</h6>
          </div>
        ))}
      </div>
    </>
  );
};

export default WalletInfo;
