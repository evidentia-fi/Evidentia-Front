import React, { ButtonHTMLAttributes } from 'react';

import { WalletMetamask, WalletWalletConnect } from '@web3icons/react';
import { Wallet } from 'lucide-react';

import { cn } from '@workspace/ui/lib/utils';

interface IWalletRowProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  wallet?: string;
  urlIcon?: string;
}

const WalletSelect = ({ className, children, wallet, urlIcon, ...rest }: IWalletRowProps) => {
  const icon = {
    injected: <Wallet size={24} />,
    metaMaskSDK: <WalletMetamask size={24} />,
    walletConnect: <WalletWalletConnect size={24} />,
  };

  return (
    <button
      className={cn(
        'flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2 text-left font-semibold text-gray-700 disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...rest}
    >
      {wallet && !urlIcon && icon[wallet as keyof typeof icon]}
      {wallet && urlIcon && <img src={urlIcon} alt={wallet} className='size-6' />}
      {children}
    </button>
  );
};

export default WalletSelect;
