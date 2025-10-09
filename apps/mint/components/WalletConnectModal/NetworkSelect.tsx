import React from 'react';

import WalletSelect from '@/components/WalletConnectModal/WalletSelect';
import { TokenIcon } from '@web3icons/react';
import { LogOut } from 'lucide-react';

import { shortAddress } from '@workspace/utils/constants';

interface INetworkSelectProps {
  name: string;
  symbol: string;
  open: () => void;
  isConnected: boolean;
  address?: string | null;
  disconnect: () => Promise<void>;
}

const NetworkSelect = ({
  name,
  symbol,
  open,
  disconnect,
  isConnected,
  address,
}: INetworkSelectProps) => {
  return (
    <WalletSelect
      key={symbol}
      onClick={() => {
        if (!isConnected) {
          open();
        }
      }}
    >
      {isConnected ? (
        <div className='flex w-full items-center justify-between'>
          <p className='flex items-center gap-2'>
            <TokenIcon symbol={symbol} variant='branded' />
            <span>{shortAddress(address)}</span>
          </p>
          <LogOut
            onClick={async e => {
              e.stopPropagation();
              await disconnect();
            }}
            size={16}
          />
        </div>
      ) : (
        <>
          <TokenIcon symbol={symbol} variant='branded' />
          {name}
        </>
      )}
    </WalletSelect>
  );
};

export default NetworkSelect;
