'use client';

import React from 'react';

import { useTranslation } from 'react-i18next';

import { Card } from '@workspace/ui/components/card';
import BridgeHistory from '@workspace/ui/modules/Bridge/bridge-history';
import { NativeBridgeForm } from '@workspace/ui/modules/Forms/native-bridge';
import { useAccount } from '@workspace/ui/providers/account-provider';
import { useStable } from '@workspace/ui/providers/stable-provider';

const BridgeContent = () => {
  const { t } = useTranslation();
  const { symbol } = useStable();

  const { isConnected } = useAccount();

  return (
    <div className='flex flex-col gap-y-4'>
      <Card className='gap-y-3'>
        <h2 className='text-md font-semibold text-gray-800 md:text-lg'>
          {t('DASHBOARD.NATIVE_BRIDGE.TITLE', { symbol })}
        </h2>
        <NativeBridgeForm />
      </Card>
      {isConnected && <BridgeHistory />}
    </div>
  );
};

export default BridgeContent;
