'use client';

import React, { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';

import { isTestnet } from '@workspace/utils/config';

type TronWebType = any;

const TronWebContext = createContext<TronWebType | null>(null);

export const TronWebProvider = ({ children }: PropsWithChildren) => {
  const [tronWeb, setTronWeb] = useState<TronWebType>();

  useEffect(() => {
    const loadTronWeb = async () => {
      const { TronWeb } = await require('tronweb');

      const instance = new TronWeb({
        fullHost: isTestnet ? 'https://api.shasta.trongrid.io' : 'https://api.trongrid.io',
      });

      setTronWeb(instance);
    };

    loadTronWeb();
  }, []);

  if (!tronWeb) {
    return null;
  }
  return <TronWebContext.Provider value={tronWeb}>{children}</TronWebContext.Provider>;
};

export const useTronWeb = () => {
  const context = useContext(TronWebContext);
  if (context === null) {
    throw new Error('useTronWeb must be used within a TronWebProvider');
  }
  return context;
};
