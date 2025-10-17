import React from 'react';

import { TokenIcon } from '@web3icons/react';
import { Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@workspace/ui/components/button';
import CopyToClipboard from '@workspace/ui/components/copy-to-clipboard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { useAccount } from '@workspace/ui/providers/account-provider';
import { Emodal, useModalState } from '@workspace/ui/stores/use-modal-state';

import { shortAddress } from '@workspace/utils/constants';

const ConnectButton = () => {
  const { t } = useTranslation();
  const openModal = useModalState(s => s.openModal);
  const { address, isConnected, networkName, symbol, disconnect } = useAccount();

  return isConnected ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <Wallet />
          {t('ACCOUNT.CONNECTED')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[318px] p-4'>
        <div className='flex items-center justify-between'>
          <DropdownMenuLabel className='text-xl'>{t('WALLET_INFO.TITLE')}</DropdownMenuLabel>
          <Button variant='secondary' onClick={disconnect}>
            {t('ACCOUNT.DISCONNECT')}
          </Button>
        </div>
        <div className='mt-6 flex items-center justify-between rounded-full border bg-white px-3.5 py-2.5 shadow-sm'>
          <div className='flex items-center gap-2'>
            <TokenIcon symbol={symbol!} variant='branded' size='24' />
            <div>
              <h5 className='font-medium text-gray-900'>{networkName}</h5>
              <p className='text-sm text-gray-600'>{shortAddress(address)}</p>
            </div>
          </div>
          <CopyToClipboard textToCopy={address as string} />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Button onClick={() => openModal(Emodal.WalletConnect)}>Connect</Button>
  );
};

export default ConnectButton;
